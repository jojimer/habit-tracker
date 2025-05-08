"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, Clock } from "lucide-react";

interface ViewToggleProps {
  value: string;
  onValueChange: (value: "categories" | "frequency") => void;
}

export function ViewToggle({ value, onValueChange }: ViewToggleProps) {
  return (
    <ToggleGroup type="single" value={value} onValueChange={onValueChange} className="justify-start h-10">
      <ToggleGroupItem 
        value="categories" 
        aria-label="Categories view" 
        className="px-4 data-[state=on]:bg-foreground data-[state=on]:text-background"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Categories
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="frequency" 
        aria-label="Frequency view" 
        className="px-4 data-[state=on]:bg-foreground data-[state=on]:text-background"
      >
        <Clock className="h-4 w-4 mr-2" />
        Frequency
      </ToggleGroupItem>
    </ToggleGroup>
  );
}