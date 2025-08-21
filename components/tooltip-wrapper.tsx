"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface TooltipWrapperProps {
  children: ReactNode
  tooltip: string
}

export function TooltipWrapper({ children, tooltip }: TooltipWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatePosition = () => {
      if (!wrapperRef.current) return

      const rect = wrapperRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      // Reset position classes
      wrapperRef.current.removeAttribute("data-position")

      // Check if element is near top of viewport (show tooltip below)
      if (rect.top < 60) {
        wrapperRef.current.setAttribute("data-position", "bottom")
      }
      // Check if element is near right edge (show tooltip to the left)
      else if (rect.right > viewportWidth - 100) {
        wrapperRef.current.setAttribute("data-position", "left")
      }
      // Check if element is near left edge (show tooltip to the right)
      else if (rect.left < 100) {
        wrapperRef.current.setAttribute("data-position", "right")
      }
    }

    const handleMouseEnter = () => {
      updatePosition()
    }

    const element = wrapperRef.current
    if (element) {
      element.addEventListener("mouseenter", handleMouseEnter)
      return () => element.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="tooltip-wrapper" data-tooltip={tooltip}>
      {children}
    </div>
  )
}
