"use client"

import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
// import { AdBanner } from "@/components/ad-banner"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2" aria-label="MDViewer Home">
              <div className="relative h-12 w-48 dark:bg-[#020617] rounded">
                <Image 
                  src="/md-logo.png" 
                  alt="MDViewer - Free Online Markdown Editor and Viewer" 
                  fill
                  className="object-contain dark:invert dark:mix-blend-screen"
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Ad Placeholder Header 
            <div className="hidden md:block w-[300px] h-[40px] bg-muted/50 rounded border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
              <AdBanner 
                dataAdSlot={process.env.NEXT_PUBLIC_HEADER_AD_SLOT_ID ?? ""}
                dataFullWidthResponsive={false}
              />
            </div>
            */}
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full" role="main">
        <div className="w-full container mx-auto px-4 py-6 flex flex-col">
            {children}
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-12" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="relative h-10 w-40">
                <Image 
                  src="/md-logo.png" 
                  alt="MDViewer - Free Online Markdown Editor and Viewer" 
                  fill
                  className="object-contain dark:invert dark:mix-blend-screen"
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                The ultimate free online tool to view and edit Markdown files with real-time preview and GFM support.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground transition-colors">Markdown Editor</Link></li>
                <li><Link href="/markdown-tutorial" className="hover:text-foreground transition-colors">Markdown Tutorial</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-8">
            <div className="flex items-center gap-4">
              {/* Ad Placeholder Footer 
              <div className="flex w-[200px] h-[30px] bg-muted/50 rounded border border-dashed border-border items-center justify-center text-xs text-muted-foreground overflow-hidden">
                <AdBanner 
                  dataAdSlot={process.env.NEXT_PUBLIC_FOOTER_AD_SLOT_ID ?? ""}
                  dataFullWidthResponsive={false}
                />
              </div>
              */}
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} MDViewer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
