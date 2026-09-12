import CohesiveGuideCta from "@/components/guides/CohesiveGuideCta";
import VendorComparison from "@/components/guides/VendorComparison";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StartupQuoteForm from "@/components/guides/StartupQuoteForm";
import StartupChecklist from "@/components/guides/StartupChecklist";
import { STARTUP_STATES } from "@/lib/guides/states";
import BudgetCalculator from "@/components/guides/BudgetCalculator";
import { GuideQuoteLink, PrintGuide } from "@/components/guides/GuideActions";
import { GUIDE_UPDATED } from "@/lib/guides/restaurant";
import { getStartupGuide, getRelatedGuides, getStateGuides, STARTUP_GUIDES } from "@/lib/guides/catalog";

export const dynamicParams = false;
export function generateStaticParams() { return STARTUP_GUIDES.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getStartupGuide((await params).slug);
  if (!guide) return {};
  const title = `${guide.title} | Cohesive`;
  return { title, description: guide.description, alternates: { canonical: `/guides/${guide.slug}` }, openGraph: { title, description: guide.description, type: "article", url: `/guides/${guide.slug}`, modifiedTime: guide.updatedAt ?? GUIDE_UPDATED }, twitter: { card: "summary_large_image", title, description: guide.description } };
}

export default async function GuidePage({ params }: Props) {
  const guide = getStartupGuide((await params).slug);
  if (!guide) notFound();
  const stateGuides = getStateGuides(guide);
  const tasks = [...new Set(guide.sections.flatMap((s) => s.checklist ?? []))];
  const sources = guide.sections.flatMap((s) => [...(s.links ?? []), ...(s.comparison?.rows.map((row) => ({ label: row.name, href: row.href })) ?? [])]).filter((link, i, all) => all.findIndex((other) => other.href === link.href) === i);
  const url = `https://www.cohesiveinsure.com/guides/${guide.slug}`;
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: guide.title, description: guide.description, mainEntityOfPage: url, dateModified: guide.updatedAt ?? GUIDE_UPDATED, author: { "@type": "Organization", name: "Cohesive Insurance Services", url: "https://www.cohesiveinsure.com" }, publisher: { "@type": "Organization", name: "Cohesive Insurance Services", url: "https://www.cohesiveinsure.com" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Startup guides", item: "https://www.cohesiveinsure.com/guides" }, { "@type": "ListItem", position: 2, name: guide.title, item: url }] },
  ] };
  return <main className="guide-article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-7 text-sm text-slate-600 print:hidden"><Link href="/guides" className="text-blue-700 hover:underline">Startup guides</Link><span aria-hidden="true" className="mx-2">/</span><span>{guide.industry}{guide.stateSlug ? ` · ${STARTUP_STATES.find((s) => s.slug === guide.stateSlug)?.name}` : ""}</span></nav>
      <header className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-widest text-blue-700">{guide.category}</p><h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{guide.title}</h1><p className="mt-5 text-lg leading-8 text-slate-700">{guide.intro}</p><p className="mt-5 text-sm text-slate-500">By Cohesive Insurance Services · Updated <time dateTime={guide.updatedAt ?? GUIDE_UPDATED}>{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${guide.updatedAt ?? GUIDE_UPDATED}T00:00:00Z`))}</time></p></header>
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0 max-w-3xl">
          <nav aria-label="On this page" className="rounded-xl border border-slate-200 bg-slate-50 p-5 print:hidden"><h2 className="font-bold">On this page</h2><ul className="mt-3 space-y-2 text-sm leading-6">{guide.budget && <li><a className="text-blue-700 hover:underline" href="#budget-worksheet">Free opening-budget worksheet</a></li>}{guide.sections.map((section) => <li key={section.id}><a className="text-blue-700 hover:underline" href={`#${section.id}`}>{section.title}</a></li>)}</ul></nav>
          {guide.budget && <BudgetCalculator />}
          {guide.sections.map((section) => <section id={section.id} key={section.id} className="mt-10 scroll-mt-6"><h2 className="text-2xl font-bold leading-8">{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-8 text-slate-700">{paragraph}</p>)}{section.comparison && <VendorComparison comparison={section.comparison} />}{section.checklist && <ul className="mt-5 space-y-3 rounded-xl bg-slate-50 p-5">{section.checklist.map((item) => <li key={item} className="flex gap-3 text-sm leading-6"><span aria-hidden="true" className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-sm border border-slate-400" /><span>{item}</span></li>)}</ul>}{section.links && <ul className="mt-4 space-y-2 text-sm leading-6">{section.links.map((link) => <li key={link.href}><a href={link.href} className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-700">{link.label}{link.href.startsWith("https:") ? " ↗" : " →"}</a></li>)}</ul>}{!guide.noQuote && ["startup-vendors", "insurance-before-outreach"].includes(section.id) && <CohesiveGuideCta slug={guide.slug} industry={guide.industry ?? "Restaurants"} placement={section.id === "startup-vendors" ? "setup" : "vendor"} />}</section>)}
          {tasks.length > 0 && <StartupChecklist title={guide.title} slug={guide.slug} tasks={tasks} sources={sources} />}
          <p className="mt-10 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-500">Use this guide for planning. Confirm requirements and current fees with the agencies serving your address. Coverage depends on the policy and insurer; this guide does not confirm that a particular operation is eligible.</p>
          <div className="mt-5 print:hidden"><PrintGuide /></div>
        </article>
        <aside className="rounded-2xl border border-blue-100 bg-[#F7F9FF] p-6 lg:sticky lg:top-8 print:hidden">
          {guide.noQuote ? <><h2 className="text-xl font-bold">Plan your next step</h2><p className="mt-3 text-sm leading-6 text-slate-600">{guide.noQuoteReason}</p><a href="#startup-checklist" className="mt-4 block font-semibold text-blue-700">Use the free startup checklist →</a></> : <><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Cohesive Insurance</p><h2 className="mt-3 text-xl font-bold">Get insured before your first job.</h2><p className="mb-5 mt-3 text-sm leading-6 text-slate-600">Start with Cohesive for business insurance. Share your operations, state, start date, and any landlord or customer insurance requirements.</p><GuideQuoteLink slug={guide.slug} /><Link href={guide.insurancePath} className="mt-4 block text-sm font-semibold text-blue-700 hover:underline">Read about {guide.tradeLabel?.toLowerCase()} insurance →</Link></>}
        </aside>
      </div>
    </div>
    {getRelatedGuides(guide).length > 0 && <section aria-labelledby="related-guides" className="border-t border-slate-200 print:hidden"><div className="mx-auto max-w-6xl px-5 py-10"><h2 id="related-guides" className="text-2xl font-bold">Keep planning your business</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{getRelatedGuides(guide).map((related) => <Link key={related.slug} href={`/guides/${related.slug}`} className="rounded-xl border border-slate-200 p-4 text-sm font-semibold leading-6 text-blue-700 hover:border-blue-500">{related.title} →</Link>)}</div></div></section>}
    {stateGuides.length > 0 && <section aria-labelledby="state-guides-heading" className="border-t border-slate-200 print:hidden"><div className="mx-auto max-w-6xl px-5 py-10"><h2 id="state-guides-heading" className="text-2xl font-bold">{guide.industry} startup guides by state</h2><p className="mt-2 text-sm text-slate-600">Official resources and planning checklists for all 50 states.</p><ul className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-5">{stateGuides.map((related) => <li key={related.slug}>{related.slug === guide.slug ? <span aria-current="page" className="font-bold">{STARTUP_STATES.find((s) => s.slug === related.stateSlug)?.name}</span> : <Link href={`/guides/${related.slug}`} className="text-blue-700 hover:underline">{STARTUP_STATES.find((s) => s.slug === related.stateSlug)?.name}</Link>}</li>)}</ul></div></section>}
    {!guide.noQuote && <section id="quote" aria-labelledby="guide-quote-heading" className="scroll-mt-5 border-t border-slate-200 bg-slate-50 px-5 py-12 print:hidden"><div className="mx-auto mb-6 max-w-2xl text-center"><h2 id="guide-quote-heading" className="text-3xl font-bold">Get business insurance with Cohesive</h2><p className="mt-3 leading-7 text-slate-600">Tell Cohesive about your business and the coverage you need to get started. Include any GC, property manager, landlord, or venue requirements in your description.</p></div><StartupQuoteForm slug={guide.slug} industry={guide.industry ?? "Restaurants"} tradeLabel={guide.tradeLabel ?? "Restaurant"} initialState={guide.stateSlug} states={STARTUP_STATES.map(({slug, name}) => ({slug, name}))} /></section>}
  </main>;
}
