import { type AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import type { Task, AuthResponse, RegisterData } from '../types';

class ApiService {
  constructor() {
    // Конструктор для будущих расширений
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  }

  public async register(body: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/register', body);
    return response.data;
  }

  public async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout');
  }

  public async getTodos(): Promise<Task[]> {
    const response: AxiosResponse<Task[]> = await axiosInstance.get('/todo');
    return response.data;
  }

  public async deleteTodo(id: string) {
    const response = await axiosInstance.delete(`/todo/${id}`);
    return response.data;
  }

  public async updateTodo (id: string, body: Partial<Task>) {
    const response: AxiosResponse<Task> = await axiosInstance.put(`/todo/${id}`, body);
    return response.data;
  }

  public async createTodo (body: Omit<Task, 'id' | 'userId'>) {
    const response: AxiosResponse<Task> = await axiosInstance.post("/todo", body);
    return response.data;
  }
}

const apiService = new ApiService();

export default apiService;


// TODO: не уверен чnо нам это вообще надо
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};