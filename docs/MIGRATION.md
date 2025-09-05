# Миграция - Удаление кастомных хуков

## Обзор

Все кастомные хуки были удалены из проекта. Теперь приложение использует только хуки Zustand напрямую для управления состоянием.

## Что было удалено

### Удаленные файлы:
- `src/hooks/useAuth.ts`
- `src/hooks/useTodos.ts`
- `src/hooks/useGetTodos.ts`
- `src/hooks/useCreateTodo.ts`
- `src/hooks/useUpdateTodo.ts`
- `src/hooks/useDeleteTodo.ts`
- `src/hooks/index.ts`
- `src/hooks/` (вся папка)

### Удаленные функции:
- `useAuth()` - обертка над `useAuthStore()`
- `useTodos()` - обертка над `useTodoStore()`
- `useGetTodos()` - обертка над `useTodoStore()`
- `useCreateTodo()` - обертка над `useTodoStore()`
- `useUpdateTodo()` - обертка над `useTodoStore()`
- `useDeleteTodo()` - обертка над `useTodoStore()`

## Как использовать теперь

### ✅ Правильно - используйте store напрямую:

```typescript
// Аутентификация
import { useAuthStore } from '../store/authStore';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    isLoggingIn,
    error 
  } = useAuthStore();
  
  return (
    // JSX
  );
};
```

```typescript
// Работа с задачами
import { useTodoStore } from '../store/todoStore';

const MyComponent = () => {
  const { 
    todos, 
    createTodo, 
    updateTodo, 
    deleteTodo,
    isCreating,
    isUpdating,
    isDeleting,
    error 
  } = useTodoStore();
  
  return (
    // JSX
  );
};
```

### ❌ Неправильно - больше не работает:

```typescript
// ❌ Ошибка - файлы не существуют
import { useAuth, useTodos } from '../hooks';

// ❌ Ошибка - функции не существуют
const { user } = useAuth();
const { todos } = useTodos();
```

## Преимущества изменений

### 1. **Упрощение архитектуры**
- Меньше файлов для поддержки
- Нет дублирования логики
- Прямое использование store

### 2. **Лучшая производительность**
- Меньше промежуточных слоев
- Прямые подписки на store
- Оптимизированные ре-рендеры

### 3. **Простота понимания**
- Один способ использования store
- Нет путаницы между хуками и store
- Четкая архитектура

## Проверка миграции

### Убедитесь, что все импорты обновлены:

```bash
# Проверьте, что нет импортов из hooks
grep -r "from.*hooks" src/
# Должно быть пусто

# Проверьте, что используются только store
grep -r "useAuthStore\|useTodoStore" src/
# Должны быть только эти импорты
```

### Проверьте TypeScript:

```bash
npx tsc --noEmit
# Должно пройти без ошибок
```

### Проверьте линтер:

```bash
npm run lint
# Должно пройти без ошибок
```

## Структура проекта после миграции

```
src/
├── components/          # React компоненты
├── pages/              # Страницы приложения
├── store/              # Zustand store
│   ├── authStore.ts    # Аутентификация
│   └── todoStore.ts    # Задачи
├── api/                # API клиент
├── router/             # Маршрутизация
└── types/              # TypeScript типы
```

## Заключение

Миграция завершена успешно. Все компоненты теперь используют Zustand store напрямую, что обеспечивает:

- **Простоту** - один способ работы с состоянием
- **Производительность** - меньше промежуточных слоев
- **Надежность** - единый источник истины
- **Масштабируемость** - легкое добавление новых функций

Больше нет необходимости в кастомных хуках - все управление состоянием происходит через store.
