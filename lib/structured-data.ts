import { BASE_URL, getPage, pageHeadline } from "@/lib/pages";
import { SITE } from "@/site.config";

const ORG = { "@type": "Organization", name: SITE.name, url: `${BASE_URL}/` };
const LOGO = `${BASE_URL}/logo.png`;
const IMAGE = `${BASE_URL}/og-default.png`;

export function homeJsonLd(): object[] {
  const home = getPage("/");
  return [
    { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: `${BASE_URL}/`, description: home.description },
    { "@context": "https://schema.org", ...ORG, logo: LOGO },
  ];
}

export function breadcrumbJsonLd(path: string): object {
  const page = getPage(path);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: page.name, item: `${BASE_URL}${path}` },
    ],
  };
}

export function articleJsonLd(path: string): object[] {
  const page = getPage(path);
  const url = `${BASE_URL}${path}`;
  return [
    breadcrumbJsonLd(path),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: pageHeadline(path),
      description: page.description,
      dateModified: page.updated,
      image: IMAGE,
      mainEntityOfPage: url,
      author: ORG,
      publisher: { ...ORG, logo: { "@type": "ImageObject", url: LOGO } },
    },
  ];
}
