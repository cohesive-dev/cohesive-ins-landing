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
 * /religious — deep intake landing page for houses of worship (all faiths:
 * churches, synagogues, mosques, temples).
 *
 * A/B counterpart to the native Meta Instant Form (which is capped at ~14
 * questions with limited branching). This page runs the full conditional
 * questionnaire: a GL gate and a property gate that reveal only the relevant
 * blocks, multi-select safeguards/coverages, and everything flows to quotes@
 * + the CRM via POST /api/intake (source "religious-landing").
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

const EXPIRATION: Option[] = [
  { label: "This month", value: "This month" },
  { label: "In 1-3 months", value: "In 1-3 months" },
  { label: "In 3-6 months", value: "In 3-6 months" },
  { label: "6+ months out", value: "6+ months out" },
  { label: "Not sure", value: "Not sure" },
  { label: "No coverage right now", value: "No coverage now" },
];

const COVERAGE_TYPES: string[] = [
  "General liability",
  "Property / building",
];

const ATTENDANCE: Option[] = [
  { label: "Under 10", value: "Under 10" },
  { label: "10-20", value: "10-20" },
  { label: "20-40", value: "20-40" },
  { label: "40-80", value: "40-80" },
  { label: "80-150", value: "80-150" },
  { label: "Over 150", value: "Over 150" },
];

const OPTIONAL_COVERAGES: string[] = [
  "Abuse & Molestation",
  "Clergy professional (counseling E&O)",
];

const HEATING: Option[] = [
  { label: "Forced air (gas)", value: "Forced air (gas)" },
  { label: "Electric", value: "Electric" },
  { label: "Space heaters", value: "Space heaters" },
  { label: "Wood stove", value: "Wood stove" },
  { label: "Not sure", value: "Not sure" },
];

// Pathpoint rates construction class heavily (frame vs. masonry) and doesn't
// derive it from the address — so we ask instead of assuming Joisted Masonry.
const CONSTRUCTION: Option[] = [
  { label: "Brick / stone / masonry", value: "Brick / stone / masonry" },
  { label: "Wood frame", value: "Wood frame" },
  { label: "Steel / metal", value: "Steel / metal" },
  { label: "Mixed / not sure", value: "Mixed / not sure" },
];

const ROOF_TYPE: Option[] = [
  { label: "Asphalt shingle", value: "Asphalt shingle" },
  { label: "Metal", value: "Metal" },
  { label: "Tile / slate", value: "Tile / slate" },
  { label: "Flat (rubber / membrane / tar)", value: "Flat (rubber/membrane/tar)" },
  { label: "Other / not sure", value: "Other / not sure" },
];

const YES_NO: Option[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Not sure", value: "Not sure" },
];

const WIND: Option[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Not sure", value: "Not sure" },
];

// "Sprinklered" is asked as its own Y/N below (Pathpoint wants it explicit) so
// it's intentionally not in this multi-select.
const FIRE_SECURITY: string[] = [
  "Monitored fire alarm",
  "Burglar alarm",
  "Fire extinguishers",
  "None",
];

const CLAIMS: Option[] = [
  { label: "None", value: "None" },
  { label: "One", value: "One" },
  { label: "Two or more", value: "Two or more" },
  { label: "Prefer to discuss", value: "Prefer to discuss" },
];

type FormState = Record<string, string>;

// Fields in the property block — touching one fires the "PropertyStarted"
// funnel milestone.
const PROPERTY_SET_FIELDS = new Set([
  "ownRent",
  "construction",
  "yearBuilt",
  "roofYear",
  "roofType",
  "updates",
  "sqft",
  "heating",
  "value",
  "wind",
  "sprinklered",
]);

export default function ReligiousLandingPage() {
  // Claims defaults to "None" — the common case for a house of worship, and it
  // means the detail block always carries a claims answer even if untouched.
  const [f, setF] = useState<FormState>({ claims: "None" });
  const [coverage, setCoverage] = useState<string[]>([]);
  const [optCov, setOptCov] = useState<string[]>([]);
  const [fireSec, setFireSec] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errMsg, setErrMsg] = useState("");

  // Funnel instrumentation: fire each milestone once per session so we can
  // measure abandonment (FormStart -> ContactDone -> CoverageSelected ->
  // PropertyStarted -> Lead) and see exactly where people drop off.
  const fired = useRef<Set<string>>(new Set());
  const track = useCallback((name: string) => {
    if (fired.current.has(name)) return;
    fired.current.add(name);
    fbq("trackCustom", name);
  }, []);

  const set = (k: string, v: string) => {
    track("FormStart");
    if (PROPERTY_SET_FIELDS.has(k)) track("PropertyStarted");
    setF((p) => ({ ...p, [k]: v }));
  };
  const toggle =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (v: string) => {
      track("FormStart");
      setter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
    };

  const wantsGL = coverage.includes("General liability");
  const wantsProperty = coverage.includes("Property / building");
  const emailValid = EMAIL_RE.test((f.email ?? "").trim());

  const canSubmit =
    f.fullName?.trim() &&
    emailValid &&
    f.phone?.trim() &&
    f.orgName?.trim() &&
    status !== "sending";

  const details = useMemo(() => {
    const d: Array<{ label: string; value: string }> = [];
    const push = (label: string, value?: string) => {
      if (value && value.trim()) d.push({ label, value: value.trim() });
    };
    push("Organization name", f.orgName);
    push("Building address", f.address);
    push("Policy expiration", f.expiration);
    if (coverage.length) push("Coverage needed", coverage.join(", "));
    if (wantsGL) {
      push("Weekly attendance", f.attendance);
      push("Clergy / pastors", f.clergy);
      push("Paid staff", f.paidStaff);
      if (optCov.length) push("Optional coverages", optCov.join(", "));
    }
    if (wantsProperty) {
      push("Own or rent", f.ownRent);
      push("Construction type", f.construction);
      push("Year built", f.yearBuilt);
      push("Roof last replaced", f.roofYear);
      push("Roof type", f.roofType);
      push("Updates (electrical/plumbing/HVAC)", f.updates);
      push("Square footage", f.sqft);
      push("Heating type", f.heating);
      push("Coverage limit / building value", f.value);
      push("Wind / hurricane coverage", f.wind);
      push("Sprinklered", f.sprinklered);
      if (fireSec.length) push("Fire & security", fireSec.join(", "));
    }
    push("Claims (last 5 yrs)", f.claims);
    return d;
  }, [f, coverage, optCov, fireSec, wantsGL, wantsProperty]);

  // Funnel milestones driven by state.
  useEffect(() => {
    if (coverage.length > 0) track("CoverageSelected");
  }, [coverage, track]);
  useEffect(() => {
    if (f.fullName?.trim() && emailValid && f.phone?.trim()) {
      track("ContactDone");
    }
  }, [f.fullName, f.phone, emailValid, track]);

  // Keep a live snapshot so the capture handlers don't read a stale closure.
  const latest = useRef({ f, details, status });
  latest.current = { f, details, status };
  const sentPartial = useRef(false);

  // Partial capture: the moment a visitor gives us ANY way to reach them (a
  // valid email or a phone), capture them as a partial (final) lead so a
  // mid-form abandoner is never lost — org name and the rest are a bonus, not a
  // requirement. Fires at most once, on whichever comes first: leaving/
  // backgrounding the page OR 120s of inactivity (covers mobile WebViews that
  // never emit a clean unload). The intake route routes partials to quotes@
  // ONLY (no CRM/SMS), with a no-consent note — correct for a non-submitter.
  const firePartial = useRef(() => {});
  firePartial.current = () => {
    if (sentPartial.current) return;
    const { f: cur, details: det, status: st } = latest.current;
    if (st === "done" || st === "sending") return;
    const email = (cur.email ?? "").trim();
    const phone = (cur.phone ?? "").trim();
    const validEmail = EMAIL_RE.test(email) ? email : undefined;
    if (!(validEmail || phone)) return;
    sentPartial.current = true;
    const body = JSON.stringify({
      name: cur.fullName,
      email: validEmail,
      phone: phone || undefined,
      businessType: "House of worship",
      zip: extractZip(cur.address),
      source: "religious-landing",
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
    // Standard Lead pixel on submit, tagged with a shared event id so the
    // server-side CAPI Lead (POST /api/intake) dedupes to a single conversion.
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    fbq("track", "Lead", {}, { eventID: eventId });
    fbq("trackCustom", "ReligiousQuoteSubmit");
    // Redundant direct handoff to the CRM inbound-lead webhook. The server-side forward inside
    // /api/intake has been failing from Vercel (2026-08-13: 4 church fills with no CRM row), so the
    // browser also posts the flat contact fields straight to the CRM. no-cors keeps it
    // preflight-free (the webhook sets no CORS headers; text/plain body is parsed fine) at the cost
    // of an opaque response — acceptable, it's fire-and-forget redundancy. upsertInboundLead is
    // idempotent, so intake-forward + this both landing cannot duplicate the contact or re-text.
    // Mirrors the forward's mapping ("<businessType> — via <source>"); `details` stays out (the
    // webhook only takes flat fields — the deep answers reach quotes@ via /api/intake). FINAL
    // submits only — partials/abandons must never reach the CRM (its fan-out texts the lead).
    fetch("https://crm.cohesiveinsure.com/api/webhooks/inbound-lead", {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      body: JSON.stringify({
        source: "webform",
        name: f.fullName,
        email: f.email,
        phone: f.phone,
        business_type: "House of worship — via religious-landing",
        zip: extractZip(f.address),
      }),
    }).catch(() => {});
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.fullName,
          email: f.email,
          phone: f.phone,
          businessType: "House of worship",
          zip: extractZip(f.address),
          source: "religious-landing",
          details,
          eventId,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
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
          🙏
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#131517]">
          Thanks, we&rsquo;ve got it.
        </h1>
        <p className="mt-3 max-w-md text-[#6B6D71]">
          We&rsquo;ll review your info and reach out shortly with your quote.
          Want to talk now? Call{" "}
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
        <div className="mx-auto max-w-2xl px-5 py-8 sm:px-6 sm:py-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#2040E7]">
            For churches, synagogues, mosques &amp; temples
          </span>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#131517] sm:text-4xl">
            Insurance quote for your house of worship
          </h1>
          <p className="mt-3 text-[#27455C]">
            No spam, no obligation. We know you&rsquo;re busy - we can get you a
            quote without needing hours of your time.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="mx-auto max-w-2xl space-y-8 px-5 py-8 sm:px-6 sm:py-10">
        {/* Contact */}
        <Section title="Your contact info">
          <Field label="Full name" required>
            <Input value={f.fullName} onChange={(v) => set("fullName", v)} placeholder="Pastor Jane Smith" autoComplete="name" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field label="Email" required>
                <Input type="email" value={f.email} onChange={(v) => set("email", v)} placeholder="you@church.org" autoComplete="email" inputMode="email" />
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

        {/* Org basics */}
        <Section title="About your organization">
          <Field label="Organization name" required>
            <Input value={f.orgName} onChange={(v) => set("orgName", v)} placeholder="First Baptist Church" autoComplete="organization" />
          </Field>
          <Field label="Building address" hint="Street, city, state, ZIP">
            <AddressAutocomplete value={f.address} onChange={(v) => set("address", v)} placeholder="123 Main St, Springfield, IL 62704" />
          </Field>
          <Field label="When does your current policy expire?">
            <Select value={f.expiration} onChange={(v) => set("expiration", v)} options={EXPIRATION} placeholder="Select one" />
          </Field>
        </Section>

        {/* Coverage type (multi-select — replaces the two gate questions) */}
        <Section title="Coverage you need">
          <Field
            label="What coverage do you need?"
            hint="Select all that apply. Liability covers injuries to members/visitors and lawsuits; property covers your building and contents (fire, theft, storm)."
          >
            <CheckGroup
              options={COVERAGE_TYPES}
              selected={coverage}
              onToggle={toggle(setCoverage)}
            />
          </Field>
          {wantsGL && (
            <div className="space-y-4 rounded-xl border border-[#EEF1FF] bg-[#FBFCFF] p-4">
              <Field label="Weekly attendance">
                <Select value={f.attendance} onChange={(v) => set("attendance", v)} options={ATTENDANCE} placeholder="Select a range" />
              </Field>
              <Field label="Number of clergy / pastors">
                <Input type="number" value={f.clergy} onChange={(v) => set("clergy", v)} placeholder="2" />
              </Field>
              <Field label="Number of paid staff" hint="Enter 0 if everyone is a volunteer.">
                <Input type="number" value={f.paidStaff} onChange={(v) => set("paidStaff", v)} placeholder="0" />
              </Field>
              <Field label="Any optional coverages you want?" hint="Select all that apply.">
                <CheckGroup options={OPTIONAL_COVERAGES} selected={optCov} onToggle={toggle(setOptCov)} />
              </Field>
            </div>
          )}
        </Section>

        {/* Building details — only when property coverage is selected */}
        {wantsProperty && (
          <Section title="Your building">
            <div className="space-y-4 rounded-xl border border-[#EEF1FF] bg-[#FBFCFF] p-4">
              <Field label="Do you own or rent the building?">
                <Radio
                  name="ownRent"
                  value={f.ownRent}
                  onChange={(v) => set("ownRent", v)}
                  options={[
                    { label: "Own", value: "Own" },
                    { label: "Rent", value: "Rent" },
                  ]}
                />
              </Field>
              <Field label="Building construction type">
                <Select value={f.construction} onChange={(v) => set("construction", v)} options={CONSTRUCTION} placeholder="Select one" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Year the building was built" hint="Best guess is fine.">
                  <Input value={f.yearBuilt} onChange={(v) => set("yearBuilt", v)} placeholder="1978" />
                </Field>
                <Field label="Year the roof was last replaced" hint="Or type 'original'.">
                  <Input value={f.roofYear} onChange={(v) => set("roofYear", v)} placeholder="2015" />
                </Field>
              </div>
              <Field label="Roof type">
                <Select value={f.roofType} onChange={(v) => set("roofType", v)} options={ROOF_TYPE} placeholder="Select one" />
              </Field>
              <Field label="Update years, electrical / plumbing / HVAC" hint="The more recent, the lower your premium.">
                <Input value={f.updates} onChange={(v) => set("updates", v)} placeholder="electrical 2010, plumbing original, HVAC 2019" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Building square footage" hint="Best estimate is fine.">
                  <Input value={f.sqft} onChange={(v) => set("sqft", v)} placeholder="6,000" />
                </Field>
                <Field label="Heating type">
                  <Select value={f.heating} onChange={(v) => set("heating", v)} options={HEATING} placeholder="Select one" />
                </Field>
              </div>
              <Field label="Coverage limit / current building value (+ contents)" hint="Roughly rebuild cost or current value.">
                <Input value={f.value} onChange={(v) => set("value", v)} placeholder="$3,000,000" />
              </Field>
              <Field label="Do you want wind / hurricane coverage included?">
                <Radio name="wind" value={f.wind} onChange={(v) => set("wind", v)} options={WIND} />
              </Field>
              <Field label="Is the building sprinklered?">
                <Radio name="sprinklered" value={f.sprinklered} onChange={(v) => set("sprinklered", v)} options={YES_NO} />
              </Field>
              <Field label="Fire & security on site" hint="Select all that apply.">
                <CheckGroup options={FIRE_SECURITY} selected={fireSec} onToggle={toggle(setFireSec)} />
              </Field>
            </div>
          </Section>
        )}

        {/* Claims */}
        <Section title="Claims history">
          <Field label="Any property or liability claims in the last 5 years?">
            <Select value={f.claims} onChange={(v) => set("claims", v)} options={CLAIMS} placeholder="Select one" />
          </Field>
        </Section>

        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="min-h-[52px] w-full touch-manipulation rounded-xl bg-[#2040E7] px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-[#1A33B9] active:bg-[#1A33B9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Get my quote"}
        </button>
        <p className="text-center text-xs text-[#6B6D71]">
          We&rsquo;ll only use your details to prepare and send your insurance
          quote.
        </p>
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
  // A <div>, not a <label>: several fields hold button groups (radio/checkbox
  // chips), and wrapping those in a <label> makes tapping the question text
  // toggle the first chip + pollutes each button's accessible name. Instead we
  // push the label down to the control as an accessible name (aria-label).
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
// on focus, which is jarring on mobile. min-h keeps a comfortable tap target.
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
    // so poll for it before resolving — otherwise consumers init too early.
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

// A styled address input backed by Google Places. Drives a custom suggestions
// dropdown off AutocompleteService (the classic Autocomplete widget doesn't
// bind cleanly to a React-controlled input) + a session token so a whole
// type-then-select counts as one billed session. Dark-safe: with no key it's
// just a plain input.
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

function CheckGroup({
  options,
  selected,
  onToggle,
  ariaLabel,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((o) => {
        const active = selected.includes(o);
        return (
          <button
            type="button"
            key={o}
            onClick={() => onToggle(o)}
            aria-pressed={active}
            className={
              "min-h-[48px] touch-manipulation rounded-lg border px-4 py-3 text-[15px] font-medium transition " +
              (active
                ? "border-[#2040E7] bg-[#EEF1FF] text-[#1A33B9]"
                : "border-[#D8DEF5] bg-white text-[#131517] hover:border-[#2040E7]")
            }
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function extractZip(address?: string): string | undefined {
  if (!address) return undefined;
  const m = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  return m ? m[1] : undefined;
}
