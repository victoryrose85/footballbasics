import { lineBox, lineupLayout, type LineupSpot } from "@/lib/diagrams/lineup";

// A lineup diagram: the players as the homepage drive draws them (offense orange, defense light blue), each labelled
// with its position, around the blue line of scrimmage. The kickoff instead shows shaded zones and labelled yard
// lines, named in a gutter on the left so no label sits on a player. Distances are in yards from the ball.
interface Zone { from: number; to: number; label: string; dark?: boolean } // dark: an end zone
interface Mark { at: number; label: string }

interface LineupProps {
  spots: LineupSpot[];
  title: string; // the SVG's <title>
  caption: string;
  layout?: Parameters<typeof lineupLayout>[1];
  zones?: Zone[];
  marks?: Mark[];
  scrimmage?: boolean; // draw the line of scrimmage (not on a kickoff)
  boxLine?: boolean; // box the offense's players on the line of scrimmage
}

const R = 7.5;

export default function Lineup({ spots, title, caption, layout, zones = [], marks = [], scrimmage = true, boxLine = false }: LineupProps) {
  const l = lineupLayout(spots, { ...layout, reach: [...(layout?.reach ?? []), ...zones.flatMap(z => [z.from, z.to]), ...marks.map(m => m.at)] });
  const box = boxLine ? lineBox(spots, l) : null;
  const gutter = zones.length || marks.length ? 90 : 0;
  const text = { fontSize: 11, fontWeight: 700, fill: "var(--ink)", textAnchor: "end" } as const;
  return (
    <figure className="diagram">
      <svg viewBox={`${-gutter} 0 ${l.width + gutter} ${l.height}`} role="img">
        <title>{title}</title>
        <rect x="0" y="0" width={l.width} height={l.height} rx="8" fill="var(--stripe-a)" />
        {zones.map(z => (
          <g key={z.label}>
            <rect x="0" y={l.yOf(z.from)} width={l.width} height={l.yOf(z.to) - l.yOf(z.from)} fill={z.dark ? "var(--ink)" : "#fff"} opacity={z.dark ? 0.25 : 0.22} />
            <text x="-8" y={(l.yOf(z.from) + l.yOf(z.to)) / 2 + 4} {...text}>{z.label}</text>
          </g>
        ))}
        {marks.map(m => (
          <g key={m.label}>
            <line x1="0" y1={l.yOf(m.at)} x2={l.width} y2={l.yOf(m.at)} stroke="#fff" strokeWidth="2" />
            <line x1="-6" y1={l.yOf(m.at)} x2="0" y2={l.yOf(m.at)} stroke="var(--ink)" strokeWidth="1.5" />
            <text x="-8" y={l.yOf(m.at) + 4} {...text}>{m.label}</text>
          </g>
        ))}
        {scrimmage && <line x1="0" y1={l.scrimmageY} x2={l.width} y2={l.scrimmageY} stroke="var(--los)" strokeWidth="3" />}
        {box && <rect {...box} rx="10" fill="#fff" fillOpacity=".25" stroke="#fff" strokeWidth="2" strokeDasharray="5 4" />}
        {l.dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={R} fill={d.side === "o" ? "var(--offense)" : "var(--defense)"} stroke="var(--ink)" strokeWidth="1.5" />
            {d.label && (
              <text x={d.x} y={d.y + 3.2} textAnchor="middle" fontSize={d.label.length > 1 ? 8.5 : 9.5} fontWeight="700" fill="var(--ink)">
                {d.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption><span className="call">{caption}</span></figcaption>
    </figure>
  );
}
