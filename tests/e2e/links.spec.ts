import { test, expect } from "./fixtures";
import { PAGES } from "../../lib/pages";
import { SITE } from "../../site.config";

test("every internal link resolves", async ({ page, request }) => {
  const targets = new Set<string>();
  for (const { path } of PAGES) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll(as => as.map(a => a.getAttribute("href")!));
    for (const href of hrefs) targets.add(href.split("#")[0] || "/");
  }
  for (const href of targets) {
    // request() follows redirects, so a 301 that lands on a page reads as 200
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test("every jump link lands on an element", async ({ page }) => {
  for (const { path } of PAGES) {
    await page.goto(path);
    const missing = await page.locator('a[href^="#"]').evaluateAll(as => as
      .map(a => a.getAttribute("href")!.slice(1))
      .filter(id => !id || !document.getElementById(decodeURIComponent(id))));
    expect(missing, path).toEqual([]);
  }
});

// All 13 guides exist now, so anything still waiting is a mistyped path.
test("no link is waiting for a page", async ({ page }) => {
  for (const { path } of PAGES) {
    await page.goto(path);
    await expect(page.locator("[data-waiting]"), path).toHaveCount(0);
  }
});

test("a missing page gets the site's 404, with a way back and no ads", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page).toHaveTitle(`Page not found | ${SITE.name}`);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("main.sheet a[href='/']").first()).toBeVisible();
  await expect(page.locator(".foot")).toBeVisible();
  expect(await page.locator("ins.adsbygoogle").count()).toBe(0);
});

test("ads.txt names the AdSense account", async ({ request }) => {
  const res = await request.get("/ads.txt");
  expect(res.status()).toBe(200);
  expect(await res.text()).toBe(`google.com, ${SITE.adClient.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`);
});
