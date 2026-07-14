"use client";

const NEXT_LINK =
  "https://track.nextinsurance.com/links?agent_affiliation=OUqiHM5BPdbYGtN6&serial=992855993&channel=affiliation";

function trackNextClick() {
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  // Standard Lead so ad campaigns can optimize on the click-through, plus a
  // named custom event so reporting can separate Next clicks from form leads.
  fbq?.("track", "Lead");
  fbq?.("trackCustom", "NextQuoteClick");
}

const COVERAGE = [
  "General liability",
  "Liquor liability",
  "Workers' compensation",
  "Commercial property",
  "Certificates of insurance",
];

export default function RestaurantsPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <a href="/">
            <img src="/logo-long.png" alt="Cohesive" className="h-9 w-auto object-contain" />
          </a>
        </div>
      </header>

      <section className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-[11px] font-bold text-[#2040E7] tracking-[0.08em] uppercase mb-3">
            For New York restaurants &amp; bars
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#131517] leading-tight mb-5">
            Restaurant insurance, in minutes.
          </h1>
          <p className="text-lg text-[#6B6D71] leading-relaxed mb-8">
            Get covered online right now, or have our team shop the market for
            you. Either way, certificates of insurance are ready when your
            landlord asks.
          </p>

          <ul className="flex flex-wrap gap-2 mb-10">
            {COVERAGE.map((c) => (
              <li
                key={c}
                className="px-4 py-2 rounded-full border border-slate-300 text-sm font-semibold text-[#27455C]"
              >
                {c}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 max-w-xl">
            <a
              href={NEXT_LINK}
              target="_blank"
              rel="noopener sponsored"
              onClick={trackNextClick}
              className="w-full text-center px-8 py-5 rounded-md bg-[#2040E7] text-white text-lg font-bold hover:bg-[#1A33B9] transition-colors"
            >
              Get an instant online quote →
            </a>
            <p className="text-sm text-[#6B6D71] text-center">
              Instant quotes provided by Next Insurance through our partner
              link. Buy online in about 10 minutes, certificate included.
            </p>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-[#6B6D71] uppercase tracking-wide">
                or
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <a
              href="/"
              className="w-full text-center px-8 py-4 rounded-md border-2 border-[#2040E7] text-[#2040E7] text-base font-bold hover:bg-[#EEF1FF] transition-colors"
            >
              Prefer a person? Get a custom quote from our team
            </a>
            <p className="text-sm text-[#6B6D71] text-center">
              We shop multiple carriers for the coverage that fits how your
              spot actually runs - and a real person picks up.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-xs text-[#6B6D71] flex flex-wrap gap-x-4 gap-y-1">
          <span>Cohesive Insurance Services - licensed New York agency</span>
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
        </div>
      </footer>
    </main>
  );
}
