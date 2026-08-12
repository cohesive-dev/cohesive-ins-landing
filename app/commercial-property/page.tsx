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
 * /commercial-property — deep intake landing page for commercial building
 * owners (LRO / lessors-risk lane).
 *
 * A/B counterpart to the native Meta Instant Form. Positioning is
 * property-first: we insure the BUILDING the visitor owns (retail, office,
 * mixed-use, apartment 5+, warehouse) — not their tenants' operations, and
 * explicitly NOT short-term rentals (Airbnb/VRBO) or 1–4 unit rental homes.
 * Renters and residential-rental use cases are disqualified inline and never
 * become leads.
 *
 * The building-underwriting block (year built + per-system update recency:
 * roof / electrical / plumbing / heating) is REQUIRED and fully structured
 * (selects, not free text) — these fields drive property rating and we can't
 * afford garbage answers. Everything flows to quotes@ + the CRM via
 * POST /api/intake (source "commercial-property-landing").
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

// Property type is the qualifier: commercial types continue, the two
// residential-rental types disqualify (Kevin: no Airbnbs / rental homes).
const PROPERTY_TYPES: Option[] = [
  { label: "Retail / storefront", value: "Retail / storefront" },
  { label: "Office building", value: "Office building" },
  { label: "Mixed-use (commercial + apartments)", value: "Mixed-use" },
  { label: "Apartment building (5+ units)", value: "Apartment building (5+ units)" },
  { label: "Warehouse / industrial", value: "Warehouse / industrial" },
  { label: "Other commercial building", value: "Other commercial" },
  { label: "Short-term rental (Airbnb / VRBO)", value: "Short-term rental" },
  { label: "Rental home (1-4 units)", value: "Rental home (1-4 units)" },
];
const DISQUALIFIED_TYPES = new Set([
  "Short-term rental",
  "Rental home (1-4 units)",
]);

const OCCUPANCY: Option[] = [
  { label: "Fully occupied", value: "Fully occupied" },
  { label: "Partially occupied", value: "Partially occupied" },
  { label: "Mostly / fully vacant", value: "Mostly/fully vacant" },
];

// Carriers rate construction class heavily and don't derive it from the
// address — so we ask instead of assuming.
const CONSTRUCTION: Option[] = [
  { label: "Brick / stone / masonry", value: "Brick / stone / masonry" },
  { label: "Wood frame", value: "Wood frame" },
  { label: "Steel / metal", value: "Steel / metal" },
  { label: "Concrete", value: "Concrete" },
  { label: "Mixed / not sure", value: "Mixed / not sure" },
];

const STORIES: Option[] = [
  { label: "1 story", value: "1" },
  { label: "2 stories", value: "2" },
  { label: "3 stories", value: "3" },
  { label: "4 or more", value: "4+" },
];

const ROOF_TYPE: Option[] = [
  { label: "Asphalt shingle", value: "Asphalt shingle" },
  { label: "Metal", value: "Metal" },
  { label: "Tile / slate", value: "Tile / slate" },
  { label: "Flat (rubber / membrane / tar)", value: "Flat (rubber/membrane/tar)" },
  { label: "Other / not sure", value: "Other / not sure" },
];

// Update recency is asked per system as a structured select — these four
// answers are underwriting-vital (they make or break the quote), so no free
// text: every answer is machine-usable and "Not sure" is an explicit state,
// not a blank.
const UPDATE_RANGES: Option[] = [
  { label: "Within the last 10 years", value: "Within last 10 years" },
  { label: "10-20 years ago", value: "10-20 years ago" },
  { label: "20+ years ago", value: "20+ years ago" },
  { label: "Original / never updated", value: "Original / never" },
  { label: "Not sure", value: "Not sure" },
];

const YES_NO: Option[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Not sure", value: "Not sure" },
];

// "Sprinklered" is asked as its own Y/N below (carriers want it explicit) so
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

// Fields in the building block — touching one fires the "PropertyStarted"
// funnel milestone.
const PROPERTY_SET_FIELDS = new Set([
  "construction",
  "stories",
  "yearBuilt",
  "roofType",
  "roofUpdated",
  "electricalUpdated",
  "plumbingUpdated",
  "heatingUpdated",
  "sqft",
  "value",
  "rentalIncome",
  "sprinklered",
]);

export default function CommercialPropertyLandingPage() {
  // Claims defaults to "None" — the common case, and it means the detail
  // block always carries a claims answer even if untouched.
  const [f, setF] = useState<FormState>({ claims: "None" });
  const [fireSec, setFireSec] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errMsg, setErrMsg] = useState("");

  // Funnel instrumentation: fire each milestone once per session so we can
  // measure abandonment (FormStart -> ContactDone -> PropertyQualified ->
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

  const emailValid = EMAIL_RE.test((f.email ?? "").trim());

  // Disqualifiers: renters, and residential-rental property types. The rest of
  // the form collapses to a polite "not a fit" message and nothing submits —
  // a disqualified visitor never becomes a lead.
  const rentDisqualified = f.ownProperty === "No";
  const typeDisqualified = DISQUALIFIED_TYPES.has(f.propertyType ?? "");
  const disqualified = rentDisqualified || typeDisqualified;
  useEffect(() => {
    if (disqualified) track("CPDisqualified");
  }, [disqualified, track]);

  const qualified =
    f.ownProperty === "Yes" &&
    !!f.propertyType &&
    !DISQUALIFIED_TYPES.has(f.propertyType);
  useEffect(() => {
    if (qualified) track("PropertyQualified");
  }, [qualified, track]);

  // The building-underwriting answers Kevin flagged as VITAL are hard
  // requirements: year built + all four system-update selects (each has a
  // "Not sure" escape hatch, so requiring them costs one tap, not a lookup).
  const buildingComplete =
    !!f.yearBuilt?.trim() &&
    !!f.roofUpdated &&
    !!f.electricalUpdated &&
    !!f.plumbingUpdated &&
    !!f.heatingUpdated;

  const canSubmit =
    f.fullName?.trim() &&
    emailValid &&
    f.phone?.trim() &&
    f.ownerName?.trim() &&
    f.address?.trim() &&
    qualified &&
    buildingComplete &&
    status !== "sending";

  const details = useMemo(() => {
    const d: Array<{ label: string; value: string }> = [];
    const push = (label: string, value?: string) => {
      if (value && value.trim()) d.push({ label, value: value.trim() });
    };
    push("Owner / LLC name", f.ownerName);
    push("Property address", f.address);
    push("Owns the property", f.ownProperty);
    push("Property type", f.propertyType);
    push("Occupancy", f.occupancy);
    push("Who occupies it (tenant mix)", f.tenants);
    push("Policy expiration", f.expiration);
    push("Construction type", f.construction);
    push("Stories", f.stories);
    push("Year built", f.yearBuilt);
    push("Square footage", f.sqft);
    push("Roof type", f.roofType);
    push("Roof replaced", f.roofUpdated);
    push("Electrical updated", f.electricalUpdated);
    push("Plumbing updated", f.plumbingUpdated);
    push("Heating / HVAC updated", f.heatingUpdated);
    push("Sprinklered", f.sprinklered);
    if (fireSec.length) push("Fire & security", fireSec.join(", "));
    push("Building value / coverage limit", f.value);
    push("Annual rental income", f.rentalIncome);
    push("Claims (last 5 yrs)", f.claims);
    return d;
  }, [f, fireSec]);

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

  // Partial capture: the moment a visitor gives us ANY way to reach them (a
  // valid email or a phone), capture them as a partial (final) lead so a
  // mid-form abandoner is never lost. Fires at most once, on whichever comes
  // first: leaving/backgrounding the page OR 120s of inactivity. The intake
  // route routes partials to quotes@ ONLY (no CRM/SMS). Disqualified visitors
  // are never captured — we told them we can't help; don't chase them.
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
      businessType: "Commercial property owner",
      zip: extractZip(cur.address),
      source: "commercial-property-landing",
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
    // Shared event id: sent in the POST body so the server-side CAPI Lead
    // (/api/intake) dedupes to a single conversion with the browser Lead below.
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.fullName,
          email: f.email,
          phone: f.phone,
          businessType: "Commercial property owner",
          zip: extractZip(f.address),
          source: "commercial-property-landing",
          details,
          eventId,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      // Fire the pixel ONLY after the intake POST succeeds, so test / failed /
      // abandoned submits never count. Lead carries the shared eventID so the
      // browser + server CAPI Lead dedupe to a single conversion.
      fbq("track", "Lead", {}, { eventID: eventId });
      fbq("trackCustom", "CommercialPropertySubmit");
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
          🏢
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#131517]">
          Thanks — we&rsquo;ve got it.
        </h1>
        <p className="mt-3 max-w-md text-[#6B6D71]">
          We&rsquo;ll review your building details and reach out shortly with
          your quote. Want to talk now? Call{" "}
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
            For commercial building owners
          </span>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#131517] sm:text-4xl">
            Commercial property insurance for your building
          </h1>
          <p className="mt-3 text-[#27455C]">
            Coverage for the building you own — retail, office, mixed-use,
            apartments, warehouse. We insure the property itself: fire, wind,
            water damage, and lost rents. No spam, no obligation.
          </p>
          <p className="mt-2 text-sm text-[#6B6D71]">
            We insure commercial buildings only — not short-term rentals
            (Airbnb/VRBO) or 1–4 unit rental homes.
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

        {/* Property basics + qualifier */}
        <Section title="About the property">
          <Field label="Owner name (you or your LLC)" required hint="Whoever holds title to the building.">
            <Input value={f.ownerName} onChange={(v) => set("ownerName", v)} placeholder="123 Main Street Holdings LLC" autoComplete="organization" />
          </Field>
          <Field label="Property address" required hint="Street, city, state, ZIP">
            <AddressAutocomplete value={f.address} onChange={(v) => set("address", v)} placeholder="123 Main St, Springfield, IL 62704" />
          </Field>
          <Field label="Do you own this property?" required>
            <Radio
              name="ownProperty"
              value={f.ownProperty}
              onChange={(v) => set("ownProperty", v)}
              options={[
                { label: "Yes, I own it", value: "Yes" },
                { label: "No — I rent or lease it", value: "No" },
              ]}
            />
          </Field>
          {rentDisqualified && (
            <Notice>
              We only insure buildings for their owners. If you rent your space,
              your landlord insures the building — you&rsquo;d want business
              insurance for your own operations instead, which we don&rsquo;t
              quote on this page.
            </Notice>
          )}
          {!rentDisqualified && (
            <Field label="What kind of property is it?" required>
              <Select value={f.propertyType} onChange={(v) => set("propertyType", v)} options={PROPERTY_TYPES} placeholder="Select one" />
            </Field>
          )}
          {typeDisqualified && !rentDisqualified && (
            <Notice>
              Sorry — we don&rsquo;t insure short-term rentals or 1–4 unit
              rental homes. We only cover commercial buildings (retail, office,
              mixed-use, 5+ unit apartments, warehouse).
            </Notice>
          )}
          {qualified && (
            <>
              <Field label="How occupied is the building?">
                <Radio name="occupancy" value={f.occupancy} onChange={(v) => set("occupancy", v)} options={OCCUPANCY} />
              </Field>
              <Field label="Who occupies it?" hint="Tenant mix matters — e.g. 'nail salon + 2 apartments upstairs'. Your own business counts too.">
                <Input value={f.tenants} onChange={(v) => set("tenants", v)} placeholder="Restaurant on ground floor, offices above" />
              </Field>
              <Field label="When does your current policy expire?">
                <Select value={f.expiration} onChange={(v) => set("expiration", v)} options={EXPIRATION} placeholder="Select one" />
              </Field>
            </>
          )}
        </Section>

        {/* Building details — the underwriting-vital block */}
        {qualified && (
          <Section title="Your building">
            <p className="text-sm text-[#6B6D71]">
              These details drive your rate — recent updates usually mean a
              lower premium. Best guesses are fine; &ldquo;not sure&rdquo; is
              always an option.
            </p>
            <div className="space-y-4 rounded-xl border border-[#EEF1FF] bg-[#FBFCFF] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Year the building was built" required hint="Best guess is fine.">
                  <Input value={f.yearBuilt} onChange={(v) => set("yearBuilt", v)} placeholder="1978" inputMode="numeric" />
                </Field>
                <Field label="Building square footage" hint="Best estimate is fine.">
                  <Input value={f.sqft} onChange={(v) => set("sqft", v)} placeholder="8,000" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Building construction type">
                  <Select value={f.construction} onChange={(v) => set("construction", v)} options={CONSTRUCTION} placeholder="Select one" />
                </Field>
                <Field label="Number of stories">
                  <Select value={f.stories} onChange={(v) => set("stories", v)} options={STORIES} placeholder="Select one" />
                </Field>
              </div>
              <Field label="Roof type">
                <Select value={f.roofType} onChange={(v) => set("roofType", v)} options={ROOF_TYPE} placeholder="Select one" />
              </Field>
              <Field label="When was the roof last replaced?" required>
                <Select value={f.roofUpdated} onChange={(v) => set("roofUpdated", v)} options={UPDATE_RANGES} placeholder="Select one" />
              </Field>
              <Field label="When was the electrical last updated?" required>
                <Select value={f.electricalUpdated} onChange={(v) => set("electricalUpdated", v)} options={UPDATE_RANGES} placeholder="Select one" />
              </Field>
              <Field label="When was the plumbing last updated?" required>
                <Select value={f.plumbingUpdated} onChange={(v) => set("plumbingUpdated", v)} options={UPDATE_RANGES} placeholder="Select one" />
              </Field>
              <Field label="When was the heating / HVAC last updated?" required>
                <Select value={f.heatingUpdated} onChange={(v) => set("heatingUpdated", v)} options={UPDATE_RANGES} placeholder="Select one" />
              </Field>
              <Field label="Is the building sprinklered?">
                <Radio name="sprinklered" value={f.sprinklered} onChange={(v) => set("sprinklered", v)} options={YES_NO} />
              </Field>
              <Field label="Fire & security on site" hint="Select all that apply.">
                <CheckGroup options={FIRE_SECURITY} selected={fireSec} onToggle={toggle(setFireSec)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Building value / coverage limit" hint="Roughly rebuild cost or current value.">
                  <Input value={f.value} onChange={(v) => set("value", v)} placeholder="$1,500,000" />
                </Field>
                <Field label="Annual rental income" hint="Optional — for loss-of-rents coverage.">
                  <Input value={f.rentalIncome} onChange={(v) => set("rentalIncome", v)} placeholder="$120,000" />
                </Field>
              </div>
            </div>
          </Section>
        )}

        {/* Claims */}
        {qualified && (
          <Section title="Claims history">
            <Field label="Any property or liability claims in the last 5 years?">
              <Select value={f.claims} onChange={(v) => set("claims", v)} options={CLAIMS} placeholder="Select one" />
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
