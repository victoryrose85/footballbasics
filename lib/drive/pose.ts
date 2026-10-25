import { FORMATIONS, KICKOFF_AWAY, SLOTS, type Formation, type Position, type SlotId } from "./formations";
import { MOTIONS, ballAt, slotAt, type Motion } from "./motion";
import { PLAYS, situations, type Play, type PlayId } from "./plays";
import { downTag, spotLabel, START, type Situation } from "./rules";

// Where everyone is at a point in a lesson. Field yards: x runs 0 to 53.3 from the left sideline, y runs 0 to 120
// from the offense's own end line, so a spot is at y = spot + 10 and the offense drives toward 120.
export type Scene = "field" | "kickoff" | "lineup" | "downs" | { plays: PlayId[] } | "try" | "kickoff-after";
export interface Pose {
  players: Record<SlotId, { x: number; y: number; pos: Position; opacity: number }>;
  ball: { x: number; y: number; h: number };
  los: number; firstDown: number | null; flag: { x: number; y: number } | null; // null firstDown: "& goal"
  tag: string; // "2nd & 6 · own 39"
  camera: { x: number; y: number }; // the field point at the window's center
  labels: SlotId[];
}

// Inside one play: lined up, the play, the whistle, the ball placed
export const PHASES = { set: [0, 0.2], play: [0.2, 0.75], whistle: [0.75, 0.85], placed: [0.85, 1] } as const;

// One per lesson, in the spec's order (section 3)
export const SCENES: Scene[] = [
  "field", "kickoff", "lineup", "downs",
  { plays: ["p5"] }, { plays: ["p6"] }, { plays: ["p7"] }, { plays: ["p8"] }, { plays: ["p9"] }, { plays: ["p10"] },
  { plays: ["p11"] }, { plays: ["p12"] }, { plays: ["p13"] }, { plays: ["p14"] }, { plays: ["p15"] }, { plays: ["p16"] },
  { plays: ["p17a", "p17b"] }, { plays: ["p18"] }, { plays: ["p19"] }, { plays: ["p20"] }, { plays: ["p21"] },
  "try", "kickoff-after",
];

export const FIELD_WIDTH = 53.3;
export const WINDOW_YARDS = 24; // how much of the field's width the window shows
export const CAMERA_X = [WINDOW_YARDS / 2, FIELD_WIDTH - WINDOW_YARDS / 2] as const; // never past a sideline
const CAMERA_Y = [8, 112] as const; // keeps a phone's window inside the end lines
const LEAD = 2; // the camera looks a couple of yards downfield, where the defense is
const MIDDLE = FIELD_WIDTH / 2;
const HASHES = [23.58, 29.72] as const; // the inbounds lines, 70 ft 9 in from each sideline
const FADE_IN = 0.12;
const FADE_OUT = 0.86;
const SPOTTING = 0.1; // how long the officials take to spot the ball before the snap
const PLACING = 0.08; // and to place it after the whistle

interface Ball { x: number; y: number; h: number }
interface Marks { ball: Ball; los: number; firstDown: number | null }
interface Stage {
  formation: Formation; motion: Motion | null;
  from: Marks; snap: Marks; dead: Ball; to: Marks; // the previous lesson's end, the snap, the whistle, the new spot
  tags: [string, string]; fade: [boolean, boolean]; labels: SlotId[];
  camera?: { x: number; y: number }; // where the camera starts when it doesn't start on the ball
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, s: number) => a + (b - a) * s;
const smooth = (v: number) => { const c = clamp(v, 0, 1); return c * c * (3 - 2 * c); };
const yard = (spot: number) => spot + 10;
const tagOf = (s: Situation) => `${downTag(s)} · ${spotLabel(s.spot)}`;
const lineAt = (x: number, y: number, firstDown: number | null = null): Marks => ({ ball: { x, y, h: 0 }, los: y, firstDown });
const marksOf = (x: number, s: Situation) => lineAt(x, yard(s.spot), s.lineToGain >= 100 ? null : yard(s.lineToGain));
const onField = (snap: Ball, [dx, dy]: [number, number]) => ({ x: snap.x + dx, y: snap.y - dy });

function mix(a: Marks, b: Marks, s: number): Marks {
  return {
    ball: { x: lerp(a.ball.x, b.ball.x, s), y: lerp(a.ball.y, b.ball.y, s), h: lerp(a.ball.h, b.ball.h, s) },
    los: lerp(a.los, b.los, s),
    firstDown: a.firstDown === null || b.firstDown === null ? (s < 0.5 ? a.firstDown : b.firstDown) : lerp(a.firstDown, b.firstDown, s),
  };
}

// Where the officials put the ball: where the play ended (between the hashes), or back at the snap
function placedX(p: Play, dead: Ball, snapX: number, m: Motion): number {
  const r = p.result;
  if (r.kind === "gain") return clamp(dead.x, ...HASHES);
  if (r.kind === "penalty" && r.from === "spot") return clamp(snapX + m.flag![0], ...HASHES);
  return snapX;
}

interface StageOptions { tags: [string, string]; fade: [boolean, boolean]; labels?: SlotId[]; camera?: Stage["camera"]; place: (dead: Ball) => Marks }

function stage(from: Marks, snap: Marks, formation: Formation, motion: Motion | null, o: StageOptions): Stage {
  const end = ballAt(formation, motion, 1);
  const dead = { ...onField(snap.ball, end.at), h: end.h };
  return { formation, motion, from, snap, dead, to: o.place(dead), tags: o.tags, fade: o.fade,
    labels: o.labels ?? motion?.labels ?? [], camera: o.camera };
}

const KICK_TEE = lineAt(MIDDLE, yard(65)); // the defense kicks off from its own 35

// Every lesson's stages, each starting where the one before it ended
const STAGES: Stage[][] = (() => {
  const sits = situations();
  const out: Stage[][] = [];
  let cur = KICK_TEE;
  const first = FORMATIONS[PLAYS[0].formation];
  const start = () => marksOf(cur.ball.x, START);
  for (const scene of SCENES) {
    let stages: Stage[];
    if (scene === "field") {
      stages = [stage(cur, KICK_TEE, FORMATIONS.kickoff, null, { tags: ["Kickoff", "Kickoff"], fade: [false, false], place: () => KICK_TEE })];
    } else if (scene === "kickoff") {
      stages = [stage(cur, KICK_TEE, FORMATIONS.kickoff, MOTIONS.kickoff, {
        tags: ["Kickoff", tagOf(START)], fade: [true, true], camera: { x: MIDDLE, y: CAMERA_Y[1] }, place: () => marksOf(MIDDLE, START),
      })];
    } else if (scene === "lineup" || scene === "downs") {
      const lineup = scene === "lineup";
      stages = [stage(cur, start(), first, null, {
        tags: [tagOf(START), tagOf(START)], fade: [lineup, !lineup], labels: lineup ? ["o0", "d5"] : [], place: start,
      })];
    } else if (scene === "try") {
      const snap = lineAt(MIDDLE, yard(85)); // a kicked try is snapped from the 15 (rules check, row 3)
      stages = [stage(cur, snap, FORMATIONS["field-goal"], MOTIONS["extra-point"], {
        tags: [`Try · ${spotLabel(85)}`, "Extra point · good"], fade: [true, true], place: (dead) => ({ ...snap, ball: { ...dead, h: 0 } }),
      })];
    } else if (scene === "kickoff-after") {
      // The scoring team kicks off from its own 35, and the other team's drive starts at its 35
      stages = [stage(cur, lineAt(MIDDLE, yard(35)), KICKOFF_AWAY, MOTIONS["kickoff-away"], {
        tags: ["Kickoff", "Touchback"], fade: [true, true], place: () => lineAt(MIDDLE, yard(65)),
      })];
    } else {
      stages = scene.plays.map((id) => {
        const i = PLAYS.findIndex((p) => p.id === id);
        const p = PLAYS[i];
        const { before, after } = sits[i];
        const snap = marksOf(cur.ball.x, before);
        if (Math.abs(snap.ball.y - cur.ball.y) > 1e-9) throw new Error(`${id} isn't snapped where the last play ended`);
        const f = FORMATIONS[p.formation];
        const m = MOTIONS[p.motion];
        const st = stage(cur, snap, f, m, {
          tags: [tagOf(before), after === "touchdown" ? "Touchdown" : tagOf(after)], fade: [true, true],
          place: (dead) => after === "touchdown"
            ? { ball: { ...dead, h: 0 }, los: snap.los, firstDown: null }
            : marksOf(placedX(p, dead, snap.ball.x, m), after),
        });
        cur = st.to;
        return st;
      });
    }
    out.push(stages);
    cur = stages[stages.length - 1].to;
  }
  return out;
})();

function poseOf(st: Stage, t: number, pan: boolean): Pose {
  const u = clamp((t - PHASES.play[0]) / (PHASES.play[1] - PHASES.play[0]), 0, 1);
  const opacity = pan ? 0 : (st.fade[0] ? smooth(t / FADE_IN) : 1) * (st.fade[1] ? 1 - smooth((t - FADE_OUT) / (1 - FADE_OUT)) : 1);
  const players = {} as Pose["players"];
  for (const slot of SLOTS) {
    players[slot] = { ...onField(st.snap.ball, slotAt(st.formation, st.motion, slot, u)), pos: st.formation.slots[slot].pos, opacity };
  }

  let m: Marks;
  if (t < PHASES.set[1]) m = mix(st.from, st.snap, smooth(t / SPOTTING));
  else if (t < PHASES.placed[0]) {
    const live = ballAt(st.formation, st.motion, u);
    m = { ...st.snap, ball: { ...onField(st.snap.ball, live.at), h: live.h } };
  } else m = mix({ ...st.snap, ball: st.dead }, st.to, smooth((t - PHASES.placed[0]) / PLACING));

  const follow = { x: clamp(m.ball.x, ...CAMERA_X), y: clamp(m.ball.y + LEAD, ...CAMERA_Y) };
  const camera = pan ? { x: MIDDLE, y: lerp(CAMERA_Y[0], CAMERA_Y[1], smooth((t - 0.1) / 0.8)) } // one end zone to the other
    : st.camera ? { x: lerp(st.camera.x, follow.x, smooth(t / PHASES.set[1])), y: lerp(st.camera.y, follow.y, smooth(t / PHASES.set[1])) }
    : follow;

  const flag = st.motion?.flag && t >= PHASES.whistle[0] ? onField(st.snap.ball, st.motion.flag) : null;
  return { players, ball: m.ball, los: m.los, firstDown: m.firstDown, flag, tag: st.tags[t < PHASES.placed[0] ? 0 : 1], camera, labels: [...st.labels] };
}

// lesson: 0 to 22. t: 0 to 1 through that lesson's stretch of scroll. A lesson with two plays gives each half.
export function poseAt(lesson: number, t: number): Pose {
  const i = clamp(Math.floor(lesson) || 0, 0, SCENES.length - 1);
  const tt = t > 0 ? Math.min(t, 1) : 0;
  const stages = STAGES[i];
  const j = Math.min(stages.length - 1, Math.floor(tt * stages.length));
  return poseOf(stages[j], tt * stages.length - j, SCENES[i] === "field");
}
