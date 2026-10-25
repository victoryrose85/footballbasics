# _basics

The template for "basics" explainer sites, taken from SoccerBasics.us: Next.js 14 (App Router), built as a static export and served from Cloudflare Workers, with AdSense, Google Analytics, Consent Mode, SEO metadata, structured data, a sitemap and the tests for all of it.

To start a site, follow [SETUP.md](SETUP.md). Most of what changes lives in `site.config.ts`.

## Commands

```bash
npm install
npm run dev       # local dev server at http://localhost:3000
npm run build     # static export to out/, with sitemap.xml, robots.txt and ads.txt
npm run preview   # serve out/ with wrangler at http://localhost:8787
npm test          # unit tests; npm run test:e2e builds and runs the Playwright tests
npm run images    # redraw the logo, favicon and social card from site.config.ts
npm run deploy    # check the config, build and publish
```
