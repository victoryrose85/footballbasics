// Scrolls the homepage drive top to bottom on a phone-sized, CPU-throttled Chrome and reports frame timing.
// Ad and analytics scripts are blocked, so the numbers measure the drive alone.
// usage: node scripts/perf.mjs <url> [cpuRate]   e.g. node scripts/perf.mjs "http://localhost:8787/#check" 4  (the #check hash installs window.__drive)
// Serve the build first: npx next build && npx wrangler dev --port 8787
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2], rate = Number(process.argv[3] || 4), port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
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
const before = await metrics();
// scroll the field for 10 s, then sit still for 4 s (idle cost), recording every frame gap
const res = await send("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression: `new Promise(done => {
  const vp = document.scrollingElement, max = vp.scrollHeight - innerHeight, gaps = [], idle = [], D = window.__drive; let top = 0;
  let t0 = null, prev = null;
  function f(t) {
    if (t0 === null) t0 = t;
    if (prev !== null) (t - t0 < 10000 ? gaps : idle).push(t - prev);
    prev = t;
    const e = t - t0;
    if (D) top = Math.max(top, D.state().lesson);
    if (e < 10000) vp.scrollTop = max * (.5 - .5 * Math.cos(Math.PI * e / 10000));
    if (e < 14000) requestAnimationFrame(f); else done({ gaps, idle, scrolled: Math.round(vp.scrollTop), of: Math.round(max), lesson: D ? top : null });
  }
  requestAnimationFrame(f);
})` });
const after = await metrics();
if (!res.result?.result?.value) { console.log(JSON.stringify(res).slice(0, 800)); process.exit(1); }
const { gaps, idle, scrolled, of, lesson } = res.result.result.value;
if (lesson !== 22) console.error(`warning: the last lesson reached was ${lesson}, not 22 (is the url .../#check?), so this run didn't measure the whole drive`);
const stat = a => { const s = [...a].sort((x, y) => x - y); return {
  frames: a.length, avgMs: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1),
  p95Ms: +s[Math.floor(s.length * .95)].toFixed(1), over33ms: a.filter(g => g > 33.4).length }; };
const d = k => +((after[k] - before[k]) * 1000).toFixed(0);
console.log(JSON.stringify({ url, cpu: `${rate}x`, scrolled: `${scrolled}/${of}`, lesson, scrolling: stat(gaps), idle: stat(idle),
  mainThreadMs: { task: d("TaskDuration"), script: d("ScriptDuration"), style: d("RecalcStyleDuration"), layout: d("LayoutDuration") } }));
ws.close(); chrome.kill();
process.exit(0);
