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

// National vertical pages: /insurance/{restaurant|bar|food-truck|catering|bakery}.
// Restaurant and bar also act as hubs linking their 24 state pages.

export const dynamicParams = false;

type Params = { vertical: string };

export function generateStaticParams(): Params[] {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vertical } = await params;
  const content = getNationalContent(vertical);
  if (!content) return {};
  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `/insurance/${vertical}` },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { vertical: verticalSlug } = await params;
  const content = getNationalContent(verticalSlug);
  const vertical = getVertical(verticalSlug);
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
