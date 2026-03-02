"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Flame } from "lucide-react";
import { DAY_PLAN, WEEK_GROUPS } from "@/lib/day-plan";
import { useProgress } from "@/components/progress-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function formatDateLabel(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(new Date(iso));
}

export default function DashboardPage() {
  const {
    hydrated,
    completedDays,
    progressPercent,
    streakCount,
    currentDay,
    isCompleted,
    recentActivity
  } = useProgress();

  const week = WEEK_GROUPS.find((group) => currentDay >= group.start && currentDay <= group.end) ?? WEEK_GROUPS[WEEK_GROUPS.length - 1];
  const weekDays = DAY_PLAN.filter((item) => item.dayNumber >= week.start && item.dayNumber <= week.end);
  const weekCompleted = weekDays.filter((item) => isCompleted(item.dayNumber)).length;

  const upcomingDays = DAY_PLAN.filter((item) => item.dayNumber >= currentDay).slice(0, 4);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-40" />
        <Skeleton className="h-52" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed Days</CardDescription>
            <CardTitle className="text-3xl tracking-tight">{completedDays}/30</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-slate-500 dark:text-slate-400">Keep momentum with one day at a time.</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl tracking-tight">
              <Flame className="h-6 w-6 text-orange-500" />
              {streakCount} day{streakCount === 1 ? "" : "s"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-slate-500 dark:text-slate-400">Consecutive completion dates in your local timezone.</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Progress</CardDescription>
            <CardTitle className="text-3xl tracking-tight">{progressPercent}%</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Progress value={progressPercent} label="30-day plan completion" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Continue Your Plan</CardTitle>
            <CardDescription>Pick up at the next incomplete day and keep execution simple.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Next up</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">Day {currentDay}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{DAY_PLAN[currentDay - 1]?.subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/app/day/${currentDay}`}>
                <Button>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/app/day/1">
                <Button variant="outline">Start from Day 1</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">This Week</CardTitle>
            <CardDescription>
              {week.label} progress: {weekCompleted}/{weekDays.length} days complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={Math.round((weekCompleted / weekDays.length) * 100)} />
            <div className="space-y-2">
              {upcomingDays.map((day) => (
                <div
                  key={day.dayNumber}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="min-w-0">
                    <p className="font-medium">Day {day.dayNumber}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{day.subtitle}</p>
                  </div>
                  {isCompleted(day.dayNumber) ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Badge variant="secondary">Upcoming</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest completion events from your 30-day challenge.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No activity yet. Complete Day 1 to start your timeline.</p>
            ) : (
              <ul className="space-y-2" role="list">
                {recentActivity.map((item) => (
                  <li
                    key={`${item.dayNumber}-${item.completedAt}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-200">Day {item.dayNumber} completed</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDateLabel(item.completedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
