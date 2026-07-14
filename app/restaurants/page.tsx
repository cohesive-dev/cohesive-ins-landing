"use client";

import { useEffect, useRef } from "react";

// cob=110207 pre-selects "Restaurant" (Next's class-of-business id, via their
// /api/cobs-search) — the work-type question is skipped and step 1 collapses
// to State + Email. The param survives the track.nextinsurance.com redirect
// alongside the affiliate attribution.
const NEXT_LINK =
  "https://track.nextinsurance.com/links?agent_affiliation=OUqiHM5BPdbYGtN6&serial=992855993&channel=affiliation&cob=110207";

const CAL_LINK = "https://cal.com/team/cohesive-insurance-services/quote";

function fbq(...args: unknown[]) {
  (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
}

const COVERAGE = [
  "General liability",
  "Liquor liability",
  "Commercial property",
  "Certificates of insurance",
];

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
        spot needs - we shop multiple carriers and a real person picks up.
      </p>
      <p className="text-sm text-[#6B6D71] text-center">
        Renewal months away? Ask about switching early - most policies refund
        the unused premium, and we time the move so you&apos;re never
        double-covered or exposed.
      </p>
    </div>
  );
}

export default function RestaurantsPage() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Next's quote flow is a cross-origin Angular SPA: no step URLs, no
  // postMessage step events (verified 2026-07-14), so real form progress is
  // unobservable from here. Best available proxy is focus dwell time — the
  // window blurs while the visitor works inside the iframe, and refocuses
  // when they leave it. Ladder:
  //   first click into the form  -> NextQuoteClick (custom, cheap signal)
  //   45s cumulative in the form -> Lead (≈ finished step 1; what ads optimize on)
  //   3min cumulative            -> NextQuoteDeep (custom, future optimization)
  useEffect(() => {
    const fired = { click: false, lead: false, deep: false };
    let accumulatedMs = 0;
    let enteredAt: number | null = null;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const LEAD_AT_MS = 45_000;
    const DEEP_AT_MS = 180_000;

    const fireForDwell = (totalMs: number) => {
      if (!fired.lead && totalMs >= LEAD_AT_MS) {
        fired.lead = true;
        fbq("track", "Lead");
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
      // Schedule threshold crossings for this in-frame session; cleared if
      // the visitor leaves the frame first.
      for (const at of [LEAD_AT_MS, DEEP_AT_MS]) {
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
      // Tab hidden while "in" the frame: stop the clock (they're not filling).
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
          {/* Left column: pitch (sits beside the form on desktop, above it on mobile) */}
          <div className="lg:pt-4">
            <div className="text-[11px] font-bold text-[#2040E7] tracking-[0.08em] uppercase mb-1.5">
              For restaurants &amp; food service
            </div>
            <h1 className="text-2xl lg:text-4xl font-extrabold text-[#131517] leading-tight mb-2">
              Restaurant insurance, in minutes.
            </h1>
            <p className="text-sm lg:text-base text-[#6B6D71] leading-relaxed mb-3">
              Buy online in about 10 minutes - COIs ready when your landlord
              asks. Owners who switch save about 10-25% on average.
            </p>

            <ul className="hidden lg:flex flex-wrap gap-2 mb-8">
              {COVERAGE.map((c) => (
                <li
                  key={c}
                  className="px-4 py-2 rounded-full border border-slate-300 text-sm font-semibold text-[#27455C]"
                >
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

          {/* Right column: the embedded Next quote flow */}
          <div>
            {/* overflow-hidden + negative top margin crops Next's co-brand
                header bar out of view (cross-origin, so CSS can't reach in) */}
            <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-2">
              <iframe
                ref={frameRef}
                src={NEXT_LINK}
                title="Get an instant restaurant insurance quote"
                className="w-full block"
                style={{ height: "910px", border: "0", marginTop: "-88px" }}
                allow="payment"
              />
            </div>
            <p className="text-sm text-[#6B6D71]">
              Instant quotes provided by Next Insurance through our
              partnership.{" "}
              <a
                href={NEXT_LINK}
                target="_blank"
                rel="noopener sponsored"
                className="underline hover:text-[#2040E7]"
              >
                Open in a new window
              </a>{" "}
              if the form doesn&apos;t load.
            </p>
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
