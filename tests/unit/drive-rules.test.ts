import { describe, expect, it } from "vitest";
import { advance, downTag, spotLabel, START } from "@/lib/drive/rules";
import { PLAYS, situations } from "@/lib/drive/plays";

// Spec section 3, as corrected by the rules check: [before tag, before spot, after tag, after spot]
const TABLE = [
  ["1st & 10", "own 35", "2nd & 6", "own 39"], ["2nd & 6", "own 39", "3rd & 6", "own 39"],
  ["3rd & 6", "own 39", "3rd & 11", "own 34"], ["3rd & 11", "own 34", "1st & 10", "opp 48"],
  ["1st & 10", "opp 48", "1st & 20", "own 42"], ["1st & 20", "own 42", "2nd & 12", "50"],
  ["2nd & 12", "50", "2nd & 7", "opp 45"], ["2nd & 7", "opp 45", "1st & 10", "opp 36"],
  ["1st & 10", "opp 36", "2nd & 17", "opp 43"], ["2nd & 17", "opp 43", "1st & 10", "opp 28"],
  ["1st & 10", "opp 28", "2nd & 5", "opp 23"], ["2nd & 5", "opp 23", "2nd & 10", "opp 28"],
  ["2nd & 10", "opp 28", "3rd & 4", "opp 22"], ["3rd & 4", "opp 22", "4th & 1", "opp 19"],
  ["4th & 1", "opp 19", "1st & 10", "opp 17"], ["1st & 10", "opp 17", "1st & goal", "opp 6"],
  ["1st & goal", "opp 6", "2nd & goal", "opp 3"], ["2nd & goal", "opp 3", "touchdown", ""],
];

const label = (s: ReturnType<typeof situations>[number]["before"] | "touchdown") =>
  s === "touchdown" ? ["touchdown", ""] : [downTag(s), spotLabel(s.spot)];

describe("the drive", () => {
  const sits = situations();
  it("has 18 plays", () => {
    expect(PLAYS).toHaveLength(18);
    expect(sits).toHaveLength(18);
  });
  it("starts at the touchback spot", () => {
    expect(sits[0].before).toEqual(START);
    expect(label(START)).toEqual(["1st & 10", "own 35"]);
  });
  it.each(TABLE.map((row, i) => [i, row] as const))("play %i matches the spec table", (i, row) => {
    expect([...label(sits[i].before), ...label(sits[i].after)]).toEqual(row);
  });
  it("chains each after into the next before", () => {
    for (let i = 0; i < sits.length - 1; i++) expect(sits[i].after).toEqual(sits[i + 1].before);
    expect(sits[17].after).toBe("touchdown");
  });
});

describe("labels", () => {
  it("names spots", () => {
    expect(spotLabel(50)).toBe("50");
    expect(spotLabel(1)).toBe("own 1");
    expect(spotLabel(99)).toBe("opp 1");
    expect(spotLabel(39)).toBe("own 39");
    expect(spotLabel(55)).toBe("opp 45");
  });
  it("says goal when the line to gain is the goal line", () => {
    expect(downTag({ down: 1, spot: 94, lineToGain: 104 })).toBe("1st & goal");
  });
});

describe("advance", () => {
  it("throws when a penalty would put the ball behind the goal line", () => {
    const r = { kind: "penalty", name: "false-start", on: "offense", yards: 5, from: "previous" } as const;
    expect(() => advance({ down: 1, spot: 3, lineToGain: 13 }, r)).toThrow();
  });
  it("throws on a turnover on downs", () => {
    expect(() => advance({ down: 4, spot: 50, lineToGain: 60 }, { kind: "gain", yards: 3 })).toThrow("turnover on downs");
    expect(() => advance({ down: 4, spot: 50, lineToGain: 60 }, { kind: "incomplete" })).toThrow("turnover on downs");
  });
  it("scores on a gain that reaches the goal line", () => {
    expect(advance({ down: 3, spot: 97, lineToGain: 100 }, { kind: "gain", yards: 3 })).toBe("touchdown");
  });
});
