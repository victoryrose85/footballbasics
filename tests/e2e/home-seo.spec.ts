import { test, expect } from "./fixtures";
import { BASE_URL, GUIDES, getPage, pageHeadline } from "../../lib/pages";

test("one H1, canonical, title and structured data", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(pageHeadline("/"));
  // Next.js writes the root URL without its trailing slash; both are the same URL
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).href).toBe(`${BASE_URL}/`);
  await expect(page).toHaveTitle(getPage("/").title);
  const types = await page.locator('script[type="application/ld+json"]').evaluateAll(els =>
    els.flatMap(e => [JSON.parse(e.textContent || "null")].flat().map((n: { "@type": string }) => n["@type"])));
  expect(types).toEqual(expect.arrayContaining(["WebSite", "Organization"]));
});

test("links to every guide in the HTML Google reads", async ({ request }) => {
  const raw = await (await request.get("/")).text();
  for (const g of GUIDES) expect(raw).toContain(`href="${g.path}"`);
});

test("readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, javaScriptEnabled: false, viewport: { width: 412, height: 915 } });
  const page = await context.newPage();
  await page.route(/googlesyndication|googletagmanager/, r => r.abort());
  await page.goto("/");
  const guides = page.locator(".block h3 a");
  await expect(guides).toHaveCount(GUIDES.length);
  for (const g of await guides.all()) await expect(g).toBeVisible();
  await context.close();
});

test("rails and the in-page ad on the homepage", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto("/");
  await expect(page.locator(".rail.left")).toBeVisible();
  await expect(page.locator(".rail.right")).toBeVisible();
  await expect(page.locator(".ad-inPage ins")).toHaveCount(1);
});
