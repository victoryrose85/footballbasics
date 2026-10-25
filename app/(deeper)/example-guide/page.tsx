import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/example-guide");

// A sample guide that doubles as the how-to. Delete it (and /another-example) once a site has real guides:
// remove the folder, its entry in lib/pages.ts and its TARGET_WORDS entry, and any chips that point at it.
export default function ExampleGuidePage() {
  return (
    <DeeperPage
      path="/example-guide"
      intro={
        <p>
          A guide answers one question that people type into a search box. It starts with the answer in two or three
          sentences, like this block, and then spends the rest of the page explaining it properly, one section at a
          time.
        </p>
      }
      related={["/another-example", "/about", "/privacy-policy"]}
    >
      <Section title="Adding a page">
        <Block kicker="Step 1" title="Register it">
          <p>
            Add an entry to <strong>lib/pages.ts</strong> with the path, a short name, the title, the description, the
            date and <strong>kind: &quot;guide&quot;</strong>. The title becomes the page&rsquo;s H1 once the brand
            suffix is taken off, so write it as a headline. The unit tests check that it fits in a search result.
          </p>
        </Block>
        <Block kicker="Step 2" title="Write the page">
          <p>
            Create <strong>app/(deeper)/your-path/page.tsx</strong>, export its metadata with{" "}
            <strong>pageMetadata()</strong>, and wrap the content in <strong>DeeperPage</strong>. It supplies the
            breadcrumbs, the heading, the date, both ads, the way back to the homepage, the related links and the
            structured data, so the page itself is only the writing.
          </p>
        </Block>
        <Block kicker="Step 3" title="Give it a length target">
          <p>
            Add the path to <strong>TARGET_WORDS</strong> in <strong>tests/e2e/deeper-pages.ts</strong>. The copy test
            fails a page that comes in under 80 percent of its target, which keeps thin pages from going live.
          </p>
        </Block>
      </Section>

      <Section title="Shaping the content">
        <Block title="Sections and blocks">
          <p>
            Each <strong>Section</strong> is an H2, and each white <strong>Block</strong> inside it can carry a small
            kicker pill and an H3. A block can hold paragraphs, lists, a diagram or a table.
          </p>
          <ul>
            <li>Keep one idea per block, so a reader skimming the headings can find their answer.</li>
            <li>Define a term the first time it appears, before the page relies on it.</li>
            <li>Link to other guides in the text where they help, as well as in the chips at the end.</li>
          </ul>
        </Block>
      </Section>
    </DeeperPage>
  );
}
