import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/site.config";

export const metadata = pageMetadata("/about");

// AdSense reviewers look for a real About page: who runs the site, why, how it's checked, and a way to get in
// touch. The why and the how are this site's; the who, corrections and contact blocks carry over from the template.
export default function AboutPage() {
  return (
    <DeeperPage
      path="/about"
      intro={
        <p>
          {SITE.name} explains one subject in plain English, for people who are new to it and want a straight answer
          without wading through jargon. Every page answers a single question, is checked against reliable sources, and
          is free to read.
        </p>
      }
      related={["/downs-in-football", "/football-penalties-explained", "/privacy-policy"]}
    >
      <Section title="About the site">
        <Block kicker="Why" title="Why this site exists">
          <p>
            Football is a pleasure to watch once you know what the pauses mean, and a puzzle until you do. A flag lands,
            the clock stops, a number on the screen changes, and everyone around you seems to understand it. Most
            explanations are written by people who have watched the game all their lives, so they use the game&rsquo;s
            words without saying what they mean and skip the steps that feel obvious. FootballBasics starts from the
            other end. The homepage follows a single NFL drive play by play, so each rule is explained at the moment you
            would meet it, and the guides answer one question each in plain English, with the answer first and every
            term explained before it is used.
          </p>
        </Block>
        <Block kicker="Who" title="Who writes it">
          <p>
            The site is written and edited by an independent publisher. We&rsquo;re not connected to any organization we
            write about, and nobody pays us to say anything about them. The site is supported by ads.
          </p>
        </Block>
        <Block kicker="How" title="How pages are checked">
          <p>
            Every rule on this site is checked against the current NFL rulebook before it is published. Facts about how a
            season is organized come from the NFL&rsquo;s own publications. Where the rulebook says nothing, we say so;
            the blue and yellow lines you see on TV, for example, are broadcast graphics and are not painted on the
            field. We write about the NFL first. When college football works differently in a way that could confuse a
            new viewer, we say so in a sentence. Each page shows the date it was last updated just below its title, and
            we revise a page when a rule changes.
          </p>
        </Block>
        <Block kicker="Mistakes" title="Corrections">
          <p>
            If you spot something wrong, out of date, or unclear, please tell us. We fix factual errors as quickly as we
            can, and update the page&rsquo;s date when we do. If you know the subject well and think we&rsquo;ve explained
            something in a way that would confuse a beginner, we&rsquo;d like to hear that too.
          </p>
        </Block>
        <Block kicker="Contact" title="Contact" id="contact">
          <p>
            Questions, corrections or feedback: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </p>
          <p>
            For privacy requests, see the <a href="/privacy-policy">privacy policy</a>.
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
