"use client";

import { useEffect, useState } from "react";
import { captureAttribution, attributionDetails } from "@/lib/attribution";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { hasMailableAddress, zipFromMailingAddress } from "@/lib/mailing-address";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const ENTITY = ["Sole proprietor", "LLC", "Corporation (Inc. / Corp.)", "Partnership", "Nonprofit", "Other"];
const ROLES = ["Owner", "Partner / co-owner", "Manager", "Office / admin staff", "Other"];
const REVENUE = ["Not started yet", "Under $100,000", "$100,000 - $250,000", "$250,000 - $500,000", "$500,000 - $1 million", "$1 million - $5 million", "Over $5 million"];
const EMPLOYEES = ["None (just the owners)", "1", "2 - 5", "6 - 10", "11 - 25", "Over 25"];
const SUBS = ["None, we do all the work ourselves", "1 - 2", "3 - 5", "6 - 10", "Over 10"];
const RELATIONSHIP = ["We've worked together on jobs", "I'm their customer / they're my customer", "Friend or family", "Same trade or business group", "Saw an online ad or post", "Other"];
const CUSTOMERS = ["Mostly homeowners (residential)", "Mostly businesses or GCs (commercial)", "Both about equally"];
const linkPattern = /[a-z0-9-]\.[a-z]{2,}|facebook|instagram|google|yelp|nextdoor|angi|houzz|thumbtack/i;
const thisYear = new Date().getFullYear();

export default function ReferralForm({ code }: { code: string }) {
  const [fields, setFields] = useState({ name: "", email: "", phone: "", company: "", businessType: "", mailingAddress: "", needs: "",
    role: "", yearStarted: "", revenue: "", employees: "", subs: "", entity: "", dba: "", relationship: "", site: "", license: "", currentInsurance: "", customers: "", hp: "" });
  const [noSite, setNoSite] = useState(false);
  const [attest, setAttest] = useState(false);
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
    if (!hasMailableAddress(fields.mailingAddress)) { setError("Please add your full mailing address, including ZIP code."); return; }
    const year = Number(fields.yearStarted.trim());
    if (!fields.entity || !fields.role || !fields.revenue || !fields.employees || !fields.subs || !fields.relationship || !fields.customers) { setError("Please answer each of the business questions."); return; }
    if (!/^\d{4}$/.test(fields.yearStarted.trim()) || year < 1900 || year > thisYear) { setError("Please add the year your business started (for example 2015)."); return; }
    if (!noSite && !linkPattern.test(fields.site.trim())) { setError("Please add your website, Facebook page or Google listing, or check that your business doesn't have one."); return; }
    if (!attest) { setError("Please confirm you own or manage this business and want a quote."); return; }
    setBusy(true); setError("");
    const attribution = captureAttribution();
    const details = [
      code && { label: "Referral code", value: code },
      { label: "Referral landing page", value: "/refer" },
      { label: "Business type", value: fields.businessType.trim() },
      { label: "Mailing address", value: fields.mailingAddress.trim() },
      fields.dba.trim() && { label: "DBA", value: fields.dba.trim() },
      { label: "Legal entity type", value: fields.entity },
      { label: "Role at business", value: fields.role },
      { label: "Year business started", value: fields.yearStarted.trim() },
      { label: "Annual revenue", value: fields.revenue },
      { label: "Employees on payroll (W-2, not counting owners)", value: fields.employees },
      { label: "Subcontractors hired in a typical year", value: fields.subs },
      { label: "How they know the referrer", value: fields.relationship },
      { label: "Customers", value: fields.customers },
      { label: "Website or online page", value: noSite ? "None (checked: business has no website or online page)" : fields.site.trim() },
      fields.license.trim() && { label: "Contractor license #", value: fields.license.trim() },
      fields.currentInsurance.trim() && { label: "Current insurance / renewal", value: fields.currentInsurance.trim() },
      { label: "Owner/manager attestation", value: "Confirmed: owns or manages this business and wants a quote" },
      fields.needs.trim() && { label: "Coverage or project details", value: fields.needs.trim() },
      ...attributionDetails(attribution),
    ].filter(Boolean);
    try {
      const response = await fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        source: "customer-referral", name: fields.name.trim(), email: fields.email.trim().toLowerCase(), phone: fields.phone.trim(),
        company: fields.company.trim(), businessType: fields.businessType.trim(), zip: zipFromMailingAddress(fields.mailingAddress), details, website: fields.hp,
      }) });
      const result = await response.json();
      if (!response.ok || result.ok !== true || (result.crm !== "sent" && result.notification !== "sent")) throw new Error("save_failed");
      setDone(true);
    } catch { setError("We couldn't save your request. Please try again."); }
    finally { setBusy(false); }
  }
  if (done) return <div role="status" className="mt-7 rounded-xl bg-green-50 p-5 text-green-900"><h2 className="text-xl font-semibold">Thanks. We got your request.</h2><p className="mt-2">A Cohesive team member will review it and get in touch.</p></div>;
  const inputClass = "mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-3 text-base outline-none focus:border-[#2040E7] focus:ring-2 focus:ring-[#DDE4FF]";
  return <form onSubmit={submit} className="relative mt-7 space-y-4" noValidate>
    {code && <div className="rounded-lg bg-[#F1F5FF] px-4 py-3 text-sm text-[#294067]">Referral code <strong className="ml-1 font-mono">{code}</strong> is attached to your request.</div>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">Your name <span aria-hidden="true">*</span><input className={inputClass} autoComplete="name" value={fields.name} onChange={(e) => set("name", e.target.value)} required /></label>
      <label className="block text-sm font-medium">Legal business name <span aria-hidden="true">*</span><input className={inputClass} autoComplete="organization" value={fields.company} onChange={(e) => set("company", e.target.value)} placeholder="As registered, e.g. Smith Roofing LLC" required /></label>
      <label className="block text-sm font-medium">DBA / trade name (if different)<input className={inputClass} value={fields.dba} onChange={(e) => set("dba", e.target.value)} /></label>
      <label className="block text-sm font-medium">Business legal type <span aria-hidden="true">*</span><select className={inputClass} value={fields.entity} onChange={(e) => set("entity", e.target.value)} required><option value="">Choose one</option>{ENTITY.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium">Email <span aria-hidden="true">*</span><input className={inputClass} type="email" autoComplete="email" value={fields.email} onChange={(e) => set("email", e.target.value)} required /></label>
      <label className="block text-sm font-medium">Phone <span aria-hidden="true">*</span><input className={inputClass} type="tel" autoComplete="tel" value={fields.phone} onChange={(e) => set("phone", e.target.value)} required /></label>
      <label className="block text-sm font-medium">What does your business do? <span aria-hidden="true">*</span><input className={inputClass} value={fields.businessType} onChange={(e) => set("businessType", e.target.value)} placeholder="e.g. Roofing contractor" required /></label>
      <label className="block text-sm font-medium">Mailing address <span aria-hidden="true">*</span><AddressAutocomplete value={fields.mailingAddress} onChange={(value) => set("mailingAddress", value)} placeholder="123 Main St, city, state, ZIP" ariaLabel="Mailing address" required /></label>
    </div>
    <h3 className="pt-2 text-base font-semibold text-[#0F172A]">About your business</h3>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">Your role <span aria-hidden="true">*</span><select className={inputClass} value={fields.role} onChange={(e) => set("role", e.target.value)} required><option value="">Choose one</option>{ROLES.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium">Year the business started <span aria-hidden="true">*</span><input className={inputClass} inputMode="numeric" maxLength={4} value={fields.yearStarted} onChange={(e) => set("yearStarted", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 2015" required /></label>
      <label className="block text-sm font-medium">Annual revenue <span aria-hidden="true">*</span><select className={inputClass} value={fields.revenue} onChange={(e) => set("revenue", e.target.value)} required><option value="">Choose one</option>{REVENUE.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium">Employees on payroll (not counting owners) <span aria-hidden="true">*</span><select className={inputClass} value={fields.employees} onChange={(e) => set("employees", e.target.value)} required><option value="">Choose one</option>{EMPLOYEES.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium">Subcontractors you hire in a typical year <span aria-hidden="true">*</span><select className={inputClass} value={fields.subs} onChange={(e) => set("subs", e.target.value)} required><option value="">Choose one</option>{SUBS.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium sm:col-span-2">How do you know the person who referred you? <span aria-hidden="true">*</span><select className={inputClass} value={fields.relationship} onChange={(e) => set("relationship", e.target.value)} required><option value="">Choose one</option>{RELATIONSHIP.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium sm:col-span-2">Who are most of your customers? <span aria-hidden="true">*</span><select className={inputClass} value={fields.customers} onChange={(e) => set("customers", e.target.value)} required><option value="">Choose one</option>{CUSTOMERS.map((o) => <option key={o}>{o}</option>)}</select></label>
      <div className="sm:col-span-2"><label className="block text-sm font-medium">Website, Facebook page or Google listing <span aria-hidden="true">*</span><input className={inputClass} inputMode="url" autoCapitalize="none" value={fields.site} onChange={(e) => set("site", e.target.value)} placeholder="yourbusiness.com or facebook.com/yourbusiness" disabled={noSite} /></label>
        <label className="mt-2 flex items-center gap-2 text-sm text-[#405066]"><input type="checkbox" className="h-4 w-4" checked={noSite} onChange={(e) => { setNoSite(e.target.checked); if (e.target.checked) set("site", ""); }} />My business doesn&apos;t have a website or any online page</label></div>
      <label className="block text-sm font-medium">Contractor license # (if you have one)<input className={inputClass} value={fields.license} onChange={(e) => set("license", e.target.value)} /></label>
      <label className="block text-sm font-medium sm:col-span-2">Current insurance company and renewal month<input className={inputClass} value={fields.currentInsurance} onChange={(e) => set("currentInsurance", e.target.value)} placeholder="e.g. renews in March, or none yet" /></label>
    </div>
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={fields.hp} onChange={(e) => set("hp", e.target.value)} /></label></div>
    <label className="block text-sm font-medium">What coverage or project do you need help with?<textarea className={inputClass} rows={3} value={fields.needs} onChange={(e) => set("needs", e.target.value)} /></label>
    <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4" checked={attest} onChange={(e) => setAttest(e.target.checked)} required /><span>I own or manage this business and I want an insurance quote for it. <span aria-hidden="true">*</span></span></label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={busy} type="submit" className="w-full rounded-xl bg-[#2040E7] px-5 py-4 font-semibold text-white hover:bg-[#1835C9] disabled:opacity-50">{busy ? "Sending…" : "Request a quote"}</button>
    <p className="text-xs leading-relaxed text-[#64748B]">By sending this form, you ask Cohesive to contact you about business insurance. See our <a href="/privacy" className="underline">privacy policy</a>.</p>
  </form>;
}
