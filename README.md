# Todo App

Полнофункциональное веб-приложение для управления задачами с современным стеком технологий.

## 🚀 Особенности

- **Аутентификация**: JWT токены с refresh механизмом
- **Управление задачами**: CRUD операции с приоритетами и дедлайнами
- **Современный UI**: Material-UI компоненты с адаптивным дизайном
- **Безопасность**: Хеширование паролей, CORS защита, валидация данных
- **Производительность**: Lazy loading, оптимизированные запросы

## 🛠 Технологический стек

### Frontend
- **React 19** - Современная библиотека для UI
- **TypeScript** - Типизированный JavaScript
- **Vite** - Быстрый сборщик и dev сервер
- **Material-UI** - Готовые компоненты
- **React Router** - Клиентская маршрутизация
- **Axios** - HTTP клиент

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Веб-фреймворк
- **TypeScript** - Типизированный JavaScript
- **PostgreSQL** - Реляционная база данных
- **JWT** - Аутентификация
- **bcrypt** - Хеширование паролей

## 📁 Структура проекта

```
todoApp/
├── FE/                    # Frontend приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── store/         # Zustand store для управления состоянием
│   │   ├── api/           # API клиент
│   │   ├── router/        # Маршрутизация
│   │   └── types/         # TypeScript типы
│   ├── project-manifest.json
│   └── package.json
├── BE/                    # Backend API
│   ├── src/
│   │   ├── routes/        # API маршруты
│   │   ├── middleware/    # Промежуточное ПО
│   │   ├── db/            # База данных
│   │   ├── types/         # TypeScript типы
│   │   └── utils/         # Утилиты
│   ├── project-manifest.json
│   └── package.json
├── docs/                  # Документация
│   ├── README.md          # Общая документация
│   ├── BACKEND.md         # Backend документация
│   ├── FRONTEND.md        # Frontend документация
│   ├── API.md             # API документация
│   ├── DATABASE.md        # База данных
│   └── DEPLOYMENT.md      # Развертывание
├── project-manifest.json  # Манифест проекта
└── README.md              # Этот файл
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 16+ 
- PostgreSQL 12+
- npm или yarn

### Установка

1. **Клонирование репозитория**
   ```bash
   git clone <repository-url>
   cd todoApp
   ```

2. **Настройка Backend**
   ```bash
   cd BE
   npm install
   
   # Создание .env файла
   cp .env.example .env
   # Настройте переменные окружения
   ```

3. **Настройка Frontend**
   ```bash
   cd FE
   npm install
   ```

4. **Настройка базы данных**
   ```bash
   # Создание базы данных
   createdb todoapp
   
   # Выполнение миграций
   psql -d todoapp -f docs/migrations/001_create_tables.sql
   ```

5. **Запуск приложения**
   ```bash
   # Terminal 1 - Backend
   cd BE
   npm run dev
   
   # Terminal 2 - Frontend  
   cd FE
   npm run dev
   ```

6. **Открытие приложения**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

## 📚 Документация

- **[Общая документация](docs/README.md)** - Полное описание проекта
- **[Backend](docs/BACKEND.md)** - API сервер и бизнес-логика
- **[Frontend](docs/FRONTEND.md)** - React приложение и UI компоненты
- **[API](docs/API.md)** - Документация REST API
- **[База данных](docs/DATABASE.md)** - Схема и SQL запросы
- **[Аутентификация](docs/AUTHENTICATION.md)** - JWT токены и безопасность
- **[Архитектура](docs/ARCHITECTURE.md)** - Zustand store и управление состоянием
- **[Алиасы](docs/ALIASES.md)** - Настройка путей и импортов
- **[Развертывание](docs/DEPLOYMENT.md)** - Production развертывание

## 🔧 Разработка

### Доступные скрипты

**Backend:**
```bash
npm run dev      # Запуск в режиме разработки
npm run build    # Сборка для production
npm start        # Запуск production версии
```

**Frontend:**
```bash
npm run dev      # Запуск dev сервера
npm run build    # Сборка для production
npm run preview  # Предварительный просмотр сборки
npm run lint     # Проверка кода линтером
```

### Переменные окружения

**Backend (.env):**
```env
PORT=5000
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todoapp
DB_USER=postgres
DB_PASSWORD=your_password
```

## 🎯 Основные функции

### Аутентификация
- ✅ Регистрация пользователей
- ✅ Вход в систему
- ✅ JWT токены (Access в localStorage + Refresh в HttpOnly cookies)
- ✅ Автоматическое обновление токенов
- ✅ Безопасный выход

### Управление задачами
- ✅ Создание задач
- ✅ Просмотр списка задач
- ✅ Редактирование задач
- ✅ Удаление задач
- ✅ Статусы задач (todo, in progress, done)
- ✅ Система приоритетов (1-5)
- ✅ Установка дедлайнов
- ✅ Цветовое кодирование

### Пользовательский интерфейс
- ✅ Адаптивный дизайн
- ✅ Material Design компоненты
- ✅ Интуитивно понятный интерфейс
- ✅ Реальное время обновления

## 🔒 Безопасность

- **Пароли**: Хеширование с bcrypt (salt rounds: 10)
- **Токены**: JWT с коротким временем жизни
- **CORS**: Настроен для безопасности
- **Cookies**: HttpOnly refresh токены
- **Валидация**: Проверка всех входных данных

## 📊 API Endpoints

| Метод | Endpoint | Описание | Аутентификация |
|-------|----------|----------|----------------|
| POST | /auth/register | Регистрация | ❌ |
| POST | /auth/login | Вход | ❌ |
| POST | /auth/token | Обновление токена | ❌ |
| POST | /auth/logout | Выход | ❌ |
| GET | /todo | Получить все задачи | ✅ |
| POST | /todo | Создать задачу | ✅ |
| GET | /todo/:id | Получить задачу | ✅ |
| PUT | /todo/:id | Обновить задачу | ✅ |
| DELETE | /todo/:id | Удалить задачу | ✅ |

## 🚀 Развертывание

### Docker (рекомендуется)

```bash
docker-compose up --build
```

### Production

```bash
# Backend
cd BE
npm run build
pm2 start dist/index.js --name "todo-backend"

# Frontend
cd FE
npm run build
# Разместите dist/ на веб-сервере
```

Подробная инструкция в [DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👨‍💻 Автор

**panakota**

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [документацию](docs/)
2. Создайте [issue](https://github.com/your-repo/issues)
3. Свяжитесь с автором

## 🎉 Благодарности

- [React](https://reactjs.org/) - За отличную библиотеку
- [Material-UI](https://mui.com/) - За красивые компоненты
- [Express.js](https://expressjs.com/) - За простой и мощный фреймворк
- [PostgreSQL](https://www.postgresql.org/) - За надежную базу данных

---

⭐ Если проект вам понравился, поставьте звезду!
