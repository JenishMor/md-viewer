import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden fixed inset-0">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-12 w-48 dark:bg-[#020617] rounded">
                <Image 
                  src="/logo.png" 
                  alt="MD Viewer Logo" 
                  fill
                  className="object-contain dark:invert dark:mix-blend-screen"
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
             {/* Ad Placeholder Header */}
            <div className="hidden md:block w-[300px] h-[40px] bg-muted/50 rounded border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
              Ad Space
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full container mx-auto px-4 py-6 flex flex-col">
            {children}
        </div>
      </main>

      <footer className="border-t border-border py-2">
        <div className="container mx-auto flex items-center justify-between px-4 h-12">
           {/* Ad Placeholder Footer Left */}
           <div className="hidden md:flex w-[200px] h-[30px] bg-muted/50 rounded border border-dashed border-border items-center justify-center text-xs text-muted-foreground">
              Ad Space
            </div>
           {/* Ad Placeholder Footer Right */}
           <div className="hidden md:flex w-[200px] h-[30px] bg-muted/50 rounded border border-dashed border-border items-center justify-center text-xs text-muted-foreground">
              Ad Space
            </div>
        </div>
      </footer>
    </div>
  )
}
