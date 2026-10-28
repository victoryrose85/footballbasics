import { FORMATIONS, type Position } from "@/lib/drive/formations";
import { defenseOf, type LineupSpot } from "./lineup";

// The formations guide's lineups that the homepage drive doesn't use. The 4-3 and the nickel are the drive's own
// defenses, so the guide and the drive agree. A spot is [dx, dy] in yards from the ball, the offense at dy >= 0.
type Spot = [Position, number, number];
const spots = (side: "o" | "d", list: Spot[]): LineupSpot[] => list.map(([pos, dx, dy]) => ({ pos, at: [dx, dy], side }));

// The drive's offensive line: center, guards and tackles
const LINE: Spot[] = [["c", 0, 0.7], ["g", -1.4, 0.7], ["g", 1.4, 0.7], ["t", -2.8, 0.8], ["t", 2.8, 0.8]];

// Shotgun with four wide receivers and one back: the two outside receivers on the line, two in the slots off it
export const SPREAD = spots("o", [
  ["qb", 0, 5], ...LINE, ["wr", -17, 0.8], ["wr", 17, 0.8], ["wr", -9, 1.5], ["wr", 9, 1.5], ["rb", 1.6, 5],
]);

export const DEFENSES: Record<"4-3" | "3-4" | "nickel" | "dime", LineupSpot[]> = {
  "4-3": defenseOf(FORMATIONS.singleback),
  // Three linemen, the nose tackle over the center, and four linebackers, the outside two up near the line
  "3-4": spots("d", [
    ["de", -3, -1.3], ["dt", 0, -1.2], ["de", 3, -1.3],
    ["lb", -5.8, -1.8], ["lb", -1.8, -4.5], ["lb", 1.8, -4.5], ["lb", 5.8, -1.8],
    ["cb", -16, -6], ["cb", 13, -6], ["s", -6, -12], ["s", 6, -12],
  ]),
  nickel: defenseOf(FORMATIONS.shotgun),
  // Six defensive backs and a single linebacker, for obvious passing downs
  dime: spots("d", [
    ["de", -4.2, -1.3], ["dt", -1, -1.2], ["dt", 1.3, -1.2], ["de", 5.2, -1.3], ["lb", 0, -5],
    ["cb", -17, -6.5], ["cb", 17, -6.5], ["cb", -8.5, -5], ["cb", 8.5, -5], ["s", -7, -12], ["s", 7, -12],
  ]),
};
