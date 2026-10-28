import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import Lineup from "@/components/deeper/Lineup";
import { FORMATIONS } from "@/lib/drive/formations";
import { PUNT, defenseOf, offenseOf } from "@/lib/diagrams/lineup";
import { DEFENSES, SPREAD } from "@/lib/diagrams/sets";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/football-formations-explained");

export default function FormationsPage() {
  return (
    <DeeperPage
      path="/football-formations-explained"
      intro={
        <p>
          A formation is the way a team&rsquo;s 11 players line up before a play. In NFL football the offense sets its
          formation first, within a few rules about who must stand where, and the defense answers with one of its own.
          Here are the common formations on both sides of the ball, each one drawn out, and what each tells you about
          the play that&rsquo;s coming.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive uses several of these: the shotgun on its passing downs, a heavy formation for the quarterback sneak on fourth and 1, and a goal-line set, two tight ends and a fullback, for the run at the goal line.",
      }}
      related={["/football-positions-explained", "/how-to-watch-football", "/special-teams-explained", "/football-glossary"]}
    >
      <Section title="What a formation is">
        <Block kicker="Before the snap" title="The pre-snap picture">
          <p>
            Every play starts from a standstill. The offense lines up and holds still, and for a moment before the{" "}
            <strong>snap</strong>, the center&rsquo;s pass back between his legs that starts the play, you can see where
            all 22 players are. That arrangement is the <strong>formation</strong>.
          </p>
          <p>
            The offense&rsquo;s formation hints at who might get the ball: how many receivers are spread out, how many
            backs stand behind the quarterback, and how far back the quarterback is. The defense&rsquo;s formation shows
            what it expects, with more big players near the ball against a run and more defensive backs against a pass.
            None of the names below are rules. They&rsquo;re the shorthand that coaches, players and broadcasters use,
            and the <GuideLink href="/football-positions-explained">guide to positions</GuideLink> explains each player
            in them.
          </p>
        </Block>
        <Block kicker="The rules" title="What the rules require">
          <p>
            The offense has to follow a few rules when it lines up. At least seven of its players must be on the{" "}
            <strong>line of scrimmage</strong>, the line through the ball where the play starts, and the players at
            the two ends of that line must be eligible receivers, players who may catch a pass. Everyone else stands
            back from the line, in the <strong>backfield</strong>.
          </p>
          <p>
            Players may move around before the snap, but after a shift to new spots all 11 must be set, standing still
            at the same time, for at least a full second. When the ball is snapped, one player in the backfield may be
            in motion, as long as he&rsquo;s running parallel to the line or away from it, never toward it. Breaking any
            of these rules costs the offense 5 yards.
          </p>
          <p>
            The defense has far more freedom. Apart from some limits on kicking plays, it may line up however it likes,
            as long as no one is in or beyond the neutral zone, the length of the ball between the two lines, when the
            ball is snapped.
          </p>
        </Block>
      </Section>

      <Section title="Offensive formations">
        <Block kicker="Under center" title="The I formation">
          <p>
            In the <strong>I formation</strong> the quarterback lines up <strong>under center</strong>, right behind the
            center to take the snap from his hands. The rulebook&rsquo;s name for him is a T-formation quarterback,
            one lined up a yard or less behind the snapper. Behind him, in a straight line, stand the fullback and then the running back, which is the
            &ldquo;I&rdquo;. One tight end and two wide receivers fill out the eleven.
          </p>
          <Lineup
            spots={offenseOf(FORMATIONS["i-form"])}
            title="The I formation: the quarterback under center, the fullback and running back lined up behind him, a tight end and two wide receivers, with the seven on the line boxed"
            caption="The I formation, with the seven on the line boxed"
            boxLine
          />
          <p>
            It&rsquo;s built to run. The running back starts about 7 yards deep, so he&rsquo;s at full speed when he reaches
            the line, and the fullback goes ahead of him to block. Because defenses expect a run from it, a fake handoff
            followed by a pass can catch them out.
          </p>
        </Block>
        <Block kicker="Five yards back" title="The shotgun">
          <p>
            In the <strong>shotgun</strong> the quarterback stands about 5 yards behind the center and takes the snap
            through the air. Starting that far back gives him more time to look over the defense and a clearer view
            downfield, so the shotgun is the usual choice when the offense expects to pass.
            A running back stands beside the quarterback, and three receivers spread out wide.
          </p>
          <Lineup
            spots={offenseOf(FORMATIONS.shotgun)}
            title="The shotgun: the quarterback 5 yards behind the center with a running back beside him, a tight end and three wide receivers"
            caption="The shotgun: QB 5 yards back, RB beside him, three receivers"
          />
        </Block>
        <Block kicker="Everyone out wide" title="The spread">
          <p>
            The <strong>spread</strong> takes the shotgun further: four receivers, sometimes five, spread across the
            whole width of the field, and one back or none. The idea is to stretch the defense sideways, so it has to
            cover every receiver and leave fewer players in the middle to stop a run or rush the quarterback.
          </p>
          <Lineup
            spots={SPREAD}
            title="The spread: the quarterback in the shotgun, one running back, and four wide receivers, two on the line and two in the slots"
            caption="The spread: four receivers, one back"
          />
        </Block>
        <Block kicker="Short yardage" title="Goal-line and heavy formations">
          <p>
            When the offense needs a yard or two, close to the goal line or on fourth and short, it does the opposite of
            the spread. It packs players in tight: two or three tight ends, a fullback and a running back, with at most
            one receiver, and everyone close to the ball. These are the <strong>goal-line</strong> and{" "}
            <strong>heavy</strong> formations, all muscle and no deception, built to push forward a short distance.
          </p>
          <Lineup
            spots={offenseOf(FORMATIONS["goal-line"])}
            title="A goal-line formation: the quarterback under center, two tight ends on the line, a receiver in tight, and a fullback and running back behind the quarterback"
            caption="A goal-line formation: two tight ends, a fullback and a running back"
          />
        </Block>
      </Section>

      <Section title="Defensive formations">
        <Block kicker="Four and three" title="The 4-3">
          <p>
            Defenses are named by counting their players from the front. The first number is the defensive linemen and
            the second the linebackers. A <strong>4-3</strong> has four linemen, two tackles in the middle and an end on
            each side, with three linebackers behind them. The other four players are defensive backs: two cornerbacks
            out wide and two safeties deep. It&rsquo;s a balanced defense, solid against the run without giving up much
            against the pass.
          </p>
          <Lineup
            spots={DEFENSES["4-3"]}
            title="The 4-3 defense: four linemen, three linebackers, two cornerbacks and two safeties"
            caption="The 4-3: four linemen, three linebackers, four defensive backs"
          />
        </Block>
        <Block kicker="Three and four" title="The 3-4">
          <p>
            A <strong>3-4</strong> takes a lineman away and adds a linebacker. The middle lineman, the nose tackle,
            lines up right over the center, and the two outside linebackers often stand near the line, where they can
            rush the quarterback or drop back into coverage, so the offense can&rsquo;t be sure which of them is
            coming.
          </p>
          <Lineup
            spots={DEFENSES["3-4"]}
            title="The 3-4 defense: three linemen with the nose tackle over the center, four linebackers with the outside two near the line, two cornerbacks and two safeties"
            caption="The 3-4: three linemen, four linebackers, four defensive backs"
          />
        </Block>
        <Block kicker="Extra defensive backs" title="Nickel and dime">
          <p>
            Against three or more receivers, a defense takes linebackers off and sends in more defensive backs, who are
            quicker and better at covering. With five defensive backs it&rsquo;s the <strong>nickel</strong>, after the
            five-cent coin, and with six it&rsquo;s the <strong>dime</strong>, worth two nickels. The extra back in the
            nickel usually covers the slot receiver. In the homepage drive, the defense answers every shotgun snap with
            its nickel.
          </p>
          <Lineup
            spots={DEFENSES.nickel}
            title="The nickel defense: four linemen, two linebackers and five defensive backs, three of them cornerbacks"
            caption="The nickel: five defensive backs"
          />
          <Lineup
            spots={DEFENSES.dime}
            title="The dime defense: four linemen, one linebacker and six defensive backs"
            caption="The dime: six defensive backs"
          />
        </Block>
        <Block kicker="No room behind" title="The goal-line defense">
          <p>
            Near its own goal line, a defense has no deep field left to protect, so it brings everyone forward. Linemen
            and linebackers crowd the ball to meet a run head on, and the defensive backs move up close to the
            receivers, with only the safeties a few yards farther back.
          </p>
          <Lineup
            spots={defenseOf(FORMATIONS["goal-line"])}
            title="A goal-line defense: four linemen and three linebackers close to the ball, the cornerbacks pressed up and two safeties a few yards back"
            caption="A goal-line defense: everyone close to the ball"
          />
        </Block>
      </Section>

      <Section title="Special-teams formations">
        <Block kicker="The kicks" title="Field goal, punt and kickoff">
          <p>
            Kicking plays have formations of their own. On a <strong>field goal</strong> or an extra point, the offense
            lines up in a tight wall around the long snapper, with the holder kneeling about 7 yards back and the kicker
            behind him. The defense packs the line to try to block the kick, within two limits: a defender lined up
            within a yard of the line must be entirely outside the snapper&rsquo;s shoulder pads, and no more than six
            defenders may be on the line on either side of the snapper.
          </p>
          <Lineup
            spots={[...offenseOf(FORMATIONS["field-goal"]), ...defenseOf(FORMATIONS["field-goal"])]}
            title="A field goal: the long snapper, a tight line of blockers, the holder 7 yards back and the kicker behind him, against a defense packed on the line"
            caption="A field goal: LS long snapper, H holder, K kicker"
          />
          <p>
            A <strong>punt</strong> formation spreads out instead. Seven players are on the line, with a gunner out near
            each sideline ready to sprint after the returner, and the punter stands about 15 yards deep with a personal
            protector a few yards in front of him.
          </p>
          <Lineup
            spots={PUNT}
            title="A punt formation: seven players on the line with a gunner wide at each end, two wings, the personal protector and the punter about 15 yards deep"
            caption="A punt formation: G gunners, PP personal protector, P punter"
          />
          <p>
            The kickoff has the strictest lineup of all: the kicker on his own 35, his ten teammates on the receiving
            team&rsquo;s 40, and at least nine receiving players in a 5-yard setup zone. The{" "}
            <GuideLink href="/special-teams-explained">guide to special teams</GuideLink> draws it and explains each
            kicking play.
          </p>
        </Block>
      </Section>

      <Section title="How the offense changes the picture">
        <Block kicker="Before the snap" title="Shifts and motion">
          <p>
            A formation doesn&rsquo;t have to stay put until the snap. In a <strong>shift</strong>, several players move
            to new spots at once, turning one formation into another; then all 11 have to stand still for a full second
            before the ball is snapped. In <strong>motion</strong>, one player in the backfield is already running,
            sideways or away from the line, when the ball is snapped.
          </p>
          <p>
            Both are ways to change the picture the defense is reacting to. Moving a receiver from one side to the other
            forces the defense to adjust, and how it adjusts, whether a defender follows him across or the defenders
            simply trade places, can tell the quarterback what kind of coverage he&rsquo;s facing.
          </p>
        </Block>
        <Block kicker="At the line" title="The audible">
          <p>
            Sometimes the quarterback sees the defense&rsquo;s formation and decides the play that was called
            won&rsquo;t work against it. He can change it at the line by calling out a new play, which is an{" "}
            <strong>audible</strong>. If you see a quarterback shouting and pointing just before the snap, he may be
            changing the play, adjusting the protection, or only pretending to, to make the defense show its hand.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
