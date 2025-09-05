# Аутентификация - Документация

## Обзор

Todo App использует JWT (JSON Web Tokens) для аутентификации с двухуровневой системой токенов:
- **Access Token** - короткоживущий токен (1 минута) для доступа к API
- **Refresh Token** - долгоживущий токен (7 дней) для обновления access токена

## Архитектура аутентификации

### Хранение токенов

#### Access Token
- **Место хранения**: `localStorage` в браузере
- **Доступ**: JavaScript код имеет полный доступ
- **Время жизни**: 1 минута
- **Использование**: Передается в заголовке `Authorization: Bearer <token>`

#### Refresh Token
- **Место хранения**: HttpOnly cookies на сервере
- **Доступ**: Только сервер, JavaScript не имеет доступа
- **Время жизни**: 7 дней
- **Использование**: Автоматически отправляется с каждым запросом

### Безопасность

#### Преимущества HttpOnly cookies для refresh токена:
1. **Защита от XSS** - JavaScript не может получить доступ к токену
2. **Автоматическая отправка** - браузер автоматически включает cookies в запросы
3. **Защита от CSRF** - SameSite атрибут предотвращает межсайтовые атаки

#### Настройки cookies:
```typescript
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,        // Недоступен для JavaScript
  sameSite: 'strict',    // Защита от CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
});
```

## Поток аутентификации

### 1. Вход в систему (Login)

```typescript
// Frontend
const { accessToken } = await api.login(email, password);
localStorage.setItem('accessToken', accessToken);
setAuthToken(accessToken);
```

```typescript
// Backend
const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: "1m" });
const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

// Сохранение refresh токена в БД
await pool.query('INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)', [user.id, refreshToken]);

// Установка HttpOnly cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

res.json({ accessToken });
```

### 2. Обновление токена (Token Refresh)

```typescript
// Axios interceptor автоматически обрабатывает 401 ошибки
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Запрос на обновление токена (refresh токен в cookies)
        const response = await axiosInstance.post('/auth/token');
        const newAccessToken = response.data.accessToken;
        
        // Обновляем access токен
        localStorage.setItem('accessToken', newAccessToken);
        
        // Повторяем оригинальный запрос
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        // Refresh токен недействителен - перенаправляем на вход
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. Выход из системы (Logout)

```typescript
// Frontend
await api.logout();
localStorage.removeItem('accessToken');
setAuthToken('');
```

```typescript
// Backend
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.cookies;
  
  // Удаляем refresh токен из БД
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  
  // Очищаем cookie
  res.clearCookie('refreshToken');
  res.sendStatus(204);
});
```

## Zustand Store для аутентификации

### Состояние
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
}
```

### Действия
```typescript
interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
  clearSuccess: () => void;
}
```

### Использование в компонентах
```typescript
const { 
  user, 
  isAuthenticated, 
  loading, 
  error, 
  handleLogin, 
  handleLogout 
} = useAuth();
```

## API Endpoints

### POST /auth/login
- **Входные данные**: `{ email, password }`
- **Ответ**: `{ accessToken }`
- **Cookies**: Устанавливает `refreshToken` HttpOnly cookie

### POST /auth/register
- **Входные данные**: `{ email, password }`
- **Ответ**: `{ accessToken }`
- **Cookies**: Устанавливает `refreshToken` HttpOnly cookie

### POST /auth/token
- **Входные данные**: Refresh токен из cookies
- **Ответ**: `{ accessToken }`
- **Использование**: Автоматическое обновление токена

### POST /auth/logout
- **Входные данные**: Refresh токен из cookies
- **Ответ**: `204 No Content`
- **Действие**: Удаляет refresh токен из БД и cookies

## Защищенные маршруты

### ProtectedRoute компонент
```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
```

### PublicRoute компонент
```typescript
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/board" replace />;
};
```

## Проверка аутентификации при загрузке

```typescript
// App.tsx
useEffect(() => {
  checkAuth(); // Проверяем наличие access токена
}, [checkAuth]);

// authStore.ts
checkAuth: () => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (accessToken) {
    setAuthToken(accessToken);
    set({ 
      isAuthenticated: true,
      user: { id: 1, email: 'user@example.com' }
    });
  } else {
    set({ 
      isAuthenticated: false,
      user: null
    });
  }
}
```

## Обработка ошибок

### Типы ошибок
1. **401 Unauthorized** - Access токен истек или недействителен
2. **403 Forbidden** - Refresh токен недействителен
3. **400 Bad Request** - Неверные учетные данные

### Автоматическое восстановление
- При 401 ошибке автоматически пытается обновить токен
- При неудачном обновлении перенаправляет на страницу входа
- Показывает пользователю соответствующие сообщения об ошибках

## Безопасность

### Рекомендации
1. **HTTPS** - Всегда используйте HTTPS в production
2. **SameSite cookies** - Настройте SameSite атрибут для защиты от CSRF
3. **CORS** - Настройте CORS для разрешенных доменов
4. **Rate limiting** - Ограничьте количество попыток входа
5. **Валидация** - Валидируйте все входные данные

### Мониторинг
- Логируйте все попытки входа
- Отслеживайте подозрительную активность
- Мониторьте использование refresh токенов

## Troubleshooting

### Частые проблемы

1. **Токен не обновляется**
   - Проверьте настройки cookies
   - Убедитесь, что `withCredentials: true` в axios

2. **Бесконечный цикл обновления токена**
   - Проверьте логику в axios interceptor
   - Убедитесь, что refresh токен действителен

3. **Пользователь не остается авторизованным**
   - Проверьте время жизни токенов
   - Убедитесь, что refresh токен сохраняется в cookies

### Отладка
```typescript
// Включите логирование в axios interceptor
console.log('Access token expired, attempting refresh...');
console.log('Refresh successful, retrying original request...');
console.log('Refresh failed, redirecting to login...');
```
