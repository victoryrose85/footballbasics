// The units the homepage drive lines up in. A spot is [dx, dy] in yards from the ball: +dx toward the right
// sideline, +dy toward the offense's own end line. So the offense has dy >= 0 and the defense dy < 0.
export type SlotId = `o${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}` | `d${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`;
export type Position = "qb" | "c" | "g" | "t" | "te" | "wr" | "rb" | "fb" | "k" | "p" | "ls" | "h"
  | "dt" | "de" | "lb" | "cb" | "s" | "kr" | "pr" | "cov"; // cov: a kickoff or punt coverage player
export type FormationId = "shotgun" | "singleback" | "i-form" | "heavy" | "goal-line" | "kickoff" | "field-goal";
export interface Formation { id: FormationId; slots: Record<SlotId, { pos: Position; at: [number, number] }> }

type Spot = [Position, number, number]; // position, dx, dy

// Offense spots fill o0..o10 in order, defense spots d0..d10
function unit(id: FormationId, offense: Spot[], defense: Spot[]): Formation {
  const slots = {} as Formation["slots"];
  offense.forEach(([pos, dx, dy], i) => { slots[`o${i}` as SlotId] = { pos, at: [dx, dy] }; });
  defense.forEach(([pos, dx, dy], i) => { slots[`d${i}` as SlotId] = { pos, at: [dx, dy] }; });
  return { id, slots };
}

// Center, guards and tackles (o1..o5), each about a yard and a half apart, just behind the ball
const LINE: Spot[] = [["c", 0, 0.7], ["g", -1.4, 0.7], ["g", 1.4, 0.7], ["t", -2.8, 0.8], ["t", 2.8, 0.8]];

// A 4-3: four linemen, three linebackers, two corners, two safeties
const BASE: Spot[] = [
  ["de", -4, -1.3], ["dt", -1, -1.2], ["dt", 1.3, -1.2], ["de", 5, -1.3],
  ["lb", -4.5, -4.5], ["lb", 0, -5], ["lb", 4.5, -4.5],
  ["cb", -16, -6], ["cb", 13, -6], ["s", -6, -12], ["s", 6, -12],
];

export const FORMATIONS: Record<FormationId, Formation> = {
  // Passing downs: the quarterback 5 yards back, three receivers. The defense answers with a fifth defensive back.
  shotgun: unit("shotgun",
    [["qb", 0, 5], ...LINE, ["te", 4.2, 0.9], ["wr", -17, 0.8], ["wr", 8.5, 1.5], ["wr", 17, 1.5], ["rb", -1.6, 5]],
    [["de", -4.2, -1.3], ["dt", -1, -1.2], ["dt", 1.3, -1.2], ["de", 5.2, -1.3], ["lb", -2.5, -5], ["lb", 2.5, -5],
      ["cb", 8.5, -5], ["cb", -17, -6.5], ["cb", 17, -6.5], ["s", -7, -12], ["s", 7, -12]]),
  // Under center with one back and two tight ends: runs or passes
  singleback: unit("singleback",
    [["qb", 0, 1.9], ...LINE, ["te", 4.2, 0.9], ["wr", -16, 0.8], ["te", -5, 1.7], ["wr", 13, 1.5], ["rb", 0, 6.5]],
    BASE),
  // A fullback in front of the running back: a running formation, so a safety creeps up
  "i-form": unit("i-form",
    [["qb", 0, 1.9], ...LINE, ["te", 4.2, 0.9], ["wr", -16, 0.8], ["fb", 0, 4.2], ["wr", 15, 1.5], ["rb", 0, 6.8]],
    [...BASE.slice(0, 8), ["cb", 15, -6], ["s", -5, -9], ["s", 6, -12]]),
  // Short yardage: three tight ends and two backs against five linemen and a crowded box
  heavy: unit("heavy",
    [["qb", 0, 1.9], ...LINE, ["te", 4.2, 0.9], ["te", -4.2, 0.9], ["te", 5.8, 1.9], ["fb", 0, 4.2], ["rb", 0, 6.5]],
    [["de", -5.4, -1.3], ["dt", -2.4, -1.2], ["dt", 0, -1.2], ["dt", 2.4, -1.2], ["de", 5.4, -1.3],
      ["lb", -3.2, -3.6], ["lb", 0, -4], ["lb", 3.2, -3.6], ["cb", -8, -3.5], ["cb", 8, -3.5], ["s", 0, -8]]),
  // At the goal line: two tight ends, a receiver in tight, two backs. The defense has no room to play deep.
  "goal-line": unit("goal-line",
    [["qb", 0, 1.9], ...LINE, ["te", 4.2, 0.9], ["te", -4.2, 0.9], ["wr", -9, 1.5], ["fb", 0, 4.2], ["rb", 0, 6.5]],
    [["de", -5.4, -1.3], ["dt", -1.1, -1.2], ["dt", 1.3, -1.2], ["de", 5.4, -1.3],
      ["lb", -3, -3.2], ["lb", 0.2, -3.5], ["lb", 3.2, -3.2], ["cb", -9, -2.5], ["cb", 7, -4], ["s", -3, -7], ["s", 4, -7]]),
  // The 2026 kickoff (rules check, row 2), with the defense kicking from its own 35. Ten coverage players
  // stand on the receivers' 40, 25 yards in front of the ball; nine receivers fill the setup zone (their 30 to
  // their 35), five of them on the 35; two returners wait in the landing zone and the end zone.
  kickoff: unit("kickoff",
    [["kr", 0, 69], ["te", 0, 30.5], ["fb", -10, 30.5], ["te", 10, 30.5], ["wr", -20, 30.5], ["wr", 20, 30.5],
      ["rb", -15, 34], ["fb", -5, 34], ["te", 5, 34], ["rb", 15, 34], ["kr", 6, 60]],
    [["k", -1, -6], ...[-22, -17.6, -13.2, -8.8, -4.4, 4.4, 8.8, 13.2, 17.6, 22].map((dx): Spot => ["cov", dx, 24.5])]),
  // Field goals and the extra point: snapper, guards, tackles and tight ends on the line, two wings, the holder
  // 7 yards back and the kicker behind him. The defense packs the line to block it.
  "field-goal": unit("field-goal",
    [["h", 0, 7], ["ls", 0, 0.7], ["g", -1.4, 0.7], ["g", 1.4, 0.7], ["t", -2.8, 0.8], ["t", 2.8, 0.8],
      ["te", 4.2, 0.9], ["te", -4.2, 0.9], ["te", 5.3, 1.9], ["te", -5.3, 1.9], ["k", -2.2, 9.5]],
    [["de", -5, -1.3], ["dt", -2.1, -1.2], ["dt", -0.7, -1.2], ["dt", 0.7, -1.2], ["dt", 2.1, -1.2], ["de", 5, -1.3],
      ["cb", -7, -1.6], ["cb", 7, -1.6], ["lb", -1.6, -4], ["lb", 1.6, -4], ["s", 0, -10]]),
};

export const SLOTS = [...Array(11).keys()].flatMap((i) => [`o${i}`, `d${i}`]) as SlotId[];

// The same player on the other team: o3 <-> d3
export const otherSide = (slot: SlotId) => ((slot[0] === "o" ? "d" : "o") + slot.slice(1)) as SlotId;

// The receiving team's positions when the defense receives instead
const RETURN_SIDE: Partial<Record<Position, Position>> = { te: "lb", fb: "lb", rb: "s", wr: "cb" };

// The kickoff after the score: the offense kicks, so the sides swap and the field turns around
export const KICKOFF_AWAY: Formation = {
  id: "kickoff",
  slots: Object.fromEntries(SLOTS.map((slot) => {
    const { pos, at } = FORMATIONS.kickoff.slots[slot];
    return [otherSide(slot), { pos: slot[0] === "o" ? RETURN_SIDE[pos] ?? pos : pos, at: [at[0], -at[1]] }];
  })) as Formation["slots"],
};
