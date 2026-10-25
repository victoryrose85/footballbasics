import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import type { DriveDebug } from "../../lib/drive/checks";
import { progress, refLine } from "../../lib/drive/scroll";

// The drive engine on the real homepage: the scroll position picks the lesson and the moment in its play, and
// every frame keeps its labels apart and inside the window. All on /#check, where the engine installs
// window.__drive (lib/drive/checks.ts).

// Task 3's table for the lessons checked here, by index: the tag before the snap and after the ball is placed
const TAGS: Record<number, [string, string]> = {
  4: ["1st & 10 · own 35", "2nd & 6 · own 39"],
  7: ["3rd & 11 · own 34", "1st & 10 · opp 48"],
  11: ["2nd & 7 · opp 45", "1st & 10 · opp 36"],
  19: ["1st & goal · opp 6", "2nd & goal · opp 3"],
};
const LAYOUT_SIZES = [[360, 640], [412, 915], [768, 1024], [1300, 900]] as const;

type State = ReturnType<DriveDebug["state"]>;
const drive = <K extends keyof DriveDebug>(page: Page, k: K) =>
  page.evaluate(key => (window.__drive![key] as () => unknown)(), k) as Promise<ReturnType<DriveDebug[K]>>;
const frames = (page: Page, n = 3) =>
  page.evaluate(n => new Promise<void>(done => { const step = (i: number) => (i ? requestAnimationFrame(() => step(i - 1)) : done()); step(n); }), n);

async function open(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  // via a blank page, so a second open really reloads (a same-URL hash navigation would not)
  await page.goto("about:blank");
  await page.goto("/#check");
  await page.waitForFunction(() => !!window.__drive);
  await page.evaluate(() => document.fonts.ready);
  await frames(page);
}

// What the engine measures, measured again in the page: lesson tops in document coordinates (offsetTop, since
// the cards are tilted and their bounding boxes are taller than they are), the window and the viewport.
async function layout(page: Page) {
  return page.evaluate(() => {
    const docTop = (el: HTMLElement) => {
      let y = el.offsetTop;
      for (let p = el.offsetParent as HTMLElement | null; p; p = p.offsetParent as HTMLElement | null) y += p.offsetTop + p.clientTop;
      return y;
    };
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".drive .lesson"));
    const last = cards[cards.length - 1];
    const win = document.querySelector<HTMLElement>(".drive .window")!;
    return {
      tops: cards.map(docTop), heights: cards.map(c => c.offsetHeight), bottom: docTop(last) + last.offsetHeight,
      vh: innerHeight, winH: win.offsetHeight, desktop: !matchMedia("(max-width: 1000px)").matches, y: scrollY,
    };
  });
}
type Layout = Awaited<ReturnType<typeof layout>>;
const ref = (m: Layout) => refLine(m.vh, m.winH, m.desktop);

// Scroll so that lesson i is at moment t of its stretch
async function goTo(page: Page, i: number, t: number) {
  const m = await layout(page);
  const end = i + 1 < m.tops.length ? m.tops[i + 1] : m.bottom;
  const y = Math.round(m.tops[i] + t * (end - m.tops[i]) - ref(m));
  await page.evaluate(y => scrollTo(0, y), y);
  await frames(page);
  expect(await page.evaluate(() => scrollY), `lesson ${i} at ${t} can be scrolled to`).toBe(y);
  return y;
}

// How much of lesson i's card shows between the window's bottom edge and the screen's
const visible = (page: Page, i: number) => page.evaluate(i => {
  const card = document.querySelectorAll<HTMLElement>(".drive .lesson")[i];
  let top = card.offsetTop;
  for (let p = card.offsetParent as HTMLElement | null; p; p = p.offsetParent as HTMLElement | null) top += p.offsetTop + p.clientTop;
  top -= scrollY;
  const under = document.querySelector(".drive .window")!.getBoundingClientRect().bottom;
  return { shown: Math.min(top + card.offsetHeight, innerHeight) - Math.max(top, under), height: card.offsetHeight };
}, i);

const sameMoment = (a: State, b: State, what: string) => {
  expect({ ...b, t: undefined, ball: undefined }, what).toEqual({ ...a, t: undefined, ball: undefined });
  expect(b.t, what).toBeCloseTo(a.t, 6);
  expect(b.ball[0], what).toBeCloseTo(a.ball[0], 2);
  expect(b.ball[1], what).toBeCloseTo(a.ball[1], 2);
};

test("the tag follows the drive", async ({ page }) => {
  await open(page, 412, 915);
  for (const [i, [before, after]] of Object.entries(TAGS).map(([i, tags]) => [+i, tags] as const)) {
    await goTo(page, i, 0.1);
    expect((await drive(page, "state")).lesson).toBe(i);
    expect((await page.locator(".dtag").textContent())!.toLowerCase(), `lesson ${i + 1} before the snap`).toBe(before.toLowerCase());
    await goTo(page, i, 0.95);
    expect((await drive(page, "state")).tag.toLowerCase(), `lesson ${i + 1} once the ball is placed`).toBe(after.toLowerCase());
    expect((await page.locator(".dtag").textContent())!.toLowerCase()).toBe(after.toLowerCase());
  }
});

test("scroll is the only clock", async ({ page }) => {
  await open(page, 412, 915);
  const y = await goTo(page, 8, 0.5);
  const first = await drive(page, "state");
  expect(first.lesson).toBe(8);

  // Chromium puts the scroll back where it was. It does so by its scroll anchor, before the web fonts arrive, so
  // the swap can leave it a pixel off; at the very same scroll position, the reloaded page shows the same moment.
  await page.reload();
  await page.waitForFunction(() => !!window.__drive);
  await page.evaluate(() => document.fonts.ready);
  await frames(page);
  const restored = await page.evaluate(() => scrollY);
  expect(Math.abs(restored - y)).toBeLessThanOrEqual(2);
  const back = await drive(page, "state");
  expect(back.lesson).toBe(first.lesson);
  expect(back.tag).toBe(first.tag);
  await page.evaluate(y => scrollTo(0, y), y);
  await frames(page);
  sameMoment(first, await drive(page, "state"), "after a reload");

  for (const [bottom, label] of [[true, "from below"], [false, "from above"]] as const) {
    await page.evaluate(bottom => scrollTo(0, bottom ? document.documentElement.scrollHeight : 0), bottom);
    await frames(page);
    await page.evaluate(y => scrollTo(0, y), y);
    await frames(page);
    sameMoment(first, await drive(page, "state"), label);
  }
});

for (const [width, height] of LAYOUT_SIZES) {
  test(`layout checks at ${width}×${height}`, async ({ page }) => {
    await open(page, width, height);
    const problems: string[] = [];
    for (let i = 0; i < 23; i++) {
      for (const t of [0.1, 0.3, 0.5, 0.7, 0.9]) {
        await goTo(page, i, t);
        const c = await page.evaluate(() => {
          const d = window.__drive!;
          return { overlap: d.checkOverlap(), edges: d.checkEdges(), labels: d.labels(),
            wide: document.documentElement.scrollWidth > innerWidth };
        });
        const at = `lesson ${i + 1} at ${t}:`;
        for (const o of c.overlap) problems.push(`${at} overlap ${o}`);
        for (const e of c.edges) problems.push(`${at} edge ${e}`);
        if (c.labels > 2) problems.push(`${at} ${c.labels} labels`);
        if (c.wide) problems.push(`${at} the page scrolls sideways`);
      }
    }
    expect(problems).toEqual([]);
  });
}

test("readable on a small phone", async ({ page }) => {
  await open(page, 360, 640);
  for (let i = 0; i < 23; i++) {
    await goTo(page, i, 0.5);
    const v = await visible(page, i);
    expect(v.shown, `lesson ${i + 1}`).toBeGreaterThanOrEqual(Math.min(340, v.height));
  }
});

test("landscape phone stays readable", async ({ page }) => {
  await open(page, 915, 412);
  const winH = await page.locator(".drive .window").evaluate(el => (el as HTMLElement).offsetHeight);
  expect(winH).toBeLessThanOrEqual(0.45 * 412);
  for (let i = 0; i < 23; i++) {
    await goTo(page, i, 0.5);
    const v = await visible(page, i);
    expect(v.shown, `lesson ${i + 1}`).toBeGreaterThanOrEqual(Math.min(200, v.height));
  }
});

test("the engine rests while the drive is off screen", async ({ page }) => {
  await open(page, 1300, 900);
  await goTo(page, 3, 0.5);
  await expect.poll(() => drive(page, "running")).toBe(true);
  await page.evaluate(() => scrollTo(0, document.querySelector<HTMLElement>(".guides")!.getBoundingClientRect().top + scrollY));
  await expect.poll(() => drive(page, "running"), { timeout: 1000 }).toBe(false);
});

test("late fonts re-measure", async ({ page }) => {
  await page.route("**/*.woff2", r => setTimeout(() => r.continue(), 1500));
  await open(page, 412, 915);
  await goTo(page, 11, 0.1);
  const s = await drive(page, "state");
  expect(s.lesson).toBe(11);
  expect(s.tag.toLowerCase()).toBe(TAGS[11][0].toLowerCase());
});

test("resize mid-play", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await open(page, 412, 915);
  const m = await layout(page);
  const y = Math.round(m.tops[7] + 0.5 * (m.tops[8] - m.tops[7]) - ref(m));
  await page.evaluate(y => scrollTo({ top: y, behavior: "smooth" }), y);
  await page.waitForTimeout(100);
  await page.setViewportSize({ width: 1300, height: 900 });
  await frames(page, 2);
  // the smooth scroll may still be running: once it stops, the pose is the one for wherever it stopped
  await page.waitForFunction(() => new Promise(done => {
    const y0 = scrollY;
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => done(scrollY === y0))));
  }));
  await frames(page, 2);
  const after = await layout(page);
  const want = progress(after.y + ref(after), after.tops, after.bottom);
  const s = await drive(page, "state");
  expect(s.lesson).toBe(want.lesson);
  expect(s.t).toBeCloseTo(want.t, 4);
  expect(await drive(page, "checkOverlap")).toEqual([]);
  expect(await drive(page, "checkEdges")).toEqual([]);
  expect(await drive(page, "labels")).toBeLessThanOrEqual(2);
  expect(errors).toEqual([]);
});
