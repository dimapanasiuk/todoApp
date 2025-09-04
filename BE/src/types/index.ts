export interface UserType {
  id: string;
  email: string;
  password?: string;
}

export interface UserAuthDataType {
  id: string;
  userId: string;
  token: string
  createdAt: Date
}

// Расширяем стандартный тип Request
// Это позволит нам добавлять новые свойства
declare module 'express-serve-static-core' {
  interface Request {
    user: UserAuthDataType;
  }
}

export type TodoStatus = "pending" | "in progress" | "completed";

export type TodoPriority = 1 | 2 | 3 | 4 | 5;

export interface TodoType {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  deadlineDate: number;
  status: TodoStatus;
  priority: TodoPriority;
  color: string;
  userId: string;
}
