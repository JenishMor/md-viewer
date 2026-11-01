import { Metadata } from "next";
import { pageMetadata, SITE_URL } from "@/lib/site";
import HomePage from "./home-page";
import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = pageMetadata({
  title: "Online Markdown Viewer & Editor with Live Preview | MDViewer",
  description:
    "View, edit and preview Markdown (.md) files online for free, with GitHub Flavored Markdown, Mermaid diagrams, math and HTML/PDF export. Your files stay in your browser.",
  path: "/",
  absoluteTitle: true,
});

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE_URL}/#app`,
  name: "MDViewer",
  url: SITE_URL,
  description:
    "Free online Markdown viewer and editor with live preview. Documents are stored in the browser.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript.",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Live Markdown preview",
    "GitHub Flavored Markdown",
    "Visual (WYSIWYG) editing mode",
    "Mermaid diagrams and Chart.js charts",
    "KaTeX math",
    "Import .md files; export Markdown, HTML and PDF",
    "Documents saved locally in the browser",
  ],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <HomePage>
        <HomeContent />
      </HomePage>
    </>
  );
}
