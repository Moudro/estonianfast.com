"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  CheckCircle2,
  Compass,
  LayoutDashboard,
  Circle,
  Settings,
  PlayCircle
} from "lucide-react";
import { WEEK_GROUPS } from "@/lib/day-plan";
import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TOTAL_DAYS } from "@/lib/progress";

type AppSidebarProps = {
  onNavigate?: () => void;
};

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const { isCompleted, currentDay, hydrated } = useProgress();
  const allDayNumbers = React.useMemo(() => Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1), []);

  const topItems = [
    { href: "/app/method", label: "Method", icon: Compass },
    { href: "/app", label: "Dashboard", icon: LayoutDashboard }
  ];

  return (
    <aside className="flex h-full flex-col bg-slate-100/80 px-3 py-4 dark:bg-slate-900/80">
      <div className="px-2 pb-3">
        <Link href="/app/method" className="flex items-center gap-2" onClick={onNavigate}>
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">estonianfast</span>
        </Link>
      </div>

      <nav aria-label="Primary" className="space-y-1 px-1">
        {topItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-900",
                active
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Separator className="my-4" />

      <div className="px-3 pb-2">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">30-Day Plan</p>
        <p className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">All days 1-30 are listed below.</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-scroll px-1 pb-4 [scrollbar-gutter:stable]" aria-label="Day navigation">
        <div className="rounded-xl border border-slate-200/80 bg-white/70 p-2 dark:border-slate-800 dark:bg-slate-900/60">
          <ul className="space-y-0.5" role="list">
            {allDayNumbers.map((dayNumber) => {
              const weekStart = WEEK_GROUPS.find((week) => week.start === dayNumber);
              const href = `/app/day/${dayNumber}`;
              const completed = hydrated ? isCompleted(dayNumber) : false;
              const active = isActive(pathname, href);
              const isCurrent = hydrated && currentDay === dayNumber;

              return (
                <React.Fragment key={dayNumber}>
                  {weekStart ? (
                    <li className="px-2.5 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {weekStart.label} · Days {weekStart.start}-{weekStart.end}
                    </li>
                  ) : null}
                  <li>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                        active
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                        ) : isCurrent ? (
                          <PlayCircle className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                        )}
                        <span className="truncate">Day {dayNumber}</span>
                      </span>
                      {isCurrent && !completed ? <span className="h-2 w-2 rounded-full bg-indigo-500" aria-label="Current day" /> : null}
                    </Link>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </div>

      <Separator className="mb-3" />

      <div className="space-y-2 px-2">
        <Link
          href="/app/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
            pathname === "/app/settings"
              ? "bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
              : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
        <Badge variant="secondary" className="w-fit">Free Access</Badge>
      </div>
    </aside>
  );
}
