# База данных - Документация

## Обзор

Todo App использует PostgreSQL в качестве основной базы данных. База данных содержит таблицы для пользователей, задач и refresh токенов.

## Структура базы данных

### Схема базы данных

```sql
-- Создание базы данных
CREATE DATABASE todoapp;

-- Подключение к базе данных
\c todoapp;
```

## Таблицы

### 1. Пользователи (users)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Описание полей:**
- `id` - Уникальный идентификатор пользователя (автоинкремент)
- `email` - Email пользователя (уникальный)
- `password` - Хешированный пароль (bcrypt)
- `created_at` - Дата создания аккаунта

**Индексы:**
```sql
CREATE INDEX idx_users_email ON users(email);
```

### 2. Задачи (tasks)

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at BIGINT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline_date BIGINT,
  status VARCHAR(50) NOT NULL CHECK (status IN ('todo', 'in progress', 'done')),
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 5),
  color VARCHAR(7),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

**Описание полей:**
- `id` - UUID задачи (генерируется автоматически)
- `title` - Заголовок задачи
- `description` - Описание задачи
- `created_at` - Unix timestamp создания
- `updated_at` - Дата последнего обновления
- `deadline_date` - Unix timestamp дедлайна
- `status` - Статус задачи (todo, in progress, done)
- `priority` - Приоритет задачи (1-5)
- `color` - HEX цвет задачи
- `user_id` - Ссылка на пользователя

**Индексы:**
```sql
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_deadline ON tasks(deadline_date);
```

### 3. Refresh токены (refresh_tokens)

```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Описание полей:**
- `id` - Уникальный идентификатор токена
- `user_id` - Ссылка на пользователя
- `token` - Refresh токен
- `created_at` - Дата создания токена

**Индексы:**
```sql
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

## SQL запросы

### Аутентификация

#### Создание пользователя
```sql
-- src/db/login/create_user.sql
INSERT INTO users (email, password) 
VALUES ($1, $2) 
RETURNING id, email, created_at;
```

#### Получение пользователя по email
```sql
-- src/db/login/get_user.sql
SELECT id, email, password, created_at 
FROM users 
WHERE email = $1;
```

#### Создание refresh токена
```sql
-- src/db/login/create_refresh_token.sql
INSERT INTO refresh_tokens (user_id, token) 
VALUES ($1, $2) 
RETURNING id, user_id, token, created_at;
```

#### Получение refresh токена
```sql
-- src/db/login/get_refresh_token.sql
SELECT id, user_id, token, created_at 
FROM refresh_tokens 
WHERE token = $1;
```

#### Удаление refresh токена
```sql
-- src/db/login/delete_refresh_token.sql
DELETE FROM refresh_tokens 
WHERE token = $1;
```

### Задачи

#### Получение всех задач пользователя
```sql
-- src/db/tasks/get_tasks.sql
SELECT id, title, description, created_at, updated_at, 
       deadline_date, status, priority, color, user_id 
FROM tasks 
WHERE user_id = $1 
ORDER BY created_at DESC;
```

#### Получение задачи по ID
```sql
-- src/db/tasks/get_task.sql
SELECT id, title, description, created_at, updated_at, 
       deadline_date, status, priority, color, user_id 
FROM tasks 
WHERE id = $1;
```

#### Создание задачи
```sql
-- src/db/tasks/insert_task.sql
INSERT INTO tasks (id, title, description, created_at, deadline_date, 
                   status, priority, color, user_id) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
RETURNING id, title, description, created_at, updated_at, 
          deadline_date, status, priority, color, user_id;
```

#### Обновление задачи
```sql
-- src/db/tasks/update_task.sql
UPDATE tasks 
SET title = $1, 
    description = $2, 
    deadline_date = $3, 
    status = $4, 
    priority = $5, 
    color = $6, 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = $7 AND user_id = $8 
RETURNING id, title, description, created_at, updated_at, 
          deadline_date, status, priority, color, user_id;
```

#### Удаление задачи
```sql
-- src/db/tasks/delete_task.sql
DELETE FROM tasks 
WHERE id = $1 AND user_id = $2 
RETURNING id, title, description, created_at, updated_at, 
          deadline_date, status, priority, color, user_id;
```

## Подключение к базе данных

### Конфигурация (src/db/index.ts)

```typescript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'todoapp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // максимальное количество соединений
  idleTimeoutMillis: 30000, // время ожидания неактивного соединения
  connectionTimeoutMillis: 2000, // время ожидания подключения
});

module.exports = pool;
```

### Переменные окружения

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todoapp
DB_USER=postgres
DB_PASSWORD=your_password
```

## Миграции

### Создание всех таблиц

```sql
-- migrations/001_create_tables.sql
BEGIN;

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы задач
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at BIGINT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline_date BIGINT,
  status VARCHAR(50) NOT NULL CHECK (status IN ('todo', 'in progress', 'done')),
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 5),
  color VARCHAR(7),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Создание таблицы refresh токенов
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline_date);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);

COMMIT;
```

## Бэкапы

### Создание бэкапа

```bash
# Полный бэкап базы данных
pg_dump -h localhost -U postgres -d todoapp > backup_$(date +%Y%m%d_%H%M%S).sql

# Бэкап только структуры
pg_dump -h localhost -U postgres -d todoapp --schema-only > schema_backup.sql

# Бэкап только данных
pg_dump -h localhost -U postgres -d todoapp --data-only > data_backup.sql
```

### Восстановление из бэкапа

```bash
# Восстановление полного бэкапа
psql -h localhost -U postgres -d todoapp < backup_20240101_120000.sql

# Восстановление в новую базу данных
createdb -h localhost -U postgres todoapp_restored
psql -h localhost -U postgres -d todoapp_restored < backup_20240101_120000.sql
```

## Оптимизация производительности

### Анализ запросов

```sql
-- Включение логирования медленных запросов
ALTER SYSTEM SET log_min_duration_statement = 1000; -- логировать запросы > 1 сек
ALTER SYSTEM SET log_statement = 'all'; -- логировать все запросы
SELECT pg_reload_conf();

-- Анализ планов выполнения
EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = 1;
```

### Мониторинг

```sql
-- Активные соединения
SELECT * FROM pg_stat_activity WHERE datname = 'todoapp';

-- Размеры таблиц
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Статистика по таблицам
SELECT * FROM pg_stat_user_tables;
```

## Безопасность

### Роли и права доступа

```sql
-- Создание роли для приложения
CREATE ROLE todoapp_user;

-- Предоставление прав
GRANT CONNECT ON DATABASE todoapp TO todoapp_user;
GRANT USAGE ON SCHEMA public TO todoapp_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO todoapp_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO todoapp_user;

-- Создание пользователя
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT todoapp_user TO app_user;
```

### Шифрование

```sql
-- Включение SSL
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = 'server.crt';
ALTER SYSTEM SET ssl_key_file = 'server.key';
```

## Мониторинг и логирование

### Настройка логирования

```sql
-- postgresql.conf
log_destination = 'stderr'
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

### Метрики

```sql
-- Создание представления для мониторинга
CREATE VIEW db_stats AS
SELECT 
  (SELECT count(*) FROM users) as total_users,
  (SELECT count(*) FROM tasks) as total_tasks,
  (SELECT count(*) FROM refresh_tokens) as active_tokens,
  (SELECT count(*) FROM tasks WHERE status = 'todo') as pending_tasks,
  (SELECT count(*) FROM tasks WHERE status = 'in progress') as in_progress_tasks,
  (SELECT count(*) FROM tasks WHERE status = 'done') as completed_tasks;
```

## Резервное копирование и восстановление

### Автоматические бэкапы

```bash
#!/bin/bash
# backup.sh

DB_NAME="todoapp"
DB_USER="postgres"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Создание бэкапа
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Сжатие
gzip $BACKUP_DIR/backup_$DATE.sql

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### Cron задача

```bash
# Добавить в crontab
0 2 * * * /path/to/backup.sh
```

## Troubleshooting

### Частые проблемы

1. **Ошибка подключения**
   ```bash
   # Проверка статуса PostgreSQL
   sudo systemctl status postgresql
   
   # Проверка портов
   netstat -tlnp | grep 5432
   ```

2. **Медленные запросы**
   ```sql
   -- Анализ планов выполнения
   EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = 1;
   
   -- Проверка индексов
   SELECT * FROM pg_indexes WHERE tablename = 'tasks';
   ```

3. **Проблемы с памятью**
   ```sql
   -- Настройка shared_buffers
   ALTER SYSTEM SET shared_buffers = '256MB';
   
   -- Настройка work_mem
   ALTER SYSTEM SET work_mem = '4MB';
   ```

## Расширения

### Полезные расширения

```sql
-- UUID расширение
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Статистика
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Полнотекстовый поиск
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```
