import { isRegistered } from "@/lib/pages";

// An in-text link to another guide. Until that guide is registered, its words render as plain text marked
// data-waiting, so a staged build never links to a page that doesn't exist.
export default function GuideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return isRegistered(href) ? <a href={href}>{children}</a> : <span data-waiting={href}>{children}</span>;
}
