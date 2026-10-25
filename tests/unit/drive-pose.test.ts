import { describe, expect, it } from "vitest";
import { FORMATIONS, KICKOFF_AWAY, type Formation, type SlotId } from "@/lib/drive/formations";
import { MOTIONS, ballAt, slotAt } from "@/lib/drive/motion";
import { PLAYS } from "@/lib/drive/plays";
import { CAMERA_X, SCENES, poseAt, showsLines, type Pose } from "@/lib/drive/pose";

// Task 3's table: [before tag, before spot, after tag, after spot]
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

const SLOTS = [...Array(11).keys()].flatMap((i) => [`o${i}`, `d${i}`]) as SlotId[];
const side = (f: Formation, s: "o" | "d") => SLOTS.filter((id) => id.startsWith(s)).map((id) => f.slots[id]);
const near = (a: number, b: number) => Math.abs(a - b) < 0.01;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
// The sweeps below run every lesson at hundreds of moments: seconds of work, more on a busy machine
const SWEEP = 30_000;
const steps = (n: number) => [...Array(n + 1).keys()].map((i) => i / n);

// Teammates the plays mean to bring together, by lesson index (slots in sorted order). Opponents may meet in a
// block or a tackle, but never closer than 0.3 yards (dots 12px across at about 15px a yard).
const CONTACT: Record<number, [SlotId, SlotId, string][]> = {
  4: [["o0", "o10", "the handoff"]],
  8: [["o0", "o10", "the handoff"]],
  12: [["o0", "o10", "the fake handoff"]],
  17: [["o0", "o1", "the quarterback sneaks in right behind the center"]],
  18: [["o0", "o10", "the fake handoff"]],
  19: [["o0", "o10", "the handoff"]],
  20: [["o0", "o10", "the fake handoff"]],
  21: [["o0", "o10", "the kicker kicks the ball off the holder's hand"]],
};

// Each play lesson, with the indexes of its first and last play in PLAYS
const playLessons = SCENES.flatMap((scene, lesson) => {
  if (typeof scene === "string") return [];
  const ix = scene.plays.map((id) => PLAYS.findIndex((p) => p.id === id));
  return [{ lesson, first: ix[0], last: ix[ix.length - 1] }];
});

describe("formations", () => {
  const scrimmage = Object.values(FORMATIONS).filter((f) => f.id !== "kickoff");

  it("fill all 22 slots", () => {
    for (const f of [...Object.values(FORMATIONS), KICKOFF_AWAY]) expect(Object.keys(f.slots).sort()).toEqual([...SLOTS].sort());
  });
  it.each(scrimmage.map((f) => [f.id, f] as const))("%s lines up legally", (id, f) => {
    const o = side(f, "o");
    const d = side(f, "d");
    expect(o).toHaveLength(11);
    expect(d).toHaveLength(11);
    if (id !== "field-goal") {
      expect(o.filter((p) => p.pos === "qb")).toHaveLength(1);
      expect(o.filter((p) => p.pos === "c")).toHaveLength(1);
    }
    expect(o.filter((p) => p.at[1] <= 1).length).toBeGreaterThanOrEqual(7);
    for (const p of o) expect(p.at[1]).toBeGreaterThanOrEqual(0);
    for (const p of d) expect(p.at[1]).toBeLessThan(0);
  });
  it("puts a long snapper, a holder and a kicker on the field-goal unit", () => {
    const o = side(FORMATIONS["field-goal"], "o").map((p) => p.pos);
    for (const pos of ["ls", "h", "k"] as const) expect(o.filter((p) => p === pos)).toHaveLength(1);
  });
  it.each([...Object.values(FORMATIONS), KICKOFF_AWAY].map((f, i) => [i, f] as const))(
    "formation %i keeps everyone 1.2 yards apart and in bounds",
    (_, f) => {
      for (let i = 0; i < SLOTS.length; i++) {
        const a = f.slots[SLOTS[i]].at;
        expect(Math.abs(a[0])).toBeLessThanOrEqual(23.58); // in bounds with the ball on either hash
        for (let j = i + 1; j < SLOTS.length; j++) {
          const b = f.slots[SLOTS[j]].at;
          expect(Math.hypot(a[0] - b[0], a[1] - b[1]), `${SLOTS[i]}–${SLOTS[j]}`).toBeGreaterThanOrEqual(1.2);
        }
      }
    },
  );
});

describe("motions", () => {
  it.each(Object.values(MOTIONS).map((m) => [m.id, m] as const))("%s is well formed", (_, m) => {
    expect(m.labels.length).toBeLessThanOrEqual(2);
    for (const keys of [...Object.values(m.moves), m.ball]) {
      for (let i = 0; i < keys!.length; i++) {
        expect(keys![i].t).toBeGreaterThanOrEqual(0);
        expect(keys![i].t).toBeLessThanOrEqual(1);
        if (i > 0) expect(keys![i].t).toBeGreaterThan(keys![i - 1].t);
      }
    }
  });
  it("every play names a formation and a motion that exist", () => {
    for (const p of PLAYS) {
      expect(FORMATIONS[p.formation], p.id).toBeDefined();
      expect(MOTIONS[p.motion], p.id).toBeDefined();
    }
  });
  it.each(PLAYS.map((p) => [p.id, p] as const))("%s hands the ball only to whoever is holding it", (_, p) => {
    const f = FORMATIONS[p.formation];
    const m = MOTIONS[p.motion];
    for (const key of m.ball) {
      if (!key.carrier) continue;
      const at = slotAt(f, m, key.carrier, key.t);
      expect(Math.hypot(at[0] - key.at[0], at[1] - key.at[1])).toBeLessThan(0.01);
      if (key.t === 0) continue;
      const before = ballAt(f, m, key.t - 1e-6).at; // the ball just before: the last carrier's hands, or the pass
      expect(Math.hypot(before[0] - at[0], before[1] - at[1]), `${key.carrier} at ${key.t}`).toBeLessThan(1);
    }
  });
  it.each(PLAYS.map((p) => [p.id, p] as const))("%s ends where its yards say", (_, p) => {
    const end = ballAt(FORMATIONS[p.formation], MOTIONS[p.motion], 1).at;
    const r = p.result.kind === "penalty" && p.result.wiped ? p.result.wiped : p.result;
    if (r.kind === "gain" && p.id !== "p21") expect(end[1]).toBeCloseTo(-r.yards, 5);
  });
  it("puts the offside end past the line at the snap, while everyone else waits for it", () => {
    const m = MOTIONS["offside-incomplete"];
    const f = FORMATIONS.shotgun;
    const snap = m.ball[0]; // the ball sits on the spot until this key, then moves
    expect(snap.at).toEqual([0, 0]);
    expect(snap.t).toBeGreaterThan(0);
    expect(slotAt(f, m, "d3", snap.t)[1]).toBeGreaterThan(0);
    for (const s of SLOTS) if (s !== "d3") expect(slotAt(f, m, s, snap.t), s).toEqual(f.slots[s].at);
    const p = poseAt(10, 0.2 + 0.55 * snap.t); // the same moment on the field
    expect(p.ball.y).toBeCloseTo(p.los, 5);
    expect(p.players.d3.y).toBeLessThan(p.los);
  });
  it("brings every ball back to the ground", () => {
    for (const m of Object.values(MOTIONS)) expect(m.ball.at(-1)?.h ?? 0, m.id).toBe(0);
    for (let i = 0; i < 23; i++) expect(poseAt(i, 0.8).ball.h, `lesson ${i} at the whistle`).toBe(0);
  });
  it("snaps no ball on a pre-snap foul, and flags every penalty and only those", () => {
    for (const p of PLAYS) {
      const m = MOTIONS[p.motion];
      expect(Boolean(m.flag), p.id).toBe(p.result.kind === "penalty");
      if (p.result.kind === "penalty" && !p.result.wiped && p.result.from === "previous") expect(m.ball, p.id).toEqual([]);
    }
  });
});

describe("the pose", () => {
  it("has a scene per lesson, and runs every play once, in order", () => {
    expect(SCENES).toHaveLength(23);
    expect(SCENES.flatMap((s) => (typeof s === "string" ? [] : s.plays))).toEqual(PLAYS.map((p) => p.id));
  });
  it("depends only on the lesson and t", () => {
    for (let i = 0; i < 23; i++) for (const t of [0, 0.1, 0.33, 0.5, 0.8, 0.9, 1]) expect(poseAt(i, t)).toEqual(poseAt(i, t));
  });
  it("clamps t", () => {
    expect(poseAt(4, -1)).toEqual(poseAt(4, 0));
    expect(poseAt(4, 2)).toEqual(poseAt(4, 1));
  });
  it("hands the ball, the lines and the camera from each lesson to the next without a jump", () => {
    for (let i = 0; i < 22; i++) {
      const a = poseAt(i, 1);
      const b = poseAt(i + 1, 0);
      for (const k of ["x", "y", "h"] as const) expect(near(a.ball[k], b.ball[k]), `lesson ${i} ball ${k}`).toBe(true);
      expect(near(a.los, b.los), `lesson ${i} los`).toBe(true);
      expect(a.firstDown === null ? b.firstDown === null : near(a.firstDown, b.firstDown ?? NaN), `lesson ${i} first down`).toBe(true);
      expect(dist(a.camera, b.camera), `lesson ${i} camera`).toBeLessThan(0.01);
      for (const s of SLOTS) {
        expect(near(a.players[s].opacity, b.players[s].opacity), `lesson ${i} ${s}`).toBe(true);
        if (a.players[s].opacity > 0) expect(dist(a.players[s], b.players[s])).toBeLessThan(0.01);
      }
    }
  });
  it("never jumps inside a lesson", () => {
    for (let i = 0; i < 23; i++) {
      let prev: Pose = poseAt(i, 0);
      for (const t of steps(2000).slice(1)) {
        const cur = poseAt(i, t);
        expect(dist(prev.ball, cur.ball), `lesson ${i} ball at ${t}`).toBeLessThan(1);
        expect(dist(prev.camera, cur.camera), `lesson ${i} camera at ${t}`).toBeLessThan(1);
        for (const s of SLOTS) {
          if (prev.players[s].opacity > 0 && cur.players[s].opacity > 0) {
            expect(dist(prev.players[s], cur.players[s]), `lesson ${i} ${s} at ${t}`).toBeLessThan(1);
          }
        }
        prev = cur;
      }
    }
  }, SWEEP);
  it("never runs a player through a teammate or an opponent", () => {
    const allowed = new Set(Object.entries(CONTACT).flatMap(([lesson, pairs]) => pairs.map(([a, b]) => `${lesson} ${a} ${b}`)));
    const tooClose = new Set<string>();
    for (let i = 0; i < 23; i++) {
      for (const t of steps(800)) {
        const p = poseAt(i, t);
        const on = SLOTS.filter((s) => p.players[s].opacity > 0).sort();
        for (let a = 0; a < on.length; a++) {
          for (let b = a + 1; b < on.length; b++) {
            const teammates = on[a][0] === on[b][0];
            if (teammates && allowed.has(`${i} ${on[a]} ${on[b]}`)) continue;
            if (dist(p.players[on[a]], p.players[on[b]]) < (teammates ? 0.5 : 0.3)) tooClose.add(`lesson ${i} ${on[a]}–${on[b]}`);
          }
        }
      }
    }
    expect([...tooClose]).toEqual([]);
  }, SWEEP);
  it("gives each pose its own labels", () => {
    poseAt(4, 0.5).labels.push("o1");
    expect(poseAt(4, 0.5).labels).toEqual(MOTIONS["inside-zone"].labels);
    expect(MOTIONS["inside-zone"].labels).toHaveLength(2);
  });
  it.each(playLessons.map((l) => [l.lesson, l] as const))("lesson %i shows the before tag, then the after tag", (lesson, l) => {
    const [bt, bs] = TABLE[l.first];
    const [, , at, as] = TABLE[l.last];
    expect(poseAt(lesson, 0.1).tag).toBe(`${bt} · ${bs}`);
    if (at === "touchdown") expect(poseAt(lesson, 0.95).tag.toLowerCase()).toBe("touchdown");
    else expect(poseAt(lesson, 0.95).tag).toBe(`${at} · ${as}`);
  });
  it("fades each play's players in at the snap and out once the ball is placed", () => {
    for (const { lesson } of playLessons) {
      for (const s of SLOTS) {
        expect(poseAt(lesson, 0).players[s].opacity).toBe(0);
        expect(poseAt(lesson, 1).players[s].opacity).toBe(0);
        if (lesson !== 16) expect(poseAt(lesson, 0.5).players[s].opacity).toBe(1);
      }
    }
  });
  it("starts the drive at the touchback spot", () => {
    const p = poseAt(1, 1);
    expect(p.ball.y).toBeCloseTo(45, 5);
    expect(p.tag).toBe("1st & 10 · own 35");
    expect(poseAt(2, 0.5).tag).toBe("1st & 10 · own 35");
    expect(poseAt(3, 0.5).firstDown).toBeCloseTo(55, 5);
  });
  it("draws the blue and yellow lines only around a snap, never during a kickoff or the opening pan", () => {
    expect(SCENES.map(showsLines)).toEqual(SCENES.map((_, i) => i !== 0 && i !== 1 && i !== 22));
  });
  it("draws no yellow line on 1st & goal", () => {
    expect(poseAt(19, 0.1).firstDown).toBeNull();
  });
  it("throws a flag on delay of game, and none on the incomplete pass", () => {
    expect(poseAt(15, 0.8).flag).not.toBeNull();
    expect(poseAt(5, 0.8).flag).toBeNull();
    expect(poseAt(15, 0.5).flag).toBeNull(); // not before the whistle
  });
  it("throws the interference flag at the spot of the foul, and puts the ball there", () => {
    expect(poseAt(7, 0.8).flag!.y).toBeCloseTo(62, 5); // opp 48
    expect(poseAt(7, 1).ball.y).toBeCloseTo(62, 5);
  });
  it("runs lesson 15 out of bounds, then spots the ball on the hash", () => {
    expect(poseAt(14, 0.8).ball.x).toBeGreaterThan(53.3);
    expect(poseAt(14, 1).ball.x).toBeCloseTo(29.72, 5);
  });
  it("scores the touchdown in the end zone", () => {
    expect(poseAt(20, 1).ball.y).toBeGreaterThanOrEqual(110);
  });
  it("snaps the try from the 15 with the field-goal unit", () => {
    const p = poseAt(21, 0.2);
    expect(p.ball.y).toBeCloseTo(95, 5);
    expect(p.players.o0.pos).toBe("h");
    expect(p.tag).toBe("Try · opp 15");
  });
  it("keeps the camera inside the sidelines and labels at most two players", () => {
    expect(CAMERA_X[0]).toBeCloseTo(12, 5);
    expect(CAMERA_X[1]).toBeCloseTo(41.3, 5);
    for (let i = 0; i < 23; i++) {
      for (const t of steps(20)) {
        const p = poseAt(i, t);
        expect(p.camera.x).toBeGreaterThanOrEqual(CAMERA_X[0]);
        expect(p.camera.x).toBeLessThanOrEqual(CAMERA_X[1]);
        expect(p.labels.length).toBeLessThanOrEqual(2);
      }
    }
  });
});
