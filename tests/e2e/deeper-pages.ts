import { PAGES } from "../../lib/pages";

// Every page but the homepage, and each one's length target in words. A new page needs a TARGET_WORDS entry,
// or its copy test fails.
export const DEEPER: string[] = PAGES.filter(p => p.kind !== "home").map(p => p.path);

export const TARGET_WORDS: Record<string, number> = {
  "/football-penalties-explained": 2300,
  "/downs-in-football": 1300,
  "/about": 300,
  "/privacy-policy": 1100,
};

// About and the privacy policy carry breadcrumbs only, no Article.
export const NO_ARTICLE: string[] = PAGES.filter(p => p.kind === "site").map(p => p.path);
