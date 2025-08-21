"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function ShakeModeToggle() {
  const [shakeMode, setShakeMode] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

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
    <div ref={wrapperRef} className="tooltip-wrapper" data-tooltip="Toggle shake mode (Cmd+Shift+S)">
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
    </div>
  )
}
