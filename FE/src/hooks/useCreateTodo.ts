import { useEffect, useState } from "react";
import type { Task } from '../types';
import api from '../api/api';

export const useCreateTodo = (body: Task, trigger: boolean) => {
    const [data, setData] =  useState<Task>();
    const [isLoading , setIsLoading] = useState(false)
    const [error, setError] = useState('');

    useEffect(() => {
        if(!body.title) return;

        setIsLoading(true)
        setError('')

        const createData = async () => {
            const response = await api.createTodo(body)
            setData(response);
            setIsLoading(false)
        }

        try {
            createData()
        } catch (err: unknown) {
            setIsLoading(false)
            return (err instanceof Error) ? setError(err.message) : setError(err as string)             
        }finally {
            setIsLoading(false)
        } 

    }, [trigger]) 

    return {data, isLoading, error};
}