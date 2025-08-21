"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TooltipWrapper } from "./tooltip-wrapper"

export default function ShakeModeToggle() {
  const [shakeMode, setShakeMode] = useState(false)

  // Listen for keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault()
        setShakeMode((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Dispatch shake mode changes to typing test
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("shake-mode-change", { detail: shakeMode }))
  }, [shakeMode])

  return (
    <TooltipWrapper tooltip="Toggle shake mode (Cmd+Shift+S)">
      <Button
        onClick={() => setShakeMode(!shakeMode)}
        variant={shakeMode ? "default" : "outline"}
        size="sm"
        className={
          shakeMode
            ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            : "border-gray-300 dark:border-gray-600 bg-transparent"
        }
      >
        {shakeMode ? "🎉 Shake" : "Shake"}
      </Button>
    </TooltipWrapper>
  )
}
