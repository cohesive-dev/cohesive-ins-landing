"use client";

import { useEffect, useState } from "react";
import { captureAttribution, attributionDetails } from "@/lib/attribution";

// Minimal contractor intake for the /insurance/<trade> SEO pages. Posts to the
// same /api/intake webhook under the contractor lane, with automated first touch
// suppressed. The page label is placement evidence, not proof of organic acquisition.
// The one-click
// Foxquilt/Next instant-quote redirect (QuoteSplash) layers on later, once the
// per-trade carrier COB ids are confirmed; until then this owns the lead.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export default function ContractorQuoteForm({
  source,
  tradeLabel,
  operationsPrompt,
}: {
  source: string;
  tradeLabel: string;
  operationsPrompt?: string;
}) {
  const [f, setF] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    zip: "",
    operations: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  useEffect(() => { captureAttribution(); }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
    const captured = captureAttribution();
    const attribution = { ...captured, landing_page: captured.landing_page || window.location.pathname, referrer: captured.referrer || document.referrer || undefined };
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
          businessType: tradeLabel,
          company: f.company.trim() || undefined,
          source: "contractors-landing",
          details: [
            f.company.trim() && { label: "Business", value: f.company.trim() },
            { label: "Trade", value: tradeLabel },
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
          One of our licensed agents will get you a {tradeLabel.toLowerCase()}{" "}
          quote shortly. Need a COI fast? Call{" "}
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
    </form>
  );
}
