"use client";

import { useState } from "react";
import { Habit } from "@/types/habits";
import { HabitCategory } from "@/components/habits/HabitCategory";
import { HabitDialog } from "@/components/habits/HabitDialog";
import { useHabits } from "@/hooks/useHabits";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface HabitBoardProps {
  viewMode: "categories" | "frequency";
}

export function HabitBoard({ viewMode }: HabitBoardProps) {
  const { 
    board, 
    createHabit,
    editHabit,
    removeHabit,
    toggleCompletion,
    searchTerm,
    setSearchTerm
  } = useHabits();

  const [habitDialogOpen, setHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("health");

  const getFrequencyCategories = () => {
    return [
      {
        id: "daily",
        title: "Daily Habits",
        habits: board.categories.flatMap(category => 
          category.habits.filter(habit => habit.frequency === "daily")
        )
      },
      {
        id: "weekly",
        title: "Weekly Habits",
        habits: board.categories.flatMap(category => 
          category.habits.filter(habit => habit.frequency === "weekly")
        )
      },
      {
        id: "monthly",
        title: "Monthly Habits",
        habits: board.categories.flatMap(category => 
          category.habits.filter(habit => habit.frequency === "monthly")
        )
      }
    ];
  };

  const displayedCategories = viewMode === "categories" 
    ? board.categories 
    : getFrequencyCategories();

  const handleAddHabit = (categoryId: string) => {
    setSelectedHabit(undefined);
    setSelectedCategoryId(categoryId);
    setHabitDialogOpen(true);
  };

  const handleEditHabit = (categoryId: string, habitId: string) => {
    let habit;
    if (viewMode === "categories") {
      const category = board.categories.find((cat) => cat.id === categoryId);
      habit = category?.habits.find((h) => h.id === habitId);
    } else {
      habit = board.categories
        .flatMap(cat => cat.habits)
        .find(h => h.id === habitId);
    }
    
    if (habit) {
      setSelectedHabit(habit);
      setSelectedCategoryId(habit.category);
      setHabitDialogOpen(true);
    }
  };

  const handleDeleteHabit = (categoryId: string, habitId: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      const habit = viewMode === "categories"
        ? board.categories.find(cat => cat.id === categoryId)?.habits.find(h => h.id === habitId)
        : board.categories.flatMap(cat => cat.habits).find(h => h.id === habitId);

      if (habit) {
        removeHabit(habit.category, habitId);
      }
    }
  };

  const handleToggleCompletion = (categoryId: string, habitId: string, date: string) => {
    if (viewMode === "categories") {
      toggleCompletion(categoryId, habitId, date);
    } else {
      // In frequency view, find the original category of the habit
      const habit = board.categories
        .flatMap(cat => cat.habits)
        .find(h => h.id === habitId);
      
      if (habit) {
        toggleCompletion(habit.category, habitId, date);
      }
    }
  };

  const handleSaveHabit = (
    categoryId: string,
    habitData: {
      id?: string;
      title: string;
      description: string;
      priority: Habit["priority"];
      frequency: Habit["frequency"];
      category: string;
    }
  ) => {
    if (habitData.id) {
      editHabit(categoryId, habitData.id, habitData);
    } else {
      createHabit(categoryId, habitData);
    }
  };

  const handleQuickAddHabit = () => {
    setSelectedHabit(undefined);
    setSelectedCategoryId("quick-add");
    setHabitDialogOpen(true);
  };

  return (
    <div className="h-full py-4">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Habit Tracker</h1>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search habits..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleQuickAddHabit} size="icon" className="h-10 w-10 sm:h-10 sm:w-auto sm:px-4">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Habit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new habit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-[320px]">
          {displayedCategories.map((category) => (
            <HabitCategory
              key={category.id}
              category={category}
              onAddHabit={handleAddHabit}
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
              onToggleCompletion={handleToggleCompletion}
              showCategoryTags={viewMode === "frequency"}
            />
          ))}
        </div>
      </div>
      
      <HabitDialog
        open={habitDialogOpen}
        onOpenChange={setHabitDialogOpen}
        habit={selectedHabit}
        categoryId={selectedCategoryId}
        defaultFrequency={viewMode === "frequency" ? displayedCategories.find(cat => cat.id === selectedCategoryId)?.id as Habit["frequency"] : undefined}
        onSave={handleSaveHabit}
        viewMode={viewMode}
      />
    </div>
  );
}