import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReferralForm from "@/components/ReferralForm";
import { referralCode } from "@/lib/referral-code";

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
        <ReferralForm code={code} />
      </div>
      <p className="mt-6 text-sm text-[#405066]">Prefer to talk? Call <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">(929) 594-5450</a>.</p>
    </div>
  </main>;
}
