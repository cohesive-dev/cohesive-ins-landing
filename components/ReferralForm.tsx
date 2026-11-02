"use client";

import { useEffect, useState } from "react";
import { captureAttribution, attributionDetails } from "@/lib/attribution";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export default function ReferralForm({ code }: { code: string }) {
  const [fields, setFields] = useState({ name: "", email: "", phone: "", company: "", businessType: "", zip: "", needs: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    captureAttribution();
  }, []);
  function set(key: keyof typeof fields, value: string) { setFields((current) => ({ ...current, [key]: value })); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!fields.name.trim() || !fields.company.trim() || !fields.businessType.trim() || !emailPattern.test(fields.email.trim()) || fields.phone.replace(/\D/g, "").length < 10) {
      setError("Please add your name, business, type of work, email and phone number."); return;
    }
    setBusy(true); setError("");
    const attribution = captureAttribution();
    const details = [
      code && { label: "Referral code", value: code },
      { label: "Referral landing page", value: "/refer" },
      { label: "Business type", value: fields.businessType.trim() },
      fields.needs.trim() && { label: "Coverage or project details", value: fields.needs.trim() },
      ...attributionDetails(attribution),
    ].filter(Boolean);
    try {
      const response = await fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        source: "customer-referral", name: fields.name.trim(), email: fields.email.trim().toLowerCase(), phone: fields.phone.trim(),
        company: fields.company.trim(), businessType: fields.businessType.trim(), zip: fields.zip.trim(), details,
      }) });
      const result = await response.json();
      if (!response.ok || result.ok !== true || (result.crm !== "sent" && result.notification !== "sent")) throw new Error("save_failed");
      setDone(true);
    } catch { setError("We couldn't save your request. Please try again or call (929) 594-5450."); }
    finally { setBusy(false); }
  }
  if (done) return <div role="status" className="mt-7 rounded-xl bg-green-50 p-5 text-green-900"><h2 className="text-xl font-semibold">Thanks. We got your request.</h2><p className="mt-2">A Cohesive team member will review it and get in touch.</p></div>;
  const inputClass = "mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-3 text-base outline-none focus:border-[#2040E7] focus:ring-2 focus:ring-[#DDE4FF]";
  return <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
    {code && <div className="rounded-lg bg-[#F1F5FF] px-4 py-3 text-sm text-[#294067]">Referral code <strong className="ml-1 font-mono">{code}</strong> is attached to your request.</div>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">Your name <span aria-hidden="true">*</span><input className={inputClass} autoComplete="name" value={fields.name} onChange={(e) => set("name", e.target.value)} required /></label>
      <label className="block text-sm font-medium">Business name <span aria-hidden="true">*</span><input className={inputClass} autoComplete="organization" value={fields.company} onChange={(e) => set("company", e.target.value)} required /></label>
      <label className="block text-sm font-medium">Email <span aria-hidden="true">*</span><input className={inputClass} type="email" autoComplete="email" value={fields.email} onChange={(e) => set("email", e.target.value)} required /></label>
      <label className="block text-sm font-medium">Phone <span aria-hidden="true">*</span><input className={inputClass} type="tel" autoComplete="tel" value={fields.phone} onChange={(e) => set("phone", e.target.value)} required /></label>
      <label className="block text-sm font-medium">What does your business do? <span aria-hidden="true">*</span><input className={inputClass} value={fields.businessType} onChange={(e) => set("businessType", e.target.value)} placeholder="e.g. Roofing contractor" required /></label>
      <label className="block text-sm font-medium">Business ZIP code<input className={inputClass} autoComplete="postal-code" inputMode="numeric" value={fields.zip} onChange={(e) => set("zip", e.target.value)} /></label>
    </div>
    <label className="block text-sm font-medium">What coverage or project do you need help with?<textarea className={inputClass} rows={3} value={fields.needs} onChange={(e) => set("needs", e.target.value)} /></label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={busy} type="submit" className="w-full rounded-xl bg-[#2040E7] px-5 py-4 font-semibold text-white hover:bg-[#1835C9] disabled:opacity-50">{busy ? "Sending…" : "Request a quote"}</button>
    <p className="text-xs leading-relaxed text-[#64748B]">By sending this form, you ask Cohesive to contact you about business insurance. See our <a href="/privacy" className="underline">privacy policy</a>.</p>
  </form>;
}
