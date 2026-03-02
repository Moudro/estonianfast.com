export const TOTAL_DAYS = 30;

export type DayCompletion = {
  dayNumber: number;
  completed: boolean;
  completedAt: string | null;
  completionDateKey: string | null;
};

export type ProgressStore = {
  userId: string;
  completions: Record<number, DayCompletion>;
  updatedAt: string;
};

export type RecentActivityItem = {
  dayNumber: number;
  completedAt: string;
  completionDateKey: string;
};

function createEmptyCompletion(dayNumber: number): DayCompletion {
  return {
    dayNumber,
    completed: false,
    completedAt: null,
    completionDateKey: null
  };
}

export function createInitialProgress(userId = "demo-user"): ProgressStore {
  const completions: Record<number, DayCompletion> = {};
  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    completions[day] = createEmptyCompletion(day);
  }

  return {
    userId,
    completions,
    updatedAt: new Date().toISOString()
  };
}

export function toLocalDateKey(date: Date): string {
  // Local date key keeps streak calculations aligned to the learner's timezone.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKeyToUtc(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function dayDiff(a: string, b: string): number {
  const ms = parseDateKeyToUtc(a) - parseDateKeyToUtc(b);
  return Math.round(ms / 86_400_000);
}

export function sanitizeProgress(data: unknown, userId = "demo-user"): ProgressStore {
  const fallback = createInitialProgress(userId);

  if (!data || typeof data !== "object") {
    return fallback;
  }

  const unsafe = data as Partial<ProgressStore>;
  const completions: Record<number, DayCompletion> = {};

  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    const candidate = unsafe.completions?.[day] as Partial<DayCompletion> | undefined;

    completions[day] = {
      dayNumber: day,
      completed: Boolean(candidate?.completed),
      completedAt: candidate?.completed ? candidate?.completedAt ?? null : null,
      completionDateKey: candidate?.completed ? candidate?.completionDateKey ?? null : null
    };
  }

  return {
    userId: unsafe.userId || userId,
    completions,
    updatedAt: typeof unsafe.updatedAt === "string" ? unsafe.updatedAt : fallback.updatedAt
  };
}

export function isDayCompleted(progress: ProgressStore, dayNumber: number): boolean {
  return Boolean(progress.completions[dayNumber]?.completed);
}

export function setDayCompletion(
  progress: ProgressStore,
  dayNumber: number,
  completed: boolean,
  now = new Date()
): ProgressStore {
  const current = progress.completions[dayNumber];
  if (!current) {
    return progress;
  }

  if (current.completed === completed) {
    return progress;
  }

  const next: ProgressStore = {
    ...progress,
    completions: {
      ...progress.completions,
      [dayNumber]: completed
        ? {
            dayNumber,
            completed: true,
            completedAt: now.toISOString(),
            completionDateKey: toLocalDateKey(now)
          }
        : {
            dayNumber,
            completed: false,
            completedAt: null,
            completionDateKey: null
          }
    },
    updatedAt: now.toISOString()
  };

  return next;
}

export function countCompletedDays(progress: ProgressStore): number {
  return Object.values(progress.completions).filter((item) => item.completed).length;
}

export function getProgressPercent(progress: ProgressStore): number {
  return Math.round((countCompletedDays(progress) / TOTAL_DAYS) * 100);
}

export function getNextIncompleteDay(progress: ProgressStore): number {
  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    if (!progress.completions[day]?.completed) {
      return day;
    }
  }

  return TOTAL_DAYS;
}

export function getUniqueCompletionDates(progress: ProgressStore): string[] {
  const set = new Set<string>();

  Object.values(progress.completions).forEach((item) => {
    if (item.completed && item.completionDateKey) {
      set.add(item.completionDateKey);
    }
  });

  return Array.from(set).sort((a, b) => parseDateKeyToUtc(b) - parseDateKeyToUtc(a));
}

export function getStreakCount(progress: ProgressStore): number {
  // Count only unique completion dates so multiple completions in one day do not over-increment streak.
  const dates = getUniqueCompletionDates(progress);
  if (dates.length === 0) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i += 1) {
    if (dayDiff(dates[i], dates[i + 1]) === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function getLastCompletedDateKey(progress: ProgressStore): string | null {
  const dates = getUniqueCompletionDates(progress);
  return dates[0] ?? null;
}

export function getRecentActivity(progress: ProgressStore, limit = 6): RecentActivityItem[] {
  return Object.values(progress.completions)
    .filter((item): item is DayCompletion & { completedAt: string; completionDateKey: string } =>
      Boolean(item.completed && item.completedAt && item.completionDateKey)
    )
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, limit)
    .map((item) => ({
      dayNumber: item.dayNumber,
      completedAt: item.completedAt,
      completionDateKey: item.completionDateKey
    }));
}
