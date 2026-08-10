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
 * /restaurant — deep intake landing page for restaurants, bars, cafes, and
 * food businesses. A/B counterpart to the native Meta Instant Form.
 *
 * Same architecture as /religious: a conditional questionnaire with a GL gate
 * and a property gate that reveal only the relevant blocks, multi-select
 * safeguards, Google Places address autocomplete, and Meta Pixel + server CAPI
 * conversion tracking deduped via a shared eventId.
 *
 * THE POINT of this page (vs /religious): a THREE-WAY qualification computed
 * from the answers fires DIFFERENT Meta events so the ad optimizer learns which
 * restaurants are instant-quotable under our admitted carriers (Rainbow/Next):
 *   - QUALIFIED  (not a bar, alcohol None/Under 30%) -> standard `Lead`.
 *   - E&S        (restaurant, alcohol 30-75%)        -> `RestaurantLeadES`
 *                 (a real lead to CRM/quotes@, but NOT a `Lead` conversion, so
 *                 Meta captures it without optimizing toward it).
 *   - DISQUALIFIED (bar, alcohol Over 75%, or not a food business)
 *                 -> `RestaurantDisqualified` + a polite not-a-fit end screen,
 *                 no `Lead` and no CRM forward, so the optimizer stops serving
 *                 bar owners.
 * All flow to POST /api/intake (source "restaurant-landing"); the server reads
 * `capiEventName` to fire the matching server-side CAPI event.
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

// Q2 gate. "Bar / lounge / tavern" and "Not a food business" drive the
// qualification below; "Not a food business" is an immediate hard disqualify.
const BAR_TYPE = "Bar / tavern / brewery";
const NOT_FOOD_TYPE = "Not a food business";
// Each valid type maps STRAIGHT to a Rainbow `type_of_restaurant` class code so
// the quoter needs zero inference; the code rides into /api/intake details as
// "Rainbow class" for the qualified + E&S outcomes. Bar (Rainbow G/H) and
// not-a-food-business are out of appetite -> no class, disqualify.
type BizType = Option & { rainbowClass?: string };
const BUSINESS_TYPES: BizType[] = [
  {
    label: "Coffee / café / bakery (little or no cooking)",
    value: "Coffee / café / bakery (little or no cooking)",
    rainbowClass: "E",
  },
  {
    label: "Fast food / counter service (grill or fryer)",
    value: "Fast food / counter service (grill or fryer)",
    rainbowClass: "A",
  },
  {
    label: "Full-service / sit-down restaurant",
    value: "Full-service / sit-down restaurant",
    rainbowClass: "Z",
  },
  { label: "Fine dining", value: "Fine dining", rainbowClass: "D" },
  { label: "Food truck / cart", value: "Food truck / cart", rainbowClass: "J" },
  { label: "Bar / tavern / brewery", value: BAR_TYPE },
  { label: "Not a food business", value: NOT_FOOD_TYPE },
];

const rainbowClassFor = (businessType?: string): string | undefined =>
  BUSINESS_TYPES.find((o) => o.value === businessType)?.rainbowClass;

// Q7-equivalent coverage product. GL only = liability, skips the property
// block; BOP = the instant-quote product (liability + building & contents),
// reveals the property block.
const COVERAGE: Option[] = [
  { label: "General Liability only (GL)", value: "GL" },
  {
    label: "Business Owner's Policy (BOP - liability + building & contents)",
    value: "BOP",
  },
];

const EXPIRATION: Option[] = [
  { label: "This month", value: "This month" },
  { label: "In 1-3 months", value: "In 1-3 months" },
  { label: "In 3-6 months", value: "In 3-6 months" },
  { label: "6+ months out", value: "6+ months out" },
  { label: "Not sure", value: "Not sure" },
  { label: "No coverage right now", value: "No coverage now" },
];

// Q7 alcohol tier — the master routing driver. None/Under 30% = admitted
// (Rainbow/Next); 30-75% = E&S; Over 75% = true bar (disqualify).
const ALCOHOL: Option[] = [
  { label: "None", value: "None" },
  { label: "Under 30%", value: "Under 30%" },
  { label: "30-75%", value: "30-75%" },
  { label: "Over 75%", value: "Over 75%" },
];

const HEATING: Option[] = [
  { label: "Forced air (gas)", value: "Forced air (gas)" },
  { label: "Electric", value: "Electric" },
  { label: "Space heaters", value: "Space heaters" },
  { label: "Wood stove", value: "Wood stove" },
  { label: "Not sure", value: "Not sure" },
];

const WIND: Option[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Not sure", value: "Not sure" },
];

const FIRE_SECURITY: string[] = [
  "Sprinklers",
  "Monitored fire alarm",
  "Burglar alarm",
  "Fire extinguishers",
  "Hood suppression (Ansul)",
  "None",
];

const CLAIMS: Option[] = [
  { label: "None", value: "None" },
  { label: "One", value: "One" },
  { label: "Two or more", value: "Two or more" },
  { label: "Prefer to discuss", value: "Prefer to discuss" },
];

type FormState = Record<string, string>;

type Qualification = "qualified" | "es" | "disqualified";

// Three-way qualification from the answers (see file header):
//   - disqualified: bar/tavern/brewery, alcohol Over 75%, or not a food business.
//   - es:           restaurant (not bar), alcohol 30-75%.
//   - qualified:    everything else (not a bar, alcohol None/Under 30%).
function qualify(businessType?: string, alcohol?: string): Qualification {
  if (businessType === BAR_TYPE || businessType === NOT_FOOD_TYPE) {
    return "disqualified";
  }
  if (alcohol === "Over 75%") return "disqualified";
  if (alcohol === "30-75%") return "es";
  return "qualified";
}

// Fields in the property block — touching one fires the "PropertyStarted"
// funnel milestone.
const PROPERTY_SET_FIELDS = new Set([
  "ownRent",
  "yearBuilt",
  "roofYear",
  "updates",
  "sqft",
  "heating",
  "value",
  "wind",
]);

export default function RestaurantLandingPage() {
  // Claims defaults to "None" — the common case, and it means the detail block
  // always carries a claims answer even if untouched.
  const [f, setF] = useState<FormState>({ claims: "None" });
  const [fireSec, setFireSec] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "sending" | "done" | "es-done" | "disqualified" | "error"
  >("idle");
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

  // Single coverage gate: BOP (the instant-quote product) reveals the property
  // block; GL only skips it. Revenue + alcohol are always asked now (both lanes
  // need them for routing/class/qualification).
  const wantsProperty = f.coverage === "BOP";
  const owns = f.ownRent === "Own";
  const emailValid = EMAIL_RE.test((f.email ?? "").trim());
  const notFood = f.businessType === NOT_FOOD_TYPE;

  // "Coverage selected" here = the coverage product has been chosen.
  const gatesAnswered = Boolean(f.coverage);

  const canSubmit =
    !notFood &&
    f.fullName?.trim() &&
    emailValid &&
    f.phone?.trim() &&
    f.businessName?.trim() &&
    f.businessType?.trim() &&
    gatesAnswered &&
    status !== "sending";

  const details = useMemo(() => {
    const d: Array<{ label: string; value: string }> = [];
    const push = (label: string, value?: string) => {
      if (value && value.trim()) d.push({ label, value: value.trim() });
    };
    push("Business name", f.businessName);
    push("Business type", f.businessType);
    // Rainbow class code (only the in-appetite types carry one) so the quoter
    // needs zero inference. Absent for bar / not-a-food-business (disqualified).
    push("Rainbow class", rainbowClassFor(f.businessType));
    push("Building address", f.address);
    push("Policy expiration", f.expiration);
    // Revenue + alcohol are asked on both lanes now (routing/class/qualification).
    push("Approximate annual revenue", f.revenue);
    push("Alcohol as % of sales", f.alcohol);
    push("Coverage needed", f.coverage === "BOP" ? "BOP (liability + property)" : f.coverage === "GL" ? "GL only" : f.coverage);
    if (wantsProperty) {
      push("Own or rent", f.ownRent);
      if (owns) {
        push("Year built", f.yearBuilt);
        push("Roof last replaced", f.roofYear);
        push("Updates (electrical/plumbing/HVAC)", f.updates);
      }
      push("Square footage", f.sqft);
      push("Heating type", f.heating);
      push("Desired coverage limit (building + contents)", f.value);
      push("Wind / hurricane coverage", f.wind);
      if (fireSec.length) push("Fire & security", fireSec.join(", "));
    }
    push("Claims (last 5 yrs)", f.claims);
    return d;
  }, [f, fireSec, wantsProperty, owns]);

  // Funnel milestones driven by state.
  useEffect(() => {
    if (gatesAnswered) track("CoverageSelected");
  }, [gatesAnswered, track]);
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
  // mid-form abandoner is never lost. Fires at most once, on whichever comes
  // first: leaving/backgrounding the page OR 120s of inactivity. The intake
  // route routes partials to quotes@ ONLY (no CRM/SMS, no CAPI), with a
  // no-consent note — correct for a non-submitter.
  const firePartial = useRef(() => {});
  firePartial.current = () => {
    if (sentPartial.current) return;
    const { f: cur, details: det, status: st } = latest.current;
    if (st === "done" || st === "es-done" || st === "sending") return;
    // A visitor who picked "Not a food business" is a disqualify, not a lead —
    // never capture them, even as a partial.
    if (cur.businessType === NOT_FOOD_TYPE) return;
    const email = (cur.email ?? "").trim();
    const phone = (cur.phone ?? "").trim();
    const validEmail = EMAIL_RE.test(email) ? email : undefined;
    if (!(validEmail || phone)) return;
    sentPartial.current = true;
    const body = JSON.stringify({
      name: cur.fullName,
      email: validEmail,
      phone: phone || undefined,
      businessType: cur.businessType || "Restaurant",
      zip: extractZip(cur.address),
      source: "restaurant-landing",
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

    const qualification = qualify(f.businessType, f.alcohol);

    // Shared event id: sent in the POST body so the server-side CAPI event
    // (/api/intake) dedupes to a single conversion with the browser event below.
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    // Map qualification -> the CAPI event name the server fires and the browser
    // pixel event. Disqualified fires a custom (non-Lead) event both sides and
    // the server skips the CRM forward.
    const capiEventName =
      qualification === "qualified"
        ? "Lead"
        : qualification === "es"
          ? "RestaurantLeadES"
          : "RestaurantDisqualified";

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.fullName,
          email: f.email,
          phone: f.phone,
          businessType: f.businessType || "Restaurant",
          zip: extractZip(f.address),
          source: "restaurant-landing",
          details,
          eventId,
          capiEventName,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      // Fire the pixel ONLY after the intake POST succeeds (test/failed/
      // abandoned submits never count). Each event carries the shared eventID
      // so browser + server CAPI dedupe to a single conversion.
      if (qualification === "qualified") {
        fbq("track", "Lead", {}, { eventID: eventId });
        fbq("trackCustom", "RestaurantQuoteSubmit");
        setStatus("done");
      } else if (qualification === "es") {
        // A real lead, but NOT a `Lead` conversion — Meta captures it without
        // optimizing toward it.
        fbq("trackCustom", "RestaurantLeadES", {}, { eventID: eventId });
        setStatus("es-done");
      } else {
        // Disqualified: non-Lead signal so the optimizer stops serving bars.
        fbq("trackCustom", "RestaurantDisqualified", {}, { eventID: eventId });
        setStatus("disqualified");
      }
    } catch (err) {
      setStatus("error");
      fbq("trackCustom", "SubmitError");
      setErrMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  // "Not a food business" is an immediate hard disqualify (Close-style): the
  // moment it's picked, fire the non-Lead signal + show the not-a-fit screen.
  // No contact info is required — the custom event still matches on fbp/ip/ua.
  const disqualifiedFired = useRef(false);
  useEffect(() => {
    if (!notFood || disqualifiedFired.current) return;
    disqualifiedFired.current = true;
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    fbq("trackCustom", "RestaurantDisqualified", {}, { eventID: eventId });
    const email = (f.email ?? "").trim();
    const phone = (f.phone ?? "").trim();
    const validEmail = EMAIL_RE.test(email) ? email : undefined;
    // Only POST when we have something to match on; a bare disqualify still
    // gets the browser pixel above.
    if (validEmail || phone) {
      fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          name: f.fullName,
          email: validEmail,
          phone: phone || undefined,
          businessType: NOT_FOOD_TYPE,
          zip: extractZip(f.address),
          source: "restaurant-landing",
          eventId,
          capiEventName: "RestaurantDisqualified",
        }),
      }).catch(() => {});
    }
    setStatus("disqualified");
  }, [notFood, f.email, f.phone, f.fullName, f.address]);

  if (status === "done" || status === "es-done") {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF1FF] text-3xl">
          🍽️
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#131517]">
          Thanks — we&rsquo;ve got it.
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

  if (status === "disqualified") {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F3F5] text-3xl">
          🙏
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#131517]">
          Thanks for reaching out.
        </h1>
        <p className="mt-3 max-w-md text-[#6B6D71]">
          Based on your answers, this isn&rsquo;t a risk we&rsquo;re the best fit
          for right now. If your business changes or you&rsquo;d like a second
          opinion, call us at{" "}
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
            For restaurants, bars, cafes &amp; food businesses
          </span>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#131517] sm:text-4xl">
            Free restaurant insurance quote
          </h1>
          <p className="mt-3 text-[#27455C]">
            A few quick questions and we&rsquo;ll shop your GL and property
            across our carriers. No spam, no obligation.
          </p>
        </div>
      </section>

      <form
        onSubmit={submit}
        className="mx-auto max-w-2xl space-y-8 px-5 py-8 sm:px-6 sm:py-10"
      >
        {/* Contact */}
        <Section title="Your contact info">
          <Field label="Full name" required>
            <Input
              value={f.fullName}
              onChange={(v) => set("fullName", v)}
              placeholder="Jane Smith"
              autoComplete="name"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field label="Email" required>
                <Input
                  type="email"
                  value={f.email}
                  onChange={(v) => set("email", v)}
                  placeholder="you@restaurant.com"
                  autoComplete="email"
                  inputMode="email"
                />
              </Field>
              {f.email && !emailValid && (
                <p className="mt-1 text-xs text-red-600">
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <Field label="Phone" required>
              <Input
                type="tel"
                value={f.phone}
                onChange={(v) => set("phone", v)}
                placeholder="(929) 594-5450"
                autoComplete="tel"
                inputMode="tel"
              />
            </Field>
          </div>
        </Section>

        {/* Business basics */}
        <Section title="About your business">
          <Field label="Business name" required>
            <Input
              value={f.businessName}
              onChange={(v) => set("businessName", v)}
              placeholder="Joe's Diner"
              autoComplete="organization"
            />
          </Field>
          <Field label="Which best describes your business?" required>
            <Radio
              name="businessType"
              value={f.businessType}
              onChange={(v) => set("businessType", v)}
              options={BUSINESS_TYPES}
            />
          </Field>
          {notFood && (
            <p className="rounded-lg bg-[#F1F3F5] px-4 py-3 text-sm text-[#6B6D71]">
              We focus on food and hospitality businesses, so this likely
              isn&rsquo;t the right fit.
            </p>
          )}
          <Field label="Exact building address" hint="Street, city, state, ZIP">
            <AddressAutocomplete
              value={f.address}
              onChange={(v) => set("address", v)}
              placeholder="123 Main St, Springfield, IL 62704"
            />
          </Field>
          <Field label="When does your current policy expire?">
            <Select
              value={f.expiration}
              onChange={(v) => set("expiration", v)}
              options={EXPIRATION}
              placeholder="Select one"
            />
          </Field>
        </Section>

        {/* Revenue + alcohol — always asked (routing / class / qualification) */}
        <Section title="Your business volume">
          <Field
            label="Approximate annual revenue"
            hint="A dollar figure. Best estimate is fine."
          >
            <Input
              value={f.revenue}
              onChange={(v) => set("revenue", v)}
              placeholder="$750,000"
              inputMode="numeric"
            />
          </Field>
          <Field
            label="Alcohol as % of sales"
            hint="Roughly what share of your sales is alcohol."
          >
            <Radio
              name="alcohol"
              value={f.alcohol}
              onChange={(v) => set("alcohol", v)}
              options={ALCOHOL}
            />
          </Field>
        </Section>

        {/* Single coverage gate — GL vs BOP */}
        <Section title="Coverage you need">
          <Field
            label="What coverage do you need?"
            required
            hint="BOP bundles liability with your building and contents (fire, theft, storm) and is our fastest instant quote. Pick BOP even if you rent and just want your equipment/build-out covered."
          >
            <Radio
              name="coverage"
              value={f.coverage}
              onChange={(v) => set("coverage", v)}
              options={COVERAGE}
            />
          </Field>

          {wantsProperty && (
            <div className="space-y-4 rounded-xl border border-[#EEF1FF] bg-[#FBFCFF] p-4">
              <Field label="Do you own or rent the space?">
                <Radio
                  name="ownRent"
                  value={f.ownRent}
                  onChange={(v) => set("ownRent", v)}
                  options={[
                    { label: "Own", value: "Own" },
                    { label: "Rent (tenant)", value: "Rent" },
                  ]}
                />
              </Field>

              {/* Structure questions the landlord owns — Own only. */}
              {owns && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Year the building was built"
                      hint="Best guess is fine."
                    >
                      <Input
                        value={f.yearBuilt}
                        onChange={(v) => set("yearBuilt", v)}
                        placeholder="1978"
                      />
                    </Field>
                    <Field
                      label="Year the roof was last replaced"
                      hint="Or type 'original'."
                    >
                      <Input
                        value={f.roofYear}
                        onChange={(v) => set("roofYear", v)}
                        placeholder="2015"
                      />
                    </Field>
                  </div>
                  <Field
                    label="Update years — electrical / plumbing / HVAC"
                    hint="The more recent, the lower your premium."
                  >
                    <Input
                      value={f.updates}
                      onChange={(v) => set("updates", v)}
                      placeholder="electrical 2010, plumbing original, HVAC 2019"
                    />
                  </Field>
                </>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Building square footage"
                  hint="Best estimate is fine."
                >
                  <Input
                    value={f.sqft}
                    onChange={(v) => set("sqft", v)}
                    placeholder="3,000"
                    inputMode="numeric"
                  />
                </Field>
                <Field label="Heating type">
                  <Select
                    value={f.heating}
                    onChange={(v) => set("heating", v)}
                    options={HEATING}
                    placeholder="Select one"
                  />
                </Field>
              </div>
              <Field
                label="Desired coverage limit — building (if owned) + contents / build-out"
                hint="How much you'd want it insured for - roughly the rebuild cost or current value. Best guess is fine."
              >
                <Input
                  value={f.value}
                  onChange={(v) => set("value", v)}
                  placeholder="$500,000"
                />
              </Field>
              <Field label="Do you want wind / hurricane coverage included?">
                <Radio
                  name="wind"
                  value={f.wind}
                  onChange={(v) => set("wind", v)}
                  options={WIND}
                />
              </Field>
              <Field label="Fire & security on site" hint="Select all that apply.">
                <CheckGroup
                  options={FIRE_SECURITY}
                  selected={fireSec}
                  onToggle={toggle(setFireSec)}
                />
              </Field>
            </div>
          )}
        </Section>

        {/* Claims */}
        <Section title="Claims history">
          <Field label="Any property or liability claims in the last 5 years?">
            <Select
              value={f.claims}
              onChange={(v) => set("claims", v)}
              options={CLAIMS}
              placeholder="Select one"
            />
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
