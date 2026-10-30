// The copy rules, shared by the unit tests (the homepage's lessons and tips) and the e2e tests (what a reader
// sees on each page). A site adds its own (a term it never uses, say) to SITE_RULES.
export const BANNED: [string, RegExp][] = [
  ["no em dashes", /—/],
  ["no AI-isms", /\b(delve|tapestry|it'?s worth noting|game-changer|navigat(e|ing) the|whether you'?re a|dive into|unlock|in today'?s fast-paced)\b/i],
];
export const SITE_RULES: [string, RegExp][] = [
  ["no other sports", /\b(soccer|rugby|basketball|baseball|hockey)\b/i],
  ["football, not American football (the American Football Conference is its name)", /\bamerican football\b(?! conference)/i],
  ["no invited-by-friends framing", /\b(invited|your friends|heading to (a|the) game)\b/i],
  ["the officials or the referee, never the refs", /\brefs?\b/i],
];
