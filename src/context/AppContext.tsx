import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

export const getLevelInfo = (xp: number, levelUnlocked: number) => {
  // If they have enough XP but haven't unlocked the level, keep them at the unlocked level max bound
  if (levelUnlocked === 1) return { level: 1, name: "FOUNDATION for Thanh Thắng", minXp: 0, maxXp: 1000 };
  if (levelUnlocked === 2 && xp < 2500) return { level: 2, name: "BUILDER", minXp: 1000, maxXp: 2500 };
  if (levelUnlocked === 2 && xp >= 2500) return { level: 2, name: "BUILDER", minXp: 1000, maxXp: 2500 }; // Wait, if level 3 isn't unlocked... For MVP let's assume levelUnlocked tracks max level.

  if (xp >= 4500 && levelUnlocked >= 4) return { level: 4, name: "INTERVIEW READY", minXp: 4500, maxXp: null };
  if (xp >= 2500 && levelUnlocked >= 3) return { level: 3, name: "SENIOR MODE", minXp: 2500, maxXp: 4500 };
  if (xp >= 1000 && levelUnlocked >= 2) return { level: 2, name: "BUILDER", minXp: 1000, maxXp: 2500 };

  // Default fallback if they somehow have less XP than their unlock allows, or just fallback to 1
  return { level: 1, name: "FOUNDATION", minXp: 0, maxXp: 1000 };
};

import type { ReactNode } from "react";
import type { UserState, Task, DailyReview } from "../types";
import { initialUserState } from "../data/initialData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { ToastMessage } from "../components/Toast";

interface AppContextType {
  state: UserState;
  markTaskDone: (taskId: string, evidence?: string, notes?: string) => void;
  unmarkTaskDone: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  saveDailyReview: (date: string, review: DailyReview) => void;
  toggleCheckpoint: (checkpointId: string) => void;
  resetProgress: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useLocalStorage<UserState>("career-sprint-state", initialUserState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setState((prev) => {
      const newDays = prev.days.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
      }));
      return { ...prev, days: newDays };
    });
  }, [setState]);

  const markTaskDone = useCallback((taskId: string, evidence?: string, notes?: string) => {
    setState((prev) => {
      let taskXp = 0;
      let dayId = "";
      
      const newDays = prev.days.map((day) => {
        
        const newTasks = day.tasks.map((task) => {
          if (task.id === taskId && task.status !== "completed") {
            
            taskXp = task.xp;
            dayId = day.id;
            return { ...task, status: "completed" as const, evidence, notes };
          }
          return task;
        });
        return { ...day, tasks: newTasks };
      });

      if (taskXp === 0) return prev; // Task already completed or not found

      let newXp = prev.xp + taskXp;
      let totalXpGained = taskXp;

      // Check daily completion bonus
      const day = newDays.find(d => d.id === dayId);
      if (day && day.tasks.every(t => t.status === "completed")) {
        newXp += 50; // Daily completion bonus
        totalXpGained += 50;
      }
      
      addToast({
        title: "Task completed",
        subtitle: "Keep up the great work!",
        xpValue: totalXpGained
      });

      // Check if level should be unlocked
      // Criteria: all week 1 tasks are done AND all checkpoints are done.
      // Handled in a separate useEffect or when toggling checkpoint, but let's do a simple check here too
      const allTasksDone = newDays.every(d => d.tasks.every(t => t.status === "completed"));
      const allCheckpointsDone = prev.checkpoints.every(c => c.completed);
      
      let levelUnlocked = prev.levelUnlocked;
      if (allTasksDone && allCheckpointsDone && prev.levelUnlocked < 2) {
        levelUnlocked = 2;
      }

      return {
        ...prev,
        days: newDays,
        xp: newXp,
        levelUnlocked,
      };
    });
  }, [setState, addToast]);

  const unmarkTaskDone = useCallback((taskId: string) => {
    setState((prev) => {
      let taskXp = 0;
      let dayId = "";

      const newDays = prev.days.map((day) => {
        const newTasks = day.tasks.map((task) => {
          if (task.id === taskId && task.status === "completed") {
            taskXp = task.xp;
            dayId = day.id;
            return { ...task, status: "available" as const, evidence: undefined, notes: undefined };
          }
          return task;
        });
        return { ...day, tasks: newTasks };
      });

      if (taskXp === 0) return prev; // Task not found or not completed

      let newXp = prev.xp - taskXp;

      // Check if daily completion bonus was applied (if they just unmarked it, they no longer have it)
      // Wait, to be precise, if they previously had all tasks completed and we are unmarking one, we remove the bonus.
      const day = prev.days.find(d => d.id === dayId);
      if (day && day.tasks.every(t => t.status === "completed")) {
        newXp -= 50; // Remove daily completion bonus
      }

      // Also if level 2 was unlocked, we should technically re-lock it if they undo a task that was required.
      // But level locking logic in games usually doesn't revert, however, for correctness:
      let levelUnlocked = prev.levelUnlocked;
      const allTasksDone = newDays.every(d => d.tasks.every(t => t.status === "completed"));
      const allCheckpointsDone = prev.checkpoints.every(c => c.completed);

      if (!(allTasksDone && allCheckpointsDone) && levelUnlocked >= 2) {
        levelUnlocked = 1; // Basic assumption for MVP
      }

      return {
        ...prev,
        days: newDays,
        xp: Math.max(0, newXp),
        levelUnlocked,
      };
    });
  }, [setState]);

  const saveDailyReview = useCallback((date: string, review: DailyReview) => {
    setState((prev) => ({
      ...prev,
      dailyReviews: {
        ...prev.dailyReviews,
        [date]: review,
      },
    }));
  }, [setState]);

  const toggleCheckpoint = useCallback((checkpointId: string) => {
    setState((prev) => {
      const checkpoint = prev.checkpoints.find(c => c.id === checkpointId);
      if (!checkpoint) return prev;
      
      const isCompleting = !checkpoint.completed;

      const newCheckpoints = prev.checkpoints.map(cp => 
        cp.id === checkpointId ? { ...cp, completed: isCompleting } : cp
      );

      const allTasksDone = prev.days.every(d => d.tasks.every(t => t.status === "completed"));
      const allCheckpointsDone = newCheckpoints.every(c => c.completed);
      
      let levelUnlocked = prev.levelUnlocked;
      if (allTasksDone && allCheckpointsDone && prev.levelUnlocked < 2) {
        levelUnlocked = 2;
      }

      let newXp = prev.xp;
      if (isCompleting) {
        newXp += 200;
      } else {
        newXp = Math.max(0, newXp - 200);
      }

      return {
        ...prev,
        checkpoints: newCheckpoints,
        levelUnlocked,
        xp: newXp
      };
    });
  }, [setState]);

  const resetProgress = useCallback(() => {
    setState(initialUserState);
  }, [setState]);

  return (
    <AppContext.Provider value={{ state, markTaskDone, unmarkTaskDone, updateTask, saveDailyReview, toggleCheckpoint, resetProgress, toasts, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
