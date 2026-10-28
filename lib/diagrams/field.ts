// The field guide's marks, in yards (rules check, rows 67 to 70): y runs 0 to 120 from one end line to the
// other, x 0 to 53 1/3 across. The goal lines are 10 yards in from the end lines.
export const FIELD = {
  length: 120,
  width: 160 / 3, // 160 feet
  endZone: 10,
  hashFromSideline: 70.75 / 3, // 70 feet 9 inches
} as const;

const GOAL_LOW = FIELD.endZone;
const GOAL_HIGH = FIELD.length - FIELD.endZone;

export function fieldMarks() {
  const yardLines: number[] = [];
  for (let y = GOAL_LOW; y <= GOAL_HIGH; y += 5) yardLines.push(y);

  // A number every 10 yards, counting up to the 50 and back down, each with an arrow toward the nearer goal line
  // (none beside the 50).
  const numbers: { y: number; label: string; arrow: "toward-low" | "toward-high" | null }[] = [];
  for (let y = GOAL_LOW + 10; y < GOAL_HIGH; y += 10) {
    const fromGoal = Math.min(y - GOAL_LOW, GOAL_HIGH - y);
    const arrow = y < 60 ? "toward-low" : y > 60 ? "toward-high" : null;
    numbers.push({ y, label: String(fromGoal), arrow });
  }

  const hashes: [number, number] = [FIELD.hashFromSideline, FIELD.width - FIELD.hashFromSideline];
  const tryMarks = [GOAL_LOW + 2, GOAL_HIGH - 2]; // the 2-yard marks, where a two-point try is snapped
  return { yardLines, numbers, hashes, tryMarks };
}
