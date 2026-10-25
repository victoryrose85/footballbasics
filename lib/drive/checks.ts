// The drive's layout checks, for the automated tests: names over other names or other players' dots, and names or
// the tag past the window's edges. Installed as window.__drive on /#check only.

export interface DriveDebug {
  state(): { lesson: number; t: number; tag: string; ball: [number, number]; los: number; firstDown: number | null };
  labels(): number;
  checkOverlap(): string[];
  checkEdges(): string[];
  running(): boolean;
}

declare global { interface Window { __drive?: DriveDebug } }

const AIR = 0.5; // boxes that only touch don't overlap

type Rect = { left: number; top: number; right: number; bottom: number };
const hit = (a: Rect, b: Rect) =>
  Math.min(a.right, b.right) - Math.max(a.left, b.left) > AIR && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > AIR;

// The checks that read the page itself; the engine adds state() and running()
function layoutChecks(root: HTMLElement): Pick<DriveDebug, "labels" | "checkOverlap" | "checkEdges"> {
  const players = () => Array.from(root.querySelectorAll<HTMLElement>("button.pl"))
    .filter((el) => parseFloat(getComputedStyle(el).opacity) > 0);
  const named = () => players().filter((el) => el.classList.contains("lab"));
  const who = (el: HTMLElement) => `${el.dataset.slot} ${el.querySelector(".nm")?.textContent ?? ""}`.trim();
  const box = (el: HTMLElement, sel: string) => el.querySelector(sel)!.getBoundingClientRect();
  return {
    labels: () => named().length,
    checkOverlap() {
      const all = players(), names = named(), out: string[] = [];
      for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
          if (hit(box(names[i], ".nm"), box(names[j], ".nm"))) out.push(`${who(names[i])} <> ${who(names[j])}`);
        }
        for (const p of all) {
          if (p !== names[i] && hit(box(names[i], ".nm"), box(p, ".dot"))) out.push(`${who(names[i])} over ${who(p)}'s dot`);
        }
      }
      return out;
    },
    checkEdges() {
      const win = root.querySelector<HTMLElement>(".window")!;
      const r = win.getBoundingClientRect();
      const left = r.left + win.clientLeft, top = r.top + win.clientTop;
      const inner = { left, top, right: left + win.clientWidth, bottom: top + win.clientHeight };
      const out: string[] = [];
      const check = (b: Rect, what: string) => {
        if (b.left < inner.left - AIR || b.right > inner.right + AIR || b.top < inner.top - AIR || b.bottom > inner.bottom + AIR) {
          out.push(`${what} ${Math.round(b.left - inner.left)}..${Math.round(b.right - inner.left)} × ${Math.round(b.top - inner.top)}..${Math.round(b.bottom - inner.top)}`);
        }
      };
      for (const p of named()) check(box(p, ".nm"), who(p));
      check(root.querySelector(".dtag")!.getBoundingClientRect(), "the tag");
      return out;
    },
  };
}

// debug: what only the engine knows (a whole DriveDebug works too; its own checks are kept)
export function installChecks(root: HTMLElement, debug: Pick<DriveDebug, "state" | "running"> & Partial<DriveDebug>): void {
  if (location.hash !== "#check") return;
  window.__drive = { ...layoutChecks(root), ...debug };
}
