import { describe, expect, test } from "vitest";
import { BANNED, SITE_RULES } from "../copy-rules";

const ALL = new Map([...BANNED, ...SITE_RULES]);
const rule = (start: string) => [...ALL].find(([name]) => name.startsWith(start))![1];

describe("copy rules", () => {
  test("every rule's pattern is free of control characters", () => {
    for (const [name, re] of ALL) expect(re.source, name).not.toMatch(/[\x00-\x1f]/);
  });

  test("the American football rule fires, and lets the conference's name through", () => {
    const re = rule("football, not American football");
    expect("This is American football.").toMatch(re);
    expect("american football rules").toMatch(re);
    expect("the American Football Conference (AFC)").not.toMatch(re);
  });

  test("the other site rules fire", () => {
    expect("It's like soccer.").toMatch(rule("no other sports"));
    expect("Ask the ref.").toMatch(rule("the officials or the referee"));
    expect("You were invited.").toMatch(rule("no invited-by-friends"));
  });
});
