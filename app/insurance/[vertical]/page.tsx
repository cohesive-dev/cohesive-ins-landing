import { INSURANCE_SERVICES, getInsuranceService, serviceContent, serviceStateLinks } from "@/lib/seo/service-industries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import {
  STATES,
  STATE_VERTICALS,
  VERTICALS,
  getNationalContent,
  getVertical,
} from "@/lib/seo/data";
import {
  TRADES,
  getTrade,
  getContractorNationalContent,
} from "@/lib/seo/contractors";
import {
  CONTRACTOR_STATE_SLUGS,
  getContractorState,
  contractorStateBuildable,
} from "@/lib/seo/contractor-states";

// National pages: /insurance/{restaurant|bar|food-truck|...} (food verticals)
// and /insurance/{electrician|plumber|roofer|...} (58 contractor trades).
// Restaurant/bar/trades also act as hubs linking their state pages.

export const dynamicParams = false;

type Params = { vertical: string };

export function generateStaticParams(): Params[] {
  return [
    ...VERTICALS.map((v) => ({ vertical: v.slug })),
    ...TRADES.map((t) => ({ vertical: t.slug })),
    ...INSURANCE_SERVICES.map((s) => ({ vertical: s.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vertical } = await params;
  const content =
    serviceContent(vertical) ?? getNationalContent(vertical) ?? getContractorNationalContent(vertical);
  if (!content) return {};
  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `/insurance/${vertical}` },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { vertical: slug } = await params;

  const service = getInsuranceService(slug);
  if (service) {
    const content = serviceContent(slug)!;
    return <SeoPage content={content} eyebrow={service.name} source={`seo-${slug}-national`}
      areaServed="United States" formMode="contractor" tradeSlug={slug}
      tradeLabel={service.intakeLabel} operationsPrompt={service.operationsPrompt}
      costHeading={`What ${service.noun} insurance costs`} coverageHeading="Coverage questions to review"
      stateFactsHeading="Resources and operations to check" stateLinksHeading="Choose your state"
      stateLinks={serviceStateLinks(service)} />;
  }

  // --- contractor trade national page ---
  const trade = getTrade(slug);
  if (trade) {
    const content = getContractorNationalContent(slug);
    if (!content) notFound();
    const states = CONTRACTOR_STATE_SLUGS.filter((s) =>
      contractorStateBuildable(slug, s),
    )
      .map((s) => getContractorState(s))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    return (
      <SeoPage
        content={content}
        eyebrow={trade.name}
        source={`seo-${trade.slug}-national`}
        areaServed="United States"
        formMode="contractor"
        tradeLabel={trade.intakeLabel ?? trade.name}
        tradeSlug={trade.slug}
        costHeading={`What ${trade.noun} insurance costs`}
        coverageHeading={`The coverage ${trade.noun}s need`}
        stateLinksHeading={`${trade.name} insurance by state`}
        stateLinks={states.map((s) => ({
          label: s.name,
          href: `/insurance/${trade.slug}/${s.slug}`,
        }))}
      />
    );
  }

  // --- food vertical national page ---
  const content = getNationalContent(slug);
  const vertical = getVertical(slug);
  if (!content || !vertical) notFound();

  const hasStates = STATE_VERTICALS.includes(vertical.slug);

  return (
    <SeoPage
      content={content}
      eyebrow={vertical.name}
      source={`seo-${vertical.slug}-national`}
      areaServed="United States"
      formMode={vertical.slug === "bar" ? "bar" : "restaurant"}
      costHeading={`What ${vertical.noun} insurance costs`}
      coverageHeading={`The coverage a ${vertical.noun} needs`}
      stateLinksHeading={`${vertical.name} insurance by state`}
      stateLinks={
        hasStates
          ? STATES.map((s) => ({
              label: s.name,
              href: `/insurance/${vertical.slug}/${s.slug}`,
            }))
          : VERTICALS.filter((v) => v.slug !== vertical.slug).map((v) => ({
              label: `${v.name} insurance`,
              href: `/insurance/${v.slug}`,
            }))
      }
    />
  );
}
