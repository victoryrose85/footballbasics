import AdUnit from "@/components/AdUnit";
import JsonLd from "@/components/JsonLd";
import PageFrame from "@/components/PageFrame";
import Block from "@/components/deeper/Block";
import Chips from "@/components/deeper/Chips";
import { formatUpdated, getPage, pageHeadline } from "@/lib/pages";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { SITE } from "@/site.config";

interface DeeperPageProps {
  path: string; // a path in lib/pages.ts
  intro: React.ReactNode; // the 2–3 sentence answer, rendered in the lede block
  back?: { title: string; text: string }; // the way back to the homepage; SITE.back when left out
  related: string[]; // 3–4 registered paths, shown as chips
  jsonLd?: object; // extra structured data (a DefinedTermSet for a glossary, say)
  children: React.ReactNode; // the <Section>s
}

// Everything around a deeper page's sections: breadcrumbs, H1, "last updated", both in-article ads, the way
// back to the homepage, related pages and the JSON-LD (an Article for a guide, breadcrumbs only for a site
// page). The title, H1, breadcrumb name and date all come from lib/pages.ts, so they can't disagree with the
// metadata or the structured data.
export default function DeeperPage({ path, intro, back = SITE.back, related, jsonLd, children }: DeeperPageProps) {
  const page = getPage(path);
  return (
    <PageFrame>
      <JsonLd data={page.kind === "guide" ? articleJsonLd(path) : breadcrumbJsonLd(path)} />
      {jsonLd && <JsonLd data={jsonLd} />}
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">&rsaquo;</span> <span aria-current="page">{page.name}</span>
      </nav>
      <article className="sheet-body">
        <h1>{pageHeadline(path)}</h1>
        <p className="updated">Last updated {formatUpdated(page.updated)}</p>
        <div className="lede">{intro}</div>
        <AdUnit slot="inArticle" />
        {children}
      </article>
      <AdUnit slot="inArticle" />
      <aside className="back">
        <Block kicker={SITE.back.kicker} title={back.title}>
          <p>{back.text}</p>
          <a href="/">{SITE.back.link} &rarr;</a>
        </Block>
      </aside>
      <Chips paths={related} />
    </PageFrame>
  );
}
