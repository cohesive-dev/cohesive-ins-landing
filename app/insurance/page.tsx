import { METRO_PAGES } from "@/lib/seo/metro-pages";
import { INSURANCE_SERVICES } from "@/lib/seo/service-industries";
import Link from "next/link";
import type { Metadata } from "next";
import { STATES, STATE_VERTICALS, VERTICALS, getVertical } from "@/lib/seo/data";
import { TRADES } from "@/lib/seo/contractors";
import { OUTCOME_PRIORITY_LINKS } from "@/lib/seo/outcome-priority-links";
import { churchStateLinks } from "@/lib/seo/church-content";
import { RESTAURANT_TYPES } from "@/lib/seo/restaurant-types";

// /insurance — index hub for the SEO pages. Links every vertical page and
// every state page so crawlers have a full path to all of them.

export const metadata: Metadata = {
  title: "Business Insurance Guides by Industry, State & City",
  description:
    "What business insurance costs by trade and state - contractors, restaurants, bars, and more. Costs, licensing, and quotes from a licensed agency.",
  alternates: { canonical: "/insurance" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <Link href="/">
            <img
              src="/logo-long.png"
              alt="Cohesive"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#131517] leading-tight mb-4 max-w-3xl">
            Insurance guides by industry, state and city
          </h1>
          <p className="text-base lg:text-lg text-[#6B6D71] leading-relaxed max-w-2xl">
            What coverage costs, what your state requires, and how to get a
            quote. Written by a licensed agency that quotes these businesses
            every week.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <Link href="/guides" className="mb-10 block rounded-xl border border-blue-200 bg-blue-50 p-5 text-[#2040E7] hover:underline">
          <span className="block font-bold">Starting a business?</span>
          <span className="text-sm">Explore restaurant and service-business startup guides for all 50 states →</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#131517] mb-4">
          Popular state insurance guides
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {OUTCOME_PRIORITY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-[#2040E7] hover:border-[#2040E7] hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <h2 className="text-2xl font-extrabold text-[#131517] mb-4">Explore city insurance guides</h2>
        <div className="space-y-3 mb-12">{[...new Set(METRO_PAGES.map(p => p.trade))].map(trade => <details key={trade} className="rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer font-semibold text-[#2040E7]">{METRO_PAGES.find(p => p.trade === trade)?.label}</summary><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{METRO_PAGES.filter(p => p.trade === trade).map(p => <Link key={p.path} href={p.path} className="text-[#2040E7] underline">{p.cityName}, {p.stateName}</Link>)}</div></details>)}</div>

        <h2 className="text-2xl font-extrabold text-[#131517] mb-6">
          By industry
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <Link
            href="/insurance/church"
            className="rounded-xl border border-slate-200 p-5 hover:border-[#2040E7] transition-colors"
          >
            <div className="font-bold text-[#131517] mb-1">Church &amp; house of worship insurance</div>
            <div className="text-sm text-[#6B6D71]">For ministries, people, property, and activities</div>
          </Link>
          <Link
            href="/insurance/commercial-property"
            className="rounded-xl border border-slate-200 p-5 hover:border-[#2040E7] transition-colors"
          >
            <div className="font-bold text-[#131517] mb-1">Commercial property insurance</div>
            <div className="text-sm text-[#6B6D71]">For owners of commercial buildings</div>
          </Link>
          {VERTICALS.map((v) => (
            <a
              key={v.slug}
              href={`/insurance/${v.slug}`}
              className="rounded-xl border border-slate-200 p-5 hover:border-[#2040E7] transition-colors"
            >
              <div className="font-bold text-[#131517] mb-1">
                {v.name} insurance
              </div>
              <div className="text-sm text-[#6B6D71]">
                Costs, coverage, and quotes
              </div>
            </a>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold text-[#131517] mb-4">
          Restaurant insurance by type
        </h2>
        <p className="mb-5 max-w-3xl text-sm leading-6 text-[#6B6D71]">
          Match the guide to the actual menu, cooking equipment, service model, delivery, and alcohol exposure.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {RESTAURANT_TYPES.map((type) => (
            <Link
              key={type.slug}
              href={`/insurance/${type.slug}`}
              className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-[#2040E7] hover:border-[#2040E7] hover:underline transition-colors"
            >
              {type.name} insurance
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold text-[#131517] mb-4">
          Church insurance by state
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm mb-12">
          {churchStateLinks().map((state) => (
            <Link key={state.href} href={state.href} className="text-[#2040E7] hover:underline">
              {state.label}
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold text-[#131517] mb-4">
          Contractors &amp; trades
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm mb-12">
          {TRADES.map((t) => (
            <a
              key={t.slug}
              href={`/insurance/${t.slug}`}
              className="text-[#2040E7] hover:underline"
            >
              {t.name}
            </a>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold text-[#131517] mb-4">Cleaning and pool maintenance</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-12">{INSURANCE_SERVICES.map(service => <Link key={service.slug} href={`/insurance/${service.slug}`} className="text-[#2040E7] hover:underline">{service.name} insurance</Link>)}</div>

        {STATE_VERTICALS.map((vs) => {
          const v = getVertical(vs)!;
          return (
            <div key={vs} className="mb-10">
              <h2 className="text-2xl font-extrabold text-[#131517] mb-4">
                {v.name} insurance by state
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                {STATES.map((s) => (
                  <a
                    key={s.slug}
                    href={`/insurance/${vs}/${s.slug}`}
                    className="text-[#2040E7] hover:underline"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-[#6B6D71] flex flex-wrap gap-x-4 gap-y-1">
          <span>Cohesive Insurance Services - licensed insurance agency</span>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
          <a href="/terms" className="hover:underline">
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}
