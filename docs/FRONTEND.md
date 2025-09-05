# Frontend - Документация

## Обзор

Frontend приложения Todo App построен на React 19 с TypeScript и использует современные инструменты разработки. Приложение предоставляет интуитивно понятный пользовательский интерфейс для управления задачами.

## Структура проекта

```
FE/
├── src/
│   ├── main.tsx             # Точка входа приложения
│   ├── App.tsx              # Главный компонент
│   ├── index.css            # Глобальные стили
│   ├── pages/               # Страницы приложения
│   │   ├── Login/           # Страница входа
│   │   ├── Registration/    # Страница регистрации
│   │   └── Board/           # Главная страница с задачами
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── Header/          # Шапка приложения
│   │   ├── List/            # Список задач
│   │   ├── Notion/          # Создание задач
│   │   ├── DialogWindow/    # Модальные окна
│   │   └── EditableText/    # Редактируемый текст
│   ├── hooks/               # Пользовательские хуки
│   │   ├── useAuth.ts       # Аутентификация
│   │   ├── useGetTodos.ts   # Получение задач
│   │   ├── useCreateTodo.ts # Создание задач
│   │   ├── useUpdateTodo.ts # Обновление задач
│   │   └── useDeleteTodo.ts # Удаление задач
│   ├── api/                 # API клиент
│   │   ├── api.ts           # API методы
│   │   └── axiosInstance.ts # Конфигурация Axios
│   ├── router/              # Маршрутизация
│   │   └── index.tsx        # Конфигурация роутера
│   └── types/               # TypeScript типы
│       ├── index.ts         # Основные типы
│       └── axios.d.ts       # Типы для Axios
├── public/                  # Статические файлы
├── package.json
├── vite.config.ts           # Конфигурация Vite
└── tsconfig.json           # Конфигурация TypeScript
```

## Основные компоненты

### 1. Точка входа (src/main.tsx)

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 2. Главный компонент (src/App.tsx)

```typescript
import AppRoutes from './router';

function App() {
  return (
    <>
      <AppRoutes/>
    </>
  )
}

export default App
```

### 3. Маршрутизация (src/router/index.tsx)

```typescript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const LazyLogin = React.lazy(() => import('../pages/Login'));
const LazyRegistration = React.lazy(() => import('../pages/Registration'));
const LazyBoard = React.lazy(() => import('../pages/Board'));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LazyLogin />} />
        <Route path="/registration" element={<LazyRegistration />} />
        <Route path="/board" element={<LazyBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
```

## Страницы

### 1. Страница входа (src/pages/Login/index.tsx)

Компонент для аутентификации пользователей:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, success, handleLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
    if (success) {
      navigate('/board');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Вход
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        {error && <Typography color="error" align="center">{error}</Typography>}
        {success && <Typography color="success" align="center">{success}</Typography>}
      </Paper>
    </Box>
  );
};

export default Login;
```

### 2. Страница регистрации (src/pages/Registration/index.tsx)

Аналогичная структура для регистрации новых пользователей.

### 3. Главная страница (src/pages/Board/index.tsx)

```typescript
import { List } from '../../components/List';
import { Notion } from '../../components/Notion'
import { useGetTodos, useDeleteTodo } from "../../hooks"
import { Header } from '../../components/Header';

const Board = () => {
  const [todos, isLoading, error] = useGetTodos();
  const { deleteData } = useDeleteTodo();

  if (isLoading) return 'Loading'
  if (todos === null) return 'content is empty'
  if (error) return error

  return (
    <>
      <Header/>
      <Notion/>
      <List data={todos} deleteData={deleteData}/>
    </>
  )
}

export default Board;
```

## Компоненты

### 1. Хук аутентификации (src/hooks/useAuth.ts)

```typescript
import axios from 'axios';
import { useState } from 'react';
import { setAuthToken } from '../api/api';
import api from '../api/api'

interface AuthHookResult {
  loading: boolean;
  error: string;
  success: string;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (email: string, password: string, confirmPassword: string) => Promise<void>;
}

export function useAuth(): AuthHookResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleLogin = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { accessToken, refreshToken } = await api.login(email, password);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAuthToken(accessToken);

      setSuccess('Login success!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message || 'Неверный email или пароль.');
        } else {
          setError('Нет ответа от сервера. Проверьте ваше подключение.');
        }
      } else {
        setError('Произошла непредвиденная ошибка. Попробуйте снова.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, confirmPassword: string): Promise<void> => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают!');
      setLoading(false);
      return;
    }

    try {
      const { accessToken, refreshToken } = await api.register({ email, password });

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAuthToken(accessToken);

      setSuccess('Registration is success!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message || 'Неверный email или пароль.');
        } else {
          setError('Нет ответа от сервера. Проверьте ваше подключение.');
        }
      } else {
        setError('Произошла непредвиденная ошибка.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, handleLogin, handleRegister };
}
```

### 2. API клиент (src/api/api.ts)

```typescript
import axiosInstance from './axiosInstance';

const api = {
  // Аутентификация
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post('/auth/token');
    return response.data;
  },

  // Задачи
  getTodos: async () => {
    const response = await axiosInstance.get('/todo');
    return response.data;
  },

  createTodo: async (data: any) => {
    const response = await axiosInstance.post('/todo', data);
    return response.data;
  },

  updateTodo: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/todo/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: string) => {
    const response = await axiosInstance.delete(`/todo/${id}`);
    return response.data;
  }
};

export default api;
```

### 3. Конфигурация Axios (src/api/axiosInstance.ts)

```typescript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  withCredentials: true,
});

// Интерцептор для добавления токена к запросам
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок аутентификации
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axiosInstance.post('/auth/token');
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          
          // Повторяем оригинальный запрос с новым токеном
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance.request(error.config);
        }
      } catch (refreshError) {
        // Если refresh токен недействителен, перенаправляем на страницу входа
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

## TypeScript типы

### Основные типы (src/types/index.ts)

```typescript
export enum priorityTaskEnum {
  IN_PROGRES = 'in progress',
  DONE = 'done',
  TODO = 'todo',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: string;
  deadlineDate: number;
  status: priorityTaskEnum
  priority: number;
  color: string;
  userId: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
}
```

## Хуки для работы с данными

### 1. Получение задач (src/hooks/useGetTodos.ts)

```typescript
import { useState, useEffect } from 'react';
import api from '../api/api';
import { Task } from '../types';

export const useGetTodos = (): [Task[] | null, boolean, string] => {
  const [todos, setTodos] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const data = await api.getTodos();
        setTodos(data);
        setError('');
      } catch (err) {
        setError('Ошибка при загрузке задач');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return [todos, isLoading, error];
};
```

### 2. Создание задач (src/hooks/useCreateTodo.ts)

```typescript
import { useState } from 'react';
import api from '../api/api';

export const useCreateTodo = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const createTodo = async (todoData: any) => {
    try {
      setIsLoading(true);
      setError('');
      const newTodo = await api.createTodo(todoData);
      return newTodo;
    } catch (err) {
      setError('Ошибка при создании задачи');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTodo, isLoading, error };
};
```

## UI компоненты

### Material-UI интеграция

Приложение использует Material-UI для создания современного и отзывчивого интерфейса:

```typescript
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon
} from '@mui/icons-material';
```

## Состояние приложения

### Управление состоянием

Приложение использует React хуки для управления состоянием:

- `useState` для локального состояния компонентов
- `useEffect` для побочных эффектов
- Пользовательские хуки для логики работы с API
- localStorage для хранения токенов аутентификации

### Аутентификация

```typescript
// Установка токена в заголовки
export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};
```

## Сборка и развертывание

### Development режим

```bash
npm run dev
```

### Production сборка

```bash
npm run build
```

### Предварительный просмотр

```bash
npm run preview
```

## Конфигурация

### Vite (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Тестирование

### ESLint конфигурация

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

## Производительность

### Оптимизации

- Lazy loading для страниц
- Мемоизация компонентов с React.memo
- Оптимизация ре-рендеров
- Код-сплиттинг с динамическими импортами

### Bundle анализ

```bash
npm run build -- --analyze
```

## Безопасность

### Защита от XSS

- Санитизация пользовательского ввода
- Использование безопасных методов рендеринга
- CSP заголовки

### Аутентификация

- JWT токены в localStorage
- Автоматическое обновление токенов
- Защищенные маршруты
