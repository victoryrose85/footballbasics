import { expect, test } from "vitest";
import { countExamples } from "@/lib/diagrams/downs";

test("the count changes the way the rules say", () => {
  expect(countExamples().map(r => r.after)).toEqual([
    "2nd & 6, own 29",   // 1st & 10 at own 25, a 4-yard run
    "3rd & 6, own 29",   // 2nd & 6, an incomplete pass: same spot, next down
    "4th & 13, own 22",  // 3rd & 6, a 7-yard sack
    "1st & 10, own 37",  // 1st & 10 at own 25, a 12-yard catch: past the line, a new first down
    "2nd & goal, opp 5", // 1st & goal at opp 8, a 3-yard run
  ]);
});

test("each row starts where the rules put the ball", () => {
  expect(countExamples().map(r => r.before)).toEqual([
    "1st & 10, own 25", "2nd & 6, own 29", "3rd & 6, own 29", "1st & 10, own 25", "1st & goal, opp 8",
  ]);
  for (const r of countExamples()) expect(r.play.length).toBeGreaterThan(5);
});
