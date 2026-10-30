import { Fragment } from "react";
import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import GuideLink from "@/components/deeper/GuideLink";
import { TERMS, groupTerms, termId } from "@/lib/glossary";
import { getPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/metadata";
import { glossaryJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata("/football-glossary");

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

export default function GlossaryPage() {
  const groups = groupTerms(TERMS);
  const has = new Set(groups.map(g => g.key));
  return (
    <DeeperPage
      path="/football-glossary"
      intro={
        <p>
          These are the football words you&rsquo;ll hear in an NFL game, each explained in a sentence or two. Jump to a
          letter or scroll through them, and where a term has more to it, the link beneath it goes to the guide that
          covers it in full.
        </p>
      }
      back={{
        title: "Back to the drive",
        text: "The homepage drive is where many of these words come up: offense, defense and the line of scrimmage as the teams first line up, then downs, and later a sack and roughing the passer, all as they happen on one drive.",
      }}
      related={["/football-positions-explained", "/downs-in-football", "/football-penalties-explained", "/how-to-watch-football"]}
      jsonLd={glossaryJsonLd(TERMS)}
    >
      <nav className="letters" aria-label="Jump to a letter">
        {LETTERS.map(k => has.has(k)
          ? <a key={k} href={`#letter-${k}`}>{k.toUpperCase()}</a>
          : <span key={k} aria-hidden="true">{k.toUpperCase()}</span>)}
      </nav>
      {groups.map(g => (
        <Section key={g.key} id={`letter-${g.key}`} title={g.label}>
          <Block>
            <dl className="terms">
              {g.terms.map(t => (
                <Fragment key={t.term}>
                  <dt id={termId(t.term)}>{t.term}</dt>
                  <dd>
                    {t.definition}
                    {t.href && <span className="more"><GuideLink href={t.href}>More: {getPage(t.href).name}</GuideLink></span>}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </Block>
        </Section>
      ))}
    </DeeperPage>
  );
}
