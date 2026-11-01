import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: r.lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
