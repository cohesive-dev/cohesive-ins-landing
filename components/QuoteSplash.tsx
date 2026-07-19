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

function buildNextLink(cobId: string | null) {
  return cobId ? `${NEXT_BASE}&cob=${cobId}` : NEXT_BASE;
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
  cobs: { label: string; id: string }[];
  chipsNote: string;
  savingsLine: string;
  recentBinds?: { label: string; price: string }[];
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

  const handleGetQuote = () => {
    // The handoff click IS the conversion now (no email gate). Standard Lead
    // fires here so ads optimize on intent-to-quote; QuoteHandoffClick is the
    // named custom mirror for reporting.
    fbq("track", "Lead");
    fbq("trackCustom", "QuoteHandoffClick");

    const link =
      config.provider === "foxquilt"
        ? buildFoxquiltLink(cobId)
        : buildNextLink(cobId);
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
          {/* Left column: pitch (beside the card on desktop, above on mobile) */}
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

          {/* Right column: value bridge card, then the carrier quote flow */}
          <div>
            {stage === "bridge" ? (
              <div className="rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-[#131517] mb-3">
                  Get your instant quote
                </h2>

                <div className="rounded-lg bg-[#EEF1FF] px-4 py-3 mb-4">
                  <p className="text-[15px] font-semibold text-[#27455C] leading-snug">
                    {config.savingsLine}
                  </p>
                </div>

                {config.recentBinds && config.recentBinds.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-bold text-[#6B6D71] uppercase tracking-wide mb-2">
                      Recently bound in NY
                    </div>
                    <ul className="space-y-1.5">
                      {config.recentBinds.map((b) => (
                        <li
                          key={b.label}
                          className="flex items-center justify-between text-sm border-b border-slate-100 pb-1.5"
                        >
                          <span className="text-[#27455C] font-medium">{b.label}</span>
                          <span className="text-[#131517] font-bold">{b.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-sm font-semibold text-[#27455C] mb-2">
                  What kind of business do you run?{" "}
                  <span className="font-normal text-[#6B6D71]">
                    (helps us tailor your quote)
                  </span>
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
                <p className="text-xs text-[#6B6D71] mb-6">{config.chipsNote}</p>

                <button
                  type="button"
                  onClick={handleGetQuote}
                  className="w-full text-center px-8 py-4 rounded-md bg-[#2040E7] text-white text-lg font-bold hover:bg-[#1A33B9] transition-colors"
                >
                  Get my instant quote →
                </button>
                <p className="text-xs text-[#6B6D71] text-center mt-3">
                  About 10 minutes, online. No obligation - instant quote
                  through our partner {carrierName}.
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
