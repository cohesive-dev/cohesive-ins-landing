import { CONTRACTOR_INDUSTRIES } from "@/lib/contractor-industries";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReferralPartnerForm from "@/components/ReferralPartnerForm";
import { REFERRAL_FEE_USD, PAYOUT_BLOCK, PAYOUT_BLOCK_USD } from "@/lib/referral-partners";

export const metadata: Metadata = {
  title: "Client Referral Program | Cohesive Insurance",
  description: `Cohesive clients: send business owners you know our way and get $${REFERRAL_FEE_USD} for every one we quote.`,
  robots: { index: false, follow: false },
};

// Nam 2026-11-20: EXISTING CLIENTS only (unlisted link we send them). Unlike /referral-program (new partners =
// contractors only), clients may refer our whole focus area: contractors, commercial property (churches,
// commercial buildings) and restaurants. Signups carry PROGRAM: client; the payout script also checks the CRM for a
// bound/active policy before paying property/restaurant referrals.
export default function ClientReferralsPage() {
  return <main className="min-h-screen bg-[#F7F9FF] text-[#131517]">
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="inline-block"><Image src="/logo-long.png" alt="Cohesive Insurance" width={200} height={40} className="h-10 w-auto" /></Link>
      <section className="mt-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#2040E7]">For Cohesive clients</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Know someone who needs insurance? Get ${REFERRAL_FEE_USD} per referral.</h1>
        <p className="mt-3 text-lg text-[#405066]">Thanks for being a Cohesive client. Send other business owners you know our way. You get ${REFERRAL_FEE_USD} for every one you send through your link that we quote, <strong>whether or not they buy</strong>. We pay ${PAYOUT_BLOCK_USD} every {PAYOUT_BLOCK} referrals.</p>
        <a href="#signup" className="mt-5 inline-block rounded-lg bg-[#2040E7] px-6 py-3 text-lg font-semibold text-white">Get my link</a>
      </section>
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["1", "Sign up", "Takes a minute. You get your own referral link right away."],
          ["2", "Share your link", "Text it to other business owners you know."],
          ["3", "Get paid", `$${PAYOUT_BLOCK_USD} by Venmo every ${PAYOUT_BLOCK} referrals.`],
        ].map(([n, h, p]) => <article key={n} className="rounded-2xl border border-[#DDE4FF] bg-white p-5"><span className="text-sm font-bold text-[#2040E7]">0{n}</span><h3 className="mt-1 text-lg font-bold">{h}</h3><p className="mt-1 text-[#405066]">{p}</p></article>)}
      </section>
      <section id="signup" className="mt-10 rounded-2xl border border-[#DDE4FF] bg-white p-6 shadow-sm sm:p-9"><ReferralPartnerForm program="client" /></section>
      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold">Quick answers</h2>
        <details open className="rounded-xl border border-[#DDE4FF] bg-white p-4"><summary className="font-semibold">Who can I refer?</summary><div className="mt-2 text-[#405066]"><p>Businesses in the industries we insure:</p><ul className="mt-2 list-disc space-y-1 pl-5"><li>Churches and houses of worship</li><li>Commercial property owners (buildings and facilities)</li><li>Restaurants</li>{CONTRACTOR_INDUSTRIES.map((i) => <li key={i}>{i}</li>)}</ul><p className="mt-2">Referrals from other industries (for example retail stores, trucking, salons or accounting) do not count toward payouts.</p></div></details>
        <details className="rounded-xl border border-[#DDE4FF] bg-white p-4"><summary className="font-semibold">Do they have to buy for me to get paid?</summary><p className="mt-2 text-[#405066]">No. You earn ${REFERRAL_FEE_USD} once a business you send through your link receives a quote from us. Requests we can&apos;t quote (for example a business that can&apos;t be reached or isn&apos;t real) don&apos;t count. Whether they buy after that doesn&apos;t change your payment.</p></details>
        <details className="rounded-xl border border-[#DDE4FF] bg-white p-4"><summary className="font-semibold">Do I have to explain insurance to them?</summary><p className="mt-2 text-[#405066]">No. Just share the link. Our licensed agents handle every question about coverage and price.</p></details>
      </section>
      <section id="terms" className="mt-10 text-xs leading-relaxed text-[#64748B]">
        <h2 className="font-semibold">Program terms</h2>
        <p className="mt-2">This program is for current Cohesive Insurance clients. Cohesive Insurance Services pays a flat ${REFERRAL_FEE_USD} for each qualified referral. A qualified referral is a different business that is a contractor or service business, church, commercial property owner or restaurant we insure, not already a Cohesive client or in an open quote with us, that submits a quote request through your link with real contact information and receives a quote from us. Requests that are not quoted (for example unreachable, duplicate or not a real operating business) do not qualify. Payment does not depend on whether the referred business buys insurance. We pay ${PAYOUT_BLOCK_USD} for each {PAYOUT_BLOCK} qualified referrals, monthly, by Venmo to the username you give us; we may ask for a W-9 before paying. You agree not to give insurance advice or discuss coverage or pricing on our behalf, and not to send spam. We may change or end the program at any time; referrals made before a change are paid under the terms in effect when they were made. Your per-referral rate is the one shown when you sign up. Void where prohibited.</p>
      </section>
      <p className="mt-6 text-sm text-[#405066]">Questions? Call <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">(929) 594-5450</a> or email kevin@cohesiveinsure.com.</p>
    </div>
  </main>;
}
