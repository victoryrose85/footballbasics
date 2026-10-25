# FootballBasics.us — design

**Status:** approved by the user, 2026-10-24.
**Research and copy:** use the installed marketing skills for the SEO and copy research and design (the user's instruction): `content-strategy` and `site-architecture` for keyword research and the guide list, `copywriting` and `copy-editing` for the lessons and guides, `schema` for structured data, `ai-seo` and `seo-audit` for the pre-launch check.
**Mockups:** `.superpowers/brainstorm/588-1792905765/content/`. `phone-layout.html` (option B, the pinned window, was chosen) and `fonts.html` (option B, Oswald + Source Sans 3, was chosen).
**Starting point:** this folder is a copy of `_basics` (SETUP.md step 1 is done: copied, `npm install` run, not yet a git repo). SoccerBasics (`D:\Projects\websites-for-ads\soccerbasics`) is the prior art for the scroll-driven homepage: read its spec (`docs/superpowers/specs/2026-10-23-soccerbasics-redesign-design.md`), `components/field/` and `lib/field/` before planning the drive.

Calls marked *(my call)* were made by Claude, not the user. The user can overrule any of them.

## 1. Intent

FootballBasics.us explains American football, starting with the NFL, to someone who wants to understand enough of the rules to enjoy watching a game, and wants that quickly, before a game they're about to watch. They aren't trying to become experts. They want the game to stop being confusing. The feeling to design for: a newcomer short on time, a little anxious about looking lost, who wants the essentials fast and more depth if they choose.

Ad revenue is the whole point, as with SoccerBasics: the site has to rank for newcomer searches, load fast on phones, and get through AdSense review.

**Goals**
- A homepage that teaches the game by scrolling through one full NFL drive, play by play, in the playful style of SoccerBasics.
- 13 deeper guides, each answering one search, plus About and Privacy.
- AdSense, Analytics and the consent messages working, as on SoccerBasics.

**Non-goals (for now)**
- College football. It comes later at `footballbasics.us/college/…` (a folder, not a subdomain: the user's decision, so ranking earned by one part helps the other). Nothing for it is built now. Don't put NFL pages under `/pro/`. They live at the root.
- Live scores, schedules, standings, team pages, or anything that needs an API.

**Anti-goals**
- A cluttered phone screen (the user's main concern; section 3).
- Explaining football through soccer or any other sport.
- Copy that refers to being invited to a game by friends, or any "heading to a game?" framing. That was a note on feeling, not copy (the user's instruction).
- Copy that sounds AI-written.
- Ads in or over the field window.
- Homepage text that Google can't read.
- Anything that looks official: no NFL or team logos, team names or uniforms. The two sides on the drive are just "the offense" and "the defense". The footer disclaimer reads "Not affiliated with the NFL or any of its teams." *(my call)* Naming the NFL in the text to describe its rules is fine.

## 2. Domain and URLs

- The NFL site is `https://footballbasics.us`, apex, no www. www → apex is a Cloudflare redirect rule, never `next.config.mjs` (see CLAUDE.md's www section).
- College later lives under `/college/`. Keep NFL guide slugs at the root.

| URL | Page |
|---|---|
| `/` | The drive (section 3) |
| `/football-penalties-explained` | Every penalty you'll see, with the official's signal for each |
| `/downs-in-football` | Downs and distance: what "3rd & 7" means |
| `/how-scoring-works-in-football` | Touchdown, field goal, safety, extra point, two-point try |
| `/nfl-overtime-rules` | Overtime in the NFL, regular season and playoffs |
| `/nfl-replay-review-and-challenges` | Replay review and coaches' challenges |
| `/football-positions-explained` | Every position explained |
| `/football-formations-explained` | Offensive and defensive formations, with diagrams |
| `/special-teams-explained` | Kickoffs, punts and field goals |
| `/how-long-is-a-football-game` | Quarters, the clock, timeouts, why a game takes about 3 hours |
| `/how-to-watch-football` | Reading the TV screen, and what to watch on each play |
| `/football-field-explained` | Every line and marking on the field |
| `/how-the-nfl-season-works` | 17 games, divisions, conferences, playoffs, the Super Bowl |
| `/football-glossary` | Football words A to Z (with a DefinedTermSet) |
| `/about` | About, with `#contact` |
| `/privacy-policy` | Privacy policy (the template's, with the names swapped) |

The 13 guides were approved by the user; more can be added later. The slugs are *(my call)*. Titles and descriptions are the builder's to write, within the template's tests (titles ≤ 65 characters, descriptions 50–160), with the suffix ` | FootballBasics`.

Deeper pages use the template's `DeeperPage` as they are. Each should be 1,000+ words of original writing (AdSense rejects thin sites). Diagrams (formations, the field, official's signals) are inline SVG per the template's CLAUDE.md, with any logic pure and unit-tested in `lib/`. When the college rule differs in a way that would confuse a viewer (a catch needs one foot in bounds in college, two in the NFL), a guide may say so in one sentence. No college coverage beyond that *(my call)*.

## 3. Homepage: the drive

### The concept (approved)
The homepage teaches the game through one full offensive drive, from the opening kickoff to a touchdown and the kick that follows. Football's stop-start rhythm (a burst, a whistle, everyone lines up again) is the feeling of the game and the thing that most confuses newcomers, so the page is built around it: one lesson per play.

### The layout (approved: option B in `phone-layout.html`)
- **A pinned field window** at the top of the screen shows the play, like a TV view. The **lessons scroll underneath it**. The user's reason: the words describe what's happening on the field, so the field must stay in view while you read.
- The window shows about 20 yards of a vertical field (yard lines horizontal, the offense driving down the screen toward the bottom end zone), and **follows the ball** the way a TV camera does *(my guess, approved)*.
- The **down-and-distance tag** ("2nd & 6 · own 30") is pinned inside the window, styled like the TV's.
- **The blue line** marks the line of scrimmage, and **the yellow line** marks the first-down spot, as on TV. On "& goal" downs there's no yellow line, because the goal line is the target.
- **On desktop**, the window is pinned on one side and the lessons scroll on the other *(my guess, approved)*.

### Keeping it uncluttered (approved, from the mockup)
1. **One play on the field at a time.** Only the current play's 22 players are drawn.
2. **At most two labeled players per play**, the ones the lesson is about. Everyone else is a plain dot.
3. **Tap any player for their job.** The tips are written per position (quarterback, center, guard, tackle, tight end, wide receiver, running back, fullback, kicker, punter, long snapper, holder, defensive tackle, defensive end, linebacker, cornerback, safety, returner, and so on), not per dot. Each tip says what that player is there to do. The tip text is in the server HTML, hidden until opened. A tap anywhere else closes it.
4. **Text never covers the action.** The lessons live below the window (phone) or beside it (desktop), never on the field.
5. **One thing pinned:** the tag. Nothing else floats over the field.

### Top of the page *(my call)*
The page opens with the slim header, then a short hero: the H1 (the wordmark plus a tagline) and a 2–3 sentence answer to "how does football work?", which is also the text Google is most likely to show in search results. Below the hero, the drive section begins and its window pins to the top of the screen. When lesson 23 scrolls out, the window unpins and the guide links, the ad and the footer follow as a normal column. The template's guide-list homepage is replaced.

### Scroll behavior (approved)
- Each lesson owns a stretch of scroll. As the reader scrolls through it, that lesson's play runs in the window: lined up (with the "before" tag), snap, the play, whistle, ball placed (with the "after" tag).
- **Everything comes from the scroll position.** Scrolling up runs the play backward, like rewinding (the user's addition). A reload or Back restores the exact same moment, and nothing replays on its own.
- Reduced motion and phones get a calm version, with no ambient effects, but the plays still run with the scroll (the same decision SoccerBasics made: many visitors have the OS animation setting off).

### The 23 lessons (approved: "keep all 23")
Each lesson is an H2 card with a kicker. For the plays, the kicker is the down and distance before the snap. Penalties are the ones a newcomer sees most and finds confusing. Passes are deliberately short so the drive has room for more downs.

Yard positions below use "own N" (the offense's half) and "opp N" (the opponent's half). **These numbers are a working draft: the builder checks every rule against the current NFL rulebook and adjusts the yardages if a rule needs it, keeping the lessons and their order.** A unit test must prove the drive adds up (section 6).

**Setting the scene**
1. **The field:** 100 yards between the goal lines, an end zone at each end, and yard numbers that count up to the 50 and back down.
2. **Kickoff and touchback:** the game starts with a kick. The returner kneels in the end zone (or the ball goes through it), so the drive starts at the touchback spot. Draft: own 35, which is the 2025 NFL rule; verify.
3. **Offense, defense and the line of scrimmage:** 11 players a side, lined up on either side of the blue line.
4. **Downs:** four tries to go 10 yards. The drive starts at 1st & 10.

**The drive**

| # | Before | Play | After | Lesson |
|---|---|---|---|---|
| 5 | 1st & 10, own 35 | Run for 4 | 2nd & 6, own 39 | How a play ends, and where the ball is placed |
| 6 | 2nd & 6, own 39 | Incomplete pass | 3rd & 6, own 39 | The clock stops, and the ball stays at the same spot |
| 7 | 3rd & 6, own 39 | 🚩 False start, −5 | 3rd & 11, own 34 | Some flags stop the play before it starts |
| 8 | 3rd & 11, own 34 | 🚩 Defensive pass interference on a deep throw, foul at opp 48 | 1st & 10, opp 48 | The ball moves to the spot of the foul, plus a new set of downs, which is why this flag can be huge |
| 9 | 1st & 10, opp 48 | 12-yard run, wiped out by 🚩 offensive holding, −10 | 1st & 20, own 42 | The play happens, then comes back. This is the most common flag. |
| 10 | 1st & 20, own 42 | Short pass for 8 | 2nd & 12, own 50 | A pass caught short of the yellow line still gains yards |
| 11 | 2nd & 12, 50 | 🚩 Defensive offside, then an incomplete pass. Offense takes the 5 yards. | 2nd & 7, opp 45 | The other team chooses to take or turn down a penalty. Past midfield, the numbers count down. |
| 12 | 2nd & 7, opp 45 | Catch for 9 | 1st & 10, opp 36 | First down: the yellow line jumps ahead and the count resets |
| 13 | 1st & 10, opp 36 | Sack, −7 | 2nd & 17, opp 43 | Losing yards |
| 14 | 2nd & 17, opp 43 | 🚩 Roughing the passer (pass incomplete), +15 and a new set of downs | 1st & 10, opp 28 | Protecting the quarterback |
| 15 | 1st & 10, opp 28 | Run of 5, out of bounds | 2nd & 5, opp 23 | Why the clock stops when a runner goes out of bounds |
| 16 | 2nd & 5, opp 23 | 🚩 Delay of game, −5 | 2nd & 10, opp 28 | The play clock |
| 17 | 2nd & 10, opp 28 | Two short passes: +6, then +3 | 4th & 1, opp 19 | Why 3rd down is the big one, and the "red zone" inside the 20 |
| 18 | 4th & 1, opp 19 | The choice: punt, field goal or go for it. They go for it, and a quarterback sneak gains 2. | 1st & 10, opp 17 | 4th-down decisions |
| 19 | 1st & 10, opp 17 | Catch for 11 | 1st & goal, opp 6 | What "& goal" means |
| 20 | 1st & goal, opp 6 | Run for 3 | 2nd & goal, opp 3 | (keeps the rhythm; short lesson on goal-line plays) |
| 21 | 2nd & goal, opp 3 | Touchdown catch | — | What counts as a catch, and replay review |

**The finish**
22. **The try:** an extra-point kick or a two-point try (draft: the kick is snapped from the 15 and the two-point try from the 2; verify).
23. **Kickoff to the other team, and the rest of the game:** four 15-minute quarters, why a game takes about three hours, and every way to score.

Lesson 17 holds two plays, so that's 18 drive plays in all. Each card can end with a "… →" link to its matching guide (penalties, downs, scoring, the clock and so on), the way SoccerBasics' cards do. Below lesson 23 come the links to all 13 guides, then the in-page ad, then the footer.

### Formations
Each play uses a believable NFL formation for its situation (for example, shotgun on 3rd & 11, a heavy formation on 4th & 1 and at the goal line, kickoff and field-goal units for the kicks). The builder picks them.

## 4. Look (approved: a sibling of SoccerBasics)

- Same playful style: chunky ink outlines, white cards with hard shadows, yellow kicker pills, the slight card tilt.
- **Fonts (the user's choice): Oswald (600–700) for display, Source Sans 3 (500–700) for body,** through `next/font/google` in `app/fonts.ts`, with the same names in `SITE.fonts`. Oswald covers the wordmark, headings, kickers, the tag and the yard numbers.
- **Colors** *(my call, adjustable)*:
  - A deeper turf green than SoccerBasics, in two stripes.
  - White yard lines.
  - The TV's blue (line of scrimmage) and yellow (first down).
  - Offense dots in orange and defense dots in light blue, as in the mockup.
  - The yellow accent is shared with SoccerBasics.
- Everything goes through `site.config.ts` colors, per the template.
- `npm run images` redraws the logo, favicon and share card from the config. The builder may draw a football into the logo and favicon if the generator allows it; otherwise the wordmark alone is fine.

## 5. SEO, ads, consent, analytics

These come from the template, unchanged unless listed here.
- **All homepage text is in the server HTML:** the 23 lessons, every position tip, the guide links and the footer. One H1 (the wordmark plus a tagline). Each lesson is an H2. Tips are not headings.
- **Structured data:** `WebSite` and `Organization` on `/`; `Article` and `BreadcrumbList` on guides; `DefinedTermSet` on the glossary.
- **Ads:** the template's four units, sharing SoccerBasics' slot IDs (the user's decision; the template allows this within one AdSense account).
  - Desktop gets the rails, and phones get Google's anchor ad.
  - The in-page unit goes below the guide links.
  - The in-article units go on the guides.
  - No ad ever goes inside, over or between the field window and its lessons.
  - Auto ads is limited to the anchor ad.
  - No ads on the 404 page.
- **Consent and Analytics:** as in the template. The site shares SoccerBasics' GA4 property (`G-44MDNZHRJX`, the user's decision) and gets its own European and US state Privacy & messaging messages in AdSense.

## 6. Tests and checks

On top of the template's tests:
- **The drive adds up:** a pure, unit-tested module. Each play's "after" equals the next play's "before". Penalty yardages match the rule used. Every first down lands at or past the line to gain. "& goal" shows when the line to gain is at or beyond the goal line. The touchdown crosses the goal line.
- **Scroll is the only clock:** an e2e test scrolls to the middle of several lessons. It checks the tag and the ball position, reloads, and gets the same result. Scrolling there from below gives the same result as scrolling there from above.
- **Layout checks at 360, 412, 768 and 1300px:**
  - No label overlaps another label or a dot.
  - No text runs outside the window.
  - At most two labels per play.
  - No horizontal page scroll.
  - The lessons stay readable below the window on a 360×640 phone.
- **Copy rules in `copy-rules.spec.ts`:** add regexes for this site's rules (section 7), and a `TARGET_WORDS` entry per guide.
- **Speed:** on SoccerBasics, `scripts/perf.mjs` measures frame timing at 4× CPU on a phone-sized window. Port it, keep scrolling smooth, and pause the frame loop when the window is off screen. Check on a real mid-range Android phone before launch (the Pixel_9 emulator in memory is a stand-in, not a substitute).

## 7. Copy rules

- Warm and adult, like a knowledgeable friend explaining to a newcomer. No choppy strings of short sentences, and no AI-isms. No em dashes (the template's rule).
- Never explain football through soccer or any other sport.
- Define a term before using it. Put the answer first.
- Never refer to being invited to a game, friends taking you, or "heading to a game?" (section 1).
- The homepage teaches enough to watch. The detail goes in the guides.
- Rules are the current NFL rules. Every rule claim is checked against the current NFL rulebook or NFL Operations before publishing, especially anything changed since 2023 (the kickoff, the touchback spot, overtime, the extra point).
- Officials *(my call)*: say "the officials" for the crew and "the referee" for the crew chief. Name the other positions only on the penalties and replay guides.

## 8. Launch

- **Two phases** *(my call)*:
  - Phase 1 is SETUP.md step 2 (the config, fonts, wrangler, images and CLAUDE.md), then the homepage drive, plus a written outline for each guide.
  - Phase 2 writes the guides.
- The homepage and all 13 guides go live in one deploy. AdSense rejects thin sites, so don't launch with fewer.
- The user reviews the homepage first, then the guides in sets of about 4 (as with SoccerBasics) *(my call)*.
- Deploys are public, so run `npm run deploy` only when the user says so.
- Make it a git repo before building, with the GitHub remote `victoryrose85/footballbasics` (the user said yes; SoccerBasics uses `victoryrose85/soccerbasics`, so match its visibility).

## 9. Setup checklist for the user

**Things to give Claude (all answered)**
1. GA4: the same Measurement ID as SoccerBasics, `G-44MDNZHRJX`. Both sites report into one property; filter reports by hostname to see FootballBasics alone.
2. Contact email: retailvalue@gmail.com.
3. GitHub: yes, create `victoryrose85/footballbasics`.
4. Ad units: share SoccerBasics' four.

**Things to set up by hand**
1. **Cloudflare zone:** add footballbasics.us to the same Cloudflare account as soccerbasics.us. If it's registered elsewhere, point the registrar's nameservers at Cloudflare and wait for the zone to show "Active".
2. **www redirect:** add a proxied (orange-cloud) `www` DNS record and a Redirect Rule sending `www.footballbasics.us/*` to `https://footballbasics.us/${1}` (301). The apex record is created by the deploy (`custom_domain: true` in `wrangler.jsonc`).
3. **Wrangler:** already logged in on this machine for SoccerBasics. If `npx wrangler whoami` shows a different account from the zone's, run `npx wrangler login`.
4. **Google Analytics:** nothing to create. The site uses SoccerBasics' property (`G-44MDNZHRJX`). Optionally add `footballbasics.us` to its data stream's domain list.
5. **After the first deploy:**
   - **Search Console:** add a Domain property (verify with the DNS TXT record in Cloudflare) and submit `https://footballbasics.us/sitemap.xml`.
   - **AdSense:** Sites → add footballbasics.us. `ads.txt` is already served from the config.
   - **AdSense Privacy & messaging:** create and publish the European regulations message and the US state regulations message for footballbasics.us.
   - **AdSense review:** request it once all 13 guides are live.
   - **Once AdSense shows "Ready":** set Auto ads to the anchor ad only.

## 10. Left to the builder

- Titles and descriptions; the tagline; all lesson, tip and guide copy (following section 7 and reviewed by the user).
- Formations and player paths for each play; exact window height on phones (it must leave the lesson text readable on a 360×640 screen); how a lesson's scroll stretch maps to its play's phases; how the camera eases between plays.
- Where tips open in the window; desktop breakpoint and the split between window and lessons, within the template's rails.
- Whether to animate with Motion (as SoccerBasics does) or plain `requestAnimationFrame`, as long as the scroll position stays the only clock.
- Rewriting CLAUDE.md's Purpose and copy-rules sections for this site, and keeping the www warning word for word.
