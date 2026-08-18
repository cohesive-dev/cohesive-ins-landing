import type { Metadata } from "next";

// /about — the branded-search trust page. When a lead googles us before
// submitting, this is the page that should convince them we're a real,
// verifiable, licensed brokerage. Every license number here is a public
// record checkable on NIPR, which is the point: we win branded trust on
// verifiability, not copy. NOTE: an unrelated life/annuity firm in Orange, CA
// also operates as "Cohesive Insurance Services" - this page anchors OUR
// identity (commercial P&C, NY-based, cohesiveinsure.com) against that.

export const metadata: Metadata = {
  title: "About & Licensing - Cohesive Insurance",
  description:
    "Cohesive Insurance is a New York-based commercial insurance brokerage licensed in 24 states. Verify our licenses: NY broker BR-1983645, NPN 22277482.",
  alternates: { canonical: "/about" },
};

const KEY_LICENSES = [
  { holder: "Kevin Zhang", state: "New York (resident)", type: "P&C Broker", num: "BR-1983645" },
  { holder: "Cohesive, Inc. (agency)", state: "New York", type: "Entity P&C Broker", num: "BR-1983647" },
  { holder: "Nam Nguyen", state: "New York (resident)", type: "P&C Broker", num: "BR-1983937" },
  { holder: "Kevin Zhang", state: "Texas", type: "General Lines Agent, P&C", num: "3522662" },
  { holder: "Kevin Zhang", state: "North Carolina", type: "Producer, P&C", num: "22277482" },
  { holder: "Kevin Zhang", state: "South Carolina", type: "Non-resident Producer, P&C", num: "22277482" },
  { holder: "Kevin Zhang", state: "Pennsylvania", type: "Non-resident Producer, P&C", num: "1327142" },
];

const STATES_SERVED =
  "Alabama, Arizona, Arkansas, Colorado, Florida, Georgia, Illinois, Indiana, Kentucky, Louisiana, Maryland, Minnesota, Missouri, Nevada, New Jersey, New York, North Carolina, Ohio, Pennsylvania, South Carolina, Tennessee, Texas, Virginia, Wisconsin";

const agencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "Cohesive Insurance",
  url: "https://www.cohesiveinsure.com",
  telephone: "+1-929-594-5450",
  email: "quotes@cohesiveinsure.com",
  areaServed: STATES_SERVED.split(", "),
  founder: { "@type": "Person", name: "Kevin Zhang" },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "NPN",
    value: "22277482",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
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

      <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#131517] mb-2">
            About Cohesive Insurance
          </h1>
          <p className="text-sm lg:text-base text-[#6B6D71] max-w-2xl">
            A New York-based commercial insurance brokerage for restaurants,
            bars, food businesses, churches, and small commercial risks.
            Licensed in 24 states. Every license below is a public record you
            can verify yourself.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <div className="max-w-3xl space-y-4 mb-10">
          <p className="text-[15px] text-[#27455C] leading-relaxed">
            We do one thing: place property and casualty coverage for small
            businesses, fast. Most of our clients are restaurant, bar, and food
            business owners who need a real quote and a certificate of
            insurance without a week of phone tag. We quote through multiple
            standard and specialty carriers, compare them, and tell you plainly
            which one we'd pick and why.
          </p>
          <p className="text-[15px] text-[#27455C] leading-relaxed">
            Cohesive Insurance is operated by Cohesive, Inc., a licensed New
            York insurance brokerage (entity license BR-1983647). We are not
            affiliated with any similarly named life insurance or annuity firm.
          </p>
        </div>

        <h2 className="text-xl lg:text-2xl font-extrabold text-[#131517] mb-3">
          Our licenses
        </h2>
        <p className="text-sm text-[#6B6D71] max-w-3xl mb-4">
          Verify any of these at{" "}
          <a
            href="https://nipr.com/help/look-up-your-license"
            target="_blank"
            rel="noopener"
            className="text-[#2040E7] underline"
          >
            NIPR
          </a>{" "}
          (national producer lookup) or your state insurance department. Our
          national producer number (NPN) is <strong>22277482</strong> - it
          finds us in any state's system.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200 mb-4">
          <table className="w-full text-left text-sm min-w-[560px]">
            <thead>
              <tr className="bg-slate-50 text-[#27455C]">
                <th className="px-4 py-3 font-bold">License holder</th>
                <th className="px-4 py-3 font-bold">State</th>
                <th className="px-4 py-3 font-bold">Type</th>
                <th className="px-4 py-3 font-bold">License #</th>
              </tr>
            </thead>
            <tbody>
              {KEY_LICENSES.map((l) => (
                <tr key={l.state + l.num + l.holder} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-semibold text-[#131517]">{l.holder}</td>
                  <td className="px-4 py-3 text-[#27455C]">{l.state}</td>
                  <td className="px-4 py-3 text-[#6B6D71]">{l.type}</td>
                  <td className="px-4 py-3 font-mono text-[#2040E7]">{l.num}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[#6B6D71] max-w-3xl mb-10">
          Full licensed footprint across our producers: {STATES_SERVED}. For
          states not listed in the table, look us up by NPN 22277482.
        </p>

        <h2 className="text-xl lg:text-2xl font-extrabold text-[#131517] mb-3">
          Talk to us
        </h2>
        <p className="text-[15px] text-[#27455C] leading-relaxed max-w-3xl mb-6">
          Call or text{" "}
          <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">
            (929) 594-5450
          </a>{" "}
          or email{" "}
          <a
            href="mailto:quotes@cohesiveinsure.com"
            className="font-semibold text-[#2040E7]"
          >
            quotes@cohesiveinsure.com
          </a>
          . If you want to see what coverage should cost before you reach out,
          our{" "}
          <a href="/insurance" className="text-[#2040E7] underline">
            insurance guides
          </a>{" "}
          publish the real ranges by industry and state.
        </p>
        <a
          href="/#quote"
          className="inline-block text-center px-6 py-2.5 rounded-md bg-[#2040E7] text-white text-base font-bold hover:bg-[#1A33B9] transition-colors"
        >
          Get a quote →
        </a>
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-[#6B6D71] flex flex-wrap gap-x-4 gap-y-1">
          <span>Cohesive Insurance - licensed insurance brokerage</span>
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
