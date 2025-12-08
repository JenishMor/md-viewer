import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MD Viewer - Live Markdown Editor & Preview | MDViewer",
  description: "Experience the best online MD viewer with a live markdown editor. Our tool provides a real-time, side-by-side markdown preview. Supports GFM and is perfect for all your markdown preview needs.",
  keywords: ["md viewer", "MD viewer", "markdown live preview", "markdown preview", "live markdown preview", "markdown editor", "online markdown editor", "gfm viewer", "md file viewer"],
  authors: [{ name: "Antigravity" }],
  openGraph: {
    title: "MD Viewer - Live Markdown Editor & Preview | MDViewer",
    description: "A free online tool to view and edit Markdown files. Real-time preview, GFM support, and a clean, user-friendly interface.",
    url: "https://mdviewer.in",
    type: "website",
    images: [
      {
        url: "https://mdviewer.in/logo.png",
        width: 512,
        height: 512,
        alt: "MDViewer Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MDViewer: Free Online Markdown Viewer and Editor",
    description: "A free online tool to view and edit Markdown files. Real-time preview, GFM support, and a clean, user-friendly interface.",
    images: ["https://mdviewer.in/logo.png"],
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
                "@type": "Organization",
                "url": "https://mdviewer.in/",
                "logo": "https://mdviewer.in/logo.png"
              }),
            }}
          />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
