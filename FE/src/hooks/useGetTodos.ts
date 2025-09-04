import { useEffect, useState } from "react";
import axios from 'axios';
import type { Task } from '../types';
import api from '../api/api';

export const useGetTodos = (): [Task[], boolean, string] => {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.getTodos();
        setData(response);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          // Более точная обработка ошибок Axios
          setError(err.response?.data?.message || err.message);
        } else if (err instanceof Error) {
          // Обработка других типов ошибок
          setError(err.message);
        } else {
          setError('Произошла непредвиденная ошибка.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, []); // Добавляем url в зависимости, чтобы хук перезапускался при его изменении

  return [data, isLoading, error];
};