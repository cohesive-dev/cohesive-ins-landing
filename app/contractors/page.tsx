"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

// Mirrors the FB instant form v5 exactly (Kevin's final 14-trade list).
const TRADES: Option[] = [
  { label: "General contractor", value: "General contractor" },
  { label: "Remodeling / renovations", value: "Remodeling / renovations" },
  { label: "Roofing", value: "Roofing" },
  { label: "Painting", value: "Painting" },
  { label: "Carpentry / framing", value: "Carpentry / framing" },
  { label: "Masonry / concrete", value: "Masonry / concrete" },
  { label: "Siding / gutters", value: "Siding / gutters" },
  { label: "Flooring / tile", value: "Flooring / tile" },
  { label: "Excavation / demolition", value: "Excavation / demolition" },
  { label: "Paving / asphalt", value: "Paving / asphalt" },
  { label: "Tree service", value: "Tree service" },
  { label: "Restoration (water / fire damage)", value: "Restoration (water / fire damage)" },
  { label: "Waterproofing / foundation repair", value: "Waterproofing / foundation repair" },
  { label: "Pool construction / service", value: "Pool construction / service" },
  { label: "Other trade", value: "Other trade" },
];

const OTHER_TRADES: Option[] = [
  { label: "None - just my primary trade", value: "None" },
  ...TRADES,
];

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
  { label: "0 - just me / subs only", value: "0 - just me / subs only" },
  { label: "1 - 5", value: "1 - 5" },
  { label: "6 - 10", value: "6 - 10" },
  { label: "11 - 20", value: "11 - 20" },
  { label: "More than 20", value: "More than 20" },
];

const PAYROLL: Option[] = [
  { label: "$0 (all subs / no employees)", value: "$0 (all subs)" },
  { label: "$0 - $50k", value: "$0 - $50k" },
  { label: "$50k - $100k", value: "$50k - $100k" },
  { label: "$100k - $250k", value: "$100k - $250k" },
  { label: "$250k - $500k", value: "$250k - $500k" },
  { label: "Over $500k", value: "Over $500k" },
];

const STRUCTURE: Option[] = [
  { label: "Sole proprietor / self-employed", value: "Sole proprietor" },
  { label: "LLC", value: "LLC" },
  { label: "Corporation / Inc", value: "Corporation" },
  { label: "Partnership", value: "Partnership" },
];

const CURRENT_GL: Option[] = [
  { label: "Yes - renews within 30 days", value: "Yes - renews within 30 days" },
  { label: "Yes - renews later", value: "Yes - renews later" },
  { label: "No - I need coverage ASAP", value: "No - need coverage ASAP" },
];

// The two CURRENT_PREMIUM buckets that make a lead a QualifiedLead (self-reported $5K+).
const QUALIFIED_PREMIUM_VALUES = new Set(["$5K - $20K", "$20K+"]);

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
  const track = useCallback((name: string) => {
    if (fired.current.has(name)) return;
    fired.current.add(name);
    fbq("trackCustom", name);
  }, []);

  const set = (k: string, v: string) => {
    track("FormStart");
    if (k === "trade") track("TradeSelected");
    setF((p) => ({ ...p, [k]: v }));
  };

  const emailValid = EMAIL_RE.test((f.email ?? "").trim());

  // No qualifier gate on the landing page (Kevin 2026-08-13): ad traffic is
  // business owners; the personal-DQ mechanic only pays on the FB form where
  // Meta trains on it. The "commercial policies only" hero line is the filter.
  const disqualified = false;
  const qualified = true;

  const canSubmit =
    f.fullName?.trim() &&
    emailValid &&
    f.phone?.trim() &&
    f.legalName?.trim() &&
    f.address?.trim() &&
    !!f.trade &&
    !!f.otherTrades &&
    !!f.primaryPct &&
    !!f.revenue &&
    !!f.employees &&
    status !== "sending";

  const details = useMemo(() => {
    const d: Array<{ label: string; value: string }> = [];
    const push = (label: string, value?: string) => {
      if (value && value.trim()) d.push({ label, value: value.trim() });
    };
    push("Legal business name", f.legalName);
    push("Business address", f.address);
    push("Primary trade", f.trade);
    push("Other trades", f.otherTrades);
    push("Primary trade % of work", f.primaryPct);
    push("Annual revenue", f.revenue);
    push("W2 employees", f.employees);
    push("Annual W2 payroll", f.payroll);
    push("Business structure", f.structure);
    push("Year started", f.yearStarted);
    push("Current GL / renewal", f.currentGl);
    push("Current annual GL premium", f.currentPremium);
    return d;
  }, [f]);

  // Funnel milestone driven by state.
  useEffect(() => {
    if (f.fullName?.trim() && emailValid && f.phone?.trim()) {
      track("ContactDone");
    }
  }, [f.fullName, f.phone, emailValid, track]);

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
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      // Fire the pixel ONLY after the intake POST succeeds.
      fbq("track", "Lead", {}, { eventID: eventId });
      fbq("trackCustom", "ContractorSubmit");
      if (qualifiedEventId) fbq("trackCustom", "QualifiedLead", {}, { eventID: qualifiedEventId });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      fbq("trackCustom", "SubmitError");
      setErrMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "done") {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF1FF] text-3xl">
          🛠️
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#131517]">
          Thanks - we&rsquo;ve got it.
        </h1>
        <p className="mt-3 max-w-md text-[#6B6D71]">
          A licensed agent will run your quote and reach out shortly - most
          come back within a day. Want to talk now? Call{" "}
          <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">
            (929) 594-5450
          </a>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
        <div className="mx-auto max-w-2xl px-5 py-5 sm:px-6 sm:py-7">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#2040E7]">
            For contractors &amp; construction businesses
          </span>
          <h1 className="mt-1.5 text-xl font-bold leading-snug text-[#131517] sm:text-2xl">
            General liability built for contractors
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#27455C] sm:text-base">
            We use AI to automatically shop your coverage and find you a
            better rate, reviewed by a licensed agent.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="mx-auto max-w-2xl space-y-8 px-5 py-8 sm:px-6 sm:py-10">
        {/* Contact */}
        <Section title="Your contact info">
          <Field label="Full name" required>
            <Input value={f.fullName} onChange={(v) => set("fullName", v)} placeholder="Jane Smith" autoComplete="name" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field label="Email" required>
                <Input type="email" value={f.email} onChange={(v) => set("email", v)} placeholder="you@example.com" autoComplete="email" inputMode="email" />
              </Field>
              {f.email && !emailValid && (
                <p className="mt-1 text-xs text-red-600">
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <Field label="Phone" required>
              <Input type="tel" value={f.phone} onChange={(v) => set("phone", v)} placeholder="(929) 594-5450" autoComplete="tel" inputMode="tel" />
            </Field>
          </div>
        </Section>

        {/* Business */}
        {qualified && (
          <Section title="About your business">
            <Field label="Legal business name" required>
              <Input value={f.legalName} onChange={(v) => set("legalName", v)} placeholder="Smith Contracting LLC" autoComplete="organization" />
            </Field>
            <Field label="Business address" required hint="Street, city, state, ZIP">
              <AddressAutocomplete value={f.address} onChange={(v) => set("address", v)} placeholder="123 Main St, San Antonio, TX 78216" />
            </Field>
            <Field label="What's your primary trade?" required>
              <Select value={f.trade} onChange={(v) => set("trade", v)} options={TRADES} placeholder="Select one" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Any other trades?" required>
                <Select value={f.otherTrades} onChange={(v) => set("otherTrades", v)} options={OTHER_TRADES} placeholder="Select one" />
              </Field>
              <Field label="How much of your work is your primary trade?" required>
                <Select value={f.primaryPct} onChange={(v) => set("primaryPct", v)} options={PRIMARY_PCT} placeholder="Select one" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Annual revenue (roughly)" required>
                <Select value={f.revenue} onChange={(v) => set("revenue", v)} options={REVENUE} placeholder="Select one" />
              </Field>
              <Field label="W2 employees" required hint="Not you or subcontractors; subs-only = 0.">
                <Select value={f.employees} onChange={(v) => set("employees", v)} options={EMPLOYEES} placeholder="Select one" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Annual W2 payroll (roughly)" hint="Wages to employees, not sub payments.">
                <Select value={f.payroll} onChange={(v) => set("payroll", v)} options={PAYROLL} placeholder="Select one" />
              </Field>
              <Field label="Business structure">
                <Select value={f.structure} onChange={(v) => set("structure", v)} options={STRUCTURE} placeholder="Select one" />
              </Field>
            </div>
            <Field label="What year did you start the business?">
              <Input value={f.yearStarted} onChange={(v) => set("yearStarted", v)} placeholder="2015" inputMode="numeric" />
            </Field>
          </Section>
        )}

        {/* Current coverage */}
        {qualified && (
          <Section title="Your current coverage">
            <Field label="Do you have general liability coverage today?">
              <Select value={f.currentGl} onChange={(v) => set("currentGl", v)} options={CURRENT_GL} placeholder="Select one" />
            </Field>
            <Field label="What are you paying now for GL, per year?" hint="Best guess is fine.">
              <Select value={f.currentPremium} onChange={(v) => set("currentPremium", v)} options={CURRENT_PREMIUM} placeholder="Select one" />
            </Field>
          </Section>
        )}

        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errMsg}
          </p>
        )}

        {!disqualified && (
          <>
            <button
              type="submit"
              disabled={!canSubmit}
              className="min-h-[52px] w-full touch-manipulation rounded-xl bg-[#2040E7] px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-[#1A33B9] active:bg-[#1A33B9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Get my quote"}
            </button>
            <p className="text-center text-xs text-[#6B6D71]">
              We&rsquo;ll only use your details to prepare and send your
              insurance quote.
            </p>
          </>
        )}
      </form>
    </main>
  );
}

// ---- little presentational helpers ---------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-[#27455C]">{title}</h2>
      {children}
    </section>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {children}
    </p>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  // A <div>, not a <label>: several fields hold button groups (radio chips),
  // and wrapping those in a <label> makes tapping the question text toggle
  // the first chip. The label is pushed down as an accessible name instead.
  const control = isValidElement(children)
    ? cloneElement(children as React.ReactElement<{ ariaLabel?: string }>, {
        ariaLabel: label,
      })
    : children;
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-[#131517]">
        {label}
        {required && <span className="text-[#2040E7]"> *</span>}
      </span>
      {hint && <span className="block text-xs text-[#6B6D71]">{hint}</span>}
      {control}
    </div>
  );
}

// text-base (16px) is deliberate: inputs under 16px make iOS Safari auto-zoom
// on focus. min-h keeps a comfortable tap target.
const inputClasses =
  "w-full rounded-lg border border-[#D8DEF5] bg-white px-4 py-3 text-base text-[#131517] outline-none transition focus:border-[#2040E7] focus:ring-2 focus:ring-[#2040E7]/20";

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  ariaLabel,
  inputMode,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  ariaLabel?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-label={ariaLabel}
      inputMode={inputMode}
      className={inputClasses}
    />
  );
}

// ---- Google Places address autocomplete -----------------------------------

type GPrediction = { description: string; place_id: string };
type GPlaceResult = { formatted_address?: string };
type GAutocompleteService = {
  getPlacePredictions: (
    req: Record<string, unknown>,
    cb: (preds: GPrediction[] | null, status: string) => void,
  ) => void;
};
type GPlacesService = {
  getDetails: (
    req: Record<string, unknown>,
    cb: (place: GPlaceResult | null, status: string) => void,
  ) => void;
};
type GMaps = {
  maps: {
    places: {
      AutocompleteService: new () => GAutocompleteService;
      PlacesService: new (attrContainer: HTMLElement) => GPlacesService;
      AutocompleteSessionToken: new () => object;
    };
  };
};
const getGoogle = () => (window as unknown as { google?: GMaps }).google;

function loadGoogleMaps(key: string): Promise<void> {
  const w = window as unknown as {
    google?: GMaps;
    __gmapsPromise?: Promise<void>;
  };
  if (w.google?.maps?.places) return Promise.resolve();
  if (w.__gmapsPromise) return w.__gmapsPromise;
  w.__gmapsPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key,
    )}&libraries=places&loading=async`;
    s.async = true;
    // With loading=async, onload fires before google.maps.places is populated,
    // so poll for it before resolving.
    s.onload = () => {
      const ready = () => {
        if ((window as unknown as { google?: GMaps }).google?.maps?.places) {
          resolve();
        } else {
          setTimeout(ready, 50);
        }
      };
      ready();
    };
    s.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(s);
  });
  return w.__gmapsPromise;
}

// A styled address input backed by Google Places (custom dropdown off
// AutocompleteService + session token). Dark-safe: with no key it's a plain
// input.
function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [suggestions, setSuggestions] = useState<GPrediction[]>([]);
  const [open, setOpen] = useState(false);
  const svc = useRef<GAutocompleteService | null>(null);
  const places = useRef<GPlacesService | null>(null);
  const token = useRef<object | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!GMAPS_KEY) return;
    loadGoogleMaps(GMAPS_KEY)
      .then(() => {
        const g = getGoogle();
        if (!g?.maps?.places) return;
        svc.current = new g.maps.places.AutocompleteService();
        places.current = new g.maps.places.PlacesService(
          document.createElement("div"),
        );
        token.current = new g.maps.places.AutocompleteSessionToken();
      })
      .catch(() => {});
  }, []);

  const query = (input: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (!svc.current || input.trim().length < 4) {
      setSuggestions([]);
      return;
    }
    timer.current = setTimeout(() => {
      svc.current?.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "us" },
          types: ["address"],
          sessionToken: token.current,
        },
        (preds, status) => {
          if (status === "OK" && preds) {
            setSuggestions(preds.slice(0, 5));
            setOpen(true);
          } else {
            setSuggestions([]);
          }
        },
      );
    }, 300);
  };

  // On select, show the prediction immediately, then upgrade to the full
  // formatted address (with ZIP) via Place Details. Rotate the session token.
  const choose = (p: GPrediction) => {
    setSuggestions([]);
    setOpen(false);
    onChange(p.description);
    places.current?.getDetails(
      {
        placeId: p.place_id,
        fields: ["formatted_address"],
        sessionToken: token.current,
      },
      (place, status) => {
        if (status === "OK" && place?.formatted_address) {
          onChange(place.formatted_address);
        }
        const g = getGoogle();
        if (g?.maps?.places) {
          token.current = new g.maps.places.AutocompleteSessionToken();
        }
      },
    );
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => {
          onChange(e.target.value);
          query(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        className={inputClasses}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#D8DEF5] bg-white shadow-lg">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(s);
                }}
                className="block w-full px-4 py-3 text-left text-[15px] text-[#131517] hover:bg-[#EEF1FF]"
              >
                {s.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={inputClasses}
    >
      <option value="" disabled>
        {placeholder ?? "Select"}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Radio({
  name,
  value,
  onChange,
  options,
  ariaLabel,
}: {
  name: string;
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  ariaLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={
              "min-h-[48px] touch-manipulation rounded-lg border px-4 py-3 text-[15px] font-medium transition " +
              (active
                ? "border-[#2040E7] bg-[#EEF1FF] text-[#1A33B9]"
                : "border-[#D8DEF5] bg-white text-[#131517] hover:border-[#2040E7]")
            }
          >
            {o.label}
          </button>
        );
      })}
      <input type="hidden" name={name} value={value ?? ""} readOnly />
    </div>
  );
}

function extractZip(address?: string): string | undefined {
  if (!address) return undefined;
  const m = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  return m ? m[1] : undefined;
}
