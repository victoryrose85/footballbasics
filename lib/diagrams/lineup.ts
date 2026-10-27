import type { Formation, Position, SlotId } from "@/lib/drive/formations";

// Lineup diagrams for the guides, drawn from the homepage drive's own formations (lib/drive/formations.ts), so the
// guides and the drive show the same 22 players. A spot is [dx, dy] in yards from the ball, the offense at dy >= 0.

export interface LineupSpot {
  pos: Position;
  at: [number, number];
  label?: string; // overrides POSITION_LABEL
  side?: "o" | "d"; // which team; when left out, the side of the line it stands on
}

export const POSITION_LABEL: Record<Position, string> = {
  qb: "QB", c: "C", g: "G", t: "T", te: "TE", wr: "WR", rb: "RB", fb: "FB",
  de: "DE", dt: "DT", lb: "LB", cb: "CB", s: "S",
  k: "K", p: "P", ls: "LS", h: "H", kr: "KR", pr: "PR", cov: "", blk: "",
};

const side = (f: Formation, s: "o" | "d"): LineupSpot[] =>
  [...Array(11).keys()].map(i => {
    const { pos, at } = f.slots[`${s}${i}` as SlotId];
    return { pos, at: [at[0], at[1]], side: s };
  });

export const offenseOf = (f: Formation) => side(f, "o");
export const defenseOf = (f: Formation) => side(f, "d");

// The offense's players on the line of scrimmage: the drive puts them within about a yard of the ball
export const onTheLine = (spots: LineupSpot[]) => spots.filter(s => s.at[1] >= 0 && s.at[1] < 1.2);

// Punt formation (row 54): the snapper, guards and tackles with a gunner wide on each end make the seven on the
// line; two wings just behind the ends, the personal protector, and the punter about 15 yards deep.
export const PUNT: LineupSpot[] = [
  { pos: "ls", at: [0, 0.7] },
  { pos: "g", at: [-1.4, 0.7], label: "" }, { pos: "g", at: [1.4, 0.7], label: "" },
  { pos: "t", at: [-2.8, 0.8], label: "" }, { pos: "t", at: [2.8, 0.8], label: "" },
  { pos: "wr", at: [-18, 0.8], label: "G" }, { pos: "wr", at: [18, 0.8], label: "G" },
  { pos: "te", at: [-4, 1.7], label: "" }, { pos: "te", at: [4, 1.7], label: "" },
  { pos: "fb", at: [0, 5.5], label: "PP" },
  { pos: "p", at: [0, 15] },
];

// Beyond this many yards from the ball, sideways distance is drawn at SQUEEZE of its size, so a receiver split
// out wide still fits a phone-width diagram whose labels stay readable. The line itself keeps its true spacing.
const WIDE = 6;
const SQUEEZE = 0.35;
const squeezed = (dx: number) => (Math.abs(dx) <= WIDE ? dx : Math.sign(dx) * (WIDE + (Math.abs(dx) - WIDE) * SQUEEZE));

export interface LineupLayout {
  width: number;
  height: number;
  scrimmageY: number;
  dots: { x: number; y: number; label: string; side: "o" | "d" }[];
  yOf: (dy: number) => number; // where a yard line lies, for zones and labels drawn with the players
}

export function lineupLayout(
  spots: LineupSpot[],
  opts: { pxPerYard?: number; marginYards?: number; squeeze?: boolean; reach?: number[] } = {},
): LineupLayout {
  const { pxPerYard: ppy = 12, marginYards: m = 3, squeeze = true, reach = [] } = opts;
  const xs = spots.map(s => (squeeze ? squeezed(s.at[0]) : s.at[0]));
  const ys = [...spots.map(s => s.at[1]), ...reach];
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
  const yOf = (dy: number) => (dy - minY + m) * ppy;
  return {
    width: (maxX - minX + 2 * m) * ppy,
    height: (maxY - minY + 2 * m) * ppy,
    scrimmageY: yOf(0),
    dots: spots.map((s, i) => ({
      x: (xs[i] - minX + m) * ppy,
      y: yOf(s.at[1]),
      label: s.label ?? POSITION_LABEL[s.pos],
      side: s.side ?? (s.at[1] >= 0 ? "o" : "d"),
    })),
    yOf,
  };
}
