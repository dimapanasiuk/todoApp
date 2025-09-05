# Dockerfile для Frontend (React + TypeScript + Vite)
# 
# ИНСТРУКЦИИ ПО ЗАПУСКУ:
# 
# 1. СБОРКА ОБРАЗА:
#    docker build -t todo-frontend .
#
# 2. ЗАПУСК КОНТЕЙНЕРА (для разработки):
#    docker run -p 3001:3001 -v $(pwd):/app -v /app/node_modules --name todo-frontend-dev todo-frontend
#
# 3. ЗАПУСК КОНТЕЙНЕРА (production):
#    docker run -p 3001:3001 --name todo-frontend-prod todo-frontend
#
# 4. ЗАПУСК С БЭКЕНДОМ (рекомендуется):
#    Используйте docker-compose.yml в корне проекта:
#    docker-compose up --build
#
# 5. ОСТАНОВКА И УДАЛЕНИЕ:
#    docker stop todo-frontend-dev && docker rm todo-frontend-dev
#
# ВАЖНО: Убедитесь, что бэкенд запущен на порту 5000!
# Frontend будет обращаться к бэкенду по адресу: http://localhost:5000

# Multi-stage build для оптимизации размера образа

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение для production
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Переменные окружения
ENV VITE_API_URL=http://localhost:5000
ENV NODE_ENV=production

# Устанавливаем serve для раздачи статических файлов
RUN npm install -g serve

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем собранное приложение из builder stage
COPY --from=builder /app/dist ./dist

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

# Открываем порт 3001
EXPOSE 3001

# Запускаем приложение
CMD ["serve", "-s", "dist", "-l", "3001"]

# АЛЬТЕРНАТИВНЫЙ РЕЖИМ ДЛЯ РАЗРАБОТКИ:
# Если хотите запустить в режиме разработки, используйте:
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
#
# И запускайте контейнер с volume mapping:
# docker run -p 3001:3001 -v $(pwd):/app -v /app/node_modules todo-frontend
