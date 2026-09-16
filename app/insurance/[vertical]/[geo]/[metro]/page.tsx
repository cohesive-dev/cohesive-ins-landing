import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import { METRO_PAGES, getMetroPage } from "@/lib/seo/metro-pages";
import { getTrade } from "@/lib/seo/contractors";
import { contractorStateBuildable } from "@/lib/seo/contractor-states";

export const dynamicParams = false;
type Params = { vertical: string; geo: string; metro: string };
export function generateStaticParams({ params = {} }: { params?: Partial<Params> } = {}): Params[] {
  return METRO_PAGES.filter(p => contractorStateBuildable(p.trade, p.state) &&
    (!params.vertical || p.trade === params.vertical) && (!params.geo || p.state === params.geo))
    .map(p => ({ vertical: p.trade, geo: p.state, metro: p.city }));
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { vertical, geo, metro } = await params;
  const p = getMetroPage(vertical, geo, metro);
  if (!p || !contractorStateBuildable(vertical, geo)) return {};
  return { title: p.content.title, description: p.content.metaDescription, alternates: { canonical: p.path } };
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const { vertical, geo, metro } = await params;
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
