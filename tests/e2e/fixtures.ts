import { test as base, expect } from "@playwright/test";

// Ad, analytics and consent scripts never load in tests: they need the live domain and would make runs flaky.
const THIRD_PARTY = /googlesyndication|googletagmanager|google-analytics|fundingchoices|doubleclick/;

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(THIRD_PARTY, route => route.abort());
    await use(page);
  },
});
export { expect };
