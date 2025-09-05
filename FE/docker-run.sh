#!/bin/bash

# Скрипт для запуска Frontend в Docker
# 
# Использование:
#   ./docker-run.sh [dev|prod|stop|clean]
#
#   dev   - запуск в режиме разработки
#   prod  - запуск в production режиме
#   stop  - остановка контейнеров
#   clean - очистка контейнеров и образов

set -e

CONTAINER_NAME="todo-frontend"
IMAGE_NAME="todo-frontend"

case "${1:-prod}" in
  "dev")
    echo "🚀 Запуск Frontend в режиме разработки..."
    docker build -f Dockerfile.dev -t ${IMAGE_NAME}-dev .
    docker run -d \
      --name ${CONTAINER_NAME}-dev \
      -p 3001:3001 \
      -v "$(pwd):/app" \
      -v "/app/node_modules" \
      ${IMAGE_NAME}-dev
    echo "✅ Frontend запущен в режиме разработки на http://localhost:3001"
    echo "📝 Логи: docker logs -f ${CONTAINER_NAME}-dev"
    ;;
    
  "prod")
    echo "🚀 Запуск Frontend в production режиме..."
    docker build -t ${IMAGE_NAME} .
    docker run -d \
      --name ${CONTAINER_NAME}-prod \
      -p 3001:3001 \
      ${IMAGE_NAME}
    echo "✅ Frontend запущен в production режиме на http://localhost:3001"
    echo "📝 Логи: docker logs -f ${CONTAINER_NAME}-prod"
    ;;
    
  "stop")
    echo "🛑 Остановка контейнеров..."
    docker stop ${CONTAINER_NAME}-dev ${CONTAINER_NAME}-prod 2>/dev/null || true
    echo "✅ Контейнеры остановлены"
    ;;
    
  "clean")
    echo "🧹 Очистка контейнеров и образов..."
    docker stop ${CONTAINER_NAME}-dev ${CONTAINER_NAME}-prod 2>/dev/null || true
    docker rm ${CONTAINER_NAME}-dev ${CONTAINER_NAME}-prod 2>/dev/null || true
    docker rmi ${IMAGE_NAME} ${IMAGE_NAME}-dev 2>/dev/null || true
    echo "✅ Очистка завершена"
    ;;
    
  *)
    echo "❌ Неизвестная команда: $1"
    echo "Использование: $0 [dev|prod|stop|clean]"
    exit 1
    ;;
esac
