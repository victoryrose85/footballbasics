# FootballBasics.us homepage: keyword and copy brief

Written 2026-10-25 for Task 5 of the phase 1 plan, with the `content-strategy` skill (searchable content: match the query, put the keyword in the title, the H1 and the first paragraph, and pass the information-gain gate) and then `copywriting`.

## Where the data comes from

- **Autocomplete: observed.** Every query in the tables below marked "AC" was returned by Google's suggest endpoint (`suggestqueries.google.com`, `hl=en`, `gl=us`) on 2026-10-25. Those are real suggestions, in the order Google gave them, but they carry no volumes.
- **"People also ask": not observed.** Google's results page needs JavaScript, and a headless fetch of it was refused, so I couldn't read the PAA boxes. The questions marked "PAA (judgment)" are my informed guess at what the box shows, chosen because the same question appears as an autocomplete suggestion in question form ("what does 3rd and 10 mean", "what is the line of scrimmage", "what color is the line of scrimmage on tv"). Check them by hand in a browser before launch if they matter.
- **The current top results** for "how does american football work for beginners" (a web search, 2026-10-25) are mostly text-only primers: Nike's "American Football 101", campus and news-site beginner guides. All of them explain downs and scoring in the abstract.

## The information-gain sentence

Every top result describes the rules in the abstract; this page shows each one happening, play by play, on one drive, with the same blue line, yellow line and down-and-distance tag the reader will see on TV.

## The main query

**how does football work** (AC). Google completes it with "for dummies", "simple", "for beginners", "nfl" and "american", and the same stem with "american" in it completes to "for beginners" and "simple". That's the homepage's job: a newcomer who wants the whole game explained simply.

## Related newcomer queries

| # | Query | Source | Answered by (0-based lesson index) |
|---|---|---|---|
| 1 | how does american football work / for beginners / simple | AC | the hero, then the whole drive |
| 2 | football rules for beginners · nfl rules for beginners · nfl rules explained simply | AC | the hero; 3 (downs), 6–8, 10, 13, 15 (the flags) |
| 3 | what does 1st and 10 mean · what does 3rd and 10 mean in football | AC, PAA (judgment) | 3 (downs and the tag), 4 (how the count changes) |
| 4 | what is the line of scrimmage · what color is the line of scrimmage on tv · what is the blue line in football | AC | 2 (the blue line) |
| 5 | what is the yellow line in football · what does the yellow line in football mean | AC | 3, 9, 11 (the yellow line jumps ahead) |
| 6 | what is a touchback in football | AC | 1 (kickoff and touchback) |
| 7 | why do they throw flags in football · what is holding in football · what is pass interference · what is a false start in football | AC | 6 (false start), 7 (pass interference), 8 (holding), 10 (offside, accept or decline) |
| 8 | why does the clock stop in football · why do football games take so long · what is the play clock in the nfl | AC | 5 (incomplete pass), 14 (out of bounds), 15 (play clock), 22 (three hours) |
| 9 | what does 1st and goal mean · what is the red zone in football | AC | 16 (red zone), 18 (& goal) |
| 10 | what is a catch in the nfl · what is an extra point in football · how does scoring work in football | AC | 20 (catch, touchdown, replay), 21 (the try), 22 (every way to score) |
| 11 | what is a sack in football · why go for it on 4th down | AC | 12 (sack), 17 (fourth down) |

"how many players on a football team on the field" (AC) is answered in lesson 2 (11 a side). "football positions explained" (AC) is answered by the position tips, which are in the server HTML.

## Title, description and H1

Ten title options (the skill's rule), each with the 17-character suffix ` | FootballBasics`:

1. How Football Works: NFL Rules for Beginners (60) **chosen**
2. How Does Football Work? One NFL Drive, Play by Play (68, too long)
3. How American Football Works, Play by Play (58)
4. Football Rules for Beginners: One NFL Drive (60)
5. How Football Works: The NFL Rules for Beginners (64)
6. Football Explained: How an NFL Game Works (58)
7. How Football Works, One Play at a Time (55)
8. NFL Football Explained for Beginners (53)
9. How an NFL Game Works, Play by Play (52)
10. American Football Rules, Explained Simply (58)

- **Title:** `How Football Works: NFL Rules for Beginners | FootballBasics` (60 characters). It leads with the main query's words and adds the strongest modifier Google offers for both "football rules" and "nfl rules" ("for beginners"). It's the sibling of SoccerBasics' "How Soccer Works: The Rules on One Field". Option 3 is the fallback if "NFL" in the title ever looks too narrow.
- **Description:** `Learn how American football works by scrolling through one NFL drive: downs, the yellow line, penalty flags, the clock, scoring and every position.` (147 characters). It carries the "american" variant of the main query, and names the things a newcomer searches for (the yellow line, flags, the clock).
- **H1 tagline:** `How American football works, one play at a time.` (`SITE.tagline`, kept from Task 1; `HERO.tagline` reads it). The H1 is the wordmark plus this line, so it holds "how American football works" word for word, and "one play at a time" says what the page does.
- **Hero answer:** the 2–3 sentence answer to "how does football work?", written to be the snippet Google shows: plays, the offense and defense, four downs to go 10 yards, the touchdown, and why the game stops and starts.

## Which lesson answers what

| Index | Kicker | What the window shows | What the lesson teaches | Guide link |
|---|---|---|---|---|
| 0 | The field | the camera runs from one end zone to the other | 100 yards, the end zones, the touchdown, how yard lines are named ("own", "opp") | the field |
| 1 | Kickoff | kick, catch in the end zone, kneel | the kickoff and the touchback at the 35 | special teams |
| 2 | The teams | the two units line up; quarterback and middle linebacker labeled | offense, defense, 11 a side, the blue line, the snap | positions |
| 3 | Downs | the lineup fades; the yellow line is in view | four downs, 10 yards, reading the tag | downs |
| 4 | 1st & 10 · own 35 | a run for 4, tackled by the middle linebacker | how a play ends, where the ball is placed | none |
| 5 | 2nd & 6 · own 39 | a pass knocked away from the slot receiver | an incomplete pass, the ball goes back, the clock stops | none |
| 6 | 3rd & 6 · own 39 | a tackle flinches, a flag | false start, 5 yards, the down is replayed | penalties |
| 7 | 3rd & 11 · own 34 | a deep throw, the corner holds the receiver | pass interference: the spot of the foul and a first down | none |
| 8 | 1st & 10 · opp 48 | a 12-yard run, a guard holding at the line | holding: the play comes back, 1st & 20 | none |
| 9 | 1st & 20 · own 42 | an 8-yard catch by the tight end | yards short of the yellow line still count | none |
| 10 | 2nd & 12 · 50 | the end jumps early, the pass falls | offside, accept or decline, the numbers count down past midfield | none |
| 11 | 2nd & 7 · opp 45 | a 9-yard catch past the yellow line | a first down: the line jumps ahead | none |
| 12 | 1st & 10 · opp 36 | the end sacks the quarterback | a sack loses yards | glossary |
| 13 | 2nd & 17 · opp 43 | a late hit on the quarterback | roughing the passer: 15 yards and a first down | none |
| 14 | 1st & 10 · opp 28 | a toss, the back forced out of bounds | out of bounds stops the clock, and when it restarts | game length |
| 15 | 2nd & 5 · opp 23 | the quarterback still at the line, a flag | the play clock (40 or 25 seconds), delay of game | none |
| 16 | 2nd & 10 · opp 28 | two short passes, 6 and 3 | third down, the red zone | how to watch |
| 17 | 4th & 1 · opp 19 | a heavy formation and a quarterback sneak | punt, field goal or go for it | none |
| 18 | 1st & 10 · opp 17 | an 11-yard catch to the 6; the yellow line goes | "& goal" | none |
| 19 | 1st & goal · opp 6 | a goal-line dive for 3 | goal-line football | formations |
| 20 | 2nd & goal · opp 3 | a fake handoff and the touchdown catch | the touchdown, what counts as a catch, replay | replay |
| 21 | The try | the extra-point kick | the try: 1 point by kick from the 15, or 2 from the 2 | scoring |
| 22 | The rest of the game | the kickoff the other way | four quarters, three hours, every way to score, overtime | overtime |

## Copy rules this brief holds the lessons to

The project's (CLAUDE.md, spec §7) plus the copywriting skill's. Warm and adult, a knowledgeable friend. Answer first, define a term the first time it appears, and name only what the window shows. No em dashes, no AI tells (contrast reveals, negation lists, colon reveals, stacked threes). No other sports, and no being invited or taken to a game. "The officials" for the crew and "the referee" for the crew chief, with no other official named. No team names. Every rule fact comes from `2026-10-24-nfl-rules-check.md`. Sides come from the viewer's screen or not at all (motion.ts names them from the screen, and the players' own left is the other way).
