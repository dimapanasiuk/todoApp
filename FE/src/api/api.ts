import { type AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import type { Task, AuthResponse, RegisterData } from '../types';

const apiUrl = import.meta.env.VITE_API_URL

class ApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  }

  public async register(body: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/register', body);
    return response.data;
  }

  public async logout(token: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/logout', { token });
    return response.data;
  }

  public async getTodos(): Promise<Task[]> {
    const response: AxiosResponse<Task[]> = await axiosInstance.get('/todo');
    return response.data;
  }

  public async deleteTodo(id: string) {
    const response = await axiosInstance.delete(`${this.baseUrl}/todo/${id}`);
    return response.data;
  }

  public async updateTodo (id: string, body: Task) {
    const response: AxiosResponse<Task> = await axiosInstance.put(`${this.baseUrl}/todo/${id}`, body);
    return response.data;
  }

  public async createTodo (body: Task) {
    const response: AxiosResponse<Task> = await axiosInstance.post("/todo", body);
    return response.data;
  }
}

const apiService = new ApiService(apiUrl);

export default apiService;


// TODO: не уверен чnо нам это вообще надо
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};