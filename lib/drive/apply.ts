import type { SlotId } from "./formations";
import { FIELD_LENGTH, WINDOW_YARDS, type Pose } from "./pose";

// Puts a pose on the server-rendered field (components/drive/Drive.tsx): the camera, the lines, the ball, the
// flag, the 22 players, their names and the down-and-distance tag. Every frame it writes transforms and opacity
// only, and it reads no layout: the engine measures, and passes in the scale and the window's height. Attributes,
// classes and text change only when a player's position, a label or the tag does.

export interface Box { x0: number; y0: number; x1: number; y1: number }
// height: the window's inner height in px. lines: whether this lesson's scene draws the blue and yellow lines.
// focus: the players the lesson is talking about right now, who get a ring. hint: whether the "tap players" hint
// follows the kicker (the first kickoff only).
export interface View { height: number; lines: boolean; focus: SlotId[]; hint: boolean }

const DOT = 7; // half a dot's 12px box, plus a pixel of air
const NAME_H = 15; // a name's line height (drive.css)
const NAME_AT: [number, number] = [10, -NAME_H / 2]; // where drive.css puts a name: right of its dot, level with it
const STRAY = 0.3; // what a pixel farther from its dot costs a name, against 10 for each square pixel over something
const ASTRAY = 40; // and what it costs when another player's dot is nearer to it than its own
const EDGE = 2; // how close a name may come to the window's edge
const SHADOW = 2; // the names' outline reaches a little past their text
const MIDDLE = 26.65; // the field's middle, where the yard numbers' layer rests (Drive.tsx)

// Where a name can go, as its top-left corner from the center of its dot (w: the name's width), which way that is,
// and how far it strays from its dot. Beside the dot (level, or a step up or down), or above or below it (centered,
// or starting or ending at the dot), and each of those a little farther out, for when a pile takes the near ones.
type Spot = { dir: [number, number]; at: (w: number) => [number, number]; far: number };
const SPOTS: Spot[] = [];
for (const out of [0, 12, 24, 36]) {
  for (const dy of [0, -8, 8, -16, 16, -24, 24]) {
    SPOTS.push({ dir: [1, 0], at: () => [NAME_AT[0] + out, NAME_AT[1] + dy], far: out + Math.abs(dy) });
    SPOTS.push({ dir: [-1, 0], at: (w) => [-NAME_AT[0] - out - w, NAME_AT[1] + dy], far: out + Math.abs(dy) });
  }
  for (const along of [0, 1, -1]) {
    const x = (w: number) => -w / 2 + along * (w / 2 - DOT);
    SPOTS.push({ dir: [0, -1], at: (w) => [x(w), -8 - NAME_H - out], far: out + 4 * Math.abs(along) });
    SPOTS.push({ dir: [0, 1], at: (w) => [x(w), 8 + out], far: out + 4 * Math.abs(along) });
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const px = (v: number) => Math.round(v * 100) / 100;
const area = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
const overflow = (b: Box, in_: Box) =>
  Math.max(0, in_.x0 - b.x0) + Math.max(0, b.x1 - in_.x1) + Math.max(0, in_.y0 - b.y0) + Math.max(0, b.y1 - in_.y1);

// The camera's y, kept far enough from the end lines that the window never shows past them (ruling R9). poseAt
// clamps for a phone's window; this clamps for the real one.
export function cameraY(cy: number, scale: number, height: number): number {
  const half = height / 2 / scale;
  return 2 * half >= FIELD_LENGTH ? FIELD_LENGTH / 2 : clamp(cy, half, FIELD_LENGTH - half);
}

// How far a point is from a box
const gap = ([x, y]: [number, number], b: Box) => Math.hypot(Math.max(b.x0 - x, 0, x - b.x1), Math.max(b.y0 - y, 0, y - b.y1));

// Where a player's name goes: inside the window, clear of the other dots and names (obstacles), close to its own
// dot, nearer to it than to anyone else's (rivals: the other dots' centers), and on the side away from the nearest
// other dot (away: a unit vector from that dot toward this one). A pure function of where everything is, so a
// scroll position always shows the same labels.
export function placeLabel(at: [number, number], w: number, obstacles: Box[], bounds: Box,
  away: [number, number] | null, rivals: [number, number][] = []): { box: Box } {
  let best = { box: bounds, score: Infinity };
  SPOTS.forEach((s, spot) => {
    const [dx, dy] = s.at(w);
    const box = { x0: at[0] + dx, y0: at[1] + dy, x1: at[0] + dx + w, y1: at[1] + dy + NAME_H };
    let score = overflow(box, bounds) * 1000 + s.far * STRAY + spot * 0.001;
    for (const o of obstacles) score += area(box, o) * 10;
    const mine = gap(at, box);
    if (rivals.some((r) => gap(r, box) < mine)) score += ASTRAY;
    if (away) score -= 5 * (s.dir[0] * away[0] + s.dir[1] * away[1]);
    if (score < best.score) best = { box, score };
  });
  // a dot right at the window's edge may leave no spot fully inside: slide the name in
  const { box } = best;
  const sx = clamp(box.x0, bounds.x0, Math.max(bounds.x0, bounds.x1 - w)) - box.x0;
  const sy = clamp(box.y0, bounds.y0, Math.max(bounds.y0, bounds.y1 - NAME_H)) - box.y0;
  return { box: { x0: box.x0 + sx, y0: box.y0 + sy, x1: box.x1 + sx, y1: box.y1 + sy } };
}

interface Player { el: HTMLElement; nm: HTMLElement; slot: SlotId; pos: string; lab: boolean; hi: boolean; shown: boolean | null }
interface Store {
  field: HTMLElement; nums: HTMLElement; los: HTMLElement; fd: HTMLElement; flag: HTMLElement; ball: HTMLElement; tag: HTMLElement;
  hint: HTMLElement; hintSize: { w: number; h: number }; focused: boolean;
  players: Player[]; titles: Map<string, string>; written: WeakMap<HTMLElement, { transform?: string; opacity?: string }>;
  text: Text | null;
}
// The text the labels are placed around: the names' widths and the tag's box, measured in measureLabels
interface Text { name: (s: string) => number; tag: (s: string) => Box }

const stores = new WeakMap<HTMLElement, Store>();
const ROUGH: Text = { name: (n) => n.length * 7, tag: () => ({ x0: 0, y0: 0, x1: 0, y1: 0 }) }; // until measured

function store(root: HTMLElement): Store {
  let s = stores.get(root);
  if (s) return s;
  const one = (sel: string) => root.querySelector<HTMLElement>(sel)!;
  const titles = new Map<string, string>();
  root.querySelectorAll<HTMLElement>(".tips .info").forEach((info) => {
    titles.set(info.id.replace(/^tip-/, ""), info.querySelector(".ih b")?.textContent ?? "");
  });
  s = {
    field: one(".field"), nums: one(".nums"), hint: one(".hint"), hintSize: { w: 170, h: 24 }, focused: false, los: one(".los"), fd: one(".fd"), flag: one(".flag"), ball: one(".ball"), tag: one(".dtag"),
    players: Array.from(root.querySelectorAll<HTMLElement>("button.pl")).map((el) => ({
      el, nm: el.querySelector<HTMLElement>(".nm")!, slot: el.dataset.slot as SlotId,
      pos: (el.getAttribute("aria-controls") ?? "").replace(/^tip-/, ""), lab: el.classList.contains("lab"), hi: false, shown: null,
    })),
    titles, written: new WeakMap(), text: null,
  };
  stores.set(root, s);
  return s;
}

// Measures the text the labels are placed around: the font the names are set in, and the tag's place and padding.
// The engine calls it whenever it re-measures (a late web font changes every width).
export function measureLabels(root: HTMLElement): void {
  const s = store(root);
  const ctx = document.createElement("canvas").getContext("2d");
  const fontOf = (el: Element) => { const c = getComputedStyle(el); return `${c.fontStyle} ${c.fontWeight} ${c.fontSize} ${c.fontFamily}`; };
  const measure = (font: string, spacing: number) => {
    const cache = new Map<string, number>();
    return (text: string) => {
      let w = cache.get(text);
      if (w === undefined) {
        if (ctx) ctx.font = font;
        w = (ctx ? ctx.measureText(text).width : text.length * 7) + spacing * text.length;
        cache.set(text, w);
      }
      return w;
    };
  };
  const name = measure(fontOf(s.players[0].nm), 0);
  const t = s.tag;
  const spacing = parseFloat(getComputedStyle(t).letterSpacing) || 0;
  const tagText = measure(fontOf(t), spacing);
  const pad = t.offsetWidth - tagText(t.textContent ?? "");
  const [x0, y0, h] = [t.offsetLeft, t.offsetTop, t.offsetHeight];
  s.hintSize = { w: s.hint.offsetWidth || s.hintSize.w, h: s.hint.offsetHeight || s.hintSize.h };
  s.text = { name: (n) => name(n) + SHADOW, tag: (text) => ({ x0, y0, x1: x0 + tagText(text) + pad, y1: y0 + h }) };
}

function write(s: Store, el: HTMLElement, prop: "transform" | "opacity", value: string) {
  let w = s.written.get(el);
  if (!w) s.written.set(el, (w = {}));
  if (w[prop] === value) return;
  w[prop] = value;
  el.style[prop] = value;
}

export function applyPose(root: HTMLElement, pose: Pose, scale: number, view: View): void {
  const s = store(root);
  const text = s.text ?? ROUGH;
  const W = WINDOW_YARDS * scale; // the window always shows WINDOW_YARDS of the field's width
  const H = view.height;
  const at = (x: number, y: number) => `translate(${px(x * scale)}px,${px(y * scale)}px)`;

  // the camera: the field slides under the window
  const ox = W / 2 - pose.camera.x * scale;
  const oy = H / 2 - cameraY(pose.camera.y, scale, H) * scale;
  write(s, s.field, "transform", `translate(${px(ox)}px,${px(oy)}px)`);
  // the yard numbers keep their place in the window as the camera moves sideways
  write(s, s.nums, "transform", `translateX(${px((pose.camera.x - MIDDLE) * scale)}px)`);

  write(s, s.los, "transform", `translateY(${px(pose.los * scale - 1.5)}px)`);
  write(s, s.los, "opacity", view.lines ? "1" : "0");
  if (pose.firstDown !== null) write(s, s.fd, "transform", `translateY(${px(pose.firstDown * scale - 2)}px)`);
  write(s, s.fd, "opacity", view.lines && pose.firstDown !== null ? "1" : "0");

  // the ball grows a little as it rises: a pass, a punt, a kick
  write(s, s.ball, "transform", `${at(pose.ball.x, pose.ball.y)} scale(${px(1 + Math.min(pose.ball.h, 16) * 0.05)})`);
  if (s.flag.hidden) s.flag.hidden = false; // from here on it shows and hides by opacity
  if (pose.flag) write(s, s.flag, "transform", `${at(pose.flag.x, pose.flag.y)} rotate(20deg)`);
  write(s, s.flag, "opacity", pose.flag ? "1" : "0");
  if (s.tag.textContent !== pose.tag) s.tag.textContent = pose.tag;

  // the players
  const inView = new Map<SlotId, [number, number]>(); // where each player you can see is in the window
  for (const p of s.players) {
    const q = pose.players[p.slot];
    write(s, p.el, "transform", at(q.x, q.y));
    write(s, p.el, "opacity", String(px(q.opacity)));
    const x = ox + q.x * scale, y = oy + q.y * scale;
    const shown = q.opacity > 0 && x > -DOT && x < W + DOT && y > -DOT && y < H + DOT;
    if (shown) inView.set(p.slot, [x, y]);
    const hi = shown && view.focus.includes(p.slot);
    if (hi !== p.hi) { p.hi = hi; p.el.classList.toggle("hi", hi); }
    if (shown !== p.shown) { // only the players you can see can be reached with Tab
      p.shown = shown;
      p.el.tabIndex = shown ? 0 : -1;
      if (shown) p.el.removeAttribute("aria-hidden");
      else p.el.setAttribute("aria-hidden", "true");
    }
    if (q.pos !== p.pos) { // the same slot plays a different position in another unit
      p.pos = q.pos;
      p.el.setAttribute("aria-controls", `tip-${q.pos}`);
      p.nm.textContent = s.titles.get(q.pos) ?? q.pos;
    }
  }

  // the (at most two) names, placed clear of everything else
  const bounds = { x0: EDGE, y0: EDGE, x1: W - EDGE, y1: H - EDGE };
  const dot = ([x, y]: [number, number]): Box => ({ x0: x - DOT, y0: y - DOT, x1: x + DOT, y1: y + DOT });
  const placed: Box[] = [text.tag(pose.tag)];
  const labeled = new Map<SlotId, Box>();
  for (const slot of pose.labels) {
    const me = inView.get(slot);
    if (!me || labeled.has(slot)) continue;
    let near: [number, number] | null = null, d = Infinity;
    const others: Box[] = [], rivals: [number, number][] = [];
    for (const [other, o] of inView) {
      if (other === slot) continue;
      others.push(dot(o));
      rivals.push(o);
      const e = Math.hypot(me[0] - o[0], me[1] - o[1]);
      if (e < d) { d = e; near = o; }
    }
    const away: [number, number] | null = near && d > 0 ? [(me[0] - near[0]) / d, (me[1] - near[1]) / d] : null;
    const { box } = placeLabel(me, text.name(s.titles.get(pose.players[slot].pos) ?? ""), [...others, ...placed], bounds, away, rivals);
    placed.push(box);
    labeled.set(slot, box);
  }
  const focused = view.focus.length > 0;
  if (focused !== s.focused) { s.focused = focused; root.classList.toggle("focus", focused); }

  // the hint follows the kicker, while there is a kicker in view
  // (only while his dot is well inside the window, so the hint never sits half cut off at an edge)
  const kicker = view.hint ? s.players.find((p) => p.pos === "k" && inView.has(p.slot)) : undefined;
  const kicked = kicker && inView.get(kicker.slot);
  const kickAt = kicked && kicked[0] > bounds.x0 + DOT && kicked[0] < bounds.x1 - DOT && kicked[1] > bounds.y0 + DOT && kicked[1] < bounds.y1 - DOT ? kicked : undefined;
  if (kickAt) {
    const { w, h } = s.hintSize;
    const air = DOT + 6;
    const tries: [number, number][] = [
      [kickAt[0] - w / 2, kickAt[1] - air - h], [kickAt[0] - w / 2, kickAt[1] + air],
      [kickAt[0] - w / 2, kickAt[1] - air - h - 28], [kickAt[0] - w / 2, kickAt[1] + air + 28],
    ];
    let best = { box: bounds, score: Infinity };
    for (const [x0, y0] of tries) {
      const top = clamp(y0, bounds.y0, Math.max(bounds.y0, bounds.y1 - h));
      const box = { x0: clamp(x0, bounds.x0, Math.max(bounds.x0, bounds.x1 - w)), y0: top, x1: 0, y1: top + h };
      box.x1 = box.x0 + w;
      let score = overflow(box, bounds) * 1000;
      for (const o of [...placed, dot(kickAt)]) score += area(box, o) * 10;
      if (score < best.score) best = { box, score };
    }
    write(s, s.hint, "transform", `translate(${px(best.box.x0)}px,${px(best.box.y0)}px)`);
  }
  write(s, s.hint, "opacity", kickAt ? "1" : "0");

  for (const p of s.players) {
    const box = labeled.get(p.slot);
    const me = inView.get(p.slot);
    write(s, p.nm, "transform", box && me ? `translate(${px(box.x0 - me[0] - NAME_AT[0])}px,${px(box.y0 - me[1] - NAME_AT[1])}px)` : "");
    if (!!box !== p.lab) { p.lab = !!box; p.el.classList.toggle("lab", p.lab); }
  }
}

