import { getPage } from "@/lib/pages";

// Links to related pages, in the homepage's chip style, each named as the page is in the registry.
export default function Chips({ paths }: { paths: string[] }) {
  return (
    <nav className="chips" aria-label="Keep reading">
      {paths.map(p => <a key={p} href={p}>{getPage(p).name} &rarr;</a>)}
    </nav>
  );
}
