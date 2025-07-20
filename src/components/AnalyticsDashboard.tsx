
import React from 'react';
import { TraitProgress, ResearchTimer } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Clock, TrendingUp, Target, Timer } from 'lucide-react';

interface AnalyticsDashboardProps {
  progress: TraitProgress[];
  timers: ResearchTimer[];
  craftingSections: string[];
}

export function AnalyticsDashboard({ progress, timers, craftingSections }: AnalyticsDashboardProps) {
  // Calculate progress by section
  const sectionProgress = craftingSections.map(section => {
    const sectionTraits = progress.filter(p => p.section.startsWith(section));
    const completed = sectionTraits.filter(p => p.completed).length;
    const total = sectionTraits.length;
    return {
      name: section.charAt(0).toUpperCase() + section.slice(1),
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  // Calculate overall stats
  const totalTraits = progress.length;
  const completedTraits = progress.filter(p => p.completed).length;
  const overallPercentage = totalTraits > 0 ? Math.round((completedTraits / totalTraits) * 100) : 0;

  // Active timers count
  const activeTimers = timers.filter(timer => timer.endTime > new Date()).length;

  // Time saved estimation (assuming average 6 hours per trait)
  const timeSpent = completedTraits * 6;
  const timeRemaining = (totalTraits - completedTraits) * 6;

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "hsl(var(--success))",
    },
    remaining: {
      label: "Remaining", 
      color: "hsl(var(--muted))",
    },
  };

  const pieData = [
    { name: 'Completed', value: completedTraits, color: 'hsl(var(--success))' },
    { name: 'Remaining', value: totalTraits - completedTraits, color: 'hsl(var(--muted))' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{overallPercentage}%</div>
          <p className="text-xs text-muted-foreground">
            {completedTraits} of {totalTraits} traits
          </p>
          <Progress value={overallPercentage} className="mt-2" />
        </CardContent>
      </Card>

      {/* Active Timers Card */}
      <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Research</CardTitle>
          <Timer className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{activeTimers}</div>
          <p className="text-xs text-muted-foreground">
            timers running
          </p>
          {activeTimers > 0 && (
            <Badge variant="secondary" className="mt-2">
              Research in progress
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Time Investment Card */}
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
          <Clock className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{timeSpent}h</div>
          <p className="text-xs text-muted-foreground">
            research completed
          </p>
          <div className="text-xs text-muted-foreground mt-1">
            ~{timeRemaining}h remaining
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate Card */}
      <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {sectionProgress.length > 0 ? Math.round(sectionProgress.reduce((acc, s) => acc + s.percentage, 0) / sectionProgress.length) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            average across crafts
          </p>
          <div className="text-xs text-success mt-1">
            {sectionProgress.filter(s => s.percentage === 100).length} crafts mastered
          </div>
        </CardContent>
      </Card>

      {/* Progress by Section Chart */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Progress by Crafting School</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="percentage" fill="var(--color-completed)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Overall Distribution Pie Chart */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Overall Research Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
