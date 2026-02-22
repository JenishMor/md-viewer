import { Metadata } from "next";
import HomePage from "./home-page";

export const metadata: Metadata = {
  title: "MDViewer: Free Online Markdown Viewer and Editor",
  description:
    "A free online tool to view and edit Markdown files. Real-time preview, GFM support, and a clean, user-friendly interface. Perfect for developers and content creators.",
  alternates: {
    canonical: "https://mdviewer.in",
  },
};

export default function Page() {
  return <HomePage />;
}
