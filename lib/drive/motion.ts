import { FORMATIONS, SLOTS, otherSide, type Formation, type FormationId, type SlotId } from "./formations";

// What each player and the ball do during a play. t runs 0 to 1 through the play phase; spots are yards from
// the ball at the snap, as in formations.ts (+dy toward the offense's own end line, so a gain is a negative dy).
// A player with no keys stands still. Between keys, everyone moves in a straight line.
export interface Key { t: number; at: [number, number] }
export type MotionId = string;
export interface Motion {
  id: MotionId;
  moves: Partial<Record<SlotId, Key[]>>;
  // The ball starts at [0, 0]. From a key with a carrier, it moves with that player; from one without, it flies
  // in a straight line to the next key. h: height in yards.
  ball: { t: number; at: [number, number]; h?: number; carrier?: SlotId }[];
  labels: SlotId[]; // at most 2
  flag?: [number, number]; // where the official's flag lands, on a penalty
}

const lerp = (a: number, b: number, s: number) => a + (b - a) * s;

export function slotAt(f: Formation, m: Motion | null, slot: SlotId, u: number): [number, number] {
  let a: Key = { t: 0, at: f.slots[slot].at };
  for (const b of m?.moves[slot] ?? []) {
    if (u < b.t) {
      const s = (u - a.t) / (b.t - a.t);
      return [lerp(a.at[0], b.at[0], s), lerp(a.at[1], b.at[1], s)];
    }
    a = b;
  }
  return a.at;
}

export function ballAt(f: Formation, m: Motion | null, u: number): { at: [number, number]; h: number } {
  let a: Motion["ball"][number] = { t: 0, at: [0, 0], h: 0 };
  for (const b of m?.ball ?? []) {
    if (u < b.t) {
      const s = (u - a.t) / (b.t - a.t);
      const at: [number, number] = a.carrier ? slotAt(f, m, a.carrier, u) : [lerp(a.at[0], b.at[0], s), lerp(a.at[1], b.at[1], s)];
      return { at, h: lerp(a.h ?? 0, b.h ?? 0, s) };
    }
    a = b;
  }
  return { at: a.carrier ? slotAt(f, m, a.carrier, u) : a.at, h: a.h ?? 0 };
}

// Authoring shorthand. A path is [t, dx, dy] keys. A ball step may leave out its spot: a step with a carrier is
// where that player is, and a step without one (a throw, a toss, a kick) is where the last carrier had it.
type Path = [number, number, number][];
type Step = { t: number; at?: [number, number]; h?: number; carrier?: SlotId };
type Block = "run" | "pass" | "kick";
interface Spec {
  formation: FormationId;
  block?: Block; // linemen and pass rushers not in `moves` follow the usual steps
  // The ball sits on the spot until t (otherwise it's snapped at once), and nobody moves before then but the
  // early ones: a player who is offside at the snap
  snap?: { t: number; early?: SlotId[] };
  moves: Partial<Record<SlotId, Path>>;
  ball?: Step[];
  labels: SlotId[];
  flag?: [number, number];
}

// Offsets from each player's starting spot. Run blocking drives forward; pass blocking sets back as the rush comes.
const BLOCKS: Record<Block, { line: Path; rush: Path }> = {
  run: { line: [[0.15, 0, -1], [0.5, 0, -1.6]], rush: [[0.15, 0, -0.3], [0.5, 0, -0.6]] },
  pass: { line: [[0.15, 0, 0.8], [0.5, 0, 1.4]], rush: [[0.2, 0, 1.4], [0.5, 0, 1.9]] },
  kick: { line: [[0.15, 0, 0.4], [0.4, 0, 0.7]], rush: [[0.2, 0, 1], [0.4, 0, 1.4]] },
};
const BLOCKERS = new Set(["c", "g", "t", "ls", "te"]);
const RUSHERS = new Set(["dt", "de"]);

function build(id: MotionId, spec: Spec): Motion {
  const f = FORMATIONS[spec.formation];
  const keys = (path: Path, from: [number, number] = [0, 0]): Key[] =>
    path.map(([t, dx, dy]) => ({ t, at: [from[0] + dx, from[1] + dy] }));
  const moves: Motion["moves"] = {};
  if (spec.block) {
    for (const slot of SLOTS) {
      const { pos, at } = f.slots[slot];
      if (BLOCKERS.has(pos)) moves[slot] = keys(BLOCKS[spec.block].line, at);
      else if (RUSHERS.has(pos)) moves[slot] = keys(BLOCKS[spec.block].rush, at);
    }
  }
  for (const [slot, path] of Object.entries(spec.moves)) moves[slot as SlotId] = keys(path);
  const steps = [...(spec.ball ?? [])];
  if (spec.snap) {
    const { t, early = [] } = spec.snap;
    for (const [slot, ks] of Object.entries(moves) as [SlotId, Key[]][]) {
      if (early.includes(slot)) continue;
      if (ks[0].t < t) throw new Error(`${id}: ${slot} moves before the snap`);
      if (ks[0].t > t) ks.unshift({ t, at: f.slots[slot].at });
    }
    if (steps[0]?.t !== t) steps.unshift({ t, at: [0, 0], h: 0 });
  }
  const m: Motion = { id, moves, ball: [], labels: spec.labels, ...(spec.flag && { flag: spec.flag }) };
  let holder: SlotId | undefined;
  for (const step of steps) {
    const who = step.carrier ?? holder;
    const at = step.at ?? (who && slotAt(f, m, who, step.t));
    if (!at) throw new Error(`${id}: the ball step at ${step.t} has no spot`);
    m.ball.push({ ...step, at });
    holder = step.carrier;
  }
  return m;
}

// The same motion with the sides swapped and the field turned around
function mirror(id: MotionId, m: Motion): Motion {
  const flip = ([dx, dy]: [number, number]): [number, number] => [dx, -dy];
  return {
    id,
    moves: Object.fromEntries(Object.entries(m.moves).map(([slot, ks]) =>
      [otherSide(slot as SlotId), ks!.map((k) => ({ t: k.t, at: flip(k.at) }))])),
    ball: m.ball.map((b) => ({ ...b, at: flip(b.at), ...(b.carrier && { carrier: otherSide(b.carrier) }) })),
    labels: m.labels.map(otherSide),
  };
}

// The kickoff unit's spots, for the paths that every coverage player and blocker shares
const KO = FORMATIONS.kickoff.slots;
const each = (slots: SlotId[], path: (dx: number, dy: number) => Path) =>
  Object.fromEntries(slots.map((s) => [s, path(...KO[s].at)])) as Partial<Record<SlotId, Path>>;
const COVERAGE: SlotId[] = ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10"];

// The quarterback takes a shotgun snap and sets up; the back steps up to block
const GUN_SET: Path = [[0.15, 0, 6.5]];
const GUN_BACK: Path = [[0.2, -2.6, 4.2]];

const SPECS: Record<MotionId, Spec> = {
  // The defense kicks off. The returner catches it in the end zone and kneels: a touchback. The coverage may
  // not move until the ball is caught, then runs down on the blockers.
  kickoff: {
    formation: "kickoff",
    moves: {
      d0: [[0.06, -0.3, -0.8], [0.1, 0, 0.6], [0.52, 0, 12], [0.8, 0.5, 20]],
      o0: [[0.45, 0.3, 68.4]],
      o10: [[0.5, 3, 62]],
      ...each(COVERAGE, (dx, dy) => [[0.52, dx, dy], [0.8, dx * 0.7, 32]]),
      ...each(["o1", "o2", "o3", "o4", "o5", "o6", "o7", "o8", "o9"], (dx, dy) => [[0.45, dx, dy], [0.8, dx * 0.9, dy + 3.5]]),
    },
    ball: [{ t: 0.08, at: [0, 0], h: 0 }, { t: 0.3, at: [0.15, 34.2], h: 16 }, { t: 0.52, carrier: "o0", h: 1 }, { t: 0.62, carrier: "o0", h: 0 }],
    labels: ["o0", "d0"],
  },

  // Lesson 5: an inside run to the right for 4. The middle linebacker makes the tackle.
  "inside-zone": {
    formation: "singleback", block: "run",
    moves: {
      o0: [[0.06, 0.3, 2.4], [0.12, 0.6, 3], [0.3, -1, 3.8], [0.5, -2.4, 4.4]],
      o10: [[0.12, 0.8, 3.2], [0.3, 1.8, 1.2], [0.45, 2.1, -0.6], [0.55, 2.2, -2], [0.68, 2.3, -4]],
      o6: [[0.15, 4.3, -0.2], [0.5, 4.7, -1.2]],
      o8: [[0.2, -3.8, 0.4], [0.5, -3.6, -0.6]],
      o7: [[0.5, -15, -6]], o9: [[0.5, 12, -5]],
      d3: [[0.15, 5.1, -1.3], [0.5, 5.6, -2.2]],
      d4: [[0.5, -1.5, -4.5], [0.7, 0.4, -4.5]],
      d5: [[0.3, 0.8, -4.5], [0.55, 1.8, -4.4], [0.68, 2.6, -4.6]],
      d6: [[0.4, 3.8, -4.2], [0.68, 3.5, -3.6]],
      d7: [[0.5, -15.4, -6.8]], d8: [[0.5, 12.4, -6.2]],
      d9: [[0.7, -2, -9]], d10: [[0.7, 3.5, -7.5]],
    },
    ball: [{ t: 0.04, carrier: "o0", h: 1 }, { t: 0.12, carrier: "o10", h: 1 }, { t: 0.66, carrier: "o10", h: 1 }, { t: 0.72, carrier: "o10", h: 0 }],
    labels: ["o10", "d5"],
  },

  // Lesson 6: a quick out to the slot receiver, knocked away by the nickel corner
  "out-incomplete": {
    formation: "shotgun", block: "pass",
    moves: {
      o0: [[0.15, 0, 6.5], [0.4, 0.3, 6.2]],
      o8: [[0.3, 9, -5], [0.45, 12, -6], [0.56, 13.8, -6]],
      o6: [[0.3, 4.5, -4], [0.5, 3, -6.5]],
      o7: [[0.5, -16, -10]], o9: [[0.5, 18, -12]], o10: GUN_BACK,
      d6: [[0.3, 9.6, -6], [0.5, 12.6, -6.8], [0.56, 13.8, -7.1]],
      d4: [[0.4, -1.5, -6.5]], d5: [[0.5, 3.5, -7.6]],
      d7: [[0.5, -16.5, -10.8]], d8: [[0.5, 18, -12.9]],
      d9: [[0.5, -8, -15]], d10: [[0.5, 9, -13]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.42, h: 1.6 }, { t: 0.49, at: [7, 0], h: 3.5 },
      { t: 0.56, at: [13.5, -6.4], h: 1.6 }, { t: 0.66, at: [14.6, -7.8], h: 0 }],
    labels: ["o0", "o8"],
  },

  // Lesson 7: the right tackle flinches before the snap. Nobody else moves, and the ball is never snapped.
  "false-start": {
    formation: "shotgun",
    moves: { o5: [[0.12, 2.9, 0.1], [0.25, 2.85, 0.5], [0.4, 2.8, 0.8]] },
    labels: ["o5"],
    flag: [3.5, -0.3],
  },

  // Lesson 8: a deep throw to the slot receiver, who is held by the nickel corner 18 yards downfield
  "deep-post-interference": {
    formation: "shotgun", block: "pass",
    moves: {
      o0: [[0.15, 0, 7]],
      o8: [[0.2, 9, -6], [0.4, 8, -14], [0.5, 7.2, -17.6], [0.58, 6.6, -19.4]],
      o6: [[0.3, 5, -5], [0.5, 6.5, -7]],
      o7: [[0.5, -16.5, -16]], o9: [[0.5, 17.5, -16]], o10: GUN_BACK,
      d6: [[0.2, 9.2, -8], [0.4, 8.4, -14.6], [0.5, 7.8, -17.8], [0.58, 7.4, -18.6]],
      d4: [[0.4, -3, -8]], d5: [[0.4, 4.5, -7.5]],
      d7: [[0.5, -16.8, -17]], d8: [[0.5, 17.8, -17.5]],
      d9: [[0.5, -5, -18]], d10: [[0.4, 8.5, -16], [0.6, 9.4, -21]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.38, h: 2 }, { t: 0.48, at: [3.2, -6.8], h: 9 },
      { t: 0.58, at: [6.2, -20.6], h: 1.5 }, { t: 0.68, at: [5.8, -23], h: 0 }],
    labels: ["o8", "d6"],
    flag: [7.5, -18],
  },

  // Lesson 9: a power run left for 12, while the right guard holds the tackle in front of him at the line
  "power-held": {
    formation: "i-form", block: "run",
    moves: {
      o0: [[0.06, -0.2, 2.6], [0.12, -0.5, 3.3], [0.4, 0.4, 4.4]],
      o10: [[0.12, -0.6, 3.9], [0.3, -1.8, 1.2], [0.42, -2.1, -0.6], [0.5, -2.2, -3.5], [0.7, -2, -9], [0.82, -1.6, -12]],
      o8: [[0.08, -1.2, 3.2], [0.2, -2, 1.4], [0.32, -2.1, -0.6], [0.45, -3, -3]],
      o3: [[0.15, 1.5, -0.2], [0.5, 1.9, -0.5]],
      o6: [[0.15, 4.3, -0.2], [0.5, 4.6, -1.1]],
      o7: [[0.5, -14.5, -7]], o9: [[0.5, 14, -6]],
      d2: [[0.15, 1.4, -1], [0.5, 2, -1.3]],
      d3: [[0.5, 5.3, -2.2]],
      d4: [[0.3, -3.8, -3.8], [0.45, -3.2, -3.4]],
      d5: [[0.4, -0.8, -4.5], [0.6, -1.2, -6.5]],
      d7: [[0.5, -14.8, -7.8]], d8: [[0.5, 14.4, -6.8]],
      d9: [[0.5, -3.6, -10.8], [0.82, -2.1, -12.9]], d10: [[0.82, 1, -13.5]],
    },
    ball: [{ t: 0.04, carrier: "o0", h: 1 }, { t: 0.12, carrier: "o10", h: 1 }, { t: 0.82, carrier: "o10", h: 1 }, { t: 0.88, carrier: "o10", h: 0 }],
    labels: ["o10", "o3"],
    flag: [2.6, 0.3],
  },

  // Lesson 10: on 1st & 20, a hitch to the tight end, caught 6 yards out and run on to a gain of 8, well short
  // of the yellow line
  "te-hitch": {
    formation: "singleback", block: "pass",
    moves: {
      o0: [[0.12, 0, 4.5], [0.25, 0, 6.5]],
      o6: [[0.2, 5, -3.5], [0.36, 5.4, -6], [0.42, 5.2, -5.6], [0.6, 4.8, -8]],
      o10: [[0.15, 1.6, 5.4], [0.4, 2.4, 4.8]],
      o7: [[0.5, -15, -12]], o9: [[0.5, 14, -11]],
      d4: [[0.4, -4, -8]], d5: [[0.4, 1.5, -8]],
      d6: [[0.3, 6, -6.3], [0.45, 6.4, -7.2], [0.6, 5.6, -8.7]],
      d7: [[0.5, -15.5, -12.8]], d8: [[0.5, 14.3, -11.8]],
      d9: [[0.5, -7, -15]], d10: [[0.6, 5.5, -10]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.32, h: 2 }, { t: 0.37, at: [2.6, 0.4], h: 3 },
      { t: 0.42, carrier: "o6", h: 1.2 }, { t: 0.6, carrier: "o6", h: 1 }, { t: 0.66, carrier: "o6", h: 0 }],
    labels: ["o0", "o6"],
  },

  // Lesson 11: the right end jumps across before the snap, the play goes on, and the pass sails over the tight end
  "offside-incomplete": {
    formation: "shotgun", block: "pass", snap: { t: 0.08, early: ["d3"] },
    moves: {
      d3: [[0.05, 5, 0.4], [0.2, 4.6, 2.4], [0.45, 1.8, 5.4]],
      o0: GUN_SET,
      o6: [[0.25, 4.5, -5], [0.42, 2, -7]],
      o7: [[0.5, -16, -9]], o8: [[0.5, 10, -9]], o9: [[0.5, 17.5, -10]], o10: GUN_BACK,
      d4: [[0.4, -1.5, -7]], d5: [[0.45, 2.8, -8.4]], d6: [[0.5, 10, -9.8]],
      d7: [[0.5, -16.4, -9.8]], d8: [[0.5, 17.6, -11]],
      d9: [[0.5, -4, -14]], d10: [[0.5, 3.5, -12.5]],
    },
    ball: [{ t: 0.11, carrier: "o0", h: 1 }, { t: 0.35, h: 1.8 }, { t: 0.42, at: [0.8, -1.5], h: 4 },
      { t: 0.49, at: [1.4, -9], h: 2.2 }, { t: 0.58, at: [1.1, -11.5], h: 0 }],
    labels: ["d3", "o0"],
    flag: [6, -0.5],
  },

  // Lesson 12: a slant to the slot receiver, who runs past the yellow line before the safety brings him down
  slant: {
    formation: "shotgun", block: "pass",
    moves: {
      o0: GUN_SET,
      o8: [[0.15, 8, -2.5], [0.35, 5.6, -6], [0.4, 5, -6.6], [0.6, 4.4, -9]],
      o6: [[0.4, 6, -4.5]],
      o7: [[0.5, -16, -8]], o9: [[0.5, 18, -10]], o10: GUN_BACK,
      d4: [[0.4, -1.5, -6]], d5: [[0.3, 3.2, -6.5], [0.6, 3, -8]],
      d6: [[0.35, 7.2, -5.6], [0.6, 6.1, -8]],
      d7: [[0.5, -16.3, -9]], d8: [[0.5, 18, -11]],
      d9: [[0.5, -6, -15]], d10: [[0.3, 6.5, -10.5], [0.6, 5.2, -9.8]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.3, h: 1.8 }, { t: 0.35, at: [2.5, 0], h: 2.8 },
      { t: 0.4, carrier: "o8", h: 1.2 }, { t: 0.6, carrier: "o8", h: 1 }, { t: 0.66, carrier: "o8", h: 0 }],
    labels: ["o0", "o8"],
  },

  // Lesson 13: a fake handoff, a deep drop, and the left end beats the tackle for a sack 7 yards back
  "play-action-sack": {
    formation: "singleback", block: "pass",
    moves: {
      o0: [[0.1, 0.6, 3.2], [0.3, 0, 6.5], [0.42, 0.3, 7.2], [0.52, -0.2, 7.4], [0.6, -0.6, 7]],
      o10: [[0.1, 0.9, 3.8], [0.3, 2.1, 2.6]],
      o4: [[0.2, -3.2, 1.8], [0.5, -3, 3.2]],
      o6: [[0.3, 5, -6], [0.5, 4, -9]], o8: [[0.3, -6, -4], [0.5, -7, -7]],
      o7: [[0.5, -15, -13]], o9: [[0.5, 13, -14]],
      d0: [[0.2, -4.3, 1.5], [0.4, -2.8, 5.2], [0.52, -1.4, 6.9], [0.6, -1.2, 7.4]],
      d4: [[0.5, -6.4, -7.8]], d5: [[0.2, 0.5, -3.5], [0.5, 0.2, -6]], d6: [[0.5, 4.6, -9.6]],
      d7: [[0.5, -15.4, -14]], d8: [[0.5, 13.4, -15]],
      d9: [[0.5, -6, -15]], d10: [[0.5, 6, -15]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.52, carrier: "o0", h: 1 }, { t: 0.62, carrier: "o0", h: 0 }],
    labels: ["o0", "d0"],
  },

  // Lesson 14: the pass is thrown and falls incomplete, and then the tackle drives the quarterback into the ground
  "roughed-passer": {
    formation: "shotgun", block: "pass",
    moves: {
      o0: [[0.15, 0, 6.5], [0.35, 0, 6.5], [0.5, -0.3, 7.6], [0.6, -0.4, 8]],
      o3: [[0.2, 1.6, 1.6], [0.5, 1.8, 2.6]],
      o6: [[0.2, 4.6, -4], [0.4, 3, -7]],
      o7: [[0.5, -16, -12]], o8: [[0.5, 10, -10]], o9: [[0.5, 17.6, -12]], o10: GUN_BACK,
      d2: [[0.2, 1.2, 1.6], [0.38, 0.9, 5], [0.48, 0.5, 6.3], [0.6, 0, 7.2]],
      d4: [[0.4, -1.5, -7]], d5: [[0.45, 3.5, -7.9]], d6: [[0.5, 10.2, -11]],
      d7: [[0.5, -16.4, -13]], d8: [[0.5, 17.8, -13]],
      d9: [[0.5, -6, -15]], d10: [[0.5, 6, -15]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.35, h: 1.8 }, { t: 0.4, at: [1.5, -0.4], h: 3.2 },
      { t: 0.45, at: [2.9, -7.2], h: 1.3 }, { t: 0.55, at: [3.8, -8.8], h: 0 }],
    labels: ["o0", "d2"],
    flag: [-1.8, 8.6],
  },

  // Lesson 15: a toss to the right. The corner forces the back out of bounds after 5 yards. The ball is snapped
  // from the right hash minus 0.6 (lessons 13 and 14), so 24.9 yards to the right is past the sideline.
  "toss-out-of-bounds": {
    formation: "i-form", block: "run",
    moves: {
      o0: [[0.06, 0.5, 2.4], [0.2, 1, 2.8]],
      o10: [[0.18, 3.5, 6], [0.35, 8.5, 3.6], [0.55, 14, -0.8], [0.72, 20.5, -4], [0.82, 24.9, -5]],
      o8: [[0.25, 5.5, 2.5], [0.5, 11, -1]],
      o6: [[0.15, 5.2, 0], [0.45, 7.5, -1.5]],
      o7: [[0.5, -15, -6]], o9: [[0.4, 15.5, -5], [0.7, 15.8, -8]],
      d3: [[0.45, 8, -2.6]],
      d4: [[0.6, 2, -5]], d5: [[0.5, 7, -5], [0.8, 14, -5.5]], d6: [[0.4, 9, -4], [0.75, 17.5, -4.5]],
      d7: [[0.5, -15.4, -6.8]], d8: [[0.4, 17, -5], [0.6, 20, -6], [0.8, 24, -6]],
      d9: [[0.8, 6, -9]], d10: [[0.5, 11, -9], [0.8, 18, -8]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.08, h: 1.1 }, { t: 0.18, carrier: "o10", h: 1 }, { t: 0.82, carrier: "o10", h: 1 }, { t: 0.88, carrier: "o10", h: 0 }],
    labels: ["o10", "d8"],
  },

  // Lesson 16: the play clock runs out while the quarterback is still calling the play
  "delay-of-game": {
    formation: "singleback",
    moves: { o0: [[0.2, 0.8, 2.4], [0.45, -0.6, 2.4], [0.6, 0, 1.9]] },
    labels: ["o0"],
    flag: [2, -3],
  },

  // Lesson 17, first play: the tight end sits down 5 yards out and falls forward for 6
  "te-stick": {
    formation: "shotgun", block: "pass",
    moves: {
      o0: GUN_SET,
      o6: [[0.2, 4.6, -4], [0.33, 4.9, -5.3], [0.5, 4.7, -6]],
      o7: [[0.5, -16, -8]], o8: [[0.5, 9, -9]], o9: [[0.5, 17.6, -10]], o10: GUN_BACK,
      d4: [[0.4, -1.2, -6]], d5: [[0.33, 3.6, -6.4], [0.5, 4, -6.9]], d6: [[0.5, 9.4, -9.8]],
      d7: [[0.5, -16.4, -9]], d8: [[0.5, 17.8, -11]],
      d9: [[0.5, -6, -15]], d10: [[0.5, 6, -8.5]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.27, h: 1.8 }, { t: 0.3, at: [2.45, 0.6], h: 2.6 },
      { t: 0.33, carrier: "o6", h: 1.2 }, { t: 0.5, carrier: "o6", h: 1 }, { t: 0.56, carrier: "o6", h: 0 }],
    labels: ["o0", "o6"],
  },

  // Lesson 17, second play: a quick out to the slot, and the corner stops him a yard short
  "quick-out": {
    formation: "shotgun", block: "pass",
    moves: {
      o0: [[0.1, 0, 6]],
      o8: [[0.18, 9.5, -1.5], [0.28, 11, -2.6], [0.45, 11.4, -3]],
      o6: [[0.3, 4.8, -4]],
      o7: [[0.4, -16, -6]], o9: [[0.4, 17.5, -6]], o10: GUN_BACK,
      d4: [[0.4, -1.5, -6]], d5: [[0.4, 4, -5.6]],
      d6: [[0.28, 10.5, -4.2], [0.45, 12, -3.9]],
      d7: [[0.4, -16.4, -7]], d8: [[0.4, 17.6, -7]],
      d9: [[0.4, -6, -14]], d10: [[0.45, 9.5, -7]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.2, h: 1.8 }, { t: 0.24, at: [5.5, 1.7], h: 2.4 },
      { t: 0.28, carrier: "o8", h: 1.2 }, { t: 0.45, carrier: "o8", h: 1 }, { t: 0.51, carrier: "o8", h: 0 }],
    labels: ["o8", "d6"],
  },

  // Lesson 18: on 4th & 1, the quarterback pushes in behind the center for 2
  "qb-sneak": {
    formation: "heavy", block: "run",
    moves: {
      o0: [[0.06, 0, 1.4], [0.3, 0.1, -0.3], [0.55, 0.1, -2]],
      o1: [[0.15, 0, -0.4], [0.5, 0, -2.4]],
      o9: [[0.3, 0.2, 1.4], [0.55, 0.2, -0.6]],
      o10: [[0.4, -0.3, 3.5]],
      d2: [[0.15, 0, -1.4], [0.5, 0.1, -3.4]],
      d5: [[0.5, -1.6, -3.4]], d6: [[0.3, 0.3, -3.6], [0.55, 0.6, -4.4]], d7: [[0.5, 1.8, -3.5]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.55, carrier: "o0", h: 1 }, { t: 0.62, carrier: "o0", h: 0 }],
    labels: ["o0", "d2"],
  },

  // Lesson 19: a fake handoff, then a dig to the right receiver, tackled by the safety at the 6
  dig: {
    formation: "singleback", block: "pass",
    moves: {
      o0: [[0.1, 0.6, 3.2], [0.3, 0, 6.5]],
      o10: [[0.1, 0.9, 3.8], [0.3, 2.1, 2.6]],
      o9: [[0.2, 12.5, -4], [0.38, 8.8, -8.4], [0.42, 8, -8.9], [0.6, 7, -11]],
      o7: [[0.5, -15, -12]],
      d4: [[0.4, -4, -7]], d5: [[0.4, 0.5, -7]], d6: [[0.4, 5.5, -7], [0.6, 5.5, -9.3]],
      d7: [[0.5, -15.4, -13]], d8: [[0.38, 10, -8], [0.6, 8.6, -10.2]],
      d9: [[0.5, -5, -15]], d10: [[0.3, 7, -12.5], [0.6, 7.6, -12]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.35, h: 1.8 }, { t: 0.385, at: [4, -1.2], h: 3.4 },
      { t: 0.42, carrier: "o9", h: 1.2 }, { t: 0.6, carrier: "o9", h: 1 }, { t: 0.66, carrier: "o9", h: 0 }],
    labels: ["o9", "d10"],
  },

  // Lesson 20: a dive behind the fullback for 3, stopped by the middle linebacker
  "goal-line-dive": {
    formation: "goal-line", block: "run",
    moves: {
      o0: [[0.06, 0, 2.7], [0.12, 0.1, 3.2], [0.4, 0.8, 3.6]],
      o10: [[0.12, -0.3, 3.5], [0.3, -1.6, 1], [0.5, -2.3, -1.6], [0.65, -2.3, -3]],
      o9: [[0.25, -1.9, 0.8], [0.35, -2.1, -0.6], [0.5, -3.3, -2.6]],
      d4: [[0.4, -2.6, -2.6], [0.65, -3.4, -3.6]],
      d5: [[0.3, -0.9, -3.6], [0.65, -2.3, -4]],
      d6: [[0.65, -0.6, -3.8]], d9: [[0.65, -2.8, -5]],
    },
    ball: [{ t: 0.04, carrier: "o0", h: 1 }, { t: 0.12, carrier: "o10", h: 1 }, { t: 0.66, carrier: "o10", h: 1 }, { t: 0.72, carrier: "o10", h: 0 }],
    labels: ["o10", "d5"],
  },

  // Lesson 21: the defense bites on a fake handoff, and the tight end slips into the end zone for the catch
  "play-action-touchdown": {
    formation: "goal-line", block: "pass",
    moves: {
      o0: [[0.1, 0.6, 3], [0.3, 0, 5.5]],
      o10: [[0.1, 0.9, 3.6], [0.3, 2.1, 2.6]],
      o6: [[0.15, 4.6, -1], [0.35, 3.8, -4], [0.45, 2.8, -5.8], [0.55, 2.6, -6.2]],
      o8: [[0.4, -8, -5]], o9: [[0.2, -1.5, 2.6]],
      d4: [[0.2, -2.6, -2.6]], d5: [[0.2, 0.3, -2.6], [0.5, 0, -4]],
      d6: [[0.2, 2.2, -2.4], [0.5, 3.6, -4.8]],
      d7: [[0.4, -8.4, -5.8]], d8: [[0.5, 6, -6.5]],
      d9: [[0.5, -1.5, -7]], d10: [[0.5, 4.4, -7.4]],
    },
    ball: [{ t: 0.03, carrier: "o0", h: 1 }, { t: 0.38, h: 1.8 }, { t: 0.415, at: [1.4, -0.2], h: 3 },
      { t: 0.45, carrier: "o6", h: 1.2 }, { t: 0.55, carrier: "o6", h: 1 }, { t: 0.62, carrier: "o6", h: 0 }],
    labels: ["o0", "o6"],
  },

  // Lesson 22: the extra point. Snap, hold, kick, and the ball clears the crossbar, which Drive.tsx draws at y = 118.8, between the uprights.
  "extra-point": {
    formation: "field-goal", block: "kick", snap: { t: 0.1 },
    moves: {
      o10: [[0.22, -1.5, 8.8], [0.32, -0.5, 7.4], [0.45, 0.2, 6.2]],
      o8: [[0.2, 5.8, 2.2], [0.4, 5.9, 2.4]], o9: [[0.2, -5.8, 2.2], [0.4, -5.9, 2.4]],
      d6: [[0.25, -6.4, 0.9], [0.4, -6.2, 1.6]], d7: [[0.25, 6.4, 0.9], [0.4, 6.2, 1.6]],
    },
    ball: [{ t: 0.1, at: [0, 0], h: 0 }, { t: 0.2, carrier: "o0", h: 0.4 }, { t: 0.26, carrier: "o0", h: 0 },
      { t: 0.32, h: 0 }, { t: 0.55, at: [0.1, -8], h: 12 }, { t: 0.8, at: [0.2, -23.8], h: 7 }, { t: 0.9, at: [0.25, -24.9], h: 0 }],
    labels: ["o10", "o0"],
  },
};

export const MOTIONS: Record<MotionId, Motion> = Object.fromEntries(Object.entries(SPECS).map(([id, spec]) => [id, build(id, spec)]));
// Lesson 23: the offense kicks off to the other team, the same kick the other way round
MOTIONS["kickoff-away"] = mirror("kickoff-away", MOTIONS.kickoff);
