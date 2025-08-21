"use client"
import { useState } from "react"
import TypingTest from "@/components/typing-test"
import { ThemeToggle } from "@/components/theme-toggle"
import { FontSelector } from "@/components/font-selector"
// import ShakeModeToggle from "@/components/shake-mode-toggle"

export default function Home() {
  const [selectedFont, setSelectedFont] = useState("font-mono")

  return (
    <div className={`min-h-screen bg-background ${selectedFont} flex flex-col`}>
      <header className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold text-white">Typo-graphy</h1>
        <div className="flex items-center gap-3">
          {/* <ShakeModeToggle /> */}
          <FontSelector selectedFont={selectedFont} onFontChange={setSelectedFont} />
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto px-6 flex-1">
        <TypingTest />
      </main>
      <footer className="text-center py-6 mt-auto">
        <p className="text-sm text-white/50">v17.0.0</p>
      </footer>
    </div>
  )
}
