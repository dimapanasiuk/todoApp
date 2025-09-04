export enum priorityTaskEnum  {
  IN_PROGRES = 'in progress',
  DONE = 'done',
  TODO = 'todo',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: string;
  deadlineDate: number;
  status: priorityTaskEnum
  priority: number;
  color: string;
  userId: number;
}
 
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
  
export interface RegisterData {
  email: string;
  password: string;
}