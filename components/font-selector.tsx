"use client"
import { ChevronDown, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const fonts = [
  { name: "Geist Sans", value: "font-geist", label: "Modern Sans" },
  { name: "Geist Mono", value: "font-mono", label: "Monospace" },
  { name: "JetBrains Mono", value: "font-jetbrains", label: "Code Font" },
  { name: "Courier Prime", value: "font-courier", label: "Typewriter" },
  { name: "Fira Code", value: "font-fira", label: "Programming" },
]

interface FontSelectorProps {
  selectedFont: string
  onFontChange: (font: string) => void
}

export function FontSelector({ selectedFont, onFontChange }: FontSelectorProps) {
  const currentFont = fonts.find((font) => font.value === selectedFont) || fonts[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2">
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline">{currentFont.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onClick={() => onFontChange(font.value)}
            className={`${font.value} cursor-pointer`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{font.name}</span>
              <span className="text-xs text-muted-foreground">{font.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
