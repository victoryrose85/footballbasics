import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import Lineup from "@/components/deeper/Lineup";
import { FORMATIONS } from "@/lib/drive/formations";
import { defenseOf, offenseOf } from "@/lib/diagrams/lineup";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/football-positions-explained");

// Jersey numbers by position (rules check, row 74)
const NUMBERS: [string, string][] = [
  ["Quarterbacks", "0 to 19"],
  ["Running backs, fullbacks, tight ends and wide receivers", "0 to 49 and 80 to 89"],
  ["Offensive linemen", "50 to 79"],
  ["Defensive linemen", "50 to 79 and 90 to 99"],
  ["Linebackers", "0 to 59 and 90 to 99"],
  ["Defensive backs (cornerbacks and safeties)", "0 to 49"],
  ["Kickers and punters", "0 to 49 and 90 to 99"],
];

export default function PositionsPage() {
  return (
    <DeeperPage
      path="/football-positions-explained"
      intro={
        <p>
          An NFL team has three units, the offense, the defense and special teams, and each one puts 11 players on the
          field at a time. Every one of those players has a position: a job to do, a usual place to line up and a
          range of jersey numbers that goes with it. Here is every position, unit by unit, with diagrams of where each
          player stands.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive lines up the offense and the defense early on, and on every play after that, all the way to the touchdown, you can hover over or tap any player to see his position and what he’s doing.",
      }}
      related={["/football-formations-explained", "/special-teams-explained", "/how-to-watch-football", "/football-glossary"]}
    >
      <Section title="Three units, 11 players each">
        <Block kicker="The units" title="Offense, defense and special teams">
          <p>
            Football is played by two teams of 11 players each. The team with the ball sends out its{" "}
            <strong>offense</strong>, whose job is to move the ball down the field and score. The other team sends out
            its <strong>defense</strong>, whose job is to stop the offense and get the ball back. For the kicking plays,
            the kickoff, the punt, the field goal and the extra point, both teams send out their{" "}
            <strong>special teams</strong> instead.
          </p>
          <p>
            So a team is really three groups of players who take turns on the field. Most players belong to the offense
            or the defense, and many of them also play on special teams.
          </p>
        </Block>
        <Block kicker="Between plays" title="Who is on the field">
          <p>
            The 11 on the field aren&rsquo;t always the same 11. Teams change players between plays to suit the
            moment, sending in an extra receiver when the offense expects to pass, or an extra blocker when it needs a
            single yard. The count never changes, though: 11 a side on every play. Everyone else waits on the
            sideline.
          </p>
          <p>
            A common offense is five linemen, a quarterback, a running back, a tight end and three wide receivers. A
            common defense is four linemen, three linebackers, two cornerbacks and two safeties. Each of those jobs is
            explained below.
          </p>
        </Block>
      </Section>

      <Section title="The offense">
        <Block kicker="Up front" title="The line">
          <p>
            Five players make up the <strong>offensive line</strong>, standing shoulder to shoulder in the middle of
            the field. The <strong>center</strong> is in the middle, over the ball, and starts every play with the{" "}
            <strong>snap</strong>, passing the ball back between his legs, almost always to the quarterback. A{" "}
            <strong>guard</strong> lines up on each side of him, and a <strong>tackle</strong> outside each guard.
          </p>
          <p>
            Their job is blocking. On a running play they drive defenders back or aside to open a gap for the runner.
            On a passing play they form the <strong>pocket</strong>, a wall around the quarterback that buys him time
            to throw. Linemen are the biggest players on the offense, and they almost never touch the ball after the
            snap.
          </p>
          <p>
            The rules require at least seven offensive players on the line of scrimmage, the line through the ball
            where each play starts, when the ball is snapped. The five linemen are five of them. The other two are
            usually a tight end and a wide receiver, and whoever stands at each end of the line is allowed to catch a
            pass.
          </p>
          <Lineup
            spots={offenseOf(FORMATIONS["i-form"])}
            title="The offense in an I formation: seven players on the line of scrimmage, boxed, with the quarterback, fullback and running back in a line behind the center and a receiver split wide on each side"
            caption="The offense in an I formation, the seven on the line boxed: C center, G guard, T tackle, TE tight end, WR wide receiver, QB quarterback, FB fullback, RB running back"
            boxLine
          />
        </Block>
        <Block kicker="The playmaker" title="The quarterback">
          <p>
            The <strong>quarterback</strong> lines up behind the center, either right behind him to take the snap from
            his hands or several yards back, a setup called the shotgun. He&rsquo;s the player who makes the offense go.
            Before the play he tells his teammates what they&rsquo;re running, and once everyone is set he can change it
            if he doesn&rsquo;t like how the defense has lined up.
          </p>
          <p>
            After the snap, the ball is his to deliver. He can hand it to a running back, throw it to a receiver, or
            tuck it under his arm and run. Because so many plays start in his hands, he&rsquo;s the one the defense
            most wants to reach, and a quarterback tackled behind the line before he can throw has been{" "}
            <strong>sacked</strong>.
          </p>
        </Block>
        <Block kicker="In the backfield" title="Running backs and the fullback">
          <p>
            The players lined up behind the line are the <strong>backfield</strong>. Besides the quarterback, it
            usually holds a <strong>running back</strong>, the offense&rsquo;s main ball carrier, who takes handoffs and
            looks for the gap his linemen open. A good running back also catches short passes, and on passing plays he
            may stay in to block a defender rushing the quarterback. You may hear him called a halfback or tailback;
            they mean the same thing.
          </p>
          <p>
            Some <strong>formations</strong>, the arrangements an offense lines up in, add a <strong>fullback</strong>, a bigger, heavier back who lines up between the
            quarterback and the running back. He is mainly a blocker: he leads the running back through the gap and
            hits the first defender in the way. Now and then a fullback gets the ball himself, usually when the offense
            needs only a yard or two.
          </p>
        </Block>
        <Block kicker="Half lineman, half receiver" title="Tight ends">
          <p>
            A <strong>tight end</strong> lines up at the end of the offensive line, right beside a tackle. He&rsquo;s
            big enough to block like a lineman and quick enough to run out and catch passes, so the defense
            has to be ready for either on every play. Some formations use two or
            three tight ends, especially near the goal line, and a tight end sometimes lines up a step behind the line
            instead of on it.
          </p>
        </Block>
        <Block kicker="Out wide" title="Wide receivers and the slot">
          <p>
            <strong>Wide receivers</strong> line up out toward the sidelines, well away from the linemen. On a passing
            play each one runs a <strong>route</strong>, a planned path down the field, trying to get far enough from the
            defender covering him to catch the throw. They&rsquo;re the quarterback&rsquo;s favorite targets on long
            passes. On running plays they block the defenders near them.
          </p>
          <p>
            Most offenses use two or three receivers. One usually stands on the line of scrimmage, so he counts toward
            the seven, and another a step behind it. A receiver who lines up between the widest receiver and the line,
            rather than out near the sideline, is in the <strong>slot</strong>, and he&rsquo;s called the slot receiver.
          </p>
        </Block>
      </Section>

      <Section title="The defense">
        <Block kicker="Up front" title="The defensive line">
          <p>
            The <strong>defensive line</strong> faces the offensive line, nose to nose across the ball. Most defenses
            use three or four linemen. The ones in the middle are <strong>defensive tackles</strong>, big players who
            take up blockers and plug the gaps a runner would aim for. The ones on the outside are{" "}
            <strong>defensive ends</strong>, usually faster, whose favorite job is chasing down the quarterback before
            he can throw.
          </p>
          <Lineup
            spots={defenseOf(FORMATIONS.singleback)}
            title="The defense in a 4-3: four linemen across from the ball, three linebackers behind them, a cornerback wide on each side and two safeties deep"
            caption="The defense in a 4-3: DE defensive end, DT defensive tackle, LB linebacker, CB cornerback, S safety"
          />
        </Block>
        <Block kicker="The second level" title="Linebackers">
          <p>
            <strong>Linebackers</strong> stand a few yards behind the defensive line, and they have the widest job on
            the defense. On a running play they fill whatever gap the runner heads for and make the tackle. On a
            passing play they cover tight ends and running backs on short routes, or rush the quarterback themselves.
            The <strong>middle linebacker</strong> lines up across from the center and often passes the defense&rsquo;s
            call to everyone else; the <strong>outside linebackers</strong> line up on either side of him.
          </p>
          <p>
            A defense is often named by its count of linemen and linebackers. A <strong>4-3</strong>, like the one in
            the diagram above, has four linemen and three linebackers. A <strong>3-4</strong> has three and four.
          </p>
        </Block>
        <Block kicker="The last line" title="The secondary">
          <p>
            The defensive backs, together called the <strong>secondary</strong>, cover the receivers and guard against
            long passes. <strong>Cornerbacks</strong> line up across from the wide receivers and stay with them, trying
            to knock the ball away or catch it themselves. <strong>Safeties</strong> line up deepest of all, where they can help a cornerback against a long throw or come forward to tackle a runner who
            gets past everyone else. The position shares its name with a safety, the 2-point score, but the two have
            nothing to do with each other.
          </p>
          <p>
            Against an offense with three or more receivers, a defense often takes off a linebacker and sends in a fifth
            defensive back, the <strong>nickel back</strong>, who usually covers the slot receiver. The{" "}
            <GuideLink href="/football-formations-explained">guide to formations</GuideLink> draws the 4-3, the 3-4, the
            nickel and the other common lineups.
          </p>
        </Block>
      </Section>

      <Section title="Special teams">
        <Block kicker="The kickers" title="Kicker and punter">
          <p>
            The <strong>kicker</strong> kicks off to start each half and after scores, and he kicks field goals and
            extra points. The <strong>punter</strong> comes on when the offense decides to give the ball up, usually on
            fourth down, and kicks the ball away to push the other team back.
          </p>
        </Block>
        <Block kicker="The snap and the hold" title="Long snapper and holder">
          <p>
            On punts, field goals and extra points, the center is replaced by the <strong>long snapper</strong>, a
            specialist who snaps the ball much farther back than a normal snap, to the punter or to the holder. The{" "}
            <strong>holder</strong> kneels behind the line, catches the snap and sets the ball on the ground for the
            kicker. Holding is a part-time job, and teams often give it to the punter.
          </p>
        </Block>
        <Block kicker="The chase" title="Returner and gunners">
          <p>
            The <strong>returner</strong> waits deep to catch kickoffs or punts and run them back. On punts, the
            kicking team&rsquo;s fastest players, the <strong>gunners</strong>, line up out near the sidelines and race
            down the field to tackle him. The rest of each unit blocks or covers, and they&rsquo;re often backups from
            the offense and the defense. The{" "}
            <GuideLink href="/special-teams-explained">guide to special teams</GuideLink> walks through each kicking play
            and the rules that shape it.
          </p>
        </Block>
      </Section>

      <Section title="Who can catch the ball">
        <Block kicker="The rule" title="Eligible receivers">
          <p>
            Not every player on the offense may catch a forward pass. Those who can are called{" "}
            <strong>eligible receivers</strong>: the players at either end of the line, and players at least a yard
            behind the line, as long as they wear an eligible number, 0 to 49 or 80 to 89. That takes in the running
            backs, fullbacks, tight ends and wide receivers. The linemen, who wear 50 to 79, aren&rsquo;t eligible in
            their normal spots. A player with another number can become eligible by reporting a change of position
            before the play.
          </p>
          <p>
            Two things widen the list. Once a defender or an eligible offensive player touches a pass, anyone may catch
            it. And the defense can always catch a pass: a defender who catches one has made an{" "}
            <strong>interception</strong>, and the ball is his team&rsquo;s.
          </p>
        </Block>
      </Section>

      <Section title="Numbers tell you the position">
        <Block kicker="Read the jersey" title="Number ranges">
          <p>
            Every position has its own range of jersey numbers, which is handy on TV: a glance at the number tells you
            roughly what a player does. A 70-something on the offense is a lineman, who isn&rsquo;t eligible to catch a
            pass, and an 80-something is a receiver or a tight end.
          </p>
          <div className="table-wrap">
            <table className="data even">
              <caption>Jersey numbers by position in the NFL</caption>
              <thead>
                <tr><th scope="col">Position</th><th scope="col">Numbers</th></tr>
              </thead>
              <tbody>
                {NUMBERS.map(([pos, nums]) => (
                  <tr key={pos}><th scope="row" className="prose">{pos}</th><td className="prose">{nums}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            The ranges overlap, so a number alone doesn&rsquo;t always settle it. A 55 might be a lineman or a
            linebacker, and a 25 might be a running back or a cornerback. Which side of the ball he lines up on, and
            where, tells you the rest.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
