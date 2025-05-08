import { useHabits } from "@/hooks/useHabits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  subDays,
  parseISO,
  isWithinInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isToday,
  startOfMonth,
  endOfMonth,
  isBefore
} from "date-fns";

export function HabitStats() {
  const { board } = useHabits();
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  const endOfCurrentWeek = endOfWeek(today);
  const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i));

  // Calculate completion rates for current period
  const calculateCompletionRate = (frequency: string) => {
    let completed = 0;
    let total = 0;

    board.categories.forEach(category => {
      category.habits
        .filter(habit => habit.frequency === frequency)
        .forEach(habit => {
          total++;
          const isCompleted = (() => {
            const todayStr = today.toISOString().split('T')[0];
            
            // For current period, check completedDates
            if (habit.completedDates.includes(todayStr)) {
              return true;
            }

            // For historical data, check completionHistory
            return habit.completionHistory?.some(entry => 
              entry.date === todayStr && entry.completed
            ) ?? false;
          })();

          if (isCompleted) completed++;
        });
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Calculate streak for each frequency
  const calculateStreak = (frequency: string) => {
    let streak = 0;
    let currentDate = today;

    while (true) {
      let allCompleted = true;
      let hasHabits = false;

      board.categories.forEach(category => {
        category.habits
          .filter(habit => habit.frequency === frequency)
          .forEach(habit => {
            hasHabits = true;
            const dateStr = currentDate.toISOString().split('T')[0];
            
            // Check both current period and historical data
            const isCompleted = (() => {
              // For current period
              if (
                (frequency === 'daily' && isToday(currentDate)) ||
                (frequency === 'weekly' && isSameWeek(currentDate, today)) ||
                (frequency === 'monthly' && isSameMonth(currentDate, today))
              ) {
                return habit.completedDates.includes(dateStr);
              }
              
              // For historical data
              return habit.completionHistory?.some(entry => 
                entry.date === dateStr && entry.completed
              ) ?? false;
            })();

            if (!isCompleted) allCompleted = false;
          });
      });

      if (!hasHabits || !allCompleted) break;
      streak++;
      currentDate = subDays(currentDate, 1);
    }

    return streak;
  };

  // Generate weekly data
  const weeklyData = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  }).map(date => {
    const dateStr = date.toISOString().split('T')[0];
    let completed = 0;
    let total = 0;

    // Only calculate for past days and today
    if (isBefore(date, today) || isToday(date)) {
      board.categories.forEach(category => {
        category.habits.forEach(habit => {
          total++;
          const isCompleted = (() => {
            // For current period
            if (
              (habit.frequency === 'daily' && isToday(date)) ||
              (habit.frequency === 'weekly' && isSameWeek(date, today)) ||
              (habit.frequency === 'monthly' && isSameMonth(date, today))
            ) {
              return habit.completedDates.includes(dateStr);
            }
            
            // For historical data
            return habit.completionHistory?.some(entry => 
              entry.date === dateStr && entry.completed
            ) ?? false;
          })();

          if (isCompleted) completed++;
        });
      });
    }

    return {
      date: format(date, 'EEE, MMM d'),
      completion: total > 0 ? Math.round((completed / total) * 100) : 0,
      failed: total > 0 ? Math.round(((total - completed) / total) * 100) : 0,
      isFuture: !isBefore(date, today) && !isToday(date)
    };
  });

  // Generate 30-day trend data
  const trendData = last30Days.reverse().map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const data: { [key: string]: number } = {
      date: date.getTime(),
      daily: 0,
      weekly: 0,
      monthly: 0,
    };

    ['daily', 'weekly', 'monthly'].forEach(frequency => {
      let completed = 0;
      let total = 0;

      board.categories.forEach(category => {
        category.habits
          .filter(habit => habit.frequency === frequency)
          .forEach(habit => {
            total++;
            const isCompleted = (() => {
              // For current period
              if (
                (frequency === 'daily' && isToday(date)) ||
                (frequency === 'weekly' && isSameWeek(date, today)) ||
                (frequency === 'monthly' && isSameMonth(date, today))
              ) {
                return habit.completedDates.includes(dateStr);
              }
              
              // For historical data
              return habit.completionHistory?.some(entry => 
                entry.date === dateStr && entry.completed
              ) ?? false;
            })();

            if (isCompleted) completed++;
          });
      });

      data[frequency] = total > 0 ? Math.round((completed / total) * 100) : 0;
    });

    return data;
  });

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Daily Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>Today's Completion</span>
              <span className="font-bold">{calculateCompletionRate('daily')}%</span>
            </div>
            <Progress value={calculateCompletionRate('daily')} />
            <div className="mt-2 text-sm text-muted-foreground">
              Current Streak: {calculateStreak('daily')} days
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>This Week's Completion</span>
              <span className="font-bold">{calculateCompletionRate('weekly')}%</span>
            </div>
            <Progress value={calculateCompletionRate('weekly')} />
            <div className="mt-2 text-sm text-muted-foreground">
              Current Streak: {calculateStreak('weekly')} weeks
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>This Month's Completion</span>
              <span className="font-bold">{calculateCompletionRate('monthly')}%</span>
            </div>
            <Progress value={calculateCompletionRate('monthly')} />
            <div className="mt-2 text-sm text-muted-foreground">
              Current Streak: {calculateStreak('monthly')} months
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hidden sm:block col-span-full">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="completion"
                  fill="hsl(var(--primary))"
                  name="Completed"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="failed"
                  fill="hsl(var(--destructive))"
                  name="Failed"
                  radius={[4, 4, 0, 0]}
                  hide={(dataItem: any) => dataItem.isFuture}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="hidden sm:block col-span-full">
        <CardHeader>
          <CardTitle>30-Day Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(timestamp) => format(new Date(timestamp), 'MMM d, yyyy')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="daily"
                  stroke="hsl(var(--chart-1))"
                  name="Daily Habits"
                />
                <Line
                  type="monotone"
                  dataKey="weekly"
                  stroke="hsl(var(--chart-2))"
                  name="Weekly Habits"
                />
                <Line
                  type="monotone"
                  dataKey="monthly"
                  stroke="hsl(var(--chart-3))"
                  name="Monthly Habits"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}