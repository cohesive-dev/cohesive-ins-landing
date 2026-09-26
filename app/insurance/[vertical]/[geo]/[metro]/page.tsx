import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import { METRO_PAGES, getMetroPage } from "@/lib/seo/metro-pages";
import { getTrade } from "@/lib/seo/contractors";
import { contractorStateBuildable } from "@/lib/seo/contractor-states";
import { RESTAURANT_CITY_TYPES, RESTAURANT_CITIES, buildRestaurantTypeCity, getRestaurantCityType, restaurantTypeCityLinks } from "@/lib/seo/restaurant-types";
import { getRestaurantCity, withArticle } from "@/lib/seo/restaurant-cities";

export const dynamicParams = false;
type Params = { vertical: string; geo: string; metro: string };
export function generateStaticParams({ params = {} }: { params: Partial<Params> }): Params[] {
  const trades = METRO_PAGES.filter(p => contractorStateBuildable(p.trade, p.state) &&
    (!params.vertical || p.trade === params.vertical) && (!params.geo || p.state === params.geo))
    .map(p => ({ vertical: p.trade, geo: p.state, metro: p.city }));
  // Restaurant city pages (Kevin 2026-09-26): every concept x 40 researched cities.
  const restaurants = RESTAURANT_CITY_TYPES.filter(t => !params.vertical || t.slug === params.vertical)
    .flatMap(t => RESTAURANT_CITIES.filter(c => !params.geo || c.stateSlug === params.geo)
      .map(c => ({ vertical: t.slug, geo: c.stateSlug, metro: c.slug })));
  return [...trades, ...restaurants];
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { vertical, geo, metro } = await params;
  const rType = getRestaurantCityType(vertical), rCity = getRestaurantCity(geo, metro);
  if (rType && rCity) {
    const c = buildRestaurantTypeCity(rType, rCity);
    return c ? { title: c.title, description: c.metaDescription, alternates: { canonical: `/insurance/${vertical}/${geo}/${metro}` } } : {};
  }
  const p = getMetroPage(vertical, geo, metro);
  if (!p || !contractorStateBuildable(vertical, geo)) return {};
  return { title: p.content.title, description: p.content.metaDescription, alternates: { canonical: p.path } };
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const { vertical, geo, metro } = await params;
  const rType = getRestaurantCityType(vertical), rCity = getRestaurantCity(geo, metro);
  if (rType && rCity) {
    const content = buildRestaurantTypeCity(rType, rCity);
    if (!content) notFound();
    return <SeoPage content={content} eyebrow={`${rType.name} · ${rCity.name}, ${rCity.stateName}`}
      source={`seo-${rType.slug}-${rCity.stateSlug}-${rCity.slug}`} areaServed={`${rCity.name}, ${rCity.stateName}`}
      formMode="restaurant" costHeading={`What ${rType.noun} insurance costs in ${rCity.name}`}
      coverageHeading={`The coverage ${withArticle(rCity.name)} ${rType.noun} needs`}
      stateFactsHeading={`What to check in ${rCity.name}`}
      breadcrumbs={[{ label: "Insurance guides", href: "/insurance" },
        { label: `${rType.name} insurance in ${rCity.stateName}`, href: `/insurance/${rType.slug}/${rCity.stateSlug}` }]}
      stateLinksHeading={`${rType.name} insurance nearby`}
      stateLinks={[
        { label: `${rType.name} insurance in ${rCity.stateName}`, href: `/insurance/${rType.slug}/${rCity.stateSlug}` },
        ...restaurantTypeCityLinks(rType, rCity.stateSlug, rCity.slug),
        { label: `National ${rType.name.toLowerCase()} insurance guide`, href: rType.stateOnly || rType.slug === "restaurant" ? `/insurance/${rType.slug}` : `/insurance/${rType.slug}` },
      ]} />;
  }
  const p = getMetroPage(vertical, geo, metro), trade = getTrade(vertical);
  if (!p || !trade || !contractorStateBuildable(vertical, geo)) notFound();
  return <SeoPage content={p.content} eyebrow={`${p.cityName}, ${p.stateName}`}
    source={p.source} areaServed={`${p.cityName}, ${p.stateName}`} formMode="contractor"
    tradeLabel={trade.intakeLabel ?? trade.name} tradeSlug={p.trade} stateSlug={p.state} metroSlug={p.city}
    operationsPrompt={p.operationsPrompt} costHeading={`Comparing ${p.cityName} insurance quotes`}
    coverageHeading="Coverage questions for your work" stateFactsHeading={`Local job and contract checks in ${p.cityName}`}
    resourceScopeLabel="Local resources checked"
    breadcrumbs={[{ label: "Insurance guides", href: "/insurance" }, { label: `${p.stateName} ${p.label}`, href: p.parentPath }]}
    stateLinksHeading="Continue your coverage review" stateLinks={[
      { label: `${p.stateName} ${p.label}`, href: p.parentPath },
      { label: `National ${p.label} guide`, href: `/insurance/${p.trade}` },
    ]} />;
}
