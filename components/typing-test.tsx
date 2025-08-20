"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
  "Programming is the art of telling another human being what one wants the computer to do. It requires patience and precision.",
  "In the world of technology, typing speed and accuracy are essential skills that can significantly improve productivity.",
  "Practice makes perfect when it comes to developing muscle memory for keyboard layouts and common word patterns.",
]

interface TypingStats {
  wpm: number
  accuracy: number
  errors: number
  timeElapsed: number
}

export default function TypingTest() {
  const [currentText, setCurrentText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    timeElapsed: 0,
  })
  const [isCompleted, setIsCompleted] = useState(false)
  const [shakeMode, setShakeMode] = useState(false)

  // Initialize with random text
  useEffect(() => {
    resetTest()
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false)
            setIsCompleted(true)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isCompleted])

  // Calculate stats
  const calculateStats = useCallback(() => {
    const timeElapsed = 60 - timeLeft
    const wordsTyped = userInput.trim().split(" ").length
    const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0

    let errors = 0
    for (let i = 0; i < Math.min(userInput.length, currentText.length); i++) {
      if (userInput[i] !== currentText[i]) {
        errors++
      }
    }

    const accuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100

    setStats({
      wpm,
      accuracy,
      errors,
      timeElapsed,
    })
  }, [userInput, currentText, timeLeft])

  useEffect(() => {
    calculateStats()
  }, [calculateStats])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "r":
            e.preventDefault()
            resetTest()
            break
          case "t":
            e.preventDefault()
            // Trigger theme toggle - dispatch custom event
            window.dispatchEvent(new CustomEvent("toggle-theme"))
            break
          case "f":
            e.preventDefault()
            // Trigger font selector - dispatch custom event
            window.dispatchEvent(new CustomEvent("toggle-font"))
            break
          case "s":
            e.preventDefault()
            // Trigger shake mode toggle - dispatch custom event
            window.dispatchEvent(new CustomEvent("toggle-shake-mode"))
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleShakeModeChange = (e: CustomEvent) => {
      setShakeMode(e.detail)
    }

    window.addEventListener("shake-mode-change", handleShakeModeChange as EventListener)
    return () => window.removeEventListener("shake-mode-change", handleShakeModeChange as EventListener)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (value.length > userInput.length && value[value.length - 1] === " ") {
      const nextSpaceIndex = currentText.indexOf(" ", currentIndex)
      if (nextSpaceIndex !== -1) {
        // Fill in the skipped characters and jump to after the next space
        const newInput = userInput + currentText.substring(userInput.length, nextSpaceIndex + 1)
        setUserInput(newInput)
        setCurrentIndex(newInput.length)

        // Start the test on first keystroke
        if (!isActive && newInput.length === 1) {
          setIsActive(true)
        }

        // Check if completed
        if (newInput.length === currentText.length) {
          setIsActive(false)
          setIsCompleted(true)
        }
        return
      }
    }

    // Don't allow typing beyond the text length
    if (value.length <= currentText.length) {
      setUserInput(value)
      setCurrentIndex(value.length)

      // Start the test on first keystroke
      if (!isActive && value.length === 1) {
        setIsActive(true)
      }

      // Check if completed
      if (value.length === currentText.length) {
        setIsActive(false)
        setIsCompleted(true)
      }
    }
  }

  const resetTest = () => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
    setCurrentText(randomText)
    setUserInput("")
    setCurrentIndex(0)
    setIsActive(false)
    setTimeLeft(60)
    setIsCompleted(false)
    setStats({ wpm: 0, accuracy: 100, errors: 0, timeElapsed: 0 })
  }

  const renderText = () => {
    const words = currentText.split(" ")
    let currentWordStart = 0
    let currentWordEnd = 0
    let wordIndex = 0

    // Find which word the current index is in
    for (let i = 0; i < words.length; i++) {
      currentWordEnd = currentWordStart + words[i].length
      if (currentIndex >= currentWordStart && currentIndex <= currentWordEnd) {
        wordIndex = i
        break
      }
      currentWordStart = currentWordEnd + 1 // +1 for space
    }

    return currentText.split("").map((char, index) => {
      let className = "transition-colors duration-150 "

      if (shakeMode && index >= currentWordStart && index <= currentWordEnd && !isCompleted) {
        className += "animate-pulse animate-bounce "
      }

      if (index < userInput.length) {
        // Typed characters
        if (userInput[index] === char) {
          className += "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
        } else {
          className += "text-red-400 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
        }
      } else if (index === currentIndex) {
        // Current character
        className += "bg-primary text-primary-foreground animate-pulse"
      } else {
        // Untyped characters
        className += "text-muted-foreground"
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">Test your typing speed and accuracy</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-card border-border">
          <div className="text-2xl font-bold text-card-foreground">{stats.wpm}</div>
          <div className="text-sm text-muted-foreground">WPM</div>
        </Card>
        <Card className="p-4 text-center bg-card border-border">
          <div className="text-2xl font-bold text-card-foreground">{stats.accuracy}%</div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </Card>
        <Card className="p-4 text-center bg-card border-border">
          <div className="text-2xl font-bold text-destructive">{stats.errors}</div>
          <div className="text-sm text-muted-foreground">Errors</div>
        </Card>
        <Card className="p-4 text-center bg-card border-border">
          <div className="text-2xl font-bold text-card-foreground">{timeLeft}s</div>
          <div className="text-sm text-muted-foreground">Time Left</div>
        </Card>
      </div>

      {/* Typing Area */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          {/* Text Display */}
          <div className="text-lg leading-relaxed font-mono p-4 bg-muted rounded-lg min-h-[120px] select-none">
            {renderText()}
          </div>

          {/* Input Area */}
          <textarea
            value={userInput}
            onChange={handleInputChange}
            disabled={isCompleted || timeLeft === 0}
            placeholder={isActive ? "Keep typing..." : "Click here and start typing to begin the test"}
            className="w-full h-32 p-4 text-lg font-mono bg-input border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
            autoFocus
          />
        </div>
      </Card>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button onClick={resetTest} variant="outline" className="border-border bg-transparent">
          New Test
        </Button>
        {isCompleted && (
          <Button onClick={resetTest} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Try Again
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Keyboard shortcuts: Cmd+Shift+R (restart) • Cmd+Shift+T (theme) • Cmd+Shift+F (font) • Cmd+Shift+S (shake)
        </p>
      </div>
    </div>
  )
}
