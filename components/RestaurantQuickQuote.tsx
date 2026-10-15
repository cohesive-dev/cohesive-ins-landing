"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js/min";
import isEmail from "validator/lib/isEmail";
import { track as vaTrack } from "@vercel/analytics";
import { captureAttribution, attributionDetails } from "@/lib/attribution";
import PartialCaptureDisclosure from "@/components/PartialCaptureDisclosure";
import { REQUESTED_COVERAGE_LABELS, type RequestedCoverage } from "@/lib/requested-coverage";

// Short quote form for the restaurant SEO pages (/insurance/<restaurant type>[/<state>[/<city>]]) and
// the restaurant cost guide (Kevin 2026-10-12). Restaurant SEO pages had 10,777 impressions and 25 clicks
// in 28 days, and the CRM had 0 organic restaurant leads in 60 days, while the short contractor form
// produced all 61 SEO leads. This asks only what a first conversation needs; revenue, alcohol share,
// address and the rest are collected afterwards by our team. /restaurant and paid traffic keep the full
// RestaurantIntakeForm unchanged.
//
// Backend contract = RestaurantIntakeForm's (POST /api/intake, same per-page `source`, eventId +
// capiEventName, `details` rows), plus `company` so the CRM Account carries the business name. Absent
// answers are OMITTED, never defaulted: no "Restaurant" business type, no "None" claims, no assumed
// alcohol share.

// Values mirror RestaurantIntakeForm's BUSINESS_TYPES so the quoter reads the same strings and Rainbow
// class codes from either form. ("Not a food business" is left out: this form only renders on food pages.)
export const BAR_TYPE = "Bar / tavern / brewery";
export const SOMETHING_ELSE = "__something_else";
export const RESTAURANT_TYPE_CHOICES: Array<{ value: string; rainbowClass?: string }> = [
  { value: "Coffee / café / bakery (little or no cooking)", rainbowClass: "E" },
  { value: "Fast food / counter service (grill or fryer)", rainbowClass: "A" },
  { value: "Full-service / sit-down restaurant", rainbowClass: "Z" },
  { value: "Fine dining", rainbowClass: "D" },
  { value: "Food truck / cart", rainbowClass: "J" },
  { value: BAR_TYPE },
];

// Page slug -> the matching choice. A page with no exact match (a deli, a Chinese restaurant, a caterer)
// pre-fills its own name instead, listed first, so the page never forces a mismatched class.
const PAGE_CHOICE: Record<string, string> = {
  "coffee-shop": RESTAURANT_TYPE_CHOICES[0].value,
  bakery: RESTAURANT_TYPE_CHOICES[0].value,
  "fast-food-restaurant": RESTAURANT_TYPE_CHOICES[1].value,
  restaurant: RESTAURANT_TYPE_CHOICES[2].value,
  "fine-dining-restaurant": RESTAURANT_TYPE_CHOICES[3].value,
  "food-truck": RESTAURANT_TYPE_CHOICES[4].value,
  bar: BAR_TYPE,
};

export type RestaurantPageType = { slug: string; noun: string };

// The page's type is PAGE CONTEXT (as with the contractor form's page trade): it pre-fills a visible,
// editable select, and rides along as "Page type". It becomes the client's answer only when they
// submit with it, or change the select themselves.
export function pageTypeChoice(pageType?: RestaurantPageType): string {
  if (!pageType) return "";
  return PAGE_CHOICE[pageType.slug] ?? `${pageType.noun[0].toUpperCase()}${pageType.noun.slice(1)}`;
}
export function restaurantTypeOptions(pageType?: RestaurantPageType): string[] {
  const generic = RESTAURANT_TYPE_CHOICES.map((c) => c.value);
  const own = pageTypeChoice(pageType);
  return own && !generic.includes(own) ? [own, ...generic] : generic;
}
export function statedType(choice: string, other: string): string {
  return choice === SOMETHING_ELSE ? other.trim() : choice.trim();
}
export function rainbowClassFor(type: string): string | undefined {
  return RESTAURANT_TYPE_CHOICES.find((c) => c.value === type)?.rainbowClass;
}

// RestaurantIntakeForm.qualify() with the alcohol share not yet asked. A bar on a restaurant page keeps
// today's routing (RestaurantDisqualified: quotes@ + Hedge, no CRM fan-out, no Lead); on a bar page
// (mode "bar") a bar is the audience and goes through as an E&S lead, exactly as the long form does.
export function capiEventFor(type: string, mode: "restaurant" | "bar"): "Lead" | "RestaurantLeadES" | "RestaurantDisqualified" {
  if (type === BAR_TYPE) return mode === "bar" ? "RestaurantLeadES" : "RestaurantDisqualified";
  return "Lead";
}

export const RENEWAL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const NOT_ASKED = "Revenue, alcohol share of sales, exact address, business structure, own or rent, opening date and claims. Collect these from the client before quoting.";
// Workers' comp pages (restaurant workers' comp guide, 2026-10-15) also leave payroll and headcount for later.
const NOT_ASKED_WC = "Payroll, number of full-time and part-time employees, delivery or catering staff and claims. Collect these from the client before quoting workers' comp.";

const emailOk = (v: string) => isEmail(v.trim());
const phoneOk = (v: string) => isValidPhoneNumber(v.trim(), "US");

type Answers = { company: string; renewal: string };
// Detail rows for quotes@ and the CRM note. Only what the visitor gave, plus page context and attribution.
function detailsFor(f: Answers, stated: string | undefined, pageLabel: string | undefined, coverage?: RequestedCoverage[]) {
  const captured = captureAttribution();
  // Referrer = the external referrer captureAttribution stored (own-site referrers are unknown, not a source).
  const a = { ...captured, landing_page: captured.landing_page || window.location.pathname };
  const rainbowClass = stated ? rainbowClassFor(stated) : undefined;
  return [
    f.company.trim() && { label: "Business name", value: f.company.trim() },
    stated && { label: "Business type", value: stated },
    rainbowClass && { label: "Rainbow class", value: rainbowClass },
    pageLabel && { label: "Page type", value: pageLabel },
    f.renewal && { label: "Current policy renews", value: f.renewal },
    { label: "Form layout", value: "seo-short" },
    coverage?.length && { label: "Coverage requested", value: coverage.map((c) => REQUESTED_COVERAGE_LABELS[c]).join(", ") },
    { label: "Not asked on this form", value: coverage?.includes("Workers Comp") ? NOT_ASKED_WC : NOT_ASKED },
    ...attributionDetails(a),
    a.referrer && { label: "Referrer", value: a.referrer },
  ].filter(Boolean);
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
}

export default function RestaurantQuickQuote({
  source,
  mode = "restaurant",
  pageType,
  coverageRequested,
}: {
  // The page's own CRM attribution label (e.g. "seo-coffee-shop-north-carolina"), as before.
  source: string;
  mode?: "restaurant" | "bar";
  pageType?: RestaurantPageType;
  // Coverage the page asks the CRM to record (restaurant workers' comp guide: ["Workers Comp"]). Sent as the
  // top-level `coverage` key, which /api/intake forwards only when every value is allowlisted.
  coverageRequested?: RequestedCoverage[];
}) {
  const [f, setF] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    zip: "",
    type: pageTypeChoice(pageType),
    otherType: "",
    renewal: "",
  });
  // True once the visitor changes the type themselves; a pre-filled, untouched type is page context.
  const [typeTouched, setTypeTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "referred">("idle");
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { captureAttribution(); }, []);

  const fired = useRef<Set<string>>(new Set());
  const track = useCallback((name: string, props?: Record<string, string>) => {
    if (fired.current.has(name)) return;
    fired.current.add(name);
    fbq("trackCustom", name);
    try { vaTrack(name, { layout: "seo-short", source, ...(props ?? {}) }); } catch { /* analytics never blocks */ }
  }, [source]);

  const pageLabel = pageType ? pageTypeChoice(pageType) : undefined;

  const sentPartial = useRef(false);
  const partialInFlight = useRef(false);
  const capturePartial = useCallback(() => {
    if (sentPartial.current || partialInFlight.current) return;
    if (status !== "idle") return;
    const email = f.email.trim().toLowerCase();
    const phone = f.phone.trim();
    const validEmail = emailOk(email) ? email : undefined;
    if (!validEmail && !phone) return;
    const stated = typeTouched ? statedType(f.type, f.otherType) : "";
    const body = JSON.stringify({
      name: f.name.trim() || undefined,
      email: validEmail,
      phone: phone || undefined,
      zip: f.zip.trim() || undefined,
      company: f.company.trim() || undefined,
      ...(stated ? { businessType: stated } : {}),
      source,
      ...(coverageRequested?.length ? { coverage: coverageRequested } : {}),
      partial: true,
      final: true,
      details: detailsFor(f, stated || undefined, pageLabel, coverageRequested),
    });
    try {
      const accepted = navigator.sendBeacon("/api/intake", new Blob([body], { type: "application/json" }));
      if (!accepted) throw new Error("beacon refused");
      sentPartial.current = true;
    } catch {
      partialInFlight.current = true;
      fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true })
        .then((response) => { if (response.ok) sentPartial.current = true; })
        .catch(() => {})
        .finally(() => { partialInFlight.current = false; });
    }
  }, [coverageRequested, f, pageLabel, source, status, typeTouched]);

  const abandon = useCallback(() => {
    if (status !== "idle" || !fired.current.has("FormStart") || fired.current.has("RestFormAbandon")) return;
    track("RestFormAbandon", { milestone: fired.current.has("ContactDone") ? "contact" : "start" });
  }, [status, track]);

  useEffect(() => {
    const onHide = () => { capturePartial(); abandon(); };
    const onVisibility = () => { if (document.visibilityState === "hidden") onHide(); };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [capturePartial, abandon]);

  // Client-side navigation (a Next <Link> to another page) unmounts the form without pagehide: capture then too.
  const onLeave = useRef(() => {});
  useEffect(() => {
    onLeave.current = () => { capturePartial(); abandon(); };
  }, [capturePartial, abandon]);
  useEffect(() => () => onLeave.current(), []);

  // Reset after every edit: captures the latest snapshot after 120 seconds without another answer.
  useEffect(() => {
    const timer = setTimeout(() => capturePartial(), 120_000);
    return () => clearTimeout(timer);
  }, [capturePartial]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    track("FormStart");
    if (k === "type") setTypeTouched(true);
    const next = { ...f, [k]: e.target.value };
    if (next.name.trim() && emailOk(next.email) && phoneOk(next.phone)) track("ContactDone");
    setF(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const email = f.email.trim().toLowerCase();
    const stated = statedType(f.type, f.otherType);
    if (!f.company.trim()) return setErr("Please add your business name.");
    if (!stated) return setErr(f.type === SOMETHING_ELSE ? "Please tell us what kind of restaurant you run." : "Please choose your type of restaurant.");
    if (!f.name.trim()) return setErr("Please add your name.");
    if (!emailOk(email)) return setErr("Please enter a valid email so we can send your quote.");
    if (!phoneOk(f.phone)) return setErr("Please enter a valid phone number so our team can reach you.");
    const capiEventName = capiEventFor(stated, mode);
    const eventId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setErr(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(),
          email,
          phone: f.phone.trim(),
          zip: f.zip.trim() || undefined,
          company: f.company.trim(),
          businessType: stated,
          source,
          ...(coverageRequested?.length ? { coverage: coverageRequested } : {}),
          details: detailsFor(f, stated, pageLabel, coverageRequested),
          eventId,
          capiEventName,
        }),
        keepalive: true,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || (result.crm !== "sent" && result.notification !== "sent")) {
        throw new Error("intake_not_accepted");
      }
      // Browser events only after the server accepted the lead, with the shared id for CAPI dedupe.
      if (capiEventName === "Lead") {
        fbq("track", "Lead", {}, { eventID: eventId });
        fbq("trackCustom", "RestaurantQuoteSubmit");
      } else {
        fbq("trackCustom", capiEventName, {}, { eventID: eventId });
      }
      try { vaTrack("RestShortSubmit", { source, outcome: capiEventName }); } catch { /* ignore */ }
      setStatus(capiEventName === "RestaurantDisqualified" ? "referred" : "done");
    } catch {
      fbq("trackCustom", "SubmitError");
      setStatus("idle");
      setErr("We couldn't save your request. Please try again, or call (929) 594-5450.");
    }
  };

  if (status === "done" || status === "referred") {
    return (
      <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-8 text-center">
        <div className="text-lg font-extrabold text-[#131517] mb-1.5">
          {status === "done" ? "Got it - we’re on it." : "Thanks for reaching out."}
        </div>
        <p className="text-sm text-[#6B6D71]">
          {status === "done"
            ? "One of our licensed agents will be in touch shortly about your quote and the few details we still need. "
            : "This is a risk we’ll need a bit longer on to get you the best possible quote. We will be in touch. "}
          Want to talk now? Call{" "}
          <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">(929) 594-5450</a>.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-[15px] text-[#131517] placeholder-[#6B6D71] focus:border-[#2040E7] focus:outline-none focus:ring-1 focus:ring-[#2040E7]";

  return (
    <form onSubmit={submit} className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
      <input className={field} placeholder="Business name" value={f.company} onChange={set("company")} autoComplete="organization" required />
      <label className="block text-sm text-[#27455C]">
        Type of restaurant
        <select className={`${field} mt-1`} value={f.type} onChange={set("type")} required>
          <option value="" disabled>Choose your type of restaurant</option>
          {restaurantTypeOptions(pageType).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value={SOMETHING_ELSE}>Something else</option>
        </select>
      </label>
      {f.type === SOMETHING_ELSE && (
        <input className={field} placeholder="Describe your restaurant" value={f.otherType} onChange={set("otherType")} maxLength={200} required />
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={field} placeholder="Your name" value={f.name} onChange={set("name")} autoComplete="name" required />
        <input className={field} placeholder="ZIP code" value={f.zip} onChange={set("zip")} inputMode="numeric" autoComplete="postal-code" maxLength={10} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={field} placeholder="Email" value={f.email} onChange={set("email")} type="email" autoComplete="email" required />
        <input className={field} placeholder="Phone" value={f.phone} onChange={set("phone")} type="tel" autoComplete="tel" required />
      </div>
      <label className="block text-sm text-[#27455C]">
        When does your current policy renew? (optional)
        <select className={`${field} mt-1`} value={f.renewal} onChange={set("renewal")}>
          <option value="">Choose a month</option>
          {RENEWAL_MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-[#2040E7] text-white text-base font-bold py-3 hover:bg-[#1A33B9] transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Get my quote →"}
      </button>
      <p className="text-xs text-[#6B6D71] text-center">
        A licensed agent follows up for your sales and the other details. No obligation to buy.
      </p>
      <PartialCaptureDisclosure />
    </form>
  );
}
