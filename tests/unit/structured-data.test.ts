import { describe, expect, test } from "vitest";
import { homeJsonLd, articleJsonLd, breadcrumbJsonLd, glossaryJsonLd } from "@/lib/structured-data";
import { GUIDES } from "@/lib/pages";
import { SITE } from "@/site.config";

type Node = Record<string, any>;

describe("structured data", () => {
  test("homepage is a WebSite plus an Organization with the square logo", () => {
    const [site, org] = homeJsonLd() as Node[];
    expect([site["@type"], org["@type"]]).toEqual(["WebSite", "Organization"]);
    expect(site.name).toBe(SITE.name);
    expect(org.logo).toBe(`${SITE.url}/logo.png`);
  });

  test("a guide gets breadcrumbs from Home and an Article", () => {
    const guide = GUIDES[0];
    const [crumbs, article] = articleJsonLd(guide.path) as Node[];
    expect(crumbs["@type"]).toBe("BreadcrumbList");
    expect(crumbs.itemListElement.map((i: Node) => [i.name, i.item])).toEqual([
      ["Home", `${SITE.url}/`],
      [guide.name, `${SITE.url}${guide.path}`],
    ]);
    expect(article["@type"]).toBe("Article");
    expect(article.headline).toBe(guide.title.slice(0, -SITE.titleSuffix.length));
    expect(article.dateModified).toBe(guide.updated);
    expect(article.image).toBe(`${SITE.url}/og-default.png`);
  });

  test("breadcrumbJsonLd is the Article's breadcrumb on its own", () => {
    expect(breadcrumbJsonLd("/about")).toEqual(articleJsonLd("/about")[0]);
  });

  test("glossaryJsonLd has a DefinedTerm per term, with the same text", () => {
    const set = glossaryJsonLd([{ term: "Sack", definition: "A tackle of the quarterback." }, { term: "Snap", definition: "Starts the play." }]) as Node;
    const url = `${SITE.url}/football-glossary`;
    expect(set["@type"]).toBe("DefinedTermSet");
    expect(set.name).toBe("Football glossary");
    expect(set.url).toBe(url);
    expect(set.hasDefinedTerm).toEqual([
      { "@type": "DefinedTerm", name: "Sack", description: "A tackle of the quarterback.", inDefinedTermSet: url },
      { "@type": "DefinedTerm", name: "Snap", description: "Starts the play.", inDefinedTermSet: url },
    ]);
  });
});
