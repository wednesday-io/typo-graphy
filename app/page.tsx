"use client"
import { useState } from "react"
import TypingTest from "@/components/typing-test"
import { ThemeToggle } from "@/components/theme-toggle"
import { FontSelector } from "@/components/font-selector"
import ShakeModeToggle from "@/components/shake-mode-toggle"

export default function Home() {
  const [selectedFont, setSelectedFont] = useState("font-mono")

  return (
    <div className={`min-h-screen bg-background ${selectedFont}`}>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-foreground">Typo-graphy</h1>
        <div className="flex items-center gap-2">
          <ShakeModeToggle />
          <FontSelector selectedFont={selectedFont} onFontChange={setSelectedFont} />
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4">
        <TypingTest />
      </main>
    </div>
  )
}
