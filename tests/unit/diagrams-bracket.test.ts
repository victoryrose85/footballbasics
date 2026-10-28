import { expect, test } from "vitest";
import { divisionalGames, wildCardGames } from "@/lib/diagrams/bracket";

// One conference's seven seeds (rules check, row N3); each game is [host, visitor]
test("the wild card round", () => expect(wildCardGames()).toEqual([[2, 7], [3, 6], [4, 5]]));

test("the top seed hosts the lowest seed left", () => {
  expect(divisionalGames([2, 3, 4])).toEqual([[1, 4], [2, 3]]);
  expect(divisionalGames([7, 6, 5])).toEqual([[1, 7], [5, 6]]);
  expect(divisionalGames([2, 6, 5])).toEqual([[1, 6], [2, 5]]);
});
