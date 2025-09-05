# Todo App - Документация

## Обзор проекта

Todo App - это полнофункциональное веб-приложение для управления задачами, построенное с использованием современного стека технологий. Приложение предоставляет пользователям возможность создавать, редактировать, удалять и отслеживать свои задачи с системой приоритетов и дедлайнов.

## Архитектура

### Технологический стек

**Frontend:**
- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.2
- Material-UI 7.3.1
- React Router DOM 7.8.2
- Axios 1.11.0

**Backend:**
- Node.js
- Express 5.1.0
- TypeScript 5.9.2
- PostgreSQL
- JWT (jsonwebtoken 9.0.2)
- bcrypt 6.0.0

### Структура проекта

```
todoApp/
├── FE/                    # Frontend приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── hooks/         # Пользовательские хуки
│   │   ├── api/           # API клиент
│   │   ├── router/        # Маршрутизация
│   │   └── types/         # TypeScript типы
│   └── package.json
├── BE/                    # Backend API
│   ├── src/
│   │   ├── routes/        # API маршруты
│   │   ├── middleware/    # Промежуточное ПО
│   │   ├── db/            # База данных
│   │   ├── types/         # TypeScript типы
│   │   └── utils/         # Утилиты
│   └── package.json
└── docs/                  # Документация
```

## Основные функции

### Аутентификация
- Регистрация новых пользователей
- Вход в систему
- JWT токены (Access + Refresh)
- Безопасный выход

### Управление задачами
- Создание задач с заголовком, описанием и дедлайном
- Редактирование существующих задач
- Удаление задач
- Система статусов (todo, in progress, done)
- Система приоритетов (1-5)
- Цветовое кодирование задач

### Пользовательский интерфейс
- Адаптивный дизайн
- Material Design компоненты
- Интуитивно понятный интерфейс
- Реальное время обновления данных

## Быстрый старт

### Предварительные требования
- Node.js (v16 или выше)
- PostgreSQL
- npm или yarn

### Установка и запуск

1. **Клонирование репозитория**
   ```bash
   git clone <repository-url>
   cd todoApp
   ```

2. **Настройка Backend**
   ```bash
   cd BE
   npm install
   # Настройте переменные окружения в .env файле
   npm run dev
   ```

3. **Настройка Frontend**
   ```bash
   cd FE
   npm install
   npm run dev
   ```

4. **Настройка базы данных**
   - Создайте базу данных PostgreSQL
   - Настройте подключение в переменных окружения

## API Документация

### Аутентификация

#### POST /auth/register
Регистрация нового пользователя
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /auth/login
Вход в систему
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /auth/token
Обновление access токена

#### POST /auth/logout
Выход из системы

### Задачи

#### GET /todo
Получить все задачи пользователя

#### POST /todo
Создать новую задачу
```json
{
  "title": "Новая задача",
  "description": "Описание задачи",
  "deadlineDate": 1640995200000,
  "status": "todo",
  "priority": 3,
  "color": "#FF5722"
}
```

#### GET /todo/:id
Получить задачу по ID

#### PUT /todo/:id
Обновить задачу

#### DELETE /todo/:id
Удалить задачу

## Безопасность

- Пароли хешируются с использованием bcrypt
- JWT токены для аутентификации
- Refresh токены хранятся в HttpOnly cookies
- CORS настроен для безопасности
- Валидация входных данных

## Разработка

### Структура кода
- TypeScript для типизации
- ESLint для проверки кода
- Модульная архитектура
- Разделение ответственности

### Тестирование
- Unit тесты для компонентов
- Integration тесты для API
- E2E тесты для пользовательских сценариев

## Развертывание

### Production сборка
```bash
# Frontend
cd FE
npm run build

# Backend
cd BE
npm run build
npm start
```

### Переменные окружения

**Backend (.env):**
```
PORT=5000
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todoapp
DB_USER=your_username
DB_PASSWORD=your_password
```

## Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## Лицензия

MIT License

## Авторы

- panakota

## Поддержка

Если у вас есть вопросы или проблемы, создайте issue в репозитории.
