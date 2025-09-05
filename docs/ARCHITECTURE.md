# Архитектура приложения - Документация

## Обзор

Todo App использует современную архитектуру с централизованным управлением состоянием через Zustand store. Вся работа с сервером вынесена из хуков в store, что обеспечивает лучшую производительность и упрощает код.

## Архитектурные принципы

### 1. **Централизованное управление состоянием**
- Все состояние приложения управляется через Zustand store
- API вызовы выполняются в store, а не в хуках
- Компоненты подписываются на изменения состояния

### 2. **Разделение ответственности**
- **Store** - управление состоянием и API вызовы
- **Хуки** - простые обертки для удобства использования
- **Компоненты** - отображение UI и обработка пользовательских действий

### 3. **Реактивность**
- Автоматическое обновление UI при изменении состояния
- Синхронные обновления данных в реальном времени
- Оптимизированные ре-рендеры

## Структура Store

### AuthStore (src/store/authStore.ts)
```typescript
interface AuthState {
  // Состояние
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  
  // Состояния загрузки
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  
  // Действия
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  
  // Утилиты
  clearError: () => void;
  clearSuccess: () => void;
}
```

### TodoStore (src/store/todoStore.ts)
```typescript
interface TodoState {
  // Состояние данных
  todos: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Состояния загрузки
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetching: boolean;
  
  // Действия
  fetchTodos: () => Promise<void>;
  createTodo: (todoData: Omit<Task, 'id' | 'userId'>) => Promise<Task | null>;
  updateTodo: (id: string, todoData: Partial<Task>) => Promise<Task | null>;
  deleteTodo: (id: string) => Promise<boolean>;
  
  // Утилиты
  clearError: () => void;
  setError: (error: string) => void;
}
```

## Использование в компонентах

### Прямое использование Store (Рекомендуется)
```typescript
import { useTodoStore } from '../store/todoStore';
import { useAuthStore } from '../store/authStore';

const MyComponent = () => {
  // Получаем все необходимое из store
  const { 
    todos, 
    isFetching, 
    error, 
    fetchTodos, 
    createTodo 
  } = useTodoStore();
  
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout 
  } = useAuthStore();
  
  // Используем методы store напрямую
  const handleCreateTodo = async () => {
    await createTodo(todoData);
  };
  
  return (
    // JSX
  );
};
```

### Использование хуков (Удалено)
```typescript
// ❌ Кастомные хуки удалены - используйте store напрямую
// import { useTodos, useAuth } from '../hooks'; // Больше не существует
```

## Поток данных

### 1. Инициализация
```typescript
// App.tsx
useEffect(() => {
  checkAuth(); // Проверяем аутентификацию
}, [checkAuth]);

// Board.tsx
useEffect(() => {
  fetchTodos(); // Загружаем задачи
}, [fetchTodos]);
```

### 2. Пользовательские действия
```typescript
// Создание задачи
const handleCreate = async () => {
  const result = await createTodo(todoData);
  if (result) {
    // Задача автоматически добавлена в UI
    // Лоадер автоматически скрыт
  }
};

// Удаление задачи
const handleDelete = async (id: string) => {
  const success = await deleteTodo(id);
  if (success) {
    // Задача автоматически удалена из UI
  }
};
```

### 3. Автоматические обновления
```typescript
// Store автоматически обновляет состояние
const createTodo = async (todoData) => {
  set({ isCreating: true, error: null });
  
  try {
    const newTodo = await api.createTodo(todoData);
    
    // Мгновенно обновляем UI
    set((state) => ({
      todos: [newTodo, ...state.todos],
      isCreating: false
    }));
    
    return newTodo;
  } catch (error) {
    set({ error: error.message, isCreating: false });
    return null;
  }
};
```

## Преимущества новой архитектуры

### 1. **Производительность**
- Меньше ре-рендеров компонентов
- Оптимизированные подписки на изменения
- Централизованное кэширование данных

### 2. **Простота кода**
- Нет дублирования логики в хуках
- Единое место для API вызовов
- Простые и понятные компоненты

### 3. **Надежность**
- Централизованная обработка ошибок
- Консистентное состояние приложения
- Легкое тестирование

### 4. **Масштабируемость**
- Легко добавлять новые функции
- Простое разделение на модули
- Гибкая архитектура

## Миграция с хуков на store

### До (Старая архитектура)
```typescript
// Хук содержал API логику
export const useCreateTodo = (body: Task, trigger: boolean) => {
  const [data, setData] = useState<Task>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!body.title) return;
    
    setIsLoading(true);
    setError('');
    
    const createData = async () => {
      const response = await api.createTodo(body);
      setData(response);
      setIsLoading(false);
    };
    
    try {
      createData();
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  }, [trigger]);

  return { data, isLoading, error };
};
```

### После (Новая архитектура)
```typescript
// Store содержит всю логику
export const useTodoStore = create<TodoState>((set) => ({
  createTodo: async (todoData) => {
    set({ isCreating: true, error: null });
    
    try {
      const newTodo = await api.createTodo(todoData);
      
      set((state) => ({
        todos: [newTodo, ...state.todos],
        isCreating: false
      }));
      
      return newTodo;
    } catch (error) {
      set({ error: error.message, isCreating: false });
      return null;
    }
  }
}));

// Хук - простая обертка
export const useCreateTodo = () => {
  const { createTodo, isCreating, error, clearError } = useTodoStore();
  return { createTodo, isCreating, error, clearError };
};
```

## Лучшие практики

### 1. **Используйте только store напрямую**
```typescript
// ✅ Хорошо - единственный способ
const { todos, createTodo } = useTodoStore();
const { user, logout } = useAuthStore();

// ❌ Больше не доступно - кастомные хуки удалены
// const { createTodo } = useCreateTodo(); // Ошибка!
```

### 2. **Обрабатывайте ошибки**
```typescript
const handleCreate = async () => {
  const result = await createTodo(todoData);
  if (!result) {
    // Ошибка уже установлена в store
    // Показать пользователю сообщение
  }
};
```

### 3. **Используйте состояния загрузки**
```typescript
const { isCreating, createTodo } = useTodoStore();

return (
  <Button 
    disabled={isCreating}
    onClick={handleCreate}
  >
    {isCreating ? 'Создание...' : 'Создать'}
  </Button>
);
```

### 4. **Очищайте ошибки**
```typescript
const { error, clearError } = useTodoStore();

useEffect(() => {
  if (error) {
    // Показать ошибку пользователю
    setTimeout(clearError, 5000); // Автоочистка через 5 сек
  }
}, [error, clearError]);
```

## Тестирование

### Тестирование Store
```typescript
import { useTodoStore } from '../store/todoStore';

test('should create todo', async () => {
  const { createTodo, todos } = useTodoStore.getState();
  
  await createTodo({ title: 'Test', description: 'Test desc' });
  
  expect(todos).toHaveLength(1);
  expect(todos[0].title).toBe('Test');
});
```

### Тестирование компонентов
```typescript
import { render, screen } from '@testing-library/react';
import { useTodoStore } from '../store/todoStore';

test('should display todos', () => {
  // Мокаем store
  useTodoStore.setState({
    todos: [{ id: '1', title: 'Test Todo' }],
    isFetching: false
  });
  
  render(<Board />);
  
  expect(screen.getByText('Test Todo')).toBeInTheDocument();
});
```

## Заключение

Новая архитектура с Zustand store обеспечивает:
- **Лучшую производительность** за счет оптимизированных ре-рендеров
- **Простота кода** за счет централизованного управления состоянием
- **Надежность** за счет единого источника истины
- **Масштабируемость** за счет модульной архитектуры

Все компоненты теперь используют store напрямую. Кастомные хуки полностью удалены для упрощения архитектуры.
