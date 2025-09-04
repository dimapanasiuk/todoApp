import { create } from 'zustand';
import { setAuthToken } from '@/api/api';
import api from '@/api/api';

interface User {
  id: number;
  email: string;
}

interface AuthState {
  // Состояние данных
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  
  // Состояния загрузки для отдельных операций
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
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Начальное состояние
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: null,
  isLoggingIn: false,
  isRegistering: false,
  isLoggingOut: false,

  // Вход в систему
  login: async (email, password) => {
    set({ isLoggingIn: true, error: null, success: null });
    
    try {
      const { accessToken } = await api.login(email, password);
      
      // Сохраняем только access токен (refresh токен в HttpOnly cookies)
      localStorage.setItem('accessToken', accessToken);
      setAuthToken(accessToken);
      
      // Получаем информацию о пользователе из токена или API
      const user = { id: 1, email }; // В реальном приложении можно декодировать из токена
      
      set({
        user,
        isAuthenticated: true,
        isLoggingIn: false,
        success: 'Вход выполнен успешно!'
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при входе в систему';
      set({ 
        error: errorMessage, 
        isLoggingIn: false,
        isAuthenticated: false,
        user: null
      });
      console.error('Login error:', error);
      return false;
    }
  },

  // Регистрация
  register: async (email, password, confirmPassword) => {
    set({ isRegistering: true, error: null, success: null });
    
    if (password !== confirmPassword) {
      set({ 
        error: 'Пароли не совпадают!', 
        isRegistering: false 
      });
      return false;
    }
    
    try {
      const { accessToken } = await api.register({ email, password });
      
      // Сохраняем только access токен (refresh токен в HttpOnly cookies)
      localStorage.setItem('accessToken', accessToken);
      setAuthToken(accessToken);
      
      // Получаем информацию о пользователе
      const user = { id: 1, email }; // В реальном приложении можно получить из API
      
      set({
        user,
        isAuthenticated: true,
        isRegistering: false,
        success: 'Регистрация выполнена успешно!'
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при регистрации';
      set({ 
        error: errorMessage, 
        isRegistering: false,
        isAuthenticated: false,
        user: null
      });
      console.error('Registration error:', error);
      return false;
    }
  },

  // Выход из системы
  logout: async () => {
    set({ isLoggingOut: true, error: null });
    
    try {
      // Вызываем API для удаления refresh токена из cookies
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Очищаем состояние независимо от результата API запроса
      localStorage.removeItem('accessToken');
      setAuthToken('');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoggingOut: false,
        success: 'Выход выполнен успешно!'
      });
    }
  },

  // Проверка аутентификации при загрузке приложения
  checkAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      setAuthToken(accessToken);
      set({ 
        isAuthenticated: true,
        user: { id: 1, email: 'get data from token' } // В реальном приложении декодировать из токена
      });
    } else {
      set({ 
        isAuthenticated: false,
        user: null
      });
    }
  },

  // Утилиты
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
}));
