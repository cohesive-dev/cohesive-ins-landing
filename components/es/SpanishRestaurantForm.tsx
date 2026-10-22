"use client";
// Spanish restaurant short form (Kevin 2026-10-22). Same backend contract as the restaurant SEO short form
// (RestaurantQuickQuote): POST /api/intake with the page's source, English business-type values (so the quoter
// reads the same strings and Rainbow class), the same detail rows (detailsFor), eventId + capiEventName, and the
// same bar routing. Only the visible text is Spanish, plus formAnswers "Preferred language": "Spanish".
import { useCallback, useEffect, useRef, useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js/min";
import isEmail from "validator/lib/isEmail";
import { track as vaTrack } from "@vercel/analytics";
import { captureAttribution } from "@/lib/attribution";
import {
  BAR_TYPE,
  RENEWAL_MONTHS,
  SOMETHING_ELSE,
  capiEventFor,
  detailsFor,
  pageTypeChoice,
  restaurantTypeOptions,
  statedType,
  type RestaurantPageType,
} from "@/components/RestaurantQuickQuote";
import { PREFERRED_LANGUAGE } from "@/lib/es/contractor-form-es";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/entity";

const TYPE_ES: Record<string, string> = {
  "Coffee / café / bakery (little or no cooking)": "Cafetería / panadería (poca o nada de cocina)",
  "Fast food / counter service (grill or fryer)": "Comida rápida / servicio en mostrador (plancha o freidora)",
  "Full-service / sit-down restaurant": "Restaurante con servicio a la mesa",
  "Fine dining": "Alta cocina (fine dining)",
  "Food truck / cart": "Food truck, lonchera o carrito",
  [BAR_TYPE]: "Bar / cantina / cervecería",
  "Mexican restaurant": "Restaurante mexicano",
};
export const typeLabelEs = (value: string) => TYPE_ES[value] ?? value;
const MONTHS_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const emailOk = (v: string) => isEmail(v.trim());
const phoneOk = (v: string) => isValidPhoneNumber(v.trim(), "US");

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
}

export default function SpanishRestaurantForm({ source, pageType }: { source: string; pageType?: RestaurantPageType }) {
  const [f, setF] = useState({ company: "", name: "", email: "", phone: "", zip: "", type: pageTypeChoice(pageType), otherType: "", renewal: "" });
  const [typeTouched, setTypeTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "referred">("idle");
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    captureAttribution();
  }, []);
  const pageLabel = pageType ? pageTypeChoice(pageType) : undefined;
  const details = useCallback(
    (stated: string | undefined) => [...detailsFor(f, stated, pageLabel), { ...PREFERRED_LANGUAGE }],
    [f, pageLabel],
  );

  // Same funnel events as the English short form (Meta custom events + Vercel analytics), once each.
  const fired = useRef<Set<string>>(new Set());
  const track = useCallback(
    (name: string, props?: Record<string, string>) => {
      if (fired.current.has(name)) return;
      fired.current.add(name);
      fbq("trackCustom", name);
      try {
        vaTrack(name, { layout: "seo-short", source, ...(props ?? {}) });
      } catch {
        /* analytics never blocks */
      }
    },
    [source],
  );

  const sentPartial = useRef(false);
  const partialInFlight = useRef(false);
  const capturePartial = useCallback(() => {
    if (sentPartial.current || partialInFlight.current || status !== "idle") return;
    const email = f.email.trim().toLowerCase();
    const phone = f.phone.trim();
    const validEmail = emailOk(email) ? email : undefined;
    if (!validEmail && !phone) return;
    const stated = typeTouched ? statedType(f.type, f.otherType) : "";
    const body = JSON.stringify({
      name: f.name.trim() || undefined,
      email: validEmail,
      phone: phone || undefined,
      zip: f.zip.trim() || undefined,
      company: f.company.trim() || undefined,
      ...(stated ? { businessType: stated } : {}),
      source,
      partial: true,
      final: true,
      details: details(stated || undefined),
    });
    try {
      const accepted = navigator.sendBeacon("/api/intake", new Blob([body], { type: "application/json" }));
      if (!accepted) throw new Error("beacon refused");
      sentPartial.current = true;
    } catch {
      partialInFlight.current = true;
      fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true })
        .then((response) => {
          if (response.ok) sentPartial.current = true;
        })
        .catch(() => {})
        .finally(() => {
          partialInFlight.current = false;
        });
    }
  }, [details, f, source, status, typeTouched]);

  const abandon = useCallback(() => {
    if (status !== "idle" || !fired.current.has("FormStart") || fired.current.has("RestFormAbandon")) return;
    track("RestFormAbandon", { milestone: fired.current.has("ContactDone") ? "contact" : "start" });
  }, [status, track]);

  // Client-side navigation (a Next <Link>) unmounts the form without pagehide: capture then too.
  const onLeave = useRef(() => {});
  useEffect(() => {
    onLeave.current = () => {
      capturePartial();
      abandon();
    };
  }, [capturePartial, abandon]);
  useEffect(() => () => onLeave.current(), []);

  useEffect(() => {
    const onHide = () => {
      capturePartial();
      abandon();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    const timer = setTimeout(capturePartial, 120_000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [capturePartial, abandon]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    track("FormStart");
    if (k === "type") setTypeTouched(true);
    const next = { ...f, [k]: e.target.value };
    if (next.name.trim() && emailOk(next.email) && phoneOk(next.phone)) track("ContactDone");
    setF(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const email = f.email.trim().toLowerCase();
    const stated = statedType(f.type, f.otherType);
    if (!f.company.trim()) return setErr("Escriba el nombre de su negocio.");
    if (!stated) return setErr(f.type === SOMETHING_ELSE ? "Cuéntenos qué tipo de restaurante tiene." : "Elija su tipo de restaurante.");
    if (!f.name.trim()) return setErr("Escriba su nombre.");
    if (!emailOk(email)) return setErr("Escriba un correo electrónico válido para mandarle su cotización.");
    if (!phoneOk(f.phone)) return setErr("Escriba un número de teléfono válido para que podamos llamarle.");
    const capiEventName = capiEventFor(stated, "restaurant");
    const eventId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setErr(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(),
          email,
          phone: f.phone.trim(),
          zip: f.zip.trim() || undefined,
          company: f.company.trim(),
          businessType: stated,
          source,
          details: details(stated),
          eventId,
          capiEventName,
        }),
        keepalive: true,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || (result.crm !== "sent" && result.notification !== "sent")) throw new Error("intake_not_accepted");
      if (capiEventName === "Lead") {
        fbq("track", "Lead", {}, { eventID: eventId });
        fbq("trackCustom", "RestaurantQuoteSubmit");
      } else {
        fbq("trackCustom", capiEventName, {}, { eventID: eventId });
      }
      try {
        vaTrack("RestShortSubmit", { source, outcome: capiEventName });
      } catch {
        /* analytics never blocks */
      }
      setStatus(capiEventName === "RestaurantDisqualified" ? "referred" : "done");
    } catch {
      fbq("trackCustom", "SubmitError");
      setStatus("idle");
      setErr(`No pudimos guardar su solicitud. Intente de nuevo o llámenos al ${PHONE_DISPLAY}.`);
    }
  };

  if (status === "done" || status === "referred") {
    return (
      <div lang="es" className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="mb-1.5 text-lg font-extrabold text-[#131517]">{status === "done" ? "¡Listo! Ya estamos trabajando en su cotización." : "Gracias por escribirnos."}</p>
        <p className="text-sm text-[#6B6D71]">
          {status === "done"
            ? "Un agente con licencia se va a comunicar con usted en español para su cotización y los pocos datos que todavía nos faltan. "
            : "Este riesgo nos va a tomar un poco más de tiempo para conseguirle la mejor cotización posible. Nos vamos a comunicar con usted. "}
          ¿Prefiere hablar ahora? Llame al{" "}
          <a href={`tel:${PHONE_E164}`} className="font-semibold text-[#2040E7]">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-[16px] text-[#131517] placeholder-[#6B6D71] focus:border-[#2040E7] focus:outline-none focus:ring-1 focus:ring-[#2040E7]";
  return (
    <form lang="es" onSubmit={submit} className="mx-auto max-w-2xl space-y-3 rounded-xl border border-slate-200 bg-white p-5 sm:p-6" noValidate>
      <input className={field} placeholder="Nombre del negocio" aria-label="Nombre del negocio" value={f.company} onChange={set("company")} autoComplete="organization" />
      <label className="block text-sm text-[#27455C]">
        Tipo de restaurante
        <select className={`${field} mt-1`} value={f.type} onChange={set("type")}>
          <option value="" disabled>
            Elija su tipo de restaurante
          </option>
          {restaurantTypeOptions(pageType).map((t) => (
            <option key={t} value={t}>
              {typeLabelEs(t)}
            </option>
          ))}
          <option value={SOMETHING_ELSE}>Otro tipo</option>
        </select>
      </label>
      {f.type === SOMETHING_ELSE && (
        <input className={field} placeholder="Describa su restaurante" aria-label="Describa su restaurante" value={f.otherType} onChange={set("otherType")} maxLength={200} />
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={field} placeholder="Su nombre" aria-label="Su nombre" value={f.name} onChange={set("name")} autoComplete="name" />
        <input className={field} placeholder="Código postal" aria-label="Código postal" value={f.zip} onChange={set("zip")} inputMode="numeric" autoComplete="postal-code" maxLength={10} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={field} placeholder="Correo electrónico" aria-label="Correo electrónico" value={f.email} onChange={set("email")} type="email" autoComplete="email" />
        <input className={field} placeholder="Teléfono" aria-label="Teléfono" value={f.phone} onChange={set("phone")} type="tel" autoComplete="tel" />
      </div>
      <label className="block text-sm text-[#27455C]">
        ¿Cuándo se renueva su póliza actual? (opcional)
        <select className={`${field} mt-1`} value={f.renewal} onChange={set("renewal")}>
          <option value="">Elija un mes</option>
          {RENEWAL_MONTHS.map((m, i) => (
            <option key={m} value={m}>
              {MONTHS_ES[i]}
            </option>
          ))}
        </select>
      </label>
      {err && (
        <p role="alert" className="text-sm text-red-600">
          {err}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-[#2040E7] py-3 text-base font-bold text-white transition-colors hover:bg-[#1A33B9] disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Quiero mi cotización"}
      </button>
      <p className="text-center text-xs text-[#6B6D71]">Un agente con licencia le da seguimiento para pedirle sus ventas y los demás datos. Sin compromiso de compra.</p>
      <p className="text-xs leading-relaxed text-[#6B6D71]">
        Los datos de contacto que escriba se pueden guardar antes de enviar el formulario, para ayudarle a recuperar una solicitud sin terminar.{" "}
        <a href="/privacy" className="underline" hrefLang="en">
          Política de privacidad (en inglés)
        </a>
      </p>
    </form>
  );
}
