import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { POSITION_TIPS } from "../../lib/drive/tips";
import { refLine } from "../../lib/drive/scroll";

// Position tips on the drive (lib/drive/tips-ui.ts), on /#check at lesson 5 (index 4), lined up before the snap.

const frames = (page: Page, n = 3) =>
  page.evaluate(n => new Promise<void>(done => { const step = (i: number) => (i ? requestAnimationFrame(() => step(i - 1)) : done()); step(n); }), n);

async function open(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto("about:blank");
  await page.goto("/#check");
  await page.waitForFunction(() => !!window.__drive);
  await page.evaluate(() => document.fonts.ready);
  await frames(page);
}

async function goTo(page: Page, i: number, t: number) {
  const m = await page.evaluate(() => {
    const docTop = (el: HTMLElement) => {
      let y = el.offsetTop;
      for (let p = el.offsetParent as HTMLElement | null; p; p = p.offsetParent as HTMLElement | null) y += p.offsetTop + p.clientTop;
      return y;
    };
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".drive .lesson"));
    const last = cards[cards.length - 1];
    return { tops: cards.map(docTop), bottom: docTop(last) + last.offsetHeight, vh: innerHeight,
      winH: document.querySelector<HTMLElement>(".drive .window")!.offsetHeight, desktop: !matchMedia("(max-width: 1000px)").matches };
  });
  const end = i + 1 < m.tops.length ? m.tops[i + 1] : m.bottom;
  const y = Math.round(m.tops[i] + t * (end - m.tops[i]) - refLine(m.vh, m.winH, m.desktop));
  await page.evaluate(y => scrollTo(0, y), y);
  await frames(page);
}

const shownTips = (page: Page) => page.locator(".drive .info:visible");
const text = (html: string) => { const d = html.replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘").replace(/&amp;/g, "&").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”"); return d.replace(/<[^>]+>/g, ""); };
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

async function insideWindow(page: Page, sel: string) {
  const [w, t] = await Promise.all([page.locator(".drive .window").boundingBox(), page.locator(sel).boundingBox()]);
  expect(t!.x).toBeGreaterThanOrEqual(w!.x);
  expect(t!.y).toBeGreaterThanOrEqual(w!.y);
  expect(t!.x + t!.width).toBeLessThanOrEqual(w!.x + w!.width + 0.5);
  expect(t!.y + t!.height).toBeLessThanOrEqual(w!.y + w!.height + 0.5);
}

test("tips open on a tap and close on a tap elsewhere", async ({ page }) => {
  await open(page, 412, 915);
  await goTo(page, 4, 0.1);
  await page.locator('button.pl[aria-controls="tip-qb"]').first().click();
  await expect(page.locator("#tip-qb")).toBeVisible();
  await expect(page.locator("#tip-qb")).toHaveCSS("opacity", "1");
  await insideWindow(page, "#tip-qb");
  expect(norm(await page.locator("#tip-qb span").innerText())).toBe(norm(text(POSITION_TIPS.qb.html)));

  await page.locator(".drive .lesson p").nth(4).click();
  await expect(page.locator("#tip-qb")).toBeHidden();

  const def = page.locator("button.pl.d:not([aria-hidden])").first();
  const id = (await def.getAttribute("aria-controls"))!;
  await def.click();
  await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(shownTips(page)).toHaveCount(1);

  await goTo(page, 5, 0.1);
  await expect(shownTips(page)).toHaveCount(0);
});

test("a tip stays inside a small phone's window", async ({ page }) => {
  await open(page, 360, 640);
  await goTo(page, 4, 0.1);
  for (const pos of Object.keys(POSITION_TIPS)) {
    await page.evaluate(pos => { const t = document.getElementById(`tip-${pos}`)!; t.hidden = false; t.classList.add("on"); }, pos);
    await insideWindow(page, `#tip-${pos}`);
    await page.evaluate(pos => { const t = document.getElementById(`tip-${pos}`)!; t.hidden = true; t.classList.remove("on"); }, pos);
  }
});

test("a mouse hover shows a tip and leaving hides it", async ({ page }) => {
  await open(page, 1300, 900);
  await goTo(page, 4, 0.1);
  const btn = page.locator('button.pl[aria-controls="tip-qb"]').first();
  await btn.hover();
  await expect(page.locator("#tip-qb")).toBeVisible();
  await page.mouse.move(1100, 100);
  await expect(page.locator("#tip-qb")).toBeHidden();
});

test("keyboard opens and closes tips", async ({ page }) => {
  await open(page, 412, 915);
  await goTo(page, 4, 0.1);
  await page.locator("h1").evaluate(h => { h.setAttribute("tabindex", "-1"); (h as HTMLElement).focus({ preventScroll: true }); });
  let found = false;
  for (let i = 0; i < 60 && !found; i++) {
    await page.keyboard.press("Tab");
    found = await page.evaluate(() => document.activeElement?.matches("button.pl") ?? false);
  }
  expect(found, "Tab reaches a player").toBe(true);
  const focused = page.locator("button.pl:focus");
  const [w, b, op] = await Promise.all([
    page.locator(".drive .window").boundingBox(), focused.boundingBox(),
    focused.evaluate(el => parseFloat(getComputedStyle(el).opacity)),
  ]);
  expect(b!.x).toBeGreaterThanOrEqual(w!.x - 1);
  expect(b!.y).toBeGreaterThanOrEqual(w!.y - 1);
  expect(b!.x).toBeLessThanOrEqual(w!.x + w!.width);
  expect(b!.y).toBeLessThanOrEqual(w!.y + w!.height);
  expect(op).toBeGreaterThan(0);
  const id = (await focused.getAttribute("aria-controls"))!;

  await page.keyboard.press("Enter");
  await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(focused).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator(`#${id}`)).toBeHidden();
  await expect(focused).toHaveAttribute("aria-expanded", "false");
  expect(await page.evaluate(() => document.activeElement?.matches("button.pl"))).toBe(true);
});

test("switching tips never lays two panels side by side", async ({ page }) => {
  await open(page, 412, 915);
  await goTo(page, 4, 0.1);
  // open one tip, then another inside the fade (200ms), and measure at once
  const r = await page.evaluate(() => {
    const [a, b] = Array.from(document.querySelectorAll<HTMLElement>("button.pl:not([aria-hidden])")).filter((x, i, all) => all.findIndex(y => y.getAttribute("aria-controls") === x.getAttribute("aria-controls")) === i);
    a.click(); b.click();
    const box = (id: string) => document.getElementById(id)!.getBoundingClientRect();
    const win = document.querySelector(".drive .window")!.getBoundingClientRect();
    const ta = box(a.getAttribute("aria-controls")!), tb = box(b.getAttribute("aria-controls")!);
    return { win: [win.left, win.width], a: [ta.left, ta.width, ta.height], b: [tb.left, tb.width] };
  });
  expect(r.b[1], "the new panel is the full width").toBeCloseTo(r.win[1] - 16, 0);
  if (r.a[2] > 0) expect(r.a[0], "both share a left edge").toBeCloseTo(r.b[0], 0);
});

test("a panel spans the window minus 8px on a phone", async ({ page }) => {
  await open(page, 412, 915);
  await goTo(page, 4, 0.1);
  await page.locator('button.pl[aria-controls="tip-qb"]').first().click();
  const [w, t] = await Promise.all([page.locator(".drive .window").boundingBox(), page.locator("#tip-qb").boundingBox()]);
  expect(t!.x - w!.x).toBeCloseTo(8, 0);
  expect(w!.x + w!.width - (t!.x + t!.width)).toBeCloseTo(8, 0);
});

test.describe("touch", () => {
  test.use({ hasTouch: true });
  test("a tap opens a tip and a second tap on the same dot closes it", async ({ page }) => {
    await open(page, 412, 915);
    await goTo(page, 4, 0.1);
    const dot = page.locator('button.pl[aria-controls="tip-qb"]').first();
    await dot.tap();
    await expect(page.locator("#tip-qb")).toBeVisible();
    await dot.tap();
    await expect(page.locator("#tip-qb")).toBeHidden();
  });
});
