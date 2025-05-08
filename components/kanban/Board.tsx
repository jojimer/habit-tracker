"use client";

import { useState, useRef } from "react";
import { Task } from "@/types/kanban";
import { Column } from "@/components/kanban/Column";
import { TaskDialog } from "@/components/kanban/TaskDialog";
import { useKanban } from "@/hooks/useKanban";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Board() {
  const { 
    board, 
    createTask, 
    editTask, 
    removeTask, 
    moveTaskBetweenColumns,
    searchTerm,
    setSearchTerm
  } = useKanban();

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("todo");
  
  const dragData = useRef<{ columnId: string; taskId: string } | null>(null);

  const handleAddTask = (columnId: string) => {
    setSelectedTask(undefined);
    setSelectedColumnId(columnId);
    setTaskDialogOpen(true);
  };

  const handleEditTask = (columnId: string, taskId: string) => {
    const column = board.columns.find((col) => col.id === columnId);
    const task = column?.tasks.find((t) => t.id === taskId);
    
    if (task) {
      setSelectedTask(task);
      setSelectedColumnId(columnId);
      setTaskDialogOpen(true);
    }
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      removeTask(columnId, taskId);
    }
  };

  const handleSaveTask = (
    columnId: string,
    taskData: {
      id?: string;
      title: string;
      description: string;
      priority: Task["priority"];
      dueDate?: string;
    }
  ) => {
    if (taskData.id) {
      editTask(columnId, taskData.id, taskData);
    } else {
      createTask(columnId, taskData);
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    columnId: string,
    taskId: string
  ) => {
    dragData.current = { columnId, taskId };
    e.dataTransfer.effectAllowed = "move";
    
    if (e.target instanceof HTMLElement) {
      requestAnimationFrame(() => {
        if (e.target instanceof HTMLElement) {
          e.target.style.opacity = "0.5";
        }
      });
    }
  };

  const handleQuickAddTodo = () => {
    setSelectedTask(undefined);
    setSelectedColumnId("todo");
    setTaskDialogOpen(true);
  };

  return (
    <div className="h-full py-4">
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Kanban Board</h1>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <ThemeToggle />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleQuickAddTodo} className="shrink-0">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Task</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8 overflow-x-auto pb-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-[320px]">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
      
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={selectedTask}
        columnId={selectedColumnId}
        onSave={handleSaveTask}
      />
    </div>
  );
}