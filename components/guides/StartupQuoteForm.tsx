"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { startupPlacementRestriction } from "@/lib/guides/eligibility";

export default function StartupQuoteForm({ slug, industry, tradeLabel, initialState = "", states }: { slug: string; industry: string; tradeLabel: string; initialState?: string; states: { slug: string; name: string }[] }) {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const restriction = startupPlacementRestriction(state, industry);
  const input = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base focus:outline-2 focus:outline-offset-2 focus:outline-blue-600";
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (restriction || status === "sending") return;
    const fields = new FormData(event.currentTarget);
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name: String(fields.get("name") ?? "").trim(), email: String(fields.get("email") ?? "").trim(),
        phone: String(fields.get("phone") ?? "").trim(), company: String(fields.get("company") ?? "").trim(),
        businessType: tradeLabel, startupState: state, source: `seo-startup-${slug}`,
        details: [
          { label: "Business type", value: tradeLabel }, { label: "State", value: states.find((s) => s.slug === state)?.name ?? state },
          { label: "Starting or coverage timeline", value: String(fields.get("timeline") ?? "") },
          { label: "Planned operations", value: String(fields.get("operations") ?? "").trim() },
          { label: "Startup guide", value: `/guides/${slug}` },
        ],
      }) });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || "We could not confirm your request. Please try again.");
      setStatus("done");
      try { track("StartupQuoteCaptured", { guide: slug, industry, state, crm: String(result.crm ?? "unknown"), notification: String(result.notification ?? "unknown") }); } catch { /* Capture does not depend on analytics. */ }
    } catch (cause) { setStatus("error"); setError(cause instanceof Error ? cause.message : "Please try again."); }
  }
  if (status === "done") return <div role="status" className="mx-auto max-w-2xl rounded-xl border border-blue-200 bg-white p-8 text-center"><h3 className="text-xl font-bold">Your request has been received.</h3><p className="mt-3 leading-7 text-slate-600">Our team will review your business details and follow up about coverage options. This request does not bind coverage.</p></div>;
  return <form onSubmit={submit} className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Your name<input className={input} name="name" autoComplete="name" maxLength={150} required /></label>
      <label className="text-sm font-medium">Business name (if chosen)<input className={input} name="company" autoComplete="organization" maxLength={200} /></label>
      <label className="text-sm font-medium">Email<input className={input} name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label className="text-sm font-medium">Phone<input className={input} name="phone" type="tel" autoComplete="tel" maxLength={30} required /></label>
      <label className="text-sm font-medium">Business state<select name="state" className={input} required value={state} onChange={(e) => setState(e.target.value)}><option value="">Choose a state</option>{states.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></label>
      <label className="text-sm font-medium">When do you need coverage?<select name="timeline" className={input} required defaultValue=""><option value="">Choose a timeline</option><option>Within 30 days</option><option>Within 31–60 days</option><option>More than 60 days away</option><option>Still researching</option><option>Already operating</option></select></label>
      <label className="text-sm font-medium sm:col-span-2">What will the business do?<textarea name="operations" className={input} rows={3} maxLength={2000} required placeholder={`Describe your ${industry.toLowerCase()} services, staffing, and any insurance requirements you already have.`} /></label>
    </div>
    {restriction && <p role="status" className="mt-5 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900">{restriction} You can still use the guide and free checklist.</p>}
    {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
    <button type="submit" disabled={Boolean(restriction) || status === "sending"} className="mt-6 w-full rounded-lg bg-[#2040E7] px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">{status === "sending" ? "Sending…" : "Get coverage options with Cohesive"}</button>
    <p className="mt-4 text-xs leading-5 text-slate-500">By submitting, you ask Cohesive to contact you about this insurance request. Availability depends on your business, state, and insurer. <a href="/privacy" className="underline">Privacy policy</a>.</p>
  </form>;
}
