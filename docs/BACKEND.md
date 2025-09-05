# Backend API - Документация

## Обзор

Backend приложения Todo App построен на Node.js с использованием Express.js и TypeScript. API предоставляет RESTful интерфейс для аутентификации пользователей и управления задачами.

## Структура проекта

```
BE/
├── src/
│   ├── index.ts              # Точка входа приложения
│   ├── routes/               # API маршруты
│   │   ├── auth.ts          # Маршруты аутентификации
│   │   └── tasks.ts         # Маршруты задач
│   ├── middleware/          # Промежуточное ПО
│   │   └── authMiddleware.ts # Middleware аутентификации
│   ├── db/                  # База данных
│   │   ├── index.ts         # Подключение к БД
│   │   ├── login/           # SQL запросы для аутентификации
│   │   └── tasks/           # SQL запросы для задач
│   ├── types/               # TypeScript типы
│   │   └── index.ts
│   └── utils/               # Утилиты
│       └── index.ts
├── package.json
└── tsconfig.json
```

## Основные компоненты

### 1. Точка входа (src/index.ts)

```typescript
import { Response } from 'express';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');
const todoRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');

const PORT = process.env.PORT || 5000;
const app = express();

// CORS конфигурация
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true 
};

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Маршруты
app.use("/auth", authRouter);
app.use('/todo', authMiddleware, todoRouter);

// Обработка ошибок
app.use((err: Error, res: Response) => {
  console.error('An error has occurred:', err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
    console.log(`server start on ${PORT}`)
});
```

### 2. Аутентификация (src/routes/auth.ts)

#### Регистрация пользователя
```typescript
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = getQuery('../db/login/create_user.sql');
    const result = await pool.query(query, [email, hashedPassword]);	
    
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists" });
  }
});
```

#### Вход в систему
```typescript
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const userQuery = getQuery('../db/login/get_user.sql');
  const result = await pool.query(userQuery, [email]);	
  
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: "Incorrect login or password" });
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "Incorrect login or password" });
  
  // Генерация токенов
  const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_SECRET, { expiresIn: "1m" });
  const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
  
  // Сохранение refresh токена в БД
  const refreshTokensQuery = getQuery('../db/login/create_refresh_token.sql');
  await pool.query(refreshTokensQuery, [user.id, refreshToken]);	
  
  // Установка cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
  });
  
  res.status(200).json({
    accessToken: accessToken,
    message: 'Login successful'
  });
});
```

#### Обновление токена
```typescript
router.post("/token", async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  
  if (!refreshToken) return res.sendStatus(401);
  
  const query = getQuery('../db/login/get_refresh_token.sql');
  const result = await pool.query(query, [refreshToken]);
  
  if (result.rows.length === 0) return res.sendStatus(403);
  
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err: Error | null, user: UserAuthDataType) => {
    if (err) return res.sendStatus(403);
    
    const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_SECRET, { expiresIn: "1m" });
    res.json({ accessToken });
  });
});
```

### 3. Управление задачами (src/routes/tasks.ts)

#### Получение всех задач
```typescript
router.get('/', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const { userId } = req.user;
    const query = getQuery('../db/tasks/get_tasks.sql');
    const result = await pool.query(query, [userId]);	
    
    res.status(200).send(result.rows)
  } catch (err: unknown) {
    if(err instanceof Error) {
      console.error("Server Error: " + err.message);
    } else {
      console.error("An unknown error occurred:", err);
    }
    return res.status(500).send('Server Error'); 
  }
});
```

#### Создание задачи
```typescript
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, createdAt, deadlineDate, status, priority, color } = req.body;
    const { userId } = req.user;
    const id = crypto.randomUUID();
    
    const query = getQuery('../db/tasks/insert_task.sql');
    const result = await pool.query(query, [id, title, description, createdAt, deadlineDate, status, priority, color, userId]);
    
    return res.status(201).json(result.rows[0]); 
  } catch (err: unknown) {
    if(err instanceof Error) {
      console.error("Server Error: " + err.message);
    } else {
      console.error("An unknown error occurred:", err);
    }
    return res.status(500).send('Server Error'); 
  }
});
```

#### Обновление задачи
```typescript
router.put("/:id", async (req: Request, res: Response) => {
  try{
    const { id } = req.params;
    const { userId } = req.user;
    const { title, description, deadlineDate, status, priority, color } = req.body;
    
    const query = getQuery('../../db/tasks/update_task.sql');    
    const result = await pool.query(query, [title, description, deadlineDate, status, priority, color, id, userId]);	
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (err: unknown) {
    if(err instanceof Error) {
      console.error("Server Error: " + err.message);
    } else {
      console.error("An unknown error occurred:", err);
    }
    return res.status(500).send('Server Error'); 
  }
});
```

#### Удаление задачи
```typescript
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    const query = getQuery('../../db/tasks/delete_task.sql');    
    const result = await pool.query(query, [id, userId]);	
    
    res.json({ message: 'Task deleted', task: result.rows[0] });
  } catch (err: unknown) {
    if(err instanceof Error) {
      console.error("Server Error: " + err.message);
    } else {
      console.error("An unknown error occurred:", err);
    }
    return res.status(500).send('Server Error'); 
  }
});
```

### 4. Middleware аутентификации (src/middleware/authMiddleware.ts)

```typescript
const jwt = require('jsonwebtoken');
const pool = require('../db');

const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

## База данных

### Структура таблиц

#### Пользователи (users)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Задачи (tasks)
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at BIGINT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline_date BIGINT,
  status VARCHAR(50) NOT NULL,
  priority INTEGER NOT NULL,
  color VARCHAR(7),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

#### Refresh токены (refresh_tokens)
```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Безопасность

### Аутентификация
- JWT токены с коротким временем жизни (1 минута для access)
- Refresh токены с длительным временем жизни (7 дней)
- Refresh токены хранятся в HttpOnly cookies
- Хеширование паролей с bcrypt (salt rounds: 10)

### CORS
```typescript
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true 
};
```

### Валидация
- Проверка входных данных
- Санитизация SQL запросов через параметризованные запросы
- Обработка ошибок

## Переменные окружения

```env
PORT=5000
ACCESS_SECRET=your_access_secret_key
REFRESH_SECRET=your_refresh_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todoapp
DB_USER=your_username
DB_PASSWORD=your_password
```

## Запуск и разработка

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для production
```bash
npm run build
npm start
```

## API Endpoints

| Метод | Endpoint | Описание | Аутентификация |
|-------|----------|----------|----------------|
| POST | /auth/register | Регистрация | Нет |
| POST | /auth/login | Вход | Нет |
| POST | /auth/token | Обновление токена | Нет |
| POST | /auth/logout | Выход | Нет |
| GET | /todo | Получить все задачи | Да |
| POST | /todo | Создать задачу | Да |
| GET | /todo/:id | Получить задачу | Да |
| PUT | /todo/:id | Обновить задачу | Да |
| DELETE | /todo/:id | Удалить задачу | Да |

## Обработка ошибок

Все ошибки обрабатываются централизованно:

```typescript
app.use((err: Error, res: Response) => {
  console.error('An error has occurred:', err.stack);
  res.status(500).send('Internal Server Error');
});
```

## Логирование

- Ошибки логируются в консоль
- Детальная информация об ошибках в development режиме
- Минимальное логирование в production режиме
