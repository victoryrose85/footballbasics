import { expect, test } from "vitest";
import { onTheLine, type LineupSpot } from "@/lib/diagrams/lineup";
import { DEFENSES, SPREAD } from "@/lib/diagrams/sets";

const count = (s: LineupSpot[], ps: string[]) => s.filter(p => ps.includes(p.pos)).length;

test("each defense has the linemen, linebackers and backs its name says", () => {
  const want = { "4-3": [4, 3, 4], "3-4": [3, 4, 4], nickel: [4, 2, 5], dime: [4, 1, 6] } as const;
  for (const [name, [dl, lb, db]] of Object.entries(want)) {
    const d = DEFENSES[name as keyof typeof DEFENSES];
    expect(d, name).toHaveLength(11);
    expect(count(d, ["de", "dt"]), name).toBe(dl);
    expect(count(d, ["lb"]), name).toBe(lb);
    expect(count(d, ["cb", "s"]), name).toBe(db);
    for (const p of d) expect(p.at[1], name).toBeLessThan(0);
  }
});

test("the spread has four receivers and seven on the line", () => {
  expect(count(SPREAD, ["wr"])).toBe(4);
  expect(onTheLine(SPREAD)).toHaveLength(7);
});
