"use client";

import { useState, useEffect } from "react";
import { Habit, HabitPriority, HabitFrequency } from "@/types/habits";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit;
  categoryId: string;
  defaultFrequency?: HabitFrequency;
  onSave: (
    categoryId: string,
    habitData: {
      id?: string;
      title: string;
      description: string;
      priority: HabitPriority;
      frequency: HabitFrequency;
      category: string;
    }
  ) => void;
  viewMode?: "categories" | "frequency";
}

export function HabitDialog({
  open,
  onOpenChange,
  habit,
  categoryId,
  defaultFrequency = "daily",
  onSave,
  viewMode = "categories"
}: HabitDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<HabitPriority>("medium");
  const [frequency, setFrequency] = useState<HabitFrequency>(defaultFrequency);
  const [selectedCategory, setSelectedCategory] = useState(categoryId);

  const isEditing = !!habit;
  const isQuickAdd = categoryId === "quick-add";

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setDescription(habit.description);
      setPriority(habit.priority);
      setFrequency(habit.frequency);
      setSelectedCategory(habit.category);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setFrequency(viewMode === "frequency" && !isQuickAdd ? categoryId as HabitFrequency : defaultFrequency);
      setSelectedCategory(viewMode === "frequency" && !isQuickAdd ? "health" : categoryId);
    }
  }, [habit, open, defaultFrequency, categoryId, viewMode, isQuickAdd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave(selectedCategory, {
      id: habit?.id,
      title,
      description,
      priority,
      frequency: viewMode === "frequency" && !isQuickAdd ? categoryId as HabitFrequency : frequency,
      category: selectedCategory,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Habit" : "Create New Habit"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="required">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Habit title"
                required
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Habit description"
                className="col-span-3 min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">
                  Priority
                </Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as HabitPriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="personal">Personal Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(isQuickAdd || viewMode === "categories") && (
                <div className="grid gap-2 col-span-2">
                  <Label>
                    Frequency
                  </Label>
                  <Select
                    value={frequency}
                    onValueChange={(value) => setFrequency(value as HabitFrequency)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim()}
            >
              {isEditing ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}