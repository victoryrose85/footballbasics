import { expect, test } from "vitest";
import { FORMATIONS } from "@/lib/drive/formations";
import { PUNT, defenseOf, lineupLayout, offenseOf, onTheLine } from "@/lib/diagrams/lineup";

test("every offense the guides draw has seven on the line (row 19)", () => {
  for (const id of ["shotgun", "singleback", "i-form", "heavy", "goal-line"] as const)
    expect(onTheLine(offenseOf(FORMATIONS[id])), id).toHaveLength(7);
  expect(onTheLine(PUNT)).toHaveLength(7);
});

test("the layout puts the offense below the line of scrimmage and the defense above it", () => {
  const l = lineupLayout([...offenseOf(FORMATIONS["i-form"]), ...defenseOf(FORMATIONS["i-form"])]);
  expect(l.dots).toHaveLength(22);
  for (const d of l.dots) expect(d.side === "o" ? d.y > l.scrimmageY : d.y < l.scrimmageY).toBe(true);
  for (const d of l.dots) { expect(d.x).toBeGreaterThan(0); expect(d.x).toBeLessThan(l.width); }
});

test("the I formation labels its quarterback, fullback and running back", () => {
  const labels = lineupLayout(offenseOf(FORMATIONS["i-form"])).dots.map(d => d.label);
  expect(labels.filter(l => ["QB", "FB", "RB"].includes(l))).toEqual(["QB", "FB", "RB"]);
});

test("wide players are drawn nearer the middle, in the same order, unless the squeeze is off", () => {
  const spots = offenseOf(FORMATIONS.shotgun);
  const xs = (squeeze: boolean) => lineupLayout(spots, { squeeze }).dots.map(d => d.x);
  const [tight, wide] = [xs(true), xs(false)];
  const order = (a: number[]) => a.map((_, i) => i).sort((i, j) => a[i] - a[j]);
  expect(order(tight)).toEqual(order(wide));
  expect(Math.max(...tight) - Math.min(...tight)).toBeLessThan(Math.max(...wide) - Math.min(...wide));
  // the line itself keeps its true spacing: a guard is 1.4 yards from the center either way
  const ppy = 12;
  expect(Math.abs(tight[1] - tight[2])).toBeCloseTo(1.4 * ppy);
});

test("the layout can reach past the players, for the kickoff's zones", () => {
  const spots = offenseOf(FORMATIONS.kickoff);
  const plain = lineupLayout(spots, { squeeze: false });
  const reach = lineupLayout(spots, { squeeze: false, reach: [-6, 75] });
  expect(reach.height).toBeGreaterThan(plain.height);
  expect(reach.yOf(75)).toBeLessThan(reach.height);
  expect(reach.yOf(0)).toBeCloseTo(reach.scrimmageY);
});
