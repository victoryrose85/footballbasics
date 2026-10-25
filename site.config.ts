// Everything that changes from one site to the next. The metadata, ads, analytics, structured data, header,
// footer, ads.txt, theme and generated images all read from here. SETUP.md lists the few other places a new
// site touches (fonts, wrangler.jsonc, package.json, the pages). `npm run check` fails while a placeholder is left.
export const SITE = {
  name: "ExampleBasics.com", // the brand as written in the footer, structured data and social cards
  url: "https://example.com", // the canonical origin: https, no www, no trailing slash
  titleSuffix: " | ExampleBasics", // ends every page title in lib/pages.ts; H1s drop it
  mark: ["Example", "Basics"], // the wordmark; the second half is drawn in the accent color
  tagline: "Plain-English answers, one question per page.", // the pill on the social card
  contactEmail: "retailvalue@gmail.com",
  disclaimer: "Not affiliated with any organization named on this site.", // the footer's last line

  // The block near the end of every deeper page that sends readers back to the homepage
  back: {
    kicker: "Back to the start",
    title: "Every guide in one place",
    text: "The homepage lists every guide on the site, each one answering a single question.",
    link: "See all the guides",
  },

  // Google Analytics: one property (or web data stream) per site
  gaId: "G-XXXXXXXXXX",

  // AdSense: one account for every site. Ad units work on any approved site in the account, so these four can be
  // shared; make new ones in AdSense only if you want each site's units reported separately.
  adClient: "ca-pub-7974197915420941",
  adSlots: {
    rightRail: "9898662932", // 300x600, sticky, desktop only
    leftRail: "4438579002", // 160x600, scrolls with the page, above 1320px
    inPage: "7479675317", // responsive, below the homepage's guide list
    inArticle: "5560088986", // deeper pages, after the intro and after the article
  },

  // The fonts' family names, for the generated images only. The site loads them in app/fonts.ts (next/font
  // needs its options written out there), so change both together.
  fonts: { display: "Baloo 2", body: "Nunito" },

  // Set on <html> as custom properties (--ink, --accent, ...); app/site.css never names a color itself.
  // These are SoccerBasics' greens. White headings sit on the stripes with an ink outline, so keep the ink dark.
  colors: {
    ink: "#1d3b1a", // outlines, borders, block headings
    page: "#1d3b1a", // behind the sheet and the rails
    accent: "#ffd23f", // the wordmark's second half, kicker pills, link underlines, hovers, focus rings
    "stripe-a": "#5cbf4a", // the sheet's two alternating bands
    "stripe-b": "#51b03f",
    text: "#28352a", // body text in the white blocks
    updated: "#fff6c8", // the "Last updated" line on the stripes
    "foot-border": "#16301a",
    "foot-text": "#d9e8d2",
    "foot-muted": "#a8c4a0", // the copyright line
    tint: "#eef6ea", // alternate table rows
    muted: "#55624f", // table captions
  },
} as const;
