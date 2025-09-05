# Развертывание - Документация

## Обзор

Данный документ описывает процесс развертывания Todo App в различных средах: development, staging и production.

## Предварительные требования

### Системные требования

**Минимальные:**
- CPU: 1 ядро
- RAM: 512 MB
- Диск: 1 GB свободного места
- ОС: Linux, macOS, Windows

**Рекомендуемые:**
- CPU: 2+ ядра
- RAM: 2+ GB
- Диск: 10+ GB свободного места
- ОС: Ubuntu 20.04+, CentOS 8+, macOS 10.15+

### Программное обеспечение

- Node.js 16+ (рекомендуется 18+)
- PostgreSQL 12+
- npm 8+ или yarn 1.22+
- Git
- PM2 (для production)

## Development развертывание

### Локальная разработка

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
   # Редактирование .env файла
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
   psql -d todoapp -f migrations/001_create_tables.sql
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

### Docker Development

1. **Создание docker-compose.yml**
   ```yaml
   version: '3.8'
   
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: todoapp
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
     backend:
       build: ./BE
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=development
         - DB_HOST=postgres
         - DB_PORT=5432
         - DB_NAME=todoapp
         - DB_USER=postgres
         - DB_PASSWORD=password
         - ACCESS_SECRET=dev_access_secret
         - REFRESH_SECRET=dev_refresh_secret
       depends_on:
         - postgres
       volumes:
         - ./BE:/app
         - /app/node_modules
   
     frontend:
       build: ./FE
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=development
       volumes:
         - ./FE:/app
         - /app/node_modules
   
   volumes:
     postgres_data:
   ```

2. **Запуск с Docker**
   ```bash
   docker-compose up --build
   ```

## Staging развертывание

### Подготовка сервера

1. **Обновление системы**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Установка Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Установка PostgreSQL**
   ```bash
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

4. **Установка PM2**
   ```bash
   sudo npm install -g pm2
   ```

### Развертывание приложения

1. **Клонирование и настройка**
   ```bash
   git clone <repository-url>
   cd todoApp
   
   # Backend
   cd BE
   npm install
   npm run build
   
   # Frontend
   cd FE
   npm install
   npm run build
   ```

2. **Настройка переменных окружения**
   ```bash
   # Backend .env
   NODE_ENV=staging
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=todoapp_staging
   DB_USER=todoapp_user
   DB_PASSWORD=secure_password
   ACCESS_SECRET=staging_access_secret
   REFRESH_SECRET=staging_refresh_secret
   ```

3. **Настройка базы данных**
   ```bash
   sudo -u postgres createdb todoapp_staging
   sudo -u postgres psql -d todoapp_staging -f migrations/001_create_tables.sql
   ```

4. **Запуск с PM2**
   ```bash
   # Backend
   cd BE
   pm2 start dist/index.js --name "todo-backend"
   
   # Frontend (если нужен dev сервер)
   cd FE
   pm2 start "npm run preview" --name "todo-frontend"
   ```

## Production развертывание

### Подготовка production сервера

1. **Создание пользователя для приложения**
   ```bash
   sudo adduser todoapp
   sudo usermod -aG sudo todoapp
   ```

2. **Настройка файрвола**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw allow 5000  # Backend API
   sudo ufw enable
   ```

3. **Установка Nginx**
   ```bash
   sudo apt install nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

### Конфигурация Nginx

1. **Создание конфигурации сайта**
   ```nginx
   # /etc/nginx/sites-available/todoapp
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           root /home/todoapp/todoApp/FE/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api/ {
           proxy_pass http://localhost:5000/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Активация конфигурации**
   ```bash
   sudo ln -s /etc/nginx/sites-available/todoapp /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### SSL сертификат (Let's Encrypt)

1. **Установка Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Получение сертификата**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### Настройка PM2 для production

1. **Создание ecosystem файла**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: 'todo-backend',
         script: './BE/dist/index.js',
         instances: 'max',
         exec_mode: 'cluster',
         env: {
           NODE_ENV: 'production',
           PORT: 5000
         },
         error_file: './logs/backend-error.log',
         out_file: './logs/backend-out.log',
         log_file: './logs/backend-combined.log',
         time: true
       }
     ]
   };
   ```

2. **Запуск приложения**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Автоматическое развертывание

1. **Создание скрипта развертывания**
   ```bash
   #!/bin/bash
   # deploy.sh
   
   set -e
   
   echo "Starting deployment..."
   
   # Обновление кода
   git pull origin main
   
   # Backend
   cd BE
   npm install --production
   npm run build
   
   # Frontend
   cd ../FE
   npm install --production
   npm run build
   
   # Перезапуск приложения
   pm2 restart todo-backend
   
   echo "Deployment completed!"
   ```

2. **Настройка webhook для автоматического развертывания**
   ```bash
   # Создание webhook endpoint
   curl -X POST http://your-server.com/webhook/deploy \
     -H "Content-Type: application/json" \
     -d '{"ref":"refs/heads/main"}'
   ```

## Мониторинг

### Логирование

1. **Настройка логов PM2**
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

2. **Мониторинг логов**
   ```bash
   pm2 logs todo-backend
   pm2 monit
   ```

### Мониторинг системы

1. **Установка htop**
   ```bash
   sudo apt install htop
   ```

2. **Мониторинг дискового пространства**
   ```bash
   df -h
   du -sh /home/todoapp/todoApp
   ```

### Мониторинг базы данных

1. **Проверка статуса PostgreSQL**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Мониторинг подключений**
   ```sql
   SELECT * FROM pg_stat_activity WHERE datname = 'todoapp';
   ```

## Резервное копирование

### Автоматические бэкапы

1. **Скрипт бэкапа**
   ```bash
   #!/bin/bash
   # backup.sh
   
   BACKUP_DIR="/backups"
   DATE=$(date +%Y%m%d_%H%M%S)
   
   # Создание директории для бэкапов
   mkdir -p $BACKUP_DIR
   
   # Бэкап базы данных
   pg_dump -h localhost -U todoapp_user -d todoapp > $BACKUP_DIR/db_backup_$DATE.sql
   
   # Бэкап файлов приложения
   tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /home/todoapp/todoApp
   
   # Удаление старых бэкапов (старше 30 дней)
   find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
   find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
   
   echo "Backup completed: $DATE"
   ```

2. **Cron задача**
   ```bash
   # Добавить в crontab
   0 2 * * * /home/todoapp/backup.sh
   ```

## Масштабирование

### Горизонтальное масштабирование

1. **Load Balancer (Nginx)**
   ```nginx
   upstream backend {
       server 127.0.0.1:5000;
       server 127.0.0.1:5001;
       server 127.0.0.1:5002;
   }
   
   server {
       location /api/ {
           proxy_pass http://backend/;
       }
   }
   ```

2. **Кластеризация PM2**
   ```bash
   pm2 start ecosystem.config.js --instances max
   ```

### Вертикальное масштабирование

1. **Увеличение ресурсов сервера**
   - Больше CPU ядер
   - Больше RAM
   - SSD диски

2. **Оптимизация базы данных**
   ```sql
   -- Настройка PostgreSQL
   ALTER SYSTEM SET shared_buffers = '256MB';
   ALTER SYSTEM SET effective_cache_size = '1GB';
   ALTER SYSTEM SET maintenance_work_mem = '64MB';
   ```

## Troubleshooting

### Частые проблемы

1. **Приложение не запускается**
   ```bash
   # Проверка логов
   pm2 logs todo-backend
   
   # Проверка статуса
   pm2 status
   
   # Перезапуск
   pm2 restart todo-backend
   ```

2. **Проблемы с базой данных**
   ```bash
   # Проверка статуса PostgreSQL
   sudo systemctl status postgresql
   
   # Проверка подключений
   sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
   ```

3. **Проблемы с Nginx**
   ```bash
   # Проверка конфигурации
   sudo nginx -t
   
   # Перезагрузка конфигурации
   sudo systemctl reload nginx
   
   # Проверка логов
   sudo tail -f /var/log/nginx/error.log
   ```

### Восстановление после сбоя

1. **Восстановление из бэкапа**
   ```bash
   # Остановка приложения
   pm2 stop todo-backend
   
   # Восстановление базы данных
   psql -d todoapp < /backups/db_backup_20240101_120000.sql
   
   # Восстановление файлов
   tar -xzf /backups/app_backup_20240101_120000.tar.gz -C /
   
   # Запуск приложения
   pm2 start todo-backend
   ```

## Безопасность

### Настройка файрвола

```bash
# Базовые правила
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Обновления безопасности

```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Мониторинг безопасности

```bash
# Установка fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```
