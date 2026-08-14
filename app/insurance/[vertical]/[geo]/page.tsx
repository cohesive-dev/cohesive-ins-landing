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
import { TRADES, getTrade } from "@/lib/seo/contractors";
import {
  CONTRACTOR_STATE_SLUGS,
  getContractorState,
  buildContractorState,
  contractorStateBuildable,
} from "@/lib/seo/contractor-states";

// State pages: /insurance/{restaurant|bar}/{state} (food) and
// /insurance/{trade}/{state} (58 trades x 48 jurisdictions, minus roofing NY/FL).
// Content is composed per-combo; unknown combos 404.

export const dynamicParams = false;

type Params = { vertical: string; geo: string };

export function generateStaticParams(): Params[] {
  const food = STATE_VERTICALS.flatMap((v) =>
    STATES.map((s) => ({ vertical: v, geo: s.slug })),
  );
  const trades = TRADES.flatMap((t) =>
    CONTRACTOR_STATE_SLUGS.filter((s) =>
      contractorStateBuildable(t.slug, s),
    ).map((s) => ({ vertical: t.slug, geo: s })),
  );
  return [...food, ...trades];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vertical, geo } = await params;
  const trade = getTrade(vertical);
  let content = null;
  if (trade) {
    const cs = getContractorState(geo);
    if (cs && contractorStateBuildable(vertical, geo))
      content = buildContractorState(cs, trade);
  } else {
    content = getStateContent(vertical, geo);
  }
  if (!content) return {};
  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `/insurance/${vertical}/${geo}` },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { vertical: verticalSlug, geo: geoSlug } = await params;

  // --- contractor trade x state page ---
  const trade = getTrade(verticalSlug);
  if (trade) {
    const cs = getContractorState(geoSlug);
    if (!cs || !contractorStateBuildable(verticalSlug, geoSlug)) notFound();
    const content = buildContractorState(cs, trade);
    const others = CONTRACTOR_STATE_SLUGS.filter(
      (s) => s !== geoSlug && contractorStateBuildable(verticalSlug, s),
    )
      .map((s) => getContractorState(s))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    return (
      <SeoPage
        content={content}
        eyebrow={`${trade.name} · ${cs.name}`}
        source={`seo-${trade.slug}-${cs.slug}`}
        areaServed={cs.name}
        formMode="contractor"
        tradeLabel={trade.name}
        costHeading={`What ${trade.noun} insurance costs in ${cs.name}`}
        coverageHeading={`The coverage a ${cs.abbr} ${trade.noun} needs`}
        stateFactsHeading={`What's different about ${cs.name}`}
        stateLinksHeading={`${trade.name} insurance in other states`}
        stateLinks={others.map((s) => ({
          label: s.name,
          href: `/insurance/${trade.slug}/${s.slug}`,
        }))}
      />
    );
  }

  // --- food vertical x state page ---
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
