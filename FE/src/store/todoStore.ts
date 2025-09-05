import { create } from 'zustand';
import type { Task } from '@/types';
import api from '@/api/api';

interface TodoState {
  // Состояние данных
  todos: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Состояния загрузки для отдельных операций
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

export const useTodoStore = create<TodoState>((set) => ({
  // Начальное состояние
  todos: [],
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isFetching: false,

  // Получение всех задач
  fetchTodos: async () => {
    set({ isFetching: true, error: null });
    
    try {
      const todos = await api.getTodos();
      set({ todos: Array.isArray(todos) ? todos : [], isFetching: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при загрузке задач';
      set({ error: errorMessage, isFetching: false });
      console.error('Error fetching todos:', error);
    }
  },

  // Создание новой задачи
  createTodo: async (todoData) => {
    set({ isCreating: true, error: null });
    
    try {
      const newTodo = await api.createTodo(todoData);
      
      // Добавляем новую задачу в состояние
      set((state) => ({
        todos: [newTodo, ...state.todos],
        isCreating: false
      }));
      
      return newTodo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании задачи';
      set({ error: errorMessage, isCreating: false });
      console.error('Error creating todo:', error);
      return null;
    }
  },

  // Обновление задачи
  updateTodo: async (id, todoData) => {
    set({ isUpdating: true, error: null });
    
    try {
      const updatedTodo = await api.updateTodo(id, todoData);
      
      // Обновляем задачу в состоянии
      set((state) => ({
        todos: state.todos.map(todo => 
          todo.id === id ? updatedTodo : todo
        ),
        isUpdating: false
      }));
      
      return updatedTodo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении задачи';
      set({ error: errorMessage, isUpdating: false });
      console.error('Error updating todo:', error);
      return null;
    }
  },

  // Удаление задачи
  deleteTodo: async (id) => {
    set({ isDeleting: true, error: null });
    
    try {
      await api.deleteTodo(id);
      
      // Удаляем задачу из состояния
      set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id),
        isDeleting: false
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении задачи';
      set({ error: errorMessage, isDeleting: false });
      console.error('Error deleting todo:', error);
      return false;
    }
  },

  // Утилиты
  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),
}));
