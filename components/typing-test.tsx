"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

const SAMPLE_TEXTS = [
  {
    text: "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
    source: "Classic Pangram",
  },
  {
    text: "Programming is the art of telling another human being what one wants the computer to do. It requires patience and precision.",
    source: "Programming Wisdom",
  },
  {
    text: "In the world of technology, typing speed and accuracy are essential skills that can significantly improve productivity.",
    source: "Tech Skills",
  },
  {
    text: "Practice makes perfect when it comes to developing muscle memory for keyboard layouts and common word patterns.",
    source: "Learning Theory",
  },
  {
    text: "People's lives don't end when they die. It ends when they lose faith. The most important thing is not how long you live, but what you accomplish with your life.",
    source: "Itachi Uchiha - Naruto",
  },
  {
    text: "If you don't take risks, you can't create a future. I'm gonna be King of the Pirates! I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean is the Pirate King!",
    source: "Monkey D. Luffy - One Piece",
  },
  {
    text: "The world is not perfect. But it's there for us, doing the best it can. That's what makes it so damn beautiful. Even if we make mistakes, we can keep moving forward.",
    source: "Roy Mustang - Fullmetal Alchemist",
  },
  {
    text: "Hard work is absolutely necessary. But in the end, your ability to adapt is far more important. The real question is whether you have it in you to change.",
    source: "Killua Zoldyck - Hunter x Hunter",
  },
  {
    text: "It's not the face that makes someone a monster, it's the choices they make with their lives. Everyone deserves to be happy, including you.",
    source: "Naruto Uzumaki - Naruto",
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long. Your feelings are what make you human, so don't ever lose them.",
    source: "Natsu Dragneel - Fairy Tail",
  },
  {
    text: "Being weak is nothing to be ashamed of. Staying weak is. The only time you should ever look back is to see how far you've come.",
    source: "Fuegoleon Vermillion - Black Clover",
  },
  {
    text: "Dreams don't have expiration dates. Take a deep breath and try again. A true hero isn't measured by the size of his strength, but by the strength of his heart.",
    source: "All Might - My Hero Academia",
  },
  {
    text: "The only way to truly escape the mundane is for you to constantly be evolving. Science is the power to overcome any obstacle, no matter how impossible it may seem.",
    source: "Senku Ishigami - Dr. Stone",
  },
  {
    text: "Sometimes you need someone to save you from your own strength. The difference between the novice and the master is that the master has failed more times than the novice has tried.",
    source: "Levi Ackerman - Attack on Titan",
  },
  {
    text: "I am inevitable. I used the stones to destroy the stones. It nearly killed me, but the work is done. It always will be. I am... inevitable.",
    source: "Thanos - Avengers: Endgame",
  },
  {
    text: "With great power comes great responsibility. Remember, with great power comes great responsibility. And remember, Peter, with great power comes great responsibility.",
    source: "Uncle Ben - Spider-Man",
  },
  {
    text: "May the Force be with you. Do or do not, there is no try. Fear is the path to the dark side. Fear leads to anger, anger leads to hate, hate leads to suffering.",
    source: "Star Wars",
  },
  {
    text: "I'll be back. Come with me if you want to live. The future is not set. There is no fate but what we make for ourselves.",
    source: "The Terminator",
  },
  {
    text: "Why so serious? Let's put a smile on that face. You see, madness, as you know, is like gravity. All it takes is a little push.",
    source: "The Joker - The Dark Knight",
  },
  {
    text: "That's what she said. I'm not superstitious, but I am a little stitious. Sometimes I'll start a sentence and I don't even know where it's going. I just hope I find it along the way.",
    source: "Michael Scott - The Office",
  },
  {
    text: "Winter is coming. A mind needs books as a sword needs a whetstone, if it is to keep its edge. The man who passes the sentence should swing the sword.",
    source: "Game of Thrones",
  },
  {
    text: "I am the one who knocks. Say my name. You're goddamn right. I'm not in danger, Skyler. I am the danger. A guy opens his door and gets shot, and you think that of me? No. I am the one who knocks!",
    source: "Walter White - Breaking Bad",
  },
  {
    text: "The hardest choices require the strongest wills. You could not live with your own failure. Where did that bring you? Back to me. I thought by eliminating half of life, the other half would thrive.",
    source: "Thanos - Avengers: Infinity War",
  },
  {
    text: "I can do this all day. I'm with you 'til the end of the line. The price of freedom is high. It always has been. But it's a price I'm willing to pay.",
    source: "Captain America - Marvel",
  },
  {
    text: "Believe it! I'm gonna be Hokage someday! I won't run away anymore. I won't go back on my word. That is my ninja way! The next generation will always surpass the previous one.",
    source: "Naruto Uzumaki - Naruto",
  },
  {
    text: "I'm going to be the Pirate King! I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean is the Pirate King! Being alone is more painful than getting hurt.",
    source: "Monkey D. Luffy - One Piece",
  },
  {
    text: "Plus Ultra! A real hero always finds a way for justice to be served. Whether you win or lose, you can always come out ahead by learning from the experience.",
    source: "All Might - My Hero Academia",
  },
  {
    text: "I'll take a potato chip... and eat it! I am justice! I protect the innocent and those who fear evil. I'm the one who will become the god of a new world that everyone desires!",
    source: "Light Yagami - Death Note",
  },
  {
    text: "It's over 9000! I am the prince of all Saiyans! My pride is my strength! I will surpass Kakarot, and I will become the strongest warrior in the universe!",
    source: "Vegeta - Dragon Ball Z",
  },
  {
    text: "I want to be the very best, like no one ever was. To catch them is my real test, to train them is my cause. I will travel across the land, searching far and wide.",
    source: "Pokémon Theme Song",
  },
]

interface TypingStats {
  wpm: number
  accuracy: number
  errors: number
  timeElapsed: number
}

export default function TypingTest() {
  const [currentTextObj, setCurrentTextObj] = useState({ text: "", source: "" })
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
    for (let i = 0; i < Math.min(userInput.length, currentTextObj.text.length); i++) {
      if (userInput[i] !== currentTextObj.text[i]) {
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
  }, [userInput, currentTextObj.text, timeLeft])

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
      const nextSpaceIndex = currentTextObj.text.indexOf(" ", currentIndex)
      if (nextSpaceIndex !== -1) {
        // Fill in the skipped characters and jump to after the next space
        const newInput = userInput + currentTextObj.text.substring(userInput.length, nextSpaceIndex + 1)
        setUserInput(newInput)
        setCurrentIndex(newInput.length)

        // Start the test on first keystroke
        if (!isActive && newInput.length === 1) {
          setIsActive(true)
        }

        // Check if completed
        if (newInput.length === currentTextObj.text.length) {
          setIsActive(false)
          setIsCompleted(true)
        }
        return
      }
    }

    // Don't allow typing beyond the text length
    if (value.length <= currentTextObj.text.length) {
      setUserInput(value)
      setCurrentIndex(value.length)

      // Start the test on first keystroke
      if (!isActive && value.length === 1) {
        setIsActive(true)
      }

      // Check if completed
      if (value.length === currentTextObj.text.length) {
        setIsActive(false)
        setIsCompleted(true)
      }
    }
  }

  const restartSameTest = () => {
    setUserInput("")
    setCurrentIndex(0)
    setIsActive(false)
    setTimeLeft(60)
    setIsCompleted(false)
    setStats({ wpm: 0, accuracy: 100, errors: 0, timeElapsed: 0 })
  }

  const resetTest = () => {
    const randomTextObj = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
    setCurrentTextObj(randomTextObj)
    setUserInput("")
    setCurrentIndex(0)
    setIsActive(false)
    setTimeLeft(60)
    setIsCompleted(false)
    setStats({ wpm: 0, accuracy: 100, errors: 0, timeElapsed: 0 })
  }

  const renderText = () => {
    const words = currentTextObj.text.split(" ")
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

    return currentTextObj.text.split("").map((char, index) => {
      let className = "transition-colors duration-150 "

      if (shakeMode && index >= currentWordStart && index <= currentWordEnd && !isCompleted) {
        className += "animate-pulse animate-bounce "
      }

      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += "text-green-400"
        } else {
          className += "text-red-400"
        }
      } else if (index === currentIndex && userInput.length > 0) {
        className += "text-blue-400 animate-pulse"
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
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="flex justify-center items-center gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-white">{stats.wpm}</div>
          <div className="text-sm text-white/70">WPM</div>
        </div>
        <div className="w-px h-12 bg-white/20"></div>
        <div>
          <div className="text-3xl font-bold text-white">{stats.accuracy}%</div>
          <div className="text-sm text-white/70">Accuracy</div>
        </div>
        <div className="w-px h-12 bg-white/20"></div>
        <div>
          <div className="text-3xl font-bold text-red-400">{stats.errors}</div>
          <div className="text-sm text-white/70">Errors</div>
        </div>
        <div className="w-px h-12 bg-white/20"></div>
        <div>
          <div className="text-3xl font-bold text-white">{timeLeft}s</div>
          <div className="text-sm text-white/70">Time Left</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Text Display */}
        <div className="text-xl leading-relaxed font-mono p-6 bg-white/5 rounded-lg min-h-[140px] select-none border border-white/10 relative">
          {renderText()}
          {isCompleted && (
            <div className="absolute bottom-2 right-4 text-white/70 text-sm italic">— {currentTextObj.source}</div>
          )}
        </div>

        {/* Input Area */}
        <textarea
          value={userInput}
          onChange={handleInputChange}
          disabled={isCompleted || timeLeft === 0}
          placeholder={isActive ? "Keep typing..." : "Click here and start typing to begin the test"}
          className="w-full h-32 p-4 text-lg font-mono bg-white/5 border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-white/50"
          autoFocus
        />
      </div>

      <div className="flex justify-center gap-4">
        {isCompleted && (
          <Button
            onClick={restartSameTest}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2"
          >
            Restart Test
          </Button>
        )}
        <Button
          onClick={resetTest}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2"
        >
          New Test
        </Button>
      </div>
    </div>
  )
}
