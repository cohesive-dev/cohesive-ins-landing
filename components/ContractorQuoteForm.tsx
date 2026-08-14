"use client";

import { useState } from "react";

// Minimal contractor intake for the /insurance/<trade> SEO pages. Posts to the
// same /api/intake webhook every other lead source uses (CRM card + Smartlead
// enroll + first-touch SMS), attributed per-page via `source`. The one-click
// Foxquilt/Next instant-quote redirect (QuoteSplash) layers on later, once the
// per-trade carrier COB ids are confirmed; until then this owns the lead.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export default function ContractorQuoteForm({
  source,
  tradeLabel,
}: {
  source: string;
  tradeLabel: string;
}) {
  const [f, setF] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    zip: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = f.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      setErr("Please enter a valid email so we can send your quote.");
      return;
    }
    if (!f.phone.replace(/\D/g, "")) {
      setErr("Please add a phone number so our team can reach you.");
      return;
    }
    setErr(null);
    setSending(true);
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim() || undefined,
          email,
          phone: f.phone.trim(),
          zip: f.zip.trim() || undefined,
          businessType: tradeLabel,
          source,
          final: true,
          details: [
            f.company.trim() && { label: "Business", value: f.company.trim() },
            { label: "Trade", value: tradeLabel },
          ].filter(Boolean),
        }),
        keepalive: true,
      });
    } catch {
      // never block the confirmation on our backend
    }
    setSending(false);
    setDone(true);
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
