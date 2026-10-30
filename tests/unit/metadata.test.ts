import { describe, expect, test } from "vitest";
import { pageMetadata } from "@/lib/metadata";
import { PAGES } from "@/lib/pages";

describe("pageMetadata", () => {
  test("a guide shares as an article, with its updated date", () => {
    for (const page of PAGES.filter(p => p.kind === "guide")) {
      expect(pageMetadata(page.path).openGraph, page.path).toMatchObject({ type: "article", modifiedTime: page.updated });
    }
  });

  test("the homepage and site pages share as a website", () => {
    for (const page of PAGES.filter(p => p.kind !== "guide")) {
      const og = pageMetadata(page.path).openGraph;
      expect(og, page.path).toMatchObject({ type: "website" });
      expect(og, page.path).not.toHaveProperty("modifiedTime");
    }
  });
});
