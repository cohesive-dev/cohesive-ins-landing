"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { captureAttribution, attributionDetails } from "@/lib/attribution";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { PAYROLL, SUBCONTRACTOR_COSTS } from "@/lib/contractor-full-options";
import { hasMailableAddress, stateFromMailingAddress, zipFromMailingAddress } from "@/lib/mailing-address";
import { ENCORE_CLOSED_STATES, ENCORE_OPEN_STATE_NAMES, US_STATES } from "@/lib/encore-states";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const INDUSTRIES = ["Contractor or trade business", "Church or house of worship", "Commercial property owner", "Restaurant or bar", "Other"];
// Nam 11/21: make clear home services + facility maintenance are "contractor/trade" (a painter picked "Other").
const INDUSTRY_LABELS: Record<string, string> = { "Contractor or trade business": "Contractor or trade business (incl. home services, facility maintenance)" };
const CONTRACTOR_INDUSTRIES = new Set(["Contractor or trade business", "Cleaning business"]);
const ENTITY = ["Sole proprietor", "LLC", "Corporation (Inc. / Corp.)", "Partnership", "Nonprofit", "Other"];
const ROLES = ["Owner", "Partner / co-owner", "Manager", "Office / admin staff", "Other"];
const REVENUE = ["Not started yet", "Under $100,000", "$100,000 - $250,000", "$250,000 - $500,000", "$500,000 - $1 million", "$1 million - $5 million", "Over $5 million"];
const RELATIONSHIP = ["We've worked together on jobs", "I'm their customer / they're my customer", "Friend or family", "Same trade or business group", "Saw an online ad or post", "Other"];
const CUSTOMERS = ["Mostly homeowners (residential)", "Mostly businesses or GCs (commercial)", "Both about equally"];
// Nam 11/21: a website / online page is required (no "none" checkbox) and must be a real URL.
// Social/listing hosts need the business's own page path (facebook.com alone is not a business).
const SOCIAL_HOSTS = /(^|\.)(facebook|fb|instagram|google|goo|yelp|nextdoor|angi|angieslist|houzz|thumbtack|linkedin|tiktok|x|twitter|bbb|homeadvisor|youtube)\.[a-z.]+$/i;
function normalizeSiteUrl(raw: string): string | null {
  const text = raw.trim();
  if (!text || /\s/.test(text)) return null;
  let url: URL;
  try { url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`); } catch { return null; }
  if (!/^https?:$/.test(url.protocol)) return null;
  const host = url.hostname.toLowerCase();
  if (!/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}$/.test(host)) return null;
  if (SOCIAL_HOSTS.test(host) && url.pathname.replace(/\/+$/, "").length < 2) return null;
  return url.toString();
}
const thisYear = new Date().getFullYear();
// Nam 11/21: qualify referrals on renewal timing + current insurance; payroll only (no employee yes/no).
const ALCOHOL = ["No alcohol", "Under 25% of sales", "25% - 50% of sales", "Over 50% of sales"];
const PREMISES = ["Own", "Rent / lease", "Meet in someone else's space"];
const NO_PAYROLL = "$0 - no W2 employees";
const PAYROLL_CHOICES = [{ label: "$0 - no W2 employees (just owners / subs)", value: NO_PAYROLL }, ...PAYROLL];
const RENEWS = ["Within 30 days", "In 1 - 3 months", "In 3 - 6 months", "In 6+ months", "Not sure"];
const NEED_BY = ["Within 30 days", "In 1 - 3 months", "Just comparing for now"];
// Nam 11/21: FB-ad partners' no-website referrals must prove the business (FEIN or a document). Images are shrunk in the
// browser (~1600px JPEG) so phone photos fit the request; the server re-checks everything (app/api/intake).
const PROOF_MAX = 2_400_000;
async function readProof(file: File): Promise<{ name: string; type: string; data: string }> {
  const toB64 = (blob: Blob) => new Promise<string>((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result).replace(/^data:[^,]*,/, "")); r.onerror = bad; r.readAsDataURL(blob); });
  if (file.type.startsWith("image/")) {
    try {
      const url = URL.createObjectURL(file);
      const img = await new Promise<HTMLImageElement>((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = url; });
      const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale); canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.82));
      if (blob) return { name: file.name.replace(/\.[^.]+$/, "") + ".jpg", type: "image/jpeg", data: await toB64(blob) };
    } catch { /* browser can't decode it (e.g. HEIC): send as-is, the team reviews by hand */ }
  }
  if (file.size > PROOF_MAX) throw new Error("too_big");
  return { name: file.name, type: file.type || "application/octet-stream", data: await toB64(file) };
}
const PAYING = ["Under $2,000", "$2,000 - $5,000", "$5,000 - $20,000", "Over $20,000", "Not sure"];

export default function ReferralForm({ code }: { code: string }) {
  const [fields, setFields] = useState({ name: "", email: "", phone: "", company: "", businessType: "", mailingAddress: "", needs: "",
    role: "", yearStarted: "", revenue: "", payroll: "", insured: "", renews: "", paying: "", needBy: "", usesSubs: "", subCosts: "", entity: "", dba: "", industry: "", relationship: "", site: "", alcohol: "", premises: "", currentInsurance: "", customers: "", hp: "" });
  const [noSite, setNoSite] = useState(false);
  const [proofNeeded, setProofNeeded] = useState(false);
  const [fein, setFein] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  useEffect(() => {
    if (!code) return;
    fetch(`/api/referral-check?code=${encodeURIComponent(code)}`).then((r) => r.json()).then((j) => setProofNeeded(j?.proof === true)).catch(() => {});
  }, [code]);
  const [attest, setAttest] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    captureAttribution();
  }, []);
  // Nam 11/20: capture abandoned referral fills like every other form (a partial is a real lead),
  // but the partner gets no credit for it. The code rides under its own label, never "Referral code",
  // so referral_partner_payouts (keys on formAnswers."Referral code") and the partner notice
  // (completed submits only) never see it. A later completed submit carries the code as usual.
  const sentPartial = useRef(false);
  const partialInFlight = useRef(false);
  const capturePartial = useCallback(() => {
    if (sentPartial.current || partialInFlight.current || done || busy || fields.hp) return;
    const email = fields.email.trim().toLowerCase();
    const phone = fields.phone.trim();
    const validEmail = emailPattern.test(email) ? email : undefined;
    if (!validEmail && phone.replace(/\D/g, "").length < 10) return;
    const attribution = captureAttribution();
    const details = [
      { label: "Referral form", value: "Partial (abandoned) - no referral credit" },
      code && { label: "Referral link code (partial, no credit)", value: code },
      { label: "Referral landing page", value: "/refer" },
      fields.industry && { label: "Industry", value: fields.industry },
      fields.businessType.trim() && { label: "Business type", value: fields.businessType.trim() },
      fields.mailingAddress.trim() && { label: "Mailing address", value: fields.mailingAddress.trim() },
      fields.entity && { label: "Legal entity type", value: fields.entity },
      fields.revenue && { label: "Annual revenue", value: fields.revenue },
      fields.needs.trim() && { label: "Coverage or project details", value: fields.needs.trim() },
      ...attributionDetails(attribution),
    ].filter(Boolean);
    const body = JSON.stringify({
      source: "customer-referral", partial: true, final: true,
      name: fields.name.trim() || undefined, email: validEmail, phone: phone || undefined,
      company: fields.company.trim() || undefined, businessType: fields.businessType.trim() || undefined,
      zip: zipFromMailingAddress(fields.mailingAddress) || undefined, details,
    });
    try {
      if (!navigator.sendBeacon("/api/intake", new Blob([body], { type: "application/json" }))) throw new Error("beacon refused");
      sentPartial.current = true;
    } catch {
      partialInFlight.current = true;
      fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true })
        .then((response) => { if (response.ok) sentPartial.current = true; })
        .catch(() => {}).finally(() => { partialInFlight.current = false; });
    }
  }, [busy, code, done, fields]);
  useEffect(() => {
    const onHide = () => capturePartial();
    const onVisibility = () => { if (document.visibilityState === "hidden") capturePartial(); };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.removeEventListener("pagehide", onHide); document.removeEventListener("visibilitychange", onVisibility); };
  }, [capturePartial]);
  const addressState = stateFromMailingAddress(fields.mailingAddress)
    ?? Object.entries(US_STATES).find(([, n]) => new RegExp(`\\b${n}\\b,?\\s*\\d{5}`, "i").test(fields.mailingAddress))?.[0];
  const outOfArea = CONTRACTOR_INDUSTRIES.has(fields.industry) && !!addressState && ENCORE_CLOSED_STATES.has(addressState);
  // Nam 11/21: questions differ by industry. Subs + customer mix are contractor questions; restaurants
  // get alcohol, churches get own/rent; property owners skip payroll.
  const isContractor = fields.industry === "Contractor or trade business";
  const isRestaurant = fields.industry === "Restaurant or bar";
  const isChurch = fields.industry === "Church or house of worship";
  const askPayroll = !!fields.industry && fields.industry !== "Commercial property owner";
  const revenueLabel = isChurch ? "Annual budget / giving (roughly)" : fields.industry === "Commercial property owner" ? "Annual rental income (roughly)" : "Annual revenue";
  function set(key: keyof typeof fields, value: string) { setFields((current) => ({ ...current, [key]: value })); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!fields.name.trim() || !fields.company.trim() || !fields.businessType.trim() || !emailPattern.test(fields.email.trim()) || fields.phone.replace(/\D/g, "").length < 10) {
      setError("Please add your name, business, type of work, email and phone number."); return;
    }
    if (!fields.industry) { setError("Please choose your industry."); return; }
    if (!hasMailableAddress(fields.mailingAddress)) { setError("Please add your full mailing address, including ZIP code."); return; }
    if (outOfArea) return;
    const year = Number(fields.yearStarted.trim());
    if (!fields.entity || !fields.role || !fields.revenue || (askPayroll && !fields.payroll) || (isContractor && (!fields.usesSubs || (fields.usesSubs === "Yes" && !fields.subCosts) || !fields.customers)) || (isRestaurant && !fields.alcohol) || (isChurch && !fields.premises) || !fields.relationship) { setError("Please answer each of the business questions."); return; }
    if (!fields.insured || (fields.insured === "Yes" && (!fields.renews || !fields.paying)) || (fields.insured === "No" && !fields.needBy)) { setError("Please tell us about your current insurance and when it renews."); return; }
    if (!/^\d{4}$/.test(fields.yearStarted.trim()) || year < 1900 || year > thisYear) { setError("Please add the year your business started (for example 2015)."); return; }
    if (!attest) { setError("Please confirm you own or manage this business and want a quote."); return; }
    // Nam 11/21: website stays optional ("none" checkbox), but a link that is given must be a real URL.
    const siteUrl = noSite ? null : normalizeSiteUrl(fields.site);
    if (!noSite && !siteUrl) { setError("Please add your business's website or online page as a full link (e.g. smithroofing.com or facebook.com/smithroofing), or check that your business doesn't have one."); return; }
    if (siteUrl) setBusy(true);
    if (siteUrl) try {
      const check = await fetch(`/api/site-check?url=${encodeURIComponent(siteUrl)}`).then((r) => r.json()).catch(() => ({ ok: true }));
      if (check.ok === false) { setBusy(false); setError("We couldn't find that website. Please check the link to your business's website or online page."); return; }
    } catch { /* network trouble: don't block the submit */ }
    const needProof = proofNeeded && noSite;
    if (needProof && !fein.trim() && !proofFile) { setError("Since the business has no website, please add its FEIN (federal tax ID) or upload a photo or PDF of a business document."); return; }
    let proof: Awaited<ReturnType<typeof readProof>> | undefined;
    if (needProof && proofFile) {
      try { proof = await readProof(proofFile); } catch { setError("That file is too large. Please upload a photo or a PDF under 2.5 MB."); return; }
    }
    setBusy(true); setError("");
    const attribution = captureAttribution();
    const details = [
      code && { label: "Referral code", value: code },
      { label: "Referral landing page", value: "/refer" },
      { label: "Industry", value: fields.industry },
      { label: "Business type", value: fields.businessType.trim() },
      { label: "Mailing address", value: fields.mailingAddress.trim() },
      fields.dba.trim() && { label: "DBA", value: fields.dba.trim() },
      { label: "Legal entity type", value: fields.entity },
      { label: "Role at business", value: fields.role },
      { label: "Year business started", value: fields.yearStarted.trim() },
      { label: "Annual revenue", value: fields.revenue },
      askPayroll && { label: "Has W2 employees (not counting owners)", value: fields.payroll === NO_PAYROLL ? "No" : "Yes" },
      askPayroll && { label: isContractor ? "Annual W2 payroll for your field crew (roughly)" : "Annual W2 payroll (roughly)", value: fields.payroll === NO_PAYROLL ? "$0 (no W2 employees)" : fields.payroll },
      isRestaurant && { label: "Alcohol share of sales", value: fields.alcohol },
      isChurch && { label: "Own or rent the building", value: fields.premises },
      { label: "Has business insurance now", value: fields.insured },
      fields.insured === "Yes" && { label: "Current policy renews", value: fields.renews },
      fields.insured === "Yes" && { label: "Current premium per year (client stated)", value: fields.paying },
      fields.insured === "No" && { label: "Needs coverage by", value: fields.needBy },
      isContractor && { label: "Do you hire subcontractors?", value: fields.usesSubs },
      isContractor && fields.usesSubs === "Yes" && { label: "Annual subcontractor costs (roughly)", value: fields.subCosts },
      { label: "How they know the referrer", value: fields.relationship },
      isContractor && { label: "Customers", value: fields.customers },
      { label: "Website or online page", value: siteUrl || "None (checked: business has no website or online page)" },
      needProof && fein.trim() && { label: "FEIN", value: fein.trim() },
      { label: "Current insurance / renewal", value: [fields.insured === "Yes" ? `Insured; renews: ${fields.renews}; pays ${fields.paying}/yr` : `Not insured; needs coverage: ${fields.needBy}`, fields.currentInsurance.trim() && `carrier: ${fields.currentInsurance.trim()}`].filter(Boolean).join("; ") },
      { label: "Owner/manager attestation", value: "Confirmed: owns or manages this business and wants a quote" },
      fields.needs.trim() && { label: "Coverage or project details", value: fields.needs.trim() },
      ...attributionDetails(attribution),
    ].filter(Boolean);
    try {
      const response = await fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        source: "customer-referral", name: fields.name.trim(), email: fields.email.trim().toLowerCase(), phone: fields.phone.trim(),
        company: fields.company.trim(), businessType: fields.businessType.trim(), zip: zipFromMailingAddress(fields.mailingAddress), details, website: fields.hp, ...(proof ? { proof } : {}),
      }) });
      const result = await response.json();
      if (response.status === 400 && typeof result.error === "string" && /FEIN/.test(result.error)) { setProofNeeded(true); setError(result.error); return; }
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
      <label className="block text-sm font-medium">Industry <span aria-hidden="true">*</span><select className={inputClass} value={fields.industry} onChange={(e) => set("industry", e.target.value)} required><option value="">Choose one</option>{INDUSTRIES.map((o) => <option key={o} value={o}>{INDUSTRY_LABELS[o] ?? o}</option>)}</select></label>
      <label className="block text-sm font-medium">What does your business do? <span aria-hidden="true">*</span><input className={inputClass} value={fields.businessType} onChange={(e) => set("businessType", e.target.value)} placeholder="e.g. Roofing contractor" required /></label>
      <label className="block text-sm font-medium">Mailing address <span aria-hidden="true">*</span><AddressAutocomplete value={fields.mailingAddress} onChange={(value) => set("mailingAddress", value)} placeholder="123 Main St, city, state, ZIP" ariaLabel="Mailing address" required /></label>
    </div>
    <h3 className="pt-2 text-base font-semibold text-[#0F172A]">About your business</h3>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">Your role <span aria-hidden="true">*</span><select className={inputClass} value={fields.role} onChange={(e) => set("role", e.target.value)} required><option value="">Choose one</option>{ROLES.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium">Year the business started <span aria-hidden="true">*</span><input className={inputClass} inputMode="numeric" maxLength={4} value={fields.yearStarted} onChange={(e) => set("yearStarted", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 2015" required /></label>
      <label className="block text-sm font-medium">{revenueLabel} <span aria-hidden="true">*</span><select className={inputClass} value={fields.revenue} onChange={(e) => set("revenue", e.target.value)} required><option value="">Choose one</option>{REVENUE.map((o) => <option key={o}>{o}</option>)}</select></label>
      {askPayroll && <label className="block text-sm font-medium">{isContractor ? "Annual W2 payroll for your field crew (roughly)" : "Annual W2 payroll (roughly)"} <span aria-hidden="true">*</span><span className="block text-xs font-normal text-[#64748B]">{isContractor ? "Wages to people who do the work. Leave out owners, office staff and subs." : "Total yearly wages to employees. Leave out owners."}</span><select className={inputClass} value={fields.payroll} onChange={(e) => set("payroll", e.target.value)} required><option value="">Choose one</option>{PAYROLL_CHOICES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>}
      {isContractor && <label className="block text-sm font-medium">Do you hire subcontractors? <span aria-hidden="true">*</span><select className={inputClass} value={fields.usesSubs} onChange={(e) => set("usesSubs", e.target.value)} required><option value="">Choose one</option><option>Yes</option><option>No</option></select></label>}
      {isContractor && fields.usesSubs === "Yes" ? <label className="block text-sm font-medium">Annual subcontractor costs (roughly) <span aria-hidden="true">*</span><span className="block text-xs font-normal text-[#64748B]">Total paid to subcontractors each year.</span><select className={inputClass} value={fields.subCosts} onChange={(e) => set("subCosts", e.target.value)} required><option value="">Choose one</option>{SUBCONTRACTOR_COSTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label> : <div className="hidden sm:block" />}
      <label className="block text-sm font-medium sm:col-span-2">How do you know the person who referred you? <span aria-hidden="true">*</span><select className={inputClass} value={fields.relationship} onChange={(e) => set("relationship", e.target.value)} required><option value="">Choose one</option>{RELATIONSHIP.map((o) => <option key={o}>{o}</option>)}</select></label>
      {isContractor && <label className="block text-sm font-medium sm:col-span-2">Who are most of your customers? <span aria-hidden="true">*</span><select className={inputClass} value={fields.customers} onChange={(e) => set("customers", e.target.value)} required><option value="">Choose one</option>{CUSTOMERS.map((o) => <option key={o}>{o}</option>)}</select></label>}
      {isRestaurant && <label className="block text-sm font-medium">How much of your sales is alcohol? <span aria-hidden="true">*</span><select className={inputClass} value={fields.alcohol} onChange={(e) => set("alcohol", e.target.value)} required><option value="">Choose one</option>{ALCOHOL.map((o) => <option key={o}>{o}</option>)}</select></label>}
      {isChurch && <label className="block text-sm font-medium">Do you own or rent your building? <span aria-hidden="true">*</span><select className={inputClass} value={fields.premises} onChange={(e) => set("premises", e.target.value)} required><option value="">Choose one</option>{PREMISES.map((o) => <option key={o}>{o}</option>)}</select></label>}
      <div className="sm:col-span-2"><label className="block text-sm font-medium">Website, Facebook page or Google listing<input className={inputClass} inputMode="url" autoCapitalize="none" value={fields.site} onChange={(e) => set("site", e.target.value)} placeholder="yourbusiness.com or facebook.com/yourbusiness" disabled={noSite} /></label>
        <label className="mt-2 flex items-center gap-2 text-sm text-[#405066]"><input type="checkbox" className="h-4 w-4" checked={noSite} onChange={(e) => { setNoSite(e.target.checked); if (e.target.checked) set("site", ""); }} />My business doesn&apos;t have a website or any online page</label>
        {noSite && proofNeeded && <div className="mt-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3 text-sm">
          <p className="text-[#405066]">No website is fine. To confirm the business, add its FEIN <em>or</em> upload a photo/PDF of a business document (license, EIN letter, invoice, insurance page).</p>
          <label className="mt-2 block font-medium">FEIN (federal tax ID)<input className={inputClass} inputMode="numeric" value={fein} onChange={(e) => setFein(e.target.value)} placeholder="12-3456789" /></label>
          <label className="mt-2 block font-medium">Or upload a business document<input className="mt-1 block w-full text-sm" type="file" accept="image/*,application/pdf" onChange={(e) => setProofFile(e.target.files?.[0] ?? null)} /></label>
        </div>}</div>
    </div>
    <h3 className="pt-2 text-base font-semibold text-[#0F172A]">Your current insurance</h3>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">Do you have business insurance right now? <span aria-hidden="true">*</span><select className={inputClass} value={fields.insured} onChange={(e) => set("insured", e.target.value)} required><option value="">Choose one</option>{["Yes", "No"].map((o) => <option key={o}>{o}</option>)}</select></label>
      {fields.insured === "Yes" && <>
      <label className="block text-sm font-medium">When does your current policy renew? <span aria-hidden="true">*</span><select className={inputClass} value={fields.renews} onChange={(e) => set("renews", e.target.value)} required><option value="">Choose one</option>{RENEWS.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium">About how much do you pay a year? <span aria-hidden="true">*</span><select className={inputClass} value={fields.paying} onChange={(e) => set("paying", e.target.value)} required><option value="">Choose one</option>{PAYING.map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block text-sm font-medium">Current insurance company (optional)<input className={inputClass} value={fields.currentInsurance} onChange={(e) => set("currentInsurance", e.target.value)} /></label>
      </>}
      {fields.insured === "No" && <label className="block text-sm font-medium">When do you need coverage? <span aria-hidden="true">*</span><select className={inputClass} value={fields.needBy} onChange={(e) => set("needBy", e.target.value)} required><option value="">Choose one</option>{NEED_BY.map((o) => <option key={o}>{o}</option>)}</select></label>}
    </div>
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={fields.hp} onChange={(e) => set("hp", e.target.value)} /></label></div>
    <label className="block text-sm font-medium">What coverage or project do you need help with?<textarea className={inputClass} rows={3} value={fields.needs} onChange={(e) => set("needs", e.target.value)} /></label>
    <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4" checked={attest} onChange={(e) => setAttest(e.target.checked)} required /><span>I own or manage this business and I want an insurance quote for it. <span aria-hidden="true">*</span></span></label>
    {outOfArea && <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"><p className="font-semibold">Sorry, we don&apos;t insure contractors in {US_STATES[addressState!] || addressState} yet.</p><p className="mt-1">Right now we only serve contractors in these states: {ENCORE_OPEN_STATE_NAMES.join(", ")}.</p></div>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={busy || outOfArea} type="submit" className="w-full rounded-xl bg-[#2040E7] disabled:cursor-not-allowed disabled:bg-[#94A3B8] px-5 py-4 font-semibold text-white hover:bg-[#1835C9] disabled:hover:bg-[#94A3B8] disabled:opacity-60">{busy ? "Sending…" : "Request a quote"}</button>
    <p className="text-xs leading-relaxed text-[#64748B]">By sending this form, you ask Cohesive to contact you about business insurance. See our <a href="/privacy" className="underline">privacy policy</a>.</p>
  </form>;
}
