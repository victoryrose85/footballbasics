import { defineConfig, devices } from "@playwright/test";

// Runs against the static build in out/, served the way Cloudflare serves it (including _redirects).
// 127.0.0.1, not localhost: on Windows localhost can resolve to ::1, where wrangler isn't listening.
// Its own port and its own server, so a preview on 8787 (npm run preview) never serves a test a stale build.
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:8792" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx wrangler dev --port 8792",
    url: "http://127.0.0.1:8792",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
