import { STARTUP_BUNDLE, GROWTH_BUNDLE } from "@/lib/guides/lead-bundle";
import { GuideQuoteLink } from "./GuideActions";

export default function StartupBundle({ slug, growth = false }: { slug: string; growth?: boolean }) {
  const offer = growth ? GROWTH_BUNDLE : STARTUP_BUNDLE;
  return <section aria-labelledby="startup-bundle-heading" className="mt-8 max-w-3xl rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-7 print:hidden">
    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Insurance + customer outreach</p>
    <h2 id="startup-bundle-heading" className="mt-2 text-2xl font-bold">{offer.heading}</h2>
    <p className="mt-3 text-base leading-7 text-slate-700">{offer.summary}</p>
    <div className="mt-5 flex flex-wrap items-center gap-4">
      <GuideQuoteLink slug={slug} placement="startup-bundle" label={offer.cta} />
      <a href="#cohesive-ai-referrals" className="text-sm font-semibold text-blue-700 underline">How the bundle works</a>
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-600">Available with insurance placed through Cohesive. Coverage depends on your business, state, and insurer. Outreach does not guarantee leads or jobs.</p>
  </section>;
}
