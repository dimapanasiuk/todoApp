import { useState } from "react";
import type { Task } from '../types';
import api from '../api/api';

export const useUpdateTodo = () => {
    const [data, setData] = useState<Task>();
    const [isLoading , setIsLoading] = useState(false)
    const [error, setError] = useState('');

    const updateTodo = async (id: string, body: Task) => {
      setIsLoading(true)
      setError('')
    try {
      const resData = await api.updateTodo(id, body)
      setData(resData);
      setIsLoading(false)
    } catch (err: unknown) {
        setIsLoading(false)
        return (err instanceof Error) ? setError(err.message) : setError(err as string)             
    }finally {
        setIsLoading(false)
    } 
  }

  return {updateTodo, data, isLoading, error};
}