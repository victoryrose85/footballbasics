import DriveEngine from "./DriveEngine";
import { SLOTS } from "@/lib/drive/formations";
import { LESSONS } from "@/lib/drive/lessons";
import { SCENES, poseAt, showsLines } from "@/lib/drive/pose";
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
// The opening pan shows no blue or yellow line (ruling R8)
const lines = showsLines(SCENES[0]);

// The yard numbers, 10 to 50 and back. They stand a fixed distance either side of the window's middle (not on the
// field's sidelines, which a 24-yard window seldom shows): the engine slides their layer along with the camera.
const NUMBERS = [20, 30, 40, 50, 60, 70, 80, 90, 100].map((y) => ({ y, n: Math.min(y - 10, 110 - y) }));
const NUMBER_X = 9.5; // yards from the middle of the window
const MIDDLE = 26.65;
// The goalposts: a crossbar 18 ft 6 in (6.17 yd) wide, a little inside each end line so the window shows it
const POST_W = 6.17;
const POST_Y = [1.2, 118.8];

const SIDE_LABEL = { offense: "Offense", defense: "Defense", kicking: "Kicking plays" } as const;
const registered = new Set(PAGES.map((p) => p.path));
const offenseFirst = [...SLOTS.filter((s) => s[0] === "o"), ...SLOTS.filter((s) => s[0] === "d")];

export default function Drive() {
  return (
    <DriveEngine>
      <div className="window">
        <div className="field" style={{ "--cx": r2(pose.camera.x), "--cy": r2(pose.camera.y) } as React.CSSProperties}>
          <div className="yardlines" />
          <div className="nums" aria-hidden="true">
            {NUMBERS.flatMap(({ y, n }) => [
              <span key={`l${y}`} className="num l" style={at(MIDDLE - NUMBER_X, y)}>{n}</span>,
              <span key={`r${y}`} className="num r" style={at(MIDDLE + NUMBER_X, y)}>{n}</span>,
            ])}
          </div>
          {POST_Y.map((y) => (
            <div key={y} className="post" style={{ ...at(MIDDLE - POST_W / 2, y), "--w": POST_W } as React.CSSProperties} aria-hidden="true"><i /><i /></div>
          ))}
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
        <div className="hint" aria-hidden="true">Tap players to see more</div>
        <div className="tips" aria-live="polite">
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
            <p className="lead" dangerouslySetInnerHTML={html(l.lead)} />
            <ul className="beats">
              {l.beats.map((b, j) => <li key={j} data-focus={(b.focus ?? []).join(" ")} dangerouslySetInnerHTML={html(b.html)} />)}
            </ul>
            {l.more && registered.has(l.more.href) && (
              <a className="more" href={l.more.href} dangerouslySetInnerHTML={html(`${l.more.label} &rarr;`)} />
            )}
          </article>
        ))}
      </div>
    </DriveEngine>
  );
}
