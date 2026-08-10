import React from "react";
import { Zap } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface XPBadgeProps {
  xp: number;
  className?: string;
}

export const XPBadge: React.FC<XPBadgeProps> = ({ xp, className }) => {
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-sm", className)}>
      <Zap className="w-4 h-4 fill-amber-500" />
      <span>{xp} XP</span>
    </div>
  );
};
