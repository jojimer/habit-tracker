import { HabitBoard, Category, Habit, HabitPriority, HabitFrequency } from "@/types/habits";
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval,
  isBefore,
  parseISO,
  isToday,
  isSameDay,
  isSameWeek,
  isSameMonth,
  eachDayOfInterval,
  subDays,
  format,
  isAfter,
  endOfPeriod
} from "date-fns";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Get the end of the current period based on frequency
const getCurrentPeriodEnd = (date: Date, frequency: HabitFrequency): Date => {
  switch (frequency) {
    case 'daily':
      return endOfDay(date);
    case 'weekly':
      return endOfWeek(date);
    case 'monthly':
      return endOfMonth(date);
  }
};

export const getInitialHabits = (): HabitBoard => {
  if (typeof window !== "undefined") {
    const savedHabits = localStorage.getItem("habitBoard");
    if (savedHabits) {
      const board = JSON.parse(savedHabits);
      
      // Process each habit to handle period transitions
      board.categories.forEach(category => {
        category.habits.forEach(habit => {
          const now = new Date();
          const currentPeriodEnd = getCurrentPeriodEnd(now, habit.frequency);

          // Move completed dates to history if they're from a previous period
          habit.completedDates = habit.completedDates.filter(date => {
            const completionDate = parseISO(date);
            const isCurrentPeriod = (() => {
              switch (habit.frequency) {
                case 'daily':
                  return isToday(completionDate);
                case 'weekly':
                  return isSameWeek(completionDate, now);
                case 'monthly':
                  return isSameMonth(completionDate, now);
              }
            })();

            if (!isCurrentPeriod) {
              // Add to history if not already there
              const historyEntry = habit.completionHistory.find(h => h.date === date);
              if (!historyEntry) {
                habit.completionHistory.push({
                  date,
                  completed: true
                });
              }
              return false;
            }
            return true;
          });
        });
      });
      return board;
    }
  }

  const defaultHabits: { categoryId: string; habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "completionHistory"> }[] = [
    {
      categoryId: "health",
      habit: {
        title: "Morning Exercise",
        description: "30 minutes of cardio or strength training",
        priority: "high",
        frequency: "daily",
        category: "health",
      },
    },
    {
      categoryId: "health",
      habit: {
        title: "Meditation",
        description: "15 minutes mindfulness practice",
        priority: "medium",
        frequency: "daily",
        category: "health",
      },
    },
    {
      categoryId: "health",
      habit: {
        title: "Weekly Meal Prep",
        description: "Prepare healthy meals for the week",
        priority: "medium",
        frequency: "weekly",
        category: "health",
      },
    },
    {
      categoryId: "productivity",
      habit: {
        title: "Code Practice",
        description: "1 hour of coding practice",
        priority: "high",
        frequency: "daily",
        category: "productivity",
      },
    },
    {
      categoryId: "productivity",
      habit: {
        title: "Project Planning",
        description: "Review and update project timelines",
        priority: "medium",
        frequency: "weekly",
        category: "productivity",
      },
    },
    {
      categoryId: "personal",
      habit: {
        title: "Reading",
        description: "Read for 30 minutes",
        priority: "medium",
        frequency: "daily",
        category: "personal",
      },
    },
    {
      categoryId: "personal",
      habit: {
        title: "Monthly Goal Review",
        description: "Review and adjust personal goals",
        priority: "high",
        frequency: "monthly",
        category: "personal",
      },
    }
  ];

  const initialCategories: Category[] = [
    {
      id: "health",
      title: "Health & Wellness",
      habits: [],
    },
    {
      id: "productivity",
      title: "Productivity",
      habits: [],
    },
    {
      id: "personal",
      title: "Personal Growth",
      habits: [],
    },
  ];

  // Generate historical data from January 1, 2025
  const generateHistoricalData = (frequency: HabitFrequency) => {
    const startDate = new Date(2025, 0, 1); // January 1, 2025
    const endDate = subDays(new Date(), 1); // Yesterday (historical data ends before today)
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      let completed = false;

      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();

      switch (frequency) {
        case 'daily':
          // Complete on most days (80% completion rate)
          completed = Math.random() < 0.8;
          break;

        case 'weekly':
          // Complete on most weeks (85% completion rate)
          if (dayOfWeek === 1) { // Monday
            completed = Math.random() < 0.85;
          }
          break;

        case 'monthly':
          // Complete most months (90% completion rate)
          if (dayOfMonth === 1) {
            completed = Math.random() < 0.9;
          }
          break;
      }
      
      return {
        date: dateStr,
        completed
      };
    });
  };

  defaultHabits.forEach(({ categoryId, habit }) => {
    const category = initialCategories.find((cat) => cat.id === categoryId);
    if (category) {
      const historicalData = generateHistoricalData(habit.frequency);
      
      category.habits.push({
        ...habit,
        id: generateId(),
        createdAt: "2025-01-01T00:00:00.000Z",
        completedDates: [], // Start with empty current period
        completionHistory: historicalData,
      });
    }
  });

  return {
    categories: initialCategories,
  };
};

export const saveHabits = (board: HabitBoard): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("habitBoard", JSON.stringify(board));
  }
};

export const addHabit = (
  board: HabitBoard,
  categoryId: string,
  habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "completionHistory">
): HabitBoard => {
  const newBoard = { ...board };
  const categoryIndex = newBoard.categories.findIndex((cat) => cat.id === categoryId);

  if (categoryIndex !== -1) {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      completionHistory: [],
    };

    newBoard.categories[categoryIndex].habits = [
      ...newBoard.categories[categoryIndex].habits,
      newHabit,
    ];
  }

  return newBoard;
};

export const updateHabit = (
  board: HabitBoard,
  categoryId: string,
  habitId: string,
  updatedHabit: Partial<Habit>
): HabitBoard => {
  const newBoard = { ...board };
  const categoryIndex = newBoard.categories.findIndex((cat) => cat.id === categoryId);

  if (categoryIndex !== -1) {
    const habitIndex = newBoard.categories[categoryIndex].habits.findIndex(
      (habit) => habit.id === habitId
    );

    if (habitIndex !== -1) {
      newBoard.categories[categoryIndex].habits[habitIndex] = {
        ...newBoard.categories[categoryIndex].habits[habitIndex],
        ...updatedHabit,
      };
    }
  }

  return newBoard;
};

export const deleteHabit = (
  board: HabitBoard,
  categoryId: string,
  habitId: string
): HabitBoard => {
  const newBoard = { ...board };
  const categoryIndex = newBoard.categories.findIndex((cat) => cat.id === categoryId);

  if (categoryIndex !== -1) {
    newBoard.categories[categoryIndex].habits = newBoard.categories[
      categoryIndex
    ].habits.filter((habit) => habit.id !== habitId);
  }

  return newBoard;
};

export const toggleHabitCompletion = (
  board: HabitBoard,
  categoryId: string,
  habitId: string,
  date: string
): HabitBoard => {
  if (!board || !board.categories) {
    return board;
  }

  const newBoard = { ...board };
  const categoryIndex = newBoard.categories.findIndex((cat) => cat.id === categoryId);

  if (categoryIndex === -1) {
    return newBoard;
  }

  const category = newBoard.categories[categoryIndex];
  if (!category || !category.habits) {
    return newBoard;
  }

  const habitIndex = category.habits.findIndex((habit) => habit.id === habitId);

  if (habitIndex === -1) {
    return newBoard;
  }

  const habit = category.habits[habitIndex];
  if (!habit.completedDates) {
    habit.completedDates = [];
  }
  if (!habit.completionHistory) {
    habit.completionHistory = [];
  }

  const completionDate = parseISO(date);
  const now = new Date();

  // Check if the date is in the current period
  const isCurrentPeriod = (() => {
    switch (habit.frequency) {
      case 'daily':
        return isToday(completionDate);
      case 'weekly':
        return isSameWeek(completionDate, now);
      case 'monthly':
        return isSameMonth(completionDate, now);
      default:
        return false;
    }
  })();

  if (isCurrentPeriod) {
    // Handle current period completion
    const dateIndex = habit.completedDates.indexOf(date);
    if (dateIndex === -1) {
      // Add to current period completions
      habit.completedDates.push(date);
    } else {
      // Remove from current period completions
      habit.completedDates = habit.completedDates.filter(d => d !== date);
    }
  } else {
    // Handle historical completion
    const historyIndex = habit.completionHistory.findIndex(h => h.date === date);
    if (historyIndex === -1) {
      // Add new historical entry
      habit.completionHistory.push({
        date,
        completed: true
      });
    } else {
      // Toggle historical entry
      habit.completionHistory[historyIndex].completed = 
        !habit.completionHistory[historyIndex].completed;
    }
  }

  return newBoard;
};

export const getPriorityColor = (priority: HabitPriority): string => {
  switch (priority) {
    case "low":
      return "bg-emerald-500";
    case "medium":
      return "bg-amber-500";
    case "high":
      return "bg-rose-500";
    default:
      return "bg-slate-500";
  }
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

export const isHabitCompletedForDate = (habit: Habit, date: string): boolean => {
  if (!habit || !habit.completedDates || !Array.isArray(habit.completedDates)) {
    return false;
  }

  if (!habit.completionHistory || !Array.isArray(habit.completionHistory)) {
    return false;
  }

  const completionDate = parseISO(date);
  const now = new Date();
  
  // Check current period completions first
  const isCurrentPeriod = (() => {
    switch (habit.frequency) {
      case 'daily':
        return isToday(completionDate);
      case 'weekly':
        return isSameWeek(completionDate, now);
      case 'monthly':
        return isSameMonth(completionDate, now);
      default:
        return false;
    }
  })();

  if (isCurrentPeriod) {
    return habit.completedDates.includes(date);
  }

  // Check historical completions
  const historyEntry = habit.completionHistory.find(h => h.date === date);
  return historyEntry ? historyEntry.completed : false;
};

export const getCompletionRate = (habit: Habit, startDate: Date, endDate: Date): number => {
  if (!habit.completionHistory || !Array.isArray(habit.completionHistory)) {
    return 0;
  }

  const completions = habit.completionHistory.filter(completion => {
    const completionDate = new Date(completion.date);
    return isWithinInterval(completionDate, { start: startDate, end: endDate }) && completion.completed;
  });

  const total = habit.completionHistory.filter(completion => {
    const completionDate = new Date(completion.date);
    return isWithinInterval(completionDate, { start: startDate, end: endDate });
  });

  return total.length > 0 ? (completions.length / total.length) * 100 : 0;
};