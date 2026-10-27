// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { HERO, LESSONS, lessonHtml } from "@/lib/drive/lessons";
import { POSITION_TIPS } from "@/lib/drive/tips";
import { FORMATIONS, KICKOFF_AWAY, SLOTS, type Position } from "@/lib/drive/formations";
import { PLAYS, situations } from "@/lib/drive/plays";
import { SCENES } from "@/lib/drive/pose";
import { downTag, spotLabel, type Situation } from "@/lib/drive/rules";
import { getPage } from "@/lib/pages";
import { BANNED, SITE_RULES } from "../copy-rules";

// The 13 guides in spec section 2: the only places a lesson's "more" link may go
const GUIDE_SLUGS = [
  "/football-penalties-explained", "/downs-in-football", "/how-scoring-works-in-football", "/nfl-overtime-rules",
  "/nfl-replay-review-and-challenges", "/football-positions-explained", "/football-formations-explained",
  "/special-teams-explained", "/how-long-is-a-football-game", "/how-to-watch-football", "/football-field-explained",
  "/how-the-nfl-season-works", "/football-glossary",
];

const POSITIONS: Position[] = ["qb", "c", "g", "t", "te", "wr", "rb", "fb", "k", "p", "ls", "h",
  "dt", "de", "lb", "cb", "s", "kr", "pr", "cov", "blk"];

// What a reader sees: tags stripped, entities decoded, curly apostrophes made straight for the regexes
function text(html: string): string {
  const el = document.createElement("div");
  el.innerHTML = html;
  return (el.textContent ?? "").replace(/[‘’]/g, "'");
}
const words = (html: string) => text(html).split(/\s+/).filter(Boolean).length;
const tagOf = (s: Situation) => `${downTag(s)} · ${spotLabel(s.spot)}`;

describe("the lessons", () => {
  it("has one lesson per scene, 23 in all, with unique headings", () => {
    expect(SCENES.length).toBe(23);
    expect(LESSONS.length).toBe(SCENES.length);
    expect(new Set(LESSONS.map((l) => text(l.heading))).size).toBe(LESSONS.length);
  });

  it("starts every play lesson's kicker with the down and distance before its first snap", () => {
    const sits = situations();
    SCENES.forEach((scene, i) => {
      if (typeof scene === "string") return;
      const before = sits[PLAYS.findIndex((p) => p.id === scene.plays[0])].before;
      expect(text(LESSONS[i].kicker), `lesson ${i}`).toMatch(new RegExp(`^${tagOf(before).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    });
  });

  it("links only to the 13 guides", () => {
    for (const l of LESSONS) if (l.more) {
      expect(GUIDE_SLUGS, l.heading).toContain(l.more.href);
      expect(l.more.label.length, l.heading).toBeGreaterThan(0);
    }
  });

  it("keeps each lesson short: a lead of one or two sentences, then 3 to 6 beats, 30 to 88 words in all", () => {
    LESSONS.forEach((l, i) => {
      const total = lessonHtml(l).reduce((n, h) => n + words(h), 0);
      expect(total, `lesson ${i}`).toBeGreaterThanOrEqual(30);
      expect(total, `lesson ${i}`).toBeLessThanOrEqual(88);
      expect(l.beats.length, `lesson ${i}`).toBeGreaterThanOrEqual(3);
      expect(l.beats.length, `lesson ${i}`).toBeLessThanOrEqual(6);
      expect(text(l.lead).split(/(?<=[.?!])\s+/).length, `lesson ${i} lead`).toBeLessThanOrEqual(2);
      for (const b of l.beats) expect(words(b.html), `lesson ${i}: ${text(b.html)}`).toBeLessThanOrEqual(45);
    });
  });

  it("highlights only real players", () => {
    for (const l of LESSONS) for (const b of l.beats) for (const slot of b.focus ?? []) expect(SLOTS, l.heading).toContain(slot);
  });
});

describe("the position tips", () => {
  it("has a tip for every position, and for every position a formation uses", () => {
    expect(Object.keys(POSITION_TIPS).sort()).toEqual([...POSITIONS].sort());
    const used = [...Object.values(FORMATIONS), KICKOFF_AWAY].flatMap((f) => Object.values(f.slots).map((s) => s.pos));
    for (const pos of used) expect(POSITION_TIPS[pos], pos).toBeDefined();
  });

  it("keeps each tip short enough to fit the window on a small phone (45 words, ruling R4)", () => {
    for (const pos of POSITIONS) {
      expect(words(POSITION_TIPS[pos].html), pos).toBeGreaterThan(0);
      expect(words(POSITION_TIPS[pos].html), pos).toBeLessThanOrEqual(45);
    }
  });
});

describe("the copy rules", () => {
  const strings: [string, string][] = [
    ["HERO.tagline", HERO.tagline], ["HERO.answer", HERO.answer],
    ...LESSONS.flatMap((l, i): [string, string][] => [
      [`lesson ${i} kicker`, l.kicker], [`lesson ${i} heading`, l.heading],
      ...lessonHtml(l).map((h, j): [string, string] => [`lesson ${i} text ${j}`, h]),
      ...(l.more ? [[`lesson ${i} more`, l.more.label] as [string, string]] : []),
    ]),
    ...POSITIONS.flatMap((p): [string, string][] => [[`${p} title`, POSITION_TIPS[p].title], [`${p} tip`, POSITION_TIPS[p].html]]),
  ];

  it("passes every rule in every string", () => {
    for (const [where, s] of strings) {
      for (const [rule, re] of [...BANNED, ...SITE_RULES]) expect(text(s).match(re)?.[0], `${where}: ${rule}`).toBeUndefined();
    }
  });

  it("answers in 2 or 3 sentences at the top", () => {
    const sentences = text(HERO.answer).split(/(?<=[.?!])\s+/).filter(Boolean);
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(3);
  });
});

describe("the homepage's metadata", () => {
  it("no longer uses the template's title and description", () => {
    expect(getPage("/").title).not.toMatch(/Example Basics/);
    expect(getPage("/").description).not.toMatch(/Replace this/);
  });
});
