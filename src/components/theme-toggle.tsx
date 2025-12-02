"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
        <button className={cn("relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent", className)}>
            <span className="sr-only">Toggle theme</span>
        </button>
    )
  }

  return (
    <button
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent hover:bg-accent hover:text-accent-foreground cursor-pointer",
        className
      )}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Sun icon shows in Dark mode (to switch to light) */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      {/* Moon icon shows in Light mode (to switch to dark) */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
