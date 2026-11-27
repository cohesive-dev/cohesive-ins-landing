import type { Metadata } from "next";
import Link from "next/link";
import { ORG_REF, PERSON_REF, PRODUCER_NAME, PRODUCER_PATH, PHONE_DISPLAY, PHONE_E164, SITE_URL } from "@/lib/entity";
import { US_STATES } from "@/lib/encore-states";
import { COMMON_QUOTES, LARGE_ROOF_BINDS, PRICE_BANDS, PRICE_BINDS, PRICE_DATA_UPDATED, PRICE_STATES, PRICE_SUMMARY, type BandRow, type BindRow, type StateRow } from "@/lib/seo/roof-tree-price-data";

const SLUG = "roofing-and-tree-service-insurance-prices-2026";
const PATH = `/guides/${SLUG}`;
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Roofing and tree service insurance prices in 2026: real quotes and binds";
const DESCRIPTION = `Real 2026 general liability prices from ${PRICE_SUMMARY.roof.businesses} roofers and ${PRICE_SUMMARY.tree.businesses} tree services we quoted: roofing $1,895.09 a year occurrence, tree service $1,371.18 claims-made, $1M/$2M. By state, revenue and policy type.`;

export const metadata: Metadata = {
  title: "Roofing & Tree Service Insurance Prices 2026: Real Data | Cohesive",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: PATH, modifiedTime: PRICE_DATA_UPDATED },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const usd = (n: number | null) => n === null ? "-" : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const monthly = (n: number) => usd(Math.round((n / 12) * 100) / 100);
const longDate = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
const shortDate = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
const median = (v: number[]) => { const s = [...v].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round(((s[m - 1] + s[m]) / 2) * 100) / 100; };
const bindsOf = (trade: BindRow["trade"], form: BindRow["form"]) => PRICE_BINDS.filter((b) => b.trade === trade && b.form === form);

const th = "border-b border-slate-300 bg-slate-50 px-3 py-2 text-left text-sm font-bold";
const td = "border-b border-slate-200 px-3 py-2 text-sm";

function Table({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[480px] border-collapse"><caption className="mb-2 text-left text-sm text-slate-600">{caption}</caption><thead><tr>{head.map((h) => <th key={h} scope="col" className={th}>{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j} scope="row" className={`${td} text-left font-semibold`}>{c}</th> : <td key={j} className={td}>{c}</td>)}</tr>)}</tbody></table></div>;
}

const bandRows = (rows: BandRow[]) => rows.map((r) => [r.band, `${usd(r.occMedian)} (${r.occN})`, usd(r.occLow), `${usd(r.cmMedian)} (${r.cmN})`, usd(r.cmLow)]);
const stateRows = (rows: StateRow[]) => rows.map((r) => [r.name, r.businesses, usd(r.occLow), usd(r.cmLow)]);
const BAND_HEAD = ["Gross receipts rated", "Occurrence median (quotes)", "Occurrence lowest", "Claims-made median (quotes)", "Claims-made lowest"];
const STATE_HEAD = ["State", "Businesses quoted", "Lowest occurrence", "Lowest claims-made"];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="mt-12 scroll-mt-6 text-2xl font-bold leading-8">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-base leading-8 text-slate-700">{children}</p>;
}

export default function RoofTreePriceData() {
  const roof = COMMON_QUOTES.roof, tree = COMMON_QUOTES.tree;
  const roofOcc = bindsOf("roof", "occurrence"), roofCm = bindsOf("roof", "claims-made"), treeCm = bindsOf("tree", "claims-made"), treeOcc = bindsOf("tree", "occurrence");
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: TITLE, description: DESCRIPTION, mainEntityOfPage: URL, datePublished: PRICE_DATA_UPDATED, dateModified: PRICE_DATA_UPDATED, author: PERSON_REF, publisher: ORG_REF },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Guides", item: `${SITE_URL}/guides` }, { "@type": "ListItem", position: 2, name: TITLE, item: URL }] },
  ] };
  const toc: [string, string][] = [
    ["roofing-per-year", "How much is roofing insurance per year in 2026?"],
    ["tree-per-year", "How much is tree service insurance per year in 2026?"],
    ["occurrence-vs-claims-made", "Is claims-made cheaper than occurrence?"],
    ["roofing-by-revenue", "How much is roofing insurance by revenue?"],
    ["tree-by-revenue", "How much is tree service insurance by revenue?"],
    ["roofing-by-state", "How much is roofing insurance in my state?"],
    ["tree-by-state", "How much is tree service insurance in my state?"],
    ["bound-prices", "What do roofers and tree services pay once bound?"],
    ["price-drivers", "What drives the price?"],
    ["methodology", "How we got these numbers"],
  ];
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-7 text-sm text-slate-600"><Link href="/guides" className="text-blue-700 hover:underline">Guides</Link><span aria-hidden="true" className="mx-2">/</span><span>Pricing data</span></nav>
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Pricing data</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{TITLE}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">Roofers we quoted since November 16, 2026 most often got {usd(roof.since.occurrence)} a year for $1M/$2M occurrence general liability, or {usd(roof.since.claimsMade)} claims-made. Tree services most often got {usd(tree.since.claimsMade)} claims-made or {usd(tree.since.occurrence)} occurrence. These are our own quotes and binds for {PRICE_SUMMARY.roof.businesses} roofing companies and {PRICE_SUMMARY.tree.businesses} tree services from October 20 to November 26, 2026.</p>
        <p className="mt-5 text-sm text-slate-500">By Cohesive Insurance Services · licensed producer <Link href={PRODUCER_PATH} className="underline hover:text-blue-700">{PRODUCER_NAME}</Link> · Last updated <time dateTime={PRICE_DATA_UPDATED}>{longDate(PRICE_DATA_UPDATED)}</time></p>
      </header>

      <nav aria-label="On this page" className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5"><h2 className="font-bold">On this page</h2><ul className="mt-3 space-y-2 text-sm leading-6">{toc.map(([id, label]) => <li key={id}><a href={`#${id}`} className="text-blue-700 hover:underline">{label}</a></li>)}</ul></nav>

      <H2 id="roofing-per-year">How much is roofing insurance per year in 2026?</H2>
      <P>Our most common roofing quote is {usd(roof.since.occurrence)} a year for $1M per occurrence / $2M aggregate general liability on an occurrence form, about {monthly(roof.since.occurrence)} a month. The claims-made version of the same policy is {usd(roof.since.claimsMade)} a year, about {monthly(roof.since.claimsMade)} a month. Before November 16, 2026 the same quotes were {usd(roof.before.occurrence)} and {usd(roof.before.claimsMade)}.</P>
      <Table caption="Most common roofing quote, $1M/$2M general liability (quoted, not bound)" head={["Quote date", "Occurrence per year", "Claims-made per year"]} rows={[["Oct 20 to Nov 15, 2026", usd(roof.before.occurrence), usd(roof.before.claimsMade)], ["Nov 16 to Nov 26, 2026", usd(roof.since.occurrence), usd(roof.since.claimsMade)]]} />

      <H2 id="tree-per-year">How much is tree service insurance per year in 2026?</H2>
      <P>Our most common tree service quote is {usd(tree.since.claimsMade)} a year for $1M/$2M claims-made general liability, about {monthly(tree.since.claimsMade)} a month. The occurrence version is {usd(tree.since.occurrence)} a year, about {monthly(tree.since.occurrence)} a month. Before November 16, 2026 the same quotes were {usd(tree.before.claimsMade)} and {usd(tree.before.occurrence)}. The policy has no height limit, and cranes and bucket trucks are fine.</P>
      <Table caption="Most common tree service quote, $1M/$2M general liability (quoted, not bound)" head={["Quote date", "Claims-made per year", "Occurrence per year"]} rows={[["Oct 20 to Nov 15, 2026", usd(tree.before.claimsMade), usd(tree.before.occurrence)], ["Nov 16 to Nov 26, 2026", usd(tree.since.claimsMade), usd(tree.since.occurrence)]]} />

      <H2 id="occurrence-vs-claims-made">Is claims-made cheaper than occurrence?</H2>
      <P>Yes. On the same application, claims-made was about 24% cheaper for roofers ({usd(roof.before.claimsMade)} vs {usd(roof.before.occurrence)}) and about 26% cheaper for tree services ({usd(tree.before.claimsMade)} vs {usd(tree.before.occurrence)}). Occurrence covers an injury or damage that happens during the policy year, even if the claim comes years later. Claims-made covers claims made while the policy is active, so you keep it renewed or buy tail coverage when you stop. Some general contractors and property managers require occurrence; most of the roofers we bind choose it.</P>

      <H2 id="roofing-by-revenue">How much is roofing insurance by revenue?</H2>
      <P>Under $500K in gross receipts, most roofers land at the most common quote. From $500K to $1M the occurrence median is {usd(PRICE_BANDS.roof[2].occMedian)}, from $1M to $2M it is {usd(PRICE_BANDS.roof[3].occMedian)}, and over $2M it is {usd(PRICE_BANDS.roof[4].occMedian)}.</P>
      <Table caption="Roofing, $1M/$2M general liability quotes by the gross receipts each quote was rated on, Oct 20 to Nov 26, 2026" head={BAND_HEAD} rows={bandRows(PRICE_BANDS.roof)} />

      <H2 id="tree-by-revenue">How much is tree service insurance by revenue?</H2>
      <P>Under $500K in gross receipts, tree services land at {usd(tree.before.claimsMade)} to {usd(tree.since.claimsMade)} claims-made. From $500K to $1M the claims-made median is {usd(PRICE_BANDS.tree[2].cmMedian)}, and over $1M it is {usd(PRICE_BANDS.tree[3].cmMedian)} across {PRICE_BANDS.tree[3].cmN} quotes.</P>
      <Table caption="Tree service, $1M/$2M general liability quotes by the gross receipts each quote was rated on, Oct 20 to Nov 26, 2026" head={BAND_HEAD} rows={bandRows(PRICE_BANDS.tree)} />

      <H2 id="roofing-by-state">How much is roofing insurance in my state?</H2>
      <P>For a small roofer the lowest quote was the same {usd(roof.before.occurrence)} occurrence and {usd(roof.before.claimsMade)} claims-made in every state where we quoted at least five roofing companies, except Utah, where the lowest was {usd(PRICE_STATES.roof.find((r) => r.abbr === "UT")?.occLow ?? null)} occurrence and {usd(PRICE_STATES.roof.find((r) => r.abbr === "UT")?.cmLow ?? null)} claims-made. Revenue moves the price far more than the state does.</P>
      <Table caption="Roofing, lowest $1M/$2M quote by state (states with 5 or more roofing companies quoted), Oct 20 to Nov 26, 2026" head={STATE_HEAD} rows={stateRows(PRICE_STATES.roof)} />

      <H2 id="tree-by-state">How much is tree service insurance in my state?</H2>
      <P>The lowest tree service quote was {usd(tree.before.claimsMade)} claims-made and {usd(tree.before.occurrence)} occurrence in every state where we quoted at least five tree services.</P>
      <Table caption="Tree service, lowest $1M/$2M quote by state (states with 5 or more tree services quoted), Oct 20 to Nov 26, 2026" head={STATE_HEAD} rows={stateRows(PRICE_STATES.tree)} />

      <H2 id="bound-prices">What do roofers and tree services pay once bound?</H2>
      <P>Roofers who bound occurrence with us pay a median {usd(median(roofOcc.map((b) => b.premium)))} a year ({roofOcc.length} policies, lowest {usd(Math.min(...roofOcc.map((b) => b.premium)))}). Tree services who bound claims-made pay a median {usd(median(treeCm.map((b) => b.premium)))} ({treeCm.length} policies, lowest {usd(Math.min(...treeCm.map((b) => b.premium)))}). Some bound prices sit below the quote because of a discount at binding.</P>
      <Table caption="Bound $1M/$2M general liability, summary, Oct 20 to Nov 25, 2026" head={["Trade and form", "Policies bound", "Median per year", "Lowest per year"]} rows={([["Roofing, occurrence", roofOcc], ["Roofing, claims-made", roofCm], ["Tree service, claims-made", treeCm], ["Tree service, occurrence", treeOcc]] as [string, BindRow[]][]).map(([label, rows]) => [label, rows.length, usd(median(rows.map((b) => b.premium))), usd(Math.min(...rows.map((b) => b.premium)))])} />
      <Table caption="Every bound policy in the sample, $1M/$2M general liability (no client names)" head={["Trade", "State", "Bound", "Form", "Price per year"]} rows={PRICE_BINDS.map((b) => [b.trade === "roof" ? "Roofing" : "Tree service", US_STATES[b.state] ?? b.state, shortDate(b.boundDate), b.form === "occurrence" ? "Occurrence" : "Claims-made", usd(b.premium)])} />
      <P>Two larger roofing companies also bound $1M/$2M occurrence with us in November 2026:</P>
      <Table caption="Larger roofing accounts, bound, premium before taxes and fees" head={["Revenue", "Bound", "Price per year", "Details"]} rows={LARGE_ROOF_BINDS.map((b) => [b.revenue, shortDate(b.boundDate), usd(b.premium), b.detail])} />

      <H2 id="price-drivers">What drives the price?</H2>
      <ul className="mt-4 list-disc space-y-3 pl-6 text-base leading-8 text-slate-700">
        <li><strong>Gross receipts.</strong> The biggest driver. A roofer over $2M had a median occurrence quote of {usd(PRICE_BANDS.roof[4].occMedian)}, more than twelve times a roofer under $250K.</li>
        <li><strong>Policy form.</strong> Claims-made runs about 24% to 26% below occurrence on the same application.</li>
        <li><strong>Subcontracted work.</strong> Work you pay subcontractors for is rated along with your own receipts, so the larger accounts above list it.</li>
        <li><strong>Quote date.</strong> Quotes issued from November 16, 2026 came in $100 higher than the same business would have been quoted before.</li>
        <li><strong>State, for small accounts, barely.</strong> The lowest quote was identical across {PRICE_STATES.roof.length - 1} of {PRICE_STATES.roof.length} roofing states and all {PRICE_STATES.tree.length} tree service states in the tables.</li>
        <li><strong>The class of work.</strong> Being rated as tree trimming or removal, not landscaping, and as roofing, not general construction, is what puts a business on these prices.</li>
      </ul>

      <H2 id="methodology">How we got these numbers</H2>
      <P>Source: quotes and bound policies in the Cohesive Insurance CRM, read on {longDate(PRICE_DATA_UPDATED)}. The quote sample is every general liability quote issued from October 20 to November 26, 2026 on our roofing and tree service program where roofing or tree work was at least half of the business, at $1M per occurrence / $2M aggregate. We kept the cheapest quote per business and policy form and dropped quotes we replaced. That leaves {PRICE_SUMMARY.roof.businesses} roofing companies ({PRICE_SUMMARY.roof.quotes.occurrence} occurrence and {PRICE_SUMMARY.roof.quotes["claims-made"]} claims-made quotes) and {PRICE_SUMMARY.tree.businesses} tree services ({PRICE_SUMMARY.tree.quotes["claims-made"]} claims-made and {PRICE_SUMMARY.tree.quotes.occurrence} occurrence quotes).</P>
      <P>Revenue bands use the gross receipts each quote was rated on. When a business did not give us revenue, we rated it at an estimate, and the table groups it by that figure. Bound prices are the annual premium on policies bound from October 20 to November 25, 2026 on the same program and limits, matched to the policy form quoted. Prices are the annual totals we quoted. All states shown are states where we write this program. Free to cite with a link to this page.</P>
      <p className="mt-6 text-sm text-slate-500">Last updated <time dateTime={PRICE_DATA_UPDATED}>{longDate(PRICE_DATA_UPDATED)}</time>.</p>

      <section className="mt-12 rounded-2xl border border-blue-100 bg-[#F7F9FF] p-6">
        <h2 className="text-xl font-bold">Get your own price</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Send your revenue, subcontracted work and claims, and we come back with your number.</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 font-semibold">
          <Link href="/insurance/roofer#quote" className="text-blue-700 underline">Get a roofing quote →</Link>
          <Link href="/insurance/tree-service#quote" className="text-blue-700 underline">Get a tree service quote →</Link>
          <a href={`tel:${PHONE_E164}`} className="text-blue-700 underline">Call {PHONE_DISPLAY}</a>
        </div>
      </section>

      <section aria-labelledby="related" className="mt-10">
        <h2 id="related" className="text-xl font-bold">Related data</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6">
          <li><Link href="/guides/roofing-insurance-cost-2026-data" className="text-blue-700 underline">Roofing insurance cost: 2026 data across carriers →</Link></li>
          <li><Link href="/guides/tree-service-insurance-cost-2026-data" className="text-blue-700 underline">Tree service insurance cost: 2026 data across carriers →</Link></li>
          <li><Link href="/guides/contractor-insurance-cost-by-trade-2026" className="text-blue-700 underline">Contractor insurance cost by trade →</Link></li>
          <li><Link href="/insurance/roofer" className="text-blue-700 underline">Roofing insurance →</Link></li>
          <li><Link href="/insurance/tree-service" className="text-blue-700 underline">Tree service insurance →</Link></li>
        </ul>
      </section>
    </div>
  </main>;
}
