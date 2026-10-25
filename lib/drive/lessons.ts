import { SITE } from "@/site.config";

// The homepage's words: the hero and one lesson per scene in pose.ts (LESSONS[i] goes with SCENES[i]).
// heading, html and more.label hold HTML (entities such as &rsquo; and &amp;, and <b> for a defined term) and are
// rendered as-is. The kicker is plain text, rendered escaped, so a play lesson's kicker is exactly the tag the
// window shows before the snap ("3rd & 11 · own 34"). Each lesson names only what its play shows in the window,
// every rule fact comes from docs/superpowers/specs/2026-10-24-nfl-rules-check.md, and sides, when a lesson needs
// one, are the viewer's (motion.ts names them from the screen, which is the players' other way).
export interface Lesson { kicker: string; heading: string; html: string; more?: { label: string; href: string } }

export const HERO: { tagline: string; answer: string } = {
  tagline: SITE.tagline,
  answer: "American football is played in short bursts called plays, with a pause after each one while both teams line up again. The team with the ball, the offense, gets four tries, called downs, to move it 10 yards, and each time it makes the 10 it gets four more. The other team, the defense, tries to stop it before it reaches the end zone at the far end and scores a touchdown.",
};

export const LESSONS: Lesson[] = [
  // 0: the camera runs the length of the empty field
  { kicker: "The field", heading: "A hundred yards and two end zones", more: { label: "Every line on the field", href: "/football-field-explained" },
    html: "A football field is 100 yards long from one goal line to the other, with a 10-yard <b>end zone</b> beyond each. The team with the ball is trying to get it across the goal line into the end zone it&rsquo;s facing, which scores a touchdown, worth 6 points, and the other team is there to stop it. The yard numbers count up from each goal line to the 50 in the middle and then back down, so every spot has a twin in the other half. That&rsquo;s why the tag in this window says &ldquo;own 35&rdquo; for the offense&rsquo;s half and &ldquo;opp 35&rdquo; for the opponent&rsquo;s." },

  // 1: the kickoff, caught in the end zone, and the returner kneels
  { kicker: "Kickoff", heading: "The game starts with a kick", more: { label: "Kickoffs, punts and field goals", href: "/special-teams-explained" },
    html: "Each half starts with a kickoff. One team kicks the ball deep, and the other team&rsquo;s <b>returner</b> tries to catch it and run it back as far as he can. The ten players on the kicking team line up across the field and have to stand still until the ball lands or someone touches it, then they race down to tackle him. This kick carries all the way into the end zone, so the returner catches it there and kneels. That&rsquo;s called a <b>touchback</b>, and it means his team starts with the ball at its own 35-yard line without anyone running it back." },

  // 2: the two units line up; the quarterback and the middle linebacker are labeled
  { kicker: "The teams", heading: "Offense, defense and the blue line", more: { label: "Every position explained", href: "/football-positions-explained" },
    html: "The team with the ball is the <b>offense</b>, and the team trying to stop it is the <b>defense</b>. Each has 11 players on the field. Before every play they line up facing each other across the <b>line of scrimmage</b>, an imaginary line through the ball from one sideline to the other, which TV draws in blue. Every play starts with the <b>snap</b>, when the <b>center</b>, the player over the ball, hands it back between his legs, and at that moment every player has to be on his own team&rsquo;s side of the line. The snap usually goes to the <b>quarterback</b>, who runs the offense. Facing him is the middle linebacker, who often relays the defense&rsquo;s plan to his teammates." },

  // 3: the lineup fades; the yellow line is in view
  { kicker: "Downs", heading: "Four tries to go 10 yards", more: { label: "Downs and distance, explained", href: "/downs-in-football" },
    html: "The offense gets four plays, called <b>downs</b>, to move the ball 10 yards. If it gets there, it earns a <b>first down</b>, a fresh set of four tries starting from wherever the ball ends up. If it falls short after four, the ball goes to the other team. TV marks the target with a yellow line, 10 yards past the blue one. The tag at the top of the window keeps count: &ldquo;1st &amp; 10 &middot; own 35&rdquo; means it&rsquo;s the first down, the offense needs 10 yards, and the ball sits on its own 35. That&rsquo;s where this drive begins." },

  // 4: p5, a run for 4, tackled by the middle linebacker
  { kicker: "1st & 10 · own 35", heading: "How a play ends, and where the ball goes next",
    html: "The quarterback hands the ball to the <b>running back</b>, who runs up the middle until the middle linebacker tackles him 4 yards later. A play ends when the player with the ball is brought down, runs out of bounds or scores, and the officials blow their whistles to say so. They then set the ball where his forward progress stopped, and that spot becomes the new line of scrimmage, so the blue line moves up to the 39. He gained 4 of the 10 yards the offense needs, which leaves 6 to go, and the tag now reads &ldquo;2nd &amp; 6.&rdquo;" },

  // 5: p6, a pass to the slot receiver, knocked away
  { kicker: "2nd & 6 · own 39", heading: "An incomplete pass stops the clock",
    html: "This time the quarterback throws to the <b>slot receiver</b>, a receiver who lines up a few yards inside the one out wide, but a defender gets a hand in and knocks the ball away. A pass that hits the ground before anyone catches it is <b>incomplete</b>. The down is used up, and the ball goes back to where the play started, so both lines stay where they were and it&rsquo;s now 3rd &amp; 6. The game clock stops on an incomplete pass, too, which is one reason a game has so many pauses." },

  // 6: p7, a tackle flinches before the snap
  { kicker: "3rd & 6 · own 39", heading: "A flag before the play even starts", more: { label: "Every penalty you&rsquo;ll see", href: "/football-penalties-explained" },
    html: "The five big players packed around the ball are the offense&rsquo;s <b>linemen</b>, and once they settle into their stance, they have to stay still until the snap. Here a <b>tackle</b>, one of the two linemen on the outside of that group, flinches early, and an official throws a yellow flag, the sign that someone has broken a rule. This one is a <b>false start</b>. The ball is never snapped, so there&rsquo;s no play at all, only a 5-yard penalty. The offense is moved back to its own 34 to try the down again, and because the yellow line stays put, the tag goes from 3rd &amp; 6 to 3rd &amp; 11." },

  // 7: p8, a deep throw to the slot receiver, and the corner holds him 18 yards downfield
  { kicker: "3rd & 11 · own 34", heading: "Pass interference can be the biggest flag of all",
    html: "Needing 11 yards, the quarterback throws deep to the slot receiver, and the <b>cornerback</b> covering him, a defender whose job is to stay with receivers, grabs him before the ball arrives. Once a pass is in the air, a defender can go for the ball but can&rsquo;t hold or shove the receiver to stop the catch. That&rsquo;s <b>defensive pass interference</b>, and the penalty gives the offense the ball where the foul happened, with a first down. There&rsquo;s no limit on how far that can be, which is why this flag can be the most costly in the game. Here it moves the ball 18 yards, to the opponent&rsquo;s 48." },

  // 8: p9, a 12-yard run, and a guard held the tackle in front of him at the line
  { kicker: "1st & 10 · opp 48", heading: "Holding: a good run that doesn&rsquo;t count",
    html: "The running back follows his <b>fullback</b>, a blocker who lines up just in front of him, and breaks free for 12 yards. Then the flag appears. At the line of scrimmage, a <b>guard</b>, one of the two linemen beside the center, grabbed and held the defender in front of him. That&rsquo;s <b>offensive holding</b>, one of the flags you&rsquo;ll see most often, and the run doesn&rsquo;t count. The offense is pushed back 10 yards from where the play started, to its own 42, and the tag reads 1st &amp; 20. It&rsquo;s still first down, with twice as far to go." },

  // 9: p10, an 8-yard catch by the tight end on 1st & 20
  { kicker: "1st & 20 · own 42", heading: "Short of the yellow line still counts",
    html: "Facing 1st &amp; 20, the quarterback throws a short pass to the <b>tight end</b>, a player who lines up at the end of the line and both blocks and catches passes. He&rsquo;s tackled after 8 yards, well short of the yellow line, but those yards still count. The ball is set where he went down, which is midfield, so the blue line moves up to the 50 while the yellow line stays where it was, 12 yards ahead. Most drives move like this, a few yards at a time, and the offense now has three downs left to cover the rest." },

  // 10: p11, the end jumps early, the play goes on and the pass falls incomplete
  { kicker: "2nd & 12 · 50", heading: "The other team gets to choose",
    html: "A <b>defensive end</b>, one of the linemen on the outside of the defense&rsquo;s front, jumps across the blue line before the snap. That&rsquo;s <b>offside</b>, and an official throws a flag, but the play carries on and the pass sails over the tight end. Now the offense gets to choose. It can accept the penalty, 5 yards against the defense, or decline it and keep the result of the play. An incomplete pass is worth nothing to the offense, so it takes the 5 yards and play 2nd down again from the opponent&rsquo;s 45. Past midfield, the yard numbers count down toward the goal line the offense is heading for." },

  // 11: p12, a 9-yard catch past the yellow line
  { kicker: "2nd & 7 · opp 45", heading: "First down: the yellow line jumps ahead",
    html: "The slot receiver cuts across the middle, catches a quick pass and keeps going past the yellow line before a <b>safety</b>, one of the two defenders who play deepest, brings him down. He needed 7 yards and got 9, so the offense has a first down. The count starts over at 1st &amp; 10 from the new spot, the opponent&rsquo;s 36, and the yellow line jumps 10 yards ahead of the ball. Every first down buys four more tries, so a drive lasts for as long as the offense keeps reaching that line." },

  // 12: p13, a fake handoff and the end sacks the quarterback 7 yards back
  { kicker: "1st & 10 · opp 36", heading: "A sack loses yards", more: { label: "Football words, A to Z", href: "/football-glossary" },
    html: "The quarterback fakes a handoff to the running back and drops back to throw, but before he can find anyone open, a defensive end gets past the tackle blocking him and pulls him down. Tackling the quarterback behind the line of scrimmage before he throws is a <b>sack</b>. The ball is set where he went down, 7 yards behind where the play began, so the offense loses those yards and the next play starts from the opponent&rsquo;s 43. The yellow line doesn&rsquo;t move with it, so the tag now reads 2nd &amp; 17." },

  // 13: p14, the pass falls incomplete, then the tackle drives the quarterback into the ground
  { kicker: "2nd & 17 · opp 43", heading: "Protecting the quarterback",
    html: "The quarterback gets the pass away, it falls incomplete, and a moment later a <b>defensive tackle</b>, one of the big linemen in the middle of the defense, drives him into the ground anyway. Once a quarterback has thrown, he can&rsquo;t protect himself, so defenders aren&rsquo;t allowed to hit him late or drive him into the turf. Breaking that rule is <b>roughing the passer</b>. It&rsquo;s one of the most expensive flags there is, 15 yards and an automatic first down. A play that gained nothing turns 2nd &amp; 17 into 1st &amp; 10 at the opponent&rsquo;s 28." },

  // 14: p15, a toss, and the corner forces the back out of bounds after 5
  { kicker: "1st & 10 · opp 28", heading: "Out of bounds stops the clock", more: { label: "Why a game takes about three hours", href: "/how-long-is-a-football-game" },
    html: "The quarterback tosses the ball to the running back, who races for the sideline, and a cornerback forces him out of bounds after 5 yards. Going out of bounds ends the play, and it stops the game clock. For most of the game, the clock starts again once the officials have set the ball down and the referee, the official in charge, signals that it&rsquo;s ready for play. In the last two minutes of the first half and the last five minutes of the game, it stays stopped until the next snap. That&rsquo;s why a team that&rsquo;s behind late in a game keeps heading for the sideline." },

  // 15: p16, the play clock runs out with the quarterback still at the line
  { kicker: "2nd & 5 · opp 23", heading: "The play clock",
    html: "Alongside the game clock runs the <b>play clock</b>. It gives the offense 40 seconds from the end of one play to snap the ball for the next, or 25 seconds after some stoppages, such as a penalty or a timeout. It counts down above each end zone, and broadcasts usually show it on screen once it gets low. Here the quarterback is still at the line, sorting out the play, when it reaches zero, so an official flags the offense for <b>delay of game</b>. Like the false start, it&rsquo;s a 5-yard penalty before the snap, and the down is played again, so 2nd &amp; 5 becomes 2nd &amp; 10 from the 28." },

  // 16: p17a and p17b, two short passes: 6 to the tight end, then 3 to the slot receiver
  { kicker: "2nd & 10 · opp 28", heading: "Third down and the red zone", more: { label: "What to watch on each play", href: "/how-to-watch-football" },
    html: "Two short passes follow. The tight end catches the first and falls forward for 6, which makes it 3rd &amp; 4. Third down is the one to watch, because it&rsquo;s usually the offense&rsquo;s last real chance. Fail, and on fourth down most teams kick rather than risk handing the ball over. On third down, the slot receiver catches a quick pass toward the sideline, and a cornerback stops him after 3 yards, one short of the yellow line. That leaves the ball at the 19, inside the <b>red zone</b>, TV&rsquo;s name for the last 20 yards before the goal line." },

  // 17: p18, 4th & 1, and a quarterback sneak for 2 out of a heavy formation
  { kicker: "4th & 1 · opp 19", heading: "Fourth down: kick it, or go for it?",
    html: "On fourth down the offense has a choice to make. It can <b>punt</b>, kicking the ball away to push the other team back. It can try a <b>field goal</b>, a kick between the goalposts worth 3 points. Or it can go for it and try for the first down, knowing that if it falls short, the other team takes over right there. With only a yard to go, this offense goes for it. Extra tight ends and backs crowd in close to block, and the quarterback takes the snap and pushes forward behind his center for 2 yards. That&rsquo;s a <b>quarterback sneak</b>, and it earns a fresh set of downs at the 17." },

  // 18: p19, a fake handoff and an 11-yard catch to the 6; the yellow line goes away
  { kicker: "1st & 10 · opp 17", heading: "What &ldquo;1st &amp; goal&rdquo; means",
    html: "After another fake handoff, a <b>wide receiver</b>, one of the players who line up out near the sidelines, runs downfield and cuts in across the middle for the catch. A safety tackles him at the 6. That&rsquo;s a first down, but there aren&rsquo;t 10 yards left before the goal line, so the goal line itself becomes the target. The tag reads 1st &amp; goal, and the yellow line disappears, because now the end zone is the only place left to aim for. The offense has four tries to cover the last 6 yards." },

  // 19: p20, a goal-line dive for 3
  { kicker: "1st & goal · opp 6", heading: "Football at the goal line", more: { label: "Formations, with diagrams", href: "/football-formations-explained" },
    html: "This close to the end zone, both teams change shape. The offense packs in tight, with two tight ends and the fullback to block, and the defense crowds nearly everyone up near the line, since there&rsquo;s almost no field behind it left to protect. The running back dives in behind the fullback, and the middle linebacker meets him 3 yards later, at the 3. Plays down here are short and crowded, and a 3-yard gain is a good one. It&rsquo;s now 2nd &amp; goal, with three tries left to cover the last 3 yards." },

  // 20: p21, a fake handoff and the touchdown catch by the tight end
  { kicker: "2nd & goal · opp 3", heading: "Touchdown, and what counts as a catch", more: { label: "Replay review and challenges", href: "/nfl-replay-review-and-challenges" },
    html: "The quarterback fakes another handoff, the defense steps up to stop the run, and the tight end slips in behind them to catch the pass in the end zone. That&rsquo;s a <b>touchdown</b>, 6 points. For a catch to count, the receiver has to control the ball and touch down in bounds with both feet, or with any part of his body other than his hands. Then he has to keep control long enough to make a normal football move, such as taking a step or tucking the ball away. Every scoring play is also checked on video replay, so a touchdown can still be overturned before the next play." },

  // 21: the try, kicked from the 15
  { kicker: "The try", heading: "One more point, or two", more: { label: "How scoring works", href: "/how-scoring-works-in-football" },
    html: "After a touchdown, the scoring team gets one more snap, called the <b>try</b>. Most teams kick it. The ball is snapped from the 15-yard line to the <b>holder</b>, who sets it upright on the ground for the <b>kicker</b>, and a kick between the goalposts adds 1 point. That&rsquo;s the <b>extra point</b>, a 33-yard kick, and it&rsquo;s what you see here. Instead, a team can go for 2 points by snapping from the 2-yard line and running or passing the ball into the end zone." },

  // 22: the kickoff the other way, and the rest of the game
  { kicker: "The rest of the game", heading: "Kick off, and do it all again", more: { label: "Overtime rules", href: "/nfl-overtime-rules" },
    html: "Having scored, the team kicks off to the other side, and the roles swap, so the team that was defending becomes the offense and starts its own drive. That rhythm repeats across four 15-minute quarters, and because the clock stops for incomplete passes, runners going out of bounds, timeouts and more, an NFL game usually takes about three hours. Points come four ways: a touchdown is 6, a field goal 3, a <b>safety</b> 2 (the defense scores one by tackling the ball carrier in his own end zone), and the try after a touchdown adds 1 or 2. The team with more points at the end wins, and a tie goes to overtime." },
];
