import { SITE } from "@/site.config";

// Every page on the site, with the title, description and "updated" date that the metadata, the sitemap's
// lastmod and the Article's dateModified all read from. When a page changes, update its date here.
export const BASE_URL = SITE.url;

export interface PageInfo {
  path: string;
  name: string; // short name: breadcrumbs, related chips and the homepage's guide list
  title: string; // the full <title>, at most 65 characters, ending in SITE.titleSuffix unless it names the site
  description: string; // 50 to 160 characters
  updated: string; // YYYY-MM-DD
  kind: "home" | "guide" | "site"; // a guide is an Article; site pages (About, Privacy) get breadcrumbs only
}

const S = SITE.titleSuffix;

export const PAGES: PageInfo[] = [
  {
    path: "/",
    name: "Home",
    title: `Example Basics: Plain-English Answers${S}`,
    description: "Short, plain-English guides that each answer one question. Replace this with the homepage's description.",
    updated: "2026-10-24",
    kind: "home",
  },
  {
    path: "/example-guide",
    name: "Writing a guide",
    title: `How to Write a Guide Page on This Site${S}`,
    description: "The sample guide: how a deeper page is put together, from the registry entry to the sections, blocks and related links.",
    updated: "2026-10-24",
    kind: "guide",
  },
  {
    path: "/another-example",
    name: "Diagrams and tables",
    title: `Adding a Diagram or a Table to a Guide${S}`,
    description: "The second sample guide: the figure and table styles the template ships with, and how to keep them readable on a phone.",
    updated: "2026-10-24",
    kind: "guide",
  },
  {
    path: "/about",
    name: "About",
    title: `About ${SITE.name}`,
    description: `Who writes ${SITE.name}, why it exists, and how to get in touch with a question or a correction.`,
    updated: "2026-10-24",
    kind: "site",
  },
  {
    path: "/privacy-policy",
    name: "Privacy policy",
    title: `Privacy Policy${S}`,
    description: `How ${SITE.name} uses cookies for Google ads and Google Analytics, your privacy choices, and your rights under US state privacy laws.`,
    updated: "2026-10-24",
    kind: "site",
  },
];

// The explainers, in registry order: the homepage lists them and the 404 page links to the first few.
export const GUIDES = PAGES.filter(p => p.kind === "guide");

export function getPage(path: string): PageInfo {
  const page = PAGES.find(p => p.path === path);
  if (!page) throw new Error(`No page registered for ${path}`);
  return page;
}

// The page's H1 and Article headline: its title without the brand suffix.
export function pageHeadline(path: string): string {
  const { title } = getPage(path);
  return title.endsWith(S) ? title.slice(0, -S.length) : title;
}

// "2026-10-24" → "October 24, 2026". Read as UTC, so no time zone can move the day.
export function formatUpdated(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
