import React from "react";
import { Card, CardContent } from "./Card";
import { ProgressBar } from "./ProgressBar";
import type { Skill } from "../types";
import { Link } from "react-router-dom";

const skillIcons: Record<Skill, string> = {
  "English": "🇬🇧",
  "System Design": "🏗️",
  "AI / Agentic AI": "🤖",
};

const skillColors: Record<Skill, string> = {
  "English": "bg-blue-500",
  "System Design": "bg-emerald-500",
  "AI / Agentic AI": "bg-purple-500",
};

interface SkillCardProps {
  skill: Skill;
  timePerDay: string;
  completedTasks: number;
  totalTasks: number;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, timePerDay, completedTasks, totalTasks }) => {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{skillIcons[skill]}</span>
            <div>
              <h3 className="font-bold text-slate-800">{skill}</h3>
              <p className="text-sm text-slate-500">{timePerDay}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-slate-600">Progress: {progress}%</span>
            <span className="text-slate-400">{completedTasks} / {totalTasks} tasks</span>
          </div>
          <ProgressBar 
            progress={progress} 
            indicatorClassName={skillColors[skill]} 
          />
          <Link 
            to="/daily"
            className="mt-4 w-full block text-center py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            View tasks
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
