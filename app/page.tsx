import AdUnit from "@/components/AdUnit";
import JsonLd from "@/components/JsonLd";
import PageFrame from "@/components/PageFrame";
import Block from "@/components/deeper/Block";
import Section from "@/components/deeper/Section";
import { pageMetadata } from "@/lib/metadata";
import { GUIDES, pageHeadline } from "@/lib/pages";
import { homeJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata("/");

// The homepage: a short answer to "what is this site?", then every guide as a block. A site can swap this
// for something custom later (SoccerBasics teaches the whole game on one scrolling field) once it has a reason to.
export default function HomePage() {
  return (
    <PageFrame>
      <JsonLd data={homeJsonLd()} />
      <article className="sheet-body">
        <h1>{pageHeadline("/")}</h1>
        <div className="lede">
          <p>
            Replace this with two or three sentences that tell a new visitor what the site explains, who it&rsquo;s
            for, and where to start. Google often shows this text in search results, so make it a real answer rather
            than a welcome message.
          </p>
        </div>
        <Section title="The guides">
          {GUIDES.map(p => (
            <Block key={p.path} title={<a href={p.path}>{p.name}</a>}>
              <p>{p.description}</p>
            </Block>
          ))}
        </Section>
      </article>
      <AdUnit slot="inPage" />
    </PageFrame>
  );
}
