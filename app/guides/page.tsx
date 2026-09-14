import type { Metadata } from "next";
import Link from "next/link";
import { STARTUP_GUIDES, NATIONAL_STARTUP_GUIDES } from "@/lib/guides/catalog";
import { STARTUP_STATES } from "@/lib/guides/states";
import GuideFinder from "@/components/guides/GuideFinder";

const title = "Business startup guides | Cohesive Insurance";
const description = "Start a restaurant, janitorial, pool construction, roofing, tree service, or remodeling business. Explore startup guides and official resources for all 50 states.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/guides" }, openGraph: { title, description, url: "/guides" }, twitter: { card: "summary_large_image", title, description } };

export default function GuidesIndex() {
  return <main>
    <section className="border-b border-blue-100 bg-[#F7F9FF] px-5 py-14 sm:py-20"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-widest text-blue-700">From the first idea to the first customer</p><h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">How to start a business and find your first customers.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Practical startup guides to help you choose your services, budget, navigate approvals, get insured, and build a customer pipeline.</p></div></section>
    <section aria-labelledby="contractor-launch" className="mx-auto max-w-6xl px-5 pt-10"><h2 id="contractor-launch" className="text-2xl font-bold">Start a pool construction or tree service business</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600">Work through startup costs, insurance, and a first-customer plan. For eligible businesses, Cohesive AI outreach is free with insurance from Cohesive Insurance. Leads and jobs are not guaranteed.</p><div className="mt-5 flex flex-wrap gap-4"><Link className="rounded-lg border border-blue-200 px-5 py-3 font-semibold text-blue-700" href="/guides/how-to-start-a-pool-construction-business">Pool construction startup guide →</Link><Link className="rounded-lg border border-blue-200 px-5 py-3 font-semibold text-blue-700" href="/guides/how-to-start-a-tree-service-business">Tree service startup guide →</Link></div></section>
    <section aria-labelledby="restaurant-guides" className="mx-auto max-w-6xl px-5 py-12"><h2 id="restaurant-guides" className="text-2xl font-bold">Choose your business</h2><p className="mt-2 max-w-2xl leading-7 text-slate-600">Start with the launch sequence, then work through the decisions that apply to your space and operation.</p><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{NATIONAL_STARTUP_GUIDES.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group rounded-2xl border border-slate-200 p-6 transition-colors hover:border-blue-500"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{guide.category}</p><h3 className="mt-3 text-xl font-bold leading-7 group-hover:text-blue-700">{guide.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{guide.description}</p><span className="mt-5 block text-sm font-semibold text-blue-700">Read guide →</span></Link>)}</div></section>
    <GuideFinder industries={NATIONAL_STARTUP_GUIDES.map((g) => g.industry!)} states={STARTUP_STATES.map(({slug, name}) => ({slug, name}))} guides={STARTUP_GUIDES.filter((g) => g.stateSlug).map((g) => ({ slug: g.slug, title: g.title, industry: g.industry!, stateSlug: g.stateSlug! }))} />
  </main>;
}
