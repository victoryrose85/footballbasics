import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import FieldDiagram from "@/components/deeper/FieldDiagram";
import Goalposts from "@/components/deeper/Goalposts";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/football-field-explained");

export default function FieldPage() {
  return (
    <DeeperPage
      path="/football-field-explained"
      intro={
        <p>
          An NFL football field is 120 yards long and 53 1/3 yards wide: 100 yards between the two goal lines, with a
          10-yard end zone at each end. A white line crosses it every 5 yards, numbers mark every 10, and two rows of
          hash marks run down the middle to keep every play from starting too close to the edge. Here is what each
          line and mark is for, with the measurements from the rulebook.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive opens with the camera running the length of this field, from one end zone to the other, and the tag at the top names every spot as “own” or “opp” the way this guide does.",
      }}
      related={["/downs-in-football", "/how-scoring-works-in-football", "/special-teams-explained", "/how-to-watch-football"]}
    >
      <Section title="The field at a glance">
        <Block kicker="From above" title="The whole field">
          <p>
            Seen from above, the field is a long green rectangle with an end zone at each end. Everything painted on it
            measures distance down the field, marks a boundary or marks where a play can start.
          </p>
          <FieldDiagram caption="The whole field from above, with every line and mark" />
        </Block>
        <Block kicker="The measurements" title="Size">
          <p>
            The field is 360 feet long and 160 feet wide, which is 120 yards by 53 1/3. The two long edges are the{" "}
            <strong>sidelines</strong> and the two short ones are the <strong>end lines</strong>. A{" "}
            <strong>goal line</strong> runs across the field 10 yards in from each end line. The 100 yards between
            the goal lines are the field of play, where most of the game happens, and the 10 yards between a goal line
            and its end line are an <strong>end zone</strong>, the area a team is trying to carry the ball into.
          </p>
        </Block>
      </Section>

      <Section title="The yard lines and numbers">
        <Block kicker="Counting yards" title="Every 5 yards, numbered every 10, counting to the 50">
          <p>
            A white <strong>yard line</strong> crosses the field every 5 yards, from one goal line to the other.
            Between them, short marks at every single yard run along both sidelines and along both rows of hash marks,
            so you can count yards one at a time.
          </p>
          <p>
            Numbers are painted every 10 yards near each sideline, each one 2 yards tall. They count up from each goal
            line to the 50 in the middle and back down again: 10, 20, 30, 40, 50, 40, 30, 20, 10. Every numbered line except the 50 has a twin in the other half of the field, the
            same distance from the other goal line. Each row of numbers sits with its bottom edge 12 yards in from its
            sideline.
          </p>
        </Block>
        <Block kicker="Which half" title="The arrows">
          <p>
            Beside every number except the 50 is a small white arrow, and it always points toward the nearer goal line.
            That settles which of the two 30s you&rsquo;re looking at: if the arrow beside it points left, the goal line
            it&rsquo;s counting from is off to the left. On a broadcast, where the camera only shows a slice of the
            field, the arrows are a quick way to tell which half the ball is in.
          </p>
        </Block>
        <Block kicker="Naming a spot" title="Own and opp">
          <p>
            Since most numbers appear twice, a spot on the field is named by whose half it&rsquo;s in. A yard line takes
            its number from its distance to a team&rsquo;s goal line, counting only as far as the 50. A ball 19 yards
            from the offense&rsquo;s own goal line is on its own 19. A ball 51 yards from it has crossed midfield, so
            it&rsquo;s on the other team&rsquo;s 49.
          </p>
          <p>
            Broadcasts and announcers do the same, and so does the tag at the top of the homepage&rsquo;s field:
            &ldquo;own 35&rdquo; means the ball is in the offense&rsquo;s own half, 35 yards from the goal line it
            defends, and &ldquo;opp 35&rdquo; means it&rsquo;s 35 yards from the goal line it&rsquo;s attacking.
          </p>
        </Block>
      </Section>

      <Section title="The hash marks">
        <Block kicker="Inbounds lines" title="Where the ball starts each play">
          <p>
            The <strong>hash marks</strong> are the two rows of short lines that run the length of the field, 70 feet 9
            inches in from each sideline. The rulebook calls them the inbounds lines, and they decide how far from the
            middle a play can start. When a play ends between the hash marks, the next play starts right where the
            ball was left. When it ends between a hash mark and the sideline, or out of bounds, the ball is moved in to
            the hash mark before the next play.
          </p>
          <p>
            So no NFL play starts closer to a sideline than the hash marks. College hash marks are closer to the
            sidelines, 60 feet in from each one.
          </p>
        </Block>
      </Section>

      <Section title="The goal line and the end zones">
        <Block kicker="Part of the end zone" title="The goal line is in the end zone">
          <p>
            Each goal line is a white stripe 8 inches wide, and it belongs to the end zone, not to the field of play.
            So a player in bounds with the ball scores a touchdown the moment any part of the ball is on the goal line,
            above it or past it. The ball doesn&rsquo;t have to touch the ground in the end zone. A runner
            who reaches the ball over the line, into the plane of the goal line, has scored. The{" "}
            <GuideLink href="/how-scoring-works-in-football">guide to scoring</GuideLink> covers the touchdown and
            every other way to put points on the board.
          </p>
        </Block>
        <Block kicker="The corners" title="The pylons">
          <p>
            A <strong>pylon</strong>, a short marker, stands at each corner where a goal line meets a sideline.
            The pylons count as part of the end zone too. A runner whose ball touches a pylon has scored, and so has a
            runner in the air whose ball passes over a pylon or inside it.
          </p>
        </Block>
        <Block kicker="Two points" title="The 2-yard mark">
          <p>
            In the middle of the field, 2 yards out from each goal line, is a short line 1 yard long. It marks the spot
            for a two-point try. After a touchdown, the scoring team gets one more play: a kick through the goalposts
            is worth 1 point, and a run or pass into the end zone from the 2 is worth 2.
          </p>
        </Block>
      </Section>

      <Section title="The goalposts">
        <Block kicker="On the end line" title="Goalposts at the back of each end zone">
          <p>
            The goalposts stand on the end line, at the back of each end zone, 10 yards behind the goal line. The
            crossbar is 18 feet 6 inches wide, with its top 10 feet above the ground, and an upright rises 35 feet
            above each end of it. They&rsquo;re held up by a single padded post set back from the end line, and an
            orange ribbon flies from the top of each upright.
          </p>
          <Goalposts caption="The goalposts from the front, to scale" />
          <p>
            Because the posts are 10 yards behind the goal line, every <strong>field goal</strong>, a kick over the
            crossbar for 3 points, is longer than the distance to the goal line. Add the 10 yards of the end zone, and
            the 7 yards or so that the ball is usually set down behind the <strong>line of scrimmage</strong>, the line
            where the play starts, and a kick from the other team&rsquo;s 25 is about a 42-yard attempt.
          </p>
        </Block>
      </Section>

      <Section title="The sidelines and out of bounds">
        <Block kicker="The edges" title="The lines are out of bounds">
          <p>
            The sidelines and end lines are themselves out of bounds. A player is out of bounds when he touches one of
            those lines, or anything on it or beyond it, so a ball carrier whose foot lands on the white paint of the
            sideline is out, even by an inch. When the ball carrier goes out of bounds the play is over, and the ball
            comes back in to the hash mark for the next play.
          </p>
        </Block>
        <Block kicker="On the sideline" title="The chain crew">
          <p>
            Along the sideline stands the <strong>chain crew</strong>, supplied by the home team and dressed in white
            shirts. They carry the markers that show the down and the <strong>line to gain</strong>, the spot the offense has to
            reach for a fresh set of four downs: the box, a marker showing the
            down, and the chains, which mark the line to gain. When a play ends so close to the line to gain that a
            measurement may be needed, the referee can stop the clock while it&rsquo;s done. The{" "}
            <GuideLink href="/downs-in-football">guide to downs</GuideLink> explains how the line to gain is set and
            reset.
          </p>
        </Block>
      </Section>

      <Section title="What isn&rsquo;t painted on the field">
        <Block kicker="Only on TV" title="The blue and yellow lines are TV graphics">
          <p>
            Two of the most useful lines for a viewer aren&rsquo;t on the field at all. The blue line across the field
            at the start of a play, the line of scrimmage, and the yellow line the offense is trying to reach, the line
            to gain, are graphics the broadcast draws over the picture. The rulebook&rsquo;s field markings include
            neither, so they appear only for people watching on TV. In the stadium, the chain crew&rsquo;s markers on the
            sideline show the line to gain instead. There is more on reading a broadcast in the guide to{" "}
            <GuideLink href="/how-to-watch-football">how to watch football</GuideLink>.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
