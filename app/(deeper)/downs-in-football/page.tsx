import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import { countExamples } from "@/lib/diagrams/downs";
import { downTag } from "@/lib/drive/rules";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/downs-in-football");

const TAG = downTag({ down: 3, spot: 33, lineToGain: 40 }); // "3rd & 7"

// A short stretch of field, the offense moving right: the blue line at own 33, the yellow line at own 40, and the
// TV's tag above, with the down and the distance pointed out. 20 units to a yard.
function TagDiagram() {
  const x = (yard: number) => 20 + (yard - 28) * 20;
  const [down, distance] = TAG.split(" & ");
  return (
    <figure className="diagram">
      <svg viewBox="0 0 320 236" role="img">
        <title>A third-and-7 tag over a stretch of field, with the blue line of scrimmage and the yellow line to gain 7 yards ahead</title>
        <text x="58" y="22" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--ink)">down</text>
        <path d="M74,28 L120,52 m-10,-1 l10,1 l-5,-9" stroke="var(--ink)" strokeWidth="2.5" fill="none" />
        <text x="266" y="22" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--ink)">distance</text>
        <path d="M246,28 L202,52 m5,-9 l-5,9 l10,-1" stroke="var(--ink)" strokeWidth="2.5" fill="none" />
        <rect x="104" y="44" width="112" height="40" rx="6" fill="var(--ink)" />
        <rect x="104" y="44" width="7" height="40" fill="var(--accent)" />
        <text x="163" y="72" textAnchor="middle" fontSize="24" fontWeight="700" fill="#fff" fontFamily="var(--font-display), sans-serif">
          {down} &amp; {distance}
        </text>
        <rect x="0" y="100" width="320" height="100" fill="var(--stripe-a)" />
        {[30, 35, 40].map(y => <line key={y} x1={x(y)} y1="100" x2={x(y)} y2="200" stroke="#fff" strokeWidth="2.5" />)}
        <line x1={x(33)} y1="100" x2={x(33)} y2="200" stroke="var(--los)" strokeWidth="5" />
        <line x1={x(40)} y1="100" x2={x(40)} y2="200" stroke="var(--first-down)" strokeWidth="5" />
        <ellipse cx={x(33) - 8} cy="132" rx="9" ry="5.5" fill="var(--ball)" stroke="var(--ink)" strokeWidth="1.5" />
        <path d={`M${x(33) + 6},172 H${x(40) - 6} m-8,-6 l8,6 l-8,6 M${x(33) + 14},166 l-8,6 l8,6`} stroke="#fff" strokeWidth="2.5" fill="none" />
        <text x={(x(33) + x(40)) / 2} y="162" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" stroke="var(--ink)" strokeWidth="3" paintOrder="stroke">7 yards to go</text>
        <text x={x(33)} y="222" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ink)">Line of scrimmage</text>
        <text x={x(40)} y="222" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ink)">Line to gain</text>
      </svg>
      <figcaption><span className="call">{TAG}: third down, 7 yards from the line to gain</span></figcaption>
    </figure>
  );
}

export default function DownsPage() {
  return (
    <DeeperPage
      path="/downs-in-football"
      intro={
        <p>
          A down is one play, and the offense gets four of them to move the ball 10 yards. Make the 10 yards and the
          count starts again at first down; fall short after the fourth and the other team takes over where the last
          play ended. &ldquo;3rd &amp; 7&rdquo; on the screen means it&rsquo;s the third of those four tries, with 7
          yards still to go.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive counts its downs as it goes: the lesson on downs sets up the four tries, a 4-yard run makes it 2nd & 6, an incomplete pass leaves the ball where it was, a 9-yard catch moves the yellow line, and a catch at the 17 turns the next first down into 1st & goal.",
      }}
      related={["/football-penalties-explained", "/how-scoring-works-in-football", "/football-field-explained", "/how-to-watch-football"]}
    >
      <Section title="What a down is">
        <Block kicker="One play" title="One play, counted">
          <p>
            A <strong>down</strong> is a single play. It starts with the <strong>snap</strong>, when the center, the
            player in the middle of the offense&rsquo;s line, passes the ball back between his legs, and it ends when an
            official blows the whistle. (The <strong>offense</strong> is the team with the ball; the
            <strong>defense</strong> is the team trying to stop it.) The whistle comes when the player with the ball is tackled to
            the ground, steps out of bounds or scores, or when the officials judge that his forward progress has been
            stopped. That last part matters, because the ball goes where his forward progress ended, even if the
            defense then pushes him backward a few yards. The next play starts from that spot.
          </p>
        </Block>
        <Block kicker="Four tries" title="A series of four">
          <p>
            The offense gets a <strong>series</strong> of four downs, numbered first through fourth, to move the ball
            to a spot 10 yards ahead of where the series began. That spot is the <strong>line to gain</strong>. Reach
            it on any of the four plays and the offense earns a new first down: four more tries to reach a new line, 10
            yards farther on. That is how a team marches the length of the field on a <strong>drive</strong>: 10 yards at a time, four
            plays at most for each 10.
          </p>
          <p>
            If the fourth down ends short of the line, the ball goes to the other team, and its offense starts from the
            spot where that play ended. A play wiped out by a penalty doesn&rsquo;t count as one of the four.
          </p>
        </Block>
      </Section>

      <Section title="Reading &ldquo;3rd & 7&rdquo;">
        <Block kicker="The tag" title="Down and distance">
          <p>
            The first number is the down, and the second is the <strong>distance</strong>: how many yards are still
            left to the line to gain. So &ldquo;3rd &amp; 7&rdquo; means third down, 7 yards to go. The distance is
            measured from the <strong>line of scrimmage</strong>, the imaginary line across the field through the front
            tip of the ball, where both teams line up before each play.
          </p>
          <TagDiagram />
          <p>
            On TV the line of scrimmage is drawn in blue and the line to gain in yellow. Neither is painted on the
            field; they&rsquo;re graphics the broadcast adds. In the stadium, a chain crew on the sideline marks the line
            to gain instead.
          </p>
        </Block>
        <Block kicker="The story" title="Reading the tag as a story">
          <p>
            Once you can read the tag, it tells you what the offense is likely to try next. None of this is a rule, but
            it&rsquo;s how the numbers usually play out.
          </p>
          <div className="table-wrap">
            <table className="data">
              <caption>What each down &amp; distance usually means</caption>
              <thead>
                <tr><th scope="col">On the screen</th><th scope="col">What it usually means</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">1st &amp; 10</th><td className="prose">A fresh start. The offense can run or pass, with three more tries behind this one.</td></tr>
                <tr><th scope="row">2nd &amp; long</th><td className="prose">The first play lost ground or gained little, so the offense needs a bigger play, often a pass.</td></tr>
                <tr><th scope="row">3rd &amp; short</th><td className="prose">A yard or two to go. A run straight ahead is common, and the defense crowds the line to stop it.</td></tr>
                <tr><th scope="row">3rd &amp; long</th><td className="prose">Seven yards or more to go. The offense usually passes, and the defense knows it.</td></tr>
                <tr><th scope="row">4th &amp; 1</th><td className="prose">The last try. The offense either kicks the ball away or goes for the yard, knowing a miss hands the other team the ball right there.</td></tr>
              </tbody>
            </table>
          </div>
        </Block>
      </Section>

      <Section title="How the count changes">
        <Block kicker="Play by play" title="From one play to the next">
          <p>
            After every play, the down goes up by one and the distance shrinks by however many yards the play gained,
            or grows if it lost yards. Reaching the line to gain resets everything to 1st &amp; 10. An incomplete pass
            is a pass that hits the ground before anyone catches it; it uses up a down, and the ball comes back to
            where the play started.
          </p>
          <div className="table-wrap">
            <table className="data">
              <caption>From one play to the next, as the rules count it</caption>
              <thead>
                <tr><th scope="col">Before</th><th scope="col">The play</th><th scope="col">After</th></tr>
              </thead>
              <tbody>
                {countExamples().map(r => (
                  <tr key={r.before + r.play}><th scope="row">{r.before}</th><td>{r.play}</td><td>{r.after}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            &ldquo;Own 25&rdquo; means the offense&rsquo;s 25-yard line, in its own half of the field, and &ldquo;opp
            8&rdquo; is the opponent&rsquo;s 8, eight yards from the end zone it&rsquo;s attacking. The sack in the third
            row is a quarterback tackled behind the line of scrimmage before he can throw, which is why the distance
            grows to 13.
          </p>
        </Block>
        <Block kicker="Sidelines" title="When a play ends near the sideline">
          <p>
            The ball goes where forward progress stopped, but not always across the field from it. Two rows of short
            lines, the <GuideLink href="/football-field-explained">hash marks</GuideLink>, run down the middle of the
            field. When a play ends between a hash mark and the sideline, or out of bounds, the ball is moved in to the
            nearer hash mark for the next snap, so the offense always has room on both sides.
          </p>
        </Block>
      </Section>

      <Section title="Penalties and the down">
        <Block kicker="Offense" title="Most offensive fouls repeat the down">
          <p>
            When an official throws a yellow flag, a foul has been called, and the penalty is usually measured in
            yards. If the offense commits the foul and the ball is still short of the line to gain afterward, the down
            stays the same and the distance gets longer. A false start on 3rd &amp; 6, for example, makes it 3rd &amp;
            11: same down, five yards farther back.
          </p>
        </Block>
        <Block kicker="Offense" title="A few cost a down as well">
          <p>
            A handful of offensive fouls take away the down on top of the yards. The one you&rsquo;ll see most is
            intentional grounding: a quarterback about to be sacked throws the ball away where no receiver could catch
            it. The penalty is 10 yards back from where the play started, or the spot of the throw if that is farther
            back, plus the loss of the down. If he throws it from his own end zone, it&rsquo;s a safety instead, worth 2
            points to the defense. A down lost on fourth down hands the ball to the other team.
          </p>
        </Block>
        <Block kicker="Defense" title="Most defensive fouls give a first down">
          <p>
            When the defense fouls, the offense usually gets the yards and an automatic first down, whatever the
            distance was. The exceptions are the smaller fouls: offside, encroachment, a neutral zone infraction, delay
            of game, an illegal substitution, too many players on the field, an extra timeout and running into the
            kicker. Those give the offense the yards, but the down and the line to gain stay the same unless the yards
            carry the ball to the line. The <GuideLink href="/football-penalties-explained">penalties guide</GuideLink>{" "}
            goes through each one.
          </p>
        </Block>
      </Section>

      <Section title="Fourth down">
        <Block kicker="The choice" title="Punt, kick or go for it">
          <p>
            Fourth down is the last try, so the offense has three choices. It can <strong>punt</strong>: the punter
            kicks the ball far down the field to the other team, so that team starts its drive a long way from the end
            zone. It can try a <strong>field goal</strong>, kicking the ball over the crossbar and between the
            uprights of the goalposts for 3 points, if it&rsquo;s close enough. Or it can <strong>go for it</strong>,
            running a normal play and hoping to reach the line to gain.
          </p>
        </Block>
        <Block kicker="Turnover" title="A failed fourth down">
          <p>
            If the offense goes for it and falls short, the other team takes over at the spot where that play ended,
            often in good field position. That&rsquo;s why teams usually punt on fourth down unless they&rsquo;re close
            to the line to gain or close enough for a field goal. A missed field goal carries a similar risk: the other team gets
            the ball at the spot of the kick, or at its own 20 if the kick came from inside the 20.
          </p>
        </Block>
        <Block kicker="Strategy" title="Why third down is the big one">
          <p>
            Fourth down usually ends in a kick, so third down is the offense&rsquo;s last real chance to keep a drive
            alive. Watch the tag on third down: a short distance favors the offense, and a long one favors
            the defense.
          </p>
        </Block>
      </Section>

      <Section title="What &ldquo;& goal&rdquo; means">
        <Block kicker="The target" title="When the goal line is the target">
          <p>
            The line to gain is normally 10 yards ahead, but it can never be past the goal line. When a series starts
            fewer than 10 yards from the end zone, the goal line itself becomes the line to gain, and the tag shows
            &ldquo;& goal&rdquo; instead of a number. There&rsquo;s no yellow line on TV then, because the goal line is
            already painted on the field. Short of a defensive penalty, the offense can&rsquo;t earn a new first down
            from there, so in practice it has four tries to score.
          </p>
        </Block>
        <Block kicker="Example" title="1st & goal at the 6">
          <p>
            Say a catch takes the offense to the opponent&rsquo;s 6-yard line. That is a first down, but the goal line
            is only 6 yards away, so the tag reads 1st &amp; goal. A 3-yard run makes it 2nd &amp; goal at the 3, and the
            distance is never shown as a number again until the series ends, with a touchdown, a field goal or the
            ball going to the other team.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
