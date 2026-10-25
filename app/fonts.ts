import { Oswald, Source_Sans_3 } from "next/font/google";

// The display font (the wordmark and headings) and the body font, as --font-display and --font-body.
// next/font needs its options written out here, so a new site swaps the fonts in this file and names the
// same families in SITE.fonts, which the generated images use.
export const display = Oswald({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display", display: "swap" });
export const body = Source_Sans_3({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-body", display: "swap" });
