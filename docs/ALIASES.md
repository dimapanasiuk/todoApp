# Алиасы путей (Path Aliases)

## Обзор

В проекте настроены алиасы путей для упрощения импортов и улучшения читаемости кода. Вместо относительных путей с `../` используются абсолютные алиасы с `@/`.

## Настроенные алиасы

### Основные алиасы:

| Алиас | Путь | Описание |
|-------|------|----------|
| `@/*` | `src/*` | Корневая папка src |
| `@/components/*` | `src/components/*` | React компоненты |
| `@/pages/*` | `src/pages/*` | Страницы приложения |
| `@/store/*` | `src/store/*` | Zustand store |
| `@/api/*` | `src/api/*` | API клиент |
| `@/types/*` | `src/types/*` | TypeScript типы |
| `@/router/*` | `src/router/*` | Маршрутизация |
| `@/utils/*` | `src/utils/*` | Утилиты |

## Примеры использования

### ❌ Старый способ (относительные пути):
```typescript
// Из компонента в pages/Board
import { List } from '../../components/List';
import { Notion } from '../../components/Notion';
import { useTodoStore } from '../../store/todoStore';
import { Header } from '../../components/Header';
import Loader from '../../components/Loader';

// Из store файла
import { setAuthToken } from '../api/api';
import api from '../api/api';
import type { Task } from '../types';
```

### ✅ Новый способ (алиасы):
```typescript
// Из любого места в проекте
import { List } from '@/components/List';
import { Notion } from '@/components/Notion';
import { useTodoStore } from '@/store/todoStore';
import { Header } from '@/components/Header';
import Loader from '@/components/Loader';

// Из store файла
import { setAuthToken } from '@/api/api';
import api from '@/api/api';
import type { Task } from '@/types';
```

## Конфигурация

### TypeScript (tsconfig.app.json):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/pages/*": ["src/pages/*"],
      "@/store/*": ["src/store/*"],
      "@/api/*": ["src/api/*"],
      "@/types/*": ["src/types/*"],
      "@/router/*": ["src/router/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

### Vite (vite.config.ts):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/api': path.resolve(__dirname, './src/api'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/router': path.resolve(__dirname, './src/router'),
      '@/utils': path.resolve(__dirname, './src/utils')
    }
  }
})
```

## Преимущества

### 1. **Читаемость кода**
- Нет сложных относительных путей `../../../`
- Понятно, откуда импортируется модуль
- Легче понять структуру проекта

### 2. **Удобство рефакторинга**
- При перемещении файлов не нужно обновлять все импорты
- Алиасы остаются неизменными
- Меньше ошибок при реструктуризации

### 3. **Консистентность**
- Единообразные импорты во всем проекте
- Легче поддерживать код
- Стандартизированный подход

### 4. **Автодополнение IDE**
- Лучшая поддержка автодополнения
- Быстрая навигация по коду
- Удобная работа с большими проектами

## Примеры в проекте

### Store файлы:
```typescript
// authStore.ts
import { setAuthToken } from '@/api/api';
import api from '@/api/api';

// todoStore.ts
import type { Task } from '@/types';
import api from '@/api/api';
```

### Компоненты:
```typescript
// Board/index.tsx
import { List } from '@/components/List';
import { Notion } from '@/components/Notion';
import { useTodoStore } from '@/store/todoStore';
import { Header } from '@/components/Header';
import Loader from '@/components/Loader';
```

### Router:
```typescript
// router/index.tsx
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/Loader';

const LazyLogin = React.lazy(() => import('@/pages/Login'));
const LazyRegistration = React.lazy(() => import('@/pages/Registration'));
const LazyBoard = React.lazy(() => import('@/pages/Board'));
```

## Рекомендации

### 1. **Используйте алиасы везде**
- Замените все относительные пути на алиасы
- Следуйте единому стилю импортов

### 2. **Группируйте импорты**
```typescript
// 1. React и внешние библиотеки
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';

// 2. Внутренние модули (с алиасами)
import { useAuthStore } from '@/store/authStore';
import { Header } from '@/components/Header';
import type { Task } from '@/types';
```

### 3. **Используйте типы с алиасами**
```typescript
import type { Task, User } from '@/types';
import type { AuthResponse } from '@/api/api';
```

## Проверка

### Убедитесь, что алиасы работают:
```bash
# Проверьте TypeScript
npx tsc --noEmit

# Проверьте линтер
npm run lint

# Проверьте сборку
npm run build
```

### Поиск старых импортов:
```bash
# Найдите оставшиеся относительные пути
grep -r "from.*\.\./" src/
```

## Заключение

Алиасы путей значительно улучшают читаемость и поддерживаемость кода. Они делают импорты более понятными и упрощают навигацию по проекту. Все новые файлы должны использовать алиасы вместо относительных путей.
