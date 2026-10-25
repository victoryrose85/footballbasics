import DeeperPage from "@/components/deeper/DeeperPage";
import Section from "@/components/deeper/Section";
import Block from "@/components/deeper/Block";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/another-example");

// The second sample guide: the diagram and table markup site.css styles. Delete it along with /example-guide.
export default function AnotherExamplePage() {
  return (
    <DeeperPage
      path="/another-example"
      intro={
        <p>
          A diagram or a table can explain in one glance what takes a paragraph to describe. Both are plain server
          markup here, so Google reads every word in them and they cost nothing to load.
        </p>
      }
      related={["/example-guide", "/about", "/privacy-policy"]}
    >
      <Section title="A diagram">
        <Block kicker="Figure" title="An inline SVG with a caption">
          <p>
            Draw diagrams as inline SVG inside a <strong>figure.diagram</strong>. Give each one a{" "}
            <strong>title</strong> element so screen readers can describe it, and keep the logic that places things in a
            pure function in <strong>lib/</strong>, where a unit test can check it.
          </p>
          <figure className="diagram">
            <svg viewBox="0 0 440 160" role="img">
              <title>Three steps in a row, joined by arrows</title>
              {[0, 1, 2].map(i => (
                <g key={i}>
                  <rect x={10 + i * 150} y="40" width="120" height="80" rx="14" fill="#fff" stroke="var(--ink)" strokeWidth="4" />
                  <text x={70 + i * 150} y="88" textAnchor="middle" fontWeight="800" fontSize="22" fill="var(--ink)">Step {i + 1}</text>
                  {i < 2 && <path d={`M${134 + i * 150},80 h22 m-8,-8 l8,8 l-8,8`} stroke="var(--ink)" strokeWidth="4" fill="none" />}
                </g>
              ))}
            </svg>
            <figcaption><span className="call">Each step leads to the next</span></figcaption>
          </figure>
        </Block>
      </Section>

      <Section title="A table">
        <Block kicker="Table" title="A table that scrolls on a phone">
          <p>
            Wrap a <strong>table.data</strong> in a <strong>div.table-wrap</strong>, so a wide table scrolls inside its
            own box on a narrow phone instead of pushing the whole page sideways.
          </p>
          <div className="table-wrap">
            <table className="data">
              <caption>Where each part of a guide comes from</caption>
              <thead>
                <tr><th scope="col">Part</th><th scope="col">Comes from</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Title and H1</th><td>lib/pages.ts</td></tr>
                <tr><th scope="row">Ads and rails</th><td>DeeperPage</td></tr>
                <tr><th scope="row">Colors</th><td>site.config.ts</td></tr>
              </tbody>
            </table>
          </div>
        </Block>
      </Section>
    </DeeperPage>
  );
}
