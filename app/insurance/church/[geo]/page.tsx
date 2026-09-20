import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import {
  CHURCH_STATES,
  buildChurchStateContent,
  churchStateLinks,
  getChurchState,
} from "@/lib/seo/church-content";

export const dynamicParams = false;

type Params = { geo: string };

export function generateStaticParams(): Params[] {
  return CHURCH_STATES.map((state) => ({ geo: state.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { geo } = await params;
  const state = getChurchState(geo);
  if (!state) return {};
  const content = buildChurchStateContent(state);
  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `/insurance/church/${state.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { geo } = await params;
  const state = getChurchState(geo);
  if (!state) notFound();
  const content = buildChurchStateContent(state);

  return (
    <SeoPage
      content={content}
      eyebrow={`Church & house of worship · ${state.name}`}
      source={`seo-church-${state.slug}`}
      areaServed={state.name}
      formMode="church"
      quoteHref={`/religious?source=seo-church-${state.slug}`}
      costHeading={`How a church insurance quote is built in ${state.name}`}
      coverageHeading={`Coverage questions for a ${state.abbr} house of worship`}
      stateFactsHeading={`What to check in ${state.name}`}
      resourceScopeLabel="State and federal resources checked"
      stateLinksHeading="Church insurance in other states"
      stateLinks={churchStateLinks(state.slug)}
      breadcrumbs={[
        { label: "Insurance guides", href: "/insurance" },
        { label: "Church insurance", href: "/insurance/church" },
      ]}
    />
  );
}
