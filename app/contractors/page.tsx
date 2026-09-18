"use client";

import ContractorPageHero, {contractorMainClass,contractorFormClass,contractorButtonClass} from '@/components/ContractorPageTheme';
import {ContractorFormActions,ContractorFormSuccess} from '@/components/ContractorFormPresentation';
import ContractorQuestionSet from "@/components/ContractorQuestionSet";
import PartialCaptureDisclosure from "@/components/PartialCaptureDisclosure";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { captureAttribution, attributionDetails, type Attribution } from "@/lib/attribution";
import {TRADES} from "@/lib/contractor-trades";
import { acceptedPhoneShape } from "@/lib/phone-shape";

/**
 * /contractors - deep intake landing page for the high-value contractor GL
 * lane (cell 2 of the 3-way capture test; cell 1 is the Meta Instant Form,
 * cell 3 is /rate-check policy upload).
 *
 * Mirrors the Instant Form's question set so the two cells are comparable:
 * trade, roofing exposure (the Foxquilt-vs-Hedge routing gate), revenue,
 * W2 employees/payroll, entity, year started, address, renewal window.
 * Personal/home coverage seekers are disqualified inline and never become
 * leads. Everything flows to quotes@ + the CRM via POST /api/intake
 * (source "contractors-landing").
 */

// ---- Meta Pixel helper (matches app/page.tsx / QuoteSplash) --------------
function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

// Google Places autocomplete on the address field. Public, build-time-inlined
// key; when unset the address field is just a plain input (dark-safe).
const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type Option = { label: string; value: string };

// Web-form trade taxonomy. Keep paid-ad trade targets as first-class choices so
// they do not collapse into "Other trade" and lose downstream attribution.


const OTHER_TRADES: Option[] = [
  { label: "None - just my primary trade", value: "None" },
  ...TRADES,
];

const TRACKED_QUESTION_FIELDS = new Set([
  "trade",
  "otherTrades",
  "otherTradeDescription",
  "primaryPct",
  "revenue",
  "employees",
  "payroll",
  "usesSubcontractors",
  "subcontractorCosts",
  "structure",
  "currentGl",
  "currentPremium",
]);

const PRIMARY_PCT: Option[] = [
  { label: "All of it (100%)", value: "All of it (100%)" },
  { label: "75% - 99%", value: "75% - 99%" },
  { label: "50% - 75%", value: "50% - 75%" },
  { label: "Under 50%", value: "Under 50%" },
];

const REVENUE: Option[] = [
  { label: "Under $250k", value: "Under $250k" },
  { label: "$250k - $500k", value: "$250k - $500k" },
  { label: "$500k - $1M", value: "$500k - $1M" },
  { label: "$1M - $2M", value: "$1M - $2M" },
  { label: "$2M - $4M", value: "$2M - $4M" },
  { label: "$4M - $8M", value: "$4M - $8M" },
  { label: "Over $8M", value: "Over $8M" },
];

const EMPLOYEES: Option[] = [
  { label: "0 - no W2 employees", value: "0 - no W2 employees" },
  { label: "1 - 5", value: "1 - 5" },
  { label: "6 - 10", value: "6 - 10" },
  { label: "11 - 20", value: "11 - 20" },
  { label: "More than 20", value: "More than 20" },
];

const PAYROLL: Option[] = [
  { label: "$0 - $50k", value: "$0 - $50k" },
  { label: "$50k - $100k", value: "$50k - $100k" },
  { label: "$100k - $250k", value: "$100k - $250k" },
  { label: "$250k - $500k", value: "$250k - $500k" },
  { label: "$500k - $1M", value: "$500k - $1M" },
  { label: "$1M+", value: "$1M+" },
];

const USES_SUBCONTRACTORS: Option[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const SUBCONTRACTOR_COSTS: Option[] = [
  { label: "Under $25k", value: "Under $25k" },
  { label: "$25k - $50k", value: "$25k - $50k" },
  { label: "$50k - $100k", value: "$50k - $100k" },
  { label: "$100k - $250k", value: "$100k - $250k" },
  { label: "$250k - $500k", value: "$250k - $500k" },
  { label: "$500k - $1M", value: "$500k - $1M" },
  { label: "$1M+", value: "$1M+" },
];

const STRUCTURE: Option[] = [
  { label: "Sole proprietor / self-employed", value: "Sole proprietor" },
  { label: "LLC", value: "LLC" },
  { label: "Corporation / Inc", value: "Corporation" },
  { label: "Partnership", value: "Partnership" },
];

// ★ The uninsured answer is SPLIT into buyer vs shopper (Kevin 2026-08-17). Before this, anyone
// uninsured had to pick "ASAP", so the urgency signal was polluted with people just comparing.
// Both urgent answers use the SAME 30-day clock so the two urgent buckets are directly
// comparable ("insured, renewing within 30" vs "uninsured, needs it within 30").
const CURRENT_GL: Option[] = [
  { label: "Yes - renews within 30 days", value: "Yes - renews within 30 days" },
  { label: "Yes - renews later", value: "Yes - renews later" },
  { label: "No - I need coverage within 30 days", value: "No - need coverage within 30 days" },
  { label: "No - just comparing for now", value: "No - just comparing" },
];

// The two CURRENT_PREMIUM buckets that make a lead a QualifiedLead (self-reported $5K+).
const QUALIFIED_PREMIUM_VALUES = new Set(["$5K - $20K", "$20K+"]);
// "Not insured yet" is a YELLOW flag (Kevin 2026-08-15): a real, kept lead - they are buying,
// often ASAP - but there is no incumbent premium, so it is NOT the winnability signal and must
// not be folded into QualifiedLead. It gets its own event so it stays separable and trackable.
const UNINSURED_PREMIUM_VALUE = "Not insured yet";
// Urgency, from the EXISTING current-GL question (no new question asked). Renewing within 30
// days or uninsured-and-ASAP = urgent. Fires LeadUrgentQuoted (any premium) and, stacked on the
// $5K+ self-report, QualifiedUrgentLead - the tightest, most winnable slice. Primary optimisation
// stays QualifiedLead; QualifiedUrgentLead accumulates history until its volume can steer.
// "No - just comparing" is deliberately NOT here: a shopper with no clock is not urgent, and
// including it is what made the old ASAP bucket unreliable.
const URGENT_GL_VALUES = new Set(["Yes - renews within 30 days", "No - need coverage within 30 days"]);

// ★ LargeBusinessLead = self-reported revenue >= $1M, ANY trade (Kevin 2026-08-17).
// The premium self-report is the truest winnability signal but it is rare - 3 of the first 25
// contractor leads. Revenue >= $1M fired on 6 of those 25 AND caught all 3 of the $5K+ ones,
// plus the large businesses that are uninsured or underpaying (the ARGC shape: $2M revenue,
// a bad incumbent, the biggest win the lane has had). So it is a broader net for the same
// segment and frequent enough for Meta to actually learn from.
// ⚠️ Revenue self-reports round UP in a way premium self-reports do not - watch whether these
// leads actually quote at $5K+ before trusting the proxy.
const LARGE_REVENUE_VALUES = new Set(["$1M - $2M", "$2M - $4M", "$4M - $8M", "Over $8M"]);

const CURRENT_PREMIUM: Option[] = [
  { label: "Under $2,000", value: "Under $2K" },
  { label: "$2,000 - $5,000", value: "$2K - $5K" },
  { label: "$5,000 - $20,000", value: "$5K - $20K" },
  { label: "Over $20,000", value: "$20K+" },
  { label: "Not insured yet", value: "Not insured yet" },
];

type FormState = Record<string, string>;

export default function ContractorsLandingPage() {
  const [f, setF] = useState<FormState>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errMsg, setErrMsg] = useState("");

  // Funnel instrumentation: fire each milestone once per session so we can
  // measure abandonment (FormStart -> ContactDone -> TradeSelected -> Lead).
  const fired = useRef<Set<string>>(new Set());
  const answeredQuestions = useRef<Set<string>>(new Set());
  const formStartedAt = useRef<number | null>(null);
  const track = useCallback((name: string) => {
    if (fired.current.has(name)) return;
    fired.current.add(name);
    fbq("trackCustom", name);
  }, []);

  const set = (k: string, v: string) => {
    track("FormStart");
    if (formStartedAt.current === null && typeof performance !== "undefined") {
      formStartedAt.current = performance.now();
    }
    if (k === "trade") track("TradeSelected");
    if (TRACKED_QUESTION_FIELDS.has(k) && v && !answeredQuestions.current.has(k)) {
      answeredQuestions.current.add(k);
      const elapsedSeconds = formStartedAt.current === null
        ? 0
        : Math.round((performance.now() - formStartedAt.current) / 1000);
      fbq("trackCustom", "ContractorQuestionAnswered", {
        field: k,
        elapsed_seconds: elapsedSeconds,
      });
    }
    setF((p) => {
      const next = { ...p, [k]: v };
      if (k === "trade" && next.otherTrades && next.otherTrades !== "None") {
        const remaining = next.otherTrades.split(", ").filter((trade) => trade !== v);
        if (remaining.length) next.otherTrades = remaining.join(", ");
        else delete next.otherTrades;
      }
      if (k === "employees" && v.startsWith("0")) delete next.payroll;
      if (k === "usesSubcontractors" && v === "No") delete next.subcontractorCosts;
      if (next.trade !== "Other trade" && !(next.otherTrades ?? "").split(", ").includes("Other trade")) {
        delete next.otherTradeDescription;
      }
      return next;
    });
  };

  const emailValid = EMAIL_RE.test((f.email ?? "").trim());
  const phoneValid = acceptedPhoneShape(f.phone);

  // No qualifier gate on the landing page (Kevin 2026-08-13): ad traffic is
  // business owners; the personal-DQ mechanic only pays on the FB form where
  // Meta trains on it. The "commercial policies only" hero line is the filter.
  const disqualified = false;
  const qualified = true;
  const hasW2Employees = !!f.employees && !f.employees.startsWith("0");
  const usesSubcontractors = f.usesSubcontractors === "Yes";
  const selectedOtherTrades = f.otherTrades && f.otherTrades !== "None"
    ? f.otherTrades.split(", ").filter(Boolean)
    : f.otherTrades === "None" ? ["None"] : [];
  const otherTradeOptions = OTHER_TRADES.filter(
    (option) => option.value === "None" || option.value !== f.trade,
  );
  const needsOtherTradeDescription = f.trade === "Other trade" || selectedOtherTrades.includes("Other trade");

  const toggleOtherTrade = (value: string) => {
    if (value === "None") {
      set("otherTrades", "None");
      return;
    }
    const current = selectedOtherTrades.filter((trade) => trade !== "None");
    const next = current.includes(value)
      ? current.filter((trade) => trade !== value)
      : [...current, value];
    set("otherTrades", next.join(", "));
  };

  const canSubmit =
    f.fullName?.trim() &&
    emailValid &&
    phoneValid &&
    f.legalName?.trim() &&
    f.address?.trim() &&
    !!f.trade &&
    !!f.otherTrades &&
    (!needsOtherTradeDescription || !!f.otherTradeDescription?.trim()) &&
    !!f.primaryPct &&
    !!f.revenue &&
    !!f.employees &&
    (!hasW2Employees || !!f.payroll) &&
    !!f.usesSubcontractors &&
    (!usesSubcontractors || !!f.subcontractorCosts) &&
    status !== "sending";

  // Ad attribution (utm / ad_id / fbclid), first-touch, sessionStorage-backed.
  const [attr, setAttr] = useState<Attribution>({});
  useEffect(() => { setAttr(captureAttribution()); }, []);

  const details = useMemo(() => {
    const d: Array<{ label: string; value: string }> = [];
    const push = (label: string, value?: string) => {
      if (value && value.trim()) d.push({ label, value: value.trim() });
    };
    push("Legal business name", f.legalName);
    push("Business address", f.address);
    push("Primary trade", f.trade);
    push("Primary trade search text", f.tradeRawText);
    push("Other trades search text", f.otherTradesRawText);
    push("Other trades", f.otherTrades);
    if (f.trade === "Other trade" || (f.otherTrades ?? "").split(", ").includes("Other trade")) {
      push("Other trade description", f.otherTradeDescription);
    }
    push("Primary trade % of work", f.primaryPct);
    push("Annual revenue", f.revenue);
    push("W2 employees", f.employees);
    if (hasW2Employees) push("Annual W2 payroll", f.payroll);
    push("Uses subcontractors", f.usesSubcontractors);
    if (usesSubcontractors) push("Annual subcontractor costs", f.subcontractorCosts);
    push("Business structure", f.structure);
    push("Year started", f.yearStarted);
    push("Current GL / renewal", f.currentGl);
    push("Current annual GL premium", f.currentPremium);
    d.push(...attributionDetails(attr));
    return d;
  }, [f, attr, hasW2Employees, usesSubcontractors]);

  // Funnel milestone driven by state.
  useEffect(() => {
    if (f.fullName?.trim() && emailValid && phoneValid) {
      track("ContactDone");
    }
  }, [f.fullName, phoneValid, emailValid, track]);

  // Keep a live snapshot so the capture handlers don't read a stale closure.
  const latest = useRef({ f, details, status, disqualified });
  latest.current = { f, details, status, disqualified };
  const sentPartial = useRef(false);

  // Partial capture: the moment a visitor gives us ANY way to reach them,
  // capture them as a partial (final) lead so a mid-form abandoner is never
  // lost. Fires at most once, on leave/background OR 120s idle. The intake
  // route sends partials to quotes@ ONLY (no CRM/SMS). Disqualified visitors
  // are never captured.
  const firePartial = useRef(() => {});
  firePartial.current = () => {
    if (sentPartial.current) return;
    const { f: cur, details: det, status: st, disqualified: dq } = latest.current;
    if (st === "done" || st === "sending" || dq) return;
    const email = (cur.email ?? "").trim();
    const phone = (cur.phone ?? "").trim();
    const validEmail = EMAIL_RE.test(email) ? email : undefined;
    if (!(validEmail || phone)) return;
    sentPartial.current = true;
    const body = JSON.stringify({
      name: cur.fullName,
      email: validEmail,
      phone: phone || undefined,
      businessType: cur.trade ? `Contractor - ${cur.trade}` : "Contractor",
      zip: extractZip(cur.address),
      source: "contractors-landing",
      partial: true,
      final: true,
      details: det,
    });
    try {
      const ok = navigator.sendBeacon(
        "/api/intake",
        new Blob([body], { type: "application/json" }),
      );
      if (!ok) throw new Error("beacon refused");
    } catch {
      fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  };

  // Leave / background the page.
  useEffect(() => {
    const onHide = () => firePartial.current();
    const onVis = () => {
      if (document.visibilityState === "hidden") firePartial.current();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Idle backup: reset on every field change; 120s of no input captures them.
  useEffect(() => {
    const t = setTimeout(() => firePartial.current(), 120_000);
    return () => clearTimeout(t);
  }, [f]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setErrMsg("");
    // Shared event id: the server-side CAPI Lead dedupes with the browser
    // pixel Lead below.
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    // ★ QualifiedLead = self-reported current GL premium of $5K+ (Kevin 2026-08-15).
    // The one field that measures WINNABILITY (what their incumbent already charges),
    // as opposed to what we'd quote. Optimising ads on this finds people we can beat.
    // Uninsured leads deliberately do NOT qualify here - no incumbent, no gap to measure.
    const isQualified = QUALIFIED_PREMIUM_VALUES.has(f.currentPremium);
    const qualifiedEventId = isQualified ? `${eventId}-q` : undefined;
    const isUninsured = f.currentPremium === UNINSURED_PREMIUM_VALUE;
    const uninsuredEventId = isUninsured ? `${eventId}-u` : undefined;
    const isUrgent = URGENT_GL_VALUES.has(f.currentGl);
    const urgentEventId = isUrgent ? `${eventId}-ur` : undefined;
    const qualifiedUrgentEventId = isUrgent && isQualified ? `${eventId}-qu` : undefined;
    const isLargeBusiness = LARGE_REVENUE_VALUES.has(f.revenue);
    const largeBusinessEventId = isLargeBusiness ? `${eventId}-lg` : undefined;
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.fullName,
          email: f.email,
          phone: f.phone,
          businessType: `Contractor - ${f.trade}`,
          company: f.legalName,
          zip: extractZip(f.address),
          source: "contractors-landing",
          details,
          eventId,
          ...(qualifiedEventId ? { qualifiedEventId } : {}),
          ...(uninsuredEventId ? { uninsuredEventId } : {}),
          ...(urgentEventId ? { urgentEventId } : {}),
          ...(qualifiedUrgentEventId ? { qualifiedUrgentEventId } : {}),
          ...(largeBusinessEventId ? { largeBusinessEventId } : {}),
        }),
      });
      const result = await res.json();
      if (!res.ok || result.ok !== true) {
        throw new Error(typeof result.error === "string"
          ? result.error
          : "We could not save your request. Please try again.");
      }
      const conversionId = result.conversion?.eventId;
      if (result.conversion?.eligible !== true || typeof conversionId !== 'string') {setStatus('done');return;}
      // Server acceptance and shared ID gate all acquisition signals.
      fbq("track", "Lead", {}, { eventID: conversionId });
      fbq("trackCustom", "ContractorSubmit");
      if (qualifiedEventId) fbq("trackCustom", "QualifiedLead", {}, { eventID: conversionId+'-q' });
      if (uninsuredEventId) fbq("trackCustom", "UninsuredLead", {}, { eventID: conversionId+'-u' });
      if (urgentEventId) fbq("trackCustom", "LeadUrgentQuoted", {}, { eventID: conversionId+'-ur' });
      if (qualifiedUrgentEventId) fbq("trackCustom", "QualifiedUrgentLead", {}, { eventID: conversionId+'-qu' });
      if (largeBusinessEventId) fbq("trackCustom", "LargeBusinessLead", {}, { eventID: conversionId+'-lg' });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      fbq("trackCustom", "SubmitError");
      setErrMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === 'done') return <ContractorFormSuccess />;

  return (
    <main className={contractorMainClass}>
      <ContractorPageHero />

      <form onSubmit={submit} className={contractorFormClass}>
        <ContractorQuestionSet f={f} set={set} />

        <ContractorFormActions status={status} error={errMsg} enabled={!!canSubmit} />
      </form>
    </main>
  );
}


function extractZip(address?: string): string | undefined {
  if (!address) return undefined;
  const m = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  return m ? m[1] : undefined;
}
