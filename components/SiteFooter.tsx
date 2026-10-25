import PrivacyChoicesLink from "@/components/PrivacyChoicesLink";
import { SITE } from "@/site.config";

// The ads and cookies notice, then the site and privacy links. AdSense and the US state privacy laws expect
// every page to carry these.
export default function SiteFooter() {
  return (
    <footer className="foot">
      <p>
        {SITE.name} is free to read and supported by ads. Google and its partners use cookies to show those ads, and
        Google Analytics uses cookies to count visits and see which pages are read.
      </p>
      <nav aria-label="Site">
        <a href="/about">About</a>
        <a href="/about#contact">Contact</a>
        <a href="/privacy-policy">Privacy policy</a>
        <PrivacyChoicesLink />
        <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google ad settings</a>
      </nav>
      <small>&copy; {new Date().getFullYear()} {SITE.name} &middot; {SITE.disclaimer}</small>
    </footer>
  );
}
