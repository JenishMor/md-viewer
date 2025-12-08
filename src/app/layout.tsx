import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MDViewer: Free Online Markdown Viewer and Editor",
  description: "A free online tool to view and edit Markdown files. Real-time preview, GFM support, and a clean, user-friendly interface. Perfect for developers and content creators.",
  keywords: ["markdown viewer", "markdown editor", "markdown preview", "online markdown editor", "gfm viewer", "markdown cheat sheet", "md file viewer"],
  authors: [{ name: "Antigravity" }],
  openGraph: {
    title: "MDViewer: Free Online Markdown Viewer and Editor",
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
      </body>
    </html>
  );
}
