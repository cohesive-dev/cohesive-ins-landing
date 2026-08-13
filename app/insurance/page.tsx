import type { Metadata } from "next";
import { STATES, STATE_VERTICALS, VERTICALS, getVertical } from "@/lib/seo/data";

// /insurance — index hub for the SEO pages. Links every vertical page and
// every state page so crawlers have a full path to all of them.

export const metadata: Metadata = {
  title: "Business Insurance Guides by Industry & State",
  description:
    "What food and beverage business insurance costs by industry and state - restaurants, bars, food trucks, caterers, and bakeries. Licensed in 24 states.",
  alternates: { canonical: "/insurance" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <a href="/">
            <img
              src="/logo-long.png"
              alt="Cohesive"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>
        </div>
      </header>

      <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#131517] leading-tight mb-4 max-w-3xl">
            Insurance guides by industry and state
          </h1>
          <p className="text-base lg:text-lg text-[#6B6D71] leading-relaxed max-w-2xl">
            What coverage costs, what your state requires, and how to get a
            quote. Written by a licensed agency that quotes these businesses
            every week.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <h2 className="text-2xl font-extrabold text-[#131517] mb-6">
          By industry
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
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
