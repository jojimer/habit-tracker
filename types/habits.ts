export type HabitPriority = 'low' | 'medium' | 'high';

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export type HabitCompletion = {
  date: string;
  completed: boolean;
};

export type Habit = {
  id: string;
  title: string;
  description: string;
  priority: HabitPriority;
  frequency: HabitFrequency;
  category: string;
  createdAt: string;
  completedDates: string[];
  completionHistory: HabitCompletion[];
};

export type Category = {
  id: string;
  title: string;
  habits: Habit[];
};

export type HabitBoard = {
  categories: Category[];
};