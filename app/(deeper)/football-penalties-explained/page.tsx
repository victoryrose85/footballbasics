import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import Signal from "@/components/deeper/Signal";
import { SIGNALS } from "@/lib/diagrams/signals";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/football-penalties-explained");

export default function PenaltiesPage() {
  return (
    <DeeperPage
      path="/football-penalties-explained"
      intro={
        <p>
          A yellow flag means an official has seen a foul, a broken rule, and the penalty is what it costs: usually 5,
          10 or 15 yards, sometimes with a first down for the other side or a lost down for the team that fouled. The
          team that was fouled can take the penalty or turn it down. Below are the fouls you&rsquo;ll see most, what
          each one costs, and the hand signal the officials use to show it.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive draws four of these flags as they happen: a false start that pushes 3rd & 6 back to 3rd & 11, pass interference that gains 18 yards and a first down, holding that wipes out a 12-yard run, and roughing the passer that turns a lost play into a fresh set of downs.",
      }}
      related={["/downs-in-football", "/nfl-replay-review-and-challenges", "/how-to-watch-football", "/football-glossary"]}
    >
      <Section title="What a flag means">
        <Block kicker="The basics" title="Foul, penalty, flag">
          <p>
            A <strong>foul</strong> is any break of the rules, and the <strong>penalty</strong> is the price: a number
            of yards, and for some fouls a first down or a lost down as well. When an official sees a foul during a
            play, he throws a yellow <strong>flag</strong> onto the field and the play carries on to the end. Some fouls
            before the snap are different: the officials blow the whistle at once and no play is run at all.
          </p>
          <p>
            Once the play is over, the officials settle what the foul was and who committed it, and show it with one
            of the hand signals at the bottom of this page.
          </p>
        </Block>
        <Block kicker="Accept or decline" title="The team that was fouled chooses">
          <p>
            A penalty is meant to help the team that was wronged, so that team decides whether to take it. If the
            defense jumps offside and the offense then throws a long touchdown pass anyway, the offense simply declines
            the penalty and keeps the touchdown. If the same pass falls incomplete, it takes the 5 yards instead. Either
            way, the team that was fouled ends up with whichever result is better for it.
          </p>
        </Block>
        <Block kicker="Both teams" title="Offsetting fouls">
          <p>
            Sometimes both teams foul on the same play. When that happens, the penalties <strong>offset</strong>: they
            cancel each other out, the ball goes back to where the play started, and the down is played again with the
            same distance to go. Neither team can decline an offset. There is one exception: if one team&rsquo;s foul is
            a 15-yard foul and the other team&rsquo;s is a minor 5-yard foul, the 15 yards are enforced and the 5 are
            ignored.
          </p>
        </Block>
      </Section>

      <Section title="How a penalty is measured">
        <Block kicker="The spot" title="From where the yards come">
          <p>
            Most penalties are measured from the <strong>previous spot</strong>, the place where the play started. A
            few are measured from the <strong>spot of the foul</strong>, where it happened. The biggest of these is
            pass interference by the defense: the offense gets the ball wherever the foul took place, however far
            downfield that is.
          </p>
          <p>
            Holding by the offense on a running play shows how the spot can matter. Say the offense snaps the ball at
            its own 30 and the runner is tackled at its own 42, a 12-yard gain. If a lineman held a defender right at
            the line of scrimmage, the 10 yards come off the previous spot, and the offense replays the down from its
            own 20. If a receiver held a defender at the 38, behind the end of the run, the yards come off that spot
            instead, and the ball goes to the 28. And if the hold happened past the end of the run, at the 45 say, the
            10 yards come off the 42, where the run ended, putting the ball at the 32. The rulebook calls this the
            three-and-one method; all you need to know is that a hold downfield usually costs the offense less than one
            at the line.
          </p>
        </Block>
        <Block kicker="Near the goal" title="Never more than half the distance">
          <p>
            A penalty can never move the ball more than half the distance to the goal line of the team that fouled. If
            the offense is on its own 8 and commits a false start, the 5 yards would put the ball on the 3, which is
            more than half of 8, so the ball goes to the 4 instead. The same cap applies near the other goal line when
            the defense fouls.
          </p>
        </Block>
        <Block kicker="The count" title="Does the down repeat, and is there a first down?">
          <p>
            The yards are only half of a penalty. The other half is what happens to the down, and that depends on who
            fouled and which foul it was.
          </p>
          <div className="table-wrap">
            <table className="data">
              <caption>Penalty outcomes, and when each one applies</caption>
              <thead>
                <tr><th scope="col">What happens</th><th scope="col">When</th><th scope="col">Example</th></tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">The down is replayed</th>
                  <td className="prose">Most fouls by the offense, when the ball is still short of the line to gain</td>
                  <td className="prose">A false start on 3rd &amp; 6 makes it 3rd &amp; 11</td>
                </tr>
                <tr>
                  <th scope="row">Automatic first down</th>
                  <td className="prose">Most fouls by the defense, whatever the distance was</td>
                  <td className="prose">Defensive holding on 3rd &amp; 9 gives 5 yards and 1st &amp; 10</td>
                </tr>
                <tr>
                  <th scope="row">Yards, same down</th>
                  <td className="prose">The defense&rsquo;s smaller fouls: offside, encroachment, a neutral zone infraction, delay of game, too many players</td>
                  <td className="prose">Offside on 2nd &amp; 12 makes it 2nd &amp; 7</td>
                </tr>
                <tr>
                  <th scope="row">Loss of down</th>
                  <td className="prose">A few offensive fouls, chiefly intentional grounding and an illegal forward pass</td>
                  <td className="prose">Grounding on 2nd &amp; 10 at the 30 makes it 3rd &amp; 20 at the 20</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A defensive foul only skips the first down if it&rsquo;s on that short list of smaller fouls; even then, if the
            yards carry the ball to the line to gain, the offense gets its first down anyway. The{" "}
            <GuideLink href="/downs-in-football">guide to downs</GuideLink> explains how the count works from play to
            play.
          </p>
        </Block>
      </Section>

      <Section title="Fouls before the snap">
        <Block kicker="Before the play" title="The flags that come before anything happens">
          <p>
            These fouls happen while the teams are lining up or at the moment of the snap, and each costs 5 yards. Some,
            such as a false start, encroachment or delay of game, are whistled the moment they happen, so no play is
            run. Others, such as offside and illegal motion, are flagged while the play goes on, and the team that was
            fouled can choose the play instead. When the offense commits one, the down is replayed from 5 yards farther
            back.
          </p>
          <div className="table-wrap">
            <table className="data">
              <caption>Fouls before the snap: all 5 yards</caption>
              <thead>
                <tr><th scope="col">Foul</th><th scope="col">By</th><th scope="col">What happened</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">False start</th><td>Offense</td><td className="prose">A player who was set in his stance moved before the snap.</td></tr>
                <tr><th scope="row">Delay of game</th><td>Offense</td><td className="prose">The play clock, 40 seconds after most plays, ran out before the snap.</td></tr>
                <tr><th scope="row">Offside</th><td>Defense</td><td className="prose">A defender was in or past the neutral zone, the strip the length of the ball between the two lines, at the snap.</td></tr>
                <tr><th scope="row">Encroachment</th><td>Defense</td><td className="prose">A defender crossed into the neutral zone and touched an offensive player or the ball before the snap.</td></tr>
                <tr><th scope="row">Neutral zone infraction</th><td>Defense</td><td className="prose">A defender moved into the neutral zone and made an offensive player flinch, or had a free run at the quarterback.</td></tr>
                <tr><th scope="row">Illegal formation</th><td>Offense</td><td className="prose">Fewer than seven players on the line of scrimmage at the snap.</td></tr>
                <tr><th scope="row">Illegal shift</th><td>Offense</td><td className="prose">After players changed position, the offense didn&rsquo;t stand still for a full second before the snap.</td></tr>
                <tr><th scope="row">Illegal motion</th><td>Offense</td><td className="prose">More than one player was moving at the snap, or the one in motion was heading toward the line.</td></tr>
                <tr><th scope="row">Too many players</th><td>Either</td><td className="prose">Twelve or more players in the formation, or on the field at the snap.</td></tr>
                <tr><th scope="row">Illegal substitution</th><td>Either</td><td className="prose">A substitution broke the rules; after the two-minute warning it also takes 10 seconds off the game clock.</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The play clock is the countdown the offense has to snap the ball: 40 seconds from the end of the previous
            play, or 25 seconds after a timeout, a penalty or a change of possession.
          </p>
        </Block>
        <Block kicker="On the drive" title="The drive&rsquo;s false start">
          <p>
            On the homepage drive, a tackle flinches on 3rd &amp; 6 and the whistle blows before the ball is snapped.
            The offense loses 5 yards and replays third down, now needing 11. It&rsquo;s a small foul, but a costly one:
            the offense needed only 6 yards for a first down, and now it needs nearly twice that.
          </p>
        </Block>
      </Section>

      <Section title="Fouls during the play: blocking and holding">
        <Block kicker="10 or 15 yards" title="The blocking fouls">
          <p>
            Blocking is how the offense clears a path, and the rules limit how it&rsquo;s done. All of these are called
            on the offense:
          </p>
          <ul>
            <li><strong>Offensive holding</strong>, 10 yards: grabbing, hooking, twisting or pulling down a defender to keep him from getting where he&rsquo;s going.</li>
            <li><strong>Illegal use of hands</strong>, 10 yards: a blocker&rsquo;s hands to a defender&rsquo;s head or neck.</li>
            <li><strong>Block in the back</strong>, 10 yards: blocking an opponent from behind, above the waist.</li>
            <li><strong>Clipping</strong>, 15 yards: blocking an opponent who doesn&rsquo;t have the ball from behind and below the waist.</li>
          </ul>
        </Block>
        <Block kicker="The common flag" title="Why holding is called so often">
          <p>
            Every play starts with linemen colliding, and a blocker who is beaten has one quick way to stop a pass rusher
            from getting past him: grab hold. That&rsquo;s holding, and it&rsquo;s one of the flags you&rsquo;ll see
            most. Look for a defender spun around or dragged down by his jersey, or a blocker&rsquo;s arms wrapped
            around a defender who has already got past him. Because the penalty usually wipes out the play as well as
            costing 10 yards, a long run can turn into a long way to go.
          </p>
        </Block>
      </Section>

      <Section title="Fouls during the play: passes">
        <Block kicker="The big one" title="Pass interference">
          <p>
            Once a pass is in the air, a defender may go for the ball, but he may not hold, grab or shove the receiver
            to stop him catching it. <strong>Defensive pass interference</strong> gives the
            offense the ball at the spot of the foul and a first down, with no limit on the distance. Only contact more
            than a yard past the line of scrimmage counts, and if the foul happens in the end zone, the offense gets a
            first down at the 1. A 40-yard throw that draws the flag can be a 40-yard gain.
          </p>
          <p>
            <strong>Offensive pass interference</strong>, the same kind of foul committed by a receiver, costs 10 yards
            from the previous spot.
          </p>
        </Block>
        <Block kicker="Coverage" title="Holding and contact in the defense&rsquo;s coverage">
          <p>
            Defenders covering receivers have their own limits, and each of these costs 5 yards plus an automatic first
            down: <strong>defensive holding</strong>; <strong>illegal contact</strong>, which is a defender touching a
            receiver more than 5 yards downfield while the quarterback still has the ball in the pocket; and
            <strong> illegal use of hands</strong> by a defender. Five yards sounds small, but the first down is what
            hurts, especially on third down.
          </p>
        </Block>
        <Block kicker="The passer" title="Ineligible receivers and intentional grounding">
          <p>
            Only some offensive players may catch a forward pass: the players at the two ends of the line, and the
            backs and receivers lined up at least a yard behind it. Linemen can&rsquo;t, so on a pass play they may not
            wander downfield. <strong>Ineligible receiver downfield</strong> costs 5 yards from the previous spot.
          </p>
          <p>
            <strong>Intentional grounding</strong> is a quarterback about to be sacked throwing the ball where none of
            his receivers could catch it, to avoid the loss. It costs a down and 10 yards from the previous spot, or the
            spot of the throw if that&rsquo;s farther back, and it&rsquo;s a safety, 2 points for the defense, if he
            throws it from his own end zone. A quarterback who has left the pocket can throw the ball away legally, as
            long as it reaches the line of scrimmage.
          </p>
        </Block>
      </Section>

      <Section title="Personal fouls and the 15-yard penalties">
        <Block kicker="15 yards" title="The personal fouls">
          <p>
            These are the fouls that risk injury or cross the line on behavior. Each costs 15 yards, and when the
            defense commits one, it usually comes with an automatic first down:
          </p>
          <ul>
            <li><strong>Roughing the passer</strong>: hitting the quarterback late, or driving him into the ground, once he has thrown. A first down too, and a player can be thrown out of the game if it&rsquo;s flagrant.</li>
            <li><strong>Roughing the kicker</strong>: hitting the kicker&rsquo;s planted leg while his kicking leg is in the air, or hitting him when both feet are on the ground. A first down too. Simply <strong>running into the kicker</strong>, touching his kicking leg, is only 5 yards, with no first down.</li>
            <li><strong>Unnecessary roughness</strong>: the general foul for a hit the rules don&rsquo;t allow. A first down when the defense does it, and a player can be thrown out if it&rsquo;s flagrant.</li>
            <li><strong>Facemask</strong>: twisting, turning or pulling an opponent&rsquo;s facemask.</li>
            <li><strong>Horse-collar tackle</strong>: pulling a runner down by his collar. A first down too.</li>
            <li><strong>Hip-drop tackle</strong>: grabbing a runner, then swiveling and dropping the hips to land on his legs at or below the knee. A first down too.</li>
            <li><strong>Unsportsmanlike conduct</strong>: taunting an opponent and other bad behavior.</li>
          </ul>
        </Block>
        <Block kicker="Player safety" title="Why these are the expensive flags">
          <p>
            The 15-yard fouls are mostly about protecting players, which is why the rules hit them hard. For the
            defense the cost is double: the yards, plus a fresh set of downs for the offense. On the homepage drive,
            an incomplete pass on 2nd &amp; 17 should have brought up third and long; roughing the passer turned it
            into 15 yards and a new first down instead.
          </p>
        </Block>
      </Section>

      <Section title="The officials&rsquo; signals">
        <Block kicker="Hand signals" title="What the arms are saying">
          <p>
            After a flag, the officials show the foul with a hand signal, so the crowd knows what was called. These are
            twelve you&rsquo;ll see most often, drawn from the rulebook&rsquo;s own descriptions. Each figure faces you,
            and a blue mark shows the movement that goes with the pose.
          </p>
          <div className="signals">
            {SIGNALS.map(s => <Signal key={s.id} signal={s} />)}
          </div>
        </Block>
        <Block kicker="The crew" title="Who throws the flag">
          <p>
            An NFL game is run by seven officials: the referee, umpire, down judge, line judge, field judge, side judge
            and back judge. Any of them can throw a flag. The referee leads the crew: he has general control of the
            game, the final say on the score, and settles any disagreement among the officials over a call.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
