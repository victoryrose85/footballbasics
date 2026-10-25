import { test, expect } from "./fixtures";
import { DEEPER, TARGET_WORDS } from "./deeper-pages";

// The copy rules, checked on what a reader sees. A site adds its own (a term it never uses, say) to SITE_RULES.
const BANNED: [string, RegExp][] = [
  ["no em dashes", /—/],
  ["no AI-isms", /\b(delve|tapestry|it'?s worth noting|game-changer|navigat(e|ing) the|whether you'?re a|dive into|unlock|in today'?s fast-paced)\b/i],
];
const SITE_RULES: [string, RegExp][] = [
  ["no other sports", /\b(soccer|rugby|basketball|baseball|hockey)\b/i],
  ["no invited-by-friends framing", /\b(invited|your friends|heading to (a|the) game)\b/i],
];

for (const path of DEEPER) test(`copy rules ${path}`, async ({ page }) => {
  await page.goto(path);
  const body = await page.locator("article.sheet-body").innerText();
  const text = `${body}\n${await page.locator("aside.back").innerText()}`;
  for (const [rule, re] of [...BANNED, ...SITE_RULES]) expect(text.match(re)?.[0], rule).toBeUndefined();
  const words = body.split(/\s+/).filter(Boolean).length;
  expect(TARGET_WORDS[path], `a TARGET_WORDS entry for ${path}`).toBeGreaterThan(0);
  expect(words, `words on ${path}`).toBeGreaterThanOrEqual(0.8 * TARGET_WORDS[path]);
});
