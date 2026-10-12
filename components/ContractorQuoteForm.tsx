"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { captureAttribution, attributionDetails } from "@/lib/attribution";
import PartialCaptureDisclosure from "@/components/PartialCaptureDisclosure";
import { TRADES } from "@/lib/contractor-trades";
import { filterTrades } from "@/lib/trade-search";
import type { RequestedCoverage } from "@/lib/requested-coverage";

// Minimal contractor intake for the /insurance/<trade> SEO pages. Posts to the
// same /api/intake webhook under the contractor lane, with automated first touch
// suppressed. The page label is placement evidence, not proof of organic acquisition.
// The one-click
// Foxquilt/Next instant-quote redirect (QuoteSplash) layers on later, once the
// per-trade carrier COB ids are confirmed; until then this owns the lead.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

// ★ Kevin 2026-10-09 ("Fix yes"): the visitor states their trade. The page's trade is PAGE CONTEXT, not a client
// fact - T&S Contracting arrived from /insurance/roofer/pennsylvania as "Roofer" and does general construction.
// "Trade" = the visitor's pick (or their own words); "Page trade" = attribution only; nothing is pre-selected.
// An abandoned form with no stated trade OMITS Trade/businessType entirely (C/B 2026-10-09): absent is read as absent by
// every exact-key reader downstream, so the page trade can never be taken for the client's.
export const SOMETHING_ELSE = "__something_else";
// A generic page label (the workers' comp guides pass "Contractor") is not a trade: list every
// trade, list no "Contractor" option and keep "General contractor" (which the synonym filter would drop).
const GENERIC_PAGE_TRADE = /^contractors?$/i;
export function tradeOptions(pageTrade: string): string[] {
  if (GENERIC_PAGE_TRADE.test(pageTrade.trim())) return TRADES.map((t) => t.value).filter((v) => !/^other(?: trade)?$/i.test(v));
  const synonyms = new Set(filterTrades(TRADES, pageTrade).map((t) => t.value));
  const rest = TRADES.map((t) => t.value)
    .filter((v) => !synonyms.has(v) && !/^other(?: trade)?$/i.test(v) && v.toLowerCase() !== pageTrade.toLowerCase());
  return [pageTrade, ...rest];
}
export function statedTrade(choice: string, other: string): string {
  return choice === SOMETHING_ELSE ? other.trim() : choice.trim();
}

// Coverage a page asks the CRM to record (the workers' comp guides send ["Workers Comp"]). The
// top-level `coverage` values are CRM line names and must be in /api/intake's allowlist; the
// detail row is the human-readable version for quotes@ and the Slack card.
const COVERAGE_LABELS: Record<RequestedCoverage, string> = { "Workers Comp": "Workers' comp", "General Liability": "General liability" };
function coverageFields(coverageRequested?: RequestedCoverage[]) {
  if (!coverageRequested?.length) return { payload: {}, detail: undefined };
  return {
    payload: { coverage: coverageRequested },
    detail: { label: "Coverage requested", value: coverageRequested.map((c) => COVERAGE_LABELS[c]).join(", ") },
  };
}

export default function ContractorQuoteForm({
  source,
  tradeLabel,
  operationsPrompt,
  coverageRequested,
}: {
  source: string;
  tradeLabel: string;
  operationsPrompt?: string;
  coverageRequested?: RequestedCoverage[];
}) {
  const [f, setF] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    zip: "",
    operations: "",
    trade: "",
    otherTrade: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  useEffect(() => { captureAttribution(); }, []);

  const sentPartial = useRef(false);
  const partialInFlight = useRef(false);
  const capturePartial = useCallback(() => {
    if (sentPartial.current || partialInFlight.current) return;
    if (done || sending) return;
    const email = f.email.trim().toLowerCase();
    const phone = f.phone.trim();
    const validEmail = EMAIL_RE.test(email) ? email : undefined;
    if (!validEmail && !phone) return;
    const captured = captureAttribution();
    const attribution = {
      ...captured,
      landing_page: captured.landing_page || window.location.pathname,
      referrer: captured.referrer || document.referrer || undefined,
    };
    const coverage = coverageFields(coverageRequested);
    const body = JSON.stringify({
      name: f.name.trim() || undefined,
      email: validEmail,
      phone: phone || undefined,
      zip: f.zip.trim() || undefined,
      ...(statedTrade(f.trade, f.otherTrade) ? { businessType: statedTrade(f.trade, f.otherTrade) } : {}),
      company: f.company.trim() || undefined,
      source: "contractors-landing",
      ...coverage.payload,
      partial: true,
      final: true,
      details: [
        f.company.trim() && { label: "Business", value: f.company.trim() },
        statedTrade(f.trade, f.otherTrade) && { label: "Trade", value: statedTrade(f.trade, f.otherTrade) },
        { label: "Page trade", value: tradeLabel },
        coverage.detail,
        operationsPrompt && f.operations.trim() && { label: "Services described", value: f.operations.trim() },
        { label: "Page source", value: source },
        ...attributionDetails(attribution),
        attribution.referrer && { label: "Referrer", value: attribution.referrer },
      ].filter(Boolean),
    });
    try {
      const accepted = navigator.sendBeacon(
        "/api/intake",
        new Blob([body], { type: "application/json" }),
      );
      if (!accepted) throw new Error("beacon refused");
      sentPartial.current = true;
    } catch {
      partialInFlight.current = true;
      fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).then((response) => {
        if (response.ok) sentPartial.current = true;
      }).catch(() => {}).finally(() => {
        partialInFlight.current = false;
      });
    }
  }, [coverageRequested, done, f, operationsPrompt, sending, source, tradeLabel]);

  useEffect(() => {
    const onHide = () => capturePartial();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") capturePartial();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [capturePartial]);

  // Reset after every edit, so this captures the latest snapshot only after
  // 120 seconds without another answer.
  useEffect(() => {
    const timer = setTimeout(() => capturePartial(), 120_000);
    return () => clearTimeout(timer);
  }, [capturePartial]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const email = f.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      setErr("Please enter a valid email so we can send your quote.");
      return;
    }
    if (!f.phone.replace(/\D/g, "")) {
      setErr("Please add a phone number so our team can reach you.");
      return;
    }
    const stated = statedTrade(f.trade, f.otherTrade);
    if (!stated) {
      setErr(f.trade === SOMETHING_ELSE ? "Please tell us what work you do." : "Please choose the work you do.");
      return;
    }
    const captured = captureAttribution();
    const attribution = { ...captured, landing_page: captured.landing_page || window.location.pathname, referrer: captured.referrer || document.referrer || undefined };
    const coverage = coverageFields(coverageRequested);
    setErr(null);
    setSending(true);
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim() || undefined,
          email,
          phone: f.phone.trim(),
          zip: f.zip.trim() || undefined,
          businessType: stated,
          company: f.company.trim() || undefined,
          source: "contractors-landing",
          ...coverage.payload,
          details: [
            f.company.trim() && { label: "Business", value: f.company.trim() },
            { label: "Trade", value: stated },
            { label: "Page trade", value: tradeLabel },
            coverage.detail,
            operationsPrompt && f.operations.trim() && { label: "Services described", value: f.operations.trim() },
            { label: "Page source", value: source },
            ...attributionDetails(attribution),
            attribution.referrer && { label: "Referrer", value: attribution.referrer },
          ].filter(Boolean),
        }),
        keepalive: true,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true ||
          (result.crm !== "sent" && result.notification !== "sent")) {
        throw new Error("intake_not_accepted");
      }
      setDone(true);
    } catch {
      setErr("We couldn't save your request. Please try again, or call (929) 594-5450.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-8 text-center">
        <div className="text-lg font-extrabold text-[#131517] mb-1.5">
          Got it - we&apos;re on it.
        </div>
        <p className="text-sm text-[#6B6D71]">
          One of our licensed agents will get you a quote shortly. Need a COI fast? Call{" "}
          <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">
            (929) 594-5450
          </a>
          .
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-[15px] text-[#131517] placeholder-[#9AA0A6] focus:border-[#2040E7] focus:outline-none focus:ring-1 focus:ring-[#2040E7]";

  return (
    <form
      onSubmit={submit}
      className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3"
    >
      <input
        className={field}
        placeholder="Business name"
        value={f.company}
        onChange={set("company")}
        autoComplete="organization"
      />
      <label className="block text-sm text-[#27455C]">
        What work do you do?
        <select
          className={`${field} mt-1`}
          value={f.trade}
          onChange={set("trade")}
          required
        >
          <option value="" disabled>
            Choose your work
          </option>
          {tradeOptions(tradeLabel).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value={SOMETHING_ELSE}>Something else</option>
        </select>
      </label>
      {f.trade === SOMETHING_ELSE && (
        <input
          className={field}
          placeholder="Describe your work"
          value={f.otherTrade}
          onChange={set("otherTrade")}
          maxLength={200}
          required
        />
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={field}
          placeholder="Your name"
          value={f.name}
          onChange={set("name")}
          autoComplete="name"
        />
        <input
          className={field}
          placeholder="ZIP code"
          value={f.zip}
          onChange={set("zip")}
          inputMode="numeric"
          autoComplete="postal-code"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={field}
          placeholder="Email"
          value={f.email}
          onChange={set("email")}
          type="email"
          autoComplete="email"
        />
        <input
          className={field}
          placeholder="Phone"
          value={f.phone}
          onChange={set("phone")}
          type="tel"
          autoComplete="tel"
        />
      </div>
      {operationsPrompt && <label className="block text-sm text-[#27455C]">Describe your services (optional)<span className="block text-xs text-[#6B6D71] my-1">{operationsPrompt}</span><textarea className={field} value={f.operations} onChange={set("operations")} maxLength={2000} rows={3} /></label>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-md bg-[#2040E7] text-white text-base font-bold py-3 hover:bg-[#1A33B9] transition-colors disabled:opacity-60"
      >
        {sending ? "Sending..." : "Get my quote →"}
      </button>
      <p className="text-xs text-[#6B6D71] text-center">
        We shop your {tradeLabel.toLowerCase()} risk across our markets and send
        the best price back. No obligation to bind.
      </p>
      <PartialCaptureDisclosure />
    </form>
  );
}
