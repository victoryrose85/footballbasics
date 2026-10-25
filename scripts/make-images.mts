// Draws the site's images from site.config.ts: the square logo (structured data), the favicon and the
// 1200x630 social card, in the site's stripes, fonts and wordmark. Run after changing the name, colors or fonts:
//   npm run images
// It uses Playwright's Chromium (npx playwright install chromium) and loads the fonts from Google Fonts.
// A site with a drawn logo can replace public/logo.png and app/icon.png by hand instead.
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { SITE } from "../site.config.ts";

const [first, second] = SITE.mark;
const { display, body } = SITE.fonts;
const family = (f: string) => f.replace(/ /g, "+");
const fonts = `https://fonts.googleapis.com/css2?family=${family(display)}:wght@800&family=${family(body)}:wght@800&display=block`;
const vars = Object.entries(SITE.colors).map(([k, v]) => `--${k}:${v}`).join(";");
const outline = (n: number) => `${n}px ${n}px 0 var(--ink),-${n / 3}px -${n / 3}px 0 var(--ink),${n / 3}px -${n / 3}px 0 var(--ink),-${n / 3}px ${n / 3}px 0 var(--ink),${n / 3}px ${n / 3}px 0 var(--ink)`;

function html(width: number, height: number, stripe: number, css: string, content: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><link href="${fonts}" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${width}px;height:${height}px;overflow:hidden}
body{${vars};position:relative;background:repeating-linear-gradient(90deg,var(--stripe-a) 0 ${stripe}px,var(--stripe-b) ${stripe}px ${stripe * 2}px);font-family:'${body}',sans-serif}
em{font-style:normal;color:var(--accent)}
${css}</style></head><body>${content}</body></html>`;
}

// The logo and favicon: the wordmark's initials, big, on the stripes.
const logo = html(512, 512, 128,
  `body{display:flex;align-items:center;justify-content:center}
.ini{font:800 300px/1 '${display}',sans-serif;color:#fff;padding-top:40px;text-shadow:${outline(12)}}`,
  `<div class="ini">${first[0]}<em>${second[0]}</em></div>`);

// The social card: the wordmark, the tagline in a pill, and the domain. Long names get a smaller wordmark.
const chars = first.length + second.length;
const og = html(1200, 630, 150,
  `.ln{position:absolute;inset:22px;border:7px solid rgba(255,255,255,.85);border-radius:6px}
.wm{position:absolute;left:0;right:0;top:150px;text-align:center;font:800 ${Math.min(132, Math.floor(1900 / chars))}px/1 '${display}',sans-serif;color:#fff;text-shadow:${outline(6)}}
.tag{position:absolute;left:50%;top:340px;transform:translateX(-50%);max-width:1040px;text-align:center;font:800 36px/1.2 '${body}';color:var(--ink);background:#fff;border:5px solid var(--ink);border-radius:999px;padding:14px 36px;box-shadow:6px 6px 0 var(--ink)}
.url{position:absolute;left:0;right:0;bottom:46px;text-align:center;font:800 26px '${body}';color:#fff;letter-spacing:.04em;text-shadow:2px 2px 0 var(--ink)}`,
  `<div class="ln"></div><div class="wm">${first}<em>${second}</em></div><div class="tag">${SITE.tagline}</div><div class="url">${new URL(SITE.url).hostname}</div>`);

const browser = await chromium.launch();
const page = await browser.newPage();
async function shoot(content: string, width: number, height: number, ...files: string[]) {
  await page.setViewportSize({ width, height });
  await page.setContent(content, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  for (const f of files) {
    writeFileSync(new URL(`../${f}`, import.meta.url), png);
    console.log(`wrote ${f}`);
  }
}
await shoot(logo, 512, 512, "public/logo.png", "app/icon.png");
await shoot(og, 1200, 630, "public/og-default.png");
await browser.close();
