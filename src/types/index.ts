export type Skill = "English" | "System Design" | "AI / Agentic AI";

export type TaskStatus = "locked" | "available" | "in-progress" | "completed";

export interface Task {
  id: string;
  dayId: string;
  skill: Skill;
  title: string;
  target: string;
  estimatedMinutes: number;
  xp: number;
  status: TaskStatus;
  evidence?: string;
  notes?: string;
}

export interface Day {
  id: string;
  date: string;
  label: string;
  phase: string;
  tasks: Task[];
  isLocked?: boolean;
}

export interface DailyReview {
  date: string;
  learned: string;
  practiced: string;
  unclear: string;
  confidence: number;
}

export interface Checkpoint {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface UserState {
  currentWeek: number;
  currentLevel: number;
  xp: number;
  streak: number;
  days: Day[];
  dailyReviews: Record<string, DailyReview>;
  checkpoints: Checkpoint[];
  levelUnlocked: number; // Max level unlocked (e.g. 1 means Level 01, 2 means Level 02 is unlocked)
}
