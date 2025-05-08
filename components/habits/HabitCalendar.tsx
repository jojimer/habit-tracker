"use client";

import { useHabits } from "@/hooks/useHabits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { format, isBefore, startOfToday, parseISO } from "date-fns";
import { CheckCircle2, XCircle, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HabitCalendar() {
  const { board } = useHabits();
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: startOfToday(),
    to: startOfToday()
  });
  const [selectedFrequency, setSelectedFrequency] = useState<string>("all");
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const today = startOfToday();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle date range selection
  const handleDateRangeChange = (range: { from: Date; to?: Date } | undefined) => {
    if (range) {
      setDateRange(range);
      // Auto-hide calendar on mobile when a complete range is selected
      if (isMobile && range.to) {
        setShowDatePicker(false);
      }
    }
  };

  // Get habits status for a date range
  const getHabitsStatus = () => {
    if (!dateRange.from || !dateRange.to) return new Map();

    const habitsByDate = new Map<string, {
      habits: Array<{
        category: string;
        habit: string;
        frequency: string;
        completed: boolean;
      }>;
      completionRate: number;
    }>();

    // Get all dates in the range
    let currentDate = new Date(dateRange.from);
    while (currentDate <= dateRange.to!) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      
      const dayHabits: Array<{
        category: string;
        habit: string;
        frequency: string;
        completed: boolean;
      }> = [];

      board.categories.forEach(category => {
        category.habits.forEach(habit => {
          // Skip if frequency filter is active and doesn't match
          if (selectedFrequency !== "all" && habit.frequency !== selectedFrequency) {
            return;
          }

          // Check completion status
          const isCompleted = habit.completedDates.includes(dateStr) || 
            (habit.completionHistory?.some(entry => entry.date === dateStr && entry.completed) ?? false);

          dayHabits.push({
            category: category.title,
            habit: habit.title,
            frequency: habit.frequency,
            completed: isCompleted
          });
        });
      });

      // Calculate completion rate
      const completedCount = dayHabits.filter(h => h.completed).length;
      const completionRate = dayHabits.length > 0 
        ? Math.round((completedCount / dayHabits.length) * 100) 
        : 0;

      habitsByDate.set(formattedDate, {
        habits: dayHabits,
        completionRate
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return habitsByDate;
  };

  const habitsByDate = getHabitsStatus();
  
  // Sort the dates based on the current sort direction
  const sortedDates = Array.from(habitsByDate.entries()).sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return sortAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="relative mt-8 sm:mt-0">
      {/* Mobile Controls */}
      <div className="flex items-center justify-between gap-4 mb-4 sm:hidden">
        <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frequencies</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortAscending(!sortAscending)}
            className="h-9 w-9"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {showDatePicker ? <ChevronLeft className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
            {showDatePicker ? "Hide Calendar" : "Show Calendar"}
          </Button>
        </div>
      </div>

      <div className={cn(
        "grid gap-4 transition-all duration-300",
        showDatePicker 
          ? "grid-cols-1 sm:grid-cols-[300px_1fr]" 
          : "grid-cols-1"
      )}>
        {/* Left side controls */}
        <div className={cn(
          "space-y-4",
          !showDatePicker && "hidden sm:block"
        )}>
          <Card>
            <CardHeader>
              <CardTitle>Select Date Range</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                disabled={(date) => isBefore(today, date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Desktop Filter - Always visible */}
          <Card className="hidden sm:block">
            <CardHeader>
              <CardTitle>Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between">
                <span className="text-sm">Sort Order</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortAscending(!sortAscending)}
                  className="gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {sortAscending ? "Oldest First" : "Newest First"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side habit list */}
        <div className="space-y-6">
          {sortedDates.map(([date, { habits, completionRate }]) => (
            <Card key={date}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">
                    {format(new Date(date), "EEEE, MMMM d, yyyy")}
                  </CardTitle>
                  <span className="text-sm font-medium">
                    {completionRate}% Complete
                  </span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </CardHeader>
              <CardContent>
                {habits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {habits.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          "border transition-colors duration-200",
                          item.completed ? 
                            "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900" :
                            "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.habit}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          {item.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-rose-500" />
                          )}
                          <Badge variant="outline" className="capitalize whitespace-nowrap">
                            {item.frequency}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No habits found for this date
                    {selectedFrequency !== "all" ? ` with ${selectedFrequency} frequency` : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {habitsByDate.size === 0 && (
            <Card>
              <CardContent className="py-8">
                <p className="text-muted-foreground text-center">
                  No habits found in this date range
                  {selectedFrequency !== "all" ? ` with ${selectedFrequency} frequency` : ""}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}