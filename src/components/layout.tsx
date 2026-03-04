"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
// import { AdBanner } from "@/components/ad-banner"

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header
        className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="banner"
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center space-x-2"
              aria-label="MDViewer Home"
            >
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
            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Main navigation"
            >
              <Link
                href="/guides"
                className={`text-sm font-medium transition-colors ${pathname === "/guides" || pathname.startsWith("/guides/") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Guides
              </Link>
              <Link
                href="/markdown-tutorial"
                className={`text-sm font-medium transition-colors ${pathname === "/markdown-tutorial" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Tutorial
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors ${pathname === "/about" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors ${pathname === "/contact" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Contact
              </Link>
            </nav>
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
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <Menu
                className={`h-5 w-5 transition-transform duration-200 ${mobileMenuOpen ? "hidden" : "block"}`}
              />
              <X
                className={`h-5 w-5 transition-transform duration-200 ${mobileMenuOpen ? "block" : "hidden"}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation - always rendered, visibility toggled via CSS */}
        <nav
          className={`md:hidden border-t border-border bg-background overflow-hidden transition-all duration-200 ease-in-out ${mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-t-0"}`}
          aria-label="Mobile navigation"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="container mx-auto px-4 py-4 space-y-1">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/" ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/guides"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/guides" || pathname.startsWith("/guides/") ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              onClick={closeMobileMenu}
            >
              Guides
            </Link>
            <Link
              href="/markdown-tutorial"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/markdown-tutorial" ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              onClick={closeMobileMenu}
            >
              Tutorial
            </Link>
            <Link
              href="/about"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/about" ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/contact" ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full overflow-x-hidden" role="main">
        <div className="w-full container mx-auto px-4 py-6 flex flex-col min-w-0">
          {children}
        </div>
      </main>

      <footer
        className="border-t border-border bg-card/50 py-12"
        role="contentinfo"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="sm:col-span-2 space-y-4">
              <div className="relative h-10 w-40">
                <Image
                  src="/md-logo.png"
                  alt="MDViewer - Free Online Markdown Editor and Viewer"
                  fill
                  className="object-contain dark:invert dark:mix-blend-screen"
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                The ultimate free online tool to view and edit Markdown files
                with real-time preview and GFM support.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Markdown Editor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/markdown-tutorial"
                    className="hover:text-foreground transition-colors"
                  >
                    Markdown Tutorial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Guides</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-foreground transition-colors"
                  >
                    All Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/readme-best-practices"
                    className="hover:text-foreground transition-colors"
                  >
                    README Best Practices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/github-flavored-markdown"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub Flavored Markdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/markdown-vs-rich-text"
                    className="hover:text-foreground transition-colors"
                  >
                    Markdown vs Rich Text
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/technical-documentation"
                    className="hover:text-foreground transition-colors"
                  >
                    Technical Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/markdown-for-bloggers"
                    className="hover:text-foreground transition-colors"
                  >
                    Markdown for Bloggers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/markdown-tables-guide"
                    className="hover:text-foreground transition-colors"
                  >
                    Markdown Tables
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/common-markdown-mistakes"
                    className="hover:text-foreground transition-colors"
                  >
                    Common Mistakes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
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
            <p
              className="text-xs text-muted-foreground"
              suppressHydrationWarning
            >
              &copy; {new Date().getFullYear()} MDViewer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
