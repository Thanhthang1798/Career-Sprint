import React from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardContent } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import type { Day } from "../types";
import { CheckCircle2, Circle, Lock, Unlock, ArrowRight } from "lucide-react";

import { cn } from "../utils/cn";

const DayCard = ({ day, isToday, isFuture }: { day: Day; isToday: boolean; isFuture: boolean }) => {
  const totalTasks = day.tasks.length;
  const completedTasks = day.tasks.filter((t) => t.status === "completed").length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isAllDone = progress === 100;

  return (
    <Card 
      className={cn(
        "min-w-[280px] snap-center flex-shrink-0 transition-all border-2 relative overflow-hidden",
        isToday ? "border-indigo-500 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transform scale-[1.02] bg-white z-10" : "border-slate-200/80",
        isAllDone && !isToday && "border-emerald-400/60 bg-emerald-50/20",
        isFuture && "opacity-60 bg-slate-50/50 grayscale-[50%]"
      )}
    >
      {isToday && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
      )}
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn("font-black tracking-tight text-xl", isToday ? "text-indigo-900" : "text-slate-800")}>
                {day.label}
              </h4>
              {isToday && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Today</span>}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{day.date}</p>
          </div>
          {isAllDone && <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />}
        </div>
        
        <div className="mb-6 flex-1">
          <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">{day.phase}</p>
          <p className="text-xs text-slate-500 mt-1">Focus Area</p>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className={cn(isAllDone ? "text-emerald-700" : "text-slate-600")}>
              {completedTasks} / {totalTasks} tasks
            </span>
            <span className={cn(isAllDone ? "text-emerald-700" : "text-slate-600")}>
              {progress}%
            </span>
          </div>
          <ProgressBar 
            progress={progress} 
            indicatorClassName={isAllDone ? "bg-emerald-500" : "bg-indigo-500"} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function WeeklySprint() {
  const { state, toggleCheckpoint } = useAppContext();
  
  // For MVP, assume today is DAY 1 if no tasks done, or derive from some logic.
  // Let's just highlight the first day that is not 100% complete, or Day 1.
  const activeDayIndex = state.days.findIndex(day => {
    const total = day.tasks.length;
    const completed = day.tasks.filter(t => t.status === "completed").length;
    return total > 0 && completed < total;
  });
  const todayIndex = activeDayIndex === -1 ? 0 : activeDayIndex;

  const isLevelUnlocked = state.levelUnlocked >= 2;

  return (
    <div className="space-y-10 pb-8 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Weekly Sprint</h1>
        <p className="text-slate-500 mt-1 font-medium">Your roadmap for this week's progression.</p>
      </div>

      {/* Horizontal Timeline */}
      <div className="relative">
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pt-2">
          {state.days.map((day, idx) => (
            <React.Fragment key={day.id}>
              <DayCard day={day} isToday={idx === todayIndex} isFuture={idx > todayIndex} />
              {idx < state.days.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-slate-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Checkpoint Area */}
      <div className="mt-12 bg-slate-100 rounded-2xl p-1 shadow-inner">
        <div className="bg-white rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex flex-col mb-2">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    Week 1 Checkpoint
                    {isLevelUnlocked && <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md uppercase font-bold tracking-wider">Completed</span>}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-indigo-600">
                      {state.checkpoints.filter(cp => cp.completed).length} / {state.checkpoints.length} completed
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">Complete all tasks and checkpoints to unlock the next level.</p>
                </div>
              </div>

              <div className="space-y-3">
                {state.checkpoints.map((cp) => (
                  <button
                    key={cp.id}
                    onClick={() => toggleCheckpoint(cp.id)}
                    className={cn(
                      "w-full text-left flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 group",
                      cp.completed 
                        ? "bg-emerald-50 border-emerald-200" 
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110">
                      {cp.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className={cn("font-bold text-sm", cp.completed ? "text-emerald-900" : "text-slate-700")}>
                        {cp.title}
                      </p>
                      <p className={cn("text-xs mt-1", cp.completed ? "text-emerald-700/80" : "text-slate-500")}>
                        {cp.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Unlock Status Panel */}
            <div className="w-full md:w-72 flex-shrink-0 flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 min-h-[300px] transition-all duration-500">
              {isLevelUnlocked ? (
                <div className="animate-in zoom-in duration-500 flex flex-col items-center">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Unlock className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h4 className="text-amber-500 font-bold tracking-widest text-xs mb-2">🏆 WEEK 1 COMPLETE</h4>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">LEVEL 02</h3>
                  <p className="text-indigo-600 font-black text-xl mb-4">UNLOCKED</p>
                  <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md">
                    BUILDER MODE
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-60">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-slate-400 font-bold tracking-widest text-xs mb-2">LOCKED</h4>
                  <h3 className="text-xl font-black text-slate-400 mb-1">LEVEL 02</h3>
                  <p className="text-slate-400 font-bold text-sm">Finish tasks & checkpoints</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
