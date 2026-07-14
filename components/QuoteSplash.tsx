"use client";

import { useEffect, useRef, useState } from "react";

// Vertical splash template: step-0 email capture → pre-filled Next Insurance
// handoff. First built as /restaurants (2026-07-14); every vertical page is a
// thin config wrapper around this component.
//
// The affiliate link; params survive the track.nextinsurance.com redirect.
// `email=` pre-fills Next's step-1 email field; `cob=` pre-selects the class
// of business and skips their work-type question (ids from /api/cobs-search).
const NEXT_BASE =
  "https://track.nextinsurance.com/links?agent_affiliation=OUqiHM5BPdbYGtN6&serial=992855993&channel=affiliation";

const CAL_LINK = "https://cal.com/team/cohesive-insurance-services/quote";

// Foxquilt broker-attributed self-serve link (agencyBrokerId/partnercode =
// Kevin's book). Their CSP blocks framing on our domain (frame-ancestors
// allowlist), so Foxquilt pages ALWAYS hand off top-level — no embed on any
// device. Page-1 fields ride in the URL (effectiveDate/country/state), so
// visitors land effectively on page 2.
const FOXQUILT_BASE =
  "https://join.foxquilt.com/2022-06-30/?agencyBrokerId=6a4d7c5f03e2e937813ffbf1&partnercode=FC+-+Kevin+Zhang&brokerCode=FQAGT&agencyId=6a4d7c5f03e2e937813ffbef";

function buildFoxquiltLink() {
  // Attribution params only — visitors fill Foxquilt's page 1 (state,
  // effective date) themselves. Page-1 prefill via &effectiveDate=/&state=
  // works if we ever want it (Kevin undecided 2026-07-14).
  return FOXQUILT_BASE;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export type SplashConfig = {
  // Short slug used in intake `source` labels, e.g. "restaurants" =>
  // "restaurants-splash-next-handoff" / "restaurants-splash-abandoned".
  slug: string;
  // Which carrier self-serve flow the page hands off to. "next" (default)
  // embeds where cookies allow; "foxquilt" always redirects top-level
  // (their CSP forbids framing) and ignores cob ids (chips still label the
  // intake record).
  provider?: "next" | "foxquilt";
  eyebrow: string;
  headline: string;
  // One-liner under the headline (left column).
  pitch: string;
  // Checkmark list, left column (desktop only).
  coverage: string[];
  // Business-type chips -> Next COB ids (optional for the visitor).
  cobs: { label: string; id: string }[];
  // Small helper line under the chips.
  chipsNote: string;
  emailPlaceholder: string;
};

function fbq(...args: unknown[]) {
  (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
}

function buildNextLink(email: string, cobId: string | null) {
  let url = `${NEXT_BASE}&email=${encodeURIComponent(email)}`;
  if (cobId) url += `&cob=${cobId}`;
  return url;
}

function TeamQuoteCta() {
  return (
    <div className="flex flex-col gap-3">
      <a
        href={CAL_LINK}
        onClick={() => {
          fbq("track", "Lead");
          fbq("trackCustom", "CalBookingClick");
        }}
        className="w-full text-center px-6 py-4 rounded-md border-2 border-[#2040E7] text-[#2040E7] text-base font-bold hover:bg-[#EEF1FF] transition-colors"
      >
        Need comprehensive coverage? Book a time with our team
      </a>
      <p className="text-sm text-[#6B6D71] text-center">
        Workers&apos; comp, disability, umbrella, and everything else your
        business needs - we shop multiple carriers and a real person picks up.
      </p>
      <p className="text-sm text-[#6B6D71] text-center">
        Renewal months away? Ask about switching early - most policies refund
        the unused premium, and we time the move so you&apos;re never
        double-covered or exposed.
      </p>
    </div>
  );
}

export default function QuoteSplash({ config }: { config: SplashConfig }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Step-0 capture form: we take the email ourselves BEFORE handing the
  // visitor to Next, so an abandoned Next flow is still a lead we can work.
  const [stage, setStage] = useState<"form" | "embed">("form");
  const [email, setEmail] = useState("");
  const [cobId, setCobId] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [handoffLink, setHandoffLink] = useState(NEXT_BASE);

  // Safari (macOS + every iOS browser, incl. the Facebook in-app browser)
  // blocks third-party cookies, and Next's app hard-fails inside an iframe
  // without them. Those visitors are handed off top-level after the step-0
  // form instead: Next becomes first-party, so session + attribution work.
  const useEmbedRef = useRef(true);
  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari =
      /safari/i.test(ua) && !/chrome|crios|android|fxios|edgios/i.test(ua);
    if (isIOS || isSafari) useEmbedRef.current = false;
  }, []);

  // Abandoned step-0 capture: if a valid email was typed but the start button
  // was never clicked, beacon it to the intake route on pagehide/tab-hide.
  const emailRef = useRef("");
  const cobIdRef = useRef<string | null>(null);
  const submittedRef = useRef(false);
  const abandonSentRef = useRef(false);
  emailRef.current = email;
  cobIdRef.current = cobId;

  useEffect(() => {
    const sendAbandonBeacon = () => {
      if (submittedRef.current || abandonSentRef.current) return;
      const cleaned = emailRef.current.trim().toLowerCase();
      if (!EMAIL_RE.test(cleaned)) return;
      const cobLabel = config.cobs.find((c) => c.id === cobIdRef.current)?.label;
      const payload = JSON.stringify({
        email: cleaned,
        businessType: cobLabel ?? `${config.slug} (unspecified)`,
        partial: true,
        final: true,
        source: `${config.slug}-splash-abandoned`,
      });
      const queued = navigator.sendBeacon(
        "/api/intake",
        new Blob([payload], { type: "application/json" }),
      );
      if (queued) {
        abandonSentRef.current = true;
        // Custom pixel event only — abandons stay OUT of the Lead signal so
        // ads keep optimizing on intentional quote-starts. This builds the
        // retargeting pool of typed-but-didn't-start visitors.
        fbq("trackCustom", "SplashAbandonEmail");
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendAbandonBeacon();
    };
    window.addEventListener("pagehide", sendAbandonBeacon);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", sendAbandonBeacon);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [config.slug, config.cobs]);

  const handleStart = () => {
    const cleaned = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleaned)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    submittedRef.current = true;

    const cobLabel = config.cobs.find((c) => c.id === cobId)?.label;

    // Fire-and-forget: the handoff must never wait on (or break from) our
    // backend. The intake route emails quotes@ before any DB work.
    try {
      fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleaned,
          businessType: cobLabel ?? `${config.slug} (unspecified)`,
          source: `${config.slug}-splash-${config.provider ?? "next"}-handoff`,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore — never block the visitor's path to a quote
    }

    // Email in hand = the lead moment. Dwell/click events below are custom
    // signals only, so standard Lead fires once per visitor path.
    fbq("track", "Lead");
    fbq("trackCustom", "QuoteStartEmail");

    if (config.provider === "foxquilt") {
      window.location.href = buildFoxquiltLink();
      return;
    }

    const link = buildNextLink(cleaned, cobId);
    if (useEmbedRef.current) {
      setHandoffLink(link);
      setStage("embed");
    } else {
      window.location.href = link;
    }
  };

  // Next's quote flow is a cross-origin Angular SPA: no step URLs, no
  // postMessage step events, so real form progress is unobservable. Focus
  // dwell time is the proxy. All custom events (standard Lead already fired
  // at step-0 submit): first click -> NextQuoteClick, 45s -> NextQuoteDwell,
  // 3min -> NextQuoteDeep.
  useEffect(() => {
    const fired = { click: false, dwell: false, deep: false };
    let accumulatedMs = 0;
    let enteredAt: number | null = null;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const DWELL_AT_MS = 45_000;
    const DEEP_AT_MS = 180_000;

    const fireForDwell = (totalMs: number) => {
      if (!fired.dwell && totalMs >= DWELL_AT_MS) {
        fired.dwell = true;
        fbq("trackCustom", "NextQuoteDwell");
      }
      if (!fired.deep && totalMs >= DEEP_AT_MS) {
        fired.deep = true;
        fbq("trackCustom", "NextQuoteDeep");
      }
    };

    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const enterFrame = () => {
      if (enteredAt !== null) return;
      enteredAt = Date.now();
      if (!fired.click) {
        fired.click = true;
        fbq("trackCustom", "NextQuoteClick");
      }
      for (const at of [DWELL_AT_MS, DEEP_AT_MS]) {
        const wait = at - accumulatedMs;
        if (wait > 0) {
          timers.push(setTimeout(() => fireForDwell(at), wait));
        }
      }
    };

    const leaveFrame = () => {
      if (enteredAt === null) return;
      accumulatedMs += Date.now() - enteredAt;
      enteredAt = null;
      clearTimers();
      fireForDwell(accumulatedMs);
    };

    const onBlur = () => {
      if (document.activeElement === frameRef.current) enterFrame();
    };
    const onFocus = () => leaveFrame();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") leaveFrame();
    };

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimers();
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <a href="/">
            <img src="/logo-long.png" alt="Cohesive" className="h-7 sm:h-8 w-auto object-contain" />
          </a>
        </div>
      </header>

      <section className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 lg:py-8 grid lg:grid-cols-[2fr_3fr] gap-x-10 gap-y-4 items-start">
          {/* Left column: pitch (beside the form on desktop, above on mobile) */}
          <div className="lg:pt-4">
            <div className="text-[11px] font-bold text-[#2040E7] tracking-[0.08em] uppercase mb-1.5">
              {config.eyebrow}
            </div>
            <h1 className="text-2xl lg:text-4xl font-extrabold text-[#131517] leading-tight mb-2">
              {config.headline}
            </h1>
            <p className="text-sm lg:text-base text-[#6B6D71] leading-relaxed mb-3">
              {config.pitch}
            </p>

            <ul className="hidden lg:block mb-8 space-y-1.5">
              {config.coverage.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2.5 text-[15px] text-[#27455C]"
                >
                  <span className="text-[#2040E7] font-bold">✓</span>
                  {c}
                </li>
              ))}
            </ul>

            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-semibold text-[#6B6D71] uppercase tracking-wide">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <TeamQuoteCta />
            </div>
          </div>

          {/* Right column: step-0 email capture, then the Next quote flow */}
          <div>
            {stage === "form" ? (
              <div className="rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-[#131517] mb-1">
                  Start your instant quote
                </h2>
                <p className="text-sm text-[#6B6D71] mb-5">
                  Owners save about 15-25% on average.
                </p>

                <div className="text-sm font-semibold text-[#27455C] mb-2">
                  What kind of business do you run?{" "}
                  <span className="font-normal text-[#6B6D71]">(optional)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.cobs.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCobId(cobId === c.id ? null : c.id)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
                        cobId === c.id
                          ? "border-[#2040E7] bg-[#2040E7] text-white"
                          : "border-slate-300 text-[#27455C] hover:border-[#2040E7]"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#6B6D71] mb-5">{config.chipsNote}</p>

                <label
                  htmlFor="quote-email"
                  className="block text-sm font-semibold text-[#27455C] mb-2"
                >
                  Email address
                </label>
                <input
                  id="quote-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStart();
                  }}
                  placeholder={config.emailPlaceholder}
                  className={`w-full px-4 py-3 rounded-md border text-base text-[#131517] outline-none focus:border-[#2040E7] mb-1 ${
                    emailError ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {emailError && (
                  <p className="text-sm text-red-600 mb-1">
                    Please enter a valid email address.
                  </p>
                )}
                <p className="text-xs text-[#6B6D71] mb-4">
                  We&apos;ll only use this to help with your quote.
                </p>

                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full text-center px-8 py-4 rounded-md bg-[#2040E7] text-white text-lg font-bold hover:bg-[#1A33B9] transition-colors"
                >
                  Start my instant quote →
                </button>
              </div>
            ) : (
              <>
                {/* overflow-hidden + negative top margin crops Next's co-brand
                    header bar out of view (cross-origin, so CSS can't reach in) */}
                <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-2">
                  <iframe
                    ref={frameRef}
                    src={handoffLink}
                    title="Get an instant business insurance quote"
                    className="w-full block"
                    style={{ height: "910px", border: "0", marginTop: "-88px" }}
                    allow="payment"
                  />
                </div>
                <p className="text-sm text-[#6B6D71]">
                  Instant quotes provided by Next Insurance through our
                  partnership.{" "}
                  <a
                    href={handoffLink}
                    target="_blank"
                    rel="noopener sponsored"
                    className="underline hover:text-[#2040E7]"
                  >
                    Open in a new window
                  </a>{" "}
                  if the form doesn&apos;t load.
                </p>
              </>
            )}
          </div>

          {/* Mobile-only team path below the form */}
          <div className="lg:hidden mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-[#6B6D71] uppercase tracking-wide">
                or
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <TeamQuoteCta />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-[#6B6D71] flex flex-wrap gap-x-4 gap-y-1">
          <span>Cohesive Insurance Services - licensed insurance agency</span>
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
        </div>
      </footer>
    </main>
  );
}
