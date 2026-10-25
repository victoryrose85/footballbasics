import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { AD_SLOTS } from "../../lib/ads";
import { GUIDES } from "../../lib/pages";

// Any guide carries all four units.
const GUIDE = GUIDES[0].path;

test("consent defaults reach the dataLayer as denied before anything else", async ({ page }) => {
  await page.goto(GUIDE);
  const consent = await page.evaluate(() => {
    const entries = ((window as unknown as { dataLayer: unknown[][] }).dataLayer || []).map(e => Array.from(e as ArrayLike<unknown>));
    return entries.find(e => e[0] === "consent");
  });
  expect(consent?.[1]).toBe("default");
  expect((consent?.[2] as Record<string, string>).analytics_storage).toBe("denied");
});

test("every ad uses a real slot and reserves its height before it loads", async ({ page }) => {
  await page.goto(GUIDE);
  const ads = page.locator("ins.adsbygoogle");
  expect(await ads.count()).toBeGreaterThan(0);
  const real = Object.values(AD_SLOTS) as string[];
  for (const ad of await ads.all()) {
    const slot = await ad.getAttribute("data-ad-slot");
    expect(slot).toMatch(/^\d{10}$/);
    expect(real).toContain(slot);
    // a rail hidden at this width (the left rail, below 1320px) has nothing to reserve
    if (!(await ad.evaluate(el => !!el.parentElement!.closest(".rail") && getComputedStyle(el.parentElement!.closest(".rail")!).display === "none"))) {
      const wrapperHeight = await ad.evaluate(el => el.parentElement!.getBoundingClientRect().height);
      expect(wrapperHeight).toBeGreaterThanOrEqual(250);
    }
  }
});

// With AdSense blocked, window.adsbygoogle stays a plain array of the units that asked for an ad.
const requested = (page: Page) =>
  page.evaluate(() => ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).length);

test("hidden rails never ask for an ad", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 900 });
  await page.goto(GUIDE);
  await expect.poll(() => requested(page)).toBe(2); // the two in-article units
  await page.waitForTimeout(300);
  expect(await requested(page)).toBe(2);
});

test("every unit asks for an ad when all of them show", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto(GUIDE);
  await expect.poll(() => requested(page)).toBe(4);
});

test("a rail asks for its ad when the window grows wide enough to show it", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(GUIDE);
  await expect.poll(() => requested(page)).toBe(3); // no left rail yet
  await page.setViewportSize({ width: 1400, height: 900 });
  await expect.poll(() => requested(page)).toBe(4);
});
