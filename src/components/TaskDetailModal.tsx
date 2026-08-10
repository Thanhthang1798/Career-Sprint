import { useState, useEffect } from "react";
import type { Task } from "../types";
import { useAppContext } from "../context/AppContext";
import { X, CheckCircle2, Clock, Target as TargetIcon, Zap } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const { markTaskDone, updateTask } = useAppContext();
  
  const [notes, setNotes] = useState(task.notes || "");
  const [evidence, setEvidence] = useState(task.evidence || "");

  // Reset local state when a new task is opened
  useEffect(() => {
    setNotes(task.notes || "");
    setEvidence(task.evidence || "");
  }, [task]);

  if (!isOpen) return null;

  const handleSave = () => {
    updateTask(task.id, { notes, evidence });
    onClose();
  };

  const handleMarkDone = () => {
    markTaskDone(task.id, evidence, notes);
    onClose();
  };

  const isCompleted = task.status === "completed";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-1 block">
              {task.skill}
            </span>
            <h2 className={cn("text-xl font-black text-slate-900", isCompleted && "line-through decoration-slate-300 text-slate-500")}>
              {task.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Metrics */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">
              <Clock className="w-4 h-4 text-slate-500" />
              {task.estimatedMinutes} min
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold border border-amber-100">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              {task.xp} XP
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Completed
              </div>
            )}
          </div>

          {/* Target */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
            <h4 className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1">
              <TargetIcon className="w-4 h-4 text-indigo-600" /> Target / Definition of Done
            </h4>
            <p className="text-indigo-800 text-sm">{task.target}</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Evidence (Link, Commit, etc.)
              </label>
              <input 
                type="text"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="e.g. https://github.com/..."
                className="w-full border-slate-200 bg-slate-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 disabled:opacity-60"
                disabled={isCompleted}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Notes
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any reflections or notes for this task..."
                rows={3}
                className="w-full border border-slate-200 bg-slate-50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 disabled:opacity-60"
                disabled={isCompleted}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
          {!isCompleted ? (
            <>
              <button 
                onClick={handleSave}
                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Save Draft
              </button>
              <button 
                onClick={handleMarkDone}
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 rounded-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark as Done
              </button>
            </>
          ) : (
             <button 
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              >
                Close
              </button>
          )}
        </div>
      </div>
    </div>
  );
}
