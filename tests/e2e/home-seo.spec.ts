import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { BASE_URL, GUIDES, PAGES, getPage } from "../../lib/pages";
import { HERO, LESSONS } from "../../lib/drive/lessons";
import { POSITION_TIPS } from "../../lib/drive/tips";
import { BANNED, SITE_RULES } from "../copy-rules";

const squash = (s: string) => s.replace(/\s+/g, " ").trim();

// The text a browser makes of each HTML string (entities decoded, tags dropped), and of the server's whole page
// with its scripts taken out, so nothing counts that only JavaScript or the RSC payload would put there. The page's
// text nodes are joined with `sep`: "" keeps a lesson's text whole across its <b> tags, " " keeps neighboring
// elements from running together for the copy rules.
async function decode(page: Page, html: string[]): Promise<string[]> {
  const out = await page.evaluate(list => list.map(h => new DOMParser().parseFromString(h, "text/html").body.textContent || ""), html);
  return out.map(squash);
}
async function serverText(page: Page, raw: string, sep = ""): Promise<string> {
  const text = await page.evaluate(([h, sep]) => {
    const doc = new DOMParser().parseFromString(h, "text/html");
    doc.querySelectorAll("script, style").forEach(s => s.remove());
    const walk = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const parts: string[] = [];
    while (walk.nextNode()) parts.push(walk.currentNode.textContent || "");
    return parts.join(sep);
  }, [raw, sep]);
  return squash(text);
}

test("every lesson, tip and guide link is in the HTML Google reads", async ({ page, request }) => {
  const raw = await (await request.get("/")).text();
  const body = await serverText(page, raw);
  const tips = Object.values(POSITION_TIPS);
  const expected = await decode(page, [
    HERO.answer,
    ...LESSONS.flatMap(l => [l.heading, l.html]),
    ...tips.flatMap(t => [t.title, t.html]),
  ]);
  for (const t of expected) expect(body).toContain(t);
  for (const g of GUIDES) expect(raw).toContain(`href="${g.path}"`);
});

test("the homepage's text keeps the copy rules", async ({ page, request }) => {
  const raw = await (await request.get("/")).text();
  const text = (await serverText(page, raw, " ")).replace(/[‘’]/g, "'");
  for (const [rule, re] of [...BANNED, ...SITE_RULES]) expect(text.match(re)?.[0], rule).toBeUndefined();
});

test("one H1, an H2 per lesson, canonical, title and structured data", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("FootballBasics");
  await expect(page.locator("h1")).toContainText(HERO.tagline);
  await expect(page.locator(".lessons h2")).toHaveCount(LESSONS.length);
  expect(LESSONS.length).toBe(23);
  // a lesson's "more" link appears once its guide is registered
  const live = LESSONS.filter(l => l.more && PAGES.some(p => p.path === l.more!.href));
  await expect(page.locator(".lesson a.more")).toHaveCount(live.length);
  // Next.js writes the root URL without its trailing slash; both are the same URL
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).href).toBe(`${BASE_URL}/`);
  await expect(page).toHaveTitle(getPage("/").title);
  const types = await page.locator('script[type="application/ld+json"]').evaluateAll(els =>
    els.flatMap(e => [JSON.parse(e.textContent || "null")].flat().map((n: { "@type": string }) => n["@type"])));
  expect(types).toEqual(expect.arrayContaining(["WebSite", "Organization"]));
});

test("no ad inside the drive", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("section.drive")).toHaveCount(1);
  await expect(page.locator("section.drive ins.adsbygoogle")).toHaveCount(0);
});

test("readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, javaScriptEnabled: false, viewport: { width: 412, height: 915 } });
  const page = await context.newPage();
  await page.route(/googlesyndication|googletagmanager/, r => r.abort());
  await page.goto("/");
  const headings = page.locator(".lesson h2");
  await expect(headings).toHaveCount(23);
  for (const h of await headings.all()) await expect(h).toBeVisible();
  const guides = page.locator("section.guides a");
  await expect(guides).toHaveCount(GUIDES.length);
  for (const g of await guides.all()) await expect(g).toBeVisible();
  const tips = page.locator(".info");
  await expect(tips).toHaveCount(Object.keys(POSITION_TIPS).length);
  for (const tip of await tips.all()) await expect(tip).toBeHidden();
  const players = page.locator("button.pl");
  await expect(players).toHaveCount(22);
  for (const p of await players.all()) await expect(p).toBeHidden();
  await context.close();
});

test("rails and the in-page ad on the homepage", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto("/");
  await expect(page.locator(".rail.left")).toBeVisible();
  await expect(page.locator(".rail.right")).toBeVisible();
  await expect(page.locator(".ad-inPage ins")).toHaveCount(1);
});
