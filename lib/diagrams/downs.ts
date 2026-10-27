import { advance, downTag, spotLabel, type Result, type Situation } from "@/lib/drive/rules";

// The downs guide's "From one play to the next" table. Each row runs through the drive's own arithmetic, so the
// table can't disagree with the homepage.
const EXAMPLES: { before: Situation; play: string; result: Result }[] = [
  { before: { down: 1, spot: 25, lineToGain: 35 }, play: "A 4-yard run", result: { kind: "gain", yards: 4 } },
  { before: { down: 2, spot: 29, lineToGain: 35 }, play: "An incomplete pass", result: { kind: "incomplete" } },
  { before: { down: 3, spot: 29, lineToGain: 35 }, play: "A sack for a loss of 7", result: { kind: "gain", yards: -7 } },
  { before: { down: 1, spot: 25, lineToGain: 35 }, play: "A 12-yard catch", result: { kind: "gain", yards: 12, pass: true } },
  { before: { down: 1, spot: 92, lineToGain: 100 }, play: "A 3-yard run", result: { kind: "gain", yards: 3 } },
];

const describe = (s: Situation) => `${downTag(s)}, ${spotLabel(s.spot)}`;

export function countExamples(): { before: string; play: string; after: string }[] {
  return EXAMPLES.map(({ before, play, result }) => {
    const after = advance(before, result);
    return { before: describe(before), play, after: after === "touchdown" ? "Touchdown" : describe(after) };
  });
}
