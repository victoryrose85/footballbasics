import type { FormationId } from "./formations";
import type { MotionId } from "./motion";
import { advance, START, type Result, type Situation } from "./rules";

export type PlayId = "p5" | "p6" | "p7" | "p8" | "p9" | "p10" | "p11" | "p12" | "p13" | "p14" | "p15" | "p16"
  | "p17a" | "p17b" | "p18" | "p19" | "p20" | "p21";
export interface Play { id: PlayId; formation: FormationId; motion: MotionId; result: Result }

const gain = (yards: number, more: { outOfBounds?: boolean; pass?: boolean } = {}): Result => ({ kind: "gain", yards, ...more });

// The drive, in order: spec section 3 as corrected by the rules check. Spots count from our own goal line.
export const PLAYS: Play[] = [
  { id: "p5", formation: "singleback", motion: "inside-zone", result: gain(4) },
  { id: "p6", formation: "shotgun", motion: "out-incomplete", result: { kind: "incomplete" } },
  { id: "p7", formation: "shotgun", motion: "false-start", result: { kind: "penalty", name: "false-start", on: "offense", yards: 5, from: "previous" } },
  // spot foul at opp 48
  { id: "p8", formation: "shotgun", motion: "deep-post-interference", result: { kind: "penalty", name: "defensive-pass-interference", on: "defense", yards: 0, from: "spot", spot: 52, firstDown: true } },
  // a hold at the line of scrimmage is enforced from the previous spot
  { id: "p9", formation: "i-form", motion: "power-held", result: { kind: "penalty", name: "offensive-holding", on: "offense", yards: 10, from: "previous", wiped: gain(12) } },
  { id: "p10", formation: "singleback", motion: "te-hitch", result: gain(8, { pass: true }) },
  { id: "p11", formation: "shotgun", motion: "offside-incomplete", result: { kind: "penalty", name: "defensive-offside", on: "defense", yards: 5, from: "previous", wiped: { kind: "incomplete" } } },
  { id: "p12", formation: "shotgun", motion: "slant", result: gain(9, { pass: true }) },
  { id: "p13", formation: "singleback", motion: "play-action-sack", result: gain(-7, { pass: true }) }, // the sack
  { id: "p14", formation: "shotgun", motion: "roughed-passer", result: { kind: "penalty", name: "roughing-the-passer", on: "defense", yards: 15, from: "previous", firstDown: true, wiped: { kind: "incomplete" } } },
  { id: "p15", formation: "i-form", motion: "toss-out-of-bounds", result: gain(5, { outOfBounds: true }) },
  { id: "p16", formation: "singleback", motion: "delay-of-game", result: { kind: "penalty", name: "delay-of-game", on: "offense", yards: 5, from: "previous" } },
  { id: "p17a", formation: "shotgun", motion: "te-stick", result: gain(6, { pass: true }) },
  { id: "p17b", formation: "shotgun", motion: "quick-out", result: gain(3, { pass: true }) },
  { id: "p18", formation: "heavy", motion: "qb-sneak", result: gain(2) }, // the quarterback sneak on 4th & 1
  { id: "p19", formation: "singleback", motion: "dig", result: gain(11, { pass: true }) },
  { id: "p20", formation: "goal-line", motion: "goal-line-dive", result: gain(3) },
  { id: "p21", formation: "goal-line", motion: "play-action-touchdown", result: gain(3, { pass: true }) }, // the touchdown catch
];

// Folds advance() over the plays from the kickoff spot
export function situations(): { before: Situation; after: Situation | "touchdown" }[] {
  let cur: Situation = START;
  return PLAYS.map((p) => {
    const before = cur;
    const after = advance(before, p.result);
    if (after !== "touchdown") cur = after;
    return { before, after };
  });
}
