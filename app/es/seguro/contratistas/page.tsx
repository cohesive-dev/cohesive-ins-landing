import Link from "next/link";
import { Suspense } from "react";
import SpanishShell from "@/components/es/SpanishShell";
import SpanishContractorForm from "@/components/es/SpanishContractorForm";
import { esMetadata } from "@/components/es/EsTradeRoute";
import { ES_CONTRACTOR_HUB, ES_CONTRACTOR_PAGES, ES_RESTAURANT_PAGES } from "@/lib/es/pages";
import { ES_COVERAGES, ES_SPANISH_SECTION, ES_SUBS_SECTION } from "@/lib/es/contractor-content";
import { organizationJsonLd, PHONE_DISPLAY, PHONE_E164 } from "@/lib/entity";

// Spanish contractor hub (Kevin 2026-10-22). No single English equivalent, so no hreflang pair; the language
// switch goes to the English insurance guides.
export const metadata = esMetadata(
  ES_CONTRACTOR_HUB.path,
  "Seguro para contratistas en español | Cohesive",
  "Seguro de responsabilidad general para techadores, contratistas generales y remodelación. Cotizamos con varias aseguradoras y le contestamos en español.",
  "Seguro para contratistas, en español",
);

// Card copy per registry page; href and name come from ES_CONTRACTOR_PAGES (lib/es/pages.ts).
const CARD_TEXT: Record<string, string> = {
  "/es/seguro/techadores": "A un techador con unos $475,000 de ingresos al año, la cotización de responsabilidad general le salió en $1,795 al año.",
  "/es/seguro/contratistas-generales": "Subcontratistas, certificados de seguro y asegurado adicional: lo que cuenta en su póliza.",
  "/es/seguro/remodelacion": "Cocinas, baños y renovaciones, también en casas habitadas.",
};
const TRADES = ES_CONTRACTOR_PAGES.map((p) => ({ href: p.path, name: p.name, text: CARD_TEXT[p.path] ?? "" }));

const h2 = "mb-4 text-2xl font-extrabold text-[#131517] lg:text-3xl";
const body = "text-[15px] leading-relaxed text-[#27455C]";

export default function Page() {
  return (
    <SpanishShell englishHref="/insurance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd("United States")) }} />
      <main>
        <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-9">
            <p className="mb-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#2040E7]">
              Hablamos español
            </p>
            <h1 className="mb-3 max-w-3xl text-2xl font-extrabold leading-tight text-[#131517] lg:text-4xl">Seguro para contratistas, en español</h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#27455C]">
              Cotizamos su seguro de responsabilidad general con varias aseguradoras y le explicamos todo en español: qué cubre, qué le
              piden sus clientes y qué mueve su precio.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#cotizacion" className="inline-block rounded-md bg-[#2040E7] px-6 py-3 text-center text-base font-bold text-white hover:bg-[#1A33B9]">
                Quiero mi cotización
              </a>
              <p className="text-sm text-[#6B6D71]">
                ¿Prefiere hablar? Llame al{" "}
                <a href={`tel:${PHONE_E164}`} className="font-semibold text-[#2040E7]">
                  {PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <h2 className={h2}>Elija su oficio</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {TRADES.map((t) => (
              <Link key={t.href} href={t.href} className="block rounded-xl border border-slate-200 p-5 hover:border-[#2040E7]">
                <h3 className="mb-1 font-bold text-[#2040E7] underline">{t.name}</h3>
                <p className={body}>{t.text}</p>
              </Link>
            ))}
          </div>
          <p className={`mt-4 ${body}`}>
            ¿Tiene un restaurante?{" "}
            <Link href={ES_RESTAURANT_PAGES[0].path} className="text-[#2040E7] underline">
              {ES_RESTAURANT_PAGES[0].name}
            </Link>
          </p>
        </section>

        <section id="cotizacion" className="scroll-mt-4 bg-[#F7F9FF] py-8 lg:py-12">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="mb-2 text-2xl font-extrabold text-[#131517] lg:text-3xl">Pida su cotización</h2>
            <p className="mb-5 text-[#27455C]">Son unas cuantas preguntas sobre su negocio. Con eso cotizamos con varias aseguradoras y le contestamos en español.</p>
            <Suspense fallback={<p>Cargando el formulario…</p>}>
              <SpanishContractorForm advertisedIndustry="Contractor" cellIndustry="contractor" />
            </Suspense>
          </div>
        </section>

        {[ES_SPANISH_SECTION, ES_SUBS_SECTION].map((s) => (
          <section key={s.heading} className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:pt-12">
            <h2 className={h2}>{s.heading}</h2>
            <div className={`max-w-3xl space-y-3 ${body}`}>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <h2 className={h2}>La cobertura que piden sus clientes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {ES_COVERAGES.map((c) => (
              <div key={c.name} className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-1 font-bold text-[#131517]">{c.name}</h3>
                <p className={body}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </SpanishShell>
  );
}
