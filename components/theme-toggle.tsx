"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleToggleTheme = () => {
      setTheme(theme === "light" ? "dark" : "light")
    }

    window.addEventListener("toggle-theme", handleToggleTheme)
    return () => window.removeEventListener("toggle-theme", handleToggleTheme)
  }, [setTheme, theme])

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (!wrapperRef.current) return

      const rect = wrapperRef.current.getBoundingClientRect()
      const wrapper = wrapperRef.current

      // Reset classes
      wrapper.classList.remove("tooltip-below", "tooltip-left", "tooltip-right")

      // Check if tooltip would be cut off at top
      if (rect.top < 60) {
        wrapper.classList.add("tooltip-below")
      }

      // Check if tooltip would be cut off at right edge
      if (rect.right > window.innerWidth - 100) {
        wrapper.classList.add("tooltip-left")
      }

      // Check if tooltip would be cut off at left edge
      if (rect.left < 100) {
        wrapper.classList.add("tooltip-right")
      }
    }

    const handleMouseEnter = () => updateTooltipPosition()
    const wrapper = wrapperRef.current

    if (wrapper) {
      wrapper.addEventListener("mouseenter", handleMouseEnter)
      return () => wrapper.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="tooltip-wrapper" data-tooltip="Toggle theme (Cmd+Shift+T)">
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
