# FootballBasics, Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn this `_basics` copy into FootballBasics.us, build the homepage drive (a pinned field window with 23 scroll-driven lessons), and write the outline for each of the 13 guides. Phase 2 writes the guides and launches.

**Architecture:**
- The homepage is a server component. All 23 lessons, every position tip and the guide list are in the HTML at build time.
- The drive is **pure data plus pure functions** in `lib/drive/*`: the down-and-distance rules, the 18 plays, the formations, and `poseAt(lesson, t)`, which returns where every player, the ball, the lines and the tag are at a point in a lesson.
- A thin client component, `DriveEngine`, measures the lesson cards, turns the scroll position into `(lesson, t)`, and writes the pose to the DOM. There is no clock and no frame loop: the pose is a function of the scroll position alone, so scrolling up rewinds, and a reload or Back lands on the same frame.

**Tech Stack:** Next.js 14 App Router, static export, TypeScript, plain CSS (`app/site.css`, plus a new `app/drive.css`), `next/font/google`, Vitest, Playwright against `wrangler dev`, Cloudflare Workers static assets. No animation library: tips use CSS transitions *(my call; the spec leaves Motion versus plain code to the builder)*.

**Spec:** `docs/superpowers/specs/2026-10-24-footballbasics-design.md`. The executor reads both documents. SoccerBasics (`D:\Projects\websites-for-ads\soccerbasics`) is the prior art for the engine's shape: `components/field/FieldEngine.tsx`, `lib/field/tips.ts`, `lib/field/checks.ts`, `scripts/perf.mjs`.

## Global Constraints

- **Branch:** the first commit (the template copy and the spec) goes on `main`, and all of phase 1 goes on a `build` branch. Nothing is deployed in phase 1. The homepage and all 13 guides go live in one deploy after phase 2 (spec §8). Never run `npm run deploy`.
- **Static export:** no `export const revalidate`, no middleware, no `cookies()`/`headers()`. Route handlers only as static routes.
- **No www redirect** in `next.config.mjs` (CLAUDE.md, CRITICAL).
- **Site values:**
  - URL `https://footballbasics.us`, name `FootballBasics.us`, title suffix ` | FootballBasics`, wordmark `["Football", "Basics"]`
  - GA `G-44MDNZHRJX` (shared with SoccerBasics)
  - AdSense IDs unchanged from the template (the shared units)
  - Contact `retailvalue@gmail.com`
  - Disclaimer `Not affiliated with the NFL or any of its teams.`
- **Fonts:** Oswald at 600–700 (`--font-display`) and Source Sans 3 at 500–700 (`--font-body`). Nothing on the site asks for weight 800.
- **Copy (spec §7):**
  - warm and adult, no AI-isms, no em dashes
  - never explain football through soccer or any other sport
  - never mention being invited to a game, friends taking you, or "heading to a game?"
  - define a term before using it, and put the answer first
  - "the officials" for the crew, "the referee" for the crew chief
- **Rules:** every rule claim matches `docs/superpowers/specs/2026-10-24-nfl-rules-check.md` (Task 2). Nothing is written from memory.
- **Not official-looking:** no NFL or team logos, team names or uniforms. The two sides are "the offense" and "the defense".
- **SEO:** one H1 (wordmark plus tagline). Each lesson is an H2. Tips are not headings. Internal links are plain `<a href>`.
- **Ads:** none inside, over or between the field window and its lessons. The in-page unit goes below the guide list. No ads on the 404 page.
- **Coordinates:** field positions are in **yards**. `x` runs 0–53.3 across the field (left sideline to right). `y` runs 0–120 down the page: the offense's own end line is 0, its goal line 10, the opponent's goal line 110. A **spot** is a ball position measured from the offense's own goal line (0–100), so `y = spot + 10`.
- **Breakpoints:** the template's (≤1320px: no left rail; ≤1000px: one column, no rails). The drive switches between phone layout (window on top) and desktop layout (window beside the lessons) at 1000px.
- **Template fixes:** anything every site shares (here, the font weights in `make-images.mts`) also goes into `D:\Projects\websites-for-ads\_basics`, keeping its own fonts and weights.
- **Commits:** end every message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Web fonts arriving late** change the lesson cards' heights, so the scroll-to-lesson mapping has to be re-measured, or the field shows the wrong play for the text in view. → Task 7, `late fonts re-measure`.
2. **A phone rotated, or a desktop window resized across 1000px,** in the middle of a play: no errors, and the pose matches the new scroll position. → Task 7, `resize mid-play`.
3. **JavaScript blocked or failing:** the lessons, guide links and footer are readable, and no unplaced dots pile up in the window's corner. → Task 6, `readable without JavaScript`.
4. **Keyboard users:** Tab reaches only the players that are visible in the window, Enter opens a tip, and Escape closes it without moving focus. → Task 8, `keyboard opens and closes tips`.
5. **A landscape phone (915×412):** the window must not swallow the screen, so a lesson stays readable beside or below it. → Task 7, `landscape phone stays readable`.

---

### Task 1: Make it FootballBasics (SETUP.md step 2) and start the repo

**Files:**
- Modify: `site.config.ts`, `app/fonts.ts`, `app/site.css` (each `font:800` becomes `font:700`), `wrangler.jsonc`, `package.json`, `scripts/make-images.mts`, `CLAUDE.md`, `tests/e2e/copy-rules.spec.ts`
- Modify in `_basics` as well: `scripts/make-images.mts` and `site.config.ts` (the font weights, below)
- Generate: `public/logo.png`, `app/icon.png`, `public/og-default.png`

**Interfaces:**
- Produces:

```ts
// site.config.ts (changed and added keys only)
name: "FootballBasics.us", url: "https://footballbasics.us", titleSuffix: " | FootballBasics",
mark: ["Football", "Basics"], tagline: "How American football works, one play at a time.", // Task 5 may revise
disclaimer: "Not affiliated with the NFL or any of its teams.", gaId: "G-44MDNZHRJX",
fonts: { display: "Oswald", displayWeight: 700, body: "Source Sans 3", bodyWeight: 700 },
// _basics: { display: "Baloo 2", displayWeight: 800, body: "Nunito", bodyWeight: 800 }
colors: {
  ink: "#14301a", page: "#14301a", accent: "#ffd23f", "stripe-a": "#3f9a3a", "stripe-b": "#378f33",
  text: "#28352a", updated: "#fff6c8", "foot-border": "#0f2414", "foot-text": "#d9e8d2", "foot-muted": "#a8c4a0",
  tint: "#eef6ea", muted: "#55624f",
  // the drive (Task 6 reads these as --los, --first-down, ...)
  los: "#2f7bff", "first-down": "#ffe234", offense: "#ff7a45", defense: "#8fd0ff", ball: "#7a3e12", flag: "#ffd23f",
}
```

- `app/fonts.ts`: `Oswald({ weight: ["600","700"], variable: "--font-display" })` and `Source_Sans_3({ weight: ["500","600","700"], variable: "--font-body" })`, both with `subsets: ["latin"]` and `display: "swap"`.
- `make-images.mts` requests `wght@${displayWeight}` and `wght@${bodyWeight}`, and uses those weights in its CSS in place of the hard-coded 800.
- `wrangler.jsonc`: `"name": "footballbasics"`, routes `[{ "pattern": "footballbasics.us", "custom_domain": true }]`. `package.json` `"name": "footballbasics"`.
- `copy-rules.spec.ts` `SITE_RULES`:
  - `["no other sports", /\b(soccer|rugby|basketball|baseball|hockey)\b/i]`
  - `["no invited-by-friends framing", /\b(invited|your friends|heading to (a|the) game)\b/i]`

- [ ] **Step 1:** Run `gh repo view victoryrose85/soccerbasics --json visibility` and note the result. Then `git init -b main`, `git add -A`, `git commit` ("Start FootballBasics from _basics, with the approved design"), `gh repo create victoryrose85/footballbasics --<same visibility> --source . --push`, `git checkout -b build`.
- [ ] **Step 2:** Run `npm test`. Expected: PASS (this is the baseline before any change).
- [ ] **Step 3:** Make the changes above. Rewrite CLAUDE.md's **Purpose** (an evergreen explainer of NFL football for newcomers; the homepage is one drive, play by play; college comes later under `/college/`; ad revenue is the point) and **Copy rules** (Global Constraints, Copy). Keep the www section word for word.
- [ ] **Step 4:** Run `npm run images`, then open the three images. Expected: an "FB" logo and a social card in Oswald on the green stripes, with no fallback font. Do the same `_basics` change, then run `npm test` in `_basics`.
- [ ] **Step 5:** Run `npm test && npx tsc --noEmit && npm run lint && npm run check`. Expected: tests, types and lint pass. `check` fails **only** on the homepage copy and the two sample guides; Tasks 5 and 6 and phase 2 clear those.
- [ ] **Step 6: Commit:** "FootballBasics config, fonts, colors, images and copy rules" (and a separate commit in `_basics`, if it is a repo).

### Task 2: NFL rules check (research, no code)

**Files:**
- Create: `docs/superpowers/specs/2026-10-24-nfl-rules-check.md`

Every rule the homepage states, checked against the current NFL rulebook and NFL Football Operations (operations.nfl.com) for the 2026 season. Use WebSearch and WebFetch, and prefer the rulebook PDF and the "rule changes" pages over news articles.

- [ ] **Step 1:** Write one row per claim: the claim, the current rule (with its number), the source URL, and "matches the spec" or "differs". At minimum:
  - the touchback spot on a kickoff, and the 2024–26 kickoff alignment (where the kicking and receiving teams line up)
  - where the extra-point kick and the two-point try are snapped from
  - penalties: false start (5), delay of game (5), defensive offside (5), offensive holding (10, and where it's enforced from on a run), defensive pass interference (spot foul, automatic first down), roughing the passer (15, automatic first down)
  - the clock: incomplete pass; runner out of bounds (including when it restarts outside the last 2:00 of the first half and the last 5:00 of the second half); the play clock (40 and 25 seconds); 15-minute quarters
  - what counts as a catch; which plays are reviewed automatically; coaches' challenges
  - at least 7 offensive players on the line of scrimmage, and eligible receivers
  - "1st & goal" when the line to gain is at or beyond the goal line
  - every way to score, with its points
  - overtime, regular season and playoffs (for the guides)
- [ ] **Step 2:** If a row differs from the spec's drive table (spec §3), propose the smallest change that keeps the lessons and their order. Record it in this document and in the spec's table, marked *(changed by the rules check)*.
- [ ] **Step 3: Commit:** "NFL rules check for the homepage drive"

### Task 3: Down-and-distance rules and the 18 plays

**Files:**
- Create: `lib/drive/rules.ts`, `lib/drive/plays.ts`, `tests/unit/drive-rules.test.ts`

**Interfaces:**
- Produces:

```ts
// lib/drive/rules.ts
export type Down = 1 | 2 | 3 | 4;
export interface Situation { down: Down; spot: number; lineToGain: number } // lineToGain >= 100 means "& goal"
export type PenaltyName = "false-start" | "delay-of-game" | "defensive-offside" | "offensive-holding"
  | "defensive-pass-interference" | "roughing-the-passer";
export type Result =
  | { kind: "gain"; yards: number; outOfBounds?: boolean; pass?: boolean }  // a run, a catch, a sack (negative)
  | { kind: "incomplete" }
  | { kind: "penalty"; name: PenaltyName; on: "offense" | "defense"; yards: number;
      from: "previous" | "spot"; spot?: number; firstDown?: boolean;
      wiped?: Result }  // the live-ball play the flag cancels or that happened anyway (shown, then undone)
export const START: Situation;                                   // 1st & 10 at the touchback spot from Task 2 (draft: spot 35)
export function advance(s: Situation, r: Result): Situation | "touchdown";
export function downTag(s: Situation): string;                   // "2nd & 6", "1st & goal"
export function spotLabel(spot: number): string;                 // 39 → "own 39", 50 → "50", 55 → "opp 45"
// lib/drive/plays.ts
export type PlayId = "p5" | "p6" | "p7" | "p8" | "p9" | "p10" | "p11" | "p12" | "p13" | "p14" | "p15" | "p16"
  | "p17a" | "p17b" | "p18" | "p19" | "p20" | "p21";
export interface Play { id: PlayId; result: Result } // Task 4 adds formation and motion
export const PLAYS: Play[];                                      // in drive order
export function situations(): { before: Situation; after: Situation | "touchdown" }[]; // folds advance() over PLAYS from START
```

- `advance` rules:
  - a gain moves the spot. Reaching the line to gain is a first down (1st & 10, or "& goal" when spot + 10 ≥ 100). Otherwise the down goes up by one.
  - an incomplete pass uses up a down and leaves the spot where it was.
  - a penalty with `from: "previous"` moves the spot by `yards` (backward for the offense's fouls) and replays the down, unless `firstDown` is set. With `from: "spot"`, the ball goes to `spot`, and it's 1st & 10 when `firstDown` is set.
  - the touchdown is any gain that reaches spot 100.
  - throw if a penalty would put the ball inside the 1 or behind the goal line (half-the-distance is not needed on this drive, so don't implement it).

- [ ] **Step 1: Write the failing test.** `situations()` gives exactly the spec §3 table, using values from the rules check:

```ts
const TABLE = [
  ["1st & 10", "own 35", "2nd & 6", "own 39"], ["2nd & 6", "own 39", "3rd & 6", "own 39"],
  ["3rd & 6", "own 39", "3rd & 11", "own 34"], ["3rd & 11", "own 34", "1st & 10", "opp 48"],
  ["1st & 10", "opp 48", "1st & 20", "own 42"], ["1st & 20", "own 42", "2nd & 12", "50"],
  ["2nd & 12", "50", "2nd & 7", "opp 45"], ["2nd & 7", "opp 45", "1st & 10", "opp 36"],
  ["1st & 10", "opp 36", "2nd & 17", "opp 43"], ["2nd & 17", "opp 43", "1st & 10", "opp 28"],
  ["1st & 10", "opp 28", "2nd & 5", "opp 23"], ["2nd & 5", "opp 23", "2nd & 10", "opp 28"],
  ["2nd & 10", "opp 28", "3rd & 4", "opp 22"], ["3rd & 4", "opp 22", "4th & 1", "opp 19"],
  ["4th & 1", "opp 19", "1st & 10", "opp 17"], ["1st & 10", "opp 17", "1st & goal", "opp 6"],
  ["1st & goal", "opp 6", "2nd & goal", "opp 3"], ["2nd & goal", "opp 3", "touchdown", ""],
];
```

  Also test:
  - each row's after equals the next row's before
  - `spotLabel(50) === "50"`, `spotLabel(1) === "own 1"`, `spotLabel(99) === "opp 1"`
  - `downTag({ down: 1, spot: 94, lineToGain: 104 }) === "1st & goal"`
  - `advance` throws for a 5-yard offensive penalty at spot 3
  - `advance` throws `"turnover on downs"` when a 4th-down play falls short of the line (the drive never has one)
- [ ] **Step 2:** Run `npm test -- drive-rules`. Expected: FAIL, the modules are missing.
- [ ] **Step 3:** Implement. `PLAYS` holds each play's `result` from the spec table.
- [ ] **Step 4:** Run `npm test -- drive-rules`. Expected: PASS.
- [ ] **Step 5: Commit:** "Down-and-distance rules and the 18 plays of the drive"

### Task 4: Formations, player motion and the pose

**Files:**
- Create: `lib/drive/formations.ts`, `lib/drive/motion.ts`, `lib/drive/pose.ts`, `tests/unit/drive-pose.test.ts`
- Modify: `lib/drive/plays.ts` (`Play` gains `formation: FormationId` and `motion: MotionId`)

**Lesson numbers:** code and tests use 0-based indices, so the spec's lesson N is index N − 1. Lesson 5 (the first run) is index 4, and lesson 23 is index 22.

**Interfaces:**
- Consumes: `Situation`, `PLAYS`, `situations()`
- Produces:

```ts
// lib/drive/formations.ts
export type SlotId = `o${0|1|2|3|4|5|6|7|8|9|10}` | `d${0|1|2|3|4|5|6|7|8|9|10}`;
export type Position = "qb" | "c" | "g" | "t" | "te" | "wr" | "rb" | "fb" | "k" | "p" | "ls" | "h"
  | "dt" | "de" | "lb" | "cb" | "s" | "kr" | "pr" | "cov";   // cov: a kickoff or punt coverage player
export type FormationId = "shotgun" | "singleback" | "i-form" | "heavy" | "goal-line" | "kickoff" | "field-goal";
export interface Formation { id: FormationId; slots: Record<SlotId, { pos: Position; at: [number, number] }> } // at: [dx, dy] in yards from the ball; +dy is toward the offense's own end line
export const FORMATIONS: Record<FormationId, Formation>;
// lib/drive/motion.ts
export interface Key { t: number; at: [number, number] }                          // t in 0..1 of the play phase; at as above
export interface Motion { id: MotionId; moves: Partial<Record<SlotId, Key[]>>;
  ball: { t: number; at: [number, number]; h?: number; carrier?: SlotId }[];      // h: height in yards, for a pass in the air
  labels: SlotId[] }                                                              // at most 2
export type MotionId = string;
export const MOTIONS: Record<MotionId, Motion>;
// lib/drive/pose.ts
export type Scene = "field" | "kickoff" | "lineup" | "downs" | { plays: PlayId[] } | "try" | "kickoff-after";
export interface Pose {
  players: Record<SlotId, { x: number; y: number; pos: Position; opacity: number }>;  // field yards
  ball: { x: number; y: number; h: number };
  los: number; firstDown: number | null; flag: { x: number; y: number } | null;       // y in field yards; null: no yellow line ("& goal")
  tag: string;                                                                        // "2nd & 6 · own 39"
  camera: { x: number; y: number };                                                   // the field point at the window's center
  labels: SlotId[];
}
export const PHASES = { set: [0, .2], play: [.2, .75], whistle: [.75, .85], placed: [.85, 1] } as const;
export const SCENES: Scene[];                              // 23, one per lesson, in spec §3 order; Task 5's LESSONS lines up with it
export function poseAt(lesson: number, t: number): Pose;   // lesson 0..22, t clamped to 0..1; pure and deterministic
```

- **Phases** inside one play (spec §3, "Scroll behavior"): `set` shows the formation and the before tag. In `play`, everyone moves along their keys (linear between keys, eased by the scroll). `whistle` shows the flag if there is one. In `placed`, the ball sits at the new spot, and the lines and the tag show the after values. For lesson 17, which has two plays, each play gets half of the lesson's `t`.
- **Between plays:** players fade out (`opacity` → 0) during `placed`, and the next formation fades in during the next lesson's `set`. The ball and the lines never jump: at `t = 1` of lesson i, they're where they are at `t = 0` of lesson i+1.
- **Camera:** follows the ball, clamped so the window never shows past a sideline. The window is about 24 yards wide.
- **Scenes:**
  - `field` pans from one end zone to the other.
  - `kickoff` runs the kick and the touchback, using Task 2's alignment.
  - `lineup` and `downs` hold the first play's formation at `START`.
  - `try` uses the field-goal formation at the try spot from Task 2.
  - `kickoff-after` kicks to the other team and fades everyone out.
- The builder picks the formations and paths (spec §3 "Formations": shotgun on 3rd & 11, heavy on 4th & 1 and at the goal line, kick units for kicks). Two named players per play at most, the ones the lesson is about.

- [ ] **Step 1: Write the failing tests** `tests/unit/drive-pose.test.ts`:
  - every non-kick formation has 11 offense slots and 11 defense slots, exactly one `qb` and one `c`, at least 7 offense players with `dy` within 1 yard of the line, every offense `dy >= 0`, and every defense `dy < 0`
  - in every formation, no two players start closer than 1.2 yards
  - every motion has at most 2 labels, and its keys have increasing `t` within 0..1
  - `poseAt(i, t)` called twice with the same arguments returns deep-equal results
  - for every lesson i < 22: `poseAt(i, 1).ball` equals `poseAt(i + 1, 0).ball` (to 0.01), and the same for `los` and `firstDown`
  - for each play lesson, the tag at `t = .1` starts with that row's before tag (Task 3 table), and at `t = .95` with its after tag
  - `poseAt(19, .1).firstDown === null` (lesson 20, 1st & goal)
  - `poseAt(15, .8).flag` is not null (lesson 16, delay of game), and `poseAt(5, .8).flag === null` (lesson 6, the incomplete pass)
  - `poseAt(20, 1).ball.y >= 110` (lesson 21, the touchdown)
  - the camera's x stays within the sideline clamp for every lesson at `t` in steps of 0.05
- [ ] **Step 2:** Run `npm test -- drive-pose`. Expected: FAIL.
- [ ] **Step 3:** Implement the formations, the motions and `poseAt`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS, with `drive-rules` still passing.
- [ ] **Step 5: Commit:** "Formations, player motion and the drive's pose function"

### Task 5: Homepage copy: keyword brief, 23 lessons, position tips

**Files:**
- Create: `docs/superpowers/specs/2026-10-24-homepage-copy-brief.md`, `lib/drive/lessons.ts`, `lib/drive/tips.ts`, `tests/unit/drive-copy.test.ts`
- Modify: `lib/pages.ts` (the homepage's title and description), `site.config.ts` (`tagline`, if the brief improves it)

Use the marketing skills (the user's instruction): `marketing-skills:content-strategy` for the keyword research, `marketing-skills:copywriting` for the lessons, then `marketing-skills:copy-editing` on the result.

**Interfaces:**
- Consumes: `Scene`, `PlayId`, the rules check
- Produces:

```ts
// lib/drive/lessons.ts
export interface Lesson { kicker: string; heading: string; html: string; more?: { label: string; href: string } }
export const LESSONS: Lesson[];  // 23, lined up with SCENES; play lessons' kicker = the before tag ("3rd & 11 · own 34")
export const HERO: { tagline: string; answer: string };  // the H1 tagline; the 2–3 sentence answer to "how does football work?"
// lib/drive/tips.ts
export const POSITION_TIPS: Record<Position, { title: string; side: "offense" | "defense" | "kicking"; html: string }>;
```

- [ ] **Step 1:** Write the brief:
  - the main query for the homepage and 5–10 related newcomer queries, checked against Google's autocomplete and "People also ask"
  - the title (≤ 65 characters, ending in ` | FootballBasics`), the description (50–160) and the H1 tagline
  - which lesson answers which query
- [ ] **Step 2: Write the failing test** `tests/unit/drive-copy.test.ts`:
  - `LESSONS.length === SCENES.length === 23`, and the headings are unique
  - every play lesson's kicker starts with its before tag from `situations()`
  - every `more.href` is one of the 13 guide slugs in spec §2 (list them in the test)
  - every `Position` has a tip
  - no lesson, tip or `HERO` string matches the copy rules: an em dash, the template's AI-isms, the two `SITE_RULES` regexes (import them from one shared place: move `BANNED` and `SITE_RULES` into `tests/copy-rules.ts`, which both test files import)
  - `getPage("/").title` is no longer the template's
- [ ] **Step 3:** Run `npm test -- drive-copy`. Expected: FAIL.
- [ ] **Step 4:** Write the copy. Each lesson's `html` is 60–140 words, teaches what its play shows on the field, and names only what's visible in the window. Entities are written as in the template (`&rsquo;`, `&ldquo;`). Rule facts come from Task 2.
- [ ] **Step 5:** Run `npm test`. Expected: PASS.
- [ ] **Step 6: Commit:** "Homepage copy: keyword brief, 23 lessons and position tips"

### Task 6: The homepage's server-rendered markup and styles

**Files:**
- Create: `components/drive/Drive.tsx`, `components/drive/DriveEngine.tsx` (stub for now: renders `section.drive` around its children and does nothing else), `app/drive.css`
- Replace: `app/page.tsx`
- Modify: `tests/e2e/home-seo.spec.ts`, `app/layout.tsx` (import `./drive.css`)

**Interfaces:**
- Consumes: `LESSONS`, `HERO`, `POSITION_TIPS`, `FORMATIONS`, `poseAt`, `GUIDES`, `PageFrame`, `AdUnit`, `JsonLd`, `homeJsonLd`, `pageMetadata`
- **DOM contract** (the engine and the tests rely on these names):

```
article.sheet-body.home
  h1 > span.wordmark + span.tag            (HERO.tagline)
  div.lede > p                             (HERO.answer)
  section.drive                            (DriveEngine's root; gets .ready once placed)
    div.window                             (sticky)
      div.field                            (all 120 yards; the engine translates it by the camera)
        div.yardlines, span.num × 18       (CSS and server markup, never measured)
        div.los, div.fd, div.flag[hidden], div.ball
        div.players > button.pl[data-slot=o0..d10][aria-expanded=false][aria-controls=tip-<pos>] > span.dot + span.nm
      div.dtag                             (the down-and-distance tag)
      div.tips > div.info#tip-<pos>[hidden] > div.ih > b + i.<side>, then span
    div.lessons > article.lesson[data-lesson=0..22] > div.k + h2 + p + a.more?
  section.guides > Section "The guides" > Block per guide   (the template's list, kept)
AdUnit inPage                              (after the article, as in the template)
```

- The server renders `poseAt(0, 0)`: each dot's position, `aria-controls` and `.nm` text, so the first frame is right before any JavaScript runs.
- `a.more` is rendered only when `PAGES` has that path, so the links switch on as phase 2 adds the guides.
- `drive.css`:
  - Phone (≤1000px): `.window` is `position: sticky; top: 0`, full sheet width (bleeding to the sheet's edges), with a height of `min(42vh, 300px)` *(my call)*.
  - Desktop: `.drive` is a two-column grid. `.window` is sticky at `top: 16px`, about 45% of the sheet, `height: calc(100vh - 32px)` capped at 640px, and the lessons sit in the other column.
  - `.sheet`'s `overflow: clip` stays as it is (sticky breaks under `overflow: hidden`).
  - Dots are 12px, ink-outlined, in `--offense` and `--defense`. The line of scrimmage is `--los` (3px) and the first-down line `--first-down` (4px).
  - `.drive:not(.ready) :is(.players, .ball, .flag) { visibility: hidden }` and `.info[hidden] { display: none }`.
  - Lesson cards use the template's `.block` look (white, ink border, hard shadow, kicker pill) with SoccerBasics' slight tilt.

- [ ] **Step 1: Write the failing test.** Rewrite `home-seo.spec.ts`; keep its title, canonical and JSON-LD test, and its rails and in-page ad test.
  - From the raw HTML (`request.get("/")`): every lesson heading, every lesson's text (decode entities through jsdom, as SoccerBasics' test does), every position tip's text, and `href` for every guide in `GUIDES`.
  - With a page: one `h1`, containing "FootballBasics" and `HERO.tagline`. 23 `h2` inside `.lessons`. The title equals `getPage("/").title`.
  - The homepage text passes `BANNED` and `SITE_RULES`.
  - No `ins.adsbygoogle` inside `section.drive`.
  - **`readable without JavaScript`** (Review Focus 3): in a context with `javaScriptEnabled: false` at 412×915, all 23 `.lesson h2` and all guide links are visible, every `.info` is hidden, and every `button.pl` is hidden.
- [ ] **Step 2:** Run `npm run test:e2e -- home-seo`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `npm run test:e2e -- home-seo && npx tsc --noEmit && npm run lint`. Expected: PASS. `npm run check` no longer reports the homepage copy.
- [ ] **Step 5: Commit:** "Server-rendered drive homepage"

### Task 7: The drive engine: scroll to pose

**Files:**
- Create: `lib/drive/scroll.ts`, `lib/drive/apply.ts`, `lib/drive/checks.ts`, `tests/unit/drive-scroll.test.ts`, `tests/e2e/drive.spec.ts`
- Modify: `components/drive/DriveEngine.tsx`

**Interfaces:**
- Consumes: `poseAt`, `Pose`, the DOM contract
- Produces:

```ts
// lib/drive/scroll.ts (pure)
export function refLine(vh: number, windowH: number, desktop: boolean): number; // phone: windowH + .4 * (vh - windowH); desktop: .5 * vh
export function progress(y: number, tops: number[], lastBottom: number): { lesson: number; t: number };
//   y = scrollY + refLine. Lesson i spans tops[i] .. tops[i+1] (the last: tops[22] .. lastBottom).
//   Above tops[0] → { lesson: 0, t: 0 }; below lastBottom → { lesson: 22, t: 1 }.
// lib/drive/apply.ts
export function applyPose(root: HTMLElement, pose: Pose, scale: number): void;  // scale: px per yard = window width / 24
// lib/drive/checks.ts
export interface DriveDebug { state(): { lesson: number; t: number; tag: string; ball: [number, number]; los: number; firstDown: number | null };
  labels(): number; checkOverlap(): string[]; checkEdges(): string[]; running(): boolean }
export function installChecks(root: HTMLElement, debug: DriveDebug): void;  // sets window.__drive only when location.hash === "#check"
```

- `DriveEngine`, in `useEffect`:
  1. measure the lesson tops (document coordinates) and the window's size
  2. on each `scroll`, schedule at most one `requestAnimationFrame`, which computes `progress`, then `poseAt`, then `applyPose`. Skip the work while `section.drive` is off screen (an `IntersectionObserver`); `running()` reports whether it's on screen.
  3. add `.ready`
  4. a `ResizeObserver` on `.lessons` and `.window`, plus `document.fonts` `loadingdone`, re-measure and re-apply
  5. on unmount: disconnect everything
- `applyPose` writes only `transform` and `opacity` (no layout reads). It sets `tabIndex = -1` and `aria-hidden` on players that are faded out or outside the window, and updates each button's `aria-controls` to its current position's tip.
- `checkOverlap`: no visible `.nm` overlaps another `.nm` or a dot it doesn't belong to. `checkEdges`: no `.nm` or `.dtag` sticks out of `.window`.

- [ ] **Step 1: Write the failing unit test** `drive-scroll.test.ts`:
  - `progress(50, [100, 300, 600], 900)` → `{ lesson: 0, t: 0 }`
  - `progress(200, [100, 300, 600], 900)` → `{ lesson: 0, t: .5 }`
  - `progress(600, [100, 300, 600], 900)` → `{ lesson: 2, t: 0 }`
  - `progress(1000, [100, 300, 600], 900)` → `{ lesson: 2, t: 1 }`
  - `refLine(640, 269, false) === 269 + .4 * 371`
- [ ] **Step 2: Write the failing e2e test** `tests/e2e/drive.spec.ts`. All tests run on `/#check` and wait for `window.__drive`. A helper scrolls so that lesson N's `t` is about 0.5: its top + half its stretch − `refLine`, computed in the page.
  - **The tag follows the drive:** at 412×915, for indices 4, 7, 11 and 19 (lessons 5, 8, 12 and 20), `t` ≈ 0.1 shows the before tag, and `t` ≥ 0.9 shows the after tag (Task 3 table).
  - **Scroll is the only clock:** scroll to the middle of index 8 and record `state()`. Then (a) `page.reload()` and compare (Chromium restores the scroll); (b) jump to the bottom and come back to the same `scrollY`; (c) jump to the top and come back. All three are deep-equal to the first (ball to 0.01 yards).
  - **Layout checks:** at 360×640, 412×915, 768×1024 and 1300×900, step through the lessons from top to bottom. At each one, `checkOverlap()` and `checkEdges()` are `[]` and `labels() <= 2`, and `document.documentElement.scrollWidth <= innerWidth`.
  - **Readable on a small phone:** at 360×640, with each lesson in the middle, at least 340px of that lesson's card is visible below the window.
  - **`landscape phone stays readable`** (Review Focus 5): at 915×412, the window is at most 45% of the viewport height, and the lesson in the middle has at least 200px visible.
  - **Off screen:** at 1300×900, scroll to the guide list below the drive. Within 1s, `running() === false`.
  - **`late fonts re-measure`** (Review Focus 1): `page.route("**/*.woff2", r => setTimeout(() => r.continue(), 1500))`. After `document.fonts.ready`, scroll to `t` ≈ 0.1 of index 11. `state().lesson === 11`, and the tag is lesson 12's before tag.
  - **`resize mid-play`** (Review Focus 2): at 412×915, start a smooth scroll into index 7. 100ms later, `setViewportSize({ width: 1300, height: 900 })`. No `pageerror` fires. After two animation frames, `state()` equals what `progress` gives for the current `scrollY` (read it in the page), and the layout checks are clean.
- [ ] **Step 3:** Run `npm test -- drive-scroll && npm run test:e2e -- drive`. Expected: FAIL.
- [ ] **Step 4:** Implement.
- [ ] **Step 5:** Run `npm test && npm run test:e2e -- drive home-seo`. Expected: PASS.
- [ ] **Step 6: Commit:** "Drive engine: the scroll position drives every play"

### Task 8: Position tips

**Files:**
- Create: `lib/drive/tips-ui.ts`, `tests/e2e/drive-tips.spec.ts`
- Modify: `components/drive/DriveEngine.tsx`, `app/drive.css`

**Interfaces:**
- Consumes: the DOM contract
- Produces: `export function bindTips(root: HTMLElement): () => void` (returns an unbind function)

Behavior: the same as SoccerBasics' `lib/field/tips.ts` (one open at a time, hover opens with a mouse, click toggles, a tap elsewhere closes, Escape closes and keeps focus), with two differences:
- The tip opens as a panel along the bottom of `.window`, 8px from each edge, so there's no positioning math *(my call; the spec leaves where tips open to the builder)*.
- It fades with a CSS transition (opacity and `translateY(6px)`, 0.2s) instead of Motion.
- Scrolling to another lesson closes the open tip.

- [ ] **Step 1: Write the failing test** `tests/e2e/drive-tips.spec.ts`, at 412×915 on `/#check`, scrolled to `t` ≈ 0.1 of index 4 (lesson 5, lined up before the snap):
  - tap the quarterback's dot (the button whose `aria-controls` is `tip-qb`): `#tip-qb` is visible, fully inside `.window`, and its text matches `POSITION_TIPS.qb`
  - tap a lesson paragraph: `#tip-qb` is hidden
  - tap a defensive dot: its tip is visible, and only one `.info` is visible
  - scroll on to index 5: no `.info` is visible
  - at 1300×900 with a mouse: hover a dot and its tip shows; move away and it's hidden
  - **`keyboard opens and closes tips`** (Review Focus 4): press Tab from the H1 until a `button.pl` has focus. The button is inside `.window`'s rect and not faded out. Enter shows its tip and sets `aria-expanded="true"`. Escape hides the tip, and `document.activeElement` is still that button.
- [ ] **Step 2:** Run `npm run test:e2e -- drive-tips`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `npm run test:e2e`. Expected: the whole suite passes.
- [ ] **Step 5: Commit:** "Position tips on the drive"

### Task 9: Speed check, CLAUDE.md, verification, the user's review

**Files:**
- Create: `scripts/perf.mjs` (a port of SoccerBasics' script: it reads `window.__drive`, warns if `state().lesson` never reaches 22, and reports the same numbers)
- Modify: `CLAUDE.md`, `README.md`

- [ ] **Step 1:** Run `npx next build`, start `npx wrangler dev --port 8787`, then run `node scripts/perf.mjs "http://localhost:8787/#check" 4` three times. Expected *(my call)*: the slowest 5% of frames ≤ 22ms, at most 2% of frames over 33ms, and idle frames cost nothing (the engine does no work without a scroll). If any of these fails, profile before changing anything.
- [ ] **Step 2:** Add a **Homepage drive** section to CLAUDE.md:
  - `lib/drive/*` (the rules, plays, formations, motion, `poseAt`, scroll and apply)
  - the DOM contract from Task 6
  - "the scroll position is the only clock"
  - "every rule claim comes from the rules check"
  - how to add or change a play: edit `plays.ts`, then `motion.ts`, then the lesson copy, and run the unit tests
- [ ] **Step 3:** Run `npm test && npm run test:e2e && npx tsc --noEmit && npm run lint`. Expected: everything passes. Paste the summary lines into the task report.
- [ ] **Step 4: The user's review.** Start `npx wrangler dev --port 8787 --ip 0.0.0.0`. Open `http://10.0.2.2:8787/` in the Android emulator's Chrome (see the `android-emulator` memory in the SoccerBasics project) and on desktop. Ask the user to scroll the whole drive, both ways, and react. Their changes go into this branch before Task 10's outlines are reviewed.
- [ ] **Step 5: Commit:** "Perf script and CLAUDE.md for the drive"

### Task 10: Content plan for the 13 guides (writing, no building)

**Files:**
- Create: `docs/superpowers/specs/2026-10-24-guides-content-plan.md`

Use `marketing-skills:content-strategy` and `marketing-skills:site-architecture` for the queries and the linking, and `marketing-skills:schema` for the structured data.

- [ ] **Step 1:** For each guide in spec §2, write:
  - **URL, title and description** (title ≤ 65 characters with the suffix, description 50–160), plus the main query and 3–6 related questions, checked against autocomplete and "People also ask"
  - **Outline:** the H2 sections in reading order. Under each, its blocks, with one line on what each says, and any diagram (inline SVG: formations, the field, the officials' signals) or table.
  - **Facts to verify:** each with its row in the rules check, or a new row added to it
  - **Links:** which homepage lessons link here (`more`), 3–4 related guides for the chips, and which section links back to the drive
  - **Structured data:** `articleJsonLd`. The glossary also gets a `DefinedTermSet`, and the plan lists its terms.
  - **Length:** a word target set by what the top 3 results for the main query cover, never under 1,000
- [ ] **Step 2:** Add the About page's new "Why" and "How" blocks (SETUP.md step 3.5) as draft copy.
- [ ] **Step 3:** Self-check:
  - every guide has every item above
  - no guide repeats another's main query
  - every homepage `more` link lands on a guide that answers what the lesson promises
  - nothing explains football through another sport
- [ ] **Step 4: Commit:** "Content plan for the 13 guides". Hand it to the user to review. Phase 2's plan builds the guides from it and deletes the two sample guides, and the user reviews the guides in sets of about 4.
