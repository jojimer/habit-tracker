"use client";

import { useState } from "react";
import { Column as ColumnType, Task as TaskType } from "@/types/kanban";
import { Task } from "@/components/kanban/Task";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColumnProps {
  column: ColumnType;
  onAddTask: (columnId: string) => void;
  onEditTask: (columnId: string, taskId: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onDragStart: (e: React.DragEvent, columnId: string, taskId: string) => void;
}

export function Column({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
}: ColumnProps) {
  const [isDropTarget, setIsDropTarget] = useState(false);

  const getHeaderColor = () => {
    switch (column.id) {
      case "todo":
        return "bg-blue-50 dark:bg-blue-950";
      case "in-progress":
        return "bg-amber-50 dark:bg-amber-950";
      case "done":
        return "bg-emerald-50 dark:bg-emerald-950";
      default:
        return "bg-gray-50 dark:bg-gray-900";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg bg-muted/30",
        "border shadow-sm transition-colors duration-200",
        "w-full sm:w-80 sm:min-w-[320px]",
        isDropTarget ? "ring-2 ring-primary/50 bg-muted/50" : ""
      )}
    >
      <div className={cn(
        "px-4 py-3 font-semibold rounded-t-lg flex justify-between items-center",
        getHeaderColor()
      )}>
        <div className="flex items-center gap-2">
          <h3>{column.title}</h3>
          <span className="text-xs bg-background px-2 py-0.5 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-180px)]">
        {column.tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm italic">
            <p>No tasks yet</p>
            <p>Drop a task here or add a new one</p>
          </div>
        ) : (
          column.tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              columnId={column.id}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}