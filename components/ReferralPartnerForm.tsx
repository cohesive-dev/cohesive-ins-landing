"use client";
import { useState } from "react";

const REFERRAL_TRADE_TAGS = ["Roofing", "General contractors", "Remodeling", "Carpentry", "Painting", "Plumbing", "Electrical", "HVAC", "Drywall", "Flooring", "Masonry & concrete", "Siding & fencing", "Welding", "Excavation", "Landscaping", "Tree service", "Handyman", "Solar install"];

type Fbq = (...a: unknown[]) => void;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;
const input = "mt-1 w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-base focus:border-[#2040E7] focus:outline-none";

/** Referral partner signup -> /api/referral-partners (team email, never the insurance intake).
 *  Pixel event is CUSTOM on purpose (as /roofing-leads): a standard Lead here would train the insurance ads on partner signups. */
export default function ReferralPartnerForm() {
  const [f, setF] = useState({ fullName: "", businessName: "", trade: "", email: "", phone: "", payoutHandle: "", website: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true); setErrors({}); setMessage("");
    const q = new URLSearchParams(location.search);
    const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, q.get(k) ?? ""]).filter(([, v]) => v));
    try {
      const r = await fetch("/api/referral-partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, agree, utm }) });
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; url?: string; errors?: Record<string, string>; message?: string };
      if (r.ok && data.ok && data.url) {
        (window as unknown as { fbq?: Fbq }).fbq?.("trackCustom", "ReferralPartnerSignup");
        setLink(data.url);
        return;
      }
      setErrors(data.errors ?? {}); setMessage(data.message ?? (data.errors ? "" : "Something went wrong. Please try again."));
    } catch { setMessage("Something went wrong. Please try again or call (929) 594-5450."); }
    finally { setSending(false); }
  }

  if (link) {
    const sms = `sms:?&body=${encodeURIComponent(`Need business insurance? These guys quoted me fast: ${link}`)}`;
    return <div className="text-center">
      <h2 className="text-2xl font-bold">You&apos;re in. Here&apos;s your link:</h2>
      <p className="mt-4 break-all rounded-lg bg-[#F1F5FF] px-4 py-3 font-mono text-sm text-[#294067]">{link}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" className="rounded-lg bg-[#2040E7] px-5 py-3 font-semibold text-white" onClick={() => { navigator.clipboard?.writeText(link).then(() => setCopied(true)).catch(() => {}); }}>{copied ? "Copied" : "Copy link"}</button>
        <a href={sms} className="rounded-lg border border-[#2040E7] px-5 py-3 font-semibold text-[#2040E7]">Text it to a sub</a>
      </div>
      <p className="mt-4 text-sm text-[#405066]">We also emailed it to you. Every contractor that requests a quote through your link earns you $40.</p>
    </div>;
  }

  const err = (k: string) => errors[k] ? <small role="alert" className="mt-1 block text-[#b42318]">{errors[k]}</small> : null;
  return <form onSubmit={submit} noValidate className="grid gap-4">
    <h2 className="text-2xl font-bold">Get your referral link</h2>
    <div><p className="text-sm font-semibold text-[#405066]">We pay for referrals of contractors:</p><div className="mt-2 flex flex-wrap gap-2">{REFERRAL_TRADE_TAGS.map((t) => <span key={t} className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#1B2B6B]">{t}</span>)}</div></div>
    <label className="text-sm font-semibold">Your name<input className={input} value={f.fullName} onChange={set("fullName")} autoComplete="name" />{err("fullName")}</label>
    <label className="text-sm font-semibold">Business name<input className={input} value={f.businessName} onChange={set("businessName")} autoComplete="organization" />{err("businessName")}</label>
    <label className="text-sm font-semibold">Your trade (optional)<input className={input} value={f.trade} onChange={set("trade")} placeholder="General contractor, roofing, ..." /></label>
    <label className="text-sm font-semibold">Email<input type="email" className={input} value={f.email} onChange={set("email")} autoComplete="email" />{err("email")}</label>
    <label className="text-sm font-semibold">Phone<input type="tel" className={input} value={f.phone} onChange={set("phone")} autoComplete="tel" />{err("phone")}</label>
    <label className="text-sm font-semibold">Venmo username (we pay by Venmo)<input className={input} value={f.payoutHandle} onChange={set("payoutHandle")} placeholder="@your-name" autoCapitalize="none" />{err("payoutHandle")}</label>
    <input aria-hidden="true" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} style={{ position: "absolute", left: "-9999px" }} />
    <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>I agree to the <a href="#terms" className="underline">program terms</a>.</span></label>{err("agree")}
    {message && <p role="alert" className="text-[#b42318]">{message}</p>}
    <button type="submit" disabled={sending} className="rounded-lg bg-[#2040E7] px-5 py-3 text-lg font-semibold text-white disabled:opacity-60">{sending ? "Sending…" : "Get my link"}</button>
  </form>;
}
