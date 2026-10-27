// The goalposts from the front, drawn to scale from the rulebook (rules check, row 71): a crossbar 18 feet 6 inches
// wide with its top 10 feet above the ground, and uprights rising 35 feet above it, on a single post.
const FT = 6; // drawing units per foot
const GROUND = 300;
const MID = 150;
const BAR = GROUND - 10 * FT;
const TOP = BAR - 35 * FT;
const HALF = (18.5 * FT) / 2;

const label = { fontSize: 15, fontWeight: 700, fill: "var(--ink)" } as const;

export default function Goalposts({ caption }: { caption: string }) {
  const [l, r] = [MID - HALF, MID + HALF];
  return (
    <figure className="diagram">
      <svg viewBox="0 0 300 316" role="img">
        <title>NFL goalposts from the front: a crossbar 18 feet 6 inches wide, 10 feet off the ground, with uprights rising 35 feet above it</title>
        <line x1="10" y1={GROUND} x2="290" y2={GROUND} stroke="var(--stripe-a)" strokeWidth="6" />
        <g stroke="var(--first-down)" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d={`M${MID},${GROUND} V${BAR} M${l},${BAR} H${r} M${l},${BAR} V${TOP} M${r},${BAR} V${TOP}`} />
        </g>
        <g stroke="var(--ink)" strokeWidth="1.5" fill="none">
          <path d={`M${MID},${GROUND} V${BAR} M${l},${BAR} H${r} M${l},${BAR} V${TOP} M${r},${BAR} V${TOP}`} opacity=".35" />
        </g>
        <path d={`M${l},${TOP} v-14 M${r},${TOP} v-14`} stroke="var(--offense)" strokeWidth="4" />
        <g stroke="var(--ink)" strokeWidth="2" fill="none">
          <path d={`M${l + 4},${BAR - 20} H${r - 4} m-7,-5 l7,5 l-7,5 M${l + 11},${BAR - 25} l-7,5 l7,5`} />
          <path d={`M62,${GROUND} V${BAR} m-5,7 l5,-7 l5,7 M57,${GROUND - 7} l5,7 l5,-7`} />
          <path d={`M238,${BAR} V${TOP} m-5,7 l5,-7 l5,7 M233,${BAR - 7} l5,7 l5,-7`} />
        </g>
        <text x={MID} y={BAR - 30} textAnchor="middle" {...label}>18 ft 6 in</text>
        <text x="54" y={(GROUND + BAR) / 2 + 5} textAnchor="end" {...label}>10 ft</text>
        <text x="246" y={(BAR + TOP) / 2 + 5} {...label}>35 ft</text>
        <text x={l - 8} y={(BAR + TOP) / 2 + 5} textAnchor="end" {...label}>Upright</text>
        <text x={MID + 8} y={GROUND - 22} {...label}>Crossbar</text>
        <path d={`M${MID + 10},${GROUND - 36} L${MID + 18},${BAR + 6}`} stroke="var(--ink)" strokeWidth="1.5" />
      </svg>
      <figcaption><span className="call">{caption}</span></figcaption>
    </figure>
  );
}
