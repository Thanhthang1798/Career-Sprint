import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  indicatorClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className, indicatorClassName }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={cn("h-2 w-full bg-slate-100 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full bg-indigo-600 transition-all duration-500 ease-out", indicatorClassName)}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};
