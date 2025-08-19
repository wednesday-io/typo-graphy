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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

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
    return currentText.split("").map((char, index) => {
      let className = "transition-colors duration-150 "

      if (index < userInput.length) {
        // Typed characters
        if (userInput[index] === char) {
          className += "text-[color:var(--typing-correct)] bg-green-100 dark:bg-green-900/20"
        } else {
          className += "text-[color:var(--typing-incorrect)] bg-red-100 dark:bg-red-900/20"
        }
      } else if (index === currentIndex) {
        // Current character
        className += "bg-[color:var(--typing-current)] text-white animate-pulse"
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">TypeSpeed</h1>
          <p className="text-muted-foreground">Test your typing speed and accuracy</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.wpm}</div>
            <div className="text-sm text-muted-foreground">WPM</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.errors}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{timeLeft}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </Card>
        </div>

        {/* Typing Area */}
        <Card className="p-6">
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
              className="w-full h-32 p-4 text-lg font-mono bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus
            />
          </div>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button onClick={resetTest} variant="outline">
            New Test
          </Button>
          {isCompleted && (
            <Button onClick={resetTest} className="bg-primary hover:bg-primary/90">
              Try Again
            </Button>
          )}
        </div>

        {/* Results */}
        {isCompleted && (
          <Card className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Test Complete!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
              <div>
                <div className="text-3xl font-bold text-primary">{stats.wpm}</div>
                <div className="text-muted-foreground">Words per minute</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{stats.accuracy}%</div>
                <div className="text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-destructive">{stats.errors}</div>
                <div className="text-muted-foreground">Total errors</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
