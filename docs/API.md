# API Документация

## Обзор

Todo App API предоставляет RESTful интерфейс для аутентификации пользователей и управления задачами. API построен на Express.js с использованием TypeScript и PostgreSQL.

## Базовый URL

```
http://localhost:5000
```

## Аутентификация

API использует JWT (JSON Web Tokens) для аутентификации. Токены передаются в заголовке `Authorization`:

```
Authorization: Bearer <access_token>
```

### Типы токенов

- **Access Token**: Короткоживущий токен (1 минута) для доступа к защищенным ресурсам
- **Refresh Token**: Долгоживущий токен (7 дней) для обновления access токена

## Endpoints

### Аутентификация

#### POST /auth/register

Регистрация нового пользователя.

**Запрос:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ (успех):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Ответ (ошибка):**
```json
{
  "error": "User already exists"
}
```

**Коды ответов:**
- `200` - Успешная регистрация
- `400` - Пользователь уже существует или неверные данные

---

#### POST /auth/login

Вход в систему.

**Запрос:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ (успех):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

**Ответ (ошибка):**
```json
{
  "error": "Incorrect login or password"
}
```

**Коды ответов:**
- `200` - Успешный вход
- `400` - Неверные учетные данные

**Примечание:** Refresh токен устанавливается в HttpOnly cookie.

---

#### POST /auth/token

Обновление access токена с помощью refresh токена.

**Запрос:**
```
Cookie: refreshToken=<refresh_token>
```

**Ответ (успех):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Коды ответов:**
- `200` - Токен успешно обновлен
- `401` - Refresh токен отсутствует
- `403` - Недействительный refresh токен

---

#### POST /auth/logout

Выход из системы.

**Запрос:**
```
Cookie: refreshToken=<refresh_token>
```

**Коды ответов:**
- `204` - Успешный выход

---

### Задачи

Все endpoints задач требуют аутентификации.

#### GET /todo

Получить все задачи текущего пользователя.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Ответ (успех):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Задача 1",
    "description": "Описание задачи",
    "created_at": 1640995200000,
    "updated_at": "2024-01-01T00:00:00.000Z",
    "deadline_date": 1641081600000,
    "status": "todo",
    "priority": 3,
    "color": "#FF5722",
    "user_id": 1
  }
]
```

**Коды ответов:**
- `200` - Успешное получение задач
- `401` - Не авторизован
- `500` - Ошибка сервера

---

#### POST /todo

Создать новую задачу.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Запрос:**
```json
{
  "title": "Новая задача",
  "description": "Описание новой задачи",
  "createdAt": 1640995200000,
  "deadlineDate": 1641081600000,
  "status": "todo",
  "priority": 3,
  "color": "#FF5722"
}
```

**Ответ (успех):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Новая задача",
  "description": "Описание новой задачи",
  "created_at": 1640995200000,
  "updated_at": "2024-01-01T00:00:00.000Z",
  "deadline_date": 1641081600000,
  "status": "todo",
  "priority": 3,
  "color": "#FF5722",
  "user_id": 1
}
```

**Коды ответов:**
- `201` - Задача успешно создана
- `401` - Не авторизован
- `500` - Ошибка сервера

---

#### GET /todo/:id

Получить задачу по ID.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Параметры:**
- `id` (string) - UUID задачи

**Ответ (успех):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Задача 1",
  "description": "Описание задачи",
  "created_at": 1640995200000,
  "updated_at": "2024-01-01T00:00:00.000Z",
  "deadline_date": 1641081600000,
  "status": "todo",
  "priority": 3,
  "color": "#FF5722",
  "user_id": 1
}
```

**Ответ (ошибка):**
```json
{
  "error": "Task not found"
}
```

**Коды ответов:**
- `200` - Задача найдена
- `401` - Не авторизован
- `404` - Задача не найдена
- `500` - Ошибка сервера

---

#### PUT /todo/:id

Обновить существующую задачу.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Параметры:**
- `id` (string) - UUID задачи

**Запрос:**
```json
{
  "title": "Обновленная задача",
  "description": "Новое описание",
  "deadlineDate": 1641168000000,
  "status": "in progress",
  "priority": 4,
  "color": "#4CAF50"
}
```

**Ответ (успех):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Обновленная задача",
  "description": "Новое описание",
  "created_at": 1640995200000,
  "updated_at": "2024-01-01T12:00:00.000Z",
  "deadline_date": 1641168000000,
  "status": "in progress",
  "priority": 4,
  "color": "#4CAF50",
  "user_id": 1
}
```

**Ответ (ошибка):**
```json
{
  "error": "Task not found"
}
```

**Коды ответов:**
- `200` - Задача успешно обновлена
- `401` - Не авторизован
- `404` - Задача не найдена
- `500` - Ошибка сервера

---

#### DELETE /todo/:id

Удалить задачу.

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Параметры:**
- `id` (string) - UUID задачи

**Ответ (успех):**
```json
{
  "message": "Task deleted",
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Удаленная задача",
    "description": "Описание",
    "created_at": 1640995200000,
    "updated_at": "2024-01-01T00:00:00.000Z",
    "deadline_date": 1641081600000,
    "status": "todo",
    "priority": 3,
    "color": "#FF5722",
    "user_id": 1
  }
}
```

**Коды ответов:**
- `200` - Задача успешно удалена
- `401` - Не авторизован
- `500` - Ошибка сервера

---

## Модели данных

### User (Пользователь)

```typescript
interface User {
  id: number;
  email: string;
  password: string; // Хешированный пароль
  created_at: Date;
}
```

### Task (Задача)

```typescript
interface Task {
  id: string; // UUID
  title: string;
  description: string;
  created_at: number; // Unix timestamp
  updated_at: Date;
  deadline_date: number; // Unix timestamp
  status: 'todo' | 'in progress' | 'done';
  priority: number; // 1-5
  color: string; // HEX цвет
  user_id: number;
}
```

### RefreshToken

```typescript
interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  created_at: Date;
}
```

## Коды ошибок

| Код | Описание |
|-----|----------|
| 200 | OK - Успешный запрос |
| 201 | Created - Ресурс создан |
| 204 | No Content - Успешный запрос без содержимого |
| 400 | Bad Request - Неверные данные запроса |
| 401 | Unauthorized - Требуется аутентификация |
| 403 | Forbidden - Доступ запрещен |
| 404 | Not Found - Ресурс не найден |
| 500 | Internal Server Error - Внутренняя ошибка сервера |

## Примеры использования

### JavaScript/TypeScript

```typescript
// Аутентификация
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:5000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  return data;
};

// Получение задач
const getTasks = async (accessToken: string) => {
  const response = await fetch('http://localhost:5000/todo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  const tasks = await response.json();
  return tasks;
};

// Создание задачи
const createTask = async (accessToken: string, taskData: any) => {
  const response = await fetch('http://localhost:5000/todo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(taskData),
  });
  
  const newTask = await response.json();
  return newTask;
};
```

### cURL

```bash
# Регистрация
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Вход
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Получение задач
curl -X GET http://localhost:5000/todo \
  -H "Authorization: Bearer <access_token>"

# Создание задачи
curl -X POST http://localhost:5000/todo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "title":"Новая задача",
    "description":"Описание",
    "createdAt":1640995200000,
    "deadlineDate":1641081600000,
    "status":"todo",
    "priority":3,
    "color":"#FF5722"
  }'
```

## Безопасность

### CORS

API настроен для работы с фронтендом на `http://localhost:3001`:

```typescript
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true 
};
```

### Валидация

- Все входные данные валидируются
- SQL инъекции предотвращены параметризованными запросами
- Пароли хешируются с bcrypt (salt rounds: 10)

### Токены

- Access токены имеют короткое время жизни (1 минута)
- Refresh токены хранятся в HttpOnly cookies
- Автоматическое обновление токенов

## Rate Limiting

В production рекомендуется добавить rate limiting для предотвращения злоупотреблений:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
});

app.use('/auth', limiter);
```

## Мониторинг

Рекомендуется добавить логирование и мониторинг:

- Логирование всех запросов
- Мониторинг производительности
- Алерты при ошибках
- Метрики использования API
