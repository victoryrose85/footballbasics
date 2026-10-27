import { getPage, isRegistered } from "@/lib/pages";

// Links to related pages, in the homepage's chip style, each named as the page is in the registry. A path that
// isn't registered yet is left out and listed in data-waiting, so the chips fill in as the guides are built.
export default function Chips({ paths }: { paths: string[] }) {
  const waiting = paths.filter(p => !isRegistered(p));
  return (
    <nav className="chips" aria-label="Keep reading" data-waiting={waiting.length ? waiting.join(" ") : undefined}>
      {paths.filter(isRegistered).map(p => <a key={p} href={p}>{getPage(p).name} &rarr;</a>)}
    </nav>
  );
}
