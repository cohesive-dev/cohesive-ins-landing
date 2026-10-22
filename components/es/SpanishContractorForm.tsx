"use client";
// Spanish contractor quote form (Kevin 2026-10-22). Same questions, order and backend contract as the paid
// /contractor-test form in its step layout: POST /api/intake, source "contractors-landing", the same English
// detail labels (FULL_LABELS) and English option values, the same attribution rows (utm_*, fbclid, ad_id,
// adset_id, campaign_id via lib/attribution + "Current ad_id" rows) and the same Meta Lead dedupe id. Only the
// visible text is Spanish, plus one formAnswers row: "Preferred language": "Spanish".
// Its own experiment cell (<industry>__es__step__v1) and form version keep it out of the English A/B cells.
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { captureAttribution, attributionDetails } from "@/lib/attribution";
import { trafficSession } from "@/lib/traffic-session";
import { FULL_LABELS, fullScreens, normalizeFull, validFullField } from "@/lib/contractor-full-form";
import { acceptedPhoneShape } from "@/lib/phone-shape";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { contractorButtonClass } from "@/components/ContractorPageTheme";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/entity";
import {
  ES_FIELD,
  ES_OPTIONS,
  ES_OTHER_TRADES,
  ES_SECTION,
  PREFERRED_LANGUAGE,
  sectionOf,
} from "@/lib/es/contractor-form-es";

export const ES_FORM_VERSION = "2026-10-22-es-v1";
type Answers = Record<string, string>;
const TEXT_FIELDS = new Set(["email", "phone", "fullName", "legalName", "otherTradeDescription", "yearStarted"]);
const ID_PARAMS = ["ad_id", "adset_id", "campaign_id"] as const;

const fieldClass =
  "w-full rounded-lg border border-[#D8DEF5] bg-white px-4 py-3 text-[16px] text-[#131517] placeholder-[#9AA0A6] focus:border-[#2040E7] focus:outline-none focus:ring-1 focus:ring-[#2040E7]";

function fieldError(k: string): string {
  if (k === "email") return "Escriba un correo electrónico válido.";
  if (k === "phone") return "Escriba un número de teléfono válido.";
  if (ES_OPTIONS[k] || k === "otherTrades") return "Por favor elija una opción para continuar.";
  return "Por favor complete este dato para continuar.";
}

export default function SpanishContractorForm({
  advertisedIndustry,
  cellIndustry,
  tradeFirst,
}: {
  /** English page context for the CRM ("Roofing"), never the client's stated trade. */
  advertisedIndustry: string;
  /** Short id for the experiment cell, e.g. "roof". */
  cellIndustry: string;
  /** Trade value listed first in the trade select (not pre-selected). */
  tradeFirst?: string;
}) {
  const query = useSearchParams();
  const preview = query.get("preview") === "1";
  const cellId = `${cellIndustry}__es__step__v1`;
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const submission = useRef("");
  const sentPartial = useRef(false);
  const partialInFlight = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);

  const screens = fullScreens(answers, false);
  const lastStep = screens.length - 1;
  const shown = screens[Math.min(step, lastStep)];
  const allFields = screens.flat();

  const trades = useMemo(() => {
    const first = ES_OPTIONS.trade.find((t) => t.value === tradeFirst);
    return first ? [first, ...ES_OPTIONS.trade.filter((t) => t !== first)] : ES_OPTIONS.trade;
  }, [tradeFirst]);

  useEffect(() => {
    captureAttribution();
  }, []);

  // Rows every submission carries, partial or final. Built at send time (reads storage), never during render.
  function baseDetails(a: Answers) {
    const attribution = captureAttribution();
    return [
      { label: "Experiment cell", value: cellId },
      { label: "Form version", value: ES_FORM_VERSION },
      { label: "Session id", value: trafficSession() },
      { label: "Submission id", value: submission.current },
      { label: "Advertised industry (not confirmed trade)", value: advertisedIndustry },
      { ...PREFERRED_LANGUAGE },
      ...Object.entries(a)
        .filter(([k, v]) => !["email", "phone", "fullName", "wcRequested"].includes(k) && FULL_LABELS[k] && v)
        .map(([k, value]) => ({ label: FULL_LABELS[k], value })),
      ...attributionDetails(attribution),
      ...(!attribution.landing_page ? [{ label: "Landing page", value: window.location.pathname }] : []),
      ...ID_PARAMS.filter((k) => /^\d{5,30}$/.test(query.get(k) || "")).map((k) => ({ label: `Current ${k}`, value: query.get(k)! })),
    ];
  }

  // Abandoned fill: same as /contractor-test - after a real leave signal or 120 s without another answer,
  // save what we have to quotes@ (the intake route keeps partials out of the CRM).
  useEffect(() => {
    if (preview) return;
    const capture = async () => {
      if (sentPartial.current || partialInFlight.current || status === "sending" || status === "done") return;
      const email = validFullField("email", answers.email) ? answers.email.trim() : undefined;
      const phone = acceptedPhoneShape(answers.phone) ? answers.phone : undefined;
      if (!email && !phone) return;
      submission.current ||= crypto.randomUUID();
      const body = JSON.stringify({
        name: answers.fullName,
        email,
        phone,
        company: answers.legalName,
        businessType: "Contractor enquiry - work unconfirmed",
        source: "contractors-landing",
        partial: true,
        final: true,
        details: baseDetails(answers),
        website: honeypot.current?.value || "",
      });
      partialInFlight.current = true;
      try {
        const res = await fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
        const result = await res.json();
        // Same success test as /contractor-test: this form version is in /api/intake's contact-first list, so a
        // failed quotes@ save answers 503 / notification "failed" and the leave / idle retry stays armed.
        if (res.ok && result.ok === true && result.notification === "sent") sentPartial.current = true;
      } catch {
        /* keep the leave/idle retry; never block completion */
      } finally {
        partialInFlight.current = false;
      }
    };
    const hidden = () => {
      if (document.visibilityState === "hidden") void capture();
    };
    const timer = setTimeout(capture, 120000);
    window.addEventListener("pagehide", capture);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", capture);
      document.removeEventListener("visibilitychange", hidden);
    };
    // baseDetails reads only props, refs and storage; answers/status drive the snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, status, preview]);

  function update(k: string, v: string) {
    setError("");
    setAnswers((a) => normalizeFull(a, k, v));
  }

  function showFieldError(k: string) {
    setError(fieldError(k));
    const control = document.getElementById(`es-${k}`) || form.current?.querySelector<HTMLElement>(`[data-es-field="${k}"] input, [data-es-field="${k}"] select`);
    control?.scrollIntoView({ block: "center", behavior: "smooth" });
    // A checkbox group (other trades) is a div: focus its first checkbox instead.
    if (control?.getAttribute("role") === "group") control.querySelector("input")?.focus();
    else control?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < lastStep) {
      const invalid = shown.find((k) => !validFullField(k, answers[k]));
      if (invalid) return showFieldError(invalid);
      setError("");
      setStep(step + 1);
      form.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      return;
    }
    const invalid = allFields.find((k) => !validFullField(k, answers[k]));
    if (invalid) {
      const at = screens.findIndex((s) => s.includes(invalid));
      if (at >= 0 && at !== step) setStep(at);
      return showFieldError(invalid);
    }
    if (preview) {
      setStatus("done");
      return;
    }
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    submission.current ||= crypto.randomUUID();
    // Same row order as /contractor-test: identity rows, then the offer / follow-up rows, then the answers.
    const base = baseDetails(answers);
    const details = [
      ...base.slice(0, 6),
      { label: "Marketing offer", value: "insurance quote" },
      { label: "Actual work and business state", value: "Confirm during follow-up before quoting" },
      ...base.slice(6),
    ];
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: answers.fullName,
          email: answers.email?.trim(),
          phone: answers.phone,
          company: answers.legalName,
          businessType: `Contractor enquiry - advertised ${advertisedIndustry}; actual work unconfirmed`,
          source: "contractors-landing",
          details,
          eventId: submission.current,
          website: honeypot.current?.value || "",
        }),
      });
      const result = await res.json();
      if (!res.ok || result.ok !== true) throw new Error("intake_not_accepted");
      if (result.conversion?.eligible === true && typeof result.conversion.eventId === "string")
        (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq?.("track", "Lead", {}, { eventID: result.conversion.eventId });
      setStatus("done");
    } catch {
      setStatus("error");
      setError(`No pudimos guardar su solicitud. Intente de nuevo o llámenos al ${PHONE_DISPLAY}.`);
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-2xl font-bold text-[#131517]">
          {preview ? "Vista previa terminada. No se envió nada." : "¡Gracias! Ya recibimos su solicitud."}
        </p>
        {!preview && (
          <p className="mt-3 text-[#6B6D71]">
            Un agente con licencia va a preparar su cotización y se va a comunicar con usted en español. ¿Prefiere hablar
            ahora? Llame al{" "}
            <a href={`tel:${PHONE_E164}`} className="font-semibold text-[#2040E7]">
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  const selectedOtherTrades = answers.otherTrades ? answers.otherTrades.split(", ").filter(Boolean) : [];
  function toggleOtherTrade(value: string) {
    if (value === "None") return update("otherTrades", selectedOtherTrades.includes("None") ? "" : "None");
    const cur = selectedOtherTrades.filter((t) => t !== "None");
    update("otherTrades", (cur.includes(value) ? cur.filter((t) => t !== value) : [...cur, value]).join(", "));
  }
  const section = sectionOf(shown[0]);

  function renderField(k: string) {
    const meta = ES_FIELD[k] ?? { label: FULL_LABELS[k] ?? k };
    const id = `es-${k}`;
    let control: React.ReactNode;
    if (k === "address") {
      control = <AddressAutocomplete id={id} value={answers.address} onChange={(v) => update("address", v)} placeholder={meta.placeholder} ariaLabel={meta.label} required />;
    } else if (k === "otherTrades") {
      control = (
        <div id={id} role="group" aria-label={meta.label} className="grid gap-2 sm:grid-cols-2">
          {ES_OTHER_TRADES.filter((o) => o.value === "None" || o.value !== answers.trade).map((o) => (
            <label key={o.value} className="flex min-h-[44px] items-center gap-3 rounded-lg border border-[#D8DEF5] px-3 py-2 text-[15px]">
              <input type="checkbox" checked={selectedOtherTrades.includes(o.value)} onChange={() => toggleOtherTrade(o.value)} />
              {o.label}
            </label>
          ))}
        </div>
      );
    } else if (ES_OPTIONS[k]) {
      const options = k === "trade" ? trades : ES_OPTIONS[k];
      control = (
        <select id={id} value={answers[k] || ""} onChange={(e) => update(k, e.target.value)} className={fieldClass}>
          <option value="" disabled>
            Elija una opción
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    } else if (TEXT_FIELDS.has(k)) {
      control = (
        <input
          id={id}
          value={answers[k] || ""}
          onChange={(e) => update(k, e.target.value)}
          maxLength={200}
          placeholder={meta.placeholder}
          className={fieldClass}
          type={k === "email" ? "email" : k === "phone" ? "tel" : "text"}
          inputMode={k === "email" ? "email" : k === "phone" ? "tel" : k === "yearStarted" ? "numeric" : undefined}
          autoComplete={k === "fullName" ? "name" : k === "email" ? "email" : k === "phone" ? "tel" : k === "legalName" ? "organization" : "off"}
        />
      );
    }
    return (
      <div key={k} data-es-field={k}>
        <label htmlFor={id} className="mb-2 block font-semibold text-[#131517]">
          {meta.label}
          {meta.optional ? <span className="font-normal text-[#6B6D71]"> (opcional)</span> : " *"}
        </label>
        {meta.hint && <p className="-mt-1 mb-2 text-sm text-[#6B6D71]">{meta.hint}</p>}
        {control}
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={submit} lang="es" className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6" noValidate>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}>
        <label>
          Deje este campo vacío
          <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {preview && <p role="status">Vista previa: no se va a enviar ninguna solicitud.</p>}
      <div>
        <p className="text-sm text-[#6B6D71]">
          Paso {step + 1} de {screens.length}
        </p>
        <div className="mt-2 h-1.5 rounded-full bg-[#EEF1FF]" role="progressbar" aria-label="Avance del formulario" aria-valuemin={0} aria-valuemax={screens.length} aria-valuenow={step + 1}>
          <div className="h-full rounded-full bg-[#2040E7] transition-all" style={{ width: `${((step + 1) / screens.length) * 100}%` }} />
        </div>
      </div>
      <h3 className="text-lg font-bold text-[#131517]">{ES_SECTION[section]}</h3>
      {shown.map(renderField)}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="min-h-[52px] rounded-xl border border-[#D8DEF5] px-5 font-semibold text-[#131517]">
            Atrás
          </button>
        )}
        <button type="submit" disabled={status === "sending"} className={contractorButtonClass}>
          {status === "sending" ? "Enviando…" : step < lastStep ? "Siguiente" : "Quiero mi cotización"}
        </button>
      </div>
      <p className="text-xs leading-relaxed text-[#6B6D71]">
        Solo usamos sus datos para preparar y enviarle su cotización de seguro. Los datos de contacto que escriba se pueden
        guardar antes de enviar el formulario, para ayudarle a recuperar una solicitud sin terminar.{" "}
        <a href="/privacy" className="underline" hrefLang="en">
          Política de privacidad (en inglés)
        </a>
      </p>
    </form>
  );
}
