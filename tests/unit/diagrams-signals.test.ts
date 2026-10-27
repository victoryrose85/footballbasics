import { expect, test } from "vitest";
import { SIGNALS, armPoints } from "@/lib/diagrams/signals";

test("twelve signals, in the plan's order, each from the rulebook's words", () => {
  expect(SIGNALS.map(s => s.id)).toHaveLength(12);
  expect(new Set(SIGNALS.map(s => s.id)).size).toBe(12);
  for (const s of SIGNALS) expect(s.source.length, s.id).toBeGreaterThan(20);
});

test("an arm hanging down points down, and 180 degrees points up", () => {
  expect(armPoints([0, 0], { upper: 0, fore: 0 }, "left").at(-1)).toEqual([0, 38]);
  const up = armPoints([0, 0], { upper: 180, fore: 0 }, "right").at(-1)!;
  expect(up[0]).toBeCloseTo(0); expect(up[1]).toBeCloseTo(-38);
});

test("a left arm swung out goes left, a right arm goes right", () => {
  expect(armPoints([0, 0], { upper: 90, fore: 0 }, "left").at(-1)![0]).toBeLessThan(0);
  expect(armPoints([0, 0], { upper: 90, fore: 0 }, "right").at(-1)![0]).toBeGreaterThan(0);
});

test("the forearm bends from the elbow", () => {
  // upper arm straight out to the right, forearm bent up: the hand ends above the elbow
  const [, elbow, hand] = armPoints([0, 0], { upper: 90, fore: 90 }, "right");
  expect(elbow[0]).toBeCloseTo(20); expect(elbow[1]).toBeCloseTo(0);
  expect(hand[0]).toBeCloseTo(20); expect(hand[1]).toBeCloseTo(-18);
});

test("hands on the hips stay beside the body, and hands on the head meet above it", () => {
  const pose = (id: string) => SIGNALS.find(s => s.id === id)!;
  const hand = (id: string, side: "left" | "right") =>
    armPoints([side === "left" ? -12 : 12, 0], pose(id)[side], side).at(-1)!;
  for (const side of ["left", "right"] as const) {
    const h = hand("offside", side);
    expect(Math.abs(h[0])).toBeLessThan(18); expect(h[1]).toBeGreaterThan(20); // at the hip, not out wide
    const top = hand("too-many-men", side);
    expect(Math.abs(top[0])).toBeLessThan(8); expect(top[1]).toBeLessThan(-18); // on top of the head
  }
});
