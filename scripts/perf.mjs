// Scrolls the homepage drive top to bottom on a phone-sized, CPU-throttled Chrome and reports frame timing.
// Ad and analytics scripts are blocked, so the numbers measure the drive alone.
// usage: node scripts/perf.mjs <url> [cpuRate]   e.g. node scripts/perf.mjs "http://localhost:8787/#check" 4  (the #check hash installs window.__drive)
// Serve the build first: npm run build, then npm run preview (http://localhost:8787)
// Headless Chrome runs uncapped (about 6.7ms a frame), so the frame p95 mostly measures this harness; the main-thread
// ms per second, scrolling against idle, are the real signal. Exits 1 if a threshold fails.
import { spawn } from "node:child_process";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2], rate = Number(process.argv[3] || 4), port = 9300 + Math.floor(Math.random() * 500);
const SYSTEM_CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
// fall back to Playwright's bundled Chromium when system Chrome is not at the usual path
const chromePath = existsSync(SYSTEM_CHROME) ? SYSTEM_CHROME : (await import("@playwright/test")).chromium.executablePath();
const chrome = spawn(chromePath, [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "perf-"))}`,
  "--no-first-run", "--window-size=412,915", "about:blank"], { stdio: "ignore" });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === "page"); } catch { await sleep(200); }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Page.enable"); await send("Performance.enable"); await send("Network.enable");
await send("Network.setBlockedURLs", { urls: ["*googlesyndication*", "*googletagmanager*", "*google-analytics*", "*fundingchoices*", "*doubleclick*"] });
await send("Emulation.setDeviceMetricsOverride", { width: 412, height: 915, deviceScaleFactor: 2.625, mobile: true });
await send("Emulation.setCPUThrottlingRate", { rate });
// the OS may ask for reduced motion (Windows with animations off does), which keeps the ball still; measure the full motion
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
await send("Page.navigate", { url });
await sleep(3000);

const metrics = async () => Object.fromEntries((await send("Performance.getMetrics")).result.metrics.map(m => [m.name, m.value]));
// phase 1: scroll the drive for 10 s with a rAF loop, recording every frame gap
const before = await metrics();
const res = await send("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression: `new Promise(done => {
  const vp = document.scrollingElement, max = vp.scrollHeight - innerHeight, gaps = [], D = window.__drive; let top = 0;
  let t0 = null, prev = null;
  function f(t) {
    if (t0 === null) t0 = t;
    if (prev !== null) gaps.push(t - prev);
    prev = t;
    const e = t - t0;
    if (D) top = Math.max(top, D.state().lesson);
    if (e < 10000) { vp.scrollTop = max * (.5 - .5 * Math.cos(Math.PI * e / 10000)); requestAnimationFrame(f); }
    else done({ gaps, scrolled: Math.round(vp.scrollTop), of: Math.round(max), lesson: D ? top : null });
  }
  requestAnimationFrame(f);
})` });
const afterScroll = await metrics();
if (!res.result?.result?.value) { console.log(JSON.stringify(res).slice(0, 800)); ws.close(); chrome.kill(); process.exit(1); }
const { gaps, scrolled, of, lesson } = res.result.result.value;
// phase 2: park the drive on screen mid-way and leave the page alone for 4 s. No rAF loop of ours runs, so what the
// main thread spends here is what the page itself costs while idle.
await send("Runtime.evaluate", { expression: "document.scrollingElement.scrollTop = (document.scrollingElement.scrollHeight - innerHeight) * .3" });
await sleep(1000);
const idleStart = await metrics();
await sleep(4000);
const idleEnd = await metrics();

if (lesson !== 22) console.error(`warning: the last lesson reached was ${lesson}, not 22 (is the url .../#check?), so this run didn't measure the whole drive`);
const stat = a => { const s = [...a].sort((x, y) => x - y); return {
  frames: a.length, avgMs: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1),
  p95Ms: +s[Math.floor(s.length * .95)].toFixed(1), over33ms: a.filter(g => g > 33.4).length,
  over33Pct: +(100 * a.filter(g => g > 33.4).length / a.length).toFixed(2) }; };
const ms = (x, y, k) => (y[k] - x[k]) * 1000;
const perSec = (x, y, k, secs) => +(ms(x, y, k) / secs).toFixed(1);
const scrollSecs = (afterScroll.Timestamp - before.Timestamp), idleSecs = (idleEnd.Timestamp - idleStart.Timestamp);
const scrolling = stat(gaps);
const mainThreadMsPerSec = {
  scrolling: { task: perSec(before, afterScroll, "TaskDuration", scrollSecs), script: perSec(before, afterScroll, "ScriptDuration", scrollSecs) },
  idle: { task: perSec(idleStart, idleEnd, "TaskDuration", idleSecs), script: perSec(idleStart, idleEnd, "ScriptDuration", idleSecs) } };
console.log(JSON.stringify({ url, cpu: `${rate}x`, scrolled: `${scrolled}/${of}`, lesson, scrolling, mainThreadMsPerSec,
  mainThreadMs: { task: +ms(before, afterScroll, "TaskDuration").toFixed(0), script: +ms(before, afterScroll, "ScriptDuration").toFixed(0),
    style: +ms(before, afterScroll, "RecalcStyleDuration").toFixed(0), layout: +ms(before, afterScroll, "LayoutDuration").toFixed(0) } }));

// Thresholds. Idle: a page that does nothing should spend well under 5 ms of main thread per second (about 0.5% of
// one core) even at the throttled rate; the scrolling figure above shows what real work costs for comparison.
const checks = [
  ["p95 frame <= 22ms", scrolling.p95Ms <= 22, `${scrolling.p95Ms}ms`],
  ["frames over 33ms <= 2%", scrolling.over33Pct <= 2, `${scrolling.over33Pct}%`],
  ["idle main thread <= 5 ms/s", mainThreadMsPerSec.idle.task <= 5, `${mainThreadMsPerSec.idle.task} ms/s (scrolling: ${mainThreadMsPerSec.scrolling.task} ms/s)`],
  ["reached lesson 22", lesson === 22, `${lesson}`]];
for (const [name, ok, v] of checks) console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${v}`);
ws.close(); chrome.kill();
process.exit(checks.every(c => c[1]) ? 0 : 1);
