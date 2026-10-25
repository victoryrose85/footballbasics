import { test, expect } from "./fixtures";

// Every retired URL in public/_redirects and where it goes; each is checked with and without its trailing slash.
const MOVES: [string, string][] = [
  // ["/old-page", "/new-page"],
];

for (const [from, to] of MOVES) for (const path of [from, from + "/"])
  test(`301 ${path}`, async ({ request }) => {
    const r = await request.get(path, { maxRedirects: 0 });
    expect(r.status()).toBe(301);
    expect(new URL(r.headers()["location"], "http://x").pathname).toBe(to);
  });

test("redirect targets render", async ({ page }) => {
  for (const [from, to] of MOVES) {
    const r = await page.goto(from);
    expect(r?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(to);
  }
});
