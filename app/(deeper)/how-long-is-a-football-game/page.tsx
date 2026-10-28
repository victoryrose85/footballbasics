import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/how-long-is-a-football-game");

// The parts of a game, in order (rules check, rows 15 and 63)
const STRUCTURE: [string, string][] = [
  ["First quarter", "15 minutes"],
  ["Break", "At least 2 minutes, and the teams change ends"],
  ["Second quarter", "15 minutes"],
  ["Halftime", "13 minutes"],
  ["Third quarter", "15 minutes"],
  ["Break", "At least 2 minutes, and the teams change ends"],
  ["Fourth quarter", "15 minutes"],
];

// What stops the game clock (rows 12, 61, 62, 64, 73)
const STOPS: [string, string][] = [
  ["An incomplete pass", "A forward pass that hits the ground, or goes out of bounds, without being caught"],
  ["The ball out of bounds", "Most often a runner pushed over the sideline with the ball"],
  ["A play that ends on or behind a goal line", "Every score, and every touchback"],
  ["A foul", "The clock stops when an official throws a flag"],
  ["A kickoff", "The clock stops when the kickoff play ends"],
  ["A change of possession", "A punt, an interception, a fumble the other team recovers, or a failed fourth down"],
  ["A timeout", "One a team calls, or one the officials take, for example to measure for a first down"],
  ["The two-minute warning", "Near the end of the second and fourth quarters"],
];

export default function GameLengthPage() {
  return (
    <DeeperPage
      path="/how-long-is-a-football-game"
      intro={
        <p>
          An NFL game has 60 minutes of playing time, in four quarters of 15 minutes each, but from the opening kickoff
          to the end it usually takes about three hours. The game clock stops many times in a game, for incomplete
          passes, runners going out of bounds, scores, penalties and timeouts, and the broadcast, the huddles and
          halftime fill the time in between.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive shows the clock at work: an incomplete pass stops it, a runner forced out of bounds stops it again, the play clock runs out for a delay-of-game flag, and the last card adds it all up to about three hours.",
      }}
      related={["/nfl-overtime-rules", "/downs-in-football", "/how-to-watch-football", "/how-the-nfl-season-works"]}
    >
      <Section title="The short answer">
        <Block kicker="Clock time and real time" title="60 minutes of clock, about three hours of game">
          <p>
            The <strong>game clock</strong>, the one counting down on the screen, runs for 60 minutes: four quarters of
            15 minutes each. It only runs while the game is moving, though, and plenty of things stop it. Add the
            break at halftime, the commercials the broadcast fits in, the time each team spends choosing and calling a
            play, and the reviews of close calls, and a game takes about three hours from start to finish. That&rsquo;s
            the number to plan an evening around.
          </p>
        </Block>
      </Section>

      <Section title="The four quarters and halftime">
        <Block kicker="The structure" title="Four quarters, two breaks and a halftime">
          <div className="table-wrap">
            <table className="data">
              <caption>The structure of a game</caption>
              <thead>
                <tr><th scope="col">Part</th><th scope="col">Length</th></tr>
              </thead>
              <tbody>
                {STRUCTURE.map(([part, length], i) => (
                  <tr key={i}><th scope="row">{part}</th><td className="prose">{length}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            When the teams change ends after the first and third quarters, the ball moves to the matching spot at the
            other end of the field, and <GuideLink href="/downs-in-football">the down and the distance</GuideLink>, which
            try the offense is on and how far it has to go, stay as they were. A drive that&rsquo;s halfway down the field when a quarter ends simply carries on after the
            break. Halftime is different: the second half starts with a fresh kickoff.
          </p>
        </Block>
        <Block kicker="Before the kickoff" title="The coin toss">
          <p>
            Within three minutes of the kickoff, the referee, the official in charge of the crew, tosses a coin at
            midfield, and the visiting team&rsquo;s captain calls it. The team that wins the toss chooses one of three
            things: to receive the opening kickoff, to kick it, or which goal to defend. It can also defer, which saves
            its choice for the start of the second half.
          </p>
        </Block>
      </Section>

      <Section title="What stops the clock">
        <Block kicker="The list" title="Every time the game clock stops">
          <p>
            The game clock starts on the opening kickoff, once a player touches the ball in the field of play. From
            then on it runs through each play and between plays, except when one of these stops it:
          </p>
          <div className="table-wrap">
            <table className="data even">
              <caption>Clock stops</caption>
              <thead>
                <tr><th scope="col">What happens</th><th scope="col">What it looks like</th></tr>
              </thead>
              <tbody>
                {STOPS.map(([what, looks]) => (
                  <tr key={what}><th scope="row" className="prose">{what}</th><td className="prose">{looks}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            A play that ends with a tackle in bounds stops nothing, so the clock keeps running while the teams huddle
            and line up again. A first down doesn&rsquo;t stop it either, unless the officials stop the clock to
            measure. That running time between plays is where a lot of a quarter&rsquo;s 15 minutes go.
          </p>
        </Block>
        <Block kicker="Out of bounds" title="When it starts again">
          <p>
            After a runner goes out of bounds, the clock usually doesn&rsquo;t wait for the next snap. It starts again
            once the officials have placed the ball and the referee signals that it&rsquo;s ready for play. There are
            three exceptions, and in each of them the clock stays stopped until the ball is snapped:
          </p>
          <ul>
            <li>on the first snap after the ball has changed hands</li>
            <li>after the two-minute warning near the end of the first half</li>
            <li>in the last five minutes of the game</li>
          </ul>
        </Block>
        <Block kicker="A worked example" title="The same play, early and late">
          <p>
            Picture a running back who takes a short toss from the quarterback and is pushed out of bounds after 5 yards,
            with 9:30 left in the first quarter. The clock stops as he crosses the sideline. The officials bring the ball
            back onto the field, and once the referee signals it&rsquo;s ready, the clock runs again, so seconds tick away
            while the offense huddles and lines up for the next play.
          </p>
          <p>
            Now run the same play with 4:00 left in the fourth quarter. The clock stops as he crosses the sideline, and
            this time it stays stopped until the next snap. The offense can take its time getting set without losing a
            second of the game. That&rsquo;s why, late in a close game, the team that&rsquo;s behind usually aims its
            plays toward the sideline, and the team that&rsquo;s ahead tries to keep the ball in bounds.
          </p>
        </Block>
      </Section>

      <Section title="The play clock">
        <Block kicker="The second clock" title="40 seconds, or 25">
          <p>
            Besides the game clock, there&rsquo;s a shorter one: the <strong>play clock</strong>, which limits how long
            the offense can take before it snaps the ball. It gives 40 seconds, counted from the end of the previous
            play. After certain stoppages it&rsquo;s set to 25 seconds instead and starts on the referee&rsquo;s
            whistle. Those include a change of possession, a timeout, the two-minute warning, the end of a quarter and
            a penalty being marked off.
          </p>
          <p>
            Because the game clock keeps running between most plays, the play clock is how a team controls the pace.
            A team in a hurry snaps the ball quickly. A team that&rsquo;s ahead late in a game usually lets the play
            clock run almost to zero before every snap, so that as much of the game clock as possible runs off between
            plays.
          </p>
        </Block>
        <Block kicker="When it runs out" title="Delay of game">
          <p>
            If the play clock reaches zero before the snap, an official throws a flag for <strong>delay of
            game</strong>. It costs the offense 5 yards, and because no play happened, the down is played again. The{" "}
            <GuideLink href="/football-penalties-explained">guide to penalties</GuideLink> covers the other flags you can
            see before a snap.
          </p>
        </Block>
      </Section>

      <Section title="Timeouts and the two-minute warning">
        <Block kicker="Three per half" title="Each team&rsquo;s timeouts">
          <p>
            Each team gets three <strong>timeouts</strong> in each half, and any it doesn&rsquo;t use in the first half
            are gone; they don&rsquo;t carry over to the second. A timeout lasts 30 seconds, or 2 minutes when
            television uses it for a commercial break. A team can&rsquo;t call two timeouts in a row between the same
            two plays: the second one costs 5 yards for delay of game.
          </p>
          <p>
            Teams usually save their timeouts for the end of a half, when stopping the clock matters most. A team
            that&rsquo;s behind uses them to save time for one more drive, and a team that&rsquo;s defending a lead
            would rather keep the clock running.
          </p>
        </Block>
        <Block kicker="An automatic stop" title="The two-minute warning">
          <p>
            In the second and fourth quarters, the clock stops after the last play that starts before two minutes
            remain. That&rsquo;s the <strong>two-minute warning</strong>, an automatic timeout that no one has to call.
            In the first half it also changes the out-of-bounds rule: from then on, a runner out of bounds stops the
            clock until the next snap. In the second half that has been true since the five-minute mark.
          </p>
        </Block>
        <Block kicker="Late in a game" title="Why the last two minutes take so long">
          <p>
            Put those rules together and the end of a close half slows right down. The two-minute warning stops the
            clock. After it, every incomplete pass stops the clock, every runner out of bounds stops it until the next
            snap, and each team may still have timeouts to spend. Every stop brings a new play clock, and a timeout
            used for television brings a 2-minute break. Two minutes of game clock can take a long time to play, and
            in a close game it&rsquo;s often the most tense stretch of the evening.
          </p>
        </Block>
      </Section>

      <Section title="Why it adds up to about three hours">
        <Block kicker="The stops" title="Where the time goes">
          <p>
            Most of the three hours is the time between plays, not the plays themselves. Here&rsquo;s what fills it:
          </p>
          <ul>
            <li>
              <strong>Commercial breaks</strong>, usually during timeouts, at the two-minute warning, between quarters
              and after scores
            </li>
            <li>
              <strong>Huddles and lining up</strong>, with up to 40 seconds on the play clock before every snap
            </li>
            <li><strong>Halftime</strong>, 13 minutes on its own</li>
            <li><strong>Penalties</strong>, while the officials explain the foul and mark off the yards</li>
            <li><strong>Replay reviews</strong>, while a close call is checked on video</li>
            <li>
              <strong>Changes of possession</strong>, when one side&rsquo;s players leave the field and the other&rsquo;s
              come on
            </li>
          </ul>
          <p>
            Each of these is short on its own, but they come around again on drive after drive, and that&rsquo;s how
            60 minutes on the clock becomes about three hours on the couch.
          </p>
        </Block>
      </Section>

      <Section title="When the half can&rsquo;t end">
        <Block kicker="One more play" title="A defensive foul extends a half by one untimed down">
          <p>
            A half can&rsquo;t end on an accepted foul by the defense. If time runs out during a play on which the
            defense fouls, and the offense accepts the penalty, the offense may choose to run one more play with no
            time on the clock, called an <strong>untimed down</strong>. Without that rule, a defense could stop a last
            play from working by fouling, knowing the half was over anyway.
          </p>
          <p>
            Say the offense throws into the end zone as the clock runs out at the end of the first half, and a
            defender is flagged for holding a receiver. The pass falls incomplete and the clock reads 0:00, but once
            the penalty yards are marked off, the offense gets one more snap.
          </p>
        </Block>
        <Block kicker="A tied game" title="Overtime adds time">
          <p>
            A game that&rsquo;s tied after the fourth quarter goes to <strong>overtime</strong>, after a break of up
            to three minutes. In the regular season that&rsquo;s one more period of 10 minutes, and a game still tied
            at the end of it ends as a tie. In the playoffs, where a game needs a winner, 15-minute periods are played
            until someone wins. The <GuideLink href="/nfl-overtime-rules">overtime rules</GuideLink> explain who gets
            the ball and how a game is won.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
