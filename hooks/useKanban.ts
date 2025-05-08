"use client";

import { useEffect, useState } from "react";
import { 
  Board, 
  Task, 
  TaskPriority 
} from "@/types/kanban";
import { 
  getInitialBoard, 
  saveBoard, 
  addTask, 
  updateTask, 
  deleteTask, 
  moveTask 
} from "@/lib/kanban-utils";

export const useKanban = () => {
  const [board, setBoard] = useState<Board>({ columns: [] });
  const [initialized, setInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize board data
  useEffect(() => {
    const initialBoard = getInitialBoard();
    setBoard(initialBoard);
    setInitialized(true);
  }, []);

  // Save board data when it changes
  useEffect(() => {
    if (initialized) {
      saveBoard(board);
    }
  }, [board, initialized]);

  // Create a new task
  const createTask = (
    columnId: string,
    task: { title: string; description: string; priority: TaskPriority; dueDate?: string }
  ) => {
    const newBoard = addTask(board, columnId, task);
    setBoard(newBoard);
  };

  // Update an existing task
  const editTask = (
    columnId: string,
    taskId: string,
    updatedTask: Partial<Task>
  ) => {
    const newBoard = updateTask(board, columnId, taskId, updatedTask);
    setBoard(newBoard);
  };

  // Remove a task
  const removeTask = (columnId: string, taskId: string) => {
    const newBoard = deleteTask(board, columnId, taskId);
    setBoard(newBoard);
  };

  // Move a task between columns
  const moveTaskBetweenColumns = (
    sourceColumnId: string,
    destinationColumnId: string,
    taskId: string
  ) => {
    const newBoard = moveTask(board, sourceColumnId, destinationColumnId, taskId);
    setBoard(newBoard);
  };

  // Filter tasks based on search term
  const filteredBoard = (): Board => {
    if (!searchTerm.trim()) return board;

    const searchTermLower = searchTerm.toLowerCase();
    
    return {
      columns: board.columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => 
          task.title.toLowerCase().includes(searchTermLower) ||
          task.description.toLowerCase().includes(searchTermLower)
        )
      }))
    };
  };

  return {
    board: filteredBoard(),
    createTask,
    editTask,
    removeTask,
    moveTaskBetweenColumns,
    searchTerm,
    setSearchTerm
  };
};