import { FIELD, fieldMarks } from "@/lib/diagrams/field";

// The whole field from above, drawn lengthwise so the labels stay readable on a phone: the end lines at the left
// and right, the sidelines along the top and bottom (rules check, rows 67 to 71). Every mark is to scale except
// the numbers, which are drawn larger than their real 2 yards so they can be read.
const U = 4; // drawing units per yard
const M = 26; // margin left and right, room for the goalposts' posts
const T = 62; // room above the field for labels
const B = 62; // and below it
const W = FIELD.length * U + 2 * M;
const H = T + FIELD.width * U + B;

const px = (y: number) => M + y * U; // along the field
const py = (x: number) => T + x * U; // across it
const TOP = py(0);
const BOTTOM = py(FIELD.width);
const MID = py(FIELD.width / 2);

const label = { fontSize: 18, fontWeight: 700, fill: "var(--ink)" } as const;
const inside = { fontSize: 17, fontWeight: 700, fill: "#fff" } as const;

// Labels outside the field, each with a leader line to what it names.
const CALLOUTS: { text: string; x: number; anchor?: "start" | "middle" | "end"; above: boolean; to: [number, number] }[] = [
  { text: "End zone", x: px(5), above: true, to: [px(5), py(4)] },
  { text: "Sideline", x: px(60), above: true, to: [px(60), TOP] },
  { text: "Pylon", x: px(110), above: true, to: [px(110), TOP - 4] },
  { text: "Goalposts", x: 4, anchor: "start", above: false, to: [M - 4, MID + 14] },
  { text: "Goal line", x: px(36), above: false, to: [px(10), BOTTOM] },
  { text: "Yard numbers", x: px(64), above: false, to: [px(60), py(FIELD.width - 7.5)] },
  { text: "End line", x: px(110), above: false, to: [px(120), BOTTOM] },
];

function Arrow({ x, y, dir }: { x: number; y: number; dir: -1 | 1 }) {
  return <path d={`M${x},${y} l${-dir * 7},-5 v10 z`} fill="#fff" />;
}

export default function FieldDiagram({ caption }: { caption: string }) {
  const { yardLines, numbers, hashes, tryMarks } = fieldMarks();
  const ticks: number[] = [];
  for (let y = FIELD.endZone + 1; y < FIELD.length - FIELD.endZone; y++) if (y % 5) ticks.push(y);
  const pylons = [10, 110].flatMap(y => [[px(y), TOP], [px(y), BOTTOM]]);
  const hashLabelY = (py(hashes[0]) + py(hashes[1])) / 2;
  return (
    <figure className="diagram wide">
      <svg viewBox={`0 0 ${W} ${H}`} role="img">
        <title>
          An NFL field from above: 120 yards long including an end zone at each end, 53 1/3 yards wide, with a line
          every 5 yards, numbers every 10, two rows of hash marks, the 2-yard marks and the goalposts on the end lines
        </title>
        <rect x={px(0)} y={TOP} width={FIELD.length * U} height={FIELD.width * U} fill="var(--stripe-a)" />
        {[0, 110].map(y => (
          <rect key={y} x={px(y)} y={TOP} width={10 * U} height={FIELD.width * U} fill="var(--ink)" opacity=".28" />
        ))}

        <g stroke="#fff">
          {yardLines.map(y => (
            <line key={y} x1={px(y)} y1={TOP} x2={px(y)} y2={BOTTOM} strokeWidth={y === 10 || y === 110 ? 3 : 1.5} />
          ))}
          {ticks.flatMap(y => [
            [TOP, TOP + 3], [BOTTOM - 3, BOTTOM],
            [py(hashes[0]) - 1.5, py(hashes[0]) + 1.5], [py(hashes[1]) - 1.5, py(hashes[1]) + 1.5],
          ].map(([a, b], i) => <line key={`${y}-${i}`} x1={px(y)} y1={a} x2={px(y)} y2={b} strokeWidth="1.2" />))}
          {tryMarks.map(y => <line key={y} x1={px(y)} y1={MID - 2} x2={px(y)} y2={MID + 2} strokeWidth="3" />)}
          <rect x={px(0)} y={TOP} width={FIELD.length * U} height={FIELD.width * U} fill="none" strokeWidth="2.5" />
        </g>

        {/* The numbers face their own sideline: bottoms 12 yards in, tops toward the sideline. */}
        {numbers.map(n => [12, FIELD.width - 12].map((x, row) => (
          <g key={`${n.y}-${row}`} transform={row ? `rotate(180 ${px(n.y)} ${py(x)})` : undefined}>
            <text x={px(n.y)} y={py(x)} textAnchor="middle" {...inside}>{n.label}</text>
            {n.arrow && (
              <Arrow x={px(n.y) + (n.arrow === "toward-low" ? -1 : 1) * (row ? -1 : 1) * 24} y={py(x) - 6}
                dir={((n.arrow === "toward-low" ? -1 : 1) * (row ? -1 : 1)) as -1 | 1} />
            )}
          </g>
        )))}

        <rect x={px(22.5)} y={hashLabelY - 10} width={22 * U} height="20" fill="var(--stripe-a)" />
        <text x={px(33.5)} y={hashLabelY + 6} textAnchor="middle" {...inside}>Hash marks</text>
        <rect x={px(84)} y={hashLabelY - 10} width={22 * U} height="20" fill="var(--stripe-a)" />
        <text x={px(95)} y={hashLabelY + 6} textAnchor="middle" {...inside}>2-yard mark</text>
        <path d={`M${px(106.5)},${MID} h${-1.5 * U}`} stroke="#fff" strokeWidth="1.5" />

        <g stroke="var(--first-down)" strokeWidth="4" strokeLinecap="round">
          {[0, 120].map(y => (
            <g key={y}>
              <line x1={px(y)} y1={MID - 9.25 / 3 * U} x2={px(y)} y2={MID + 9.25 / 3 * U} />
              <line x1={px(y)} y1={MID} x2={px(y) + (y ? 1 : -1) * 14} y2={MID} strokeWidth="3" />
            </g>
          ))}
        </g>
        {pylons.map(([x, y], i) => <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill="var(--offense)" stroke="var(--ink)" strokeWidth="1" />)}

        <g stroke="var(--ink)" strokeWidth="1.5">
          {CALLOUTS.map(c => <line key={c.text} x1={c.anchor === "start" ? c.x + 20 : c.x} y1={c.above ? T - 24 : BOTTOM + 24} x2={c.to[0]} y2={c.to[1]} />)}
        </g>
        {CALLOUTS.map(c => (
          <text key={c.text} x={c.x} y={c.above ? T - 30 : BOTTOM + 44} textAnchor={c.anchor ?? "middle"} {...label}>{c.text}</text>
        ))}
      </svg>
      <figcaption><span className="call">{caption}</span></figcaption>
    </figure>
  );
}
