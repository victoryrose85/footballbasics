import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/site.config";

export const metadata = pageMetadata("/about");

// AdSense reviewers look for a real About page: who runs the site, why, how it's checked, and a way to get in
// touch. Rewrite the why and the how for each site; the who, corrections and contact blocks mostly carry over.
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
      related={["/example-guide", "/another-example", "/privacy-policy"]}
    >
      <Section title="About the site">
        <Block kicker="Why" title="Why this site exists">
          <p>
            Most explanations of a subject are written by people who already know it well, and it shows. They use the
            field&rsquo;s own words without explaining them, skip the steps that feel obvious to an expert, and bury the
            answer under background. This site tries to do the opposite: define every word before using it, keep each
            page focused on one question, and put the answer at the top.
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
            Facts on the site are checked against primary sources, such as official rules, government pages and the
            organizations&rsquo; own websites, and pages are updated when those sources change. Each page shows the date
            it was last updated, just below its title.
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
