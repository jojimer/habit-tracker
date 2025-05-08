"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitBoard } from "@/components/habits/HabitBoard";
import { HabitStats } from "@/components/habits/HabitStats";
import { HabitCalendar } from "@/components/habits/HabitCalendar";
import { ViewToggle } from "@/components/habits/ViewToggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function HabitDashboard() {
  const [activeTab, setActiveTab] = useState("board");
  const [viewMode, setViewMode] = useState<"categories" | "frequency">("categories");

  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <TabsList className="h-10">
              <TabsTrigger value="board" className="px-4">Board</TabsTrigger>
              <TabsTrigger value="stats" className="px-4">Stats</TabsTrigger>
              <TabsTrigger value="calendar" className="px-4">Calendar</TabsTrigger>
            </TabsList>
            <ThemeToggle />
          </div>
          {activeTab === "board" && (
            <ViewToggle value={viewMode} onValueChange={setViewMode} />
          )}
        </div>

        <TabsContent value="board" className="mt-6">
          <HabitBoard viewMode={viewMode} />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <HabitStats />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <HabitCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}