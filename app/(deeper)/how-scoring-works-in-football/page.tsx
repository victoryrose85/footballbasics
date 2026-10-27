import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import Goalposts from "@/components/deeper/Goalposts";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/how-scoring-works-in-football");

// Three side views of the goal line, left to right: the ball carried over it, a ball just short, and a ball
// touching the pylon. The dashed line is the goal line's plane, rising from the ground.
const PLANE = [
  { x: 63, y: 70, call: "Touchdown", note: "over the line" },
  { x: 44, y: 92, call: "Short", note: "of the line" },
  { x: 50, y: 92, call: "Touchdown", note: "on the pylon", pylon: true },
];

function PlaneDiagram() {
  return (
    <figure className="diagram">
      <svg viewBox="0 0 330 176" role="img">
        <title>Three side views of the goal line: a ball carried over the line is a touchdown, a ball short of it is not, and a ball touching the pylon is a touchdown</title>
        {PLANE.map((p, i) => {
          const x0 = i * 110;
          return (
            <g key={i}>
              <rect x={x0 + 4} y="40" width="58" height="80" fill="var(--tint)" />
              <rect x={x0 + 62} y="40" width="44" height="80" fill="var(--stripe-a)" opacity=".35" />
              <line x1={x0 + 4} y1="120" x2={x0 + 106} y2="120" stroke="var(--ink)" strokeWidth="3" />
              <line x1={x0 + 62} y1="120" x2={x0 + 62} y2="34" stroke="var(--ink)" strokeWidth="2" strokeDasharray="5 4" />
              <text x={x0 + 62} y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ink)">goal line</text>
              {p.pylon && <rect x={x0 + 60} y="104" width="8" height="16" fill="var(--offense)" stroke="var(--ink)" strokeWidth="1.5" />}
              <line x1={x0 + 14} y1={p.y + 22} x2={x0 + p.x - 12} y2={p.y + 2} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx={x0 + p.x} cy={p.y} rx="12" ry="7" fill="var(--ball)" stroke="var(--ink)" strokeWidth="1.5" transform={p.pylon ? `rotate(20 ${x0 + p.x} ${p.y})` : undefined} />
              <text x={x0 + 55} y="146" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ink)">{p.call}</text>
              <text x={x0 + 55} y="166" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--ink)">{p.note}</text>
            </g>
          );
        })}
      </svg>
      <figcaption><span className="call">The ball only has to touch the goal line&rsquo;s plane</span></figcaption>
    </figure>
  );
}

export default function ScoringPage() {
  return (
    <DeeperPage
      path="/how-scoring-works-in-football"
      intro={
        <p>
          A touchdown is worth 6 points, a field goal 3 and a safety 2. After every touchdown, the scoring team gets one
          more snap, the try, worth 1 point for a kick through the goalposts or 2 for getting the ball into the end zone
          again. Those five scores are the only ways to put points on the board, and the defense can score some of them
          too.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive ends the way you hope a drive will: a touchdown catch in the end zone on 2nd & goal, the extra point kicked from the 15, and then a kickoff to the other team as the roles swap.",
      }}
      related={["/special-teams-explained", "/nfl-overtime-rules", "/downs-in-football", "/how-the-nfl-season-works"]}
    >
      <Section title="The five ways to score">
        <Block kicker="At a glance" title="Points at a glance">
          <div className="table-wrap">
            <table className="data">
              <caption>Every way to score in the NFL, and what each is worth</caption>
              <thead>
                <tr><th scope="col">Score</th><th scope="col">Points</th><th scope="col">How it happens</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Touchdown</th><td>6</td><td className="prose">The ball is carried into, caught in or recovered in the other team&rsquo;s end zone.</td></tr>
                <tr><th scope="row">Field goal</th><td>3</td><td className="prose">The ball is kicked over the crossbar and between the uprights during a normal play.</td></tr>
                <tr><th scope="row">Safety</th><td>2</td><td className="prose">The team with the ball is stopped in its own end zone. The points go to the other team.</td></tr>
                <tr><th scope="row">Extra point</th><td>1</td><td className="prose">After a touchdown, a kick through the goalposts from a snap at the 15.</td></tr>
                <tr><th scope="row">Two-point try</th><td>2</td><td className="prose">After a touchdown, a run or a pass into the end zone from a snap at the 2.</td></tr>
              </tbody>
            </table>
          </div>
        </Block>
        <Block kicker="On TV" title="The score you see on TV">
          <p>
            The score sits in the bar at the bottom or top of the TV picture, one number for each team, and it changes
            only after one of these five. A team&rsquo;s total therefore tends to come in familiar steps: 7 for a
            touchdown with the extra point, 3 for a field goal, 8 for a touchdown with a two-point try. A final score
            like 24 to 17 is three touchdowns and a field goal against two touchdowns and a field goal, each touchdown
            followed by a good kick.
          </p>
        </Block>
      </Section>

      <Section title="The touchdown">
        <Block kicker="The rule" title="What counts as in the end zone">
          <p>
            The <strong>end zone</strong> is the 10-yard area at each end of the field, and the white goal line at
            its front edge counts as part of it. A touchdown is scored when any part of the ball is on, over or past
            the other team&rsquo;s goal line while a player who is in bounds has hold of it. The whole player
            doesn&rsquo;t have to get there; the ball does. A runner tackled at the 1 who stretches the ball over the
            line has scored, as long as he still holds it when it crosses.
          </p>
          <PlaneDiagram />
          <p>
            The <strong>pylons</strong>, the markers that stand at each end of the goal line, are part of the end zone
            too. A runner diving toward the corner scores if the ball touches the pylon, or if he&rsquo;s in the air and
            the ball passes over or inside it.
          </p>
        </Block>
        <Block kicker="Three ways" title="How a touchdown is scored">
          <p>
            Most touchdowns come in one of three ways: a runner carries the ball across the goal line, a receiver
            catches a pass in the end zone, or a player falls on a loose ball there. A catch in the end zone has to
            be a complete catch, with the ball under control and the receiver touching down in bounds, which is why
            replay review looks at every touchdown.
          </p>
        </Block>
        <Block kicker="The other side" title="Touchdowns by the defense">
          <p>
            The defense can score touchdowns too. When a defender catches a pass meant for the offense, an
            <strong> interception</strong>, or picks up a ball the offense has dropped, a <strong>fumble</strong>, he
            can run it back the other way, and if he reaches the end zone it&rsquo;s worth the same 6 points. An
            interception returned for a touchdown is called a <strong>pick six</strong>.
          </p>
        </Block>
      </Section>

      <Section title="The try after a touchdown">
        <Block kicker="1 point" title="The extra point">
          <p>
            After a touchdown the scoring team gets one more snap, called the <strong>try</strong> or the
            conversion. Most teams kick it. The ball is snapped from 15 yards out, a holder sets it on the ground and
            the kicker sends it through the goalposts for 1 point. Counting the 10 yards of the end zone, which the
            goalposts stand behind, that&rsquo;s a 33-yard kick.
          </p>
        </Block>
        <Block kicker="2 points" title="The two-point try">
          <p>
            Instead of kicking, the team can snap the ball from the 2-yard line, marked on the field by a short line,
            and run or pass it into the end zone for 2 points. It works like any other play from close range, except
            there&rsquo;s only one chance.
          </p>
        </Block>
        <Block kicker="The defense" title="Either team can score on a try">
          <p>
            A try isn&rsquo;t timed, so the clock doesn&rsquo;t run, and it ends as soon as either team scores or the
            play is over. The defense can score on it: if a defender intercepts a pass or picks up a fumble and returns it
            all the way to the other end zone, his team gets 2 points. And in the very rare case that a try ends in what
            would otherwise be a safety, it&rsquo;s worth 1 point instead of 2.
          </p>
        </Block>
        <Block kicker="The choice" title="Which one to choose">
          <p>
            Teams usually kick. They usually go for 2 when the score calls for it, most often late in a game, when one
            point would leave them short of tying or taking the lead and two would not.
          </p>
        </Block>
      </Section>

      <Section title="The field goal">
        <Block kicker="3 points" title="What makes one good">
          <p>
            A <strong>field goal</strong> is a kick from behind the line of scrimmage, the line where each play starts,
            during an ordinary down. The ball is snapped to a holder, who sets it on the ground; no tee is allowed. The
            kick is good if the whole ball passes over the crossbar and between the two uprights, or above them and
            between their outside edges if it goes higher than they do. It can&rsquo;t touch the ground or one of the
            kicking team&rsquo;s players first.
          </p>
          <Goalposts caption="NFL goalposts, drawn to scale" />
          <p>
            The goalposts stand on the end line at the back of the end zone, on a single padded post, with an orange
            ribbon on top of each upright.
          </p>
        </Block>
        <Block kicker="The distance" title="How far is the kick?">
          <p>
            A field goal&rsquo;s length is measured from where the ball is kicked to the goalposts. The goalposts are
            10 yards behind the goal line, and the holder usually sets the ball about 7 yards behind the line of
            scrimmage. So a team with the ball on the other team&rsquo;s 20 is trying a kick of about 37 yards: 20,
            plus 7, plus 10. That&rsquo;s why the TV adds about 17 yards to where the ball is to give the distance.
          </p>
        </Block>
        <Block kicker="The miss" title="If it misses">
          <p>
            A missed field goal is costly. If the kick crosses the line of scrimmage and nobody on the other team touches
            it, that team takes over at the spot where the ball was kicked, or at its own 20 if the kick came from
            inside the 20. A miss from 50 yards hands the other team good field position. Kicking is one of the three
            choices a team has on fourth down, which the{" "}
            <GuideLink href="/special-teams-explained">guide to special teams</GuideLink> covers along with punts and
            kickoffs.
          </p>
        </Block>
      </Section>

      <Section title="The safety">
        <Block kicker="2 points" title="How it happens">
          <p>
            A <strong>safety</strong> is 2 points for the defense, and it happens when the team with the ball is stuck
            in its own end zone. The most common way is a runner or a quarterback tackled there. It&rsquo;s also a
            safety if the offense sends the ball out of bounds behind its own goal line, or if it commits a foul in its
            own end zone and the defense takes the penalty there.
          </p>
        </Block>
        <Block kicker="And then" title="What follows a safety">
          <p>
            After a touchdown or a field goal, the team that scored kicks off to the other team. A safety is different:
            the team that gave up the 2 points also has to kick the ball away, from its own 20. So the defense gets the
            points and the ball as well, which makes a safety one of the most damaging plays in the game.
          </p>
        </Block>
      </Section>

      <Section title="One drive, scored">
        <Block kicker="Worked example" title="The homepage drive, and a drive that stalls">
          <p>
            Here is the homepage drive&rsquo;s finish, followed by a second drive that runs out of downs near the end
            zone and settles for a field goal.
          </p>
          <div className="table-wrap">
            <table className="data">
              <caption>Two drives, scored play by play</caption>
              <thead>
                <tr><th scope="col">Situation</th><th scope="col">The play</th><th scope="col">Points</th><th scope="col">Total</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">2nd &amp; goal, opp 3</th><td>Touchdown catch</td><td>6</td><td>6</td></tr>
                <tr><th scope="row">The try, from the 15</th><td>Extra point is good</td><td>1</td><td>7</td></tr>
                <tr><th scope="row">3rd &amp; 8, opp 20</th><td>Incomplete pass</td><td>0</td><td>7</td></tr>
                <tr><th scope="row">4th &amp; 8, opp 20</th><td>37-yard field goal</td><td>3</td><td>10</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The first drive ends with 7 points: the touchdown and the kick. The second gets to the 20 but can&rsquo;t
            convert third down, so the team kicks on fourth down rather than risk handing the ball over at the 20 for
            nothing. It still leaves with 3 points, and after both scores it kicks off to the other team.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
