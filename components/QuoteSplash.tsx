"use client";

import { useEffect, useRef, useState } from "react";

const NEXT_BASE =
  "https://track.nextinsurance.com/links?agent_affiliation=OUqiHM5BPdbYGtN6&serial=992855993&channel=affiliation";

const CAL_LINK = "https://cal.com/team/cohesive-insurance-services/quote";

const FOXQUILT_BASE =
  "https://join.foxquilt.com/2022-06-30/?agencyBrokerId=6a4d7c5f03e2e937813ffbf1&partnercode=FC+-+Kevin+Zhang&brokerCode=FQAGT&agencyId=6a4d7c5f03e2e937813ffbef";

function buildFoxquiltLink(professionLabel: string | null) {
  return professionLabel
    ? `${FOXQUILT_BASE}&profession=${encodeURIComponent(professionLabel)}`
    : FOXQUILT_BASE;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

function buildNextLink(cobId: string | null, email?: string) {
  let url = NEXT_BASE;
  if (email) url += `&email=${encodeURIComponent(email)}`;
  if (cobId) url += `&cob=${cobId}`;
  return url;
}

export type SplashConfig = {
  // Short slug used in intake `source` labels + custom pixel context.
  slug: string;
  // "next" (default) embeds where cookies allow; "foxquilt" too (both redirect
  // top-level on iOS/Safari). Foxquilt chip ids ARE profession labels.
  provider?: "next" | "foxquilt";
  eyebrow: string;
  headline: string;
  pitch: string;
  coverage: string[];
  // Each chip carries its own per-industry savings line + optional real
  // recently-bound policy — both revealed when the chip is picked (the reveal
  // is the interaction). recentBind is a genuine bind through our Next link
  // (factual, §349-substantiated); only set where we have real data.
  cobs: {
    label: string;
    id: string;
    savings?: string;
    recentBind?: { label: string; price: string };
  }[];
  chipsNote: string;
  recentBinds?: { label: string; price: string }[];
  // Default savings line for chips that don't carry their own.
  savingsLine: string;
  // A/B: when true, capture the visitor's email before handoff (the "gate"
  // arm). Default/false = frictionless gate-free handoff.
  captureEmail?: boolean;
};

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined") {
    if (!/(^|\.)cohesiveinsure\.com$/.test(window.location.hostname)) return;
    if (navigator.webdriver) return;
  }
  (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
}

function TeamQuoteCta() {
  return (
    <p className="text-sm text-[#6B6D71] text-center">
      Need more comprehensive coverage or prefer a person?{" "}
      <a
        href={CAL_LINK}
        onClick={() => fbq("trackCustom", "CalBookingClick")}
        className="underline font-semibold text-[#2040E7] hover:text-[#1A33B9]"
      >
        Book a time with our team
      </a>
      .
    </p>
  );
}

export default function QuoteSplash({ config }: { config: SplashConfig }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [stage, setStage] = useState<"bridge" | "embed">("bridge");
  const [cobId, setCobId] = useState<string | null>(null);
  const [handoffLink, setHandoffLink] = useState(NEXT_BASE);
  // Email-capture mode (config.captureEmail = the A/B "gate" arm). Unused when
  // gate-free.
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

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

  const selectChip = (id: string) => {
    const next = cobId === id ? null : id;
    setCobId(next);
    if (next) fbq("trackCustom", "ChipSelect");
  };

  // Abandoned-capture beacon (gate arm only): a valid email typed but the
  // handoff never clicked → beacon to intake on pagehide/tab-hide so the lead
  // isn't lost.
  const emailRef = useRef("");
  const cobIdRef = useRef<string | null>(null);
  const submittedRef = useRef(false);
  const abandonSentRef = useRef(false);
  emailRef.current = email;
  cobIdRef.current = cobId;

  useEffect(() => {
    if (!config.captureEmail) return;
    const sendAbandon = () => {
      if (submittedRef.current || abandonSentRef.current) return;
      const cleaned = emailRef.current.trim().toLowerCase();
      if (!EMAIL_RE.test(cleaned)) return;
      const cobLabel = config.cobs.find((c) => c.id === cobIdRef.current)?.label;
      const ok = navigator.sendBeacon(
        "/api/intake",
        new Blob(
          [
            JSON.stringify({
              email: cleaned,
              businessType: cobLabel ?? `${config.slug} (unspecified)`,
              partial: true,
              final: true,
              source: `${config.slug}-splash-abandoned`,
            }),
          ],
          { type: "application/json" },
        ),
      );
      if (ok) {
        abandonSentRef.current = true;
        fbq("trackCustom", "SplashAbandonEmail");
      }
    };
    const onVis = () => {
      if (document.visibilityState === "hidden") sendAbandon();
    };
    window.addEventListener("pagehide", sendAbandon);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", sendAbandon);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [config.captureEmail, config.slug, config.cobs]);

  const handleGetQuote = () => {
    let captured: string | undefined;

    // A/B "gate" arm: require + capture the email before handoff (we OWN the
    // lead — quotes@ + CRM + follow-up). Only when config.captureEmail.
    if (config.captureEmail) {
      const cleaned = email.trim().toLowerCase();
      if (!EMAIL_RE.test(cleaned)) {
        setEmailError(true);
        return;
      }
      setEmailError(false);
      submittedRef.current = true;
      captured = cleaned;
      const cobLabel = config.cobs.find((c) => c.id === cobId)?.label;
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
        }).catch(() => { });
      } catch {
        // never block the handoff on our backend
      }
    }

    // Standard Lead fires on handoff either way; QuoteHandoffClick is the
    // named custom mirror for reporting.
    fbq("track", "Lead");
    fbq("trackCustom", "QuoteHandoffClick");

    const link =
      config.provider === "foxquilt"
        ? buildFoxquiltLink(cobId)
        : buildNextLink(cobId, captured);
    if (useEmbedRef.current) {
      setHandoffLink(link);
      setStage("embed");
    } else {
      window.location.href = link;
    }
  };

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
        if (wait > 0) timers.push(setTimeout(() => fireForDwell(at), wait));
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

  const carrierName =
    config.provider === "foxquilt" ? "Foxquilt" : "Next Insurance";

  // The picked business type — its savings + recentBind are revealed on select.
  const selected = config.cobs.find((c) => c.id === cobId) ?? null;

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
          {/* Left column: pitch. On mobile it drops BELOW the card (order-2) so
              the interactive chips are the first thing seen; desktop restores. */}
          <div className="order-2 lg:order-1 lg:pt-4">
            <h1 className="text-2xl lg:text-4xl font-extrabold text-[#2040E7] leading-tight mb-2">
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

          {/* Right column: value bridge card. order-1 on mobile = shown first. */}
          <div className="order-1 lg:order-2">
            {stage === "bridge" ? (
              <div className="rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-[#131517] mb-4">
                  Are you overpaying? See your price.
                </h2>

                <div className="text-sm font-semibold text-[#27455C] mb-2">
                  What kind of business do you run?
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.cobs.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectChip(c.id)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${cobId === c.id
                        ? "border-[#2040E7] bg-[#2040E7] text-white"
                        : "border-slate-300 text-[#27455C] hover:border-[#2040E7]"
                        }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#6B6D71] mb-5">{config.chipsNote}</p>

                {/* Reveal-on-select: a real recent bind price is the hero (the
                    reward for engaging); the savings line supports it. */}
                {selected ? (
                  <div className="mb-6">
                    {selected.recentBind ? (
                      <>
                        <div className="rounded-lg bg-[#EEF1FF] px-4 py-4 text-center mb-2">
                          <div className="text-3xl font-extrabold text-[#2040E7] leading-none">
                            {selected.recentBind.price}
                          </div>
                          <div className="text-xs text-[#6B6D71] mt-1.5">
                            Recently bound - {selected.recentBind.label}
                          </div>
                        </div>
                        <p className="text-[13px] text-[#27455C] text-center px-2">
                          {selected.savings ?? config.savingsLine}
                        </p>
                      </>
                    ) : (
                      <div className="rounded-lg bg-[#EEF1FF] px-4 py-3">
                        <p className="text-[15px] font-semibold text-[#27455C] leading-snug">
                          {selected.savings ?? config.savingsLine}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-3 mb-6 text-center">
                    <p className="text-sm text-[#6B6D71]">
                      Pick your business above to see your price.
                    </p>
                  </div>
                )}

                {config.captureEmail && (
                  <div className="mb-3">
                    <input
                      id="quote-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleGetQuote();
                      }}
                      placeholder="Email to see your price"
                      className={`w-full px-4 py-3 rounded-md border text-base text-[#131517] outline-none focus:border-[#2040E7] ${emailError ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {emailError && (
                      <p className="text-sm text-red-600 mt-1">
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGetQuote}
                  className="w-full text-center px-8 py-4 rounded-md bg-[#2040E7] text-white text-lg font-bold hover:bg-[#1A33B9] transition-colors"
                >
                  See your price →
                </button>
                <p className="hidden lg:block text-xs text-[#6B6D71] text-center mt-3">
                  Free to check - we compare our insurance partners to find you
                  the lowest rate and the right coverage, in under 10 minutes.
                </p>
              </div>
            ) : (
              <>
                {/* overflow-hidden + negative top margin crops the carrier's
                    header bar out of view (cross-origin, so CSS can't reach
                    in). Next's co-brand bar is ~88px; Foxquilt's is uncropped. */}
                <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-2">
                  <iframe
                    ref={frameRef}
                    src={handoffLink}
                    title="Get an instant business insurance quote"
                    className="w-full block"
                    style={
                      config.provider === "foxquilt"
                        ? { height: "822px", border: "0" }
                        : { height: "910px", border: "0", marginTop: "-88px" }
                    }
                    allow="payment"
                  />
                </div>
                <p className="text-sm text-[#6B6D71]">
                  Instant quotes provided by {carrierName} through our
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

          {/* Mobile-only team path below the card */}
          <div className="order-3 lg:hidden mt-4">
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
