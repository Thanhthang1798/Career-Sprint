import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardContent } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { SkillCard } from "../components/SkillCard";
import type { Skill } from "../types";
import { Trophy, Flame, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const { state } = useAppContext();

  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let totalMinutes = 0;
    let completedMinutes = 0;

    const skillStats: Record<Skill, { total: number; completed: number }> = {
      "English": { total: 0, completed: 0 },
      "System Design": { total: 0, completed: 0 },
      "AI / Agentic AI": { total: 0, completed: 0 },
    };

    state.days.forEach(day => {
      day.tasks.forEach(task => {
        totalTasks++;
        totalMinutes += task.estimatedMinutes;
        skillStats[task.skill].total++;

        if (task.status === "completed") {
          completedTasks++;
          completedMinutes += task.estimatedMinutes;
          skillStats[task.skill].completed++;
        }
      });
    });

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const completedHours = Math.round(completedMinutes / 60);

    return { totalTasks, completedTasks, overallProgress, completedHours, skillStats };
  }, [state.days]);

  const levels = ["FOUNDATION", "BUILDER", "SENIOR MODE", "INTERVIEW READY"];
  const currentLevelName = levels[state.currentLevel - 1] || "MAX LEVEL";
  
  // Hardcoded target XP for MVP
  const targetXp = 1000;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Panel */}
      <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-xl relative overflow-hidden mt-2">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
          <Trophy className="w-64 h-64" />
        </div>
        
        <CardContent className="p-6 md:p-10 relative z-10 flex flex-col gap-10">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-indigo-500/20 text-indigo-300 font-bold text-xs px-3 py-1 rounded-full tracking-wider uppercase border border-indigo-500/30">
                  WEEK {state.currentWeek}
                </span>
                <span className="text-slate-400 font-medium text-sm">09 Aug → 15 Aug</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">{currentLevelName}</h2>
              <p className="text-indigo-200/80 mt-2 text-lg font-medium">Level {String(state.currentLevel).padStart(2, '0')}</p>
            </div>
            
            <div className="text-left md:text-right flex flex-col items-start md:items-end bg-black/20 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-indigo-300 font-bold tracking-wider text-xs mb-1 uppercase">Total XP</p>
              <p className="text-4xl font-black text-white">{state.xp} <span className="text-indigo-400/60 text-xl font-bold">/ {targetXp}</span></p>
            </div>
          </div>
          
          <div>
             <div className="flex justify-between text-sm font-semibold mb-3 text-indigo-200">
                <span>Overall Progress</span>
                <span>{stats.overallProgress}%</span>
              </div>
              <ProgressBar 
                progress={stats.overallProgress} 
                className="bg-indigo-950/60 h-3" 
                indicatorClassName="bg-gradient-to-r from-indigo-500 to-indigo-300" 
              />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
             <div className="flex flex-col gap-1">
               <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> Streak</span>
               <span className="text-xl font-bold text-white">{state.streak} Days</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tasks</span>
               <span className="text-xl font-bold text-white">{stats.completedTasks} <span className="text-slate-500 text-base">/ {stats.totalTasks}</span></span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> Time</span>
               <span className="text-xl font-bold text-white">{stats.completedHours}h</span>
             </div>
          </div>

        </CardContent>
      </Card>

      {/* Skill Cards */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Focus Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkillCard 
            skill="English" 
            timePerDay="60 min/day" 
            completedTasks={stats.skillStats["English"].completed} 
            totalTasks={stats.skillStats["English"].total} 
          />
          <SkillCard 
            skill="System Design" 
            timePerDay="75 min/day" 
            completedTasks={stats.skillStats["System Design"].completed} 
            totalTasks={stats.skillStats["System Design"].total} 
          />
          <SkillCard 
            skill="AI / Agentic AI" 
            timePerDay="45 min/day" 
            completedTasks={stats.skillStats["AI / Agentic AI"].completed} 
            totalTasks={stats.skillStats["AI / Agentic AI"].total} 
          />
        </div>
      </div>

    </div>
  );
}
