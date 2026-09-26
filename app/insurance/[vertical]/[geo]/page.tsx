import { INSURANCE_SERVICES, getInsuranceService, serviceContent, serviceStateLinks, SERVICE_STATE_NAMES } from "@/lib/seo/service-industries";
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
import {
  RESTAURANT_TYPES,
  RESTAURANT_TYPE_STATES,
  buildRestaurantTypeState,
  getRestaurantType,
  getRestaurantTypeState,
  restaurantTypeStateLinks,
  RESTAURANT_EXTRA_STATES,
  isExtraRestaurantState,
  buildGenericRestaurantState,
  allRestaurantStateLinks,
  restaurantTypeCityLinks,
  GENERIC_RESTAURANT,
} from "@/lib/seo/restaurant-types";
import { withAbbrArticle, withArticle } from "@/lib/seo/restaurant-cities";

// State pages: /insurance/{restaurant|bar}/{state} (food) and
// /insurance/{trade}/{state} (trades x 50 jurisdictions, minus roofing NY/FL).
// Content is composed per-combo; unknown combos 404.

export const dynamicParams = false;

type Params = { vertical: string; geo: string };

export function generateStaticParams(): Params[] {
  const food = STATE_VERTICALS.flatMap((v) =>
    STATES.map((s) => ({ vertical: v, geo: s.slug })),
  );
  const trades = TRADES.flatMap((t) =>
    (t.nationalOnly ? [] : CONTRACTOR_STATE_SLUGS).filter((s) =>
      contractorStateBuildable(t.slug, s),
    ).map((s) => ({ vertical: t.slug, geo: s })),
  );
  const extraRestaurant = RESTAURANT_EXTRA_STATES.map((st) => ({ vertical: "restaurant", geo: st.slug }));
  const restaurantTypes = RESTAURANT_TYPES.flatMap((type) =>
    RESTAURANT_TYPE_STATES.map((state) => ({ vertical: type.slug, geo: state.slug })),
  );
  return [...food, ...extraRestaurant, ...restaurantTypes, ...trades, ...INSURANCE_SERVICES.flatMap(service => Object.keys(service.stateProfiles).map(geo => ({ vertical: service.slug, geo })))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vertical, geo } = await params;
  if (vertical === "restaurant" && isExtraRestaurantState(geo)) {
    const content = buildGenericRestaurantState(getRestaurantTypeState(geo)!);
    return { title: content.title, description: content.metaDescription, alternates: { canonical: `/insurance/${vertical}/${geo}` } };
  }
  const restaurantType = getRestaurantType(vertical);
  const restaurantState = getRestaurantTypeState(geo);
  if (restaurantType && restaurantState) {
    const content = buildRestaurantTypeState(restaurantType, restaurantState);
    return {
      title: content.title,
      description: content.metaDescription,
      alternates: { canonical: `/insurance/${vertical}/${geo}` },
    };
  }
  const trade = getTrade(vertical);
  let content = serviceContent(vertical, geo);
  if (!content && trade) {
    const cs = getContractorState(geo);
    if (cs && contractorStateBuildable(vertical, geo))
      content = buildContractorState(cs, trade);
  } else if (!content) {
    content = getStateContent(vertical, geo);
  }
  if (!content) return {};
  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `/insurance/${vertical}/${geo}` },
    ...(vertical === "bar" ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { vertical: verticalSlug, geo: geoSlug } = await params;

  if (verticalSlug === "restaurant" && isExtraRestaurantState(geoSlug)) {
    const st = getRestaurantTypeState(geoSlug)!;
    return (
      <SeoPage
        content={buildGenericRestaurantState(st)}
        eyebrow={`Restaurant · ${st.name}`}
        source={`seo-restaurant-${st.slug}`}
        areaServed={st.name}
        formMode="restaurant"
        costHeading={`What restaurant insurance costs in ${st.name}`}
        coverageHeading={`The coverage ${withArticle(st.name)} restaurant needs`}
        stateFactsHeading={`What to check in ${st.name}`}
        stateLinksHeading="Restaurant insurance in other states"
        stateLinks={[...restaurantTypeCityLinks(GENERIC_RESTAURANT, st.slug), ...allRestaurantStateLinks(st.slug)]}
      />
    );
  }

  const restaurantType = getRestaurantType(verticalSlug);
  if (restaurantType) {
    const state = getRestaurantTypeState(geoSlug);
    if (!state) notFound();
    const content = buildRestaurantTypeState(restaurantType, state);
    return (
      <SeoPage
        content={content}
        eyebrow={`${restaurantType.name} · ${state.name}`}
        source={`seo-${restaurantType.slug}-${state.slug}`}
        areaServed={state.name}
        formMode="restaurant"
        costHeading={`How ${withArticle(restaurantType.noun)} quote is built in ${state.name}`}
        coverageHeading={`Coverage questions for ${withArticle(state.name)} ${restaurantType.noun}`}
        stateFactsHeading={`What to check in ${state.name}`}
        resourceScopeLabel="State food resources checked"
        stateLinksHeading={`${restaurantType.name} insurance in other states`}
        stateLinks={[...restaurantTypeCityLinks(restaurantType, state.slug), ...restaurantTypeStateLinks(restaurantType, state.slug)]}
        breadcrumbs={[
          { label: "Insurance guides", href: "/insurance" },
          { label: `${restaurantType.name} insurance`, href: `/insurance/${restaurantType.slug}` },
        ]}
      />
    );
  }

  const service = getInsuranceService(verticalSlug);
  if (service) {
    const content = serviceContent(verticalSlug, geoSlug);
    if (!content) notFound();
    const stateName = SERVICE_STATE_NAMES[geoSlug];
    return <SeoPage content={content} eyebrow={`${service.name} · ${stateName}`}
      source={`seo-${verticalSlug}-${geoSlug}`} areaServed={stateName} formMode="contractor"
      tradeSlug={verticalSlug} stateSlug={geoSlug} tradeLabel={service.intakeLabel}
      operationsPrompt={service.operationsPrompt} costHeading={`Insurance costs in ${stateName}`}
      coverageHeading="Coverage questions to review" stateFactsHeading={`What to check in ${stateName}`}
      stateLinksHeading="Explore other states" stateLinks={serviceStateLinks(service).filter(l => !l.href.endsWith(`/${geoSlug}`))} />;
  }

  // --- contractor trade x state page ---
  const trade = getTrade(verticalSlug);
  if (trade) {
    if (trade.nationalOnly) notFound();
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
        tradeLabel={trade.intakeLabel ?? trade.name}
        tradeSlug={trade.slug}
        stateSlug={cs.slug}
        costHeading={`What ${trade.noun} insurance costs in ${cs.name}`}
        coverageHeading={`The coverage ${withAbbrArticle(cs.abbr)} ${trade.noun} needs`}
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
      coverageHeading={`The coverage ${withAbbrArticle(state.abbr)} ${vertical.noun} needs`}
      stateFactsHeading={`What's different about ${state.name}`}
      stateLinksHeading={`${vertical.name} insurance in other states`}
      stateLinks={vertical.slug === "restaurant"
        ? [...restaurantTypeCityLinks(GENERIC_RESTAURANT, state.slug), ...allRestaurantStateLinks(state.slug)]
        : STATES.filter((s) => s.slug !== state.slug).map((s) => ({
            label: s.name,
            href: `/insurance/${vertical.slug}/${s.slug}`,
          }))}
    />
  );
}
