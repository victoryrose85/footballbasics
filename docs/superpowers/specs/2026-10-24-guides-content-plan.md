# FootballBasics.us: content plan for the 13 guides

Written 2026-10-25 for Task 10 of the phase 1 plan, using the `content-strategy` skill (one searchable query per page, information gain over what already ranks), `site-architecture` (URLs, breadcrumbs, internal links) and `schema` (structured data). Phase 2's plan builds the guides from this file and deletes the two sample guides. Nothing here is page code.

## How to read this plan

Each guide has the same seven items: URL, title and description, main query and related questions, outline, facts to verify, links, structured data, and length. "Row N" is a row in `2026-10-24-nfl-rules-check.md`; rows 1 to 32 came from the homepage work and rows 33 to 81 were added (row 80 and 81 included) for this plan. Rows marked N1 to N8 come from NFL publications rather than the rulebook.

### Where the research comes from (read this before trusting a query)

| Evidence | What was done | Status |
|---|---|---|
| Autocomplete | Google's suggest endpoint (`suggestqueries.google.com`, `hl=en`, `gl=us`) was queried on 2026-10-25 for each main query and for about 45 question stems. Every query tagged **AC** below was returned by it, in Google's order. No volumes. | **Observed** |
| People also ask | Google's results page could not be fetched (the scraper errored), and Bing's results text showed no question box. **No guide's "People also ask" was observed.** Questions tagged **PAA?** are my judgment of what the box would show, chosen because the same question (or its stem) came back from autocomplete. Check them by hand in a browser before launch if they matter. | **Not observed** |
| Top results | A web search per main query, plus Bing's result list for the same query on 2026-10-25, gave titles, snippets and (for five pages) headings. It did **not** give word counts, and several results were content-farm pages. Lengths below are therefore a judgment from what the titles and headings show the top results cover, not a measurement. | **Partly observed** |

What the result lists showed, in one paragraph: for the rule-based queries (penalties, downs, scoring, overtime, positions, length) the top pages are one-screen "complete guide" articles that list the items with a sentence each. A table of the five most common penalties, four-sentence downs primers, a bullet list of positions. None has diagrams of the officials' signals, a worked example of enforcement, or a clear current-rules date. That is the information gain every guide below aims at: a diagram or table that shows the thing, a worked example, and rules checked to the 2026 book. Two queries ("football formations explained", "how to watch football") are crowded with results about other sports or with live-stream links; their guides put "American football" or "NFL" in the first sentence so the page is clearly about the right game.

Lesson numbers in this plan are the 0-based indexes in `lib/drive/lessons.ts` and the homepage copy brief (lesson 0 is the field, lesson 22 the rest of the game).

### Main queries and who owns what

No guide repeats another's main query or the homepage's main query, "how does football work". Where a homepage related query overlaps with a guide's topic, the homepage keeps the query and the guide answers the deeper question. This table is the single source for that.

| Guide | Main query (owns it) | Homepage query it must not target |
|---|---|---|
| `/football-penalties-explained` | football penalties explained | why do they throw flags, what is holding, what is a false start, what is pass interference (the homepage's lessons 6 to 8, 10, 13) |
| `/downs-in-football` | downs in football explained | what does 1st and 10 mean, what does 3rd and 10 mean (the homepage's tag lesson) |
| `/how-scoring-works-in-football` | football scoring explained | how does scoring work in football, what is an extra point (the homepage's lessons 20 to 22) |
| `/nfl-overtime-rules` | nfl overtime rules | none |
| `/nfl-replay-review-and-challenges` | nfl challenge rules | what is a catch in the nfl (the homepage's lesson 20) |
| `/football-positions-explained` | football positions explained | how many players on a football team on the field |
| `/football-formations-explained` | football formations explained | none |
| `/special-teams-explained` | special teams in football | what is a touchback in football (lesson 1) |
| `/how-long-is-a-football-game` | how long is a football game | why does the clock stop, what is the play clock in the nfl (lessons 5, 14, 15) |
| `/how-to-watch-football` | how to watch football for beginners | what is the line of scrimmage, what is the blue line, what is the yellow line (lessons 2 and 3) |
| `/football-field-explained` | football field markings explained | none |
| `/how-the-nfl-season-works` | how does the nfl season work | none |
| `/football-glossary` | football terms (football glossary) | none |

## Titles, descriptions and the length rule

Titles end in ` | FootballBasics` (17 characters), so the headline part is 48 characters or fewer; the H1 and the Article `headline` are the headline part. Descriptions are 50 to 160 characters. Both were counted by script when this plan was written (every title is 56 to 64 characters, every description 137 to 157). `lib/pages.ts` needs each guide's `name` (breadcrumb and chip label, kept short) and `updated` date; the name is given per guide.

---

## 1. Football penalties

- **URL:** `/football-penalties-explained` | **Registry name:** Penalties
- **Title:** `Football Penalties Explained: Flags and Signals | FootballBasics`
- **Description:** `Every common NFL penalty in plain English: what the flag means, how many yards it costs, whether the down repeats, and the official's hand signal.`
- **Main query:** football penalties explained (AC: "football penalties explained", "nfl penalties explained", "nfl penalties explained for dummies", "football penalties signals", "football penalties meaning").
- **Related questions:** football penalties list (AC); football penalties and yardage (AC); football penalties referee signals / hand signals (AC); football penalties half the distance (AC); what is a flag on the play (AC); can a team decline a penalty (PAA?); what is the difference between a 5, 10 and 15 yard penalty (PAA?).
- **Length target:** 2,300 words. The top results are lists of the 5 to 10 most common penalties with a sentence each, so a guide that gives about 30 penalties with a signal diagram, a yardage table and the enforcement rules is the longest on the topic by design, and the length is the table.

### Outline

1. **What a flag means** (H2). Block "Foul, penalty, flag": a flag marks a possible foul, the penalty is what it costs; the officials announce the foul and the yards. Block "The team that was fouled chooses": accept or decline; declining keeps the play's result (the drive's lesson 10). Block "Offsetting fouls": both teams foul on one down, the penalties cancel and the down is replayed (row 80).
2. **How a penalty is measured** (H2). Block "From where the yards come": most are marked from the previous spot, some from the spot of the foul (pass interference by the defense, rows 9, 10); the three-and-one idea in one worked run (row 9). Block "Never more than half the distance" (row 34). Block "Does the down repeat, and is there a first down?": a table of three outcomes: down repeats (offense fouls before the snap), automatic first down (most defensive fouls, row 33), loss of down (row 47). Diagram: none; table `table.data`: **Penalty outcomes**.
3. **Fouls before the snap** (H2). Table of false start, delay of game, offside, encroachment, neutral zone infraction, illegal shift, illegal motion, illegal formation, too many players, illegal substitution (rows 5, 6, 7, 19, 35, 36, 37, 79), each with the yards and what to see. Block "The drive's false start": link to the homepage lesson.
4. **Fouls during the play: blocking and holding** (H2). Offensive holding, illegal use of hands, block in the back, clipping, chop block (rows 9, 43, 77). Block "Why holding is called so often": what it looks like.
5. **Fouls during the play: passes** (H2). Defensive pass interference (spot foul, first down, row 10), offensive pass interference (10 yards, row 39), defensive holding, illegal contact and illegal use of hands (row 38), ineligible receiver downfield (row 78), intentional grounding (row 40).
6. **Personal fouls and the 15-yard penalties** (H2). Roughing the passer (row 11), roughing and running into the kicker (row 42), unnecessary roughness, facemask, horse-collar, hip-drop tackle, unsportsmanlike conduct (rows 41, 77). Block "Why these are the expensive flags": player safety, 15 yards and, for the defense, a first down.
7. **The officials' signals** (H2). **Diagram: signals sheet**, a `figure.diagram` of 12 stick figures with a caption each, drawn from the rulebook's descriptions (row 44): false start, holding, offside, personal foul, pass interference, intentional grounding, delay of game, illegal motion, facemask, unsportsmanlike conduct, too many men, penalty refused or incomplete. Block "Who throws the flag": the officials and the referee, who announces it (row 45). This is one of the two guides allowed to name the other positions (a short note: the referee announces, the back judge and side judge watch receivers; check row 45 before naming any).
8. **Back to the drive** (H2, short). Block linking to the homepage's lessons 6, 7, 8 and 13 and `SITE.back`.

### Facts to verify

Rows 5, 6, 7, 8, 9, 10, 11, 12, 14, 19, 33 to 47, 77 to 80 (all in the rules check). The signal descriptions are row 44; draw them from the words, not from league or network artwork.

### Links

- **Inbound from the homepage:** lesson 6 ("Every penalty you'll see").
- **Chips:** `/downs-in-football`, `/nfl-replay-review-and-challenges`, `/how-to-watch-football`, `/football-glossary`.
- **Section that links back to the drive:** "Back to the drive" (above), naming lessons 6, 7, 8 and 13.

### Structured data

`articleJsonLd` (Article plus BreadcrumbList, from `DeeperPage`). No FAQPage: Google only shows FAQ rich results for government and health sites, so the markup would earn nothing and would have to match the visible text exactly. No HowTo (retired).

---

## 2. Downs in football

- **URL:** `/downs-in-football` | **Registry name:** Downs
- **Title:** `Downs in Football Explained, With Examples | FootballBasics`
- **Description:** `What a down is, why the offense gets four, how to read "3rd & 7", and what changes after a first down, a penalty, a punt or a failed fourth down.`
- **Main query:** downs in football explained (AC: "downs in football", "downs in football explained", "downs in football explained for dummies", "downs in football meaning", "4 downs in football").
- **Related questions:** what does 3rd and 7 mean in football (AC; the homepage owns the 1st and 10 and 3rd and 10 forms, this page owns the other numbers and the full table); what is a first down in football (AC); what is 4th down in football (AC); what is 4th and goal (AC); what does 2nd and long mean (AC); what happens if the offense does not get a first down (PAA?).
- **Length target:** 1,300 words. The top results are 600 to 1,000 word primers with no table of situations, so the plan is the primer plus a worked table and the penalty and fourth-down sections.

### Outline

1. **What a down is** (H2). Block "One play, counted": a down is one attempt to advance the ball, from the snap to the whistle (rows 31, 46). Block "A series of four": four downs to reach the line to gain (row 46); reaching it earns a new first down; missing it on fourth gives the ball to the other team where the play ended (row 30).
2. **Reading "3rd & 7"** (H2). Block "Down and distance": the first number is the down, the second the yards still needed; the line to gain is 10 yards from where the series began (row 21). **Diagram: the tag**, a `figure.diagram` showing a short stretch of field with the blue line, the yellow line and a tag reading 3rd & 7, and arrows labelled "down" and "distance". Block "Reading the tag as a story": a table, **What each down & distance usually means**: 1st & 10 (a fresh start), 2nd & long, 3rd & short, 3rd & long, 4th & 1 (rows 21, 30).
3. **How the count changes** (H2). Table, **From one play to the next**: gain of 4 on 1st & 10 gives 2nd & 6; incomplete pass gives the next down at the same spot (row 12); sack loses yards and leaves more to go; a gain past the line gives 1st & 10; the new spot of the ball is where forward progress stopped (row 31). Block "Where the ball goes when a play ends near the sideline": the snap moves in to the hash mark (row 69).
4. **Penalties and the down** (H2). Block "Most offensive fouls repeat the down" (row 47); block "A few cost a down" (intentional grounding, row 40, row 47); block "Most defensive fouls give a first down" (row 33), with the offside exceptions.
5. **Fourth down** (H2). Block "Punt, kick or go for it" (rows 50, 54); block "A failed fourth down" (row 30); block "Why third down is the big one" (judgment about strategy, stated as "usually", no rule claim).
6. **& goal** (H2). Block "When the goal line is the target": row 21, no yellow line on TV (row N7); one worked example (1st & goal at the 6).
7. **Back to the drive** (H2). Link to lesson 3 (Downs) and lessons 4, 5, 11 and 18 for the count in action.

### Facts to verify

Rows 12, 21, 30, 31, 33, 40, 46, 47, 50, 54, 69, N7.

### Links

- **Inbound from the homepage:** lesson 3 ("Downs and distance, explained").
- **Chips:** `/football-penalties-explained`, `/how-scoring-works-in-football`, `/football-field-explained`, `/how-to-watch-football`.
- **Back to the drive:** the "Back to the drive" section.

### Structured data

`articleJsonLd` only.

---

## 3. How scoring works

- **URL:** `/how-scoring-works-in-football` | **Registry name:** Scoring
- **Title:** `Football Scoring Explained: Every Way to Score | FootballBasics`
- **Description:** `Touchdown, field goal, safety, extra point and two-point try: how many points each is worth, how it happens, and the rare ways the defense scores.`
- **Main query:** football scoring explained (AC: "football scoring", "football scoring explained", "football scoring points", "football scoring rules"; the exact phrase "how scoring works in football" completes mostly to fantasy and other sports, so the page does not rely on it).
- **Related questions:** how many points is a touchdown (AC); how many points is a field goal (AC); how many points is a safety (AC); what is a 2 point conversion (AC); can the other team score on a two point conversion (AC); what is the most points a team can score on one play (PAA?).
- **Length target:** 1,400 words. The top results are short lists of the five scores with a sentence each; this page adds how each score happens, the try in full, the defensive scores and a drive-by-drive example.

### Outline

1. **The five ways to score** (H2). Table, **Points at a glance**: touchdown 6, field goal 3, safety 2, extra point 1, two-point try 2 (row 22), with a one-line "how" each. Block "The score you see on TV".
2. **The touchdown** (H2). Block "What counts as in the end zone" (row 48): any part of the ball on, over or behind the goal line while a player holds it inbounds, including the pylon. **Diagram: the plane of the goal line**, a side view of a runner stretching the ball over the line, a ball just short, and a ball touching the pylon (row 48). Block "How it's scored": run, catch, or recover a loose ball in the end zone (row 48). Block "Touchdowns by the defense": an interception or fumble returned all the way (row 22).
3. **The try after a touchdown** (H2). Block "Extra point": snapped from the 15, a 33-yard kick (rows 3, 22). Block "Two-point try": snapped from the 2 (rows 4, 70). Block "A try is untimed, and either team can score" (row 49): the defense can score 2 by returning a turnover, or 1 on a would-be safety (row 49). Block "Which to choose": judgment, "usually".
4. **The field goal** (H2). Block "What makes one good" (row 50): over the crossbar, between the uprights, no tee. **Diagram: the goalposts**, front view, crossbar at 10 feet and uprights, with the 18 ft 6 in width (row 71). Block "How far is the kick" (row 72, "usually about 7 yards behind the line plus the 10 of the end zone"). Block "If it misses" (row 51).
5. **The safety** (H2). Block "How it happens" (row 26): the offense is tackled in its own end zone, or a penalty there. Block "What follows": the team that was scored on kicks to the other team from its own 20 (rows 26, 32).
6. **One drive, scored** (H2). A worked table following the homepage's drive to its touchdown and try, then a second example of a stalled drive and a field goal. Block links to lessons 20 to 22.
7. **Back to the drive** (H2).

### Facts to verify

Rows 3, 4, 22, 26, 32, 48, 49, 50, 51, 70, 71, 72.

### Links

- **Inbound from the homepage:** lesson 21 ("How scoring works").
- **Chips:** `/special-teams-explained`, `/nfl-overtime-rules`, `/downs-in-football`, `/how-the-nfl-season-works`.
- **Back to the drive:** "Back to the drive", naming lessons 20 to 22.

### Structured data

`articleJsonLd` only.

---

## 4. NFL overtime

- **URL:** `/nfl-overtime-rules` | **Registry name:** Overtime
- **Title:** `NFL Overtime Rules: Regular Season and Playoffs | FootballBasics`
- **Description:** `How NFL overtime works: the coin toss, who gets the ball, when a game can end early, how long the period lasts, and when a regular-season game ties.`
- **Main query:** nfl overtime rules (AC: "nfl overtime rules", "nfl overtime rules 2026", "nfl overtime rules regular season", "nfl overtime rules playoffs", "nfl overtime rules change").
- **Related questions:** do both teams get the ball in overtime (AC); can overtime end in a tie (AC); how many timeouts in nfl overtime (AC); what ends overtime in nfl (AC); how does overtime work in the nfl playoffs (AC); can you win in overtime with a field goal (a result heading, so a likely PAA).
- **Length target:** 1,200 words. The top results are 600 to 1,200 words and are the rule that changes most, so they go stale. The page says "2026" in the first sentence, dates the rule changes (N6) and gives two worked games.

### Outline

1. **The short answer** (H2). The lede in `intro` plus a block "Both teams get the ball": the regular-season and playoff rule in two sentences (rows 23, 24, 56).
2. **How overtime starts** (H2). Block "The coin toss": the visiting captain calls it (row 56). Block "The kickoff is the opportunity to possess" (row 56).
3. **Regular season** (H2). Table, **Regular season at a glance**: one 10-minute period after a break of up to 3 minutes, two timeouts, a tie if still level (rows 23, 61). Block "How it can end early": a safety by the kicking team on the first possession (row 56), or a lead after both have had the ball. Block "When the first team scores": the second team gets its turn, and if it intercepts or fumbles, the play runs out and points count (row 56).
4. **Playoffs** (H2). Table, **Playoffs at a glance**: 15-minute periods, 2-minute breaks, repeated until there is a winner, three timeouts per half, teams change ends after the first and third periods, a new toss after the fourth (rows 24, 56).
5. **Worked examples** (H2). Two short games in blocks: a touchdown, a touchdown answered, then a next-score finish; a field goal answered by a field goal (rows 23, 56).
6. **Replay in overtime** (H2). Block "No coaches' challenges": the officials start every review (rows 18, 56).
7. **How it got here** (H2). Block "From 15 minutes to 10, and the guaranteed possession": the history in N6, dated, marked as history. Check N6 in a browser before publishing.
8. **Back to the drive** (H2). Link to lesson 22.

### Facts to verify

Rows 18, 23, 24, 56, 61; N6 (**verify** in a browser; page renders with JavaScript).

### Links

- **Inbound from the homepage:** lesson 22 ("Overtime rules").
- **Chips:** `/how-scoring-works-in-football`, `/how-long-is-a-football-game`, `/nfl-replay-review-and-challenges`, `/how-the-nfl-season-works`.
- **Back to the drive:** "Back to the drive", naming lesson 22.

### Structured data

`articleJsonLd` only.

---

## 5. Replay review and challenges

- **URL:** `/nfl-replay-review-and-challenges` | **Registry name:** Replay review
- **Title:** `NFL Replay Review and Challenge Rules Explained | FootballBasics`
- **Description:** `How NFL replay works: which plays are reviewed automatically, what a coach can challenge, what it costs, and the plays no one can review.`
- **Main query:** nfl challenge rules (AC: "nfl challenge rules", "nfl challenge rules 2026", "nfl challenge rules under 2 minutes", "nfl challenge rules overtime", "nfl challenge rules pass interference"). Secondary: "nfl replay review rules" (AC).
- **Related questions:** how many challenges does a coach get in the nfl (AC); what can coaches challenge in nfl (AC); can you challenge a penalty (AC, "nfl challenge rules pass interference" suggests it); what is a challenge flag (PAA?); what happens when a challenge fails (PAA?).
- **Length target:** 1,500 words. The top results (a trade-press explainer and two league-office pages) are 800 to 1,500 words; this page adds one table of reviewable and non-reviewable plays and a step-by-step of a challenge, which is the length.

### Outline

1. **Two ways a play gets reviewed** (H2). Block "Automatic": the Replay Official starts a review of scoring plays, tries, turnovers, failed fourth downs, kicking-team possession and disqualifications, and of every play after the two-minute warning of each half and in overtime (rows 17, 57). Block "A coach's challenge": a red flag before the next snap (rows 18, 60).
2. **Who decides and on what evidence** (H2). Block "The league's officiating office does the review" (row 57), with the referee at a field-level screen; this guide may name the Replay Official and the referee. Block "Clear and obvious": the standard for changing a call (row 57).
3. **Challenges, step by step** (H2). A numbered list in a block: throw the flag, the timeout, the review, the result (rows 18, 60). Table, **What a challenge costs**: two challenges, a third if one succeeds, never a fourth; a failed one costs a timeout; a team out of timeouts cannot challenge and a flag thrown anyway is 15 yards (rows 18, 60). Block "The 10-second runoff" after the two-minute warning (row 60).
4. **What can be reviewed** (H2). Table, **Reviewable and not**, two columns, from rows 58: reviewable (catch or incomplete, possession, the goal line, the sideline, the line of scrimmage, the line to gain, the number of players on the field, the spot and the down, the clock); not reviewable (an erroneous whistle, an illegal bat or kick, intentional grounding, an ineligible receiver downfield, illegal contact on a receiver, an illegal block, and anything not listed). Block "Pass interference and holding": not reviewable, and why a viewer sees a flag stand that looks wrong.
5. **Help from the replay booth on fouls** (H2). Block "The objective parts" (row 59): the booth can tell the officials a hit to the head did not touch the head, that a passer was out of the pocket, that a facemask was not grabbed, and the like.
6. **What counts as a catch** (H2). Block "The catch rule in four steps" (row 16); a one-sentence note that college needs one foot in bounds (the book says so in 8-1-3; see the "Colleges differ" note under the rows). Links to the homepage's lesson 20.
7. **Reading the broadcast** (H2). Block "The announcer says 'the call is being reviewed'": what you see and the result wording. Judgment, no rule claim beyond the above.
8. **Back to the drive** (H2). Link to lesson 20. **Diagram:** none; a `figure.diagram` of the catch (feet and hands) is optional.

### Facts to verify

Rows 16, 17, 18, 57, 58, 59, 60; the replay rules also cover overtime (row 56).

### Links

- **Inbound from the homepage:** lesson 20 ("Replay review and challenges").
- **Chips:** `/football-penalties-explained`, `/nfl-overtime-rules`, `/how-scoring-works-in-football`, `/how-to-watch-football`.
- **Back to the drive:** "Back to the drive", naming lesson 20.

### Structured data

`articleJsonLd` only.

---

## 6. Positions

- **URL:** `/football-positions-explained` | **Registry name:** Positions
- **Title:** `Football Positions Explained: Every NFL Role | FootballBasics`
- **Description:** `Every position on an American football team, from quarterback to long snapper: what each player does, where he lines up and what number he wears.`
- **Main query:** football positions explained (AC: "football positions", "football positions explained", "football positions chart", "football positions and what they do", "football positions on offense", "football positions defense"). Many results are about another sport, so the first sentence says American football.
- **Related questions:** what does a linebacker do (AC); what is a wide receiver (AC); what are special teams positions (AC); football positions by number (AC); what does a safety do (PAA?); what is the difference between a guard and a tackle (PAA?).
- **Length target:** 2,300 words. The top results are 1,500 to 3,000 word listicles with a line per position; the page is a position-by-position guide with a lineup diagram, so it sits at the long end.

### Outline

1. **Three units, 11 players each** (H2). Block "Offense, defense and special teams": 11 a side on the field (row 29). Block "Who is on the field": the 53-player roster is not in the rulebook, so it is not stated.
2. **The offense** (H2). Block "The line" (center, guard, tackle, with the snap, row 29 and the eligible-receiver idea, row 20), "The quarterback", "Running backs and the fullback", "Tight ends", "Wide receivers and the slot". **Diagram: the offense**, a `figure.diagram` of 11 labelled dots on the line, with the seven-on-the-line minimum shown (row 19).
3. **The defense** (H2). Block "The defensive line" (tackles and ends), "Linebackers" (middle and outside), "The secondary" (cornerbacks and safeties). **Diagram: the defense** with a common 4-3 look, labelled.
4. **Special teams** (H2). Block "Kicker and punter", "Long snapper and holder", "Returner and gunners". Link to the special-teams guide.
5. **Who can catch the ball** (H2). Block "Eligible receivers" (row 20): the end of the line and backs; defenders can always catch.
6. **Numbers tell you the position** (H2). Table, **Number ranges**: quarterbacks 0 to 19, running backs, tight ends and receivers 0 to 49 and 80 to 89, offensive linemen 50 to 79, and so on (row 74).
7. **Back to the drive** (H2). Links to lessons 2 and 4 to 20, where each position appears.

### Facts to verify

Rows 19, 20, 29, 74, N8. Position names and jobs are football vocabulary (N8), not rules; the copy states jobs plainly and makes no rule claim beyond the rows.

### Links

- **Inbound from the homepage:** lesson 2 ("Every position explained").
- **Chips:** `/football-formations-explained`, `/special-teams-explained`, `/how-to-watch-football`, `/football-glossary`.
- **Back to the drive:** "Back to the drive", naming lessons 2 and 4 to 20.

### Structured data

`articleJsonLd` only.

---

## 7. Formations

- **URL:** `/football-formations-explained` | **Registry name:** Formations
- **Title:** `Football Formations Explained, With Diagrams | FootballBasics`
- **Description:** `Offensive and defensive formations in American football, drawn out: shotgun, I formation, goal-line sets, the 4-3 and 3-4 defenses, and nickel.`
- **Main query:** football formations explained (AC: "football formations", "football formations offense", "football formations defense", "football formations nfl", "football formations names"). The "explained" form is polluted by results about another sport, so the first sentence names American football and the title says "with diagrams".
- **Related questions:** what is the shotgun formation (AC); what is a 4-3 defense (AC); what is nickel defense (AC); what is the I formation (PAA?); how many players must be on the line of scrimmage (PAA?).
- **Length target:** 1,800 words. The top results are two NFL-office-style pages and listicles of 800 to 1,500 words; the diagrams are the information gain.

### Outline

1. **What a formation is** (H2). Block "The pre-snap picture": how the 11 line up. Block "What the rules require": at least seven on the line, eligible receivers on both ends (rows 19, 20); only one player may be moving at the snap (row 36).
2. **Offensive formations** (H2). Blocks with a diagram each: "Under center (I formation)", "Shotgun", "Spread", "Goal-line (heavy)". Each diagram is a `figure.diagram` of 11 dots with labels. Row 75 (quarterback under center), N8 for the names. Link to the homepage's lessons 17 and 19.
3. **Defensive formations** (H2). Blocks with diagrams: "4-3" and "3-4" (the first number counts linemen, the second linebackers, N8), "Nickel and dime" (extra defensive backs), "Goal-line". 
4. **Special-teams formations** (H2). Block "Punt, field goal and kickoff": only the shapes, with the rule limits on the defense (rows 2, 76). Link to the special-teams guide.
5. **How the offense changes the picture** (H2). Block "Shifts and motion" (row 36). Block "The audible" (a glossary word; no rule claim).
6. **Back to the drive** (H2). Links to lessons 17 and 19 and the shotgun on third down.

### Facts to verify

Rows 2, 19, 20, 36, 75, 76, N8.

### Links

- **Inbound from the homepage:** lesson 19 ("Formations, with diagrams").
- **Chips:** `/football-positions-explained`, `/how-to-watch-football`, `/special-teams-explained`, `/football-glossary`.
- **Back to the drive:** "Back to the drive", naming lessons 17 and 19.

### Structured data

`articleJsonLd` only. The diagrams carry `<title>` text, which is what Google reads; no ImageObject.

---

## 8. Special teams

- **URL:** `/special-teams-explained` | **Registry name:** Special teams
- **Title:** `Special Teams Explained: Kickoffs, Punts, Kicks | FootballBasics`
- **Description:** `What special teams are in football: how a kickoff works, when a team punts, how a field goal is kicked, and what a fair catch and touchback mean.`
- **Main query:** special teams in football (AC: "special teams football", "special teams football meaning", "special teams football positions", "what are special teams in football").
- **Related questions:** what are special teams in football (AC); what is a punt (AC); what is a kickoff (AC); how far is a field goal (AC); what is a fair catch (PAA?); what is an onside kick (PAA?).
- **Length target:** 1,700 words. The top results are 700 to 1,400 words with a paragraph per unit; the diagrams and the 2026 kickoff rules are the information gain.

### Outline

1. **What special teams are** (H2). Block "The plays that are kicks": kickoffs, punts, field goals and tries; a different 11 on the field.
2. **The kickoff** (H2). Block "How it lines up" (row 2). **Diagram: the kickoff**, the 2026 setup (the kicker at the 35, the other ten at the receiving team's 40, the setup zone from the 35 to the 30, the landing zone, row 2). Block "Touchbacks": the 35, or the 20 if the kick bounced in the landing zone (row 1). Block "Out of bounds or short of the landing zone": the receivers take the ball about 25 yards from the kick, at their choice (row 52). Block "The onside kick": declared to the referee at any time (a 2026 change), what the kicking team may recover, the 15-yard penalty for an untouched kick past the setup zone (row 53).
3. **The punt** (H2). Block "When teams punt": usually on fourth down, judgment. Block "The rules of a punt" (row 54): kicked from behind the line, only the ends go downfield early, touchback at the 20 on a punt dead in the end zone. **Diagram: the punt formation.**
4. **Catching a kick: the return and the fair catch** (H2). Block "Return": the returner advances. Block "Fair catch" (row 55): the arm signal, no advance, no contact; the fair catch kick. Block "Roughing and running into the kicker" (row 42).
5. **The field goal** (H2). Block "How it's kicked": snap, hold, kick; the formation (rows 50, 71, 76). Block "How long a field goal is" (row 72). Block "A miss": the other team's ball at the spot, or its 20 (row 51).
6. **The extra point** (H2). Block "The try kick": from the 15, 33 yards (row 3).
7. **Who plays special teams** (H2). Block "The specialists" (kicker, punter, long snapper, holder, returner), linking to the positions guide (row N8).
8. **Back to the drive** (H2). Links to lessons 1 and 21.

### Facts to verify

Rows 1, 2, 3, 42, 50, 51, 52, 53, 54, 55, 71, 72, 76.

### Links

- **Inbound from the homepage:** lesson 1 ("Kickoffs, punts and field goals").
- **Chips:** `/how-scoring-works-in-football`, `/football-field-explained`, `/football-positions-explained`, `/how-long-is-a-football-game`.
- **Back to the drive:** "Back to the drive", naming lessons 1 and 21.

### Structured data

`articleJsonLd` only.

---

## 9. How long is a football game

- **URL:** `/how-long-is-a-football-game` | **Registry name:** Game length
- **Title:** `How Long Is a Football Game? About 3 Hours | FootballBasics`
- **Description:** `An NFL game is 60 minutes on the clock and about three hours on the couch. See what stops the clock, how timeouts and halftime work, and why.`
- **Main query:** how long is a football game (AC: "how long is a football game nfl", "how long is a football game usually", "how long is a football game on tv", "how long is a football game quarter").
- **Related questions:** how long is halftime in the nfl (AC); how many timeouts in nfl (AC); what is the two minute warning (AC); why do football games take so long (AC; the homepage's lesson 22 owns the short answer, this page the long one); how long is an nfl game on tv (AC); does the clock stop on a first down (PAA?).
- **Length target:** 1,400 words. The top results are 500 to 1,200 word pages built around "60 minutes versus about three hours" with a table by level of play; the page keeps to the NFL and adds the table of what stops the clock.

### Outline

1. **The short answer** (H2). Block "60 minutes of clock, about three hours of game": four 15-minute quarters (row 15); "about three hours" (row N5), no minute counts.
2. **The four quarters and halftime** (H2). Table, **The structure of a game**: four 15-minute quarters, two minutes between the first and second and the third and fourth, halftime of 13 minutes, change of ends after the first and third (rows 15, 63). Block "The coin toss" (row 66).
3. **What stops the clock** (H2). Table, **Clock stops**, from row 64: incomplete pass, out of bounds, a score, a foul, a timeout, a change of possession, a review, the two-minute warning. Block "When it starts again" (rows 13, 64): on the referee's ready-for-play signal, except on the snap after a change of possession, after the two-minute warning of the first half and inside the last five minutes of the second half. A worked example of a runner out of bounds in the first quarter, and again in the fourth.
4. **The play clock** (H2). Block "40 seconds, or 25" (row 14). Block "Delay of game" (row 6). 
5. **Timeouts and the two-minute warning** (H2). Block "Three per half" (row 61): 2 minutes with a TV break, 30 seconds otherwise. Block "The two-minute warning" (row 62). Block "Why the last two minutes take twenty" (judgment, the effect of rows 61, 62, 64).
6. **Why it adds up to about three hours** (H2). Block "The stops": commercial breaks, huddles, reviews, kicks; no minute counts without a primary source (row N5).
7. **When the half can't end** (H2). Block "A defensive foul extends a half by one untimed down" (row 65). Block "Overtime adds time" (link to the overtime guide).
8. **Back to the drive** (H2). Links to lessons 5, 14, 15 and 22.

### Facts to verify

Rows 6, 13, 14, 15, 61 to 66, N5.

### Links

- **Inbound from the homepage:** lesson 14 ("Why a game takes about three hours").
- **Chips:** `/nfl-overtime-rules`, `/downs-in-football`, `/how-to-watch-football`, `/how-the-nfl-season-works`.
- **Back to the drive:** "Back to the drive", naming lessons 5, 14, 15 and 22.

### Structured data

`articleJsonLd` only.

---

## 10. How to watch football

- **URL:** `/how-to-watch-football` | **Registry name:** How to watch
- **Title:** `How to Watch Football: What to Look For | FootballBasics`
- **Description:** `A beginner's guide to watching an NFL game: the TV graphics, what to watch before, during and after each play, and when the game is really decided.`
- **Main query:** how to watch football for beginners (AC: "how to watch football for beginners", "how to start watching football for beginners", "how to learn to watch football", "how to understand football for beginners"). The short form "how to watch football" completes to live-stream queries, so the page leads with "for beginners" in the lede and does not chase the stream intent.
- **Related questions:** how to understand football (AC); what to look for when watching football (AC); what is the red zone in football (AC; owned here); what does 4th and goal mean (AC); what are the lines on the screen in football (AC family; the homepage owns the blue and yellow line questions, here only the full TV layout); what should I watch first (PAA?).
- **Length target:** 1,600 words. The top results are short "tips" pages and a book listing; there is no strong competitor, so the length comes from the play-by-play walkthrough.

### Outline

1. **Start here** (H2). Block "Three things to follow": the ball, the down and distance, the clock. The lede is the answer.
2. **Reading the TV screen** (H2). **Diagram: the score bug**, a `figure.diagram` of a score bar with the teams' abbreviations replaced by "Home"/"Away", the quarter, the clock, the play clock, the down and distance and the timeouts remaining (N7: the lines are broadcast graphics). Block "The two lines": blue and yellow, link to the homepage's lessons 2 and 3 rather than re-explain. Block "What the flag icon means".
3. **Before the snap** (H2). Block "Count the line" (rows 19, 29), "Look at the shape" (links to formations), "Listen for the audible" (glossary word), "Watch the clock".
4. **During the play** (H2). Block "Run or pass?" (how to tell), "Follow the ball and the line", "Where the quarterback looks", "What a sack looks like".
5. **After the whistle** (H2). Block "Where the ball is placed" (row 31), "Did the clock stop?" (row 64), "Flags and what the referee says" (rows 8, 44).
6. **The situations that matter** (H2). Block "Third down and the red zone" (the lesson 16 promise: third down is usually the last real chance and the red zone is the last 20 yards, "usually", no rule claim; the red zone is TV's name, row 21 notes broadcast language). Block "Fourth down" (rows 30, 50, 54). Block "The last two minutes" (rows 13, 61, 62). Block "Replay" (link).
7. **A beginner's order of learning** (H2). Block "Week 1, week 2, week 3": judgment, with links to downs, penalties and positions.
8. **Back to the drive** (H2). Links to lessons 16 and the whole drive.

### Facts to verify

Rows 8, 13, 19, 21, 29, 30, 31, 44, 50, 54, 61, 62, 64, N7.

### Links

- **Inbound from the homepage:** lesson 16 ("What to watch on each play").
- **Chips:** `/downs-in-football`, `/football-penalties-explained`, `/football-formations-explained`, `/football-glossary`.
- **Back to the drive:** "Back to the drive", the whole drive from lesson 3.

### Structured data

`articleJsonLd` only.

---

## 11. The field

- **URL:** `/football-field-explained` | **Registry name:** The field
- **Title:** `Football Field Explained: Every Line and Mark | FootballBasics`
- **Description:** `A guided tour of an American football field: the yard lines and numbers, hash marks, end zones, goalposts and the sidelines, with measurements.`
- **Main query:** football field markings explained (AC: "football field markings", "football field markings diagram", "football field markings explained", "football field markings meaning"). "football field explained" alone is dominated by a finance term, so the title does not rely on it. Dimension queries ("football field dimensions", "how long is a football field") also land here (AC).
- **Related questions:** how long is a football field (AC); football field dimensions (AC); what are the numbers on a football field (AC); what are hash marks in football (AC); how wide is a football field (AC family); why are there arrows next to the yard numbers (PAA?).
- **Length target:** 1,400 words. The top results are 500 to 1,000 word dimension pages; the page is a labelled diagram plus a tour, which is the information gain.

### Outline

1. **The field at a glance** (H2). **Diagram: the whole field**, a `figure.diagram` with the yard lines, numbers, hash marks, end zones, goalposts and pylons labelled. Block "Size": 360 by 160 feet, 120 by 53 1/3 yards, with the goal lines 10 yards in (row 67).
2. **The yard lines and numbers** (H2). Block "Every 5 yards, numbered every 10, counting to the 50" (rows 27, 68). Block "The arrows" (row 68). Block "Own and opp": how a spot is named (row 27); the tag in the homepage's window.
3. **The hash marks** (H2). Block "Where the ball starts each play" (row 69): 70 feet 9 inches from each sideline in the NFL, and the next snap moves in to the hash mark. One sentence: college hash marks are closer to the sidelines (row 69 allows this).
4. **The goal line and the end zones** (H2). Block "The goal line is in the end zone" (rows 48, 67). Block "The pylons". Block "The 2-yard mark" (row 70).
5. **The goalposts** (H2). **Diagram: the goalposts** (row 71), including that they stand on the end line, 10 yards behind the goal line (row 72).
6. **The sidelines and out of bounds** (H2). Block "The lines are out of bounds" (rows 31, 67). Block "The bench areas and the chain crew" (row 73): the chain crew marks the line to gain, the box and the chains; no chain length is stated.
7. **What isn't painted on the field** (H2). Block "The blue and yellow lines are TV graphics" (N7).
8. **Back to the drive** (H2). Link to lesson 0 and the tag.

### Facts to verify

Rows 27, 31, 48, 67, 68, 69, 70, 71, 72, 73, N7.

### Links

- **Inbound from the homepage:** lesson 0 ("Every line on the field").
- **Chips:** `/downs-in-football`, `/how-scoring-works-in-football`, `/special-teams-explained`, `/how-to-watch-football`.
- **Back to the drive:** "Back to the drive", naming lesson 0.

### Structured data

`articleJsonLd` only.

---

## 12. The season

- **URL:** `/how-the-nfl-season-works` | **Registry name:** The season
- **Title:** `How the NFL Season Works, Start to Super Bowl | FootballBasics`
- **Description:** `The NFL season in order: 17 games and a bye, how teams are grouped into conferences and divisions, who makes the playoffs, and how the Super Bowl is reached.`
- **Main query:** how does the nfl season work (AC: "how the nfl season works", "how does the nfl season work for dummies", "how nfl regular season works", "how nfl post season works"). Secondary: how do nfl playoffs work (AC), nfl playoffs explained (AC).
- **Related questions:** how many games in an nfl season (AC); how many teams make the nfl playoffs (AC); what is a bye week (AC); how do nfl playoffs work seeding (AC); what is a wild card (PAA?); how does the nfl draft work (AC; out of scope, a short pointer sentence only).
- **Length target:** 1,500 words. The top results are 700 to 1,500 words and several are out of date (16 games, six playoff teams); a dated, current page earns its place by being correct. No dates for games go in the copy so it does not go stale.

### Outline

1. **The league in one picture** (H2). Block "32 teams, two conferences, four divisions each" (N2). **Diagram: the league tree**, a `figure.diagram` with the AFC and NFC, each with four divisions of four boxes (division names East, North, South, West; no team names).
2. **The regular season** (H2). Block "17 games over 18 weeks, one bye" (N1). Block "Who you play": the schedule formula in a table, **How a team's 17 games are made** (N1), and a note that the exact opponents change each year. Block "Preseason" (N1: three exhibition games, one sentence). Block "A bye week".
3. **Winning the division** (H2). Block "The standings" (wins and ties). Block "Breaking ties: head-to-head first" (N4).
4. **The playoffs** (H2). Block "Seven teams per conference" (N3). **Diagram: the bracket**, 7 seeds to a champion, with the bye (N3). Block "Seeding and who hosts" (N3). Block "No ties": playoff games go to a winner (rows 24, N3).
5. **The Super Bowl** (H2). Block "The two conference champions meet" (N3). Block "Overtime is possible" (row 24).
6. **A season at a glance** (H2). Table, **Preseason, regular season, playoffs, Super Bowl**, one row each, no dates.
7. **Back to the drive** (H2). Links to the whole drive; the homepage has no lesson on the season, so this section sends readers to lesson 22 ("The rest of the game").

### Facts to verify

Rows 24; N1, N2, N3 (**verify** against the 2026 edition: a seeding proposal was withdrawn in 2025 and no 2026 change was found), N4.

### Links

- **Inbound from the homepage:** none of the 23 lessons links here (the lessons teach one game). The homepage's guide list below lesson 23 links to it. Phase 2 may add a sentence in lesson 22 about the 17-game season (a homepage change, not made here).
- **Chips:** `/nfl-overtime-rules`, `/how-long-is-a-football-game`, `/how-scoring-works-in-football`, `/football-glossary`.
- **Back to the drive:** "Back to the drive", naming lesson 22.

### Structured data

`articleJsonLd` only. Not `SportsEvent` or `SportsOrganization`: they describe a specific event or club, and the page names none.

---

## 13. Glossary

- **URL:** `/football-glossary` | **Registry name:** Glossary
- **Title:** `Football Glossary: Football Terms A to Z | FootballBasics`
- **Description:** `Plain-English definitions of the football words you will hear in an NFL game, from audible and blitz to wild card and yards after the catch.`
- **Main query:** football terms (AC: "football terms", "football terms list", "football terms and phrases", "football terms and meanings"). Secondary: football glossary (AC: "football glossary", "football glossary of terms", "american football glossary", "nfl football glossary"), football terms for beginners (AC).
- **Related questions:** what does audible mean in football (AC); what is a blitz in football (AC); what is a pick six (AC); what is a sack (the homepage's lesson 12 link goes here); what does flag on the play mean (AC); what does bye week mean (AC).
- **Length target:** 2,800 words. The top results are a long reference article and several 500-word lists; with about 95 terms at 25 to 30 words each, 2,800 words is the length of the list.

### Outline

1. **How to use this glossary** (H2). Lede plus a block with the A to Z jump links (`<a href="#t-a">`); each letter is an H2 (the template's `Section`), each term a `<dt>/<dd>` inside a `Block`. The jump links are plain anchors.
2. **A** to **Z** (H2 each, only letters that have terms). Each entry: the term in bold, a plain definition of one to two sentences, and where useful "see also" links to the guide (for example, "down" links to the downs guide). Entries that are a rule claim use the row named in the list below; entries that are football vocabulary follow N8.
3. **Back to the drive** (H2). Links to lessons 2, 3, 12 and 13, where many of these words are met.

### Terms (the `DefinedTermSet`)

About ninety terms; each `DefinedTerm` has `name`, `description` (the same text as the visible definition) and `inDefinedTermSet`. Rule-backed terms cite the row; the rest are vocabulary (N8, glossary row 81).

A: audible (vocabulary), accept/decline (row 8), automatic first down (row 33). B: backfield, blitz, blue line (N7), bye week (N1), block in the back (row 43). C: catch (row 16), center, challenge (row 18), chains/chain crew (row 73), clipping (row 77), cornerback, coin toss (row 66). D: dead ball (row 31), defense, defensive back, delay of game (row 6), down (row 46), drive. E: encroachment (row 35), end zone (row 27), extra point (row 3). F: facemask (row 41), fair catch (row 55), false start (row 5), field goal (row 50), first down (row 46), flag (row 12 note), forward progress (row 31), fourth down (row 30), fullback, fumble. G: goal line (rows 48, 67), goalposts (row 71), guard. H: hail mary (vocabulary), hash marks (row 69), holder, holding (rows 9, 38, 43), huddle. I: incomplete pass (row 12), intentional grounding (row 40), interception. K: kickoff (row 28), kicker. L: landing zone (row 2), line of scrimmage (row 29), line to gain (row 21), linebacker, lineman (row 20). N: neutral zone (row 29), neutral zone infraction (row 35), nickel (N8). O: offense, offside (rows 7, 35), onside kick (row 53), overtime (rows 23, 24). P: pass interference (rows 10, 39), pick six (vocabulary), play action (vocabulary), play clock (row 14), pocket, punt (row 54), pylon (row 67). Q: quarterback, quarterback sneak (vocabulary). R: receiver, red zone (row 21 note), referee (row 45), return, roughing the passer (row 11), running back, run-off (row 60). S: sack, safety (two meanings: the score, row 26, and the position), scrimmage, series (row 46), shotgun (row 75, N8), slot receiver, snap, special teams, spike (vocabulary), spot of the foul (row 9). T: tackle (the play and the position), tight end, timeout (row 61), touchback (rows 1, 54), touchdown (row 48), try (rows 3, 4, 49), turnover, two-minute warning (row 62). U: unnecessary roughness (row 41), unsportsmanlike conduct (row 41). W: wide receiver, wild card (N3). Y: yellow line (N7), yards after the catch (vocabulary).

### Facts to verify

Rows named above; row 81 for the vocabulary-only terms.

### Links

- **Inbound from the homepage:** lesson 12 ("Football words, A to Z").
- **Chips:** `/football-positions-explained`, `/downs-in-football`, `/football-penalties-explained`, `/how-to-watch-football`.
- **Back to the drive:** "Back to the drive", naming lessons 2, 3, 12 and 13.

### Structured data

`articleJsonLd` plus a `DefinedTermSet` passed as `jsonLd`: `{"@context":"https://schema.org","@type":"DefinedTermSet","name":"Football glossary","url":"https://footballbasics.us/football-glossary","hasDefinedTerm":[{"@type":"DefinedTerm","name":"…","description":"…","inDefinedTermSet":"https://footballbasics.us/football-glossary"}]}`. Build the array from the same data module the page renders, so the markup and the visible text cannot drift. Google has no rich result for it; it is for other consumers, as the spec asks.

---

## Internal links and architecture

Flat, one level deep: `/` at the top, 13 guides, About and Privacy, no `/guides/` folder, no category pages (13 pages do not need them). Breadcrumb: Home, then the guide's registry name (from `DeeperPage`). College goes under `/college/` later and leaves these URLs alone.

**Links from the homepage:** twelve lessons link to twelve guides (the `more` links); the season guide is reached through the guide list below lesson 23. Each lesson's label is a promise, and the guide's first H2 answers it: lesson 0, field (every line and mark: section 1); lesson 1, special teams (kickoffs, punts and field goals: sections 2, 3, 5); lesson 2, positions (every position explained: sections 2 to 4); lesson 3, downs (down and distance: sections 1 and 2); lesson 6, penalties (every penalty you'll see: sections 3 to 6); lesson 12, glossary (football words A to Z, including "sack"); lesson 14, game length (why about three hours, and the out-of-bounds clock: sections 3 and 6); lesson 16, how to watch (what to watch on each play, with third down and the red zone: sections 3 to 6); lesson 19, formations (with diagrams, including goal-line sets); lesson 20, replay (replay review and challenges, and the catch); lesson 21, scoring (every way to score, and the try); lesson 22, overtime.

**Chips (3 or 4 per guide, all registered paths):**

| Guide | Chips |
|---|---|
| penalties | downs, replay, how-to-watch, glossary |
| downs | penalties, scoring, field, how-to-watch |
| scoring | special-teams, overtime, downs, season |
| overtime | scoring, game-length, replay, season |
| replay | penalties, overtime, scoring, how-to-watch |
| positions | formations, special-teams, how-to-watch, glossary |
| formations | positions, how-to-watch, special-teams, glossary |
| special-teams | scoring, field, positions, game-length |
| game-length | overtime, downs, how-to-watch, season |
| how-to-watch | downs, penalties, formations, glossary |
| field | downs, scoring, special-teams, how-to-watch |
| season | overtime, game-length, scoring, glossary |
| glossary | positions, downs, penalties, how-to-watch |

**In-text links:** each guide links to another guide the first time it uses that guide's subject, with the guide's name as the anchor text (never "click here"). Every guide's last H2 ("Back to the drive") links to `/`, naming the lessons that match.

## Schema decisions

- Every guide: `articleJsonLd` (Article plus BreadcrumbList) from `DeeperPage`. The Article already has `headline`, `description`, `dateModified`, `image`, `mainEntityOfPage` and the publisher.
- Glossary: also a `DefinedTermSet` through the `jsonLd` prop.
- No FAQPage (no rich result for this kind of site), no HowTo (retired), no VideoObject, no SportsEvent. No author `Person`: the About page describes an independent publisher, and `Organization` is already the publisher.
- `dateModified` comes from `lib/pages.ts`; update it whenever a guide's rules change. The overtime guide and the season guide are the likeliest to need updates each August.

## About page: new "Why" and "How" blocks (draft copy)

SETUP.md step 3, item 5: rewrite the "Why" and "How" blocks. Draft text for `app/(deeper)/about/page.tsx`; the page itself is not changed in this task. Use `&rsquo;` for apostrophes in JSX.

**Why** (kicker "Why", title "Why this site exists"):

> Football is a pleasure to watch once you know what the pauses mean, and a puzzle until you do. A flag lands, the clock stops, a number on the screen changes, and everyone around you seems to understand it. Most explanations are written by people who have watched the game all their lives, so they use the game&rsquo;s words without saying what they mean and skip the steps that feel obvious. FootballBasics starts from the other end. The homepage follows a single NFL drive play by play, so each rule is explained at the moment you would meet it, and the guides answer one question each in plain English, with the answer first and every term explained before it is used.

**How** (kicker "How", title "How pages are checked"):

> Every rule on this site is checked against the current NFL rulebook before it is published. Facts about how a season is organized come from the NFL&rsquo;s own publications. Where the rulebook says nothing, we say so; the blue and yellow lines you see on TV, for example, are broadcast graphics and are not painted on the field. We write about the NFL first. When college football works differently in a way that could confuse a new viewer, we say so in a sentence. Each page shows the date it was last updated just below its title, and we revise a page when a rule changes.

(The draft claims only what a reader can rely on: that rules are checked against the rulebook and that pages are revised when a rule changes. The user should confirm they are happy with the second.)

The page&rsquo;s `intro` and the "Who", "Corrections" and "Contact" blocks carry over unchanged, but `intro` and the About `related` chips still point at the two sample guides; Phase 2 replaces `["/example-guide", "/another-example", "/privacy-policy"]` with, for example, `["/downs-in-football", "/football-penalties-explained", "/privacy-policy"]`.

## Phase 2 handoff

- **Per guide:** a `lib/pages.ts` entry (path, name, title, description, `updated`, kind `guide`), a `TARGET_WORDS` entry (the length target above), the page at `app/(deeper)/<slug>/page.tsx`, the diagrams as inline SVG with a `<title>`, any logic behind them (the signals sheet, the field, the bracket) pure and unit-tested in `lib/`, and the homepage guide list (it reads `GUIDES`).
- **Order:** the user reviews in sets of about 4. A reasonable order, by how many lessons point at the guide and how much of the drive each completes: set 1 downs, penalties, scoring, special teams; set 2 field, positions, formations, replay; set 3 game length, how to watch, overtime, season; set 4 glossary (last, because its entries link to every other guide).
- **Delete** `/example-guide` and `/another-example` (folders, registry entries, `TARGET_WORDS` entries, chips) in the same change as the first set, per SETUP.md step 3.
- **Redirects:** none; no URL has ever been public.
- **Copy rule:** only the penalties and replay guides may name officials other than the referee (the Replay Official, the umpire and so on). Every other guide says "the officials" or "replay review".
- **Before launch:** check "People also ask" by hand for each main query (not observed here); re-verify N3 (playoff format) and N6 (overtime history) against the 2026 NFL pages in a browser.
