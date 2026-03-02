"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_KEY = "estonianfast-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldDark);
    setIsDark(shouldDark);
    setReady(true);
  }, []);

  const onToggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  };

  if (!ready) {
    return <div className="h-10 w-10" aria-hidden="true" />;
  }

  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="rounded-xl"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
