"use client";

import { Task as TaskType } from "@/types/kanban";
import { formatDate, getPriorityColor } from "@/lib/kanban-utils";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarIcon, 
  Pencil, 
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskProps {
  task: TaskType;
  columnId: string;
  onEdit: (columnId: string, taskId: string) => void;
  onDelete: (columnId: string, taskId: string) => void;
  onDragStart: (e: React.DragEvent, columnId: string, taskId: string) => void;
}

export function Task({ 
  task, 
  columnId, 
  onEdit, 
  onDelete, 
  onDragStart 
}: TaskProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const priorityColor = getPriorityColor(task.priority);
  const formattedDate = task.dueDate ? formatDate(task.dueDate) : null;

  return (
    <Card
      className={cn(
        "mb-3 transition-all duration-200",
        "hover:shadow-md hover:-translate-y-1",
        "relative group"
      )}
      draggable
      onDragStart={(e) => onDragStart(e, columnId, task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-0 top-0 w-1 h-full rounded-l-md transition-opacity duration-200"
        style={{ backgroundColor: `var(--${task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'chart-4' : 'chart-2'})` }}
      />
      
      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 flex-1">
            {task.title}
          </h3>
          
          <div className={cn(
            "flex sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
            isHovered ? "opacity-100" : ""
          )}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => onEdit(columnId, task.id)}
                  >
                    <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit task</p>
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
                    onClick={() => onDelete(columnId, task.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-2 line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className={cn(
              "inline-block w-2 h-2 rounded-full mr-1",
              priorityColor
            )} />
            <span className="text-xs capitalize">
              {task.priority}
            </span>
          </div>
          
          {formattedDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}