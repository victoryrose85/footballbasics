import { SITE } from "@/site.config";
import type { SlotId } from "./formations";

// The homepage's words: the hero and one lesson per scene in pose.ts (LESSONS[i] goes with SCENES[i]).
// heading, lead, each beat's html and more.label hold HTML (entities such as &rsquo; and &amp;, and <b> for a
// defined term) and are rendered as-is. A lesson is the answer in one line (lead), then short beats. As the reader
// scrolls through a lesson the beats take turns being the one in play (DriveEngine), and each beat's focus names the
// players it talks about (slots, as in formations.ts), which the window highlights. The kicker is plain text,
// rendered escaped, so a play lesson's kicker is exactly the tag the window shows before the snap
// ("3rd & 11 · own 34"). Each lesson names only what its play shows in the window, every rule fact comes from
// docs/superpowers/specs/2026-10-24-nfl-rules-check.md, and sides, when a lesson needs one, are the viewer's
// (motion.ts names them from the screen, which is the players' other way).
export interface Beat { html: string; focus?: SlotId[] }
export interface Lesson { kicker: string; heading: string; lead: string; beats: Beat[]; more?: { label: string; href: string } }

// The whole of a lesson's text, for the tests
export const lessonHtml = (l: Lesson): string[] => [l.lead, ...l.beats.map((b) => b.html)];

export const HERO: { tagline: string; answer: string } = {
  tagline: SITE.tagline,
  answer: "Football is played in short bursts called plays, with a pause after each one while both teams line up again. The team with the ball, the offense, gets four tries, called downs, to move it 10 yards, and each time it makes the 10 it gets four more. The other team, the defense, tries to stop it before it reaches the end zone at the far end and scores a touchdown.",
};

const OFFENSE: SlotId[] = ["o0", "o1", "o2", "o3", "o4", "o5", "o6", "o7", "o8", "o9", "o10"];
const DEFENSE: SlotId[] = ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10"];

export const LESSONS: Lesson[] = [
  // 0: the camera runs the length of the empty field
  { kicker: "The field", heading: "A hundred yards and two end zones", more: { label: "Every line on the field", href: "/football-field-explained" },
    lead: "The team with the ball is trying to carry it into the end zone it&rsquo;s facing.",
    beats: [
      { html: "The field is 100 yards from goal line to goal line, plus a 10-yard <b>end zone</b> at each end." },
      { html: "Crossing the goal line with the ball is a touchdown, worth 6 points." },
      { html: "Yard numbers count up to the 50 and back down. The tag at the top says &ldquo;own 35&rdquo; in the offense&rsquo;s half and &ldquo;opp 35&rdquo; in the other." },
    ] },

  // 1: the kickoff, caught in the end zone, and the returner kneels (kicker d0, returner o0, coverage d1 to d10)
  { kicker: "Kickoff", heading: "The game starts with a kick", more: { label: "Kickoffs, punts and field goals", href: "/special-teams-explained" },
    lead: "Each half starts with a kickoff: one team kicks deep, and the other tries to run it back.",
    beats: [
      { html: "The <b>kicker</b> sends the ball deep.", focus: ["d0"] },
      { html: "The other ten kickers wait in a line until the ball lands or is touched, then race downfield to tackle the returner.", focus: ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10"] },
      { html: "The <b>returner</b> catches it in the end zone and kneels for a <b>touchback</b>: his team starts at its own 35.", focus: ["o0"] },
    ] },

  // 2: the two units line up; the quarterback and the middle linebacker are labeled
  { kicker: "The teams", heading: "Offense, defense and the blue line", more: { label: "Every position explained", href: "/football-positions-explained" },
    lead: "Offense against defense, 11 players each.",
    beats: [
      { html: "The team with the ball is the <b>offense</b>.", focus: OFFENSE },
      { html: "The team trying to stop it is the <b>defense</b>.", focus: DEFENSE },
      { html: "They face off across the <b>line of scrimmage</b>, an imaginary line through the ball. TV draws it in blue." },
      { html: "The <b>center</b>, over the ball, starts each play with the <b>snap</b>, handing it back between his legs.", focus: ["o1"] },
      { html: "The snap usually goes to the <b>quarterback</b>, who runs the offense.", focus: ["o0"] },
      { html: "The <b>middle linebacker</b> faces him and often relays the defense&rsquo;s plan.", focus: ["d5"] },
    ] },

  // 3: the lineup fades; the yellow line is in view
  { kicker: "Downs", heading: "Four tries to go 10 yards", more: { label: "Downs and distance, explained", href: "/downs-in-football" },
    lead: "The offense gets four plays, called <b>downs</b>, to move the ball 10 yards.",
    beats: [
      { html: "Make it and it earns a <b>first down</b>: four fresh tries from there." },
      { html: "Fall short after four and the other team gets the ball." },
      { html: "TV marks the target with a yellow line, 10 yards past the blue one." },
      { html: "The tag keeps count: &ldquo;1st &amp; 10 &middot; own 35&rdquo; is first down, 10 to go, ball on the offense&rsquo;s own 35." },
    ] },

  // 4: p5, a run for 4, tackled by the middle linebacker
  { kicker: "1st & 10 · own 35", heading: "How a play ends, and where the ball goes next",
    lead: "A play ends when the ball carrier is brought down, runs out of bounds or scores.",
    beats: [
      { html: "The quarterback hands the ball to the <b>running back</b>.", focus: ["o0", "o10"] },
      { html: "He runs up the middle until the middle linebacker tackles him 4 yards later.", focus: ["o10", "d5"] },
      { html: "The officials whistle the play dead and set the ball where his forward progress stopped. The blue line moves up to the 39." },
      { html: "4 of the 10 yards gained, 6 to go: &ldquo;2nd &amp; 6.&rdquo;" },
    ] },

  // 5: p6, a pass to the slot receiver, knocked away
  { kicker: "2nd & 6 · own 39", heading: "An incomplete pass stops the clock",
    lead: "A pass that hits the ground before anyone catches it is <b>incomplete</b>.",
    beats: [
      { html: "The quarterback throws to the <b>slot receiver</b>, who lines up just inside the receiver out wide.", focus: ["o0", "o8"] },
      { html: "A defender knocks the ball away.", focus: ["d6"] },
      { html: "The down is used up and the ball goes back to where the play started: now 3rd &amp; 6." },
      { html: "The game clock stops, too, which is one reason a game has so many pauses." },
    ] },

  // 6: p7, a tackle flinches before the snap
  { kicker: "3rd & 6 · own 39", heading: "A flag before the play even starts", more: { label: "Every penalty you&rsquo;ll see", href: "/football-penalties-explained" },
    lead: "A penalty can happen before the play even starts.",
    beats: [
      { html: "The offense&rsquo;s <b>linemen</b> must stay still once they&rsquo;re set.", focus: ["o1", "o2", "o3", "o4", "o5"] },
      { html: "A <b>tackle</b>, one of the two outside linemen, flinches early, and an official throws a yellow flag, the sign of a broken rule.", focus: ["o5"] },
      { html: "That&rsquo;s a <b>false start</b>: no play, just a 5-yard penalty." },
      { html: "The offense backs up to its own 34, so 3rd &amp; 6 becomes 3rd &amp; 11." },
    ] },

  // 7: p8, a deep throw to the slot receiver, and the corner holds him 18 yards downfield
  { kicker: "3rd & 11 · own 34", heading: "Pass interference can be the biggest flag of all",
    lead: "A defender can go for the ball in the air, but can&rsquo;t hold or shove the receiver.",
    beats: [
      { html: "Needing 11 yards, the quarterback throws deep to the slot receiver.", focus: ["o0", "o8"] },
      { html: "The <b>cornerback</b> covering him, a defender who sticks with receivers, grabs him before the ball arrives.", focus: ["d6"] },
      { html: "That&rsquo;s <b>defensive pass interference</b>: the offense gets the ball where the foul happened, plus a first down." },
      { html: "There&rsquo;s no limit on the distance, so it can be the costliest flag in the game. Here it&rsquo;s 18 yards." },
    ] },

  // 8: p9, a 12-yard run, and a guard held the tackle in front of him at the line
  { kicker: "1st & 10 · opp 48", heading: "Holding: a good run that doesn&rsquo;t count",
    lead: "A flag can wipe out a good play.",
    beats: [
      { html: "The running back follows his <b>fullback</b>, a blocker lined up in front of him, for 12 yards.", focus: ["o10", "o8"] },
      { html: "But a <b>guard</b>, one of the two linemen beside the center, grabbed and held the defender in front of him.", focus: ["o3", "d2"] },
      { html: "That&rsquo;s <b>offensive holding</b>, a common flag, and the run doesn&rsquo;t count." },
      { html: "The offense is pushed back 10 yards to its own 42: 1st &amp; 20, twice as far to go." },
    ] },

  // 9: p10, an 8-yard catch by the tight end on 1st & 20
  { kicker: "1st & 20 · own 42", heading: "Short of the yellow line still counts",
    lead: "Yards short of the yellow line still count.",
    beats: [
      { html: "On 1st &amp; 20, the quarterback hits the <b>tight end</b>, who lines up at the end of the line and both blocks and catches.", focus: ["o0", "o6"] },
      { html: "He&rsquo;s tackled after 8 yards, well short of the yellow line.", focus: ["o6"] },
      { html: "The ball is set at midfield, so the blue line moves to the 50. The yellow line stays 12 yards ahead." },
      { html: "Most drives move a few yards at a time." },
    ] },

  // 10: p11, the end jumps early, the play goes on and the pass falls incomplete
  { kicker: "2nd & 12 · 50", heading: "The other team gets to choose",
    lead: "When the defense breaks a rule, the offense chooses the penalty or the play.",
    beats: [
      { html: "A <b>defensive end</b>, an outside lineman, jumps across the blue line before the snap. The flag is for <b>offside</b>.", focus: ["d3"] },
      { html: "The play goes on, and the pass sails over the tight end.", focus: ["o0", "o6"] },
      { html: "The offense can take the 5-yard penalty or decline it and keep the play." },
      { html: "An incomplete pass gains nothing, so it takes the 5 yards: 2nd down again from the opponent&rsquo;s 45." },
    ] },

  // 11: p12, a 9-yard catch past the yellow line
  { kicker: "2nd & 7 · opp 45", heading: "First down: the yellow line jumps ahead",
    lead: "Passing the yellow line earns a first down.",
    beats: [
      { html: "The slot receiver catches a quick pass across the middle and runs past the yellow line.", focus: ["o8"] },
      { html: "A <b>safety</b>, one of the two deepest defenders, brings him down.", focus: ["d10"] },
      { html: "He needed 7 yards and got 9: 1st &amp; 10 from the opponent&rsquo;s 36, and the yellow line jumps ahead." },
      { html: "Each first down buys four more tries, so a drive goes on as long as the offense keeps reaching that line." },
    ] },

  // 12: p13, a fake handoff and the end sacks the quarterback 7 yards back
  { kicker: "1st & 10 · opp 36", heading: "A sack loses yards", more: { label: "Football words, A to Z", href: "/football-glossary" },
    lead: "Tackling the quarterback behind the line of scrimmage before he throws is a <b>sack</b>.",
    beats: [
      { html: "The quarterback fakes a handoff and drops back to throw.", focus: ["o0", "o10"] },
      { html: "A defensive end gets past the tackle blocking him and pulls him down.", focus: ["d0", "o4", "o0"] },
      { html: "The ball is set 7 yards behind where the play began, so the next play starts from the opponent&rsquo;s 43." },
      { html: "The yellow line stays put: 2nd &amp; 17." },
    ] },

  // 13: p14, the pass falls incomplete, then the tackle drives the quarterback into the ground
  { kicker: "2nd & 17 · opp 43", heading: "Protecting the quarterback",
    lead: "Once he has thrown, defenders can&rsquo;t hit the quarterback late or drive him into the turf.",
    beats: [
      { html: "The pass falls incomplete.", focus: ["o0"] },
      { html: "Then a <b>defensive tackle</b>, one of the big linemen in the middle of the defense, drives him into the ground anyway.", focus: ["d2", "o0"] },
      { html: "That&rsquo;s <b>roughing the passer</b>: 15 yards and an automatic first down." },
      { html: "A play that gained nothing turns 2nd &amp; 17 into 1st &amp; 10 at the opponent&rsquo;s 28." },
    ] },

  // 14: p15, a toss, and the corner forces the back out of bounds after 5
  { kicker: "1st & 10 · opp 28", heading: "Out of bounds stops the clock", more: { label: "Why a game takes about three hours", href: "/how-long-is-a-football-game" },
    lead: "Going out of bounds ends the play and stops the game clock.",
    beats: [
      { html: "The quarterback tosses to the running back, who races for the sideline.", focus: ["o0", "o10"] },
      { html: "A cornerback forces him out after 5 yards.", focus: ["d8"] },
      { html: "Usually the clock restarts once the officials set the ball and the referee, the official in charge, signals it&rsquo;s ready." },
      { html: "In the last two minutes of the first half and the last five of the game, it stays stopped until the snap." },
    ] },

  // 15: p16, the play clock runs out with the quarterback still at the line
  { kicker: "2nd & 5 · opp 23", heading: "The play clock",
    lead: "The <b>play clock</b> limits how long the offense can take to snap the ball.",
    beats: [
      { html: "It&rsquo;s 40 seconds from the end of one play, or 25 after some stoppages, such as a penalty or a timeout." },
      { html: "Here it reaches zero with the quarterback still at the line, so an official flags <b>delay of game</b>.", focus: ["o0"] },
      { html: "Another 5-yard penalty and a replayed down: 2nd &amp; 5 becomes 2nd &amp; 10." },
    ] },

  // 16: p17a and p17b, two short passes: 6 to the tight end, then 3 to the slot receiver
  { kicker: "2nd & 10 · opp 28", heading: "Third down and the red zone", more: { label: "What to watch on each play", href: "/how-to-watch-football" },
    lead: "Third down is usually the offense&rsquo;s last real chance; on fourth, most teams kick.",
    beats: [
      { html: "The tight end catches a short pass and falls forward for 6: 3rd &amp; 4.", focus: ["o0", "o6"] },
      { html: "On third down, a cornerback stops the slot receiver after 3 yards, one short of the yellow line.", focus: ["o8", "d6"] },
      { html: "That leaves the ball at the 19, in the <b>red zone</b>, TV&rsquo;s name for the last 20 yards before the goal line." },
    ] },

  // 17: p18, 4th & 1, and a quarterback sneak for 2 out of a heavy formation (o6 to o10: tight ends and backs)
  { kicker: "4th & 1 · opp 19", heading: "Fourth down: kick it, or go for it?",
    lead: "On fourth down, the offense has a choice.",
    beats: [
      { html: "It can <b>punt</b> to push the other team back, or kick a <b>field goal</b>, worth 3 points." },
      { html: "Or it can go for it, and a miss hands the other team the ball right there." },
      { html: "With 1 yard to go, it goes for it, crowding in extra tight ends and backs to block.", focus: ["o6", "o7", "o8", "o9", "o10"] },
      { html: "The quarterback follows his center, who drives a defensive tackle back: a <b>quarterback sneak</b>, good for 2 yards and a first down at the 17.", focus: ["o0", "o1", "d2"] },
    ] },

  // 18: p19, a fake handoff and an 11-yard catch to the 6; the yellow line goes away
  { kicker: "1st & 10 · opp 17", heading: "What &ldquo;1st &amp; goal&rdquo; means",
    lead: "Inside the last 10 yards, the goal line becomes the target.",
    beats: [
      { html: "After a fake handoff, a <b>wide receiver</b>, who lines up near the sideline, cuts across the middle for the catch.", focus: ["o9"] },
      { html: "A safety tackles him at the 6.", focus: ["d10"] },
      { html: "There aren&rsquo;t 10 yards left to the goal line, so the tag reads 1st &amp; goal and the yellow line disappears." },
      { html: "The offense has four tries to cover the last 6 yards." },
    ] },

  // 19: p20, a goal-line dive for 3 (o6, o7 tight ends, o9 fullback; d0 to d6 the line and linebackers)
  { kicker: "1st & goal · opp 6", heading: "Football at the goal line", more: { label: "Formations, with diagrams", href: "/football-formations-explained" },
    lead: "Near the end zone, plays are short and crowded, and a 3-yard gain is good.",
    beats: [
      { html: "The offense packs in tight, with two tight ends and a fullback to block.", focus: ["o6", "o7", "o9"] },
      { html: "The defense crowds up near the line, with almost no field behind it to protect.", focus: ["d0", "d1", "d2", "d3", "d4", "d5", "d6"] },
      { html: "The running back dives in behind the fullback, and the middle linebacker stops him at the 3.", focus: ["o10", "o9", "d5"] },
      { html: "2nd &amp; goal: three tries left for 3 yards." },
    ] },

  // 20: p21, a fake handoff and the touchdown catch by the tight end
  { kicker: "2nd & goal · opp 3", heading: "Touchdown, and what counts as a catch", more: { label: "Replay review and challenges", href: "/nfl-replay-review-and-challenges" },
    lead: "A <b>touchdown</b> is worth 6 points, and replay checks every one.",
    beats: [
      { html: "The quarterback fakes a handoff and the defense steps up to stop the run.", focus: ["o0", "o10"] },
      { html: "The tight end slips in behind them and catches the pass in the end zone.", focus: ["o6"] },
      { html: "To count, the receiver must control the ball and touch down in bounds with both feet, or any part of his body but his hands." },
      { html: "Then he must keep control long enough for a normal football move, like a step or tucking the ball away." },
    ] },

  // 21: the try, kicked from the 15 (holder o0, long snapper o1, kicker o10)
  { kicker: "The try", heading: "One more point, or two", more: { label: "How scoring works", href: "/how-scoring-works-in-football" },
    lead: "After a touchdown, the scoring team gets one more snap, the <b>try</b>. Most teams kick it for 1 point.",
    beats: [
      { html: "The ball is snapped from the 15-yard line to the <b>holder</b>, who sets it upright for the kicker.", focus: ["o1", "o0"] },
      { html: "The <b>kicker</b> sends it between the goalposts: the <b>extra point</b>, a 33-yard kick.", focus: ["o10"] },
      { html: "Or a team can go for 2 by snapping from the 2-yard line and running or passing into the end zone." },
    ] },

  // 22: the kickoff the other way, and the rest of the game (the scoring team's kicker is now o0)
  { kicker: "The rest of the game", heading: "Kick off, and do it all again", more: { label: "Overtime rules", href: "/nfl-overtime-rules" },
    lead: "After the score, the team kicks off and the roles swap.",
    beats: [
      { html: "The team that was defending becomes the offense and starts its own drive.", focus: ["d0"] },
      { html: "Four 15-minute quarters, with the clock stopping for incomplete passes, timeouts and more, add up to about three hours." },
      { html: "A touchdown is 6 points, a field goal 3, a <b>safety</b> 2 (most often, the defense tackling the ball carrier in his own end zone) and the try 1 or 2." },
      { html: "More points at the end wins, and a tie goes to overtime." },
    ] },
];
