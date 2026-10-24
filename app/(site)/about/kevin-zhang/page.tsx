import type { Metadata } from "next";
import Link from "next/link";
import { licenseFor, PRIMARY_NPN, STATE_CODES } from "@/lib/licenses";
import {
  ORG_NAME,
  PERSON_ID,
  PHONE_DISPLAY,
  PHONE_E164,
  PRODUCER_NAME,
  PRODUCER_NY_LICENSE,
  PRODUCER_PATH,
  SITE_URL,
  organizationJsonLd,
  personJsonLd,
} from "@/lib/entity";

// Factual producer page (SEO 2026-10-03). Every statement here is a public-record fact a reader can
// check: the NPN at NIPR, the New York license at NY DFS, and the state list from lib/licenses.ts.
// No photo, no years-of-experience line, no ranking or "best" claims.

const title = `${PRODUCER_NAME}, licensed insurance producer | ${ORG_NAME}`;
const description = `${PRODUCER_NAME} is a licensed property and casualty insurance broker and producer with ${ORG_NAME}. NPN ${PRIMARY_NPN}, New York license ${PRODUCER_NY_LICENSE}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PRODUCER_PATH },
  openGraph: { title, description, type: "profile", url: PRODUCER_PATH },
  twitter: { card: "summary", title, description },
};

// States licensed under Kevin's own NPN, read from lib/licenses.ts (no state is added by hand here).
const LICENSED_STATES = Object.entries(STATE_CODES)
  .map(([name, code]) => ({ name, code, license: licenseFor(code) }))
  .filter((s) => s.license?.npn === PRIMARY_NPN)
  .sort((a, b) => a.name.localeCompare(b.name));

const NIPR_URL = "https://nipr.com/help/look-up-your-npn";
const NY_DFS_LOOKUP_URL = "https://myportal.dfs.ny.gov/nylinxext/elsearch.alice";
const NY_DFS_INFO_URL = "https://www.dfs.ny.gov/apps_and_licensing/agents_and_brokers";

export default function KevinZhangPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { ...personJsonLd(), "@context": undefined },
      { ...organizationJsonLd(), "@context": undefined },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}${PRODUCER_PATH}`,
        url: `${SITE_URL}${PRODUCER_PATH}`,
        name: title,
        mainEntity: { "@id": PERSON_ID },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-[#2040E7]">
            Cohesive<span className="ml-2 text-sm font-medium text-slate-500">Insurance</span>
          </Link>
          <nav aria-label="Main navigation" className="flex gap-5 text-sm font-semibold">
            <Link href="/insurance">Insurance guides</Link>
            <Link href="/guides">Business guides</Link>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">About the producer</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{PRODUCER_NAME}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">
          {PRODUCER_NAME} is a licensed property and casualty insurance broker and producer with {ORG_NAME},
          an independent insurance agency. {ORG_NAME} places commercial insurance for small businesses,
          including contractors, restaurants, churches and commercial property owners, with several insurance carriers.
        </p>

        <section aria-labelledby="licensing" className="mt-10">
          <h2 id="licensing" className="text-2xl font-bold">Licensing</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-5">
              <dt className="text-sm text-slate-500">National Producer Number (NPN)</dt>
              <dd className="mt-1 text-xl font-bold">{PRIMARY_NPN}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <dt className="text-sm text-slate-500">New York license</dt>
              <dd className="mt-1 text-xl font-bold">{PRODUCER_NY_LICENSE}</dd>
            </div>
          </dl>
          <p className="mt-5 leading-7 text-slate-700">
            You can check these numbers yourself. NIPR explains how to{" "}
            <a href={NIPR_URL} className="font-medium text-blue-700 underline">look up a producer by NPN ↗</a>, and the New York
            Department of Financial Services runs a{" "}
            <a href={NY_DFS_LOOKUP_URL} className="font-medium text-blue-700 underline">producer and licensee search ↗</a>{" "}
            (<a href={NY_DFS_INFO_URL} className="text-blue-700 underline">DFS information for agents and brokers ↗</a>).
          </p>
        </section>

        <section aria-labelledby="states" className="mt-10">
          <h2 id="states" className="text-2xl font-bold">States licensed under NPN {PRIMARY_NPN}</h2>
          <p className="mt-3 leading-7 text-slate-700">
            The state license number is shown where it differs from the NPN.
          </p>
          <ul className="mt-5 grid gap-x-6 gap-y-2 text-sm leading-6 sm:grid-cols-2">
            {LICENSED_STATES.map((s) => (
              <li key={s.code} className="flex justify-between gap-4 border-b border-slate-100 py-1">
                <span>{s.name}</span>
                <span className="text-slate-600">{s.license?.license ? `License #${s.license.license}` : `NPN ${PRIMARY_NPN}`}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-paid" className="mt-10">
          <h2 id="how-paid" className="text-2xl font-bold">How we are paid</h2>
          <p className="mt-3 leading-7 text-slate-700">
            {ORG_NAME} is a licensed insurance broker. We are paid a commission by the insurance carrier
            that issues your policy.
          </p>
        </section>

        <section aria-labelledby="quote" className="mt-10 rounded-2xl border border-blue-100 bg-[#F7F9FF] p-6">
          <h2 id="quote" className="text-2xl font-bold">Get a quote</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Tell us about your business and we will compare quotes from the carriers we work with.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/#get-quote"
              className="inline-block rounded-lg bg-[#2040E7] px-5 py-3 text-center font-semibold text-white hover:bg-blue-800"
            >
              Get my quote →
            </Link>
            <p className="text-sm text-slate-600">
              Prefer to talk? Call{" "}
              <a href={`tel:${PHONE_E164}`} className="font-semibold text-[#2040E7]">{PHONE_DISPLAY}</a>
            </p>
          </div>
        </section>
      </article>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-4xl flex-wrap gap-x-6 gap-y-3 px-5 py-8 text-sm text-slate-600">
          <span>{ORG_NAME}</span>
          <Link href="/insurance">Insurance guides</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
