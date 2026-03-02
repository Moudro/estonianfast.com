"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

function pageTitle(pathname: string) {
  if (pathname.startsWith("/app/day/")) {
    const day = pathname.replace("/app/day/", "");
    return `Day ${day}`;
  }

  if (pathname === "/app/method") return "Method";
  if (pathname === "/app/settings") return "Settings";
  return "Dashboard";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="hidden border-r border-slate-200 lg:block dark:border-slate-800">
          <div className="sticky top-0 h-screen">
            <AppSidebar />
          </div>
        </div>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f7f8fa]/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
            <div className="mx-auto flex h-16 w-full max-w-[1160px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open sidebar"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{pageTitle(pathname)}</p>
              </div>

              <ThemeToggle />
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1160px] p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Sidebar">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar overlay"
          />
          <div className="relative h-full w-[88vw] max-w-[320px] border-r border-slate-200 bg-slate-100 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-end px-3 py-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-[calc(100%-52px)] overflow-y-auto">
              <AppSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
