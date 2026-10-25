import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import Block from "@/components/deeper/Block";
import Chips from "@/components/deeper/Chips";
import { GUIDES } from "@/lib/pages";
import { SITE } from "@/site.config";

// Built into 404.html, which the Worker serves for any path it doesn't have. Next adds the noindex tag itself.
// No ads: AdSense doesn't allow them on error pages.
export const metadata: Metadata = {
  title: { absolute: `Page not found | ${SITE.name}` },
  description: "That page isn't here. Head back to the homepage, or pick one of the guides below.",
};

export default function NotFound() {
  return (
    <PageFrame rails={false}>
      <article className="sheet-body">
        <h1>That page isn&rsquo;t here</h1>
        <Block kicker="Not found" title="Let&rsquo;s get you back on track">
          <p>
            The link you followed may be old, or the address may have a typo in it. The homepage lists every guide on
            the site, and the ones below answer the questions people ask most.
          </p>
          <a href="/">Back to the homepage &rarr;</a>
        </Block>
      </article>
      <Chips paths={GUIDES.slice(0, 4).map(p => p.path)} />
    </PageFrame>
  );
}
