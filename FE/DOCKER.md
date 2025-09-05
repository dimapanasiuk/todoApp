# Docker инструкции для Frontend

## Обзор

Этот документ содержит подробные инструкции по запуску frontend приложения в Docker контейнере.

## Быстрый старт

### 1. Запуск только Frontend (если backend уже запущен)

```bash
# Перейдите в папку FE
cd FE

# Соберите и запустите контейнер
docker-compose up --build
```

Frontend будет доступен по адресу: http://localhost:3001

### 1.1. Использование скрипта (рекомендуется)

```bash
# Перейдите в папку FE
cd FE

# Production режим
./docker-run.sh prod

# Development режим (с hot reload)
./docker-run.sh dev

# Остановка
./docker-run.sh stop

# Очистка
./docker-run.sh clean
```

### 2. Запуск Frontend + Backend вместе

```bash
# Перейдите в корень проекта
cd ..

# Запустите все сервисы
docker-compose up --build
```

- Frontend: http://localhost:3001
- Backend: http://localhost:5000

## Подробные инструкции

### Сборка образа

```bash
# Сборка образа frontend
docker build -t todo-frontend .

# Сборка с тегом версии
docker build -t todo-frontend:v1.0.0 .
```

### Запуск контейнера

#### Production режим (рекомендуется)

```bash
# Запуск собранного приложения
docker run -p 3001:3001 --name todo-frontend-prod todo-frontend
```

#### Development режим

```bash
# Запуск с hot reload (требует изменения Dockerfile)
docker run -p 3001:3001 -v $(pwd):/app -v /app/node_modules --name todo-frontend-dev todo-frontend
```

### Управление контейнерами

```bash
# Остановка контейнера
docker stop todo-frontend-prod

# Удаление контейнера
docker rm todo-frontend-prod

# Просмотр логов
docker logs -f todo-frontend-prod

# Вход в контейнер
docker exec -it todo-frontend-prod sh
```

## Конфигурация

### Переменные окружения

Вы можете настроить приложение через переменные окружения:

```bash
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e API_URL=http://localhost:5000 \
  --name todo-frontend \
  todo-frontend
```

### Сетевые настройки

#### Подключение к существующей сети

```bash
# Создание сети
docker network create todo-network

# Запуск frontend в сети
docker run -p 3001:3001 --network todo-network --name todo-frontend todo-frontend
```

#### Связь с backend контейнером

```bash
# Если backend запущен в контейнере с именем 'todo-backend'
docker run -p 3001:3001 --link todo-backend:backend --name todo-frontend todo-frontend
```

## Troubleshooting

### Проблема: "tsc: not found" при сборке

**Ошибка:**
```
sh: tsc: not found
failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 127
```

**Решение:**
Эта ошибка возникает, когда TypeScript компилятор не установлен. В исправленном Dockerfile мы используем `npm ci` вместо `npm ci --only=production`, что устанавливает все зависимости включая devDependencies.

```bash
# Пересоберите образ
docker build --no-cache -t todo-frontend .
```

### Проблема: Frontend не может подключиться к backend

**Решение:**
1. Убедитесь, что backend запущен на порту 5000
2. Проверьте, что порты не заблокированы файрволом
3. Если backend в Docker, используйте имя сервиса вместо localhost

```bash
# Проверка доступности backend
curl http://localhost:5000/health
```

### Проблема: Порт 3001 занят

**Решение:**
```bash
# Использование другого порта
docker run -p 3002:3001 --name todo-frontend todo-frontend
```

### Проблема: Ошибки сборки

**Решение:**
```bash
# Очистка кэша Docker
docker system prune -a

# Пересборка без кэша
docker build --no-cache -t todo-frontend .
```

## Мониторинг

### Health Check

Контейнер включает health check:

```bash
# Проверка статуса
docker inspect --format='{{.State.Health.Status}}' todo-frontend
```

### Логи

```bash
# Просмотр логов в реальном времени
docker logs -f todo-frontend

# Просмотр последних 100 строк
docker logs --tail 100 todo-frontend
```

## Production рекомендации

### 1. Использование multi-stage build

Для оптимизации размера образа рекомендуется использовать multi-stage build:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Безопасность

```bash
# Запуск с ограниченными правами
docker run --user 1000:1000 -p 3001:3001 todo-frontend

# Использование read-only файловой системы
docker run --read-only -p 3001:3001 todo-frontend
```

### 3. Мониторинг ресурсов

```bash
# Просмотр использования ресурсов
docker stats todo-frontend

# Ограничение ресурсов
docker run -p 3001:3001 --memory=512m --cpus=1 todo-frontend
```

## Полезные команды

```bash
# Просмотр всех образов
docker images

# Просмотр всех контейнеров
docker ps -a

# Очистка неиспользуемых ресурсов
docker system prune

# Экспорт образа
docker save todo-frontend > todo-frontend.tar

# Импорт образа
docker load < todo-frontend.tar
```
