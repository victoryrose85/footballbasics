// The officials' hand signals on the penalties guide, each drawn from the rulebook's own description (rules
// check, row 44) rather than from league or network artwork. A figure faces you, so its left arm is on your left.

export type SignalId = "false-start" | "holding" | "offside" | "personal-foul" | "pass-interference"
  | "intentional-grounding" | "delay-of-game" | "illegal-motion" | "facemask" | "unsportsmanlike-conduct"
  | "too-many-men" | "refused-or-incomplete";

// Degrees from hanging straight down; 180 is straight up, and positive swings out to that side. The forearm's
// angle is measured from the line of the upper arm, so 0 is a straight arm.
export interface Arm { upper: number; fore: number }

export interface Signal {
  id: SignalId;
  caption: string; // the rulebook's name for it
  source: string; // row 44's words: the signal's name, then its description
  left: Arm;
  right: Arm;
  toward?: boolean; // the arms reach toward you, so they're drawn foreshortened
  mark?: "rotate" | "swing" | "strike"; // the motion the book describes
}

export const UPPER_ARM = 20;
export const FOREARM = 18;

// Shoulder, elbow and hand, in the figure's coordinates (y grows downward)
export function armPoints(shoulder: [number, number], arm: Arm, side: "left" | "right"): [number, number][] {
  const out = side === "left" ? -1 : 1;
  const step = ([x, y]: [number, number], deg: number, len: number): [number, number] => {
    const r = (deg * Math.PI) / 180;
    return [x + out * Math.sin(r) * len, y + Math.cos(r) * len];
  };
  const elbow = step(shoulder, arm.upper, UPPER_ARM);
  return [shoulder, elbow, step(elbow, arm.upper + arm.fore, FOREARM)];
}

export const SIGNALS: Signal[] = [
  { id: "false-start", caption: "False start or illegal formation", mark: "rotate",
    source: "False start, illegal formation, or a kickoff out of bounds or short of the landing zone: forearms rotated over and over in front of the body",
    left: { upper: 25, fore: -115 }, right: { upper: 25, fore: -100 } },
  { id: "holding", caption: "Holding",
    source: "Holding: grasping one wrist, fist clenched, in front of the chest",
    left: { upper: 10, fore: -140 }, right: { upper: 10, fore: -150 } },
  { id: "offside", caption: "Offside, encroachment or neutral zone infraction",
    source: "Offside, encroachment or neutral zone infraction: hands on hips",
    left: { upper: 40, fore: -80 }, right: { upper: 40, fore: -80 } },
  { id: "personal-foul", caption: "Personal foul", mark: "strike",
    source: "Personal foul: one wrist striking the other above the head",
    left: { upper: 170, fore: 60 }, right: { upper: 170, fore: 60 } },
  { id: "pass-interference", caption: "Pass interference", toward: true,
    source: "Pass interference: hands open and extended forward from the shoulders",
    left: { upper: 75, fore: 0 }, right: { upper: 75, fore: 0 } },
  { id: "intentional-grounding", caption: "Intentional grounding", mark: "swing",
    source: "Intentional grounding: parallel arms waved in a diagonal plane across the body",
    left: { upper: 45, fore: 0 }, right: { upper: -45, fore: 0 } },
  { id: "delay-of-game", caption: "Delay of game",
    source: "Delay of game: folded arms",
    left: { upper: 5, fore: -95 }, right: { upper: 15, fore: -115 } },
  { id: "illegal-motion", caption: "Illegal motion at the snap", mark: "swing",
    source: "Illegal motion at the snap: horizontal arc with one hand",
    left: { upper: 0, fore: 0 }, right: { upper: 90, fore: 0 } },
  { id: "facemask", caption: "Facemask", mark: "rotate",
    source: "Facemask: grasping motion with one hand near the face",
    left: { upper: 0, fore: 0 }, right: { upper: 150, fore: -222 } },
  { id: "unsportsmanlike-conduct", caption: "Unsportsmanlike conduct",
    source: "Unsportsmanlike conduct: arms outstretched, palms down",
    left: { upper: 90, fore: 0 }, right: { upper: 90, fore: 0 } },
  { id: "too-many-men", caption: "Too many men on the field",
    source: "Too many men on the field: both hands on top of the head",
    left: { upper: 150, fore: 103 }, right: { upper: 150, fore: 103 } },
  { id: "refused-or-incomplete", caption: "Penalty refused, incomplete pass or missed kick", mark: "swing",
    source: "Penalty refused, incomplete pass, play over or missed kick: hands shifted in a horizontal plane",
    left: { upper: 60, fore: 0 }, right: { upper: 60, fore: 0 } },
];
