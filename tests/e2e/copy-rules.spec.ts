import { test, expect } from "./fixtures";
import { DEEPER, TARGET_WORDS } from "./deeper-pages";
import { BANNED, SITE_RULES } from "../copy-rules";

// The copy rules (tests/copy-rules.ts), checked on what a reader sees
for (const path of DEEPER) test(`copy rules ${path}`, async ({ page }) => {
  await page.goto(path);
  const body = await page.locator("article.sheet-body").innerText();
  const text = `${body}\n${await page.locator("aside.back").innerText()}`;
  for (const [rule, re] of [...BANNED, ...SITE_RULES]) expect(text.match(re)?.[0], rule).toBeUndefined();
  const words = body.split(/\s+/).filter(Boolean).length;
  expect(TARGET_WORDS[path], `a TARGET_WORDS entry for ${path}`).toBeGreaterThan(0);
  expect(words, `words on ${path}`).toBeGreaterThanOrEqual(0.8 * TARGET_WORDS[path]);
});
