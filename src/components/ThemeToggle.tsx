
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative rounded-full bg-slate-100 dark:bg-slate-800 p-1 shadow-sm">
      <Toggle
        pressed={theme === "dark"}
        onPressedChange={() => setTheme(theme === "light" ? "dark" : "light")}
        className="rounded-full p-2 data-[state=on]:bg-transparent"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
        <span className="sr-only">Toggle theme</span>
      </Toggle>
    </div>
  );
}
