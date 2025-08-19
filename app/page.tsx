import TypingTest from "@/components/typing-test"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-foreground">Typo-graphy</h1>
        <ThemeToggle />
      </header>
      <main className="container mx-auto px-4">
        <TypingTest />
      </main>
    </div>
  )
}
