"use client";

import * as React from "react";
import {
  countCompletedDays,
  createInitialProgress,
  getNextIncompleteDay,
  getProgressPercent,
  getRecentActivity,
  getStreakCount,
  isDayCompleted,
  setDayCompletion,
  sanitizeProgress,
  type ProgressStore
} from "@/lib/progress";

const STORAGE_KEY = "estonianfast-progress-v1";

type ProgressContextValue = {
  progress: ProgressStore;
  hydrated: boolean;
  completedDays: number;
  progressPercent: number;
  streakCount: number;
  currentDay: number;
  isCompleted: (dayNumber: number) => boolean;
  setCompleted: (dayNumber: number, completed: boolean) => void;
  toggleCompleted: (dayNumber: number) => void;
  recentActivity: ReturnType<typeof getRecentActivity>;
  resetProgress: () => void;
};

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = React.useState<ProgressStore>(() => createInitialProgress("demo-user"));
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProgress(sanitizeProgress(parsed, "demo-user"));
      } catch {
        setProgress(createInitialProgress("demo-user"));
      }
    } else {
      setProgress(createInitialProgress("demo-user"));
    }

    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [hydrated, progress]);

  const completedDays = React.useMemo(() => countCompletedDays(progress), [progress]);
  const progressPercent = React.useMemo(() => getProgressPercent(progress), [progress]);
  const streakCount = React.useMemo(() => getStreakCount(progress), [progress]);
  const currentDay = React.useMemo(() => getNextIncompleteDay(progress), [progress]);
  const recentActivity = React.useMemo(() => getRecentActivity(progress), [progress]);

  const setCompleted = React.useCallback((dayNumber: number, completed: boolean) => {
    setProgress((prev) => setDayCompletion(prev, dayNumber, completed));
  }, []);

  const toggleCompleted = React.useCallback((dayNumber: number) => {
    setProgress((prev) => {
      const nextCompleted = !isDayCompleted(prev, dayNumber);
      return setDayCompletion(prev, dayNumber, nextCompleted);
    });
  }, []);

  const resetProgress = React.useCallback(() => {
    const reset = createInitialProgress("demo-user");
    setProgress(reset);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
  }, []);

  const value = React.useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated,
      completedDays,
      progressPercent,
      streakCount,
      currentDay,
      isCompleted: (dayNumber: number) => isDayCompleted(progress, dayNumber),
      setCompleted,
      toggleCompleted,
      recentActivity,
      resetProgress
    }),
    [progress, hydrated, completedDays, progressPercent, streakCount, currentDay, setCompleted, toggleCompleted, recentActivity, resetProgress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }

  return context;
}
