import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import { pageMetadata } from "@/lib/metadata";
import { divisionalGames, wildCardGames, type Game } from "@/lib/diagrams/bracket";

export const metadata = pageMetadata("/how-the-nfl-season-works");

const DIVISIONS = ["East", "North", "South", "West"];

// The league tree (rules check, row N2): two conferences of four four-team divisions, no team names
function LeagueTree() {
  const label = { fontSize: 13, fontWeight: 700, fill: "var(--ink)" };
  return (
    <figure className="diagram">
      <svg viewBox="0 0 320 214" role="img">
        <title>The NFL&rsquo;s 32 teams: the AFC and the NFC, each with East, North, South and West divisions of four teams</title>
        <text x="160" y="18" textAnchor="middle" {...label} fontSize="15">The NFL: 32 teams</text>
        <path d="M160,26 V36 M82,36 H238 M82,36 V46 M238,36 V46" stroke="var(--ink)" strokeWidth="2" fill="none" />
        {["AFC", "NFC"].map((conf, c) => {
          const x0 = 10 + c * 156;
          return (
            <g key={conf}>
              <rect x={x0} y="46" width="144" height="160" rx="8" fill="var(--tint)" stroke="var(--ink)" strokeWidth="2" />
              <text x={x0 + 72} y="66" textAnchor="middle" {...label} fontSize="15">{conf}</text>
              {DIVISIONS.map((d, i) => (
                <g key={d}>
                  <text x={x0 + 8} y={96 + i * 32} {...label}>{d}</text>
                  {[0, 1, 2, 3].map(t => (
                    <rect key={t} x={x0 + 54 + t * 21} y={82 + i * 32} width="16" height="18" rx="3" fill="#fff" stroke="var(--ink)" strokeWidth="1.5" />
                  ))}
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption>Two conferences, four divisions each, four teams in every division</figcaption>
    </figure>
  );
}

// The bracket: one conference's seven seeds through three rounds, with example winners (row N3). The pairings come
// from lib/diagrams/bracket.ts; the higher seed hosts the conference championship.
const WILD_CARD_WINNERS = [2, 3, 5]; // 5 upsets 4
const DIVISIONAL_WINNERS = [1, 3]; // 3 upsets 2
const CHAMPION = 1;

const BOX_W = 44, SLOT_H = 22, COLS = [12, 98, 184, 262];

interface Box { x: number; y: number; slots: (number | "bye")[]; winner: number }

// The wild card games are drawn in the order their winners appear in the next round, so no two lines cross.
function bracketBoxes(): Box[][] {
  const divGames = divisionalGames(WILD_CARD_WINNERS);
  const order = divGames.flat();
  const games = wildCardGames()
    .map(g => ({ g, winner: g.find(s => WILD_CARD_WINNERS.includes(s))! }))
    .sort((p, q) => order.indexOf(p.winner) - order.indexOf(q.winner));
  const wild: Box[] = [
    { x: COLS[0], y: 34, slots: [1, "bye"], winner: 1 },
    ...games.map(({ g, winner }, i): Box => ({ x: COLS[0], y: 92 + i * 56, slots: g, winner })),
  ];
  const div = divGames.map((g, i): Box => ({ x: COLS[1], y: 78 + i * 104, slots: g, winner: g.find(s => DIVISIONAL_WINNERS.includes(s))! }));
  const conf: Game = [Math.min(...DIVISIONAL_WINNERS), Math.max(...DIVISIONAL_WINNERS)];
  return [wild, div, [{ x: COLS[2], y: 130, slots: conf, winner: CHAMPION }], [{ x: COLS[3], y: 141, slots: [CHAMPION], winner: CHAMPION }]];
}

function Bracket() {
  const rounds = bracketBoxes();
  const slotY = (b: Box, seed: number) => b.y + b.slots.indexOf(seed) * SLOT_H + SLOT_H / 2;
  const links = rounds.slice(0, -1).flatMap((round, r) => round.map(b => {
    const next = rounds[r + 1].find(n => n.slots.includes(b.winner))!;
    const [x1, y1, x2, y2] = [b.x + BOX_W, slotY(b, b.winner), next.x, slotY(next, b.winner)];
    const mid = (x1 + x2) / 2;
    return <path key={`${r}-${b.winner}`} d={`M${x1},${y1} H${mid} V${y2} H${x2}`} stroke="var(--ink)" strokeWidth="2" fill="none" />;
  }));
  const head = { fontSize: 12, fontWeight: 700, fill: "var(--ink)", textAnchor: "middle" as const };
  return (
    <figure className="diagram">
      <svg viewBox="0 0 320 262" role="img">
        <title>
          An example playoff bracket for one conference: seed 1 has a bye; 2 hosts 7, 3 hosts 6 and 4 hosts 5; seed 1
          then hosts the lowest seed left; the conference champion goes to the Super Bowl
        </title>
        {["Wild card", "Divisional", "Conference", "Super Bowl"].map((h, i) => (
          <text key={h} x={COLS[i] + BOX_W / 2} y="18" {...head}>{h}</text>
        ))}
        {links}
        {rounds.flat().map(b => (
          <g key={`${b.x}-${b.y}`}>
            {b.slots.map((s, i) => (
              <g key={i}>
                <rect x={b.x} y={b.y + i * SLOT_H} width={BOX_W} height={SLOT_H} fill={s === b.winner ? "var(--accent)" : "#fff"} stroke="var(--ink)" strokeWidth="1.5" />
                <text x={b.x + BOX_W / 2} y={b.y + i * SLOT_H + 16} textAnchor="middle" fontSize={s === "bye" ? 12 : 15} fontWeight="700" fill="var(--ink)">{s}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      <figcaption>An example run through one conference: the host is on top, the winner highlighted</figcaption>
    </figure>
  );
}

// How a team's 17 games are made (N1)
const SCHEDULE: [string, string][] = [
  ["6", "Its three division rivals, each twice: once at home and once away"],
  ["4", "The four teams of another division in its own conference"],
  ["4", "The four teams of a division in the other conference"],
  ["2", "One team from each of the two other divisions in its conference, the one that finished in the same place the season before"],
  ["1", "A team from a division in the other conference it isn't already playing, again matched by last season's finish"],
];

// A season at a glance, with no dates so it doesn't go stale (N1, N3)
const GLANCE: [string, string][] = [
  ["Preseason", "Three exhibition games for each team; the results don't count"],
  ["Regular season", "17 games for each team over 18 weeks, with one week off"],
  ["Playoffs", "Seven teams from each conference, three rounds"],
  ["Super Bowl", "One game between the two conference champions"],
];

export default function SeasonPage() {
  return (
    <DeeperPage
      path="/how-the-nfl-season-works"
      intro={
        <p>
          An NFL season has four parts: a short preseason of exhibition games, a regular season in which each of the 32
          teams plays 17 games over 18 weeks, playoffs for seven teams from each of the two conferences, and the Super
          Bowl, where the two conference champions meet. Teams are grouped into divisions of four, and winning your
          division is the surest way into the playoffs.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive teaches one game, and its last card, the rest of the game, is the part every game in a season has in common: kick off, swap roles, and play until the clock runs out.",
      }}
      related={["/nfl-overtime-rules", "/how-long-is-a-football-game", "/how-scoring-works-in-football", "/football-glossary"]}
    >
      <Section title="The league in one picture">
        <Block kicker="The structure" title="32 teams, two conferences, four divisions each">
          <p>
            The NFL has 32 teams, split into two <strong>conferences</strong> of 16, the American Football Conference (AFC) and the National Football Conference (NFC). Each
            conference is split again into four <strong>divisions</strong> of four teams, named East, North, South and
            West. A team&rsquo;s division is its closest circle of rivals: it plays them most often, and it competes
            with them for a division title.
          </p>
          <LeagueTree />
        </Block>
      </Section>

      <Section title="The regular season">
        <Block kicker="The schedule" title="17 games over 18 weeks, one bye">
          <p>
            Each team plays 17 regular-season games spread over 18 weeks, so every team gets one week with no game,
            called its <strong>bye</strong>. Most games are played once a week, and whether a team plays at home or
            away alternates from year to year so the number of home games evens out: one season a team hosts nine of
            its 17, the next season eight.
          </p>
        </Block>
        <Block kicker="The formula" title="Who you play">
          <p>
            A team doesn&rsquo;t choose its opponents. The league builds every schedule from the same formula:
          </p>
          <div className="table-wrap">
            <table className="data">
              <caption>How a team&rsquo;s 17 games are made</caption>
              <thead>
                <tr><th scope="col">Games</th><th scope="col">Against</th></tr>
              </thead>
              <tbody>
                {SCHEDULE.map(([n, who]) => (
                  <tr key={who}><th scope="row">{n}</th><td className="prose">{who}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            So teams from the two conferences do meet in the regular season: five of every team&rsquo;s 17 games are
            against the other conference.
          </p>
          <p>
            The divisions a team plays rotate from one season to the next, so the exact opponents change every year.
            The last three games in the table are matched by where teams finished in their divisions the year before,
            so a division winner tends to meet other division winners. Over four seasons, the rotation brings every
            team in the other conference to a team&rsquo;s schedule once.
          </p>
          <p>
            Take a team in the AFC East. It plays its three East rivals twice each, for six games. It plays all four
            teams of one other AFC division, say the West, and all four of one NFC division, say the North. It plays
            the teams that finished in the same place as it did in the AFC&rsquo;s two remaining divisions, the North
            and the South. Its 17th game is against an NFC team from a division other than the North, again matched by
            last season&rsquo;s finish.
          </p>
        </Block>
        <Block kicker="Before it counts" title="The preseason">
          <p>
            Before the regular season, each team plays three <strong>preseason</strong> games. They&rsquo;re
            exhibitions: the results don&rsquo;t count in the standings, and teams usually use them to look at new players.
          </p>
        </Block>
        <Block kicker="A week off" title="The bye week">
          <p>
            The bye falls at a different point in the season for different teams, so for part of the season some
            teams sit out each week. It gives players a week to rest and recover, and it&rsquo;s why a team&rsquo;s 17
            games take 18 weeks.
          </p>
        </Block>
      </Section>

      <Section title="Winning the division">
        <Block kicker="The table" title="The standings">
          <p>
            Teams are ranked in their divisions by their record, the share of their games they&rsquo;ve won. A
            regular-season game can end in a tie after{" "}
            <GuideLink href="/nfl-overtime-rules">overtime</GuideLink>, and a tie counts as half a win and half a loss
            for both teams. The team at the top of its division at the end of the regular season is the division
            champion.
          </p>
        </Block>
        <Block kicker="Level on record" title="Breaking ties: head-to-head first">
          <p>
            When two teams in a division finish with the same record, the first tiebreaker is their games against
            each other: the team that won more of them finishes ahead. If they split those games, the next step is
            their record within the division. The league&rsquo;s full list runs longer, and a separate list decides ties for the wild-card places.
          </p>
        </Block>
      </Section>

      <Section title="The playoffs">
        <Block kicker="Fourteen teams" title="Seven teams per conference">
          <p>
            Seven teams from each conference make the <strong>playoffs</strong>. The four division champions are seeded
            1 to 4, and the three teams with the best records among the rest, called the <strong>wild cards</strong>,
            are seeded 5 to 7. Seed 1 gets the only <strong>bye</strong>, a week off while the other six play.
          </p>
          <Bracket />
        </Block>
        <Block kicker="Who plays whom" title="Seeding and who hosts">
          <ul>
            <li>
              <strong>The wild card round:</strong> seed 2 hosts seed 7, 3 hosts 6, and 4 hosts 5.
            </li>
            <li>
              <strong>The divisional round:</strong> seed 1 returns and hosts the lowest seed still alive, and the
              higher of the other two winners hosts the lower.
            </li>
            <li>
              <strong>The conference championship:</strong> the two divisional winners meet at the higher seed&rsquo;s
              stadium, and the winner is the conference champion.
            </li>
          </ul>
          <p>
            Because a division title guarantees a seed of 4 or better, a division champion hosts its first playoff game
            even if a wild-card team in its conference had a better record. In the example above, the 5 seed wins on
            the road and then visits seed 1, the lowest seed left.
          </p>
          <p>
            That&rsquo;s what makes the top seed so valuable. Seed 1 skips the first round, hosts its divisional game,
            and, as the higher seed in any conference championship it reaches, hosts that too. It can reach the Super
            Bowl by winning two games, both at home, while a wild-card team needs three wins, all likely on the road.
          </p>
        </Block>
        <Block kicker="A winner every time" title="No ties">
          <p>
            A playoff game can&rsquo;t end in a tie. If it&rsquo;s level after four quarters, the teams play 15-minute
            overtime periods until someone wins, so every game sends exactly one team on.
          </p>
        </Block>
      </Section>

      <Section title="The Super Bowl">
        <Block kicker="The final" title="The two conference champions meet">
          <p>
            The AFC&rsquo;s champion and the NFC&rsquo;s champion play one game, the <strong>Super Bowl</strong>, and
            the winner is the league champion. It&rsquo;s one game, not a series, so a whole season comes down to a
            single afternoon or evening.
          </p>
        </Block>
        <Block kicker="If it&rsquo;s level" title="Overtime is possible">
          <p>
            The Super Bowl follows the playoff rules, so a tied game goes to 15-minute overtime periods, under the same rule
            that gives both teams a chance at the ball, until there&rsquo;s a winner. Every point counts the same way it does all
            season; the <GuideLink href="/how-scoring-works-in-football">guide to scoring</GuideLink> lists them.
          </p>
        </Block>
      </Section>

      <Section title="A season at a glance">
        <Block kicker="In order" title="Preseason, regular season, playoffs, Super Bowl">
          <div className="table-wrap">
            <table className="data even">
              <caption>A season at a glance</caption>
              <thead>
                <tr><th scope="col">Part</th><th scope="col">What happens</th></tr>
              </thead>
              <tbody>
                {GLANCE.map(([part, what]) => (
                  <tr key={part}><th scope="row" className="prose">{part}</th><td className="prose">{what}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Each game in the regular season and the playoffs is the same game: four 15-minute quarters that take about three
            hours. The draft, where teams choose new players, happens in the
            offseason and is a story of its own.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
