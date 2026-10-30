import AdUnit from "@/components/AdUnit";
import SiteFooter from "@/components/SiteFooter";
import { AD_CLIENT } from "@/lib/ads";
import { SITE } from "@/site.config";

// The frame every page shares: the striped sheet with the wordmark on top and the footer at the bottom, between
// the two ad rails. rails={false} drops the rails and the AdSense script, for the 404 page: AdSense allows no ads on
// error pages, and with the script loaded Auto ads would place one there by itself.
export default function PageFrame({ rails = true, children }: { rails?: boolean; children: React.ReactNode }) {
  return (
    <div className="page">
      {/* Plain script tag, which React moves to the head: AdSense rejects the data-nscript attribute next/script adds */}
      {rails && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
          crossOrigin="anonymous"
        />
      )}
      <div className={rails ? "page-grid" : "page-grid solo"}>
        {rails && (
          <aside className="rail left" aria-label="Advertisement">
            <AdUnit slot="leftRail" />
          </aside>
        )}
        <main className="sheet">
          <header className="slim">
            <a className="mark" href="/">{SITE.mark[0]}<em>{SITE.mark[1]}</em></a>
          </header>
          {children}
          <SiteFooter />
        </main>
        {rails && (
          <aside className="rail right" aria-label="Advertisement">
            <AdUnit slot="rightRail" />
          </aside>
        )}
      </div>
    </div>
  );
}
