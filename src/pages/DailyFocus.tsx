import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { Skill, Task } from "../types";
import { CheckCircle2, Circle, Clock, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent } from "../components/Card";
import TaskDetailModal from "../components/TaskDetailModal"; // We will build this next
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const skillIcons: Record<Skill, string> = {
  "English": "🇬🇧",
  "System Design": "🏗️",
  "AI / Agentic AI": "🤖",
};

export default function DailyFocus() {
  const { state, saveDailyReview } = useAppContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // For MVP, find the active day (first day not fully completed, or day 1)
  const activeDayIndex = state.days.findIndex(day => {
    const total = day.tasks.length;
    const completed = day.tasks.filter(t => t.status === "completed").length;
    return total > 0 && completed < total;
  });
  const today = state.days[activeDayIndex === -1 ? 0 : activeDayIndex];

  // Group tasks by skill
  const tasksBySkill = today.tasks.reduce((acc, task) => {
    if (!acc[task.skill]) acc[task.skill] = [];
    acc[task.skill].push(task);
    return acc;
  }, {} as Record<Skill, Task[]>);

  // Review Form State
  const existingReview = state.dailyReviews[today.date] || { learned: "", practiced: "", unclear: "", confidence: 5 };
  const [review, setReview] = useState(existingReview);
  const [reviewSaved, setReviewSaved] = useState(!!state.dailyReviews[today.date]);

  // Update review form if today date changes (i.e. active day advanced)
  React.useEffect(() => {
    setReview(state.dailyReviews[today.date] || { learned: "", practiced: "", unclear: "", confidence: 5 });
    setReviewSaved(!!state.dailyReviews[today.date]);
  }, [today.date, state.dailyReviews]);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyReview(today.date, { ...review, date: today.date });
    setReviewSaved(true);
    setTimeout(() => setReviewSaved(false), 3000);
  };

  const selectedTask = today.tasks.find(t => t.id === selectedTaskId) || null;

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-widest">
              {today.label}
            </span>
            <span className="text-slate-500 font-bold text-sm tracking-wider">{today.date}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Focus</h1>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Daily Progress</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${Math.round((today.tasks.filter(t => t.status === "completed").length / today.tasks.length) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-bold text-indigo-700">
              {today.tasks.filter(t => t.status === "completed").length} / {today.tasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-8">
        {(Object.entries(tasksBySkill) as [Skill, Task[]][]).map(([skill, tasks]) => (
          <div key={skill} className="space-y-3">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <span>{skillIcons[skill]}</span> {skill}
            </h2>
            
            <div className="space-y-2">
              {tasks.map((task) => {
                const isCompleted = task.status === "completed";
                return (
                  <div 
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={cn(
                      "group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer duration-300 ease-out",
                      isCompleted 
                        ? "bg-slate-50/80 border-slate-200 shadow-none scale-[0.99] grayscale-[20%]" 
                        : "bg-white border-slate-200/60 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] hover:border-indigo-400 hover:shadow-indigo-100/50 hover:-translate-y-0.5"
                    )}
                  >
                    <div className="flex items-start gap-5">
                      <div className={cn("mt-1 flex-shrink-0 transition-transform duration-300", !isCompleted && "group-hover:scale-110")}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow-sm" />
                        ) : (
                          <Circle className="w-8 h-8 text-slate-300 group-hover:text-indigo-500" strokeWidth={1.5} />
                        )}
                      </div>
                      <div>
                        <h3 className={cn("font-black text-lg md:text-xl mb-1 transition-colors duration-300", isCompleted ? "text-slate-500 line-through decoration-slate-300/80" : "text-slate-900 group-hover:text-indigo-950")}>
                          {task.title}
                        </h3>
                        <p className={cn("text-sm", isCompleted ? "text-slate-400" : "text-slate-600")}>
                          <span className="font-bold text-slate-400 uppercase tracking-wider text-xs mr-2">Target</span> {task.target}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 md:mt-0 pl-10 md:pl-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        {task.estimatedMinutes}m
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 text-sm font-bold bg-amber-50 px-2 py-1 rounded-md">
                        <Zap className="w-3.5 h-3.5 fill-amber-500" />
                        {task.xp}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 hidden md:block group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Review Form */}
      <div className="mt-16">
        <Card className="bg-slate-900 text-slate-100 border-slate-800">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">Daily Review</h3>
              <p className="text-slate-400 text-sm mt-1">Reflect on your progress to solidify learning.</p>
            </div>
            
            <form onSubmit={handleSaveReview} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What did I learn?</label>
                <textarea 
                  value={review.learned}
                  onChange={(e) => setReview({...review, learned: e.target.value})}
                  className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  rows={2}
                  placeholder="Key takeaways from today..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What did I build/practice?</label>
                <textarea 
                  value={review.practiced}
                  onChange={(e) => setReview({...review, practiced: e.target.value})}
                  className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What is still unclear?</label>
                <textarea 
                  value={review.unclear}
                  onChange={(e) => setReview({...review, unclear: e.target.value})}
                  className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confidence (1-10): {review.confidence}</label>
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={review.confidence}
                  onChange={(e) => setReview({...review, confidence: parseInt(e.target.value)})}
                  className="w-full accent-indigo-500"
                />
              </div>
              
              <div className="pt-2 flex items-center justify-end">
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  {reviewSaved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : "Save Reflection"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          isOpen={!!selectedTask} 
          onClose={() => setSelectedTaskId(null)} 
        />
      )}
    </div>
  );
}
