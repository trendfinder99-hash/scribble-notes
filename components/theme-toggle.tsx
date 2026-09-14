"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex items-center gap-1.5 rounded-full border-2 border-stone-400/50 bg-white/70 px-3 py-1.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:scale-105 dark:border-stone-600 dark:bg-stone-800/80 dark:text-stone-200"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4" /> Dark
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" /> Light
        </>
      )}
    </button>
  );
}
