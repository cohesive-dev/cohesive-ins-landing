import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";
import { COMMERCIAL_PROPERTY_CONTENT } from "@/lib/seo/commercial-property-content";

export const metadata: Metadata = {
  title: COMMERCIAL_PROPERTY_CONTENT.title,
  description: COMMERCIAL_PROPERTY_CONTENT.metaDescription,
  alternates: { canonical: "/insurance/commercial-property" },
};

export default function Page() {
  return (
    <SeoPage
      content={COMMERCIAL_PROPERTY_CONTENT}
      eyebrow="For commercial building owners"
      source="seo-commercial-property-national"
      areaServed="United States"
      formMode="property"
      costHeading="How a commercial property quote is built"
      coverageHeading="What to compare on a building policy"
      stateFactsHeading="Prepare a stronger property submission"
      resourceScopeLabel="Coverage resources checked"
    />
  );
}
