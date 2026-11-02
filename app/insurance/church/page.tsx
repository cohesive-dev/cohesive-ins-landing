import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";
import {
  CHURCH_CONTENT,
  churchStateLinks,
} from "@/lib/seo/church-content";

export const metadata: Metadata = {
  title: CHURCH_CONTENT.title,
  description: CHURCH_CONTENT.metaDescription,
  alternates: { canonical: "/insurance/church" },
};

export default function Page() {
  return (
    <SeoPage
      content={CHURCH_CONTENT}
      eyebrow="For churches and houses of worship"
      source="seo-church-national"
      areaServed="United States"
      formMode="church"
      quoteHref="/religious?source=seo-church-national"
      costHeading="How a church insurance quote is built"
      coverageHeading="Coverage questions to compare"
      stateFactsHeading="Safety and continuity resources"
      resourceScopeLabel="Resources checked"
      stateLinksHeading="Church insurance by state"
      stateLinks={churchStateLinks()}
    />
  );
}
