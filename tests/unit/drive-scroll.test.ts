import { describe, expect, it } from "vitest";
import { cameraY, placeLabel, type Box } from "@/lib/drive/apply";
import { progress, refLine } from "@/lib/drive/scroll";

describe("the scroll clock", () => {
  const tops = [100, 300, 600];

  it("holds lesson 0 at its start above the first lesson", () => {
    expect(progress(50, tops, 900)).toEqual({ lesson: 0, t: 0 });
  });
  it("runs each lesson from its top to the next lesson's top", () => {
    expect(progress(200, tops, 900)).toEqual({ lesson: 0, t: 0.5 });
    expect(progress(600, tops, 900)).toEqual({ lesson: 2, t: 0 });
    expect(progress(750, tops, 900)).toEqual({ lesson: 2, t: 0.5 });
  });
  it("holds the last lesson at its end below the last lesson", () => {
    expect(progress(1000, tops, 900)).toEqual({ lesson: 2, t: 1 });
    expect(progress(900, tops, 900)).toEqual({ lesson: 2, t: 1 });
  });
  it("reads the lessons 40% of the way down what the window leaves on a phone, and halfway down on a desktop", () => {
    expect(refLine(640, 269, false)).toBe(269 + 0.4 * 371);
    expect(refLine(900, 640, true)).toBe(450);
  });
});

describe("the camera", () => {
  it("never shows past an end line, whatever the window's height", () => {
    // 15 px a yard and 300 px tall: the window shows 10 yards either side of its center
    expect(cameraY(8, 15, 300)).toBe(10);
    expect(cameraY(112, 15, 300)).toBe(110);
    expect(cameraY(60, 15, 300)).toBe(60);
    // a desktop window 634 px tall at 12.5 px a yard shows 25.36 yards either side
    expect(cameraY(20, 12.5, 634)).toBeCloseTo(25.36, 5);
    expect(cameraY(30, 12.5, 634)).toBe(30);
  });
});

describe("a player's label", () => {
  const bounds: Box = { x0: 0, y0: 0, x1: 360, y1: 230 };
  const dotAt = (x: number, y: number): Box => ({ x0: x - 7, y0: y - 7, x1: x + 7, y1: y + 7 });
  const hits = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

  it("sits to the right of its dot when nothing is near", () => {
    const { box } = placeLabel([100, 100], 60, [], bounds, null);
    expect(box.x0).toBeGreaterThan(100);
    expect(box.y0).toBeLessThan(100);
    expect(box.y1).toBeGreaterThan(100);
  });
  it("goes to the side away from the nearest dot", () => {
    const { box } = placeLabel([100, 100], 60, [dotAt(118, 100)], bounds, [-1, 0]);
    expect(box.x1).toBeLessThan(100);
    expect(hits(box, dotAt(118, 100))).toBe(false);
  });
  it("stays inside the window near its edges", () => {
    for (const at of [[355, 100], [5, 100], [100, 3], [100, 228]] as [number, number][]) {
      const { box } = placeLabel(at, 70, [], bounds, null);
      expect(box.x0).toBeGreaterThanOrEqual(bounds.x0);
      expect(box.x1).toBeLessThanOrEqual(bounds.x1);
      expect(box.y0).toBeGreaterThanOrEqual(bounds.y0);
      expect(box.y1).toBeLessThanOrEqual(bounds.y1);
    }
  });
  it("finds a clear spot between neighbors on three sides", () => {
    const around = [dotAt(80, 100), dotAt(120, 100), dotAt(100, 125)];
    const { box } = placeLabel([100, 100], 60, around, bounds, null);
    for (const d of around) expect(hits(box, d)).toBe(false);
  });
  it("depends only on where everything is, so a scroll position always shows the same labels", () => {
    const around = [dotAt(118, 100), dotAt(100, 125)];
    expect(placeLabel([100, 100], 60, around, bounds, [-1, 0])).toEqual(placeLabel([100, 100], 60, around, bounds, [-1, 0]));
  });
});
