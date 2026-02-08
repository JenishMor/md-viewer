import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mdviewer.in'),
  title: {
    default: "MD Viewer - Free Online Markdown Editor & Live Preview | MDViewer",
    template: "%s | MDViewer"
  },
  description: "Free online markdown viewer and editor with real-time preview. Edit and preview markdown files instantly with GitHub Flavored Markdown (GFM) support. Perfect for developers, writers, and content creators. No signup required.",
  keywords: [
    // Primary keywords
    "markdown viewer",
    "md viewer", 
    "markdown editor",
    "online markdown editor",
    "markdown preview",
    "live markdown preview",
    // Secondary keywords
    "markdown editor online free",
    "github markdown viewer",
    "gfm viewer",
    "markdown file viewer",
    "markdown live editor",
    "real-time markdown preview",
    // Long-tail keywords
    "view markdown files online",
    "edit markdown online",
    "markdown to html preview",
    "markdown syntax viewer",
    "markdown formatting tool",
    "online md file editor",
    "free markdown editor",
    "markdown preview tool",
    "markdown renderer online",
    "github flavored markdown editor"
  ],
  authors: [{ name: "MDViewer Team", url: "https://mdviewer.in" }],
  creator: "MDViewer",
  publisher: "MDViewer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://mdviewer.in",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://mdviewer.in",
    title: "MD Viewer - Free Online Markdown Editor & Live Preview",
    description: "Free online markdown viewer and editor with real-time preview. Edit and preview markdown files instantly with GitHub Flavored Markdown (GFM) support. No signup required.",
    siteName: "MDViewer",
    images: [
      {
        url: "https://mdviewer.in/logo.png",
        width: 512,
        height: 512,
        alt: "MDViewer - Online Markdown Editor Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MD Viewer - Free Online Markdown Editor & Live Preview",
    description: "Free online markdown viewer and editor with real-time preview. Edit and preview markdown files instantly with GFM support.",
    images: ["https://mdviewer.in/logo.png"],
  },
  category: "Technology",
  applicationName: "MDViewer",
  other: {
    "google-adsense-account": "ca-pub-8617635656002994",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "WebApplication",
                    "@id": "https://mdviewer.in/#webapp",
                    "name": "MDViewer - Online Markdown Editor",
                    "url": "https://mdviewer.in",
                    "description": "Free online markdown viewer and editor with real-time preview. Edit and preview markdown files instantly with GitHub Flavored Markdown (GFM) support.",
                    "applicationCategory": "DeveloperApplication",
                    "operatingSystem": "Any",
                    "browserRequirements": "Requires JavaScript. Requires HTML5.",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "USD"
                    },
                    "featureList": [
                      "Real-time markdown preview",
                      "GitHub Flavored Markdown support",
                      "Syntax highlighting",
                      "Dark mode support",
                      "No registration required",
                      "Free to use"
                    ],
                    "screenshot": "https://mdviewer.in/logo.png"
                  },
                  {
                    "@type": "SoftwareApplication",
                    "@id": "https://mdviewer.in/#software",
                    "name": "MDViewer",
                    "applicationCategory": "WebApplication",
                    "operatingSystem": "Web Browser",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "USD"
                    }
                  },
                  {
                    "@type": "Organization",
                    "@id": "https://mdviewer.in/#organization",
                    "name": "MDViewer",
                    "url": "https://mdviewer.in",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://mdviewer.in/logo.png",
                      "width": 512,
                      "height": 512
                    },
                    "sameAs": []
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://mdviewer.in/#website",
                    "url": "https://mdviewer.in",
                    "name": "MDViewer",
                    "description": "Free online markdown viewer and editor with real-time preview",
                    "publisher": {
                      "@id": "https://mdviewer.in/#organization"
                    },
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": "https://mdviewer.in/?q={search_term_string}",
                      "query-input": "required name=search_term_string"
                    }
                  },
                  {
                    "@type": "FAQPage",
                    "@id": "https://mdviewer.in/#faq",
                    "mainEntity": [
                      {
                        "@type": "Question",
                        "name": "What is MDViewer?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "MDViewer is a free online markdown viewer and editor that provides real-time preview of your markdown content. It supports GitHub Flavored Markdown (GFM) and requires no registration."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Is MDViewer free to use?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Yes, MDViewer is completely free to use. There are no hidden fees, subscriptions, or registration requirements."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Does MDViewer support GitHub Flavored Markdown?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Yes, MDViewer fully supports GitHub Flavored Markdown (GFM), including tables, task lists, strikethrough, and syntax highlighting for code blocks."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Do I need to create an account to use MDViewer?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "No, you can start using MDViewer immediately without creating an account or signing up. Your content is saved locally in your browser."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Can I use MDViewer offline?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "MDViewer requires an internet connection to load initially, but once loaded, your content is stored locally in your browser and can be accessed even if you lose connection."
                        }
                      }
                    ]
                  },
                  {
                    "@type": "BreadcrumbList",
                    "@id": "https://mdviewer.in/#breadcrumb",
                    "itemListElement": [
                      {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://mdviewer.in"
                      }
                    ]
                  }
                ]
              }),
            }}
          />
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8617635656002994"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
