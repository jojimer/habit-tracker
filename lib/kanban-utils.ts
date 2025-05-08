import { Board, Column, Task, TaskPriority } from "@/types/kanban";

// Generate a unique ID for tasks
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Get the initial board data
export const getInitialBoard = (): Board => {
  if (typeof window !== "undefined") {
    const savedBoard = localStorage.getItem("kanbanBoard");
    if (savedBoard) {
      return JSON.parse(savedBoard);
    }
  }

  // Default tasks for demonstration
  const defaultTasks: { columnId: string; task: Omit<Task, "id" | "createdAt"> }[] = [
    {
      columnId: "todo",
      task: {
        title: "Design User Interface",
        description: "Create wireframes and mockups for the new dashboard layout",
        priority: "high",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      },
    },
    {
      columnId: "todo",
      task: {
        title: "Write Documentation",
        description: "Document the API endpoints and usage examples",
        priority: "medium",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "todo",
      task: {
        title: "Review Pull Requests",
        description: "Review and merge pending pull requests from the team",
        priority: "low",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "todo",
      task: {
        title: "Update Dependencies",
        description: "Update project dependencies to their latest stable versions",
        priority: "medium",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "in-progress",
      task: {
        title: "Implement Authentication",
        description: "Add user authentication and authorization features",
        priority: "high",
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "in-progress",
      task: {
        title: "Optimize Performance",
        description: "Improve application loading times and overall performance",
        priority: "medium",
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "in-progress",
      task: {
        title: "Write Unit Tests",
        description: "Add comprehensive unit tests for core functionality",
        priority: "medium",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "in-progress",
      task: {
        title: "Setup CI/CD Pipeline",
        description: "Configure automated testing and deployment workflow",
        priority: "high",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "done",
      task: {
        title: "Project Setup",
        description: "Initialize project repository and development environment",
        priority: "high",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "done",
      task: {
        title: "Database Schema",
        description: "Design and implement initial database schema",
        priority: "high",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "done",
      task: {
        title: "API Design",
        description: "Design RESTful API endpoints and documentation",
        priority: "medium",
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      columnId: "done",
      task: {
        title: "Requirements Gathering",
        description: "Collect and document project requirements",
        priority: "medium",
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  ];

  const initialColumns: Column[] = [
    {
      id: "todo",
      title: "To Do",
      tasks: [],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [],
    },
    {
      id: "done",
      title: "Done",
      tasks: [],
    },
  ];

  // Add default tasks to their respective columns
  defaultTasks.forEach(({ columnId, task }) => {
    const column = initialColumns.find((col) => col.id === columnId);
    if (column) {
      column.tasks.push({
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
      });
    }
  });

  return {
    columns: initialColumns,
  };
};

// Save board data to local storage
export const saveBoard = (board: Board): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("kanbanBoard", JSON.stringify(board));
  }
};

// Add a new task to a column
export const addTask = (
  board: Board,
  columnId: string,
  task: Omit<Task, "id" | "createdAt">
): Board => {
  const newBoard = { ...board };
  const columnIndex = newBoard.columns.findIndex((col) => col.id === columnId);

  if (columnIndex !== -1) {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    newBoard.columns[columnIndex].tasks = [
      ...newBoard.columns[columnIndex].tasks,
      newTask,
    ];
  }

  return newBoard;
};

// Update an existing task
export const updateTask = (
  board: Board,
  columnId: string,
  taskId: string,
  updatedTask: Partial<Task>
): Board => {
  const newBoard = { ...board };
  const columnIndex = newBoard.columns.findIndex((col) => col.id === columnId);

  if (columnIndex !== -1) {
    const taskIndex = newBoard.columns[columnIndex].tasks.findIndex(
      (task) => task.id === taskId
    );

    if (taskIndex !== -1) {
      newBoard.columns[columnIndex].tasks[taskIndex] = {
        ...newBoard.columns[columnIndex].tasks[taskIndex],
        ...updatedTask,
      };
    }
  }

  return newBoard;
};

// Delete a task
export const deleteTask = (
  board: Board,
  columnId: string,
  taskId: string
): Board => {
  const newBoard = { ...board };
  const columnIndex = newBoard.columns.findIndex((col) => col.id === columnId);

  if (columnIndex !== -1) {
    newBoard.columns[columnIndex].tasks = newBoard.columns[
      columnIndex
    ].tasks.filter((task) => task.id !== taskId);
  }

  return newBoard;
};

// Move a task from one column to another
export const moveTask = (
  board: Board,
  sourceColumnId: string,
  destinationColumnId: string,
  taskId: string
): Board => {
  const newBoard = { ...board };
  const sourceColumnIndex = newBoard.columns.findIndex(
    (col) => col.id === sourceColumnId
  );
  const destinationColumnIndex = newBoard.columns.findIndex(
    (col) => col.id === destinationColumnId
  );

  if (sourceColumnIndex !== -1 && destinationColumnIndex !== -1) {
    const taskIndex = newBoard.columns[sourceColumnIndex].tasks.findIndex(
      (task) => task.id === taskId
    );

    if (taskIndex !== -1) {
      const task = newBoard.columns[sourceColumnIndex].tasks[taskIndex];
      
      // Remove from source column
      newBoard.columns[sourceColumnIndex].tasks = newBoard.columns[
        sourceColumnIndex
      ].tasks.filter((task) => task.id !== taskId);
      
      // Add to destination column
      newBoard.columns[destinationColumnIndex].tasks.push(task);
    }
  }

  return newBoard;
};

// Get priority color
export const getPriorityColor = (priority: TaskPriority): string => {
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

// Format date
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};