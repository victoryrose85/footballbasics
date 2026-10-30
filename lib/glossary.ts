// The glossary's terms. Definitions are plain text because the DefinedTermSet structured data reads them; `href`
// is the guide that covers the term in depth. A rule-backed term follows its row of the rules check; the rest are
// football vocabulary (rows 81 and N8) and make no rule claim.
export interface Term {
  term: string;
  definition: string;
  href?: string;
}

export const TERMS: Term[] = [
  { term: "Accept or decline", definition: "The choice a team has after the other team fouls: take the penalty, or turn it down and keep the result of the play. Declining makes sense when the play went better than the penalty would.", href: "/football-penalties-explained" },
  { term: "Audible", definition: "A change of play the quarterback calls out at the line of scrimmage, after he sees how the defense has lined up." },
  { term: "Automatic first down", definition: "A first down that comes with a penalty, however far the offense still had to go. Most fouls by the defense give one, though offside and a few other small fouls don’t.", href: "/football-penalties-explained" },
  { term: "Backfield", definition: "The area behind the line of scrimmage on the offense’s side, and the players who line up there. It usually holds the quarterback and a running back.", href: "/football-positions-explained" },
  { term: "Blitz", definition: "A play in which the defense sends extra players, usually linebackers or defensive backs, to rush the quarterback rather than cover receivers. It adds pressure but leaves fewer defenders in coverage." },
  { term: "Block in the back", definition: "A foul for blocking an opponent from behind, above the waist. When the offense commits it, the penalty is 10 yards.", href: "/football-penalties-explained" },
  { term: "Blue line", definition: "The line TV draws across the field to show the line of scrimmage, where the play starts. It isn’t painted on the field, so only people watching on TV can see it.", href: "/how-to-watch-football" },
  { term: "Bye week", definition: "The one week of the 18-week regular season when a team has no game. Every team gets one, so each plays 17 games.", href: "/how-the-nfl-season-works" },
  { term: "Catch", definition: "A player has caught a pass when he secures the ball before it touches the ground, gets both feet or another body part (not his hands) down inbounds, and then makes a normal football move, such as another step, or holds it long enough to do so.", href: "/nfl-replay-review-and-challenges" },
  { term: "Center", definition: "The offensive lineman in the middle of the line, over the ball. He starts each play by passing the ball back between his legs, almost always to the quarterback.", href: "/football-positions-explained" },
  { term: "Chains", definition: "The markers on the sideline that show how far the offense must go for a first down, worked by a chain crew in white shirts. When a play ends close to the mark, the referee may stop the clock to measure.", href: "/football-field-explained" },
  { term: "Challenge", definition: "A coach’s request for a second look at a play on video, made by throwing a red flag before the next snap. Each team gets at least two, and a failed one costs a timeout.", href: "/nfl-replay-review-and-challenges" },
  { term: "Clipping", definition: "A foul for blocking a player who doesn’t have the ball from behind and below the waist. The penalty is 15 yards.", href: "/football-penalties-explained" },
  { term: "Coin toss", definition: "The toss at midfield just before kickoff, called by the visiting captain. The winner chooses to receive or kick, chooses which goal to defend, or puts off the choice until the second half.", href: "/how-long-is-a-football-game" },
  { term: "Cornerback", definition: "A defender who lines up across from a wide receiver and stays with him, trying to knock the ball away or catch it himself.", href: "/football-positions-explained" },
  { term: "Dead ball", definition: "The ball once a play is over, because the runner is down or out of bounds, his forward progress has stopped, or someone has scored. The officials signal it with a whistle." },
  { term: "Defense", definition: "The team without the ball on a given play, trying to stop the other team from moving forward and to win the ball back.", href: "/football-positions-explained" },
  { term: "Defensive back", definition: "A defender whose main job is covering receivers and guarding against long passes. Cornerbacks and safeties are both defensive backs, and together they’re called the secondary.", href: "/football-positions-explained" },
  { term: "Delay of game", definition: "A foul when the offense doesn’t snap the ball before the play clock runs out. The penalty is 5 yards, and the same down is played again.", href: "/football-penalties-explained" },
  { term: "Down", definition: "One of the four tries the offense gets to move the ball far enough to keep it. Downs are numbered first to fourth, and each one is a single play.", href: "/downs-in-football" },
  { term: "Drive", definition: "One team’s whole stretch with the ball, from the play where it takes over until it scores or gives the ball up. A long one can take many plays and several minutes." },
  { term: "Encroachment", definition: "A foul when a defender crosses into the space between the teams and touches an offensive player or the ball before the snap. The officials whistle it at once, and the penalty is 5 yards.", href: "/football-penalties-explained" },
  { term: "End zone", definition: "The 10-yard area at each end of the field, between the goal line and the end line. Taking the ball into the other team’s end zone scores a touchdown.", href: "/football-field-explained" },
  { term: "Extra point", definition: "The kick a team usually tries right after a touchdown, worth 1 point. It’s snapped from the 15-yard line, which makes it a 33-yard kick.", href: "/how-scoring-works-in-football" },
  { term: "Facemask", definition: "A foul for twisting, turning or pulling the bars on the front of an opponent’s helmet. The penalty is 15 yards.", href: "/football-penalties-explained" },
  { term: "Fair catch", definition: "A catch of a kick after the catcher waves one arm above his helmet while the ball is in the air. He can’t run with it, no opponent may tackle him, and the next snap is at that spot.", href: "/special-teams-explained" },
  { term: "False start", definition: "A foul when an offensive player who was set in his stance moves before the snap. The penalty is 5 yards, and the same down is played again.", href: "/football-penalties-explained" },
  { term: "Field goal", definition: "A kick worth 3 points, taken from on or behind the line of scrimmage. All of the ball must pass above the crossbar and between the uprights.", href: "/how-scoring-works-in-football" },
  { term: "First down", definition: "The first of a set of four tries, and the reward for moving the ball far enough: reach the mark and the offense gets four new tries from there.", href: "/downs-in-football" },
  { term: "Flag", definition: "The yellow flag an official throws onto the field when he sees a foul during a play. The play carries on to the end, and the penalty is settled afterward.", href: "/football-penalties-explained" },
  { term: "Forward progress", definition: "The farthest point a runner reached before he was stopped. The ball is placed there even if defenders then push him back." },
  { term: "Fourth down", definition: "The offense’s last try. If it comes up short, the other team gets the ball where the play ended, which is why offenses so often punt or kick a field goal instead.", href: "/downs-in-football" },
  { term: "Fullback", definition: "A bigger, heavier back who lines up between the quarterback and the running back. He’s mainly a blocker, leading the running back through the gap, and sometimes carries the ball for a yard or two.", href: "/football-positions-explained" },
  { term: "Fumble", definition: "When a player who has the ball loses hold of it while the play is still going. The ball is loose until someone falls on it, and if the other team recovers it, the ball is theirs." },
  { term: "Goal line", definition: "The line at the front of each end zone, 10 yards in from the end line. It counts as part of the end zone, so the ball only has to reach it for a touchdown.", href: "/football-field-explained" },
  { term: "Goalposts", definition: "The structure at the back of each end zone that kicks have to clear: a crossbar 18 feet 6 inches wide with its top 10 feet up, and two uprights rising 35 feet above it.", href: "/football-field-explained" },
  { term: "Guard", definition: "An offensive lineman who lines up right beside the center, one on each side. Guards block for the runner and protect the quarterback.", href: "/football-positions-explained" },
  { term: "Hail Mary", definition: "A very long, high pass thrown toward the end zone as time runs out, with several receivers running under it. It’s a last hope, and it rarely works." },
  { term: "Hash marks", definition: "The two rows of short lines running the length of the field, each 70 feet 9 inches in from its sideline. When a play ends outside them, the next snap moves in to the nearer row.", href: "/football-field-explained" },
  { term: "Holder", definition: "The player who kneels behind the line on field goals and extra points, catches the snap and sets the ball on the ground for the kicker. Teams often give the job to the punter.", href: "/special-teams-explained" },
  { term: "Holding", definition: "A foul for grabbing or hooking an opponent to get in his way. By the offense it costs 10 yards; by the defense, 5 yards and an automatic first down.", href: "/football-penalties-explained" },
  { term: "Huddle", definition: "The quick gathering between plays where the players on the offense hear the next play before they line up. Offenses sometimes skip it to save time or keep the defense off balance." },
  { term: "Incomplete pass", definition: "A forward pass that nobody catches. The clock stops, the ball goes back to where the play started, and the offense has used up a down.", href: "/downs-in-football" },
  { term: "Intentional grounding", definition: "A foul when a passer about to lose yards throws the ball where none of his receivers could catch it. It costs a down and usually 10 yards or more, or a safety if he throws from his own end zone.", href: "/football-penalties-explained" },
  { term: "Interception", definition: "A pass caught by a defender, which gives his team the ball. He can then run it back until he’s tackled." },
  { term: "Kicker", definition: "The specialist who kicks off to start each half and after scores, and who kicks field goals and extra points.", href: "/football-positions-explained" },
  { term: "Kickoff", definition: "The kick that starts each half and restarts the game after a try or a field goal. The kicker lines up at his own 35, and the other team tries to run the ball back.", href: "/special-teams-explained" },
  { term: "Landing zone", definition: "On a kickoff, the area from the receiving team’s 20-yard line to its goal line. A kick that comes down short of it lets the receivers take the ball about 25 yards from the kick.", href: "/special-teams-explained" },
  { term: "Line of scrimmage", definition: "The imaginary line across the field through the front point of the ball, where each play starts. The two teams line up on either side of it, and the offense must have at least seven players on it.", href: "/football-formations-explained" },
  { term: "Line to gain", definition: "The mark the offense must reach for a first down: 10 yards ahead of where its set of downs began, or the goal line if that’s closer.", href: "/downs-in-football" },
  { term: "Linebacker", definition: "A defender who stands a few yards behind the defensive line, stopping runners, covering short passes and sometimes rushing the quarterback. It’s the widest job on the defense.", href: "/football-positions-explained" },
  { term: "Lineman", definition: "A player who starts each play up front, nose to nose with the other team. Offensive linemen wear numbers 50 to 79 and, in their normal spots, aren’t allowed to catch a forward pass.", href: "/football-positions-explained" },
  { term: "Neutral zone", definition: "The gap between the two teams before the snap, as long as the ball itself. When the ball is snapped, the only player who may be in it is the one snapping.", href: "/football-penalties-explained" },
  { term: "Neutral zone infraction", definition: "A foul when a defender moves into the gap between the teams before the snap and makes an offensive player near him react, or has a clear path to the quarterback. The penalty is 5 yards.", href: "/football-penalties-explained" },
  { term: "Nickel", definition: "A defense with five defensive backs instead of the usual four, used against offenses with three or more receivers. The extra player is called the nickel back, and usually covers the slot receiver.", href: "/football-formations-explained" },
  { term: "Offense", definition: "The team with the ball on a given play, trying to move down the field and score.", href: "/football-positions-explained" },
  { term: "Offside", definition: "A foul when any part of a player’s body is in or beyond the neutral zone, the gap between the teams, as the ball is snapped. The penalty is 5 yards, and on the defense it doesn’t bring an automatic first down.", href: "/football-penalties-explained" },
  { term: "Onside kick", definition: "A short kickoff the kicking team hopes to get back itself. It tells the referee first, and it may recover the ball once the kick has gone 10 yards or a receiver has touched it.", href: "/special-teams-explained" },
  { term: "Overtime", definition: "Extra play when the score is tied after four quarters. In the regular season it’s one 10-minute period that can end in a tie; in the playoffs, 15-minute periods go on until someone wins.", href: "/nfl-overtime-rules" },
  { term: "Pass interference", definition: "A foul for illegally getting in the way of a player trying to catch a pass. On the defense it gives the offense a first down at the spot of the foul; on the offense it costs 10 yards.", href: "/football-penalties-explained" },
  { term: "Pick six", definition: "An interception the defender runs all the way back for a touchdown. “Pick” is slang for an interception, and “six” is the points it scores." },
  { term: "Play action", definition: "A play in which the quarterback pretends to hand the ball to a runner, then keeps it and passes. The fake is meant to pull defenders toward the line and away from the receivers." },
  { term: "Play clock", definition: "The countdown the offense has to snap the ball: 40 seconds from the end of the last play, or 25 after a stoppage such as a timeout or a penalty. It’s separate from the game clock.", href: "/how-long-is-a-football-game" },
  { term: "Pocket", definition: "The wall of blockers that forms around the quarterback on a passing play, buying him time to throw.", href: "/football-positions-explained" },
  { term: "Punt", definition: "A kick the offense makes to give the ball up, usually on fourth down, to push the other team back. The punter drops the ball and kicks it before it reaches the ground.", href: "/special-teams-explained" },
  { term: "Pylon", definition: "A short marker at each corner where a goal line meets a sideline. It counts as part of the end zone, so a runner whose ball touches it has scored.", href: "/football-field-explained" },
  { term: "Quarterback", definition: "The player who runs the offense. He takes nearly every snap, then hands the ball to a runner, throws it to a receiver or runs with it himself.", href: "/football-positions-explained" },
  { term: "Quarterback sneak", definition: "A short run in which the quarterback takes the snap and pushes straight ahead behind his linemen, usually when the offense needs only a yard or less." },
  { term: "Receiver", definition: "A player who runs out to catch passes. The rules limit who may: the players at each end of the line, and players at least a yard behind it wearing 0 to 49 or 80 to 89.", href: "/football-positions-explained" },
  { term: "Red zone", definition: "TV’s name for the last 20 yards before the goal line. It isn’t a rule, but an offense that gets there is usually in range for at least a field goal.", href: "/how-to-watch-football" },
  { term: "Referee", definition: "The official who leads the crew of seven. He has general control of the game and the final say on the score, and he settles any disagreement among the officials." },
  { term: "Return", definition: "Running the ball back up the field after catching a kick or a punt, or after taking the ball from the other team. The player who catches kicks is called the returner.", href: "/special-teams-explained" },
  { term: "Roughing the passer", definition: "A foul for illegally hitting a player who is throwing a pass. The penalty is 15 yards and an automatic first down.", href: "/football-penalties-explained" },
  { term: "Runoff", definition: "Ten seconds taken off the game clock late in a half. After the two-minute warning, a replay reversal that would have kept the clock running brings one, unless the team uses a timeout.", href: "/nfl-replay-review-and-challenges" },
  { term: "Running back", definition: "The offense’s main ball carrier, who lines up behind the line, takes handoffs and looks for a gap. He also catches short passes and blocks. You may hear him called a halfback or tailback.", href: "/football-positions-explained" },
  { term: "Sack", definition: "A tackle of the quarterback behind the line of scrimmage before he can throw. The offense loses yards and has used up a down." },
  { term: "Safety", definition: "Two meanings. The score: 2 points for the defense, most often for tackling a runner in his own end zone, after which his team kicks from its own 20. The position: a defensive back who lines up deepest of all.", href: "/how-scoring-works-in-football" },
  { term: "Scrimmage", definition: "A play that starts with a snap, with the two teams on either side of the line, as opposed to a kickoff. Most plays in a game are scrimmage plays." },
  { term: "Series", definition: "The set of four downs the offense gets to reach the line to gain. Reach it and a new series begins; a down wiped out by a penalty doesn’t count toward the four.", href: "/downs-in-football" },
  { term: "Shotgun", definition: "A setup in which the quarterback stands several yards behind the center instead of right behind him, so the snap travels through the air.", href: "/football-formations-explained" },
  { term: "Slot receiver", definition: "A receiver who lines up between the widest receiver and the offensive line, rather than out near the sideline.", href: "/football-positions-explained" },
  { term: "Snap", definition: "The pass back from the center that starts a play, between his legs and almost always to the quarterback.", href: "/football-positions-explained" },
  { term: "Special teams", definition: "The players each team sends out for kicking plays: kickoffs, punts, field goals and extra points. Many of them also play on the offense or the defense.", href: "/special-teams-explained" },
  { term: "Spike", definition: "A pass the quarterback throws straight into the ground right after the snap, on purpose, to stop the clock. It uses up a down, but it saves the time another play would take to set up." },
  { term: "Spot of the foul", definition: "The place on the field where a foul happened. Some penalties are measured from there rather than from where the play began, as when a hold happens downfield on a run.", href: "/football-penalties-explained" },
  { term: "Tackle", definition: "Two meanings. The play: bringing down the player with the ball. The position: an offensive lineman outside each guard, and on the defense, one of the big linemen in the middle.", href: "/football-positions-explained" },
  { term: "Tight end", definition: "A player who lines up at the end of the offensive line, right beside a tackle. He’s big enough to block like a lineman and quick enough to run out and catch passes.", href: "/football-positions-explained" },
  { term: "Timeout", definition: "A pause a team can call to stop the clock. Each team has three per half, and two in a regular-season overtime. One lasts 30 seconds, or two minutes when TV uses it for a commercial.", href: "/how-long-is-a-football-game" },
  { term: "Touchback", definition: "A kick that ends behind the goal line with no return, so the receivers start from a set spot: the 20 after a punt, and the 35 after most kickoffs, or the 20 if the kickoff bounced short first.", href: "/special-teams-explained" },
  { term: "Touchdown", definition: "The biggest score, worth 6 points. A player inbounds with the ball scores one when any part of the ball is on, above or behind the other team’s goal line.", href: "/how-scoring-works-in-football" },
  { term: "Try", definition: "The single bonus play after a touchdown, with no time on the clock. A team can kick from the 15 for 1 point, or run or pass from the 2 for 2 points.", href: "/how-scoring-works-in-football" },
  { term: "Turnover", definition: "When the offense loses the ball to the other team on an interception or a fumble. Failing on fourth down also hands the ball over, which broadcasts call a turnover on downs." },
  { term: "Two-minute warning", definition: "An automatic timeout after the last play that starts before two minutes remain in the second and fourth quarters.", href: "/how-long-is-a-football-game" },
  { term: "Unnecessary roughness", definition: "A foul for needless, dangerous contact with an opponent. The penalty is 15 yards, plus an automatic first down when the defense commits it, and a flagrant case can get a player disqualified.", href: "/football-penalties-explained" },
  { term: "Unsportsmanlike conduct", definition: "A foul for bad behavior, taunting included. The penalty is 15 yards.", href: "/football-penalties-explained" },
  { term: "Wide receiver", definition: "A receiver who lines up out toward the sideline, well away from the linemen. On a passing play he runs a planned path down the field, trying to get open for the throw.", href: "/football-positions-explained" },
  { term: "Wild card", definition: "A playoff place for a team that didn’t win its division. Each conference has three, seeded 5, 6 and 7, and they open the playoffs in the wild card round.", href: "/how-the-nfl-season-works" },
  { term: "Yards after the catch", definition: "The yards a receiver gains by running with the ball once he has caught it, as opposed to the distance the pass traveled in the air." },
  { term: "Yellow line", definition: "The line TV draws across the field to show how far the offense must go for a first down. Like the blue line, it appears only on TV, not on the field.", href: "/how-to-watch-football" },
];

// "Pick six" → "pick-six": the term's anchor on the page
export function termId(term: string): string {
  return term.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// One group per first letter, a to z, with the terms sorted case-insensitively within each.
export function groupTerms(terms: Term[]): { key: string; label: string; terms: Term[] }[] {
  const groups = new Map<string, Term[]>();
  for (const t of terms) {
    const key = t.term[0].toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  return Array.from(groups.keys()).sort().map(key => ({
    key,
    label: key.toUpperCase(),
    terms: groups.get(key)!.slice().sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" })),
  }));
}
