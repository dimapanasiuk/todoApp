#!/bin/bash

# Простой скрипт для запуска Frontend
echo "🚀 Собираем Docker образ..."
docker build -f Dockerfile.simple -t my-frontend .

echo "🛑 Останавливаем старый контейнер (если есть)..."
docker stop my-frontend 2>/dev/null || true
docker rm my-frontend 2>/dev/null || true

echo "▶️ Запускаем новый контейнер..."
docker run -d -p 3001:3001 --name my-frontend my-frontend

echo "✅ Готово! Frontend доступен на: http://localhost:3001"
echo "📝 Для просмотра логов: docker logs my-frontend"
echo "🛑 Для остановки: docker stop my-frontend"
