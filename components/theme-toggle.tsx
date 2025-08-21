"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const handleToggleTheme = () => {
      setTheme(theme === "light" ? "dark" : "light")
    }

    window.addEventListener("toggle-theme", handleToggleTheme)
    return () => window.removeEventListener("toggle-theme", handleToggleTheme)
  }, [setTheme, theme])

  return (
    <div className="tooltip-wrapper" data-tooltip="Toggle theme (Cmd+Shift+T)">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="h-9 w-9"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
