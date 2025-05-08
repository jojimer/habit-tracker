export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Board = {
  columns: Column[];
};