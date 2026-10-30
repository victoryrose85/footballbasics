import type { Metadata } from "next";
import "./globals.css";
import "./site.css";
import "./drive.css";
import { body, display } from "./fonts";
import { AD_CLIENT } from "@/lib/ads";
import { GA_ID, GTAG_INIT } from "@/lib/consent";
import { BASE_URL, getPage } from "@/lib/pages";
import { SITE } from "@/site.config";

const home = getPage("/");

// SITE.colors as custom properties (--ink, --accent, ...), so site.css never names a color itself.
const theme = Object.fromEntries(Object.entries(SITE.colors).map(([k, v]) => [`--${k}`, v])) as React.CSSProperties;

export const metadata: Metadata = {
  title: home.title,
  description: home.description,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    siteName: SITE.name,
    type: "website",
  },
  other: {
    "google-adsense-account": AD_CLIENT,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} style={theme}>
      <head>
        {/* Consent Mode defaults first, so Analytics waits for the consent message's answer where one is shown */}
        <script dangerouslySetInnerHTML={{ __html: GTAG_INIT }} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
