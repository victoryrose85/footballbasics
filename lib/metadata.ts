import type { Metadata } from "next";
import { BASE_URL, getPage } from "@/lib/pages";
import { SITE } from "@/site.config";

const OG_IMAGE = { url: `${BASE_URL}/og-default.png`, width: 1200, height: 630 };

// Metadata for a page in the registry (lib/pages.ts), with its title used as-is.
export function pageMetadata(path: string): Metadata {
  const { title, description, kind, updated } = getPage(path);
  const url = `${BASE_URL}${path}`;
  const type = kind === "guide" ? { type: "article" as const, modifiedTime: updated } : { type: "website" as const };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name, ...type, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
