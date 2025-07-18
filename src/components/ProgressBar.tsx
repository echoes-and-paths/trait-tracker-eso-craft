import React from 'react';
import { ProgressStats } from '../types';

interface ProgressBarProps {
  stats: ProgressStats;
  sectionName: string;
}

export function ProgressBar({ stats, sectionName }: ProgressBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">
          {sectionName}
        </h3>
        <span className="text-sm text-muted-foreground font-medium">
          {stats.completed} / {stats.total} ({Math.round(stats.percentage)}%)
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
        <div 
          className="progress-bar h-full transition-all duration-700 ease-out"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
    </div>
  );
}