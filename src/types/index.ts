export type TaskCategory = 'study' | 'exercise';

export interface TaskDefinition {
  id: string;
  name: string;
  scheduledTime: string;
  duration: string;
  durationHours: number;
  category: TaskCategory;
  order: number;
}

export interface DayRecord {
  date: string; // 'YYYY-MM-DD'
  dayOfWeek: string; // 'Mon', 'Tue', etc.
  completedTaskIds: string[];
  count: number; // 0 to 5
  percentage: number; // 0, 20, 40, 60, 80, 100
  studyHours: number;
  exerciseHours: number;
  updatedAt: string;
}

export interface AppStats {
  currentStreak: number;
  bestStreak: number;
  totalPerfectDays: number;
  totalStudyHours: number;
  totalExerciseHours: number;
}
