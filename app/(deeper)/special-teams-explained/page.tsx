import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import Lineup from "@/components/deeper/Lineup";
import { FORMATIONS } from "@/lib/drive/formations";
import { PUNT, defenseOf, offenseOf } from "@/lib/diagrams/lineup";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/special-teams-explained");

// The 2026 kickoff (rules check, row 2), in yards from the ball at the kicking team's 35: the receivers' 40 is 25
// yards on, their setup zone runs from their 35 to their 30, and the landing zone from their 20 to the goal line.
const KICKOFF_ZONES = [
  { from: 30, to: 35, label: "Setup zone" },
  { from: 45, to: 65, label: "Landing zone" },
  { from: 65, to: 75, label: "End zone", dark: true },
];
// The drive starts the kicker on his run-up, 6 yards back; here he stands on the line the copy puts him on
const KICKOFF_SPOTS = [
  ...offenseOf(FORMATIONS.kickoff),
  ...defenseOf(FORMATIONS.kickoff).map(s => (s.pos === "k" ? { ...s, at: [s.at[0], 0] as [number, number] } : s)),
];
const KICKOFF_MARKS = [
  { at: 0, label: "Kickers’ 35" },
  { at: 25, label: "Receivers’ 40" },
  { at: 65, label: "Goal line" },
];

export default function SpecialTeamsPage() {
  return (
    <DeeperPage
      path="/special-teams-explained"
      intro={
        <p>
          Special teams are the players a team sends out for kicking plays: kickoffs, punts, field goals and the extra
          point. Each of those plays has its own rules and its own lineup, and between them they decide where most
          drives start and a good share of the points. A kickoff starts each half and follows every score, a punt
          gives the ball away on fourth down, and a field goal or extra point kicks for points.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive opens with a kickoff that sails into the end zone for a touchback at the 35, and ends with the extra point: the snap to the holder at the 15 and a 33-yard kick through the goalposts.",
      }}
      related={["/how-scoring-works-in-football", "/football-field-explained", "/football-positions-explained", "/how-long-is-a-football-game"]}
    >
      <Section title="What special teams are">
        <Block kicker="The kicking plays" title="A different 11 for every kick">
          <p>
            Most plays in football are run by the offense and the defense. For the kicking plays, both teams change
            personnel. The team kicking sends out its kicker or punter, a long snapper to send
            the ball back accurately and fast players to cover the kick. The team receiving sends out blockers and a
            returner to catch it and run it back. Together these units are the <strong>special teams</strong>, and
            they&rsquo;re on the field for four kinds of play: the kickoff, the punt, the field goal and the try after a
            touchdown.
          </p>
        </Block>
      </Section>

      <Section title="The kickoff">
        <Block kicker="2026 rules" title="How it lines up">
          <p>
            A <strong>kickoff</strong> puts the ball in play at the start of each half, after a try and after a field
            goal. The kicker lines up at his own 35, but the other ten players on his team
            don&rsquo;t stand beside him. They line up 25 yards farther on, with a foot on the receiving team&rsquo;s 40.
          </p>
          <p>
            The receiving team must stay on or behind its own 35, with at least nine players in the{" "}
            <strong>setup zone</strong>, the 5 yards from its 35 to its 30, and at least five of them with a foot on
            the 35. Its returners wait deep. Nobody in either line may move until the ball lands or is touched, so the
            two walls of players stand still while the kick is in the air.
          </p>
          <Lineup
            spots={KICKOFF_SPOTS}
            title="The 2026 kickoff: the kicker at his 35, his ten teammates on the receivers' 40, nine receiving players in the setup zone, and two returners deep"
            caption="The kickoff: kicking team in blue, receiving team in orange"
            layout={{ squeeze: false, pxPerYard: 5 }}
            zones={KICKOFF_ZONES}
            marks={KICKOFF_MARKS}
            scrimmage={false}
          />
          <p>
            The kick has to come down in the <strong>landing zone</strong>, from the receiving team&rsquo;s 20 to its
            goal line, or in the end zone. Once the ball lands or a returner touches it, everyone is free to move: the
            returner runs it back behind his blockers, and the kicking team chases him down.
          </p>
        </Block>
        <Block kicker="No return" title="Touchbacks">
          <p>
            A <strong>touchback</strong> is a kick that ends behind the receiving team&rsquo;s goal line with no return:
            the ball goes through the end zone, or the returner kneels down with it there. If the kick reached the end
            zone in the air, without touching the ground or a player in the landing zone first, the receiving team
            starts its drive at its own 35. If it bounced in the landing zone first and then ended in the end zone, the
            drive starts at the 20 instead.
          </p>
        </Block>
        <Block kicker="A bad kick" title="Out of bounds, or short of the landing zone">
          <p>
            A kickoff that goes out of bounds, or lands short of the landing zone, gives the receiving team a choice:
            it can take the ball about 25 yards from where it was kicked, around its own 40, or where the ball landed or
            was touched if that&rsquo;s closer to the kicker.
          </p>
        </Block>
        <Block kicker="The gamble" title="The onside kick">
          <p>
            An <strong>onside kick</strong> is a short kickoff the kicking team hopes to recover itself, usually when
            it&rsquo;s behind late in a game. Since 2026, a team may declare an onside kick at any point in the game by
            telling the referee before the play clock starts. The kicking team may recover the ball once a receiving
            player touches it, or once it has gone 10 yards. If the kick goes past the area where the receiving team
            lines up for it without anyone touching it, that&rsquo;s a 15-yard penalty and the receiving team&rsquo;s
            ball.
          </p>
        </Block>
      </Section>

      <Section title="The punt">
        <Block kicker="Fourth down" title="When teams punt">
          <p>
            A <strong>punt</strong> is a kick that gives the ball to the other team on purpose. A team usually punts
            on fourth down when it is too far away for a field goal and doesn&rsquo;t want to risk going for it. The
            punter drops the ball and kicks it before it hits the ground, as far down the field as he can, so the other
            team starts its drive a long way from the end zone it&rsquo;s attacking.
          </p>
        </Block>
        <Block kicker="The rules" title="The rules of a punt">
          <p>
            The punt has to be kicked from behind the line of scrimmage, the line where the play starts. Until the ball
            is kicked, only the players at the two ends of the line, along with any eligible receivers split out wide
            beyond them, may go more than a yard downfield. That&rsquo;s why two of the fastest players on the punt team
            usually line up out wide: they&rsquo;re the <strong>gunners</strong>, the first ones allowed to sprint at the
            returner.
          </p>
          <Lineup
            spots={PUNT}
            title="A punt formation: seven players on the line with a gunner wide at each end, two wings, the personal protector and the punter about 15 yards deep"
            caption="A punt formation: G gunners, PP personal protector, P punter"
          />
          <p>
            The <strong>personal protector</strong> stands a few yards in front of the punter and picks up anyone who
            breaks through. If the punt rolls into the end zone without the receiving team touching it, it&rsquo;s a
            touchback, and the receiving team starts at its 20. If a player on the punting team is the first to touch
            the ball past the line, the receiving team can take it at that spot.
          </p>
        </Block>
      </Section>

      <Section title="Catching a kick: the return and the fair catch">
        <Block kicker="Run it back" title="The return">
          <p>
            The player who catches a kick is the <strong>returner</strong>. He can run it back as far as he can, and
            his teammates block for him, so a good return can gain 20 or 30 yards, or score a touchdown. On a punt,
            the returner is sometimes called the punt returner; on a kickoff, the kick returner.
          </p>
        </Block>
        <Block kicker="Hand up" title="The fair catch">
          <p>
            A returner who doesn&rsquo;t want to be hit as he catches the ball can call for a <strong>fair
            catch</strong>. While the kick is in the air, he fully extends one arm above his helmet and waves it from
            side to side. In return for that signal, no opponent may tackle him or touch him unnecessarily, but he
            can&rsquo;t run with the ball after catching it. The ball is dead where he catches it, and his team&rsquo;s
            next snap is from there. Hitting a player who has signalled for a fair catch costs 15 yards.
          </p>
          <p>
            A fair catch also gives the receiving team a rare option: a <strong>fair catch kick</strong>, a free try at
            a field goal from the spot of the catch, with no one allowed to rush the kicker.
          </p>
        </Block>
        <Block kicker="Leave him be" title="Roughing and running into the kicker">
          <p>
            The defense may try to block a punt or a field goal, but it may not crash into the kicker. Hitting his
            planted leg while his kicking leg is in the air, or hitting him when both feet are on the ground, is
            <strong> roughing the kicker</strong>: 15 yards and an automatic first down for the kicking team. Merely
            touching his kicking leg is <strong>running into the kicker</strong>, a 5-yard foul with no first down.
          </p>
        </Block>
      </Section>

      <Section title="The field goal">
        <Block kicker="Snap, hold, kick" title="How it&rsquo;s kicked">
          <p>
            A <strong>field goal</strong> is a normal down in which the offense kicks for 3 points. The long snapper
            sends the ball back to the holder, who kneels about 7 yards behind the line and sets it on the ground; no
            tee is allowed. The kicker steps into it and has to send the whole ball over the crossbar and between the
            uprights. The rest of the unit forms a tight wall to keep defenders away from the kick.
          </p>
          <Lineup
            spots={[...offenseOf(FORMATIONS["field-goal"]), ...defenseOf(FORMATIONS["field-goal"])]}
            title="A field goal: the long snapper, a tight line of blockers, the holder 7 yards back and the kicker behind him, against a defense packed on the line"
            caption="A field goal: LS long snapper, H holder, K kicker"
          />
          <p>
            The defense has limits of its own. A defender lined up within a yard of the line can&rsquo;t line up over
            the snapper, and no more than six defenders may line up on the line on either side of him.
          </p>
        </Block>
        <Block kicker="The distance" title="How long a field goal is">
          <p>
            The goalposts stand on the end line, 10 yards behind the goal line, and the holder usually sets the ball
            about 7 yards behind the line of scrimmage. So a field goal is about 17 yards longer than the distance from
            the line of scrimmage to the goal line. From the other team&rsquo;s 25, that&rsquo;s about a 42-yard kick.
          </p>
        </Block>
        <Block kicker="The miss" title="A miss">
          <p>
            If a field goal misses and crosses the line untouched by the other team, that team takes over at the spot
            of the kick, or at its own 20 if the kick came from inside the 20. That&rsquo;s the risk in a long attempt:
            a miss from midfield hands the other team the ball near midfield.
          </p>
        </Block>
      </Section>

      <Section title="The extra point">
        <Block kicker="1 point" title="The try kick">
          <p>
            After a touchdown, the scoring team gets one snap, the <strong>try</strong>, and most teams kick it. The
            field goal unit comes out, the ball is snapped from the 15-yard line and the kick through the goalposts is
            worth 1 point. With the 10 yards of the end zone and the holder&rsquo;s spot behind the line added, it&rsquo;s a 33-yard kick. The other choice, a run
            or pass from the 2 for 2 points, and every other way to score are in the{" "}
            <GuideLink href="/how-scoring-works-in-football">guide to scoring</GuideLink>.
          </p>
        </Block>
      </Section>

      <Section title="Who plays special teams">
        <Block kicker="The specialists" title="The specialists">
          <p>Most special teams players also play on the offense or the defense, but a few are there only for the kicks:</p>
          <ul>
            <li><strong>Kicker</strong>: kicks off, and kicks field goals and extra points.</li>
            <li><strong>Punter</strong>: punts on fourth down.</li>
            <li><strong>Long snapper</strong>: snaps the ball about 7 yards back to the holder, or about 15 to the punter, quickly and accurately.</li>
            <li><strong>Holder</strong>: catches the snap and sets the ball on the ground for the kicker.</li>
            <li><strong>Returner</strong>: catches kickoffs and punts and runs them back.</li>
          </ul>
          <p>
            You&rsquo;ll rarely see these players on a normal down. The <GuideLink href="/football-positions-explained">guide to positions</GuideLink> covers
            them alongside everyone else on a team.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
