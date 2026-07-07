"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const CAL_LINK = "https://cal.com/team/cohesive-insurance-services/quote";
// The path cal.com's embed expects (everything after cal.com/).
const CAL_EMBED_LINK = "team/cohesive-insurance-services/quote";
const CAL_NAMESPACE = "quote";
// Identifier (slug) of the custom "Business Type (Industry)" booking question on
// the cal.com event. Must match the field's identifier EXACTLY (verified against
// the live event config — note the capitals and double hyphen).
const CAL_INDUSTRY_FIELD = "Business-Type--Industry";

// Progressively format a US phone number as the user types: "(555) 123-4567".
function formatUSPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// cal.com's phone field only prefills from an E.164 value (e.g. +15551234567).
// Normalize a US number typed as "(555) 123-4567" into that shape.
function toE164US(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (phone.trim().startsWith("+")) return phone.trim();
  return digits ? `+${digits}` : phone;
}
const BRAND = "#2040E7";

// ─── Brand palette ──────────────────────────────────────────────────────────
// highlight #2040E7 - official highlight color; primary CTA, matches the logo
// navy      #27455C - accent card / dark surfaces
// teal      #007395 - links, phone numbers
// ink       #131517 - headings
// slate     #6B6D71 - body copy
// mist      #F2F5F7 - light section backgrounds

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Navbar({ onOpenQuote }: { onOpenQuote: () => void }) {
  const [open, setOpen] = useState(false);
  const links = ["Industries", "Coverage", "How It Works", "Carriers"];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-200">
      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img src="/logo-long.png" alt="Cohesive" className="h-9 w-auto object-contain" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[15px] font-semibold text-[#2040E7] hover:text-[#131517] transition-colors">
                {l}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+18573924131" className="text-sm font-medium text-[#2040E7] hover:underline flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              +1 (857) 392-4131
            </a>
            <button onClick={onOpenQuote}
              className="px-5 py-2.5 rounded-sm bg-[#2040E7] text-white text-sm font-bold hover:bg-[#1A33B9] transition-colors">
              Get a Quote
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-[#272A2D] hover:bg-slate-100">
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setOpen(false)}
                className="py-2 px-3 text-sm font-semibold text-[#272A2D] hover:bg-slate-50">
                {l}
              </a>
            ))}
            <button onClick={() => { setOpen(false); onOpenQuote(); }}
              className="mt-2 py-2.5 px-3 rounded-sm bg-[#2040E7] text-white text-sm font-bold text-center hover:bg-[#1A33B9]">
              Get a Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function TradeSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset the search each time the menu opens and focus the search box.
  useEffect(() => {
    if (open) {
      setQuery("");
      searchRef.current?.focus();
    }
  }, [open]);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 border border-slate-300 rounded-sm px-3 py-2.5 text-sm text-[#272A2D] bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#007395]/40">
        <span className="truncate">{value}</span>
        <svg className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-sm border border-slate-200 bg-white shadow-lg">
          <div className="p-2 border-b border-slate-100">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // No match falls back to "Other".
                  onChange(filtered.length > 0 ? filtered[0] : "Other");
                  setOpen(false);
                } else if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              placeholder="Search business types…"
              className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm text-[#272A2D] focus:outline-none focus:ring-2 focus:ring-[#007395]/40"
            />
          </div>
          <ul role="listbox" className="max-h-56 overflow-auto py-1">
            {filtered.length === 0 ? (
              <li
                role="option"
                aria-selected={value === "Other"}
                onClick={() => { onChange("Other"); setOpen(false); }}
                className="px-3 py-2 text-sm cursor-pointer text-[#272A2D] hover:bg-[#2040E7]/10 hover:text-[#2040E7]">
                No matches — use <span className="font-semibold">Other</span>
              </li>
            ) : (
              filtered.map((opt) => {
                const selected = opt === value;
                return (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={selected}
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={`flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${selected ? "bg-[#2040E7] text-white" : "text-[#272A2D] hover:bg-[#2040E7]/10 hover:text-[#2040E7]"
                      }`}>
                    <span>{opt}</span>
                    {selected && (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4l2.3 2.3 6.3-6.3a1 1 0 011.4 0z" />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

type Prefill = { name?: string; email?: string; phone?: string; businessType?: string; zip?: string };

function QuoteForm({ onBookMeeting }: { onBookMeeting: (prefill?: Prefill) => void }) {
  const trades = [
    "Roofing", "Electrical", "Plumbing", "HVAC", "General Contracting",
    "Trucking & Logistics", "Restaurants & Bars", "Painting", "Garages", "Retail",
    "Carpentry", "Concrete & Masonry", "Drywall & Insulation", "Excavation & Grading", "Flooring",
    "Landscaping & Lawn Care", "Fencing", "Welding & Metal Fabrication", "Glass & Glazing", "Demolition",
    "Solar Installation", "Pest Control", "Janitorial & Cleaning", "Locksmith", "Handyman Services",
    "Auto Repair", "Auto Body & Detailing", "Towing", "Courier & Delivery", "Moving & Storage",
    "Manufacturing", "Wholesale & Distribution", "Warehousing", "Grocery & Convenience", "Bakery & Catering",
    "Coffee Shop & Café", "Salon & Barbershop", "Spa & Wellness", "Gym & Fitness Studio", "Daycare & Childcare",
    "Medical & Dental Office", "Veterinary Clinic", "Accounting & Bookkeeping", "Real Estate", "Property Management",
    "IT & Software Services", "Marketing & Consulting", "Photography & Videography", "Event Planning", "Other",
  ];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState(trades[0]);
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Fire-and-forget: record the submission if we can, but never block the
    // customer or surface an error — they always see the confirmation.
    void fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, businessType, zip }),
    }).catch(() => { });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <div className="text-[11px] font-bold text-[#2040E7] tracking-[0.08em] uppercase mb-2">Get a Quote</div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#131517] mb-3">Thanks, {name.trim().split(" ")[0] || "there"}!</h2>
        <p className="text-sm text-[#6B6D71] leading-relaxed mb-6">
          We&apos;ve got your {businessType.toLowerCase()} details for ZIP {zip}. Our team will reach out in under 30 minutes with your quote.
        </p>
        <p className="text-sm font-semibold text-[#131517] mb-3">Don&apos;t want to wait? Talk to us now.</p>
        <button
          type="button"
          onClick={() => onBookMeeting({ name, email, phone, businessType, zip })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#2040E7] text-white text-sm font-bold hover:bg-[#1A33B9] transition-colors">
          Schedule a phone call →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-[11px] font-bold text-[#2040E7] tracking-[0.08em] uppercase mb-4">Get a Quote</div>
      <div className="flex flex-col gap-3 mb-4">
        <label className="text-left">
          <span className="block text-xs font-semibold text-[#272A2D] mb-1">Full name <span className="text-[#2040E7]">*</span></span>
          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith"
            className="w-full border border-slate-300 rounded-sm px-3 py-2.5 text-sm text-[#272A2D] focus:outline-none focus:ring-2 focus:ring-[#007395]/40" />
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 text-left">
            <span className="block text-xs font-semibold text-[#272A2D] mb-1">Email <span className="text-[#2040E7]">*</span></span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              pattern="[^@\s]+@[^@\s]+\.[^@\s]{2,}"
              title="Enter a valid email address, e.g. jane@company.com"
              placeholder="jane@company.com"
              className="w-full border border-slate-300 rounded-sm px-3 py-2.5 text-sm text-[#272A2D] focus:outline-none focus:ring-2 focus:ring-[#007395]/40" />
          </label>
          <label className="flex-1 text-left">
            <span className="block text-xs font-semibold text-[#272A2D] mb-1">Phone <span className="text-[#2040E7]">*</span></span>
            <input required type="tel" inputMode="tel" value={phone}
              onChange={(e) => setPhone(formatUSPhone(e.target.value))}
              pattern="\(\d{3}\) \d{3}-\d{4}"
              title="Enter a 10-digit US phone number"
              placeholder="(555) 123-4567"
              className="w-full border border-slate-300 rounded-sm px-3 py-2.5 text-sm text-[#272A2D] focus:outline-none focus:ring-2 focus:ring-[#007395]/40" />
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 text-left">
            <span className="block text-xs font-semibold text-[#272A2D] mb-1">Type of business</span>
            <TradeSelect options={trades} value={businessType} onChange={setBusinessType} />
          </div>
          <label className="sm:w-36 text-left">
            <span className="block text-xs font-semibold text-[#272A2D] mb-1">ZIP code</span>
            <input required type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))} placeholder="00000"
              className="w-full border border-slate-300 rounded-sm px-3 py-2.5 text-sm text-[#272A2D] focus:outline-none focus:ring-2 focus:ring-[#007395]/40" />
          </label>
          <div className="flex items-end">
            <button type="submit" className="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-[#2040E7] text-white text-sm font-bold hover:bg-[#1A33B9] transition-colors whitespace-nowrap">
              Get a Quote
            </button>
          </div>
        </div>
      </div>
      <p className="text-sm text-[#6B6D71]">
        <button type="button" onClick={() => onBookMeeting()} className="text-[#2040E7] font-semibold hover:underline">Schedule a phone call</button>
        {" "}or call{" "}
        <a href="tel:+18573924131" className="text-[#2040E7] font-semibold hover:underline">+1 (857) 392-4131</a>
      </p>
    </form>
  );
}

function CalEmbed({ prefill, onBack, layout = "month_view" }: { prefill?: Prefill; onBack: () => void; layout?: "month_view" | "week_view" | "column_view" }) {
  // ZIP has no dedicated booking field, so it rides along in the notes.
  // Business type + phone also go in the notes as a resilient fallback.
  const notesParts: string[] = [];
  if (prefill?.businessType) notesParts.push(`Business type: ${prefill.businessType}`);
  if (prefill?.zip) notesParts.push(`ZIP: ${prefill.zip}`);
  if (prefill?.phone) notesParts.push(`Phone: ${prefill.phone}`);
  const notes = notesParts.join(" · ");

  const bookingConfig: Record<string, string> = { layout, theme: "light" };
  if (prefill?.name) bookingConfig.name = prefill.name;
  if (prefill?.email) bookingConfig.email = prefill.email;
  // Prefill the phone two ways since the visible box can bind to either the
  // attendeePhoneNumber field or the booking *location* (this event's location
  // is type "phone"). Both take an E.164 value; the unused one is ignored.
  if (prefill?.phone) {
    const e164 = toE164US(prefill.phone);
    bookingConfig.attendeePhoneNumber = e164;
    bookingConfig.location = JSON.stringify({ value: "phone", optionValue: e164 });
  }
  if (prefill?.businessType) bookingConfig[CAL_INDUSTRY_FIELD] = prefill.businessType;
  if (notes) bookingConfig.notes = notes;

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout,
        // Drive cal.com's accent color from the Cohesive brand color.
        cssVarsPerTheme: {
          light: { "cal-brand": BRAND },
          dark: { "cal-brand": BRAND },
        },
      });
    })();
  }, [layout]);

  return (
    <div className="rounded-sm overflow-hidden shadow-xl border border-slate-200 bg-white">
      {/* Cohesive-branded header */}
      <div className="flex items-center justify-between gap-4 bg-[#2040E7] px-5 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Cohesive" className="h-8 w-auto object-contain brightness-0 invert" />
          <div className="text-left">
            <div className="text-white font-bold text-sm leading-tight">Schedule a phone call</div>
            <div className="text-white/70 text-xs">Pick a time — we&apos;ll bring the quote.</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-white/90 text-sm font-semibold hover:text-white transition-colors">
          ← Back
        </button>
      </div>

      <div className="h-[640px] overflow-hidden">
        <Cal
          namespace={CAL_NAMESPACE}
          calLink={CAL_EMBED_LINK}
          config={bookingConfig}
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
        />
      </div>
    </div>
  );
}

function Hero() {
  const [showCal, setShowCal] = useState(false);
  const [prefill, setPrefill] = useState<Prefill>({});

  const collage = [
    { title: "Roofing", image: "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=700&q=80&auto=format&fit=crop" },
    { title: "Electrical", image: "https://images.unsplash.com/photo-1758101755915-462eddc23f57?w=700&q=80&auto=format&fit=crop" },
    { title: "Plumbing", image: "https://plus.unsplash.com/premium_photo-1750594941294-91dcf3896ad5?w=700&q=80&auto=format&fit=crop" },
    { title: "HVAC", image: "https://plus.unsplash.com/premium_photo-1683134512538-7b390d0adc9e?w=700&q=80&auto=format&fit=crop" },
    { title: "General Contracting", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&q=80&auto=format&fit=crop" },
    { title: "Restaurants", image: "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?w=700&q=80&auto=format&fit=crop" },
  ];

  if (showCal) {
    return (
      <section className="pt-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
          <h1 className="text-[clamp(1rem,calc((100vw_-_2.5rem)/16.18),3rem)] font-bold text-[#2040E7] leading-tight tracking-tight mb-4 whitespace-nowrap">
            Better business insurance for less
          </h1>
          <p className="hidden sm:block text-lg text-[#6B6D71] leading-relaxed max-w-2xl mx-auto">
            Get better pricing on insurance for your business, through our proprietary network and data. Fast quotes, comprehensive coverage.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <CalEmbed prefill={prefill} onBack={() => setShowCal(false)} />
        </div>

        <div className="h-6 md:h-10" />
      </section>
    );
  }

  return (
    <section className="pt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
        <h1 className="text-[clamp(1rem,calc((100vw_-_2.5rem)/16.18),3rem)] font-bold text-[#2040E7] leading-tight tracking-tight mb-4 whitespace-nowrap">
          Better business insurance for less
        </h1>
        <p className="hidden sm:block text-lg text-[#6B6D71] leading-relaxed max-w-2xl mx-auto">
          Get better pricing on insurance for your business, through our proprietary network and data. Fast quotes, comprehensive coverage.
        </p>
      </div>

      {/* Photo collage */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-0">
          {collage.map((c, i) => (
            <div key={c.title}
              className={`relative h-44 sm:h-64 overflow-hidden ${i >= 3 ? "hidden md:block" : ""}`}>
              <img src={c.image} alt={c.title} decoding="async" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Overlapping quote widget */}
        <div id="quote-form" className="relative z-10 -mt-10 md:-mt-16 flex flex-col md:flex-row gap-4 md:gap-0 px-2 md:px-0 scroll-mt-24">
          <div className="md:flex-5 bg-white shadow-xl p-6 sm:p-8">
            <QuoteForm onBookMeeting={(data) => { setPrefill(data ?? {}); setShowCal(true); }} />
          </div>

          <div className="md:flex-2 bg-[#2040E7] p-6 flex flex-col justify-between">
            <div className="text-[11px] font-bold text-white/70 tracking-[0.08em] uppercase mb-4">What to Expect</div>
            <div className="lg:grid lg:grid-cols-[1fr_auto] lg:auto-rows-fr sm:flex sm:flex-col md:flex md:flex-col items-center gap-x-8 gap-y-4 lg:mb-[2%]">
              <h3 className="text-lg sm:text-lg font-bold text-white leading-tight">call back time</h3>
              <div className="lg:text-[80px] sm:text-5xl md:text-5xl text-6xl font-black text-white leading-none whitespace-nowrap w-full text-right py-1 lg:py-0">&lt;1 hr</div>
              <h3 className="text-lg sm:text-lg font-bold text-white leading-tight">avg. insurance cost saving</h3>
              <div className="lg:text-[80px] sm:text-5xl md:text-5xl text-6xl font-black text-white leading-none whitespace-nowrap w-full text-right py-1 lg:py-0">22 %</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-6 md:h-10" />
    </section>
  );
}

// ─── Social Proof Bar ─────────────────────────────────────────────────────────

function SocialProof() {
  const stats = [
    { value: "1500+", label: "Operators Served" },
    { value: "20+", label: "Active Programs" },
    { value: "30+", label: "Carriers" },
  ];

  return (
    <section className="bg-white border-t border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-[#2040E7]">{s.value}</div>
              <div className="text-xs text-[#6B6D71] mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Industries ───────────────────────────────────────────────────────────────

function Industries() {
  const [flipped, setFlipped] = useState(() => new Set());

  // Fixed 4-column layout. Each column's ratios must add up to 1;
  // that ratio directly drives what % of the column's total height that tile gets.
  const columns = [
    [
      { title: "Roofing", image: "/industries/roofing.jpg", desc: "General liability, tools & equipment, and completed-operations coverage for crews working at height.", ratio: 0.4 },
      { title: "Electrical", image: "/industries/electrical.jpg", desc: "Liability and equipment coverage built for licensed electricians and their crews.", ratio: 0.3 },
      { title: "Plumbing", image: "/industries/plumbing.jpg", desc: "Coverage for tools, vehicles, and liability exposure on every job site.", ratio: 0.3 },
    ],
    [
      { title: "Restaurants & Bars", image: "/industries/restaurants.jpg", desc: "Property, liquor liability, and workers' comp for kitchens, dining rooms, and bars.", ratio: 2 / 3 },
      { title: "Painting", image: "/industries/painting.jpg", desc: "Liability and equipment coverage for interior, exterior, and commercial crews.", ratio: 1 / 3 },
    ],
    [
      { title: "HVAC", image: "/industries/hvac.jpg", desc: "Protection for techs and equipment, from service calls to full system installs.", ratio: 0.45 },
      { title: "General Contracting", image: "/industries/general-contracting.jpg", desc: "Coverage that scales with multi-trade crews and complex job sites.", ratio: 0.3 },
      { title: "Trucking & Logistics", image: "/industries/trucking-logistics.jpg", desc: "Fleet, cargo, and liability coverage for owner-operators and small fleets.", ratio: 0.25 },
    ],
    [
      { title: "Retail", image: "/industries/retail.jpg", desc: "Property, liability, and business income coverage for storefronts and retail teams.", ratio: 0.55 },
      { title: "Garages", image: "/industries/garages.jpg", desc: "Garagekeepers liability and equipment coverage for auto repair shops.", ratio: 0.45 },
    ],
  ];

  useEffect(() => {
    const alwaysFlipped = ["HVAC", "Roofing", "Painting"];
    const alwaysNormal = ["Restaurants & Bars", "Plumbing", "Retail"];
    const rest = columns
      .flatMap((col) => col.map((p) => p.title))
      .filter((t) => !alwaysFlipped.includes(t) && !alwaysNormal.includes(t));
    const shuffled = [...rest].sort(() => Math.random() - 0.5);
    const randomFlips = shuffled.slice(0, Math.round(rest.length * 0.3));
    setFlipped(new Set([...alwaysFlipped, ...randomFlips]));
  }, []);

  return (
    <section id="industries" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="text-xs font-bold text-[#2040E7] uppercase tracking-widest mb-3">Industry Programs</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#131517] mb-4 max-w-2xl">
            Broad coverage across the industries you work in.
          </h2>
          <p className="text-[#6B6D71] text-lg max-w-xl">
            From the trades to retail to hospitality, we write a wide range of businesses, and know each one inside and out.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col, ci) => (
            <div key={ci} className="grid gap-4 h-[46rem]"
              style={{ gridTemplateRows: col.map((p) => `${p.ratio}fr`).join(" ") }}>
              {col.map((p) => (
                <div key={p.title} className="group [perspective:1200px]">
                  <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped.has(p.title)
                    ? "[transform:rotateY(180deg)] group-hover:[transform:rotateY(0deg)]"
                    : "group-hover:[transform:rotateY(180deg)]"
                    }`}>
                    {/* Front - photo */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
                      <img
                        src={p.image}
                        alt={p.title}
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute left-3 bottom-3 bg-white/95 text-[#131517] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        {p.title}
                      </span>
                    </div>
                    {/* Back - coverage blurb */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2A4BF0] to-[#1B2E9E] p-6 flex flex-col justify-end [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-3">{p.title}</div>
                      <p className="text-white text-base leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="#quote-form"
            className="inline-block px-6 py-3 rounded-lg border-2 border-[#2040E7] text-[#2040E7] text-sm font-bold hover:bg-[#2040E7] hover:text-white transition-colors">
            Don&apos;t see your industry? Ask us →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Coverage Lines ───────────────────────────────────────────────────────────

function Coverage() {
  const lines = [
    {
      title: "General Liability",
      desc: "Third-party bodily injury, property damage, and personal injury. The foundation of every commercial program.",
      image: "/coverage/general-liability.png",
      imgOffset: "-translate-x-6 -translate-y-6",
    },
    {
      title: "Commercial Auto",
      desc: "Fleet and non-owned auto for contractors, trucking operators, and service businesses on the road.",
      image: "/coverage/commercial-auto.png",
    },
    {
      title: "Workers' Compensation",
      desc: "Statutory coverage in all operating states with dedicated loss-control services for high-hazard classes.",
      image: "/coverage/workers-compensation.png",
      imgOffset: "-translate-x-6",
    },
    {
      title: "Commercial Property",
      desc: "Buildings, business personal property, equipment breakdown, and business income/extra expense.",
      image: "/coverage/commercial-property.png",
    },
    {
      title: "Employment Practices Liability",
      desc: "Wrongful termination, discrimination, harassment, and wage & hour disputes for growing teams.",
      image: "/coverage/employment-practices.png",
      imgOffset: "-translate-x-6 -translate-y-6",
    },
    {
      title: "Cyber Liability",
      desc: "First- and third-party cyber coverage including ransomware, data breach, and business interruption.",
      image: "/coverage/cyber-liability.png",
      imgOffset: "-translate-x-6 -translate-y-6",
    },
    {
      title: "Umbrella / Excess",
      desc: "Limits from $1M to $25M sitting above your primary program. Required by most general contractors.",
      image: "/coverage/umbrella-excess.png",
      imgOffset: "-translate-x-6 -translate-y-6",
    },
    {
      title: "Professional Liability",
      desc: "Errors & omissions for design-build contractors, engineers, and technology service providers.",
      image: "/coverage/professional-liability.png",
      imgOffset: "-translate-x-6 -translate-y-6",
    },
    {
      title: "Liquor Liability",
      desc: "Coverage for restaurants, bars, and caterers that serve alcohol, for injuries or damage tied to intoxication.",
      image: "/coverage/liquor-liability.png",
      imgOffset: "-translate-x-6 -translate-y-6",
    },
  ];

  return (
    <section id="coverage" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-[#2040E7] uppercase tracking-widest mb-3">Coverage Lines</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#131517] max-w-lg">
              Every line your business actually needs.
            </h2>
          </div>
          <p className="text-[#6B6D71] max-w-sm">
            We place nine major coverage lines across a panel of 30+ A-rated carriers, all in one conversation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24 sm:pl-10 lg:pl-8">
          {lines.map((l) => {
            // On mobile the illustration is centered over its tile; from `sm` up
            // it returns to the off-corner placement, so the per-item nudges
            // (which are desktop-tuned) only apply there.
            const smOffset = (l.imgOffset ?? "")
              .split(" ")
              .filter(Boolean)
              .map((c) => `sm:${c}`)
              .join(" ");
            return (
              <div key={l.title}
                className="relative bg-white border border-slate-200 rounded-lg p-6 pt-32 hover:shadow-md hover:border-[#2040E7] transition-all group">
                <div className={`absolute -top-20 z-20 w-56 h-56 left-0 right-0 mx-auto sm:left-[-4rem] sm:right-auto sm:mx-0 ${smOffset}`}>
                  <img src={l.image} alt="" aria-hidden="true"
                    className="w-full h-full object-contain object-top sm:object-left-top drop-shadow-lg pointer-events-none select-none group-hover:animate-wobble" />
                </div>
                <h3 className="font-semibold text-[#131517] mb-2 group-hover:text-[#2040E7] transition-colors">{l.title}</h3>
                <p className="text-sm text-[#6B6D71] leading-relaxed">{l.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "2-Minute Intake",
      desc: "Tell us about your business: what you do, where you operate, your revenue range, and any prior claims. No lengthy questionnaires.",
      detail: "We ask only what underwriters actually need.",
    },
    {
      step: "02",
      title: "We Market Your Risk",
      desc: "Our team shops your submission across the full A-rated carrier panel. For most classes, you have options within 24–72 hours.",
      detail: "Median quote turnaround: 48 hours.",
    },
    {
      step: "03",
      title: "Plain-English Comparison",
      desc: "We present quotes side by side in plain English, no jargon, no hidden exclusions. You pick the program; we bind it.",
      detail: "Same-day binding available for qualifying accounts.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold text-[#2040E7] uppercase tracking-widest mb-3">Process</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#131517] mb-4">
            From intake to bound in 48 hours.
          </h2>
          <p className="text-[#6B6D71] text-lg">
            We stripped out every step that doesn&apos;t serve you. The result is a process that respects your time.
          </p>
        </div>

        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {/* Connector line: runs from this box's center to the next box's center */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 left-1/2 h-px bg-slate-200"
                    style={{ width: "calc(100% + 3rem)" }}
                  />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-sm flex items-center justify-center text-3xl font-black mb-6 relative z-10
                    ${i === 1 ? "bg-[#2040E7] text-white" : "bg-[#F2F5F7] text-[#6B6D71]"}`}>
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-[#131517] mb-3">{s.title}</h3>
                  <p className="text-[#6B6D71] leading-relaxed mb-3">{s.desc}</p>
                  <p className="text-sm font-medium text-[#2040E7]">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Carriers ─────────────────────────────────────────────────────────────────

function Carriers() {
  const carriers = [
    "Travelers", "Chubb", "The Hartford", "Liberty Mutual", "CNA",
    "Nationwide", "Zurich", "Hiscox", "AIG", "Markel",
    "Berkshire Hathaway", "Great American", "Tokio Marine", "Philadelphia Ins.", "Employers",
    "Cincinnati Financial", "Westfield",
  ];

  return (
    <section id="carriers" className="py-20 bg-[#2040E7] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-6 mb-14">
          <div>
            <div className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] mb-4">A-Rated Carrier Panel</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-xl">
              We work with the carriers operators trust.
            </h2>
          </div>
        </div>
      </div>

      {/* Auto-flowing carrier marquee (two identical tracks for a seamless loop) */}
      <div className="flex">
        {[0, 1].map((track) => (
          <ul
            key={track}
            aria-hidden={track === 1}
            className="flex shrink-0 items-center gap-12 pr-12 animate-marquee whitespace-nowrap">
            {carriers.map((c) => (
              <li key={c} className="text-xl sm:text-2xl font-semibold text-white/90">{c}</li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const quotes = [
    {
      quote: "We got three carriers to compete on our trucking program within 48 hours. Previous broker took three weeks and came back with one option.",
      author: "Marcus T.",
      company: "Regional Flatbed Operator, TX · 34 trucks",
      initials: "MT",
      color: "bg-[#2040E7]",
    },
    {
      quote: "They actually understood our concrete work. Didn't treat us like every other contractor; they knew the difference between flatwork and structural pours.",
      author: "Diana R.",
      company: "Structural Concrete Contractor, CA · $8M revenue",
      initials: "DR",
      color: "bg-[#27455C]",
    },
    {
      quote: "Renewal was painless. They sent a plain-English summary explaining every change from last year. No surprises, no phone tag.",
      author: "James K.",
      company: "Metal Fabricator, OH · $12M revenue",
      initials: "JK",
      color: "bg-[#007395]",
    },
    {
      quote: "Our old carrier dropped us mid-season. Cohesive had a new roofing program bound in four days, and the rate came in lower than what we were paying.",
      author: "Ana P.",
      company: "Commercial Roofing Contractor, FL · 22 crew",
      initials: "AP",
      color: "bg-[#27455C]",
    },
    {
      quote: "The liquor liability piece is what sold me. They knew exactly which carriers wanted our class and which ones would nickel-and-dime the endorsements.",
      author: "Sofia M.",
      company: "Restaurant & Bar Group, IL · 3 locations",
      initials: "SM",
      color: "bg-[#2040E7]",
    },
    {
      quote: "As an owner-operator, I never felt like a small account. They walked me through cargo and physical damage line by line until it actually made sense.",
      author: "Darnell W.",
      company: "Owner-Operator, GA · single-truck authority",
      initials: "DW",
      color: "bg-[#007395]",
    },
    {
      quote: "We opened a second location and they had the added property and liability endorsed the same afternoon. Zero downtime, zero drama.",
      author: "Priya N.",
      company: "Specialty Retail, WA · 2 storefronts",
      initials: "PN",
      color: "bg-[#2040E7]",
    },
    {
      quote: "Their team caught an exclusion in our old GL policy that would have left us exposed on every remodel. That alone paid for the switch.",
      author: "Robert C.",
      company: "General Contractor, NC · $15M revenue",
      initials: "RC",
      color: "bg-[#27455C]",
    },
    {
      quote: "Fast, direct, and no insurance jargon. I texted a photo of my current policy and had a better quote back before lunch.",
      author: "Elena V.",
      company: "Licensed Electrician, AZ · 8 electricians",
      initials: "EV",
      color: "bg-[#007395]",
    },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToCard = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const stride = track.scrollWidth / quotes.length;
    const maxScroll = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: Math.min(i * stride, maxScroll), behavior: "smooth" });
  };

  // The card index the track is actually scrolled to, derived from scrollLeft.
  // With several cards visible, scrollLeft tops out well below (N-1)*stride, so
  // this can never reach the final indices — that's fine for stepping the
  // buttons, and `active` handles lighting up the trailing dots separately.
  const scrolledIndex = () => {
    const track = trackRef.current;
    if (!track) return active;
    const stride = track.scrollWidth / quotes.length;
    return Math.round(track.scrollLeft / stride);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    // Once we're at (or within a pixel of) the end, the last card is current —
    // with multiple cards visible, scrollLeft maxes out below (N-1)*stride, so
    // the trailing dots would otherwise never activate.
    if (maxScroll > 0 && track.scrollLeft >= maxScroll - 1) {
      setActive(quotes.length - 1);
      return;
    }
    setActive(scrolledIndex());
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <div className="text-xs font-bold text-[#2040E7] uppercase tracking-widest mb-3">Client Stories</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#131517]">
            What operators say after working with us.
          </h2>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={() => scrollToCard(Math.max(0, scrolledIndex() - 1))}
            className="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-slate-300 bg-white shadow-sm text-[#131517] flex items-center justify-center hover:border-[#2040E7] hover:text-[#2040E7] transition-colors">
            ←
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            onClick={() => scrollToCard(Math.min(quotes.length - 1, scrolledIndex() + 1))}
            className="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-slate-300 bg-white shadow-sm text-[#131517] flex items-center justify-center hover:border-[#2040E7] hover:text-[#2040E7] transition-colors">
            →
          </button>

          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quotes.map((q) => (
              <div
                key={q.author}
                className="snap-start shrink-0 basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)] bg-white border border-slate-200 rounded-sm p-8 hover:shadow-md transition-shadow">
                <svg className="w-8 h-8 text-slate-200 mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-[#272A2D] leading-relaxed mb-8 text-[15px]">&ldquo;{q.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${q.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {q.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[#131517] text-sm">{q.author}</div>
                    <div className="text-[#6B6D71] text-xs">{q.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {quotes.map((q, i) => (
            <button
              key={q.author}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => scrollToCard(i)}
              className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-[#2040E7]" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  const [showCal, setShowCal] = useState(false);
  const [prefill, setPrefill] = useState<Prefill>({});

  return (
    <section id="get-quote" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#131517] mb-6">
            Ready to see what a competitive market looks like?
          </h2>
          <p className="text-[#6B6D71] text-lg max-w-xl mx-auto">
            Tell us about your business in 2 minutes. Our team will market your account and have options back to you in under 48 hours.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {showCal ? (
            <CalEmbed prefill={prefill} onBack={() => setShowCal(false)} layout="column_view" />
          ) : (
            <div className="bg-white shadow-xl border border-slate-200 p-6 sm:p-8 text-left">
              <QuoteForm onBookMeeting={(data) => { setPrefill(data ?? {}); setShowCal(true); }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Quote Modal ────────────────────────────────────────────────────────────

function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="relative bg-white rounded-sm max-w-md w-full p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-[#272A2D] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-[11px] font-bold text-[#2040E7] tracking-[0.08em] uppercase mb-2">Get a Quote</div>
        <h3 className="text-xl font-bold text-[#131517] mb-3">Let&apos;s get you covered.</h3>
        <p className="text-sm text-[#6B6D71] leading-relaxed mb-6">
          Fill out our quick intake form and we&apos;ll reach out within 30 minutes with your options, or skip the wait and book a time to talk with us directly.
        </p>

        <div className="flex flex-col gap-3">
          <a href={CAL_LINK} target="_blank" rel="noopener noreferrer" onClick={onClose}
            className="w-full text-center px-5 py-3 rounded-sm bg-[#2040E7] text-white text-sm font-bold hover:bg-[#1A33B9] transition-colors">
            Schedule a phone call
          </a>
          <a href="#get-quote" onClick={onClose}
            className="w-full text-center px-5 py-3 rounded-sm border border-slate-300 text-[#272A2D] text-sm font-bold hover:bg-slate-50 transition-colors">
            Fill out the quote form instead
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#2040E7] text-white/80 pt-16 pb-8">
      {/* Watermark */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none inset-y-0 -left-10 -top-5 h-[calc(100%+40px)] w-auto object-contain brightness-0 invert opacity-[0.07]"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Industries */}
          <div className="md:col-start-4">
            <h4 className="text-white font-semibold text-sm mb-4">Industries</h4>
            <ul className="space-y-2 text-sm">
              {["Roofing", "Electrical", "Plumbing", "HVAC", "General Contracting", "Painting", "Trucking & Logistics", "Restaurants & Bars", "Retail", "Garages"].map((l) => (
                <li key={l}><a href="#industries" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Coverage */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Coverage</h4>
            <ul className="space-y-2 text-sm">
              {["General Liability", "Commercial Auto", "Workers' Compensation", "Commercial Property", "Employment Practices Liability", "Cyber Liability", "Umbrella / Excess", "Professional Liability", "Liquor Liability"].map((l) => (
                <li key={l}><a href="#coverage" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "Carriers", href: "#carriers" },
                { label: "Contact", href: "tel:+18573924131" },
              ].map((l) => (
                <li key={l.label}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 md:w-1/2 md:ml-auto">
          <div className="h-px w-full bg-white/20 mb-6" />
          <p className="text-xs md:text-right">
            © 2026 Cohesive Insurance Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const openQuote = () => setQuoteModalOpen(true);

  return (
    <>
      <Navbar onOpenQuote={openQuote} />
      <main>
        <Hero />
        <SocialProof />
        <Industries />
        <Coverage />
        <HowItWorks />
        <Carriers />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <QuoteModal open={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </>
  );
}
