import { armPoints, type Signal as SignalPose } from "@/lib/diagrams/signals";

// One official's signal: a front-view stick figure in ink, posed from the rulebook's words (lib/diagrams/signals.ts),
// with a small mark for any motion the book describes.
const SHOULDER = 12;
const INK = "var(--ink)";

export default function Signal({ signal }: { signal: SignalPose }) {
  const sides = (["left", "right"] as const).map(side => {
    const pts = armPoints([side === "left" ? -SHOULDER : SHOULDER, 0], signal[side], side);
    // an arm reaching toward you looks short from the front
    return signal.toward ? pts.map(([x, y], i) => (i ? [pts[0][0] + (x - pts[0][0]) * 0.35, pts[0][1] + (y - pts[0][1]) * 0.35] : [x, y])) : pts;
  });
  const hands = sides.map(pts => pts[2]);
  const moving = signal.left.upper === 0 && signal.left.fore === 0 ? [hands[1]] : hands; // a hanging arm doesn't move
  return (
    <figure className="diagram">
      <svg viewBox="-64 -52 128 128" role="img">
        <title>{`The officials' signal for ${signal.caption.toLowerCase()}: ${signal.source.split(": ").at(-1)}`}</title>
        <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="0" cy="-14" r="9" fill="#fff" />
          <path d={`M-${SHOULDER},0 H${SHOULDER} M0,-5 V34 M-7,34 H7 M-7,34 L-10,72 M7,34 L10,72`} />
          {sides.map((pts, i) => <polyline key={i} points={pts.map(p => p.join(",")).join(" ")} />)}
        </g>
        {hands.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={signal.toward ? 5.5 : 3.5} fill={signal.toward ? "#fff" : INK} stroke={INK} strokeWidth="2.5" />
        ))}
        <g fill="none" stroke="var(--los)" strokeWidth="2.5" strokeLinecap="round">
          {signal.mark === "rotate" && moving.map(([x, y], i) => (
            <path key={i} d={`M${x - 9},${y - 3} A9,9 0 1,1 ${x - 3},${y + 8.5} m-1,-6 l1,6 l-6,1`} />
          ))}
          {signal.mark === "strike" && (() => {
            const [x, y] = [(hands[0][0] + hands[1][0]) / 2, (hands[0][1] + hands[1][1]) / 2];
            return <path d={`M${x},${y - 8} v-6 M${x - 8},${y - 5} l-5,-4 M${x + 8},${y - 5} l5,-4`} />;
          })()}
          {signal.mark === "swing" && moving.map(([x, y], i) => (
            <path key={i} d={`M${x - 8},${y + 9} Q${x},${y + 15} ${x + 8},${y + 9} m-5,-1 l5,1 l-1,-5 M${x - 8},${y + 9} m5,-1 l-5,1 l1,-5`} />
          ))}
        </g>
      </svg>
      <figcaption>{signal.caption}</figcaption>
    </figure>
  );
}
