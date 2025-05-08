"use client";

import { useState } from "react";
import { Habit } from "@/types/habits";
import { getPriorityColor, formatDate, isHabitCompletedForDate } from "@/lib/habit-utils";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarIcon, 
  Pencil, 
  Trash2,
  CheckCircle2,
  XCircle,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HabitProps {
  habit: Habit;
  categoryId: string;
  onEdit: (categoryId: string, habitId: string) => void;
  onDelete: (categoryId: string, habitId: string) => void;
  onToggleCompletion: (categoryId: string, habitId: string, date: string) => void;
  showCategory?: boolean;
}

export function HabitItem({ 
  habit, 
  categoryId, 
  onEdit, 
  onDelete,
  onToggleCompletion,
  showCategory = false
}: HabitProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCompleteButtonHovered, setIsCompleteButtonHovered] = useState(false);
  
  const priorityColor = getPriorityColor(habit.priority);
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = isHabitCompletedForDate(habit, today);

  const getCategoryColor = () => {
    switch (habit.category) {
      case "health":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "productivity":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "personal":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getFrequencyColor = () => {
    switch (habit.frequency) {
      case "daily":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200";
      case "weekly":
        return "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200";
      case "monthly":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card
      className={cn(
        "mb-3 transition-all duration-200",
        "hover:shadow-md hover:-translate-y-1",
        "relative group"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-0 top-0 w-1 h-full rounded-l-md transition-opacity duration-200"
        style={{ backgroundColor: `var(--${habit.priority === 'high' ? 'destructive' : habit.priority === 'medium' ? 'chart-4' : 'chart-2'})` }}
      />
      
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 flex-1">
            {habit.title}
          </h3>
          {isCompleted && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 whitespace-nowrap">
              Completed
            </span>
          )}
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
          {habit.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1">
              <span className={cn(
                "inline-block w-2 h-2 rounded-full",
                priorityColor
              )} />
              <span className="text-xs capitalize">
                {habit.priority}
              </span>
            </div>
            {!showCategory && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                getFrequencyColor()
              )}>
                {habit.frequency}
              </span>
            )}
            {showCategory && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                getCategoryColor()
              )}>
                <span className="capitalize">{habit.category.replace("-", " ")}</span>
              </span>
            )}
          </div>

          <div className={cn(
            "flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
            isHovered ? "opacity-100" : ""
          )}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7 sm:h-8 sm:w-8",
                      isCompleted ? 
                        isCompleteButtonHovered ? 
                          "text-destructive hover:text-destructive/90" : 
                          "text-emerald-500" 
                        : "text-muted-foreground hover:text-emerald-500"
                    )}
                    onClick={() => onToggleCompletion(categoryId, habit.id, today)}
                    onMouseEnter={() => setIsCompleteButtonHovered(true)}
                    onMouseLeave={() => setIsCompleteButtonHovered(false)}
                  >
                    {isCompleted && isCompleteButtonHovered ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCompleted ? "Mark as incomplete" : "Mark as complete"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => onEdit(categoryId, habit.id)}
                  >
                    <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit habit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-destructive"
                    onClick={() => onDelete(categoryId, habit.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete habit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}