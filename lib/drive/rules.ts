// Down-and-distance arithmetic for the homepage drive. A spot is yards from our own goal line: 0 to 100,
// so 35 is "own 35", 50 is midfield and 55 is "opp 45". The offense always moves toward 100.
export type Down = 1 | 2 | 3 | 4;
export interface Situation { down: Down; spot: number; lineToGain: number } // lineToGain >= 100 means "& goal"
export type PenaltyName = "false-start" | "delay-of-game" | "defensive-offside" | "offensive-holding"
  | "defensive-pass-interference" | "roughing-the-passer";
export type Result =
  | { kind: "gain"; yards: number; outOfBounds?: boolean; pass?: boolean } // a run, a catch, a sack (negative)
  | { kind: "incomplete" }
  | { kind: "penalty"; name: PenaltyName; on: "offense" | "defense"; yards: number;
      from: "previous" | "spot"; spot?: number; firstDown?: boolean;
      wiped?: Result }; // the live-ball play the flag cancels or that happened anyway (shown, then undone)

const firstAndTen = (spot: number): Situation => ({ down: 1, spot, lineToGain: spot + 10 });

// 1st & 10 at the touchback spot: a kickoff into the end zone that doesn't touch the landing zone
export const START: Situation = firstAndTen(35);

export function advance(s: Situation, r: Result): Situation | "touchdown" {
  if (r.kind === "incomplete") return nextDown(s, s.spot);
  if (r.kind === "gain") {
    const spot = s.spot + r.yards;
    if (spot >= 100) return "touchdown";
    if (spot < 1) throw new Error("gain would end behind the goal line");
    return spot >= s.lineToGain ? firstAndTen(spot) : nextDown(s, spot);
  }
  // Half-the-distance isn't needed on this drive, so a penalty that would need it is an error.
  const spot = r.from === "spot" ? r.spot! : s.spot + (r.on === "defense" ? r.yards : -r.yards);
  if (spot < 1 || spot > 99) throw new Error("penalty would put the ball inside the 1 or behind a goal line");
  return r.firstDown ? firstAndTen(spot) : { ...s, spot }; // otherwise the down is replayed
}

function nextDown(s: Situation, spot: number): Situation {
  if (s.down === 4) throw new Error("turnover on downs");
  return { down: (s.down + 1) as Down, spot, lineToGain: s.lineToGain };
}

const ORDINAL = ["", "1st", "2nd", "3rd", "4th"];

export function downTag(s: Situation): string {
  return `${ORDINAL[s.down]} & ${s.lineToGain >= 100 ? "goal" : s.lineToGain - s.spot}`;
}

export function spotLabel(spot: number): string {
  return spot === 50 ? "50" : spot < 50 ? `own ${spot}` : `opp ${100 - spot}`;
}
