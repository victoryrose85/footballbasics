# Starting a new site from _basics

About 30 minutes of setup, then the writing. `npm run check` lists whatever is still left.

## 1. Copy the template (2 min)

From `D:\Projects\websites-for-ads` in PowerShell, with `newsite` replaced by the site's folder name:

```powershell
robocopy _basics newsite /E /XD node_modules out .next .wrangler test-results playwright-report /XF tsconfig.tsbuildinfo next-env.d.ts
cd newsite
npm install
```

## 2. Make it the new site (10 min)

1. `site.config.ts`: name, url, titleSuffix, mark, tagline, disclaimer, back block, colors. Leave `gaId` for step 4.
2. `app/fonts.ts`: swap the two fonts if the site wants different ones, and name the same families in `SITE.fonts`.
3. `wrangler.jsonc`: `name` (the Worker, e.g. `taxbasics`) and the `routes` pattern (the apex domain).
4. `package.json`: `name`.
5. `npm run images`: redraws `public/logo.png`, `app/icon.png` and `public/og-default.png` from the config.
6. `CLAUDE.md`: fill in the Purpose section and any copy rules of the site's own.

## 3. Write the pages (most of the work)

1. `lib/pages.ts`: the homepage's title and description, then one entry per guide (`kind: "guide"`).
2. `app/page.tsx`: the homepage intro.
3. One `app/(deeper)/<path>/page.tsx` per guide. `/example-guide` shows how; copy it, then delete both samples (folders, registry entries, `TARGET_WORDS` entries and chips that point at them).
4. `tests/e2e/deeper-pages.ts`: a `TARGET_WORDS` entry per guide.
5. `app/(deeper)/about/page.tsx`: rewrite the "Why" and "How" blocks for the subject.
6. `npm test` and `npm run test:e2e` should both pass.

AdSense rejects thin sites ("low value content"). Launch with at least 8 to 10 real guides of 1,000+ words each, plus About and Privacy.

## 4. Accounts (15 min, in the browser)

1. **Domain and Cloudflare:** add the domain as a zone. Add a proxied (orange cloud) `www` DNS record, and a Redirect Rule sending `www.<domain>/*` to `https://<domain>/${1}` (301).
2. **Google Analytics:** create a property (or a web data stream) for the domain and put its `G-` ID in `SITE.gaId`.
3. **Deploy:** `npx wrangler login` (once per machine), then `npm run deploy`. It runs `npm run check` first.
4. **AdSense:** Sites → add the domain. `ads.txt` is generated from `SITE.adClient`, so it's already live. Request review once the guides are up.
5. **AdSense Privacy & messaging:** create the European regulations message and the US state regulations message for the new site. The footer's "Privacy & cookie choices" link reopens whichever one applies.
6. **Search Console:** add the domain property and submit `https://<domain>/sitemap.xml`.
7. Once AdSense shows the site as "Ready": Auto ads → limit it to the anchor ad only.
