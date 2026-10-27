# FootballBasics, Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write the 13 guides, rewrite About for football, delete the two sample guides, and get `build` ready for the single launch deploy.

**Architecture:**
- Each guide is a server component at `app/(deeper)/<slug>/page.tsx`, wrapped in the existing `DeeperPage`, with its copy written straight into the JSX.
- Diagrams are inline SVG in `figure.diagram`. Anything that places things (lineups, the field's marks, the signals, the playoff bracket) is a pure function in `lib/diagrams/`, unit-tested. The lineups reuse the drive's `FORMATIONS` (`lib/drive/formations.ts`), so the homepage and the guides draw the same 22 players.
- The guides are built in four sets with your review after each. Until all 13 exist, a chip or an in-text link to a guide that isn't built yet renders as plain text and is marked `data-waiting`. The last set adds a test that fails if anything is still waiting.

**Tech Stack:** Next.js 14 App Router, static export, TypeScript, plain CSS (`app/site.css`), Vitest, Playwright against `wrangler dev`.

**Specs:** `docs/superpowers/specs/2026-10-24-footballbasics-design.md` (the design, §2, §5 to §8) and `docs/superpowers/specs/2026-10-24-guides-content-plan.md` (one section per guide: title, description, query, outline, facts, links, length). Rule facts come from `docs/superpowers/specs/2026-10-24-nfl-rules-check.md` ("row N"). The executor reads all three. This plan doesn't repeat the outlines. Each guide task points at its section and lists only what is specific to it. SoccerBasics' phase 2 (`D:\Projects\websites-for-ads\soccerbasics\docs\superpowers\plans\2026-10-24-soccerbasics-redesign-phase2.md`, `lib/glossary.ts`, `lib/formations.ts`) is the prior art.

## Global Constraints

- **Branch:** `build`. Never run `npm run deploy` or `wrangler deploy`. Task 14 deploys only after the user says so (spec §8).
- **Static export:** no `export const revalidate`, no middleware, no `cookies()`/`headers()`. No www redirect in `next.config.mjs`.
- **Internal links** are plain `<a href>`. A link to another guide goes through `GuideLink` (Task 1).
- **Copy (CLAUDE.md, Copy rules):**
  - warm and adult, like a knowledgeable friend explaining to a newcomer; no choppy strings of short sentences; no AI-isms; no em dashes
  - define a term before using it; put the answer first
  - "football", never "American football". **This overrides the content plan**, whose positions, formations and field guides say "American football" in the description and first sentence. Use "NFL" to make the game clear (descriptions in those tasks).
  - never explain football through soccer or any other sport; never mention being invited to a game, friends taking you, or "heading to a game?"
  - "the officials" for the crew and "the referee" for the crew chief. Only the penalties and replay guides name other officials (row 45).
  - no NFL or team logos, team names or uniforms; "the offense" and "the defense"
  - a college difference gets one sentence, only where the content plan allows it (the catch, the hash marks)
  - JSX apostrophes as `&rsquo;`, quotes as `&ldquo;`/`&rdquo;`
- **Rule facts:** every rule claim matches a row of the rules check. Nothing from memory. A claim with no row is cut, or labelled as what teams "usually" do when the content plan says so.
- **Titles and descriptions:** exactly as in the content plan, except where a task gives a replacement. The headline part is ≤ 48 characters; descriptions are 50 to 160.
- **Ads:** `DeeperPage` places them (two `inArticle`, both rails). Add none.
- **Dates:** a guide's `updated` in `lib/pages.ts` is the day it was written (YYYY-MM-DD).
- **Registry order:** `PAGES` lists the guides in the spec §2 table's order (penalties, downs, scoring, overtime, replay, positions, formations, special teams, game length, how to watch, field, season, glossary), then About and Privacy. `GUIDES` follows it, so the homepage's guide list does too.
- **Template:** a change to something every site shares goes into `D:\Projects\websites-for-ads\_basics` as well (Task 1 says which).
- **Commits:** end every message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Diagram labels too small to read on a 360px phone.** A whole field or a 12-figure signals sheet scales its text down with the SVG. → Task 1, `diagrams <path>`: every `text` in a diagram renders at least 10px tall at 360px.
2. **Links to guides that don't exist yet**, during the staged build, and any still dangling at launch. → Task 1, `chips <path>` (planned chips count, live ones registered), and Task 13, `no link is waiting for a page`.
3. **A title or description that breaks the copy rules** (the content plan's descriptions for three guides say "American football"; the copy test only reads the page body). → Task 1, `titles and descriptions keep the copy rules`.
4. **The glossary's structured data drifting from what the page shows.** → Task 13, `glossary JSON-LD matches the page`.
5. **A jump link that lands nowhere** (the glossary's letters, any `#` link). → Task 1, `every jump link lands on an element`.

---

## How every guide task runs

Tasks 1 to 13 each build one guide (Task 1 also does the shared work). They share this procedure, so each task lists only what is specific to it.

1. **Read** the guide's section of the content plan, and every rules-check row it names, in full.
2. **Register it:** add its `PAGES` entry in `lib/pages.ts` (path, registry name, title, description, `updated`, `kind: "guide"`) at its registry-order position, and its `TARGET_WORDS` entry in `tests/e2e/deeper-pages.ts` (the content plan's length target). Run `npm run test:e2e -- -g "<path>"`. Expected: FAIL (the page doesn't exist yet).
3. **Write the page:**
   ```tsx
   export const metadata = pageMetadata("/<slug>");
   export default function Page() {
     return <DeeperPage path="/<slug>" intro={…} back={…} related={[…]}>{/* <Section>s of <Block>s */}</DeeperPage>;
   }
   ```
   - `intro`: the answer to the main query in two or three sentences.
   - Each H2 in the outline is a `<Section>`, each block a `<Block kicker title>`. Lists where the outline lists things.
   - The outline's last H2, "Back to the drive", becomes the `back` prop rather than a section: `{ title: "Back to the drive", text: <one or two sentences naming the matching lessons by what they show> }` *(my call: `DeeperPage` already renders a homepage block there, so a section as well would mean two in a row)*.
   - `related`: the guide's row of the content plan's chips table, in that order.
   - In-text links: the first time the copy uses another guide's subject, wrap it in `<GuideLink href>`, anchored on words that name the subject (never "click here"). At most one link per guide per page.
   - Diagrams: `figure.diagram` > `svg[role=img]` with a `<title>`, and a `figcaption`. Tables: `div.table-wrap` > `table.data` with a `caption` and `th scope`.
4. **Copy pass:** use the `marketing-skills:copy-editing` skill on the whole page, then read it against Global Constraints, Copy. Check each rule claim against its row one last time.
5. **Verify:** `npm test`, `npx tsc --noEmit`, `npm run lint` and `npm run test:e2e` all pass.
6. **Commit:** the page, `lib/pages.ts`, `tests/e2e/deeper-pages.ts`, and any new `lib/`, component, CSS and test files. Message: `<Registry name> guide`.

**Review gates:** after Tasks 4, 8, 12 and 13, stop. Run `npm run build && npm run preview` and ask the user to read that set at http://localhost:8787 on a phone-width window and on desktop. Apply their feedback, run step 5 again, and commit it as `Set <n> review fixes` before starting the next set.

---

## Set 1

### Task 1: Shared pieces, the samples deleted, About, and `/downs-in-football` (content plan §2)

**Files:**
- Create: `components/deeper/GuideLink.tsx`, `lib/diagrams/downs.ts`, `tests/unit/diagrams-downs.test.ts`, `app/(deeper)/downs-in-football/page.tsx`
- Modify: `lib/pages.ts`, `components/deeper/Chips.tsx`, `tests/e2e/deeper.spec.ts`, `tests/e2e/links.spec.ts`, `tests/unit/pages.test.ts`, `tests/e2e/deeper-pages.ts`, `app/(deeper)/about/page.tsx`, `app/(deeper)/privacy-policy/page.tsx` (its chips), `CLAUDE.md`
- Delete: `app/(deeper)/example-guide/`, `app/(deeper)/another-example/`
- Template: the same `isRegistered`, `GuideLink`, `Chips` and test changes in `D:\Projects\websites-for-ads\_basics` (its sample guides stay)

**Interfaces:**
- Produces, in `lib/pages.ts`: `isRegistered(path: string): boolean`.
- Produces: `<GuideLink href={string}>{children}</GuideLink>`. A registered `href` renders `<a href>`; otherwise `<span data-waiting={href}>{children}</span>`.
- Changes: `<Chips paths>` renders only registered paths. When any are skipped, `nav.chips` carries `data-waiting="<the skipped paths, space-separated>"`.
- Produces, in `lib/diagrams/downs.ts`: `countExamples(): { before: string; play: string; after: string }[]`. Each row is built with `advance`, `downTag` and `spotLabel` from `lib/drive/rules.ts`, so the table can't disagree with the drive's arithmetic. `before` and `after` read like `"1st & 10, own 25"`.

- [ ] **Step 1: Write the failing tests.**
  - `tests/unit/diagrams-downs.test.ts`:
    ```ts
    test("the count changes the way the rules say", () => {
      expect(countExamples().map(r => r.after)).toEqual([
        "2nd & 6, own 29",   // 1st & 10 at own 25, a 4-yard run
        "3rd & 6, own 29",   // 2nd & 6, an incomplete pass: same spot, next down
        "4th & 13, own 22",  // 3rd & 6, a 7-yard sack
        "1st & 10, own 37",  // 1st & 10 at own 25, a 12-yard catch: past the line, a new first down
        "2nd & goal, opp 5", // 1st & goal at opp 8, a 3-yard run
      ]);
    });
    ```
  - `tests/unit/pages.test.ts`, `titles and descriptions keep the copy rules`: every `PAGES` title and description matches none of `BANNED` and `SITE_RULES` (`tests/copy-rules.ts`).
  - `tests/e2e/deeper.spec.ts`, for every `DEEPER` path:
    - `chips <path>` (replaces the current chips test): the planned chips (the `a`s plus the `data-waiting` paths) number 3 or 4; every `a` is registered and isn't the page itself; `aside.back a` goes to `/`.
    - `focus is visible on chips and links <path>` (changed): it focuses the first `nav.chips a`, or `aside.back a` while no chip on the page is live yet (the downs guide in this task has none).
    - `diagrams <path>`: at 360×800, every `figure.diagram` has an `svg[role=img]` with a non-empty `title` and a non-empty `figcaption`, and every `svg text` has a `getBoundingClientRect().height` of at least 10.
    - `tables <path>`: every `table.data` is inside a `div.table-wrap` and has a non-empty `caption`.
  - `tests/e2e/links.spec.ts`, `every jump link lands on an element`: on every page, each `a[href^="#"]` names an id that exists on that page.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL on `diagrams-downs` (no module). The copy-rules unit test passes on today's pages; it starts to matter in Task 5, the first description that replaces the content plan's.
- [ ] **Step 3: Implement** `isRegistered`, `GuideLink`, the `Chips` change and `countExamples`. Run `npm test`. Expected: PASS.
- [ ] **Step 4: Delete the samples** (both folders, their `PAGES` and `TARGET_WORDS` entries). Rewrite About:
  - The "Why" and "How" blocks: the content plan's draft copy, word for word ("About page: new 'Why' and 'How' blocks").
  - `related`: `["/downs-in-football", "/football-penalties-explained", "/privacy-policy"]`.
  - Leave `intro` and the "Who", "Corrections" and "Contact" blocks unchanged.
  - Set About's `updated`.
  - Privacy's `related`: `["/about", "/downs-in-football", "/football-penalties-explained"]`. Set its `updated`.
- [ ] **Step 5: The downs guide, procedure steps 1 to 3.**
  - Diagram "the tag": a short stretch of field with the blue line (the line of scrimmage), the yellow line (the line to gain) and a tag reading `downTag({ down: 3, spot: 33, lineToGain: 40 })` ("3rd & 7"), with arrows labelled "down" and "distance".
  - Tables: "What each down & distance usually means" (outline §2) and "From one play to the next", whose rows are `countExamples()`.
- [ ] **Step 6: Procedure steps 4 and 5.** Expected: everything passes. About's chips show two live and one waiting, the downs guide's four are all waiting, and the `chips` test counts both kinds.
- [ ] **Step 7: CLAUDE.md, Deeper pages:**
  - Remove the sentence about the samples.
  - Add one line: links to other guides go through `GuideLink`, and chips and `GuideLink` render a guide that isn't registered yet as plain text marked `data-waiting`.
  - Add one line: diagram logic lives in `lib/diagrams/`.
- [ ] **Step 8: Template.** Port `isRegistered`, `GuideLink`, the `Chips` change, the `chips`, `diagrams` and `tables` tests, the jump-link test, the pages copy-rules test, and the two CLAUDE.md lines into `_basics`. Run `npm test && npm run test:e2e` there. Expected: PASS. Commit there: `GuideLink, chips for unbuilt pages, diagram and table checks`.
- [ ] **Step 9: Commit:** `Downs guide; GuideLink, chip and diagram checks; About for football; sample guides deleted`

### Task 2: `/football-penalties-explained`, with the signals (content plan §1)

**Files:**
- Create: `lib/diagrams/signals.ts`, `tests/unit/diagrams-signals.test.ts`, `components/deeper/Signal.tsx`, `app/(deeper)/football-penalties-explained/page.tsx`
- Modify: `app/site.css` (`.sheet .signals`), `lib/pages.ts`, `tests/e2e/deeper-pages.ts`, `tests/e2e/deeper.spec.ts`

**Interfaces:**
- Produces, in `lib/diagrams/signals.ts`:
  ```ts
  export type SignalId = "false-start" | "holding" | "offside" | "personal-foul" | "pass-interference"
    | "intentional-grounding" | "delay-of-game" | "illegal-motion" | "facemask" | "unsportsmanlike-conduct"
    | "too-many-players" | "refused-or-incomplete";
  export interface Arm { upper: number; fore: number } // degrees from hanging straight down; 180 is straight up, positive swings out to that side
  export interface Signal { id: SignalId; caption: string; source: string; left: Arm; right: Arm; mark?: "rotate" | "swing" | "strike" }
  export const SIGNALS: Signal[]; // the content plan's 12, in its order
  export function armPoints(shoulder: [number, number], arm: Arm, side: "left" | "right"): [number, number][]; // shoulder, elbow, hand, with upper arm 20 and forearm 18 units long
  ```
  - `source` is row 44's words for that signal.
  - `caption` uses the rulebook's name for it. If row 44 calls a signal something else, use row 44's name and change the id.
  - `mark` draws motion the rulebook describes: forearms rotating (`rotate`), a swinging arm (`swing`), or one wrist striking the other (`strike`).
- Produces: `<Signal signal={Signal} />`, one `figure.diagram` with a front-view stick figure in ink, the angles from `SIGNALS`, and `caption` as its `figcaption`.

- [ ] **Step 1: Write the failing tests.**
  ```ts
  test("twelve signals, in the plan's order, each from the rulebook's words", () => {
    expect(SIGNALS.map(s => s.id)).toHaveLength(12);
    expect(new Set(SIGNALS.map(s => s.id)).size).toBe(12);
    for (const s of SIGNALS) expect(s.source.length, s.id).toBeGreaterThan(20);
  });
  test("an arm hanging down points down, and 180 degrees points up", () => {
    expect(armPoints([0, 0], { upper: 0, fore: 0 }, "left").at(-1)).toEqual([0, 38]);
    const up = armPoints([0, 0], { upper: 180, fore: 0 }, "right").at(-1)!;
    expect(up[0]).toBeCloseTo(0); expect(up[1]).toBeCloseTo(-38);
  });
  test("a left arm swung out goes left, a right arm goes right", () => {
    expect(armPoints([0, 0], { upper: 90, fore: 0 }, "left").at(-1)![0]).toBeLessThan(0);
    expect(armPoints([0, 0], { upper: 90, fore: 0 }, "right").at(-1)![0]).toBeGreaterThan(0);
  });
  ```
  (Left and right are the figure's as you face it: its left arm is on your left.)
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement** `armPoints`, then `SIGNALS` from row 44 (draw each pose from the words, never from league or network artwork), then `Signal`. Run `npm test`. Expected: PASS.
- [ ] **Step 4: Procedure steps 1 to 3.**
  - "The officials' signals" section: a `div.signals` grid of the 12 `<Signal>`s. Two columns at 360px, three or four on desktop: `.sheet .signals{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}`.
  - Tables: "Penalty outcomes" and "Fouls before the snap" (outline §2, §3), each with the yards from its row.
  - This guide may name the other officials (row 45), in the one short note the outline allows.
- [ ] **Step 5: Add the e2e test** `penalties has 12 signal figures` to `deeper.spec.ts`: `div.signals figure.diagram` has a count of 12.
- [ ] **Step 6: Procedure steps 4 to 6.**

### Task 3: `/how-scoring-works-in-football` (content plan §3)

**Files:**
- Create: `components/deeper/Goalposts.tsx`, `app/(deeper)/how-scoring-works-in-football/page.tsx`
- Modify: `lib/pages.ts`, `tests/e2e/deeper-pages.ts`

**Interfaces:**
- Produces: `<Goalposts caption={string} />`, a front-view `figure.diagram` drawn to scale from row 71: a crossbar 18 ft 6 in wide with its top 10 ft above the ground, and uprights 35 ft above the crossbar. Its SVG labels the three measurements. Task 5 reuses it.

- [ ] **Step 1: Procedure steps 1 to 3.**
  - Diagrams: "the plane of the goal line" (side view: a runner's ball over the line, a ball just short, a ball touching the pylon; row 48) and `<Goalposts>`.
  - Tables: "Points at a glance" (row 22) and "One drive, scored": the homepage drive's touchdown and try, then a stalled drive that ends in a field goal.
  - Field-goal distance: the 10 yards to the end line is the rule; the holder's 7 yards is what teams "usually" do (row 72).
- [ ] **Step 2: Procedure steps 4 to 6.**

### Task 4: `/special-teams-explained` (content plan §8), and the lineup diagrams

**Files:**
- Create: `lib/diagrams/lineup.ts`, `tests/unit/diagrams-lineup.test.ts`, `components/deeper/Lineup.tsx`, `app/(deeper)/special-teams-explained/page.tsx`
- Modify: `lib/pages.ts`, `tests/e2e/deeper-pages.ts`

**Interfaces:**
- Consumes: `FORMATIONS`, `Formation`, `Position` from `lib/drive/formations.ts`. Each spot is `[dx, dy]` in yards from the ball, with the offense at `dy >= 0`.
- Produces, in `lib/diagrams/lineup.ts`:
  ```ts
  export interface LineupSpot { pos: Position; at: [number, number]; label?: string } // label overrides POSITION_LABEL
  export const POSITION_LABEL: Record<Position, string>; // qb "QB", c "C", g "G", t "T", te "TE", wr "WR", rb "RB", fb "FB", de "DE", dt "DT", lb "LB", cb "CB", s "S", k "K", p "P", ls "LS", h "H", kr "KR", pr "PR", cov "", blk ""
  export function offenseOf(f: Formation): LineupSpot[]; // o0..o10
  export function defenseOf(f: Formation): LineupSpot[]; // d0..d10
  export function onTheLine(spots: LineupSpot[]): LineupSpot[]; // offense with dy < 1.2: the players on the line of scrimmage
  export function lineupLayout(spots: LineupSpot[], opts?: { pxPerYard?: number; marginYards?: number }):
    { width: number; height: number; scrimmageY: number; dots: { x: number; y: number; label: string; side: "o" | "d" }[] };
  // crops to the dots plus marginYards (default 3), pxPerYard default 12; the offense is drawn at the bottom
  export const PUNT: LineupSpot[]; // the offense in punt formation (row 54): seven on the line, two wide gunners labelled "G", a personal protector "PP", the punter about 15 yards deep
  ```
- Produces: `<Lineup spots={LineupSpot[]} title={string} caption={string} />`, a `figure.diagram` with the line of scrimmage, the offense's dots in the accent color and the defense's in white, each with its label.

- [ ] **Step 1: Write the failing tests.**
  ```ts
  test("every offense the guides draw has seven on the line (row 19)", () => {
    for (const id of ["shotgun", "singleback", "i-form", "heavy", "goal-line"] as const)
      expect(onTheLine(offenseOf(FORMATIONS[id])), id).toHaveLength(7);
    expect(onTheLine(PUNT)).toHaveLength(7);
  });
  test("the layout puts the offense below the line of scrimmage and the defense above it", () => {
    const l = lineupLayout([...offenseOf(FORMATIONS["i-form"]), ...defenseOf(FORMATIONS["i-form"])]);
    expect(l.dots).toHaveLength(22);
    for (const d of l.dots) expect(d.side === "o" ? d.y > l.scrimmageY : d.y < l.scrimmageY).toBe(true);
    for (const d of l.dots) { expect(d.x).toBeGreaterThan(0); expect(d.x).toBeLessThan(l.width); }
  });
  test("the I formation labels its quarterback, fullback and running back", () => {
    const labels = lineupLayout(offenseOf(FORMATIONS["i-form"])).dots.map(d => d.label);
    expect(labels.filter(l => ["QB", "FB", "RB"].includes(l))).toEqual(["QB", "FB", "RB"]);
  });
  ```
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement** `lineup.ts`, then `Lineup`. Run `npm test`. Expected: PASS.
- [ ] **Step 4: Procedure steps 1 to 3.**
  - Diagram "the kickoff": `<Lineup>` of `FORMATIONS.kickoff` (both sides, the cov and blk dots unlabelled), plus shaded bands for the setup zone and the landing zone, and labelled yard lines for the kicker's 35, the receiving team's 40 and the 35 to 30 setup zone (row 2). `Lineup` may take an optional `bands` prop for this; give it a test if it does.
  - Diagram "the punt formation": `<Lineup spots={PUNT}>`.
  - Onside kick: say it's declared to the referee at any time (row 53, a 2026 change).
- [ ] **Step 5: Procedure steps 4 to 6.**
- [ ] **Step 6: Review gate, set 1.** Ask the user to review `/downs-in-football`, `/football-penalties-explained`, `/how-scoring-works-in-football`, `/special-teams-explained` and `/about`. Ask them to confirm the About "How" block's promise that pages are revised when a rule changes (the content plan asks for this). Wait for approval before Task 5.

---

## Set 2

### Task 5: `/football-field-explained` (content plan §11)

**Files:**
- Create: `lib/diagrams/field.ts`, `tests/unit/diagrams-field.test.ts`, `components/deeper/FieldDiagram.tsx`, `app/(deeper)/football-field-explained/page.tsx`
- Modify: `lib/pages.ts`, `tests/e2e/deeper-pages.ts`

**Description (replaces the content plan's):** `A guided tour of an NFL football field: the yard lines and numbers, hash marks, end zones, goalposts and the sidelines, with measurements.` (138 characters)

**Interfaces:**
- Produces, in `lib/diagrams/field.ts` (yards; `y` runs 0 to 120 from one end line, `x` 0 to 53⅓ across):
  ```ts
  export const FIELD: { length: 120; width: number; endZone: 10; hashFromSideline: number }; // width 160/3, hashFromSideline 70.75/3 (rows 67, 69)
  export function fieldMarks(): {
    yardLines: number[];                                                  // y of every 5-yard line, goal line to goal line
    numbers: { y: number; label: string; arrow: "toward-low" | "toward-high" | null }[]; // every 10 yards; arrows point at the nearer goal line (row 68)
    hashes: [number, number];                                             // x of the two rows of hash marks
    tryMarks: number[];                                                   // y of the 2-yard marks (row 70)
  };
  ```
- Produces: `<FieldDiagram />`, the whole field in a `figure.diagram`, labelled: end zones, goal lines, yard numbers, hash marks, the 2-yard marks, goalposts and pylons. Draw it lengthwise across the page so the numbers stay readable at 360px (`diagrams` test).
- Consumes: `<Goalposts>` (Task 3).

- [ ] **Step 1: Write the failing tests.**
  ```ts
  test("a 5-yard line from goal line to goal line", () => {
    const { yardLines } = fieldMarks();
    expect(yardLines).toHaveLength(21);
    expect(yardLines[0]).toBe(10); expect(yardLines.at(-1)).toBe(110);
  });
  test("numbers count up to the 50 and back down, with arrows at the nearer goal line", () => {
    const { numbers } = fieldMarks();
    expect(numbers.map(n => n.label)).toEqual(["10", "20", "30", "40", "50", "40", "30", "20", "10"]);
    expect(numbers[0]).toMatchObject({ y: 20, arrow: "toward-low" });
    expect(numbers[4].arrow).toBeNull();
    expect(numbers[8]).toMatchObject({ y: 100, arrow: "toward-high" });
  });
  test("hash marks 70 feet 9 inches in from each sideline, try marks at the 2", () => {
    const { hashes, tryMarks } = fieldMarks();
    expect(hashes[0]).toBeCloseTo(23.583, 2);
    expect(FIELD.width - hashes[1]).toBeCloseTo(23.583, 2);
    expect(tryMarks).toEqual([12, 108]);
  });
  ```
  Check row 68 for the arrows and row 70 for the 2-yard marks before trusting these values. If a row differs, the row wins and the test changes.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement** `fieldMarks`, then `FieldDiagram`. Run `npm test`. Expected: PASS.
- [ ] **Step 4: Procedure steps 1 to 3.** The first sentence names the NFL. One college sentence on the hash marks (row 69).
- [ ] **Step 5: Procedure steps 4 to 6.**

### Task 6: `/football-positions-explained` (content plan §6)

**Files:**
- Create: `app/(deeper)/football-positions-explained/page.tsx`
- Modify: `lib/pages.ts`, `tests/e2e/deeper-pages.ts`, `tests/e2e/deeper.spec.ts`

**Description (replaces the content plan's):** `Every position on an NFL team, from quarterback to long snapper: what each player does, where they line up and what number they wear.` (133 characters)

- [ ] **Step 1: Procedure steps 1 to 3.**
  - The first sentence names the NFL.
  - Diagrams: the offense, `<Lineup spots={offenseOf(FORMATIONS["i-form"])}>`, with the seven on the line marked as in row 19; the defense, `<Lineup spots={defenseOf(FORMATIONS.singleback)}>` (the drive's 4-3).
  - Table: "Number ranges" from row 74.
  - Position jobs are vocabulary (N8), so state them plainly with no rule claim.
  - Don't repeat the homepage's position tips (`lib/drive/tips.ts`) word for word.
- [ ] **Step 2: Add the e2e test** `positions has the offense and defense lineups`: two `figure.diagram`s whose `svg title` text contains "offense" and "defense".
- [ ] **Step 3: Procedure steps 4 to 6.**

### Task 7: `/football-formations-explained` (content plan §7)

**Files:**
- Create: `lib/diagrams/sets.ts`, `tests/unit/diagrams-sets.test.ts`, `app/(deeper)/football-formations-explained/page.tsx`
- Modify: `lib/pages.ts`, `tests/e2e/deeper-pages.ts`, `tests/e2e/deeper.spec.ts`

**Description (replaces the content plan's):** `Offensive and defensive formations in NFL football, drawn out: shotgun, I formation, goal-line sets, the 4-3 and 3-4 defenses, and nickel.` (138 characters)

**Interfaces:**
- Consumes: `LineupSpot`, `offenseOf`, `defenseOf`, `onTheLine`, `PUNT`, `<Lineup>` (Task 4).
- Produces, in `lib/diagrams/sets.ts`: `SPREAD: LineupSpot[]` (shotgun, four wide receivers, one back) and `DEFENSES: Record<"4-3" | "3-4" | "nickel" | "dime", LineupSpot[]>`. The 4-3 is `defenseOf(FORMATIONS.singleback)` and the nickel `defenseOf(FORMATIONS.shotgun)`, so the guide matches the drive.

- [ ] **Step 1: Write the failing tests.**
  ```ts
  const count = (s: LineupSpot[], ps: string[]) => s.filter(p => ps.includes(p.pos)).length;
  test("each defense has the linemen, linebackers and backs its name says", () => {
    const want = { "4-3": [4, 3, 4], "3-4": [3, 4, 4], nickel: [4, 2, 5], dime: [4, 1, 6] } as const;
    for (const [name, [dl, lb, db]] of Object.entries(want)) {
      const d = DEFENSES[name as keyof typeof DEFENSES];
      expect(d, name).toHaveLength(11);
      expect(count(d, ["de", "dt"]), name).toBe(dl);
      expect(count(d, ["lb"]), name).toBe(lb);
      expect(count(d, ["cb", "s"]), name).toBe(db);
      for (const p of d) expect(p.at[1], name).toBeLessThan(0);
    }
  });
  test("the spread has four receivers and seven on the line", () => {
    expect(count(SPREAD, ["wr"])).toBe(4);
    expect(onTheLine(SPREAD)).toHaveLength(7);
  });
  ```
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `sets.ts`.** Run `npm test`. Expected: PASS.
- [ ] **Step 4: Procedure steps 1 to 3.**
  - The first sentence names the NFL.
  - Diagrams:
    - offense: I formation, shotgun, spread, goal-line
    - defense: 4-3, 3-4, nickel, dime, and the goal-line defense (`defenseOf(FORMATIONS["goal-line"])`)
    - special teams: field goal (`FORMATIONS["field-goal"]`, both sides) and punt (`PUNT`)
  - Link the kickoff to the special-teams guide instead of drawing it again.
- [ ] **Step 5: Add the e2e test** `formations has 11 lineups`: 11 `figure.diagram`s.
- [ ] **Step 6: Procedure steps 4 to 6.**

### Task 8: `/nfl-replay-review-and-challenges` (content plan §5)

**Files:**
- Create: `app/(deeper)/nfl-replay-review-and-challenges/page.tsx`
- Modify: `lib/pages.ts`, `tests/e2e/deeper-pages.ts`

- [ ] **Step 1: Procedure steps 1 to 3.**
  - Tables: "What a challenge costs" (rows 18, 60) and "Reviewable and not" (row 58).
  - This guide may name the Replay Official and the referee (row 57).
  - One college sentence on the catch (row 16's note).
  - No catch diagram (the outline makes it optional; left out *(my call)*).
- [ ] **Step 2: Procedure steps 4 to 6.**
- [ ] **Step 3: Review gate, set 2.** Ask the user to review `/football-field-explained`, `/football-positions-explained`, `/football-formations-explained` and `/nfl-replay-review-and-challenges`. Wait for approval before Task 9.

---

## Set 3

### Task 9: `/how-long-is-a-football-game` (content plan §9)

**Files:** create `app/(deeper)/how-long-is-a-football-game/page.tsx`; modify `lib/pages.ts`, `tests/e2e/deeper-pages.ts`

- [ ] **Step 1: Procedure steps 1 to 3.**
  - Tables: "The structure of a game" (rows 15, 63) and "Clock stops" (row 64).
  - The worked example: a runner out of bounds in the first quarter, then the same play inside the last five minutes (rows 13, 64).
  - "About three hours" (row N5), with no minute counts for commercials or anything else that lacks a primary source.
- [ ] **Step 2: Procedure steps 4 to 6.**

### Task 10: `/how-to-watch-football` (content plan §10)

**Files:** create `app/(deeper)/how-to-watch-football/page.tsx`; modify `lib/pages.ts`, `tests/e2e/deeper-pages.ts`

- [ ] **Step 1: Procedure steps 1 to 3.**
  - Diagram "the score bug": a generic score bar reading "Away" and "Home", with the quarter, the game clock, the play clock, the down and distance (`downTag`) and the timeouts left, each labelled. No team names, abbreviations or network styling.
  - The intro answers "how to watch football for beginners" and doesn't chase live-stream searches.
  - The red zone and the "week 1, week 2, week 3" order are judgment, worded as "usually".
- [ ] **Step 2: Procedure steps 4 to 6.**

### Task 11: `/nfl-overtime-rules` (content plan §4)

**Files:** create `app/(deeper)/nfl-overtime-rules/page.tsx`; modify `lib/pages.ts`, `tests/e2e/deeper-pages.ts`, and the rules check if N6 changes

- [ ] **Step 1: Verify N6** (the history of the overtime rules) in a browser on the NFL Operations page the row cites (the page renders with JavaScript, so use the integrated browser, not a plain fetch). If it differs from the row, correct the row with today's date and use the corrected version.
- [ ] **Step 2: Procedure steps 1 to 3.**
  - The first sentence says "2026".
  - Tables: "Regular season at a glance" (rows 23, 61) and "Playoffs at a glance" (rows 24, 56).
  - The two worked games are blocks.
  - The history section is labelled as history and dated.
- [ ] **Step 3: Procedure steps 4 to 6.**

### Task 12: `/how-the-nfl-season-works` (content plan §12), with the bracket

**Files:**
- Create: `lib/diagrams/bracket.ts`, `tests/unit/diagrams-bracket.test.ts`, `app/(deeper)/how-the-nfl-season-works/page.tsx`
- Modify: `lib/pages.ts`, `tests/e2e/deeper-pages.ts`, and the rules check if N1 to N4 change

**Interfaces:**
- Produces, in `lib/diagrams/bracket.ts` (seeds 1 to 7 in one conference, row N3; each game is `[host, visitor]`):
  ```ts
  export function wildCardGames(): [number, number][];                     // [[2, 7], [3, 6], [4, 5]]; seed 1 has the bye
  export function divisionalGames(winners: number[]): [number, number][];  // 1 hosts the lowest surviving seed; the higher of the other two hosts
  ```

- [ ] **Step 1: Write the failing tests.**
  ```ts
  test("the wild card round", () => expect(wildCardGames()).toEqual([[2, 7], [3, 6], [4, 5]]));
  test("the top seed hosts the lowest seed left", () => {
    expect(divisionalGames([2, 3, 4])).toEqual([[1, 4], [2, 3]]);
    expect(divisionalGames([7, 6, 5])).toEqual([[1, 7], [5, 6]]);
    expect(divisionalGames([2, 6, 5])).toEqual([[1, 6], [2, 5]]);
  });
  ```
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement.** Run `npm test`. Expected: PASS.
- [ ] **Step 4: Verify N1 to N4** against the current NFL pages in the integrated browser (the content plan flags N3: a 2025 seeding proposal was withdrawn). If the format changed, the row, the tests and the copy change together.
- [ ] **Step 5: Procedure steps 1 to 3.**
  - Diagram "the league tree": the AFC and the NFC, each with four divisions (East, North, South, West) of four blank boxes. No team names.
  - Diagram "the bracket": one conference's seven seeds through the three rounds, drawn from `wildCardGames` and `divisionalGames` with example winners. The caption says it's an example.
  - Tables: "How a team's 17 games are made" (N1) and "A season at a glance" (no dates).
  - No game dates anywhere, so the page doesn't go stale.
  - The homepage doesn't change; its guide list links here.
- [ ] **Step 6: Procedure steps 4 to 6.**
- [ ] **Step 7: Review gate, set 3.** Ask the user to review `/how-long-is-a-football-game`, `/how-to-watch-football`, `/nfl-overtime-rules` and `/how-the-nfl-season-works`. Wait for approval before Task 13.

---

## Set 4

### Task 13: `/football-glossary` (content plan §13), and nothing left waiting

**Files:**
- Create: `lib/glossary.ts`, `tests/unit/glossary.test.ts`, `app/(deeper)/football-glossary/page.tsx`
- Modify: `lib/structured-data.ts`, `tests/unit/structured-data.test.ts`, `app/site.css` (`.sheet dl.terms`, `nav.letters`), `lib/pages.ts`, `tests/e2e/deeper-pages.ts`, `tests/e2e/deeper.spec.ts`, `tests/e2e/links.spec.ts`

**Interfaces:**
- Produces, in `lib/glossary.ts`:
  ```ts
  export interface Term { term: string; definition: string; href?: string } // definition is plain text: the JSON-LD reads it
  export const TERMS: Term[];
  export function termId(term: string): string; // "Pick six" → "pick-six", "Yards after the catch" → "yards-after-the-catch"
  export function groupTerms(terms: Term[]): { key: string; label: string; terms: Term[] }[]; // by first letter, a to z, sorted case-insensitively within a letter
  ```
- Produces, in `lib/structured-data.ts`: `glossaryJsonLd(terms: Term[]): object`, the content plan's `DefinedTermSet` (name "Football glossary", `url`, and `hasDefinedTerm` with each `DefinedTerm`'s `name`, `description` and `inDefinedTermSet`).

- [ ] **Step 1: Write the failing tests.**
  ```ts
  test("term ids are unique and safe as anchors", () => {
    expect(termId("Pick six")).toBe("pick-six");
    const ids = TERMS.map(t => termId(t.term));
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });
  test("groups by letter, sorted within each", () => {
    const g = groupTerms([{ term: "Sack", definition: "" }, { term: "audible", definition: "" }, { term: "Accept", definition: "" }]);
    expect(g.map(x => x.key)).toEqual(["a", "s"]);
    expect(g[0].terms.map(t => t.term)).toEqual(["Accept", "audible"]);
  });
  test("covers the plan and points at every guide", () => {
    expect(TERMS.length).toBeGreaterThanOrEqual(90);
    const linked = new Set(TERMS.map(t => t.href).filter(Boolean));
    for (const g of GUIDES.filter(g => g.path !== "/football-glossary")) expect(linked).toContain(g.path);
    for (const h of linked) expect(isRegistered(h!)).toBe(true);
    for (const t of TERMS) for (const [rule, re] of [...BANNED, ...SITE_RULES]) expect(t.definition, `${t.term}: ${rule}`).not.toMatch(re);
  });
  ```
  And in `structured-data.test.ts`, `glossaryJsonLd has a DefinedTerm per term, with the same text`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement** `termId`, `groupTerms` and `glossaryJsonLd`. Then write `TERMS`: the content plan's term list, each definition one or two sentences that don't lean on an undefined word. Rule-backed terms follow their row; vocabulary follows N8 and row 81. "Safety" gets both meanings in one entry. Run `npm test`. Expected: PASS.
- [ ] **Step 4: Procedure steps 1 to 3.**
  - `nav.letters` under the intro: letters with terms link to `#letter-<key>`; letters without terms are dimmed `span`s. It wraps at 360px and isn't sticky *(my call: nothing hides under it)*.
  - One `<Section id="letter-<key>" title={label}>` per group, each holding one `Block` with a `dl.terms`. Each term is a `<dt id={termId(term)}>` with its `<dd>`, and a `GuideLink` "More: <guide name>" when it has an `href`.
  - `jsonLd={glossaryJsonLd(TERMS)}`.
- [ ] **Step 5: Add the e2e tests.**
  - `deeper.spec.ts`, `glossary JSON-LD matches the page`: every `DefinedTerm`'s `name` and `description` equal a `dt`'s and its `dd`'s text (the `dd` without its "More" link).
  - `deeper.spec.ts`, `a letter link brings its letter into view`: click `S`; `#letter-s` is in the viewport.
  - `links.spec.ts`, `no link is waiting for a page`: on every page, `[data-waiting]` has a count of 0. All 13 guides exist now, so a failure means a mistyped path.
- [ ] **Step 6: Procedure steps 4 to 6.**
- [ ] **Step 7: Review gate, set 4.** Ask the user to review `/football-glossary` and wait for approval.

---

## Launch

### Task 14: Pre-launch checks, then the deploy when the user says so

**Files:** whatever the checks turn up; `docs/superpowers/specs/2026-10-24-guides-content-plan.md` (findings)

- [ ] **Step 1: People also ask.** In the integrated browser, search each guide's main query on Google and note the "People also ask" questions. Where a guide doesn't answer one that fits its topic, add a block (procedure steps 3 to 5). Record what was seen in the content plan, replacing the **PAA?** guesses.
- [ ] **Step 2: SEO and AI search.** Run the `marketing-skills:seo-audit` and `marketing-skills:ai-seo` skills against `npm run preview` (spec header). Fix what they find within this plan's constraints, and list anything else for the user.
- [ ] **Step 3: Speed.** `npm run build`, `npm run preview`, then `node scripts/perf.mjs "http://localhost:8787/#check" 4` three times. Expected: p95 ≤ 22ms, at most 2% of frames over 33ms, idle ≤ 5ms a second.
- [ ] **Step 4: Verify everything.** `npm test && npx tsc --noEmit && npm run lint && npm run test:e2e && npm run check`. Expected: all pass. `check` prints `Config looks ready for footballbasics.us.`
- [ ] **Step 5: Commit** any fixes: `Pre-launch fixes`.
- [ ] **Step 6: Finish the branch.** Use `superpowers:finishing-a-development-branch` to merge `build` into `main` and push, with the user's say-so.
- [ ] **Step 7: Deploy, only when the user says to.** `npx wrangler whoami` shows the account that holds the footballbasics.us zone. Then `npm run deploy`. Open https://footballbasics.us/ and three guides, and check that `/ads.txt` and `/sitemap.xml` load.
- [ ] **Step 8: Hand the user the setup list** from spec §9 ("Things to set up by hand"): Cloudflare zone and the www redirect rule (before the deploy, if not done), then Search Console, AdSense site, the two Privacy & messaging messages, the AdSense review, and anchor-only Auto ads once it shows "Ready".
