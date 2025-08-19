import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { JetBrains_Mono, Courier_Prime, Fira_Code } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
})

export const metadata: Metadata = {
  title: "Typo-graphy - Master Your Typing Skills",
  description:
    "A modern typing test app to improve your typing speed and accuracy. Practice with real-time feedback, scoring, and performance tracking.",
  generator: "v0.app",
  keywords: ["typing test", "typing speed", "WPM", "typing practice", "keyboard skills"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${jetbrainsMono.variable} ${courierPrime.variable} ${firaCode.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
