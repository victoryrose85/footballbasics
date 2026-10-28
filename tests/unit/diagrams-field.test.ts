import { expect, test } from "vitest";
import { FIELD, fieldMarks } from "@/lib/diagrams/field";

test("a 5-yard line from goal line to goal line", () => {
  const { yardLines } = fieldMarks();
  expect(yardLines).toHaveLength(21);
  expect(yardLines[0]).toBe(10); expect(yardLines.at(-1)).toBe(110);
});

test("numbers count up to the 50 and back down, with arrows at the nearer goal line", () => {
  const { numbers } = fieldMarks();
  expect(numbers.map(n => n.label)).toEqual(["10", "20", "30", "40", "50", "40", "30", "20", "10"]);
  expect(numbers[0]).toMatchObject({ y: 20, arrow: "toward-low" });
  expect(numbers[4].arrow).toBeNull();
  expect(numbers[8]).toMatchObject({ y: 100, arrow: "toward-high" });
});

test("hash marks 70 feet 9 inches in from each sideline, try marks at the 2", () => {
  const { hashes, tryMarks } = fieldMarks();
  expect(hashes[0]).toBeCloseTo(23.583, 2);
  expect(FIELD.width - hashes[1]).toBeCloseTo(23.583, 2);
  expect(tryMarks).toEqual([12, 108]);
});
