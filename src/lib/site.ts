import type { Metadata } from "next";

/** Canonical origin. The apex domain redirects here, so every absolute URL must use it. */
export const SITE_URL = "https://www.mdviewer.in";
export const SITE_NAME = "MDViewer";

/** Indexable routes, used by the sitemap. Keep in sync with src/app. */
export const ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly"; lastModified: string }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", lastModified: "2026-11-01" },
  { path: "/markdown-to-html", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-11-01" },
  { path: "/markdown-tutorial", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-11-01" },
  { path: "/guides", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-11-01" },
  { path: "/guides/editor-features", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-11-01" },
  { path: "/guides/readme-best-practices", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-03-22" },
  { path: "/guides/github-flavored-markdown", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-03-22" },
  { path: "/guides/markdown-vs-rich-text", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-03-22" },
  { path: "/guides/technical-documentation", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-03-22" },
  { path: "/guides/markdown-for-bloggers", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-03-22" },
  { path: "/guides/markdown-tables-guide", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-03-22" },
  { path: "/guides/common-markdown-mistakes", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-03-22" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly", lastModified: "2026-11-01" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly", lastModified: "2026-03-22" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-10-31" },
  { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-03-22" },
];

interface PageMetadataInput {
  /** Page title without the brand; the root layout appends " | MDViewer". */
  title: string;
  description: string;
  /** Path of the page, e.g. "/guides". Used for the canonical URL and og:url. */
  path: string;
  type?: "website" | "article";
  /** Use the title as-is, without the brand suffix. */
  absoluteTitle?: boolean;
}

/**
 * Per-page metadata with a self-referencing canonical URL. Next.js replaces
 * (rather than merges) openGraph objects, so every page must set its own
 * og:url, otherwise it would inherit the home page's.
 */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "MDViewer — online Markdown viewer and editor with live preview",
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      title: fullTitle,
      description,
      // Page-level openGraph replaces the inherited file-based image, so set it here.
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
