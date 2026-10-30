import { describe, expect, test } from "vitest";
import { TERMS, groupTerms, termId } from "@/lib/glossary";
import { GUIDES, isRegistered } from "@/lib/pages";
import { BANNED, SITE_RULES } from "../copy-rules";

describe("glossary", () => {
  test("term ids are unique and safe as anchors", () => {
    expect(termId("Pick six")).toBe("pick-six");
    expect(termId("Yards after the catch")).toBe("yards-after-the-catch");
    const ids = TERMS.map(t => termId(t.term));
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  test("groups by letter, sorted within each", () => {
    const g = groupTerms([{ term: "Sack", definition: "" }, { term: "audible", definition: "" }, { term: "Accept", definition: "" }]);
    expect(g.map(x => x.key)).toEqual(["a", "s"]);
    expect(g[0].label).toBe("A");
    expect(g[0].terms.map(t => t.term)).toEqual(["Accept", "audible"]);
  });

  test("covers the plan and points at every guide", () => {
    expect(TERMS.length).toBeGreaterThanOrEqual(90);
    const linked = new Set(TERMS.map(t => t.href).filter(Boolean));
    for (const g of GUIDES.filter(g => g.path !== "/football-glossary")) expect(linked).toContain(g.path);
    for (const h of linked) expect(isRegistered(h!)).toBe(true);
    for (const t of TERMS) for (const [rule, re] of [...BANNED, ...SITE_RULES]) expect(t.definition, `${t.term}: ${rule}`).not.toMatch(re);
  });
});
