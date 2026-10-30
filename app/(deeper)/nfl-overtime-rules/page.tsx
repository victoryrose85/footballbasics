import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/nfl-overtime-rules");

// Regular-season overtime (rules check, rows 23, 56 and 61)
const REGULAR: [string, string][] = [
  ["Break before it starts", "Up to 3 minutes"],
  ["Length", "One period of 10 minutes"],
  ["Timeouts", "Two for each team"],
  ["Who gets the ball", "Both teams, unless the defense scores on the first possession"],
  ["Who wins", "The team ahead once both have had the ball, or else the next team to score"],
  ["Still tied after 10 minutes", "The game ends in a tie"],
];

// Playoff overtime (rows 24 and 56)
const PLAYOFFS: [string, string][] = [
  ["Length", "15-minute periods, played until there is a winner"],
  ["Breaks", "2 minutes between periods, with no halftime after the second"],
  ["Timeouts", "Three for each team in each half, as in the game itself"],
  ["Changing ends", "After the first and third periods"],
  ["Coin toss", "A new one after the fourth period"],
  ["Who gets the ball, and who wins", "The same rules as the regular season"],
];

function Glance({ caption, rows }: { caption: string; rows: [string, string][] }) {
  return (
    <div className="table-wrap">
      <table className="data even">
        <caption>{caption}</caption>
        <tbody>
          {rows.map(([what, rule]) => (
            <tr key={what}><th scope="row" className="prose">{what}</th><td className="prose">{rule}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OvertimePage() {
  return (
    <DeeperPage
      path="/nfl-overtime-rules"
      intro={
        <p>
          Under the 2026 NFL rules, a game tied after four quarters goes to overtime, which starts with a coin toss and
          a kickoff, and both teams get a chance to have the ball unless the defense scores on the very first
          possession. In the regular season overtime is one 10-minute period, and a game still tied at the end of it is
          a tie. In the playoffs, 15-minute periods are played until someone wins.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive ends with the rest of the game: the scoring team kicks off, and a game still tied after four quarters goes to overtime, which is where this page picks up.",
      }}
      related={["/how-scoring-works-in-football", "/how-long-is-a-football-game", "/nfl-replay-review-and-challenges", "/how-the-nfl-season-works"]}
    >
      <Section title="The short answer">
        <Block kicker="Since 2025" title="Both teams get the ball">
          <p>
            In the regular season, each team gets a possession in overtime, and once both have had the ball, the team
            that&rsquo;s ahead wins. If they&rsquo;re still level by then, the next team to score wins, and if no one
            has won when the 10 minutes run out, the game ends as a tie. The playoffs use the same rules for who gets
            the ball and who wins, but a playoff game can&rsquo;t end in a tie, so the periods keep coming until it has
            a winner.
          </p>
        </Block>
      </Section>

      <Section title="How overtime starts">
        <Block kicker="Before the kickoff" title="The coin toss">
          <p>
            After a break of up to three minutes, the referee, the official in charge of the crew, tosses a coin, and
            the visiting team&rsquo;s captain calls it, just as before the game. Then one team kicks off to the other,
            and overtime is under way.
          </p>
        </Block>
        <Block kicker="The first chance" title="The kickoff counts as a possession chance">
          <p>
            The rulebook talks about each team having the ball or the &ldquo;opportunity to possess&rdquo; it, and for
            the receiving team, the kickoff is that opportunity. So if the kicking team recovers an onside kick, a
            short kick it tries to get back, the receiving team has still had its chance at the ball.
          </p>
        </Block>
      </Section>

      <Section title="Regular season">
        <Block kicker="The rules" title="Regular season at a glance">
          <Glance caption="Regular season at a glance" rows={REGULAR} />
          <p>
            Each team has two timeouts in a regular-season overtime, not three, which makes clock management tighter
            in a period that&rsquo;s only 10 minutes long. The{" "}
            <GuideLink href="/how-long-is-a-football-game">guide to how long a game lasts</GuideLink> explains
            what stops the clock.
          </p>
        </Block>
        <Block kicker="A quick finish" title="How it can end early">
          <p>
            Overtime usually lasts at least two possessions, but there are ways it can end sooner. If the kicking team
            scores a <GuideLink href="/how-scoring-works-in-football">safety</GuideLink>, worth 2 points and most often
            the result of tackling the ball carrier in his own end zone, on the receiving team&rsquo;s first
            possession, the game is over. The same is true if the
            defense intercepts a pass or recovers a fumble on that first possession and returns it for a touchdown:
            the defense has then had the ball too, and it&rsquo;s ahead.
          </p>
          <p>
            Otherwise, the game can end as soon as both teams have had the ball and one of them leads.
          </p>
        </Block>
        <Block kicker="An answer is due" title="When the first team scores">
          <p>
            If the first team scores, the second team still gets its turn, and it needs to at least match the score to
            keep the game going. If, on that turn, it throws an interception or fumbles, the play runs to its end and
            any points scored on it count, so the defense can still add a touchdown on the return.
          </p>
          <p>
            So can a team win overtime with a field goal? Yes, in two ways: by kicking one on the first possession and
            then stopping the other team from scoring, or by kicking one at any point after both teams have had the
            ball and the score is level.
          </p>
        </Block>
      </Section>

      <Section title="Playoffs">
        <Block kicker="The rules" title="Playoffs at a glance">
          <Glance caption="Playoffs at a glance" rows={PLAYOFFS} />
          <p>
            A playoff overtime works like a second game in miniature: two periods make a half, with three timeouts for
            each team, and the teams change ends after the first and third periods, just as they do after the first and third
            quarters. If four periods
            aren&rsquo;t enough, there&rsquo;s a new coin toss and play goes on.
          </p>
        </Block>
      </Section>

      <Section title="Worked examples">
        <Block kicker="Game one" title="A touchdown, a touchdown, then the next score">
          <p>
            The home team wins the toss and receives. It drives the length of the field for a touchdown and kicks the
            extra point: 7 points. The away team gets its possession and answers with a touchdown and an extra point
            of its own, so the score is level again with both teams having had the ball. From here the next score
            wins. The home team punts, the away team kicks a field goal, and the game is over.
          </p>
          <p>
            If the away team had gone for two after its touchdown and made it, it would have led 8 to 7 with both
            teams having had the ball, and won right there.
          </p>
        </Block>
        <Block kicker="Game two" title="A field goal, answered by a field goal">
          <p>
            The away team receives and kicks a field goal: 3 points. The home team gets its turn and kicks a field
            goal too, so it&rsquo;s level again. Now it&rsquo;s next score wins. If neither team scores before the 10
            minutes run out, a regular-season game ends in a tie. In the playoffs, the teams would take a 2-minute
            break and start another 15-minute period.
          </p>
        </Block>
      </Section>

      <Section title="Replay in overtime">
        <Block kicker="No red flags" title="No coaches&rsquo; challenges">
          <p>
            Coaches can&rsquo;t challenge anything in overtime. Replay review still happens, but it starts only with the
            officials, as it does after the two-minute warning near the end of each half. The{" "}
            <GuideLink href="/nfl-replay-review-and-challenges">guide to replay review</GuideLink> explains what can
            be reviewed.
          </p>
        </Block>
      </Section>

      <Section title="How it got here">
        <Block kicker="History, as of 2026" title="From 15 minutes to 10, and the guaranteed possession">
          <p>
            Overtime has changed several times in recent years, which is why the rules on this page are dated. The
            recent history:
          </p>
          <ul>
            <li>
              <strong>2017:</strong> regular-season overtime was cut from 15 minutes to 10.
            </li>
            <li>
              <strong>2022:</strong> the playoffs began guaranteeing both teams the ball, even after a touchdown on the
              first possession.
            </li>
            <li>
              <strong>2025:</strong> the regular season adopted the same guarantee, keeping its 10-minute period.
              Before then, a touchdown on the first possession of a regular-season overtime ended the game.
            </li>
          </ul>
          <p>
            If the rules change again, this page will be updated, and the date at the top will say when.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
