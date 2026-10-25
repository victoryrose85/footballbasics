import { describe, expect, test } from "vitest";
import { BASE_URL, GUIDES, PAGES, getPage, pageHeadline, formatUpdated } from "@/lib/pages";
import { SITE } from "@/site.config";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("page registry", () => {
  test("has the homepage, About, the privacy policy and at least one guide", () => {
    expect(getPage("/").kind).toBe("home");
    expect(getPage("/about").kind).toBe("site");
    expect(getPage("/privacy-policy").kind).toBe("site");
    expect(GUIDES.length).toBeGreaterThan(0);
  });
  test("lists each path once, and every date is a real day", () => {
    expect(new Set(PAGES.map(p => p.path)).size).toBe(PAGES.length);
    for (const p of PAGES) {
      expect(p.updated, p.path).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${p.updated}T00:00:00Z`).toISOString().slice(0, 10), p.path).toBe(p.updated);
    }
  });
  test("titles fit in a search result and end in the brand", () => {
    for (const p of PAGES) {
      expect(p.title.length, p.path).toBeLessThanOrEqual(65);
      if (!p.title.includes(SITE.name)) expect(p.title.endsWith(SITE.titleSuffix), p.path).toBe(true);
    }
  });
  test("descriptions fit in a search result", () => {
    for (const p of PAGES) {
      expect(p.description.length, p.path).toBeGreaterThanOrEqual(50);
      expect(p.description.length, p.path).toBeLessThanOrEqual(160);
    }
  });
  test("throws on an unknown path", () => {
    expect(() => getPage("/nope")).toThrow();
  });
  test("pageHeadline drops the brand suffix and leaves other titles alone", () => {
    const guide = GUIDES[0];
    expect(pageHeadline(guide.path)).toBe(guide.title.slice(0, -SITE.titleSuffix.length));
    expect(pageHeadline("/about")).toBe(getPage("/about").title);
  });
  test("formatUpdated writes the date out in UTC", () => {
    expect(formatUpdated("2026-10-24")).toBe("October 24, 2026");
    expect(formatUpdated("2027-01-01")).toBe("January 1, 2027");
  });
});

describe("sitemap", () => {
  test("has one absolute entry per page, dated from the registry, with no changefreq or priority", () => {
    const entries = sitemap();
    expect(entries.length).toBe(PAGES.length);
    entries.forEach((e, i) => {
      expect(e.url).toBe(`${BASE_URL}${PAGES[i].path}`);
      expect(e.lastModified).toBe(PAGES[i].updated);
      expect(e).not.toHaveProperty("changeFrequency");
      expect(e).not.toHaveProperty("priority");
    });
  });
});

describe("robots", () => {
  test("allows everything and points at the sitemap", () => {
    const r = robots();
    expect(r.sitemap).toBe(`${SITE.url}/sitemap.xml`);
    const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rules.allow).toBe("/");
  });
});
