import type { MetadataRoute } from "next";
import { BASE_URL, PAGES } from "@/lib/pages";

export const dynamic = "force-static";

// lastmod comes from the same "updated" date as each page's dateModified. Google ignores changefreq and priority.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(p => ({ url: `${BASE_URL}${p.path}`, lastModified: p.updated }));
}
