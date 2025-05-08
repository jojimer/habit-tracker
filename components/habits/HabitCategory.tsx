"use client";

import { Category, Habit } from "@/types/habits";
import { HabitItem } from "@/components/habits/HabitItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryProps {
  category: Category;
  onAddHabit: (categoryId: string) => void;
  onEditHabit: (categoryId: string, habitId: string) => void;
  onDeleteHabit: (categoryId: string, habitId: string) => void;
  onToggleCompletion: (categoryId: string, habitId: string, date: string) => void;
  showCategoryTags?: boolean;
}

export function HabitCategory({
  category,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onToggleCompletion,
  showCategoryTags = false,
}: CategoryProps) {
  const getHeaderColor = () => {
    switch (category.id) {
      case "health":
        return "bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-700 dark:text-blue-300";
      case "productivity":
        return "bg-gradient-to-r from-amber-500/10 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-600/20 text-amber-700 dark:text-amber-300";
      case "personal":
        return "bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 text-emerald-700 dark:text-emerald-300";
      case "daily":
        return "bg-gradient-to-r from-violet-500/10 to-violet-600/10 dark:from-violet-500/20 dark:to-violet-600/20 text-violet-700 dark:text-violet-300";
      case "weekly":
        return "bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-600/10 dark:from-fuchsia-500/20 dark:to-fuchsia-600/20 text-fuchsia-700 dark:text-fuchsia-300";
      case "monthly":
        return "bg-gradient-to-r from-rose-500/10 to-rose-600/10 dark:from-rose-500/20 dark:to-rose-600/20 text-rose-700 dark:text-rose-300";
      default:
        return "bg-gradient-to-r from-gray-500/10 to-gray-600/10 dark:from-gray-500/20 dark:to-gray-600/20 text-gray-700 dark:text-gray-300";
    }
  };

  const getBorderColor = () => {
    switch (category.id) {
      case "health":
        return "border-blue-200 dark:border-blue-900";
      case "productivity":
        return "border-amber-200 dark:border-amber-900";
      case "personal":
        return "border-emerald-200 dark:border-emerald-900";
      case "daily":
        return "border-violet-200 dark:border-violet-900";
      case "weekly":
        return "border-fuchsia-200 dark:border-fuchsia-900";
      case "monthly":
        return "border-rose-200 dark:border-rose-900";
      default:
        return "border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg bg-white dark:bg-gray-950",
        "border shadow-sm transition-colors duration-200",
        "w-full sm:w-80 sm:min-w-[320px]",
        getBorderColor()
      )}
    >
      <div className={cn(
        "px-4 py-3 font-semibold rounded-t-lg flex justify-between items-center",
        getHeaderColor()
      )}>
        <div className="flex items-center gap-2">
          <h3>{category.title}</h3>
          <span className="text-xs bg-white/90 dark:bg-gray-900/90 px-2 py-0.5 rounded-full">
            {category.habits.length}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => onAddHabit(category.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-180px)]">
        {category.habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm italic">
            <p>No habits yet</p>
            <p>Click the + button to add a new habit</p>
          </div>
        ) : (
          category.habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              categoryId={category.id}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
              onToggleCompletion={onToggleCompletion}
              showCategory={showCategoryTags}
            />
          ))
        )}
      </div>
    </div>
  );
}