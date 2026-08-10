import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserState, Task, DailyReview } from "../types";
import { initialUserState } from "../data/initialData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { ToastMessage } from "../components/Toast";

interface AppContextType {
  state: UserState;
  markTaskDone: (taskId: string, evidence?: string, notes?: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  saveDailyReview: (date: string, review: DailyReview) => void;
  toggleCheckpoint: (checkpointId: string) => void;
  resetProgress: () => void;
  toasts: ToastMessage[];
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

      // Add 200 XP when all checkpoints are done (only once, assuming level isn't already unlocked to prevent spam)
      let newXp = prev.xp;
      if (allCheckpointsDone && !prev.checkpoints.every(c => c.completed)) {
         newXp += 200;
      } else if (!allCheckpointsDone && prev.checkpoints.every(c => c.completed)) {
         newXp -= 200; // Deduct if un-toggling
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
    <AppContext.Provider value={{ state, markTaskDone, updateTask, saveDailyReview, toggleCheckpoint, resetProgress, toasts, removeToast }}>
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
