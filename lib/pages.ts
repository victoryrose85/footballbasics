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
    title: `How Football Works: NFL Rules for Beginners${S}`,
    description: "Learn how football works by scrolling through one NFL drive: downs, the yellow line, penalty flags, the clock, scoring and every position.",
    updated: "2026-10-25",
    kind: "home",
  },
  {
    path: "/football-penalties-explained",
    name: "Penalties",
    title: `Football Penalties Explained: Flags and Signals${S}`,
    description: "Every common NFL penalty in plain English: what the flag means, how many yards it costs, whether the down repeats, and the official's hand signal.",
    updated: "2026-10-27",
    kind: "guide",
  },
  {
    path: "/downs-in-football",
    name: "Downs",
    title: `Downs in Football Explained, With Examples${S}`,
    description: "What a down is, why the offense gets four, how to read \"3rd & 7\", and what changes after a first down, a penalty, a punt or a failed fourth down.",
    updated: "2026-10-27",
    kind: "guide",
  },
  {
    path: "/how-scoring-works-in-football",
    name: "Scoring",
    title: `Football Scoring Explained: Every Way to Score${S}`,
    description: "Touchdown, field goal, safety, extra point and two-point try: how many points each is worth, how it happens, and the rare ways the defense scores.",
    updated: "2026-10-27",
    kind: "guide",
  },
  {
    path: "/nfl-replay-review-and-challenges",
    name: "Replay review",
    title: `NFL Replay Review and Challenge Rules Explained${S}`,
    description: "How NFL replay works: which plays are reviewed automatically, what a coach can challenge, what it costs, and the plays no one can review.",
    updated: "2026-10-27",
    kind: "guide",
  },
  {
    path: "/football-positions-explained",
    name: "Positions",
    title: `Football Positions Explained: Every NFL Role${S}`,
    description: "Every position on an NFL team, from quarterback to long snapper: what each player does, where they line up and what number they wear.",
    updated: "2026-10-27",
    kind: "guide",
  },
  {
    path: "/football-formations-explained",
    name: "Formations",
    title: `Football Formations Explained, With Diagrams${S}`,
    description: "Offensive and defensive formations in NFL football, drawn out: shotgun, I formation, goal-line sets, the 4-3 and 3-4 defenses, and nickel.",
    updated: "2026-10-27",
    kind: "guide",
  },
  {
    path: "/special-teams-explained",
    name: "Special teams",
    title: `Special Teams Explained: Kickoffs, Punts, Kicks${S}`,
    description: "What special teams are in football: how a kickoff works, when a team punts, how a field goal is kicked, and what a fair catch and touchback mean.",
    updated: "2026-10-27",
    kind: "guide",
  },
  {
    path: "/football-field-explained",
    name: "The field",
    title: `Football Field Explained: Every Line and Mark${S}`,
    description: "A guided tour of an NFL football field: the yard lines and numbers, hash marks, end zones, goalposts and the sidelines, with measurements.",
    updated: "2026-10-27",
    kind: "guide",
  },
  {
    path: "/about",
    name: "About",
    title: `About ${SITE.name}`,
    description: `Who writes ${SITE.name}, why it exists, and how to get in touch with a question or a correction.`,
    updated: "2026-10-27",
    kind: "site",
  },
  {
    path: "/privacy-policy",
    name: "Privacy policy",
    title: `Privacy Policy${S}`,
    description: `How ${SITE.name} uses cookies for Google ads and Google Analytics, your privacy choices, and your rights under US state privacy laws.`,
    updated: "2026-10-27",
    kind: "site",
  },
];

// The explainers, in registry order: the homepage lists them and the 404 page links to the first few.
export const GUIDES = PAGES.filter(p => p.kind === "guide");

// Whether a path is a page on the site yet: links to a guide that isn't built render as plain text until it is.
export function isRegistered(path: string): boolean {
  return PAGES.some(p => p.path === path);
}

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
