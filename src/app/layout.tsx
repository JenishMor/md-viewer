import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Markdown Viewer - Free Online Markdown Previewer & Editor",
  description: "Free online Markdown viewer and editor. Preview your Markdown content in real-time with GitHub Flavored Markdown support. Clean, minimal, and fast.",
  keywords: ["markdown viewer", "markdown editor", "markdown preview", "online markdown editor", "gfm viewer"],
  authors: [{ name: "Antigravity" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
