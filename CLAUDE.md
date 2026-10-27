# Claude Instructions

> **If this folder is `_basics`, it's the template**, not a site. Keep it generic: no subject-specific copy, components or rules. New sites are copies of it (`SETUP.md`). A fix to something every site shares (ads, consent, SEO, the page frame) goes here as well as into the sites that already exist.

## Purpose
FootballBasics.us explains football, starting with the NFL, in plain English to a newcomer who wants to understand enough to enjoy watching a game, and wants it quickly. The homepage teaches the game by scrolling through one full drive, play by play; each guide answers one search. College football comes later, in a folder at `/college/` (not a subdomain, and NFL pages stay at the root, never under `/pro/`). Ad revenue is the whole point, so the site has to rank, load fast on phones, and show ads that AdSense accepts. The approved design is `docs/superpowers/specs/2026-10-24-footballbasics-design.md`.

## Stack
- **Framework:** Next.js 14 App Router, TypeScript. Plain CSS, no framework: `app/globals.css` (a small base) and `app/site.css` (everything else).
- **Deployment:** Cloudflare Workers, static assets only (`wrangler.jsonc`). `next.config.mjs` has `output: "export"`, so the site is plain files in `out/`. No server, no ISR.
- **Per-site values:** `site.config.ts` holds the name, URL, title suffix, wordmark, contact email, Analytics ID, AdSense IDs, font names and colors. Everything else reads from it. The colors become custom properties on `<html>` (`--ink`, `--accent`, ...), so `site.css` never names a color.
- **Fonts:** `app/fonts.ts`, through `next/font/google`, as `--font-display` and `--font-body`.
- **Images:** `npm run images` draws `public/logo.png`, `app/icon.png` and `public/og-default.png` from the config.

No environment variables are needed. The AdSense and Analytics IDs are public.

## Pages
`lib/pages.ts` lists every page with its name, title, description, "updated" date and kind (`home`, `guide`, or `site` for About and Privacy). Metadata (`pageMetadata()`), the sitemap's `lastmod` and the Article `dateModified` all read from it: when a page changes, update its date there. Unit tests hold titles to 65 characters and descriptions to 50–160.

Retired URLs 301 in `public/_redirects` (each with and without a trailing slash), listed again in `tests/e2e/redirects.spec.ts`.

## Deeper pages
- Each is a server component at `app/(deeper)/<path>/page.tsx`. `/example-guide` and `/another-example` are samples to copy and then delete.
- `components/deeper/DeeperPage.tsx` wraps every one: breadcrumbs, H1, "last updated" line, both in-article ads, the back-to-the-homepage block, the related chips and the JSON-LD (Article plus breadcrumbs for a guide, breadcrumbs only for a site page). Its props:
  - `path`: a path in `lib/pages.ts`; the title, H1, breadcrumb name and date all come from there
  - `intro`: the 2–3 sentence answer, shown in the lede block
  - `related`: 3–4 registered paths, shown as chips
  - `back` (optional): `{ title, text }` for the back block; `SITE.back` when left out
  - `jsonLd` (optional): extra structured data, such as a DefinedTermSet for a glossary
- Inside it, each H2 is a `<Section title>` and each white block a `<Block kicker title>`.
- `components/PageFrame.tsx` is the frame every page shares: the rails, the sheet, the wordmark and the footer.
- Diagrams are inline SVG in a `figure.diagram` with a `<title>`; tables are `table.data` inside `div.table-wrap`. Keep any logic behind them pure and unit-tested in `lib/`.
- `tests/e2e/deeper-pages.ts` lists each page's length target (`TARGET_WORDS`). `deeper.spec.ts` checks SEO, ads, rails, chips, focus and 360px width on each; `copy-rules.spec.ts` checks the copy rules and the length. A new page needs its `TARGET_WORDS` entry.

## Homepage drive
The homepage scrolls through one drive: a sticky `section.drive` holds the field window (`.window` > `.field`, 22 `.pl[data-slot]` players, `.ball`, `.los`, `.fd`, `.dtag`, `.tips`) beside 23 `article.lesson[data-lesson]` cards. The scroll position is the only clock: there are no timers, and per-frame work happens only in a rAF scheduled by a scroll event, while the section is on screen.
- **Pure logic** is in `lib/drive/`: `rules.ts` and `plays.ts` (the play list), `formations.ts` (where the 22 stand), `motion.ts` (how they move), `pose.ts` (`poseAt(lesson, t)`, and `showsLines(scene)`, which hides the line of scrimmage and the first-down line in the opening pan and the kickoffs), `scroll.ts` (scroll position to lesson and `t`), `apply.ts` (pose to DOM; `applyPose(root, pose, scale, { height, lines })`, and `cameraY` keeps the window from showing past either end line), `tips.ts` and `tips-ui.ts`, `lessons.ts` (the copy), `checks.ts`.
- **Lesson shape:** each lesson in `lessons.ts` is a `lead` (the answer, one or two sentences) and 3 to 6 `beats` (short bullets, 88 words in all at most). A beat's `focus` lists the slots (`o0`..`d10`) it talks about. As the reader scrolls a lesson its beats take turns (`DriveEngine` shares the lesson's `t` out between them): the current `li` gets `.on` and those players get `.hi`, a ring, while the rest dim (`.drive.focus`). Slot ids depend on the formation (`formations.ts`), so check them when a play changes.
- **Hint:** on the first kickoff a pill follows the kicker ("Mouseover players to see more" with a mouse, "Tap players to see more" on touch) and fades once the kicker leaves the window. `applyPose` places it.
- **Field furniture:** the yard numbers sit in `.nums`, which slides with the camera so a column of them always shows; the goalposts (`.post`) stand just inside each end line, where the extra point crosses between them.
- **DOM contract:** `Drive.tsx` renders every dot and lesson on the server, so the lessons are readable without JavaScript. `DriveEngine.tsx` only sets custom properties and classes on that markup. It fires `drive:lesson` on `section.drive` when the lesson changes, and `bindTips` closes the open tip on it. Tips are 45 words or fewer.
- **Rules:** every rule claim comes from the NFL rules check. Nothing is written from memory.
- **Adding or changing a play:** edit `plays.ts`, then `motion.ts`, then the lesson copy in `lessons.ts`, and run `npm test`.
- **Checks and speed:** on `/#check`, `window.__drive` gives `state()`, `labels()`, `checkOverlap()`, `checkEdges()` and `running()`; the e2e tests use it. `node scripts/perf.mjs "http://localhost:8787/#check" 4` (run `npm run build` first, then `npm run preview` to serve it) scrolls the drive on a throttled phone and reports frame times. Aim for a 95th percentile of 22ms or less, at most 2% of frames over 33ms, and an idle main thread of 5ms a second or less.

## Copy rules
- Warm and adult, like a knowledgeable friend explaining to a newcomer. No choppy strings of short sentences, no AI-isms.
- Define a term before using it. Put the answer first.
- No em dashes.
- Call it "football", never "American football", unless the same sentence or paragraph has to tell it apart from soccer.
- Never explain football through soccer or any other sport.
- Never mention being invited to a game, friends taking you, or "heading to a game?".
- Say "the officials" for the crew and "the referee" for the crew chief. Name the other positions only on the penalties and replay guides.
- Every rule claim must come from the NFL rules check (`docs/superpowers/specs/2026-10-24-nfl-rules-check.md`).
- No NFL or team logos, team names or uniforms. The two sides are "the offense" and "the defense". Naming the NFL in the text to describe its rules is fine.

## Ads, consent and analytics
| Unit | Where |
|---|---|
| `rightRail` | 300×600, sticky, desktop only |
| `leftRail` | 160×600, scrolls with the page, above 1320px |
| `inPage` | responsive, below the homepage's guide list |
| `inArticle` | deeper pages, after the intro and after the article |

- The slot IDs are in `SITE.adSlots`. `<AdUnit slot="…" />` takes one of the names above, reserves its height so nothing shifts when the ad loads, and only asks for an ad once it's visible (a hidden rail never does).
- No ads on the 404 page (AdSense policy). Auto ads is limited to the anchor ad in the AdSense console.
- `ads.txt` is generated from `SITE.adClient` by `app/ads.txt/route.ts`.
- **Consent:** Google's Privacy & messaging messages (European regulations, and US state regulations) are set up per site in AdSense. `lib/consent.ts` sets Consent Mode defaults (denied in the EEA, UK and Switzerland) before Analytics is configured. The footer's "Privacy & cookie choices" link (`PrivacyChoicesLink`) reopens the right message.
- The privacy policy assumes no accounts, forms or other ad networks. Adding any of those means updating it.

## Build and test
```bash
npm run dev         # local dev server at http://localhost:3000
npm run build       # next build: static export to out/, including sitemap.xml, robots.txt and ads.txt
npm run preview     # serve out/ locally with wrangler (http://localhost:8787)
npm test            # unit tests (vitest)
npm run test:e2e    # build, then Playwright against wrangler: SEO, ads/consent, deeper pages, copy rules, links, redirects
npm run images      # redraw the logo, favicon and social card from site.config.ts
npm run check       # fails while any template placeholder is left
npm run deploy      # check + build + wrangler deploy
```
- A deploy is public: run `npm run deploy` only when the user says to.
- Wrangler must be logged in to deploy (`npx wrangler login`).
- Static export rules: no `export const revalidate`, no middleware, no `cookies()`/`headers()`. Route handlers only as static routes (`app/sitemap.ts`, `app/robots.ts`, `app/ads.txt/route.ts`).
- `scripts/*.mts` run straight under Node 24 (type stripping), importing `site.config.ts` directly, so `site.config.ts` must stay plain data with no imports.

## ESLint / TypeScript gotchas
- Apostrophes in JSX text → `&apos;` (or `&rsquo;`), curly quotes → `&ldquo;` / `&rdquo;`.
- Internal links are plain `<a href>` (full page loads) on every page, not `next/link`.

## www redirect — CRITICAL
**Do NOT add a www redirect to `next.config.mjs`.** On SoccerBasics' old Vercel hosting it caused a site-wide infinite redirect loop (both www and non-www went down): the CDN rewrote the `host` header before Next.js saw it, so `has: [{ type: 'host' }]` conditions silently failed. It also can't work now: a static export ignores `redirects()` entirely.

The www → non-www redirect is a **Cloudflare redirect rule** on the site's zone. The `www` DNS record must stay proxied (orange cloud) for that rule to fire. Only the apex is attached to the Worker (`routes` in `wrangler.jsonc`).
