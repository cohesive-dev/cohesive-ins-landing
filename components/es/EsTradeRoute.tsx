import type { Metadata } from "next";
import SpanishTradePage from "@/components/es/SpanishTradePage";
import SpanishContractorForm from "@/components/es/SpanishContractorForm";
import type { EsTradeContent } from "@/lib/es/contractor-content";
import { ES_CONTRACTOR_HUB, ES_CONTRACTOR_PAGES, ES_RESTAURANT_PAGES, ES_PAGES, esAlternates } from "@/lib/es/pages";

export function esMetadata(path: string, title: string, description: string, ogTitle: string, ogDescription = description): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: esAlternates(path),
    openGraph: {
      type: "website",
      locale: "es_US",
      siteName: "Cohesive Insurance",
      url: path,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Cohesive Insurance" }],
    },
  };
}

export function esTradeMetadata(c: EsTradeContent): Metadata {
  return esMetadata(c.path, c.metaTitle, c.metaDescription, c.ogTitle, c.ogDescription);
}

/** The other Spanish pages, hub first, for the "Más páginas en español" links. */
export function esRelated(path: string) {
  return [ES_CONTRACTOR_HUB, ...ES_CONTRACTOR_PAGES, ...ES_RESTAURANT_PAGES]
    .filter((p) => p.path !== path)
    .map((p) => ({ label: p.name, href: p.path }));
}

export default function EsTradeRoute({ content: c }: { content: EsTradeContent }) {
  return (
    <SpanishTradePage
      englishHref={ES_PAGES.find((p) => p.path === c.path)?.english}
      h1={c.h1}
      intro={c.intro}
      alsoFor={c.alsoFor}
      priceHeading={c.priceHeading}
      prices={c.prices}
      priceNote={c.priceNote}
      formIntro={c.formIntro}
      form={<SpanishContractorForm {...c.form} />}
      sections={c.sections}
      factors={c.factors}
      coveragesHeading={c.coveragesHeading}
      coverages={c.coverages}
      faqs={c.faqs}
      related={esRelated(c.path)}
    />
  );
}
