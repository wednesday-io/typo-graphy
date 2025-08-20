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
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    // If user types space, find the next space in the original text and jump there
    if (value.length > userInput.length && value[value.length - 1] === " ") {
      const nextSpaceIndex = currentText.indexOf(" ", currentIndex)
      if (nextSpaceIndex !== -1) {
        // Fill in the skipped characters as errors and jump to after the next space
        const skippedText = currentText.substring(userInput.length, nextSpaceIndex + 1)
        const newInput = userInput + skippedText
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
    return currentText.split("").map((char, index) => {
      let className = "transition-colors duration-150 "

      if (index < userInput.length) {
        // Typed characters
        if (userInput[index] === char) {
          className += "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
        } else {
          className += "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
        }
      } else if (index === currentIndex) {
        // Current character
        className += "bg-blue-500 dark:bg-blue-400 text-white animate-pulse"
      } else {
        // Untyped characters
        className += "text-gray-500 dark:text-gray-400"
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
        <p className="text-gray-600 dark:text-gray-400">Test your typing speed and accuracy</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-black dark:text-white">{stats.wpm}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
        </Card>
        <Card className="p-4 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-black dark:text-white">{stats.accuracy}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
        </Card>
        <Card className="p-4 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
        </Card>
        <Card className="p-4 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-black dark:text-white">{timeLeft}s</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Time Left</div>
        </Card>
      </div>

      {/* Typing Area */}
      <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          {/* Text Display */}
          <div className="text-lg leading-relaxed font-mono p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[120px] select-none">
            {renderText()}
          </div>

          {/* Input Area */}
          <textarea
            value={userInput}
            onChange={handleInputChange}
            disabled={isCompleted || timeLeft === 0}
            placeholder={isActive ? "Keep typing..." : "Click here and start typing to begin the test"}
            className="w-full h-32 p-4 text-lg font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-black dark:text-white"
            autoFocus
          />
        </div>
      </Card>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button onClick={resetTest} variant="outline" className="border-gray-300 dark:border-gray-600 bg-transparent">
          New Test
        </Button>
        {isCompleted && (
          <Button
            onClick={resetTest}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Try Again
          </Button>
        )}
      </div>

      {/* Results */}
      {isCompleted && (
        <Card className="p-6 text-center space-y-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-black dark:text-white">Test Complete!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
            <div>
              <div className="text-3xl font-bold text-black dark:text-white">{stats.wpm}</div>
              <div className="text-gray-600 dark:text-gray-400">Words per minute</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black dark:text-white">{stats.accuracy}%</div>
              <div className="text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">{stats.errors}</div>
              <div className="text-gray-600 dark:text-gray-400">Total errors</div>
            </div>
          </div>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Keyboard shortcuts: Cmd+Shift+R (restart) • Cmd+Shift+T (theme) • Cmd+Shift+F (font)</p>
      </div>
    </div>
  )
}
