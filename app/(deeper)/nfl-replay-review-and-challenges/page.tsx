import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/nfl-replay-review-and-challenges");

// What a challenge costs (rules check, rows 18 and 60)
const COSTS: [string, string][] = [
  ["Challenges a game", "At least two"],
  ["A third challenge", "Only if at least one of the first two succeeded"],
  ["A fourth challenge", "Never"],
  ["What a challenge needs", "A timeout the team still has"],
  ["A challenge that fails", "Costs a timeout"],
  ["A flag thrown when the team can't challenge", "Costs a timeout, or 15 yards if the team has none left"],
  ["After the two-minute warning, and in overtime", "No challenges: only the Replay Official starts a review"],
];

// What can and can't be reviewed (row 58), side by side
const REVIEWABLE = [
  "Possession, and whether a pass was caught",
  "Whether the ball or a player touched the ground",
  "Plays at the goal line",
  "Plays at the sidelines and end lines",
  "The line of scrimmage and the line to gain",
  "The number of players on the field",
  "The down, the spot of a foul, penalty yardage and the clock",
  "Disqualifications",
];
const NOT_REVIEWABLE = [
  "A whistle blown by mistake",
  "An illegal bat or kick of the ball",
  "Intentional grounding",
  "An ineligible receiver downfield",
  "Illegal contact on a receiver",
  "An illegal block, including holding",
  "Anything not on the reviewable list",
];

export default function ReplayPage() {
  return (
    <DeeperPage
      path="/nfl-replay-review-and-challenges"
      intro={
        <p>
          In the NFL, a play can be looked at again on video in two ways. Some plays are reviewed automatically,
          including every score and every turnover, and most other plays can be reviewed if a coach throws a red
          challenge flag. Either way, the call on the field is changed only when the video gives clear and obvious
          evidence that it was wrong, and some calls, pass interference and holding among them, can&rsquo;t be
          reviewed at all.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive ends with a touchdown catch by the tight end in the end zone. Like every score, it goes to replay automatically, and the catch rule below is what the review checks.",
      }}
      related={["/football-penalties-explained", "/nfl-overtime-rules", "/how-scoring-works-in-football", "/how-to-watch-football"]}
    >
      <Section title="Two ways a play gets reviewed">
        <Block kicker="No flag needed" title="Automatic reviews">
          <p>
            The <strong>Replay Official</strong> is the member of the officiating staff who watches the game on video.
            Certain plays are reviewed without anyone asking:
          </p>
          <ul>
            <li>every scoring play: a touchdown, a field goal or a safety</li>
            <li>every try after a touchdown</li>
            <li>every turnover, meaning an interception or a fumble the other team recovers</li>
            <li>a fourth down on which the offense fails to make the line to gain</li>
            <li>the kicking team getting the ball back at the end of a kick</li>
            <li>a player being disqualified</li>
          </ul>
          <p>
            Beyond that list, every play after the two-minute warning near the end of each half, and every play in
            overtime, is in the Replay Official&rsquo;s hands. In those stretches only the Replay Official can start a
            review, and coaches can&rsquo;t challenge.
          </p>
        </Block>
        <Block kicker="The red flag" title="A coach&rsquo;s challenge">
          <p>
            Outside those stretches, a coach can ask for a review by throwing a red flag onto the field before the next
            snap, which is a <strong>challenge</strong>. Each challenge needs a timeout the team still has, and if
            nothing about the call changes, the team loses that timeout.
          </p>
        </Block>
      </Section>

      <Section title="Who decides, and on what evidence">
        <Block kicker="The league office" title="The league&rsquo;s officiating office does the review">
          <p>
            A review isn&rsquo;t decided by the officials on the field alone. The league&rsquo;s senior vice president
            of officiating, or someone designated to do it, conducts the review together with the Replay Official and
            the <strong>referee</strong>, the head of the officiating crew, who watches the replays on a monitor at
            field level. Once a play is under review, every reviewable part of it can be changed, not only the part
            that prompted the review.
          </p>
        </Block>
        <Block kicker="The standard" title="Clear and obvious">
          <p>
            A call is changed only on <strong>clear and obvious</strong> video evidence. That&rsquo;s a high bar. If the angles are blurry, the ball is hidden under a pile, or the replay could reasonably be read
            either way, the call made on the field holds. So when you watch a replay at home and think the call was
            probably wrong, that isn&rsquo;t enough for it to be overturned. The video has to show it.
          </p>
        </Block>
      </Section>

      <Section title="Challenges, step by step">
        <Block kicker="How it works" title="From the flag to the result">
          <ol>
            <li>
              <strong>The flag.</strong> A coach throws the red flag before the next snap. The team needs a timeout
              left to do it.
            </li>
            <li>
              <strong>The review.</strong> Play stops while the league&rsquo;s officiating office, the Replay Official
              and the referee look at every angle.
            </li>
            <li>
              <strong>The ruling.</strong> The call is changed only if the video clearly and obviously shows it was
              wrong.
            </li>
            <li>
              <strong>The result.</strong> If any reviewable part of the play is changed, the challenge succeeds. If
              nothing changes, it fails, and the team loses a timeout.
            </li>
          </ol>
          <div className="table-wrap">
            <table className="data even">
              <caption>What a challenge costs</caption>
              <thead>
                <tr><th scope="col">Situation</th><th scope="col">Rule</th></tr>
              </thead>
              <tbody>
                {COSTS.map(([when, rule]) => (
                  <tr key={when}><th scope="row" className="prose">{when}</th><td className="prose">{rule}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
        <Block kicker="Late in a half" title="The 10-second runoff">
          <p>
            After the two-minute warning, a reversal can cost time as well as change the play. If the corrected call
            would have kept the clock running, 10 seconds come off the clock, as if it had been running all along. A
            pass ruled incomplete stops the clock, for example; if replay shows it was really a catch in bounds, the
            clock would never have stopped, so the 10 seconds are run off. The only way a team can avoid the runoff is
            to use a timeout.
          </p>
        </Block>
      </Section>

      <Section title="What can be reviewed">
        <Block kicker="The list" title="Reviewable and not">
          <p>
            The rulebook lists the kinds of play replay can look at. Anything not on the list can&rsquo;t be reviewed,
            however clear the video is.
          </p>
          <div className="table-wrap">
            <table className="data even">
              <caption>What replay can and can&rsquo;t review</caption>
              <thead>
                <tr><th scope="col">Reviewable</th><th scope="col">Not reviewable</th></tr>
              </thead>
              <tbody>
                {REVIEWABLE.map((r, i) => (
                  <tr key={r}><td className="prose">{r}</td><td className="prose">{NOT_REVIEWABLE[i] ?? ""}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
        <Block kicker="Judgment calls" title="Pass interference and holding">
          <p>
            Two of the most argued-about fouls in football are off the list. <strong>Pass interference</strong> is
            illegal contact with a receiver, and <strong>holding</strong> is an illegal block, and neither can be
            reviewed or challenged. That&rsquo;s why you&rsquo;ll sometimes see a replay that seems to show a flag was
            wrong, or that a foul was missed, and the call stays exactly as it was. The officials&rsquo; judgment on
            those plays is final. The <GuideLink href="/football-penalties-explained">guide to penalties</GuideLink>{" "}
            explains both fouls and what each one costs.
          </p>
        </Block>
      </Section>

      <Section title="Help from the replay booth on fouls">
        <Block kicker="Facts, not judgment" title="The objective parts">
          <p>
            Even though most fouls can&rsquo;t be reviewed, the Replay Official and the league office may step in on
            the plain facts behind a few of them, when the video makes those facts clear and obvious. They can tell the
            officials on the field, for example:
          </p>
          <ul>
            <li>that a roughing-the-passer foul called only for a hit to the head or neck involved no such contact</li>
            <li>whether a passer flagged for intentional grounding was outside the pocket</li>
            <li>whether a facemask or horse-collar foul involved the facemask or the collar at all</li>
            <li>whether a tripping foul involved the leg</li>
            <li>whether a defender touched the kick before a roughing-the-kicker foul</li>
          </ul>
          <p>
            These aren&rsquo;t challenges and they don&rsquo;t cost anyone a timeout. They let the officials fix a
            mistake of fact without reopening the judgment part of the call.
          </p>
        </Block>
      </Section>

      <Section title="What counts as a catch">
        <Block kicker="The rule" title="The catch rule in four steps">
          <p>
            Many reviews come down to whether a pass was caught, so it&rsquo;s worth knowing the rule. A pass is a catch when the receiver, in bounds:
          </p>
          <ol>
            <li>gains control of the ball with his hands or arms,</li>
            <li>before the ball touches the ground,</li>
            <li>touches the ground in bounds with both feet, or with any part of his body other than his hands,</li>
            <li>
              and then makes a move common to the game, such as reaching the ball forward, taking another step,
              tucking it away and turning upfield or fending off a defender, or holds it long enough to make one.
            </li>
          </ol>
          <p>
            A receiver who has the ball but loses it as he hits the ground, before that last step, hasn&rsquo;t made a
            catch, and the pass is incomplete. In college football one foot in bounds is enough; in the NFL it takes
            two feet or another part of the body.
          </p>
        </Block>
      </Section>

      <Section title="Reading the broadcast">
        <Block kicker="On TV" title="&ldquo;The play is under review&rdquo;">
          <p>
            When a play is reviewed, the game stops and the broadcast fills the wait with replays from every camera it
            has. You&rsquo;ll see the referee at the field-level monitor, and when the review is done the referee turns on the microphone and announces the result to the
            stadium.
          </p>
          <p>
            The wording tells you what the video showed. If the ruling is <strong>reversed</strong>, the video clearly
            showed the call was wrong and it has been changed. If the ruling is <strong>confirmed</strong>, the video
            showed the call was right. If the ruling <strong>stands</strong>, the video didn&rsquo;t clearly show it
            either way, so the call on the field holds. For a coach&rsquo;s challenge, &ldquo;confirmed&rdquo; and
            &ldquo;stands&rdquo; mean the same thing: the challenge failed and the team loses a timeout.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
