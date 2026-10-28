// One conference's playoff bracket (rules check, row N3). Seeds run 1 to 7: the four division champions are 1 to 4,
// the three wild cards 5 to 7, and seed 1 has the only bye. Each game is [host, visitor].
export type Game = [number, number];

// 2 hosts 7, 3 hosts 6, 4 hosts 5
export function wildCardGames(): Game[] {
  return [[2, 7], [3, 6], [4, 5]];
}

// The three wild-card winners join seed 1: it hosts the lowest seed left, and the higher of the other two hosts.
export function divisionalGames(winners: number[]): Game[] {
  const [a, b, lowest] = [...winners].sort((x, y) => x - y);
  return [[1, lowest], [a, b]];
}
