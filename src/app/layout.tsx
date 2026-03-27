import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mdviewer.in"),
  title: {
    default:
      "MD Viewer - Free Online Markdown Editor & Live Preview | MDViewer",
    template: "%s | MDViewer",
  },
  description:
    "Free online markdown viewer and editor with real-time preview. Edit and preview markdown files instantly with GitHub Flavored Markdown (GFM) support. Perfect for developers, writers, and content creators. No signup required.",
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
    "github flavored markdown editor",
  ],
  authors: [{ name: "Jenish Mor", url: "https://mdviewer.in/about" }],
  creator: "MDViewer",
  publisher: "MDViewer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
    description:
      "Free online markdown viewer and editor with real-time preview. Edit and preview markdown files instantly with GitHub Flavored Markdown (GFM) support. No signup required.",
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
    description:
      "Free online markdown viewer and editor with real-time preview. Edit and preview markdown files instantly with GFM support.",
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
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
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
                    name: "MDViewer - Online Markdown Editor",
                    url: "https://mdviewer.in",
                    description:
                      "Free online markdown viewer and editor with real-time preview. Edit and preview markdown files instantly with GitHub Flavored Markdown (GFM) support.",
                    applicationCategory: "DeveloperApplication",
                    operatingSystem: "Any",
                    browserRequirements: "Requires JavaScript. Requires HTML5.",
                    offers: {
                      "@type": "Offer",
                      price: "0",
                      priceCurrency: "USD",
                    },
                    featureList: [
                      "Real-time markdown preview",
                      "GitHub Flavored Markdown support",
                      "Syntax highlighting",
                      "Dark mode support",
                      "No registration required",
                      "Free to use",
                    ],
                    screenshot: "https://mdviewer.in/logo.png",
                  },
                  {
                    "@type": "SoftwareApplication",
                    "@id": "https://mdviewer.in/#software",
                    name: "MDViewer",
                    applicationCategory: "WebApplication",
                    operatingSystem: "Web Browser",
                    offers: {
                      "@type": "Offer",
                      price: "0",
                      priceCurrency: "USD",
                    },
                  },
                  {
                    "@type": "Organization",
                    "@id": "https://mdviewer.in/#organization",
                    name: "MDViewer",
                    url: "https://mdviewer.in",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://mdviewer.in/logo.png",
                      width: 512,
                      height: 512,
                    },
                    sameAs: [],
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://mdviewer.in/#website",
                    url: "https://mdviewer.in",
                    name: "MDViewer",
                    description:
                      "Free online markdown viewer and editor with real-time preview",
                    publisher: {
                      "@id": "https://mdviewer.in/#organization",
                    },
                  },
                  {
                    "@type": "BreadcrumbList",
                    "@id": "https://mdviewer.in/#breadcrumb",
                    itemListElement: [
                      {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://mdviewer.in",
                      },
                    ],
                  },
                ],
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
