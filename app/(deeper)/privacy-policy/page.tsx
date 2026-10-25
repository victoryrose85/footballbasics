import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import PrivacyChoicesLink from "@/components/PrivacyChoicesLink";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/site.config";

export const metadata = pageMetadata("/privacy-policy");

const CONTACT = SITE.contactEmail;
const HOST = new URL(SITE.url).hostname;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

// Written for a site with no accounts or forms, Google ads, Google Analytics and Google's consent messages.
// If a site adds anything that collects data (a newsletter, a form, another ad network), this page changes too.
export default function PrivacyPolicyPage() {
  return (
    <DeeperPage
      path="/privacy-policy"
      intro={
        <p>
          {SITE.name} is free to read and supported by ads. We don&rsquo;t have accounts, sign-ups or forms, and we
          don&rsquo;t ask for your name or email address. The data collected while you read the site comes from
          Google&rsquo;s advertising and analytics services, and this page explains what they collect, how you can
          control it, and the rights US state privacy laws may give you.
        </p>
      }
      related={["/about", "/example-guide", "/another-example"]}
    >
      <Section title="Overview">
        <Block>
          <p>
            This policy covers {HOST}. We don&rsquo;t collect personal information directly, except when you
            choose to email us, in which case we receive your email address and whatever you write, and use them only to
            reply. We don&rsquo;t sell that information or share it with anyone.
          </p>
          <p>
            The site is hosted by Cloudflare, which processes basic technical information such as your IP address to
            deliver pages to you and protect the site from attacks.
          </p>
        </Block>
      </Section>

      <Section title="Advertising">
        <Block kicker="Google AdSense" title="How ads work here">
          <p>
            The site shows ads served by Google AdSense. Google and its partners use cookies and similar technologies to
            show ads, measure how they perform, and, where you allow it, choose ads based on your visits to this and other
            websites. Those are called personalized ads. Ads that aren&rsquo;t personalized are based on things like the
            page you&rsquo;re reading and your general location instead.
          </p>
          <p>
            You can turn off personalized ads from Google at any time in{" "}
            <Ext href="https://adssettings.google.com">Google&rsquo;s ad settings</Ext>, and learn more about how Google
            uses information from sites like this one at{" "}
            <Ext href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites or apps that use our services</Ext>.
            You can also opt out of personalized advertising from many other ad companies at{" "}
            <Ext href="https://optout.aboutads.info/">aboutads.info</Ext>.
          </p>
        </Block>
      </Section>

      <Section title="Analytics">
        <Block kicker="Google Analytics" title="What we count">
          <p>
            We use Google Analytics to understand how the site is used: which pages are read, how people arrive, roughly
            where they are, and what kind of device and browser they use. We look at these numbers in aggregate to decide
            what to write and fix. Google Analytics uses cookies to tell one visit from another, and it doesn&rsquo;t
            store IP addresses. We don&rsquo;t use it to identify individual readers.
          </p>
          <p>
            You can stop Google Analytics from collecting data in your browser with Google&rsquo;s{" "}
            <Ext href="https://tools.google.com/dlpage/gaoptout">opt-out browser add-on</Ext>.
          </p>
        </Block>
      </Section>

      <Section title="Your consent choices">
        <Block kicker="Consent" title="The messages you may see">
          <p>
            Depending on where you are, Google&rsquo;s privacy messaging tool may show you a message when you first
            visit:
          </p>
          <ul>
            <li>
              <strong>In the European Economic Area, the UK and Switzerland</strong>, you&rsquo;re asked whether you
              agree to cookies for ads and analytics. Until you answer, advertising and analytics cookies stay off, and if
              you decline, you&rsquo;ll still see ads, but not personalized ones.
            </li>
            <li>
              <strong>In US states with privacy laws that give you the right</strong>, you can choose not to have your
              information sold or shared for targeted advertising. When you do, Google switches to restricted data
              processing for your visits, which means ads aren&rsquo;t based on your past browsing.
            </li>
          </ul>
          <p>
            You can change your answer at any time with the <PrivacyChoicesLink /> link, here or at the bottom of every
            page.
          </p>
        </Block>
      </Section>

      <Section title="Your rights under US state privacy laws">
        <Block kicker="US states" title="What you can ask for">
          <p>
            California and a growing number of other states give their residents rights over personal information.
            Depending on the state you live in, these may include the right to:
          </p>
          <ul>
            <li>
              <strong>opt out</strong> of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of your personal information
              for targeted advertising, as those terms are defined in state law;
            </li>
            <li>
              <strong>know</strong> what personal information has been collected about you, and to get a copy;
            </li>
            <li>
              <strong>correct</strong> information that&rsquo;s inaccurate;
            </li>
            <li>
              <strong>delete</strong> personal information collected about you;
            </li>
            <li>
              and not to be treated differently for using any of these rights.
            </li>
          </ul>
          <p>
            The cookies used for personalized ads can count as &ldquo;sharing&rdquo; under some of these laws. To opt out,
            use the <PrivacyChoicesLink /> link. Some state laws also require a Global Privacy Control (GPC) signal from
            your browser to be treated as an opt-out, and in those states Google&rsquo;s ad system reads the signal and
            restricts data processing for your visit automatically.
          </p>
          <p>
            For any other request, email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> with the subject line
            &ldquo;Privacy request&rdquo; and the state you live in. Since we don&rsquo;t hold accounts or profiles, much
            of the data in question is held by Google, and we&rsquo;ll tell you how to reach it where that&rsquo;s the
            case. We may need to ask for information to confirm a request is genuine, and we&rsquo;ll respond within the
            time the law that applies to you requires.
          </p>
        </Block>
      </Section>

      <Section title="Cookies">
        <Block>
          <p>
            The site itself doesn&rsquo;t set its own cookies to track you. The cookies you&rsquo;ll find on it are set by
            Google&rsquo;s advertising, analytics and consent services, as described above, along with a record of your
            consent choice so you aren&rsquo;t asked again on every page. You can block or delete cookies in your
            browser&rsquo;s settings; the site still works without them, though the ads you see won&rsquo;t be
            personalized.
          </p>
        </Block>
      </Section>

      <Section title="Links to other sites">
        <Block>
          <p>
            Some pages link to other websites, such as official sources and the organizations we write about. Those sites have their
            own privacy policies, and we&rsquo;re not responsible for how they handle your information.
          </p>
        </Block>
      </Section>

      <Section title="Children&rsquo;s privacy">
        <Block>
          <p>
            The site is meant for a general audience and isn&rsquo;t directed at children under 13. We don&rsquo;t
            knowingly collect personal information from children. If you believe a child has sent us personal
            information, email us and we&rsquo;ll delete it.
          </p>
        </Block>
      </Section>

      <Section title="Changes to this policy">
        <Block>
          <p>
            We&rsquo;ll update this policy when the way the site works changes, or when the law requires it. The date at
            the top of the page shows when it was last revised.
          </p>
        </Block>
      </Section>

      <Section title="Contact">
        <Block id="privacy-contact">
          <p>
            Questions about this policy or your information: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </p>
        </Block>
      </Section>
    </DeeperPage>
  );
}
