import { test, expect } from "./fixtures";
import { AD_SLOTS } from "../../lib/ads";
import { BASE_URL, PAGES, formatUpdated, getPage, pageHeadline } from "../../lib/pages";
import { SITE } from "../../site.config";
import { DEEPER, NO_ARTICLE } from "./deeper-pages";

const IN_ARTICLE = `ins[data-ad-slot="${AD_SLOTS.inArticle}"]`;

for (const path of DEEPER) test.describe(path, () => {
  test(`seo ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(getPage(path).title);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(pageHeadline(path));
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(BASE_URL + path);
    const crumbs = (await page.locator("nav.crumbs").innerText()).replace(/\s+/g, " ").trim();
    expect(crumbs).toBe(`Home › ${getPage(path).name}`);
    await expect(page.locator("p.updated")).toContainText(formatUpdated(getPage(path).updated));
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll(els =>
      els.flatMap(e => [JSON.parse(e.textContent || "null")].flat().map((n: { "@type": string }) => n["@type"])));
    expect(types).toContain("BreadcrumbList");
    if (NO_ARTICLE.includes(path)) expect(types).not.toContain("Article");
    else expect(types).toContain("Article");
  });

  test(`ads ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator(IN_ARTICLE)).toHaveCount(2);
    const order = await page.evaluate(sel => {
      const [first, second] = Array.from(document.querySelectorAll(sel));
      const before = (a: Element | null, b: Element | null) => !!a && !!b && !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      return {
        firstAfterLede: before(document.querySelector("div.lede"), first),
        firstBeforeH2: before(first, document.querySelector("h2")),
        secondAfterArticle: before(document.querySelector("article.sheet-body"), second) && !document.querySelector("article.sheet-body")!.contains(second),
        secondBeforeChips: before(second, document.querySelector("nav.chips")),
        heights: [first, second].map(el => el.parentElement!.getBoundingClientRect().height),
      };
    }, IN_ARTICLE);
    expect(order.firstAfterLede).toBe(true);
    expect(order.firstBeforeH2).toBe(true);
    expect(order.secondAfterArticle).toBe(true);
    expect(order.secondBeforeChips).toBe(true);
    for (const h of order.heights) expect(h).toBeGreaterThanOrEqual(250);
    await expect(page.locator(".rail.left ins")).toHaveCount(1);
    await expect(page.locator(".rail.right ins")).toHaveCount(1);
  });

  test(`rails ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto(path);
    await expect(page.locator(".rail.left")).toBeVisible();
    await expect(page.locator(".rail.right")).toBeVisible();
    expect(await page.locator(".rail.right").evaluate(el => getComputedStyle(el).position)).toBe("sticky");
    await page.setViewportSize({ width: 1300, height: 900 });
    await expect(page.locator(".rail.left")).toBeHidden();
    await page.setViewportSize({ width: 412, height: 900 });
    await expect(page.locator(".rail.left")).toBeHidden();
    await expect(page.locator(".rail.right")).toBeHidden();
  });

  test(`no sideways scroll at 360px ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });

  test(`chips ${path}`, async ({ page }) => {
    await page.goto(path);
    const hrefs = await page.locator("nav.chips a").evaluateAll(as => as.map(a => a.getAttribute("href")));
    const waiting = ((await page.locator("nav.chips").getAttribute("data-waiting")) ?? "").split(" ").filter(Boolean);
    const planned = hrefs.length + waiting.length;
    expect(planned).toBeGreaterThanOrEqual(3);
    expect(planned).toBeLessThanOrEqual(4);
    const known = PAGES.map(p => p.path);
    for (const h of hrefs) {
      expect(known).toContain(h);
      expect(h).not.toBe(path);
    }
    for (const w of waiting) expect(known).not.toContain(w);
    await expect(page.locator("aside.back a")).toHaveAttribute("href", "/");
  });

  test(`focus is visible on chips and links ${path}`, async ({ page }) => {
    await page.goto(path);
    // the first live chip, or the way back while none of this page's chips is built yet
    const link = (await page.locator("nav.chips a").count()) ? page.locator("nav.chips a").first() : page.locator("aside.back a");
    await link.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    const style = await link.evaluate(el => ({ focused: el.matches(":focus-visible"), s: getComputedStyle(el).outlineStyle, w: parseFloat(getComputedStyle(el).outlineWidth) }));
    expect(style.focused).toBe(true);
    expect(style.s).not.toBe("none");
    expect(style.w).toBeGreaterThanOrEqual(2);
  });

  test(`diagrams ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(path);
    const figures = await page.locator("figure.diagram").evaluateAll(fs => fs.map(f => ({
      svg: !!f.querySelector("svg[role=img]"),
      title: f.querySelector("svg[role=img] > title")?.textContent?.trim() ?? "",
      caption: f.querySelector("figcaption")?.textContent?.trim() ?? "",
      small: Array.from(f.querySelectorAll("svg text"))
        .map(t => ({ text: t.textContent, h: t.getBoundingClientRect().height }))
        .filter(t => t.h < 10),
    })));
    for (const [i, f] of figures.entries()) {
      expect(f.svg, `figure ${i} has an svg[role=img]`).toBe(true);
      expect(f.title, `figure ${i} title`).not.toBe("");
      expect(f.caption, `figure ${i} caption`).not.toBe("");
      expect(f.small, `figure ${i} (${f.title}): text under 10px at 360px`).toEqual([]);
    }
  });

  test(`tables ${path}`, async ({ page }) => {
    await page.goto(path);
    const tables = await page.locator("table.data").evaluateAll(ts => ts.map(t => ({
      wrapped: !!t.parentElement?.matches("div.table-wrap"),
      caption: t.querySelector("caption")?.textContent?.trim() ?? "",
    })));
    for (const [i, t] of tables.entries()) {
      expect(t.wrapped, `table ${i} is in a div.table-wrap`).toBe(true);
      expect(t.caption, `table ${i} caption`).not.toBe("");
    }
  });
});

test("penalties has 12 signal figures", async ({ page }) => {
  await page.goto("/football-penalties-explained");
  await expect(page.locator("div.signals figure.diagram")).toHaveCount(12);
});

test("positions has the offense and defense lineups", async ({ page }) => {
  await page.goto("/football-positions-explained");
  const titles = await page.locator("figure.diagram svg > title").allTextContents();
  expect(titles).toHaveLength(2);
  expect(titles[0]).toContain("offense");
  expect(titles[1]).toContain("defense");
});

test("formations has 11 lineups", async ({ page }) => {
  await page.goto("/football-formations-explained");
  await expect(page.locator("figure.diagram")).toHaveCount(11);
});

test("contact anchor", async ({ page }) => {
  await page.goto("/about#contact");
  await expect(page.locator("#contact")).toBeInViewport();
  await expect(page.locator(`#contact a[href="mailto:${SITE.contactEmail}"]`)).toHaveCount(1);
});
