import AdUnit from "@/components/AdUnit";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/site.config";

// The frame every page shares: the striped sheet with the wordmark on top and the footer at the bottom, between
// the two ad rails. rails={false} drops the rails, for the 404 page (AdSense allows no ads on error pages).
export default function PageFrame({ rails = true, children }: { rails?: boolean; children: React.ReactNode }) {
  return (
    <div className="page">
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
