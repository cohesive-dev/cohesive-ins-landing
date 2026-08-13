import RestaurantIntakeForm from "@/components/RestaurantIntakeForm";
import type { PageContent } from "@/lib/seo/data";

// Shared layout for the /insurance SEO pages (state pages + national vertical
// pages). Server component; the only client island is the intake form.

export default function SeoPage({
  content,
  eyebrow,
  source,
  areaServed,
  formMode,
  costHeading,
  coverageHeading,
  stateFactsHeading,
  stateLinks,
  stateLinksHeading,
}: {
  content: PageContent;
  eyebrow: string;
  source: string;
  areaServed: string;
  formMode: "restaurant" | "bar";
  costHeading: string;
  coverageHeading: string;
  stateFactsHeading?: string;
  stateLinks?: { label: string; href: string }[];
  stateLinksHeading?: string;
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const agencyJsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: "Cohesive Insurance Services",
    url: "https://www.cohesiveinsure.com",
    areaServed,
  };

  const quoteCta = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <a
        href="#quote"
        className="inline-block text-center px-8 py-4 rounded-md bg-[#2040E7] text-white text-lg font-bold hover:bg-[#1A33B9] transition-colors"
      >
        Get my quote →
      </a>
      <p className="text-sm text-[#6B6D71]">
        Prefer to talk? Call{" "}
        <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">
          (929) 594-5450
        </a>
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agencyJsonLd) }}
      />

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

      {/* Hero - deliberately compact: the cost content is the point of the
          page, so it should be visible without scrolling. */}
      <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 lg:py-7">
          <div className="text-[11px] font-bold text-[#2040E7] tracking-[0.08em] uppercase mb-1.5">
            {eyebrow}
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#131517] leading-tight mb-2 max-w-3xl">
            {content.heroH1}
          </h1>
          <p className="text-sm lg:text-base text-[#6B6D71] leading-relaxed max-w-2xl mb-1">
            {content.heroSub}
          </p>
          {content.alsoCovers && (
            <p className="text-xs text-[#6B6D71] max-w-2xl mb-4">
              {content.alsoCovers}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <a
              href="#quote"
              className="inline-block text-center px-6 py-2.5 rounded-md bg-[#2040E7] text-white text-base font-bold hover:bg-[#1A33B9] transition-colors"
            >
              Get my quote →
            </a>
            <p className="text-sm text-[#6B6D71]">
              Prefer to talk? Call{" "}
              <a
                href="tel:+19295945450"
                className="font-semibold text-[#2040E7]"
              >
                (929) 594-5450
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Cost */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-[#131517] mb-4">
          {costHeading}
        </h2>
        <div className="max-w-3xl space-y-4 mb-8">
          {content.costNarrative.map((p) => (
            <p
              key={p.slice(0, 40)}
              className="text-[15px] text-[#27455C] leading-relaxed"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 mb-3">
          <table className="w-full text-left text-sm min-w-[560px]">
            <thead>
              <tr className="bg-slate-50 text-[#27455C]">
                <th className="px-4 py-3 font-bold">Coverage</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">
                  Typical cost
                </th>
                <th className="px-4 py-3 font-bold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {content.costRows.map((row) => (
                <tr key={row.coverage} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-semibold text-[#131517]">
                    {row.coverage}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#2040E7] font-bold">
                    {row.range}
                  </td>
                  <td className="px-4 py-3 text-[#6B6D71]">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#6B6D71] max-w-3xl">
          Figures are estimates from published small-business premium medians
          and quotes we&apos;ve run for similar businesses. Your premium depends
          on your operations. This is not a quote or an offer of insurance.
        </p>

        <h3 className="text-lg font-extrabold text-[#131517] mt-10 mb-3">
          What moves your price
        </h3>
        <ul className="max-w-3xl space-y-2">
          {content.priceDrivers.map((d) => (
            <li key={d} className="flex gap-2.5 text-[15px] text-[#27455C]">
              <span className="text-[#2040E7] font-bold shrink-0">✓</span>
              {d}
            </li>
          ))}
        </ul>
      </section>

      {/* Coverages */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#131517] mb-6">
            {coverageHeading}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.coverages.map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="font-bold text-[#131517] mb-1.5">{c.name}</div>
                <p className="text-sm text-[#6B6D71] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State facts */}
      {content.stateFacts.length > 0 && stateFactsHeading && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#131517] mb-6">
            {stateFactsHeading}
          </h2>
          <div className="max-w-3xl space-y-7">
            {content.stateFacts.map((f) => (
              <div key={f.title}>
                <h3 className="text-lg font-extrabold text-[#131517] mb-1.5">
                  {f.title}
                </h3>
                <p className="text-[15px] text-[#27455C] leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">{quoteCta}</div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#131517] mb-6">
            Frequently asked questions
          </h2>
          <div className="max-w-3xl space-y-6">
            {content.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold text-[#131517] mb-1.5">{f.q}</h3>
                <p className="text-[15px] text-[#27455C] leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form — the same deep intake as /restaurant */}
      <section
        id="quote"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14 scroll-mt-6"
      >
        <div className="max-w-2xl mx-auto mb-2 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#131517] mb-2">
            Get your quote
          </h2>
          <p className="text-sm text-[#6B6D71]">
            No spam, no obligation. We know you&apos;re busy - we can get you a
            quote without needing hours of your time.
          </p>
        </div>
        <RestaurantIntakeForm embedded source={source} mode={formMode} />
      </section>

      {/* Cross-links */}
      {stateLinks && stateLinks.length > 0 && (
        <section className="border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <h2 className="text-sm font-bold text-[#27455C] uppercase tracking-wide mb-3">
              {stateLinksHeading ?? "More states"}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
              {stateLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[#2040E7] hover:underline"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-[#6B6D71] flex flex-wrap gap-x-4 gap-y-1">
          <span>Cohesive Insurance Services - licensed insurance agency</span>
          <a href="/insurance" className="hover:underline">
            Insurance guides
          </a>
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
