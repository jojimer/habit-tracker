"use client";

import { useState, useEffect } from "react";
import { HabitBoard, Habit, HabitPriority, HabitFrequency } from "@/types/habits";
import {
  getInitialHabits,
  saveHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
} from "@/lib/habit-utils";

export const useHabits = () => {
  const [board, setBoard] = useState<HabitBoard>({ categories: [] });
  const [initialized, setInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initialHabits = getInitialHabits();
    setBoard(initialHabits);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      saveHabits(board);
    }
  }, [board, initialized]);

  const createHabit = (
    categoryId: string,
    habit: {
      title: string;
      description: string;
      priority: HabitPriority;
      frequency: HabitFrequency;
      category: string;
    }
  ) => {
    const newBoard = addHabit(board, categoryId, habit);
    setBoard(newBoard);
  };

  const editHabit = (
    categoryId: string,
    habitId: string,
    updatedHabit: Partial<Habit>
  ) => {
    const newBoard = updateHabit(board, categoryId, habitId, updatedHabit);
    setBoard(newBoard);
  };

  const removeHabit = (categoryId: string, habitId: string) => {
    const newBoard = deleteHabit(board, categoryId, habitId);
    setBoard(newBoard);
  };

  const toggleCompletion = (categoryId: string, habitId: string, date: string) => {
    const newBoard = toggleHabitCompletion(board, categoryId, habitId, date);
    setBoard(newBoard);
  };

  const filteredBoard = (): HabitBoard => {
    if (!searchTerm.trim()) return board;

    const searchTermLower = searchTerm.toLowerCase();
    
    return {
      categories: board.categories.map(category => ({
        ...category,
        habits: category.habits.filter(habit => 
          habit.title.toLowerCase().includes(searchTermLower) ||
          habit.description.toLowerCase().includes(searchTermLower)
        )
      }))
    };
  };

  return {
    board: filteredBoard(),
    createHabit,
    editHabit,
    removeHabit,
    toggleCompletion,
    searchTerm,
    setSearchTerm
  };
};