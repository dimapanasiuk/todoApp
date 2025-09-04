import axios from 'axios';
import { useState } from 'react';
import { setAuthToken } from '../api/api';

import api from '../api/api'

interface AuthHookResult {
  loading: boolean;
  error: string;
  success: string;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (email: string, password: string, confirmPassword: string) => Promise<void>;
}

export function useAuth(): AuthHookResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleLogin = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { accessToken, refreshToken } = await api.login(email, password);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAuthToken(accessToken);

      setSuccess('Login success!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message || 'Неверный email или пароль.');
        } else {
          setError('Нет ответа от сервера. Проверьте ваше подключение.');
        }
      } else {
        setError('Произошла непредвиденная ошибка. Попробуйте снова.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, confirmPassword: string): Promise<void> => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают!');
      setLoading(false);
      return;
    }

    try {
      const { accessToken, refreshToken } = await api.register({ email, password });

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAuthToken(accessToken);

      setSuccess('Registration is success!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message || 'Неверный email или пароль.');
        } else {
          setError('Нет ответа от сервера. Проверьте ваше подключение.');
        }
      } else {
        setError('Произошла непредвиденная ошибка.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, handleLogin, handleRegister };
}