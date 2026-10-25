import AdUnit from "@/components/AdUnit";
import JsonLd from "@/components/JsonLd";
import PageFrame from "@/components/PageFrame";
import Drive from "@/components/drive/Drive";
import Block from "@/components/deeper/Block";
import Section from "@/components/deeper/Section";
import { HERO } from "@/lib/drive/lessons";
import { pageMetadata } from "@/lib/metadata";
import { GUIDES } from "@/lib/pages";
import { homeJsonLd } from "@/lib/structured-data";
import { SITE } from "@/site.config";

export const metadata = pageMetadata("/");

// The homepage: the H1 and a short answer, then one drive, play by play, with the field window pinned beside
// (desktop) or above (phone) the lessons. The guide list and the in-page ad come after the drive, never inside it.
export default function HomePage() {
  return (
    <PageFrame>
      <JsonLd data={homeJsonLd()} />
      <article className="sheet-body home">
        <h1>
          <span className="wordmark">{SITE.mark[0]}<em>{SITE.mark[1]}</em></span>
          <span className="tag">{HERO.tagline}</span>
        </h1>
        <div className="lede">
          <p>{HERO.answer}</p>
        </div>
        <Drive />
        <section className="guides">
          <Section title="The guides">
            {GUIDES.map(p => (
              <Block key={p.path} title={<a href={p.path}>{p.name}</a>}>
                <p>{p.description}</p>
              </Block>
            ))}
          </Section>
        </section>
      </article>
      <AdUnit slot="inPage" />
    </PageFrame>
  );
}
