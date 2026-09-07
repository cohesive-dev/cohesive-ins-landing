import { GuideQuoteLink } from "./GuideActions";

export default function CohesiveGuideCta({ slug, industry, placement }: { slug: string; industry: string; placement: "setup" | "vendor" }) {
  const restaurant = industry === "Restaurants";
  return <div data-cohesive-cta={placement} className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 sm:p-6 print:hidden">
    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Cohesive Insurance</p>
    <h3 className="mt-2 text-xl font-bold">{placement === "setup" ? "Business formed? Put insurance next on the list." : restaurant ? "Get insurance ready for your next catering or venue opportunity." : "Get insurance ready for the GC or property manager’s vendor list."}</h3>
    <p className="mb-5 mt-3 text-sm leading-7 text-slate-700">{placement === "setup" ? "Make Cohesive your next call for business insurance. Tell us what you do, where you operate, and when you need coverage. Our team can help you explore coverage options for your launch." : "Bring the customer's insurance requirements to Cohesive. Tell us the requested limits, any additional insured requirements, your operations, and the job timeline so our team can discuss coverage options and the documents you will need."}</p>
    <GuideQuoteLink slug={slug} placement={placement} />
    <p className="mt-3 text-xs leading-5 text-slate-500">Coverage and required endorsements must be confirmed before insurance evidence can establish that the job requirements are met.</p>
  </div>;
}
