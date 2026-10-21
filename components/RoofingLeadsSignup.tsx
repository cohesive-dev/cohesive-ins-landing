"use client";
import { useEffect, useRef, useState } from "react";
import { ROOFING_WORK, NOT_A_ROOFER, calendlyBookingUrl, calendlyEmbedUrl, type RoofingLeadInput } from "@/lib/roofing-leads";

type Offer = "per-lead" | "monthly";
type Phase = "form" | "sending" | "booking" | "not-roofer";
type Fbq = (...a: unknown[]) => void;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;

/** Roofing-leads signup (Kevin 2026-10-20: the /catering-leads workflow). Posts to /api/roofing-leads (Slack group DM,
 *  never the insurance intake), then asks the lead to book the demo. Pixel events are CUSTOM names on purpose: this site's
 *  pixel is the insurance pixel, so a standard "Lead" here would train the insurance ads on roofing-leads signups. */
export default function RoofingLeadsSignup({ offer }: { offer: Offer }) {
  const [f, setF] = useState({ fullName: "", businessName: "", email: "", phone: "", serviceArea: "", roofingWork: "", website: "" });
  const [phase, setPhase] = useState<Phase>("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const fRef = useRef(f);
  const phaseRef = useRef(phase);
  const partialSent = useRef(false);
  useEffect(() => { fRef.current = f; }, [f]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const utm = (): RoofingLeadInput["utm"] => {
    if (typeof window === "undefined") return {};
    const q = new URLSearchParams(location.search);
    return Object.fromEntries(UTM_KEYS.map((k) => [k, q.get(k) ?? ""]).filter(([, v]) => v));
  };
  const body = (extra: Partial<RoofingLeadInput> = {}): RoofingLeadInput => ({ ...fRef.current, offer, utm: utm(), pageUrl: location.href, ...extra });

  // Partial capture (as catering): a visitor who typed a valid email or phone and leaves without submitting is sent once.
  useEffect(() => {
    const capture = () => {
      const v = fRef.current;
      if (partialSent.current || phaseRef.current !== "form" || v.website || v.roofingWork === NOT_A_ROOFER) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) && v.phone.replace(/\D/g, "").length < 10) return;
      partialSent.current = true;
      const blob = new Blob([JSON.stringify(body({ partial: true }))], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/roofing-leads", blob)) {
        fetch("/api/roofing-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body({ partial: true })), keepalive: true }).catch(() => {});
      }
    };
    let hiddenTimer: ReturnType<typeof setTimeout> | undefined;
    const onVis = () => { clearTimeout(hiddenTimer); if (document.visibilityState === "hidden") hiddenTimer = setTimeout(capture, 10 * 60 * 1000); };
    window.addEventListener("pagehide", capture);
    document.addEventListener("visibilitychange", onVis);
    return () => { window.removeEventListener("pagehide", capture); document.removeEventListener("visibilitychange", onVis); clearTimeout(hiddenTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer]);

  // Booked on the inline Calendly -> custom pixel event.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      if ((e.data as { event?: string } | null)?.event === "calendly.event_scheduled") {
        (window as unknown as { fbq?: Fbq }).fbq?.("trackCustom", "RoofingLeadsSchedule", { offer });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [offer]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.roofingWork === NOT_A_ROOFER) { setPhase("not-roofer"); return; }
    setPhase("sending"); setErrors({}); setMessage("");
    try {
      const r = await fetch("/api/roofing-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body()) });
      const data = (await r.json().catch(() => ({}))) as { status?: string; errors?: Record<string, string>; message?: string };
      if (r.ok && data.status === "ok") {
        partialSent.current = true;
        (window as unknown as { fbq?: Fbq }).fbq?.("trackCustom", "RoofingLeadsSignup", { offer });
        setBookingUrl(calendlyBookingUrl({ fullName: f.fullName, email: f.email, phone: f.phone, offer, utm: utm() }));
        setPhase("booking");
        return;
      }
      if (data.status === "disqualified") { setPhase("not-roofer"); return; }
      setErrors(data.errors ?? {}); setMessage(data.message ?? ""); setPhase("form");
    } catch { setMessage("Something went wrong. Please email us at quotes@cohesiveinsure.com."); setPhase("form"); }
  }

  if (phase === "not-roofer") return <div><h2>Thanks for your interest.</h2><p>This offer is for roofing businesses right now.</p></div>;
  if (phase === "booking") return <div>
    <h2>Thanks, we got it.</h2>
    <p>Last step: pick a time for a quick call so we can confirm your service area and get your outreach started.</p>
    <iframe title="Book a time" src={calendlyEmbedUrl(bookingUrl)} style={{ width: "100%", height: 700, border: 0 }} />
    <p><a href={bookingUrl} target="_blank" rel="noopener noreferrer">Open the booking page</a></p>
  </div>;

  const err = (k: string) => errors[k] ? <small role="alert" style={{ color: "#b42318" }}>{errors[k]}</small> : null;
  return <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520, margin: "0 auto" }} noValidate>
    <h2>Get roofing leads</h2>
    <label>Your name<input value={f.fullName} onChange={set("fullName")} autoComplete="name" />{err("fullName")}</label>
    <label>Business name<input value={f.businessName} onChange={set("businessName")} autoComplete="organization" />{err("businessName")}</label>
    <label>Email<input type="email" value={f.email} onChange={set("email")} autoComplete="email" />{err("email")}</label>
    <label>Phone<input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />{err("phone")}</label>
    <label>Service area (city or ZIP)<input value={f.serviceArea} onChange={set("serviceArea")} autoComplete="postal-code" />{err("serviceArea")}</label>
    <label>What roofing work do you do?<select value={f.roofingWork} onChange={set("roofingWork")}><option value="" disabled>Choose one</option>{ROOFING_WORK.map((w) => <option key={w}>{w}</option>)}</select>{err("roofingWork")}</label>
    <input aria-hidden="true" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} style={{ position: "absolute", left: "-9999px" }} />
    {message && <p role="alert">{message}</p>}
    <button type="submit" disabled={phase === "sending"}>{phase === "sending" ? "Sending…" : "Get started"}</button>
  </form>;
}
