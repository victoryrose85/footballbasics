import { describe, expect, test } from "vitest";
import { SITE } from "@/site.config";

// The shapes site.config.ts has to keep. Placeholders pass here; `npm run check` is what catches them.
describe("site config", () => {
  test("url is an https origin with no www and no trailing slash", () => {
    const url = new URL(SITE.url);
    expect(url.protocol).toBe("https:");
    expect(url.hostname.startsWith("www.")).toBe(false);
    expect(SITE.url).toBe(url.origin);
  });

  test("the title suffix is ' | Brand'", () => {
    expect(SITE.titleSuffix).toMatch(/^ \| \S/);
  });

  test("the AdSense and Analytics IDs have Google's shapes", () => {
    expect(SITE.adClient).toMatch(/^ca-pub-\d{16}$/);
    for (const slot of Object.values(SITE.adSlots)) expect(slot).toMatch(/^\d{10}$/);
    expect(SITE.gaId).toMatch(/^G-[A-Z0-9]{10}$/);
  });

  test("every color is a hex code", () => {
    for (const [name, value] of Object.entries(SITE.colors)) expect(value, name).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
