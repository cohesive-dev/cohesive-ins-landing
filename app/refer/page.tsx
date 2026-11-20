import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReferralForm from "@/components/ReferralForm";
import { referralCode } from "@/lib/referral-code";
import { CONTRACTOR_INDUSTRIES, NOT_ELIGIBLE_EXAMPLES } from "@/lib/contractor-industries";

export const metadata: Metadata = {
  title: "Get a Business Insurance Quote | Cohesive Insurance",
  description: "A customer referred you to Cohesive. Tell us about your business and a licensed agent will follow up about insurance options.",
  robots: { index: false, follow: true },
};

export default async function ReferPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const code = referralCode((await searchParams).ref);
  return <main className="min-h-screen bg-[#F7F9FF] text-[#131517]">
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="inline-block"><Image src="/logo-long.png" alt="Cohesive Insurance" width={200} height={40} className="h-10 w-auto" /></Link>
      <div className="mt-8 rounded-2xl border border-[#DDE4FF] bg-white p-6 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-wider text-[#2040E7]">Customer referral</p>
        <h1 className="mt-2 text-3xl font-bold">A better way to shop business insurance</h1>
        <p className="mt-3 text-[#405066]">Someone you know shared Cohesive with you. Tell us a little about your business and our team will follow up about coverage and quotes.</p>
        <p className="mt-3 rounded-lg bg-[#EEF2FF] px-4 py-3 text-sm font-medium text-[#1B2B6B]">We specialize in contractor insurance only and can&apos;t insure other businesses. This specialization lets us get the most competitive rates for contractors.</p>
        <ReferralForm code={code} />
      </div>
      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-bold">Questions</h2>
        <details open className="rounded-xl border border-[#DDE4FF] bg-white p-4"><summary className="font-semibold">Which businesses can use this form?</summary><div className="mt-2 text-[#405066]"><p>Contractors and service businesses in the industries we insure:</p><ul className="mt-2 list-disc space-y-1 pl-5">{CONTRACTOR_INDUSTRIES.map((i) => <li key={i}>{i}</li>)}</ul><p className="mt-2">We can&apos;t quote other kinds of businesses through this form, for example {NOT_ELIGIBLE_EXAMPLES}.</p></div></details>
        <details className="rounded-xl border border-[#DDE4FF] bg-white p-4"><summary className="font-semibold">What happens after I submit?</summary><p className="mt-2 text-[#405066]">A licensed agent reviews your business and follows up with general liability quote options. There&apos;s no obligation to buy.</p></details>
      </section>
    </div>
  </main>;
}
