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
import { isValidPhoneNumber } from "libphonenumber-js/min";
import isEmail from "validator/lib/isEmail";
import { track as vaTrack } from "@vercel/analytics";

/**
 * The restaurant deep-intake form — shared by /restaurant (full-page lane,
 * default props) and the programmatic SEO pages (/insurance/[vertical]/[geo],
 * `embedded` + a per-page `source`). Extracted verbatim from app/restaurant;
 * /restaurant behavior is unchanged.
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
 *   - E&S        (restaurant, alcohol 30-50%)        -> `RestaurantLeadES`
 *                 (a real lead to CRM/quotes@, but NOT a `Lead` conversion, so
 *                 Meta captures it without optimizing toward it).
 *   - DISQUALIFIED (bar, alcohol Over 50%, or not a food business)
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

// Email validation = validator.js isEmail (RFC-aware: rejects double dots, bad TLDs, spaces,
// over-length locals) instead of a shape regex. EMAIL_RE kept as a name for the callers.
const EMAIL_RE = { test: (v: string) => isEmail((v ?? "").trim()) };
// Domain-typo nudge - the real mobile failure mode. Suggest, never auto-correct.
const EMAIL_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gamil.com": "gmail.com", "gmal.com": "gmail.com", "gmail.co": "gmail.com",
  "gmail.con": "gmail.com", "gnail.com": "gmail.com", "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com", "outlok.com": "outlook.com",
  "iclod.com": "icloud.com", "icloud.co": "icloud.com", "aol.co": "aol.com",
};
const emailSuggestion = (v: string): string | undefined => {
  const at = (v ?? "").trim().toLowerCase().lastIndexOf("@");
  if (at < 1) return undefined;
  const dom = v.trim().toLowerCase().slice(at + 1);
  const fix = EMAIL_TYPOS[dom];
  return fix ? v.trim().slice(0, at + 1) + fix : undefined;
};
// Phone validation = Google libphonenumber (US default region): real NANP rules (area code /
// exchange can't start with 0 or 1, unassigned 555 area code rejected, +1 / spaces / dashes /
// parens accepted). Not a length check.
const PHONE_OK = (v: string) => isValidPhoneNumber((v ?? "").trim(), "US");

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

// Revenue buckets for the STEP layout (a tap, not a typed figure - the whole point of the early
// screens). Matches the v6 Instant Form's bands. The long layout keeps its typed dollar field.
const REVENUE: Option[] = [
  { label: "Under $250K", value: "Under $250K" },
  { label: "$250K - $500K", value: "$250K - $500K" },
  { label: "$500K - $1M", value: "$500K - $1M" },
  { label: "$1M - $2M", value: "$1M - $2M" },
  { label: "$2M - $4M", value: "$2M - $4M" },
  { label: "Over $4M", value: "Over $4M" },
];

// Founding year — matches the v6 Instant Form. Without it Rainbow defaults every restaurant to
// "established 2015"; a real new venture (<1yr / 1-3yr) needs three extra material answers.
const FOUNDING_YEAR: Option[] = [
  { label: "Not opened yet", value: "Not opened yet" },
  { label: "Less than 1 year ago", value: "Less than 1 year ago" },
  { label: "1-3 years ago", value: "1-3 years ago" },
  { label: "3-10 years ago", value: "3-10 years ago" },
  { label: "10+ years ago", value: "10+ years ago" },
];

// Alcohol tier — the master routing driver, at Rainbow's real break points.
// None/Under 30% = admitted (Rainbow/Next); 30-50% = E&S; Over 50% = true bar
// (disqualify).
// Buckets match the v6 Instant Form (comparable data) and Rainbow's real breakpoints:
// <=35% instant / 35-50% refer (E&S) / >50% bar (disqualify).
const ALCOHOL: Option[] = [
  { label: "None", value: "None" },
  { label: "Under 10%", value: "Under 10%" },
  { label: "10-20%", value: "10-20%" },
  { label: "20-35%", value: "20-35%" },
  { label: "35-50%", value: "35-50%" },
  { label: "Over 50%", value: "Over 50%" },
];
const ES_ALCOHOL = new Set(["35-50%", "30-50%"]);  // 30-50% kept for any in-flight sessions

// Coverage timeline — mirrors the Instant Form's `coverage_timeline` buckets so the
// website lane and the form lane are comparable. now/30d = URGENT. On a qualified
// (instant-quotable) lead this fires the pixel event `LeadUrgentQuoted`, which a
// website adset can optimise on directly today (a form adset cannot until the CRM
// data source exists - see the restaurant skill).
const TIMELINE: Option[] = [
  { label: "I need coverage now", value: "now" },
  { label: "Within 30 days", value: "30d" },
  { label: "1 to 3 months", value: "1_3mo" },
  { label: "Just exploring", value: "exploring" },
];
const URGENT_TIMELINES = new Set(["now", "30d"]);
// Step-form section split: business questions vs. contact fields (label above the progress bar).
const CONTACT_KEYS = new Set(["businessName", "fullName", "email", "phone"]);

// Business structure = the policy's named insured type (a sole prop's named
// insured is a person, an LLC's is the entity). Captured so bind needs no
// follow-up on who the policy is issued to.
const ENTITY_TYPES: Option[] = [
  { label: "LLC", value: "LLC" },
  { label: "Corporation", value: "Corporation" },
  { label: "Sole proprietorship", value: "Sole proprietorship" },
  { label: "Partnership", value: "Partnership" },
];

type FormState = Record<string, string>;

type Qualification = "qualified" | "es" | "disqualified";

// Three-way qualification from the answers (see file header):
//   - disqualified: bar/tavern/brewery, alcohol Over 50%, or not a food business.
//   - es:           restaurant (not bar), alcohol 30-50%.
//   - qualified:    everything else (not a bar, alcohol None/Under 30%).
// barOk (SEO bar pages): bars and high-alcohol answers are the AUDIENCE, not a
// disqualify - they route to the E&S capture path instead of being turned
// away. The ad lane keeps barOk=false so Meta never optimizes toward bars.
function qualify(
  businessType?: string,
  alcohol?: string,
  barOk = false,
): Qualification {
  if (businessType === NOT_FOOD_TYPE) return "disqualified";
  if (businessType === BAR_TYPE) return barOk ? "es" : "disqualified";
  if (alcohol === "Over 50%") return barOk ? "es" : "disqualified";
  if (alcohol && ES_ALCOHOL.has(alcohol)) return "es";
  return "qualified";
}

// Touching own/rent fires the "PropertyStarted" funnel milestone.
const PROPERTY_SET_FIELDS = new Set(["ownRent"]);

export default function RestaurantIntakeForm({
  source = "restaurant-landing",
  embedded = false,
  mode = "restaurant",
  layout = "long",
}: {
  // "steps" = one question per screen with Next/Back (Kevin 2026-08-16: mirror the FB Instant
  // Form - taps first, typing last, sunk cost before the contact fields). Same state, same
  // qualify(), same submit and CAPI events as "long"; ONLY the rendering differs. Restaurant
  // /restaurant uses "steps"; SEO pages keep "long" as the control.
  layout?: "long" | "steps";
  // CRM attribution label for this placement (e.g. "seo-restaurant-new-york").
  source?: string;
  // true = render just the form (no hero, terminal states as inline cards)
  // for embedding inside another page.
  embedded?: boolean;
  // "bar" (SEO bar pages): bar/high-alcohol answers are captured as E&S leads
  // instead of disqualified, and the bar chip is listed first.
  mode?: "restaurant" | "bar";
}) {
  const barOk = mode === "bar";
  const businessTypes = barOk
    ? [
        BUSINESS_TYPES.find((o) => o.value === BAR_TYPE)!,
        ...BUSINESS_TYPES.filter((o) => o.value !== BAR_TYPE),
      ]
    : BUSINESS_TYPES;
  // Claims defaults to "None" — the common case, and it means the detail block
  // always carries a claims answer even if untouched.
  const [f, setF] = useState<FormState>({ claims: "None" });
  const [status, setStatus] = useState<
    "idle" | "sending" | "done" | "es-done" | "disqualified" | "error"
  >("idle");
  const [errMsg, setErrMsg] = useState("");

  // Funnel instrumentation: fire each milestone once per session so we can
  // measure abandonment (FormStart -> ContactDone -> CoverageSelected ->
  // PropertyStarted -> Lead) and see exactly where people drop off.
  const fired = useRef<Set<string>>(new Set());
  // Every milestone goes to BOTH the Meta pixel (ad optimisation) and Vercel Analytics
  // (first-party, not ad-blocked - the drop-off dashboard). Props: layout + source.
  const track = useCallback((name: string, props?: Record<string, string | number>) => {
    if (fired.current.has(name)) return;
    fired.current.add(name);
    fbq("trackCustom", name);
    try { vaTrack(name, { layout, source, ...(props ?? {}) }); } catch { /* analytics never blocks */ }
  }, [layout, source]);

  const set = (k: string, v: string) => {
    track("FormStart");
    if (PROPERTY_SET_FIELDS.has(k)) track("PropertyStarted");
    setF((p) => ({ ...p, [k]: v }));
  };

  // Single coverage gate: BOP (the instant-quote product) reveals the property
  // block; GL only skips it. Revenue + alcohol are always asked now (both lanes
  // need them for routing/class/qualification).
  const emailValid = EMAIL_RE.test((f.email ?? "").trim());
  const phoneValid = PHONE_OK(f.phone ?? "");
  const notFood = f.businessType === NOT_FOOD_TYPE;

  const canSubmit =
    f.fullName?.trim() &&
    emailValid &&
    phoneValid &&
    f.businessName?.trim() &&
    f.entityType?.trim() &&
    f.businessType?.trim() &&
    status !== "sending";

  // ---- STEP LAYOUT (Kevin 2026-08-16) -------------------------------------------------
  // Order = the v6 Instant Form: taps first (business type, revenue, alcohol, own/rent
  // [+building value if own], structure, founding year, timeline), then typing (address,
  // business name, full name, email, phone). Sunk cost is built before the contact fields.
  const [step, setStep] = useState(0);
  const isOwner = f.ownRent === "Own";
  const STEPS: Array<{ key: string; label: string; hint?: string; ok: () => boolean; skip?: () => boolean }> = [
    { key: "businessType", label: "Which best describes your business?", ok: () => !!f.businessType },
    { key: "revenue", label: "Approximate annual revenue", hint: "Best guess is fine.", ok: () => !!f.revenue },
    { key: "alcohol", label: "Alcohol as % of sales", hint: "Roughly what share of your sales is alcohol.", ok: () => !!f.alcohol },
    { key: "ownRent", label: "Do you own or rent your space?", ok: () => !!f.ownRent },
    { key: "buildingValue", label: "Estimated building replacement value", hint: "Rough rebuild cost is fine - what it would take to rebuild, not what you paid.", ok: () => true, skip: () => !isOwner },
    { key: "entityType", label: "How is your business structured?", ok: () => !!f.entityType },
    { key: "foundingYear", label: "When did you open?", ok: () => !!f.foundingYear },
    { key: "timeline", label: "When do you need coverage?", ok: () => !!f.timeline },
    { key: "address", label: "Exact building address", hint: "Start typing and pick the match.", ok: () => true },
    { key: "businessName", label: "Legal business name", hint: "As registered - e.g., Glenwood Grill LLC", ok: () => !!f.businessName?.trim() },
    { key: "fullName", label: "Your full name", ok: () => !!f.fullName?.trim() },
    { key: "email", label: "Email", ok: () => emailValid },
    { key: "phone", label: "Phone", ok: () => phoneValid },
  ];
  const visibleSteps = STEPS.filter((st) => !(st.skip && st.skip()));
  const cur = visibleSteps[Math.min(step, visibleSteps.length - 1)];
  const isLast = step >= visibleSteps.length - 1;
  const goNext = () => { if (cur.ok()) setStep((n) => Math.min(n + 1, visibleSteps.length - 1)); };
  const goBack = () => setStep((n) => Math.max(n - 1, 0));
  // Enter on a tap question advances; on the last screen it submits (form onSubmit).
  const onStepKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLast) { e.preventDefault(); goNext(); }
  };
  // Step-funnel analytics: RestStepFormView once on load, then RestStep_<key> the first
  // time each screen is REACHED (Back doesn't re-fire). Events Manager then shows the
  // drop-off curve screen by screen, comparable against the long form's FormStart /
  // ContactDone / Lead milestones. furthestStep rides along in `details` for quotes@/CRM.
  const [furthestStep, setFurthestStep] = useState(0);
  useEffect(() => {
    if (layout !== "steps") return;
    track("RestStepFormView");
  }, [layout, track]);
  useEffect(() => {
    if (layout !== "steps" || !cur) return;
    track(`RestStep_${cur.key}`, { step: step + 1, of: visibleSteps.length });
    setFurthestStep((n) => Math.max(n, step));
  }, [layout, step, cur?.key, track]);

  const details = useMemo(() => {
    const d: Array<{ label: string; value: string }> = [];
    const push = (label: string, value?: string) => {
      if (value && value.trim()) d.push({ label, value: value.trim() });
    };
    push("Business name", f.businessName);
    push("Business structure", f.entityType);
    push("Business type", f.businessType);
    // Rainbow class code (only the in-appetite types carry one) so the quoter
    // needs zero inference. Absent for bar / not-a-food-business (disqualified).
    push("Rainbow class", rainbowClassFor(f.businessType));
    push("Building address", f.address);
    push("Coverage timeline", f.timeline);
    // Rainbow writes BOP only and auto-derives property, so the quote needs just
    // class + sales + address + alcohol. own/rent captured for bind-time building coverage.
    push("Approximate annual revenue", f.revenue);
    push("Alcohol as % of sales", f.alcohol);
    push("Own or rent", f.ownRent);
    push("When did you open", f.foundingYear);
    if (f.foundingYear === "Not opened yet" || f.foundingYear === "Less than 1 year ago")
      push("New venture", "YES - Rainbow needs opening date, latest hour, website (websearch/ask)");
    if (f.ownRent === "Own") push("Building replacement value (owner-stated)", f.buildingValue);
    // Layout A/B marker so quotes@ / CRM can split long-form vs step-form
    // completions and partials without a pixel lookup.
    push("Form layout", layout);
    if (layout === "steps") push("Furthest step", `${furthestStep + 1} of ${visibleSteps.length} (${visibleSteps[furthestStep]?.key ?? "?"})`);
    return d;
  }, [f, layout, furthestStep, visibleSteps]);

  // Funnel milestones driven by state.
  useEffect(() => {
    if (f.fullName?.trim() && emailValid && phoneValid) {
      track("ContactDone");
    }
  }, [f.fullName, phoneValid, emailValid, track]);

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
      source,
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

  // Drop-off analytics: when the visitor leaves/backgrounds un-submitted, record how far
  // they got (once per session, first-party). Steps: furthest screen key + index. Long form:
  // which milestone they reached. Rate = abandons at screen N / RestStep_N views.
  const sentAbandon = useRef(false);
  const abandonRef = useRef(() => {});
  abandonRef.current = () => {
    if (sentAbandon.current) return;
    const { status: st } = latest.current;
    if (st === "done" || st === "es-done" || st === "sending") return;
    if (!fired.current.has("FormStart") && !fired.current.has("RestStepFormView")) return; // never engaged
    sentAbandon.current = true;
    const props: Record<string, string | number> = { layout, source };
    if (layout === "steps") {
      props.step = furthestStep + 1;
      props.of = visibleSteps.length;
      props.screen = visibleSteps[furthestStep]?.key ?? "?";
    } else {
      props.milestone = fired.current.has("ContactDone") ? "contact" : fired.current.has("PropertyStarted") ? "property" : "start";
    }
    try { vaTrack("RestFormAbandon", props); } catch { /* ignore */ }
    fbq("trackCustom", "RestFormAbandon");
  };
  // Leave / background the page.
  useEffect(() => {
    const onHide = () => { firePartial.current(); abandonRef.current(); };
    const onVis = () => {
      if (document.visibilityState === "hidden") { firePartial.current(); abandonRef.current(); }
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

    const qualification = qualify(f.businessType, f.alcohol, barOk);

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
    // Urgent AND instant-quotable = the stage the lane optimises toward.
    const urgentEventId =
      qualification === "qualified" && URGENT_TIMELINES.has(f.timeline ?? "")
        ? `${eventId}-u`
        : undefined;

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
          source,
          details,
          eventId,
          capiEventName,
          ...(urgentEventId ? { urgentEventId } : {}),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      // Fire the pixel ONLY after the intake POST succeeds (test/failed/
      // abandoned submits never count). Each event carries the shared eventID
      // so browser + server CAPI dedupe to a single conversion.
      if (qualification === "qualified") {
        fbq("track", "Lead", {}, { eventID: eventId });
        fbq("trackCustom", "RestaurantQuoteSubmit");
        if (urgentEventId) fbq("trackCustom", "LeadUrgentQuoted", {}, { eventID: urgentEventId });
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

  // "Not a food business" is NO LONGER an instant disqualify (Kevin 2026-08-15: "I worry people
  // misclick. Just only turn them down if they submit with that"). Picking the chip shows a note
  // and keeps the form live; the disqualify (RestaurantDisqualified event + not-a-fit screen)
  // fires ONLY on submit, via the normal qualification path below.

  if (status === "done" || status === "es-done") {
    if (embedded) {
      return (
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 px-6 py-10 text-center">
          <h3 className="text-2xl font-bold text-[#131517]">
            Thanks - we&rsquo;ve got it.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[#6B6D71]">
            We&rsquo;ll review your info and reach out shortly with your quote.
            Want to talk now? Call{" "}
            <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">
              (929) 594-5450
            </a>
            .
          </p>
        </div>
      );
    }
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
    if (embedded) {
      return (
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 px-6 py-10 text-center">
          <h3 className="text-2xl font-bold text-[#131517]">
            Thanks for reaching out.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[#6B6D71]">
            Based on your answers, this isn&rsquo;t a risk we&rsquo;re the best
            fit for right now. If your business changes or you&rsquo;d like a
            second opinion, call us at{" "}
            <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">
              (929) 594-5450
            </a>
            .
          </p>
        </div>
      );
    }
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

  const Root = embedded ? "div" : "main";
  return (
    <Root className={embedded ? undefined : "min-h-screen bg-white"}>
      {!embedded && (
        <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
          {/* Sizing matches the /contractors hero (Kevin 2026-08-15: "make the font size match
              what we have for contractors page (smaller)"). "No spam" removed per the standing
              copy rule (never say "no spam" - it adds nothing). */}
          <div className="mx-auto max-w-2xl px-5 py-5 sm:px-6 sm:py-7">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#2040E7]">
              For restaurants, bars, cafes &amp; food businesses
            </span>
            <h1 className="mt-1.5 text-xl font-bold leading-snug text-[#131517] sm:text-2xl">
              Business insurance built for restaurants
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#27455C] sm:text-base">
              We use AI to automatically shop your coverage and find you a
              better rate, reviewed by a licensed agent.
            </p>
          </div>
        </section>
      )}

      <form
        onSubmit={submit}
        className={layout === "steps" ? "mx-auto max-w-xl px-5 py-6 sm:px-6 sm:py-8" : "mx-auto max-w-2xl space-y-8 px-5 py-8 sm:px-6 sm:py-10"}
      >
        {layout === "steps" ? (
          <div className="space-y-6" onKeyDown={onStepKey}>
            {/* progress */}
            {/* No "N of 12" - a big denominator reads as work. Section label + bar only. */}
            <div className="space-y-2 text-xs text-[#6B6D71]">
              <div className="flex items-center justify-between">
                <span className="font-medium uppercase tracking-wide text-[#27455C]">
                  {CONTACT_KEYS.has(cur.key) ? "Where to send your quote" : "About your business"}
                </span>
                <span className="text-[#2040E7]">{step === 0 ? "Takes about 1 minute" : isLast ? "Last one" : ""}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1FF]">
                <div className="h-full rounded-full bg-[#2040E7] transition-all" style={{ width: `${((step + 1) / visibleSteps.length) * 100}%` }} />
              </div>
            </div>
            <Field label={cur.label} hint={cur.hint} required={cur.key !== "buildingValue" && cur.key !== "address"}>
              {cur.key === "businessType" && (
                <Radio name="businessType" value={f.businessType} onChange={(v) => { set("businessType", v); }} options={businessTypes} />
              )}
              {cur.key === "businessType" && notFood && (
                <p className="mt-2 rounded-lg bg-[#F1F3F5] px-4 py-3 text-sm text-[#6B6D71]">
                  This form is for restaurants, cafes, bars and other food businesses. If that was a misclick, just change your answer.
                </p>
              )}
              {cur.key === "revenue" && (
                <Radio name="revenue" value={f.revenue} onChange={(v) => set("revenue", v)} options={REVENUE} />
              )}
              {cur.key === "alcohol" && (
                <Radio name="alcohol" value={f.alcohol} onChange={(v) => set("alcohol", v)} options={ALCOHOL} />
              )}
              {cur.key === "ownRent" && (
                <Radio name="ownRent" value={f.ownRent} onChange={(v) => set("ownRent", v)} options={[{ label: "Own", value: "Own" }, { label: "Rent (tenant)", value: "Rent" }]} />
              )}
              {cur.key === "buildingValue" && (
                <Input value={f.buildingValue} onChange={(v) => set("buildingValue", v)} placeholder="e.g. 350,000" inputMode="numeric" />
              )}
              {cur.key === "entityType" && (
                <Radio name="entityType" value={f.entityType} onChange={(v) => set("entityType", v)} options={ENTITY_TYPES} />
              )}
              {cur.key === "foundingYear" && (
                <Radio name="foundingYear" value={f.foundingYear} onChange={(v) => set("foundingYear", v)} options={FOUNDING_YEAR} />
              )}
              {cur.key === "timeline" && (
                <Radio name="timeline" value={f.timeline} onChange={(v) => set("timeline", v)} options={TIMELINE} />
              )}
              {cur.key === "address" && (
                <AddressAutocomplete value={f.address} onChange={(v) => set("address", v)} placeholder="123 Main St, Springfield, IL 62704" />
              )}
              {cur.key === "businessName" && (
                <Input value={f.businessName} onChange={(v) => set("businessName", v)} placeholder="Glenwood Grill LLC" autoComplete="organization" />
              )}
              {cur.key === "fullName" && (
                <Input value={f.fullName} onChange={(v) => set("fullName", v)} placeholder="Jordan Lee" autoComplete="name" />
              )}
              {cur.key === "email" && (
                <>
                  <Input value={f.email} onChange={(v) => set("email", v)} placeholder="you@restaurant.com" type="email" autoComplete="email" inputMode="email" />
                  {emailSuggestion(f.email ?? "") && (
                    <p className="mt-2 text-xs text-[#6B7A90]">
                      Did you mean{" "}
                      <button type="button" className="font-semibold text-[#2040E7] underline underline-offset-2" onClick={() => set("email", emailSuggestion(f.email ?? "")!)}>
                        {emailSuggestion(f.email ?? "")}
                      </button>
                      ?
                    </p>
                  )}
                  {!!f.email?.trim() && !emailValid && !emailSuggestion(f.email ?? "") && (
                    <p className="mt-2 text-xs text-[#B42318]">Please enter a valid email address.</p>
                  )}
                </>
              )}
              {cur.key === "phone" && (
                <>
                  <Input value={f.phone} onChange={(v) => set("phone", v)} placeholder="(555) 123-4567" type="tel" autoComplete="tel" inputMode="tel" />
                  {!!f.phone?.trim() && !phoneValid && (
                    <p className="mt-2 text-xs text-[#B42318]">Please enter a valid US phone number.</p>
                  )}
                </>
              )}
            </Field>
            <div className="flex flex-col items-center gap-3">
              {!isLast ? (
                <button type="button" onClick={goNext} disabled={!cur.ok()} className="min-h-[52px] w-full touch-manipulation rounded-xl bg-[#2040E7] px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-[#1A33B9] disabled:cursor-not-allowed disabled:opacity-50">
                  Next
                </button>
              ) : (
                <button type="submit" disabled={!canSubmit} className="min-h-[52px] w-full touch-manipulation rounded-xl bg-[#2040E7] px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-[#1A33B9] disabled:cursor-not-allowed disabled:opacity-50">
                  {status === "sending" ? "Sending…" : "Get my quote"}
                </button>
              )}
              {step > 0 && (
                <button type="button" onClick={goBack} className="min-h-[44px] px-4 text-sm font-medium text-[#6B7A90] underline-offset-4 hover:text-[#27455C] hover:underline">
                  ← Back
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
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
          <Field label="Legal business name" required hint="As registered - e.g., Glenwood Grill LLC">
            <Input
              value={f.businessName}
              onChange={(v) => set("businessName", v)}
              placeholder="Glenwood Grill LLC"
              autoComplete="organization"
            />
          </Field>
          <Field label="How is your business structured?" required>
            <Radio
              name="entityType"
              value={f.entityType}
              onChange={(v) => set("entityType", v)}
              options={ENTITY_TYPES}
            />
          </Field>
          <Field label="Which best describes your business?" required>
            <Radio
              name="businessType"
              value={f.businessType}
              onChange={(v) => set("businessType", v)}
              options={businessTypes}
            />
          </Field>
          {notFood && (
            <p className="rounded-lg bg-[#F1F3F5] px-4 py-3 text-sm text-[#6B6D71]">
              This form is for restaurants, cafes, bars and other food
              businesses. If that was a misclick, just change your answer above.
            </p>
          )}
          <Field label="Exact building address" hint="Street, city, state, ZIP">
            <AddressAutocomplete
              value={f.address}
              onChange={(v) => set("address", v)}
              placeholder="123 Main St, Springfield, IL 62704"
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
          <Field label="When do you need coverage?">
            <Radio
              name="timeline"
              value={f.timeline}
              onChange={(v) => set("timeline", v)}
              options={TIMELINE}
            />
          </Field>
          <Field label="Do you own or rent your space?">
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
          {f.ownRent === "Own" && (
            <Field
              label="Estimated building replacement value"
              hint="Rough rebuild cost is fine - what it would take to rebuild, not what you paid."
            >
              <Input
                value={f.buildingValue}
                onChange={(v) => set("buildingValue", v)}
                placeholder="e.g. 350,000"
                inputMode="numeric"
              />
            </Field>
          )}
          <Field label="When did you open?">
            <Radio
              name="foundingYear"
              value={f.foundingYear}
              onChange={(v) => set("foundingYear", v)}
              options={FOUNDING_YEAR}
            />
          </Field>
        </Section>

          </>
        )}
        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errMsg}
          </p>
        )}
        {layout !== "steps" && (
        <>
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
        </>
        )}
      </form>
    </Root>
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
