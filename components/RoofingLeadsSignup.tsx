"use client";
import { useState } from "react";

type Offer = "per-lead" | "monthly";
const WORK = ["Residential", "Commercial", "Both", "I'm not a roofer"] as const;

/** Short signup for the roofing-leads offer (DRAFT, Kevin 2026-10-20: prepare, do not launch).
 *  Posts to /api/intake with source "roofing-leads"; a non-roofer gets an end message and nothing is sent. */
export default function RoofingLeadsSignup({ offer }: { offer: Offer }) {
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", area: "", work: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "not-roofer">("idle");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.work === "I'm not a roofer") { setState("not-roofer"); return; }
    if (!f.email && !f.phone) { setState("error"); return; }
    setState("sending");
    try {
      const r = await fetch("/api/intake", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "roofing-leads", name: f.name, company: f.company, email: f.email, phone: f.phone, businessType: "Roofing",
          details: [
            { label: "Marketing offer", value: "roofing-leads" },
            { label: "Offer arm", value: offer === "monthly" ? "3 leads a month for $100" : "About $30 a lead (monthly campaign)" },
            { label: "Service area", value: f.area },
            { label: "Roofing work", value: f.work },
          ],
        }),
      });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <div><h2>Thanks, we got it.</h2><p>We&apos;ll reach out shortly to confirm your service area and get your outreach started.</p></div>;
  if (state === "not-roofer") return <div><h2>Thanks for your interest.</h2><p>This offer is for roofing businesses right now.</p></div>;
  return <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520, margin: "0 auto" }}>
    <h2>Get roofing leads</h2>
    <label>Your name<input required value={f.name} onChange={set("name")} autoComplete="name" /></label>
    <label>Business name<input required value={f.company} onChange={set("company")} autoComplete="organization" /></label>
    <label>Email<input type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
    <label>Phone<input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" /></label>
    <label>Service area (city or ZIP)<input required value={f.area} onChange={set("area")} autoComplete="postal-code" /></label>
    <label>What roofing work do you do?<select required value={f.work} onChange={set("work")}><option value="" disabled>Choose one</option>{WORK.map((w) => <option key={w}>{w}</option>)}</select></label>
    {state === "error" && <p role="alert">Please add an email or phone and try again.</p>}
    <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Get started"}</button>
  </form>;
}
