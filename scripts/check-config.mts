// Fails while any of the template's placeholders are left. npm run deploy runs it first, so a copy of
// _basics can't go live as example.com with a fake Analytics ID.
import { existsSync, readFileSync } from "node:fs";
import { SITE } from "../site.config.ts";

const read = (f: string) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const host = new URL(SITE.url).hostname;
const wrangler = read("wrangler.jsonc");
const pages = read("lib/pages.ts");
const problems: string[] = [];

if (host === "example.com") problems.push("site.config.ts: url is still https://example.com");
if (SITE.name.startsWith("Example")) problems.push("site.config.ts: name is still the template's");
if (/X{4}/.test(SITE.gaId)) problems.push("site.config.ts: gaId is still G-XXXXXXXXXX");
if (/"name": "basics-template"/.test(wrangler)) problems.push("wrangler.jsonc: name is still basics-template");
if (!wrangler.includes(`"pattern": "${host}"`)) problems.push(`wrangler.jsonc: routes should attach ${host}`);
if (JSON.parse(read("package.json")).name === "basics-template") problems.push("package.json: name is still basics-template");
if (/Example Basics|Replace this/.test(pages + read("app/page.tsx"))) problems.push("lib/pages.ts or app/page.tsx: the homepage still has the template's copy");
for (const sample of ["/example-guide", "/another-example"])
  if (pages.includes(`"${sample}"`) || existsSync(new URL(`../app/(deeper)${sample}`, import.meta.url)))
    problems.push(`${sample}: delete the sample guide (its folder, lib/pages.ts entry, TARGET_WORDS entry and chips)`);

if (problems.length) {
  console.error(`Not ready to deploy:\n${problems.map(p => `  - ${p}`).join("\n")}`);
  process.exit(1);
}
console.log(`Config looks ready for ${host}.`);
