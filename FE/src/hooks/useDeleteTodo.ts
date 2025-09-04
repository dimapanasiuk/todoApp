import { useState } from "react";
import api from '../api/api'
 
export const useDeleteTodo = () => {
	const [isLoading , setIsLoading] = useState(false)
	const [error, setError] = useState('');

  const deleteData = async (id: string) => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError("");

      api.deleteTodo(id)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {deleteData, isLoading, error};
}