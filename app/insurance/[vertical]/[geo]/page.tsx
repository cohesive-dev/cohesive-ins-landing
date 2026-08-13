import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import {
  STATES,
  STATE_VERTICALS,
  getState,
  getStateContent,
  getVertical,
} from "@/lib/seo/data";

// State pages: /insurance/{restaurant|bar}/{state} for all 24 licensed states.
// Content is composed per-combo in lib/seo/data.ts; unknown combos 404.

export const dynamicParams = false;

type Params = { vertical: string; geo: string };

export function generateStaticParams(): Params[] {
  return STATE_VERTICALS.flatMap((v) =>
    STATES.map((s) => ({ vertical: v, geo: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vertical, geo } = await params;
  const content = getStateContent(vertical, geo);
  if (!content) return {};
  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `/insurance/${vertical}/${geo}` },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { vertical: verticalSlug, geo: geoSlug } = await params;
  const content = getStateContent(verticalSlug, geoSlug);
  const vertical = getVertical(verticalSlug);
  const state = getState(geoSlug);
  if (!content || !vertical || !state) notFound();

  return (
    <SeoPage
      content={content}
      eyebrow={`${vertical.name} · ${state.name}`}
      source={`seo-${vertical.slug}-${state.slug}`}
      areaServed={state.name}
      formMode={vertical.slug === "bar" ? "bar" : "restaurant"}
      costHeading={`What ${vertical.noun} insurance costs in ${state.name}`}
      coverageHeading={`The coverage a ${state.abbr} ${vertical.noun} needs`}
      stateFactsHeading={`What's different about ${state.name}`}
      stateLinksHeading={`${vertical.name} insurance in other states`}
      stateLinks={STATES.filter((s) => s.slug !== state.slug).map((s) => ({
        label: s.name,
        href: `/insurance/${vertical.slug}/${s.slug}`,
      }))}
    />
  );
}
