import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import { pageMetadata } from "@/lib/metadata";
import { downTag } from "@/lib/drive/rules";

export const metadata = pageMetadata("/how-to-watch-football");

const TAG = downTag({ down: 3, spot: 33, lineToGain: 40 }); // "3rd & 7"

// One team's timeouts left, as three pips: lit for each one still unused
function Pips({ x, left }: { x: number; left: number }) {
  return (
    <>
      {[0, 1, 2].map(i => (
        <rect key={i} x={x + i * 16} y="84" width="12" height="5" rx="1" fill={i < left ? "var(--accent)" : "#ffffff40"} />
      ))}
    </>
  );
}

// A generic score bar: no team names, abbreviations or network styling (N7: everything on it is broadcast graphics)
function ScoreBug() {
  const label = { textAnchor: "middle" as const, fontSize: 13, fontWeight: 700, fill: "var(--ink)" };
  const lead = { stroke: "var(--ink)", strokeWidth: 1.5 };
  const big = { fill: "#fff", fontWeight: 700, fontFamily: "var(--font-display), sans-serif" };
  return (
    <figure className="diagram">
      <svg viewBox="0 0 320 220" role="img">
        <title>
          A TV score bar: Away 14 with two timeouts left, Home 17 with three, the second quarter, 8:42 on the game clock,
          25 on the play clock, and {TAG}
        </title>
        <text x="92" y="24" {...label}>timeouts left</text>
        <line x1="92" y1="31" x2="92" y2="80" {...lead} />
        <text x="290" y="24" {...label}>score</text>
        <line x1="290" y1="31" x2="290" y2="76" {...lead} />

        <rect x="10" y="62" width="300" height="88" rx="6" fill="var(--ink)" />
        <rect x="10" y="112" width="300" height="38" fill="#ffffff1a" />
        {[160].map(x => <line key={x} x1={x} y1="62" x2={x} y2="112" stroke="#ffffff55" strokeWidth="1.5" />)}
        {[70, 150, 210].map(x => <line key={x} x1={x} y1="112" x2={x} y2="150" stroke="#ffffff55" strokeWidth="1.5" />)}
        <text x="20" y="92" fontSize="15" {...big}>Away</text>
        <Pips x={66} left={2} />
        <text x="150" y="96" fontSize="22" textAnchor="end" {...big}>14</text>
        <text x="170" y="92" fontSize="15" {...big}>Home</text>
        <Pips x={220} left={3} />
        <text x="300" y="96" fontSize="22" textAnchor="end" {...big}>17</text>
        <text x="40" y="137" fontSize="17" textAnchor="middle" {...big}>2nd</text>
        <text x="110" y="137" fontSize="17" textAnchor="middle" {...big}>8:42</text>
        <text x="180" y="137" fontSize="17" textAnchor="middle" {...big}>:25</text>
        <text x="260" y="137" fontSize="17" textAnchor="middle" {...big}>{TAG}</text>

        <line x1="40" y1="150" x2="40" y2="164" {...lead} />
        <text x="40" y="178" {...label}>quarter</text>
        <line x1="180" y1="150" x2="180" y2="164" {...lead} />
        <text x="180" y="178" {...label}>play clock</text>
        <line x1="110" y1="150" x2="110" y2="194" {...lead} />
        <text x="110" y="208" {...label}>game clock</text>
        <line x1="258" y1="150" x2="258" y2="194" {...lead} />
        <text x="258" y="208" {...label}>down &amp; distance</text>
      </svg>
      <figcaption>The score bar most broadcasts keep on screen, with the team names left out</figcaption>
    </figure>
  );
}

export default function HowToWatchPage() {
  return (
    <DeeperPage
      path="/how-to-watch-football"
      intro={
        <p>
          The easiest way for a beginner to watch football is to follow three things on every play: where the ball is,
          the down and distance, and the clock. Each play is a short burst with a pause before and after it, so use the
          pause before the snap to read the situation, watch the ball during the play, and check where it ended up
          afterward. Everything else, from formations to penalties, builds on those three.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive is a way to practice all of this: from the down-and-distance card on, every play shows the ball, the two lines and the clock, and the third-down card shows the red zone.",
      }}
      related={["/downs-in-football", "/football-penalties-explained", "/football-formations-explained", "/football-glossary"]}
    >
      <Section title="Start here">
        <Block kicker="The basics" title="Three things to follow">
          <ol>
            <li>
              <strong>The ball.</strong> Every play starts with the ball being snapped and ends when the ball is
              dead, so the ball tells you where the play is happening and where the next one will start.
            </li>
            <li>
              <strong>The down and distance.</strong> The offense gets four tries, called{" "}
              <GuideLink href="/downs-in-football">downs</GuideLink>, to move the ball 10 yards. &ldquo;{TAG}&rdquo; means it&rsquo;s the third try and 7 yards are still needed.
              That one phrase tells you how much pressure the offense is under.
            </li>
            <li>
              <strong>The clock.</strong> A game is four 15-minute quarters, and the score only matters once the clock
              runs out. Late in a close game, the clock can matter as much as the yards.
            </li>
          </ol>
          <p>
            You don&rsquo;t need to know every position or rule to enjoy a game. If you can say who has the ball, what
            down it is and how much time is left, you can follow almost everything that happens.
          </p>
        </Block>
      </Section>

      <Section title="Reading the TV screen">
        <Block kicker="The score bar" title="Everything in one strip">
          <ScoreBug />
          <p>
            Most broadcasts keep a score bar on the screen the whole game, usually along the bottom or the top. Its
            exact look changes from network to network, but it usually holds the same things: each team&rsquo;s score,
            how many of its three timeouts for the half it has left, the quarter, the <strong>game clock</strong> that
            counts down each quarter, the <strong>play clock</strong> that limits how long the offense can take before
            the snap, and the down and distance.
          </p>
        </Block>
        <Block kicker="On the field" title="The two lines">
          <p>
            During each play, the broadcast also draws two lines across the field. The blue one marks the line of
            scrimmage, where the play starts, and the yellow one marks the line the offense has to reach for a first
            down. Neither is painted on the grass. They&rsquo;re graphics added for TV, and the players on the field
            don&rsquo;t see them. The <a href="/">homepage drive</a> shows both lines moving play by play.
          </p>
        </Block>
        <Block kicker="A flag" title="What the flag on the screen means">
          <p>
            When an official throws a yellow penalty flag, most broadcasts put a flag or the word &ldquo;FLAG&rdquo; on
            the score bar straight away, often before the play has even finished. It tells you that whatever happens on
            this play may not count, so keep watching for the referee&rsquo;s announcement afterward.
          </p>
        </Block>
      </Section>

      <Section title="Before the snap">
        <Block kicker="The pause" title="Count the line">
          <p>
            Each team has 11 players on the field. At the snap, the offense must have at least seven of them on the line
            of scrimmage, with a player who&rsquo;s allowed to catch a pass at each end of that line. The big players in
            the middle are the offensive linemen, and the ones set back behind them are the quarterback, the running
            back and the receivers who aren&rsquo;t on the line; the{" "}
            <GuideLink href="/football-positions-explained">guide to positions</GuideLink> says what each one does. At
            the snap, no player but the one snapping the ball may be in the space between the two teams.
          </p>
        </Block>
        <Block kicker="The pause" title="Look at the shape">
          <p>
            How the offense lines up is a clue to what it might do. Lots of receivers spread wide usually means it
            wants to pass; extra big players packed in tight usually means it wants to run. The way players line up is
            called a <strong>formation</strong>, and the{" "}
            <GuideLink href="/football-formations-explained">guide to formations</GuideLink> draws the common ones.
          </p>
        </Block>
        <Block kicker="The pause" title="Watch for the audible">
          <p>
            Sometimes the quarterback looks at the defense, then shouts and points before the snap. That&rsquo;s often
            an <strong>audible</strong>, a change of play called at the line, because the quarterback has seen
            something in how the defense is set up. It&rsquo;s one of the words in the{" "}
            <GuideLink href="/football-glossary">football glossary</GuideLink>.
          </p>
        </Block>
        <Block kicker="The pause" title="Watch the clock">
          <p>
            The play clock gives the offense 40 seconds from the end of one play to snap the next, or 25 after some
            stoppages. If it reaches zero first, it&rsquo;s a 5-yard penalty. When the game clock is running too,
            those seconds are taken off the game as well, which is why a team that&rsquo;s ahead late in a game usually
            takes all the time it can before each snap.
          </p>
        </Block>
      </Section>

      <Section title="During the play">
        <Block kicker="The first second" title="Run or pass?">
          <p>
            Watch the quarterback as the ball is snapped. If he turns and hands the ball to the running back, it&rsquo;s
            usually a run. If he drops back a few steps and holds on to it, it&rsquo;s usually a pass. The linemen give
            it away too: on a run they usually surge forward into the defense, and on a pass they usually step back to
            form a wall around the quarterback.
          </p>
        </Block>
        <Block kicker="The whole play" title="Follow the ball and the line">
          <p>
            Once you know who has the ball, keep your eyes on it and on the yellow line. The question on almost every
            play is whether the ball carrier will get past the yellow line before he&rsquo;s stopped. If he does,
            it&rsquo;s a first down and the offense gets four new tries. If he doesn&rsquo;t, the next down is one try
            closer to fourth.
          </p>
        </Block>
        <Block kicker="On a pass" title="Where the quarterback looks">
          <p>
            On a pass play, the camera usually stays wide enough to show the quarterback and the receivers running
            their routes. Watch where the quarterback&rsquo;s eyes and shoulders turn: he&rsquo;s reading which
            receiver is open, and the defense is reading him. A quick throw usually goes to a short route near the line,
            and a longer wait usually means he&rsquo;s looking deep.
          </p>
        </Block>
        <Block kicker="When it goes wrong" title="What a sack looks like">
          <p>
            A <strong>sack</strong> is a quarterback being tackled behind the line of scrimmage before he can throw. You
            see the wall of linemen break down, a defender come through, and the quarterback go down with the ball. The
            yards lost count against the offense, so a sack on second down can turn a manageable third down into a long
            one.
          </p>
        </Block>
      </Section>

      <Section title="After the whistle">
        <Block kicker="The spot" title="Where the ball is placed">
          <p>
            A play ends when the ball carrier is down, goes out of bounds or scores. The officials place the ball where
            his forward progress stopped, the farthest point he reached toward the goal, even if he was then pushed
            backward. The next play starts from that spot, and the blue line moves there.
          </p>
        </Block>
        <Block kicker="The clock" title="Did the clock stop?">
          <p>
            Check the game clock after each play. It stops for an incomplete pass, a runner out of bounds, a score, a
            foul, a timeout and a change of possession, and keeps running after a tackle in bounds. That&rsquo;s why
            the end of a close game slows down so much: the team that&rsquo;s behind tries to make plays that stop the
            clock. The{" "}
            <GuideLink href="/how-long-is-a-football-game">guide to how long a game lasts</GuideLink> lists every stop.
          </p>
        </Block>
        <Block kicker="A flag" title="Flags and what the referee says">
          <p>
            If there was a flag, the referee, the official in charge of the crew, gives the hand signal for the foul,
            and on TV you&rsquo;ll usually hear it announced as well. The team that didn&rsquo;t foul then
            chooses: it can accept the penalty and take the yards, or decline it and keep the result of the play.
            That&rsquo;s why a team that gained 20 yards on a play will usually decline a 5-yard penalty against the
            other side. The{" "}
            <GuideLink href="/football-penalties-explained">guide to penalties</GuideLink> shows every common signal.
          </p>
        </Block>
      </Section>

      <Section title="The situations that matter">
        <Block kicker="The big downs" title="Third down and the red zone">
          <p>
            Third down is usually the offense&rsquo;s last real chance to make a first down, because on fourth down most
            teams kick. So third down is where a lot of drives are won or lost, and it&rsquo;s worth giving it your full
            attention.
          </p>
          <p>
            The <strong>red zone</strong> is TV&rsquo;s name for the last 20 yards before the goal line. It isn&rsquo;t
            a rule, but it&rsquo;s a useful idea: once an offense gets there it&rsquo;s usually in range for at least a
            field goal, and the question becomes whether it scores a touchdown or settles for 3 points.
          </p>
        </Block>
        <Block kicker="The choice" title="Fourth down">
          <p>
            On fourth down, the offense has three options. It can <strong>punt</strong>, kicking the ball away to
            push the other team back. It can try a <strong>field goal</strong>, a kick between the goalposts worth 3
            points, if it&rsquo;s close enough. Or it can <strong>go for it</strong> and try to make the first down. If
            it goes for it and fails, the other team takes over right where the play ended, which is why going for it
            deep in your own half is a big gamble.
          </p>
        </Block>
        <Block kicker="Late in a half" title="The last two minutes">
          <p>
            Near the end of each half the clock stops for the <strong>two-minute warning</strong>, after the last play
            that starts before two minutes are left. From then on in the first half, and in the last five minutes of
            the game, a runner going out of bounds stops the clock until the next snap. Each team has three timeouts a
            half, and this is when they usually spend the ones they&rsquo;ve saved. A team that&rsquo;s behind usually throws
            toward the sideline and calls timeouts to save seconds, and a team that&rsquo;s ahead runs the ball and
            keeps it in bounds to use them up.
          </p>
        </Block>
        <Block kicker="A second look" title="Replay">
          <p>
            Every score and every turnover is looked at again on video, and a coach can throw a red flag to challenge
            other calls. While a play is under review, the broadcast shows replays from every angle, which is a good
            chance to see a play again. The{" "}
            <GuideLink href="/nfl-replay-review-and-challenges">guide to replay review</GuideLink> explains what can
            be changed.
          </p>
        </Block>
      </Section>

      <Section title="A beginner&rsquo;s order of learning">
        <Block kicker="A suggestion" title="Week 1, week 2, week 3">
          <p>
            You don&rsquo;t have to learn it all at once. It&rsquo;s easiest to add one layer at a time, say one a week:
          </p>
          <ul>
            <li>
              <strong>Week 1: downs.</strong> Follow the ball and the down and distance on every play, and say out
              loud whether each play got past the yellow line.
            </li>
            <li>
              <strong>Week 2: penalties.</strong> When a flag comes out, watch the referee&rsquo;s signal and see how
              the yards change the down and distance.
            </li>
            <li>
              <strong>Week 3: positions.</strong> Pick one player, a running back or a cornerback, and watch only him
              for a few plays, and see how his job changes from one play to the next.
            </li>
          </ul>
          <p>
            By the end of the third week, a lot of what the commentators say will make sense, and you&rsquo;ll start to
            see the next play coming before the snap.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
