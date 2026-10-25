import DriveEngine from "./DriveEngine";
import { SLOTS } from "@/lib/drive/formations";
import { LESSONS } from "@/lib/drive/lessons";
import { SCENES, poseAt } from "@/lib/drive/pose";
import { POSITION_TIPS } from "@/lib/drive/tips";
import { PAGES } from "@/lib/pages";

// The drive's markup, rendered on the server so every word is in the HTML: the window (the field, the players,
// the down-and-distance tag and the position tips) and the 23 lessons. Class names and data attributes are the
// contract the engine relies on. Field positions are yards, set as --x/--y and turned into pixels by drive.css
// (--u, px per yard); the engine later writes the transforms itself.

const html = (s: string) => ({ __html: s });
const r2 = (v: number) => Math.round(v * 100) / 100;
const at = (x: number, y: number) => ({ "--x": r2(x), "--y": r2(y) }) as React.CSSProperties;

// The first frame, before any JavaScript runs: lesson 0 at its start
const pose = poseAt(0, 0);
// The kicking scenes show no blue or yellow line (ruling R8)
const lines = !(SCENES[0] === "field" || SCENES[0] === "kickoff" || SCENES[0] === "kickoff-after");

// The yard numbers, 10 to 50 and back, on both sides of the field
const NUMBERS = [20, 30, 40, 50, 60, 70, 80, 90, 100].map((y) => ({ y, n: Math.min(y - 10, 110 - y) }));

const SIDE_LABEL = { offense: "Offense", defense: "Defense", kicking: "Kicking plays" } as const;
const registered = new Set(PAGES.map((p) => p.path));
const offenseFirst = [...SLOTS.filter((s) => s[0] === "o"), ...SLOTS.filter((s) => s[0] === "d")];

export default function Drive() {
  return (
    <DriveEngine>
      <div className="window">
        <div className="field" style={{ "--cx": r2(pose.camera.x), "--cy": r2(pose.camera.y) } as React.CSSProperties}>
          <div className="yardlines" />
          {NUMBERS.flatMap(({ y, n }) => [
            <span key={`l${y}`} className="num l" style={at(10, y)} aria-hidden="true">{n}</span>,
            <span key={`r${y}`} className="num r" style={at(43.3, y)} aria-hidden="true">{n}</span>,
          ])}
          <div className="los" style={{ ...at(0, pose.los), opacity: lines ? 1 : 0 }} />
          <div className="fd" style={{ ...at(0, pose.firstDown ?? 0), opacity: lines && pose.firstDown !== null ? 1 : 0 }} />
          <div className="flag" hidden />
          <div className="ball" style={at(pose.ball.x, pose.ball.y)} />
          <div className="players">
            {offenseFirst.map((slot) => {
              const p = pose.players[slot];
              const shown = p.opacity > 0;
              return (
                <button
                  key={slot}
                  type="button"
                  className={`pl ${slot[0]}${pose.labels.includes(slot) ? " lab" : ""}`}
                  data-slot={slot}
                  aria-expanded="false"
                  aria-controls={`tip-${p.pos}`}
                  tabIndex={shown ? undefined : -1}
                  aria-hidden={shown ? undefined : true}
                  style={{ ...at(p.x, p.y), opacity: r2(p.opacity) }}
                >
                  <span className="dot" />
                  <span className="nm">{POSITION_TIPS[p.pos].title}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="dtag">{pose.tag}</div>
        <div className="tips">
          {Object.entries(POSITION_TIPS).map(([pos, tip]) => (
            <div key={pos} className="info" id={`tip-${pos}`} hidden>
              <div className="ih">
                <b>{tip.title}</b>
                <i className={tip.side}>{SIDE_LABEL[tip.side]}</i>
              </div>
              <span dangerouslySetInnerHTML={html(tip.html)} />
            </div>
          ))}
        </div>
      </div>
      <div className="lessons">
        {LESSONS.map((l, i) => (
          <article key={i} className="lesson block" data-lesson={i}>
            <div className="k">{l.kicker}</div>
            <h2 dangerouslySetInnerHTML={html(l.heading)} />
            <p dangerouslySetInnerHTML={html(l.html)} />
            {l.more && registered.has(l.more.href) && (
              <a className="more" href={l.more.href} dangerouslySetInnerHTML={html(`${l.more.label} &rarr;`)} />
            )}
          </article>
        ))}
      </div>
    </DriveEngine>
  );
}
