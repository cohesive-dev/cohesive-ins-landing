import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import SpanishShell from "@/components/es/SpanishShell";
import { organizationJsonLd, PHONE_DISPLAY, PHONE_E164 } from "@/lib/entity";

// Shared layout for the Spanish trade pages (/es/seguro/...). Server component; the only client island is the form.
export type EsPrice = { price: string; who: string; detail: string };
export type EsCard = { name: string; text: string };
export type EsFaq = { q: string; a: string };
export type EsSection = { heading: string; paragraphs: string[] };

const h2 = "mb-4 text-2xl font-extrabold text-[#131517] lg:text-3xl";
const body = "text-[15px] leading-relaxed text-[#27455C]";

export default function SpanishTradePage({
  englishHref,
  h1,
  intro,
  alsoFor,
  priceHeading,
  prices,
  priceNote,
  formHeading = "Pida su cotización",
  formIntro,
  form,
  sections = [],
  factorsHeading = "Qué mueve su precio",
  factors,
  coveragesHeading,
  coverages,
  faqs,
  related,
}: {
  englishHref?: string;
  h1: string;
  intro: string;
  alsoFor?: string;
  priceHeading: string;
  prices?: EsPrice[];
  priceNote: string;
  formHeading?: string;
  formIntro: string;
  form: ReactNode;
  sections?: EsSection[];
  factorsHeading?: string;
  factors: string[];
  coveragesHeading: string;
  coverages: EsCard[];
  faqs: EsFaq[];
  related?: { label: string; href: string }[];
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-US",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <SpanishShell englishHref={englishHref}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd("United States")) }} />
      <main>
        <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-9">
            <p className="mb-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#2040E7]">
              Hablamos español
            </p>
            <h1 className="mb-3 max-w-3xl text-2xl font-extrabold leading-tight text-[#131517] lg:text-4xl">{h1}</h1>
            <p className="mb-2 max-w-2xl text-base leading-relaxed text-[#27455C]">{intro}</p>
            {alsoFor && <p className="mb-4 max-w-2xl text-sm text-[#6B6D71]">{alsoFor}</p>}
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
          <h2 className={h2}>{priceHeading}</h2>
          {prices?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {prices.map((p) => (
                <div key={p.price + p.who} className="rounded-xl border border-slate-200 p-5">
                  <p className="text-3xl font-extrabold text-[#131517]">{p.price}</p>
                  <p className="mt-2 font-semibold text-[#131517]">{p.who}</p>
                  <p className="mt-1 text-sm text-[#27455C]">{p.detail}</p>
                </div>
              ))}
            </div>
          ) : null}
          <p className={`${prices?.length ? "mt-4 text-sm text-[#6B6D71]" : body} max-w-3xl`}>{priceNote}</p>
        </section>

        <section id="cotizacion" className="scroll-mt-4 bg-[#F7F9FF] py-8 lg:py-12">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="mb-2 text-2xl font-extrabold text-[#131517] lg:text-3xl">{formHeading}</h2>
            <p className="mb-5 text-[#27455C]">{formIntro}</p>
            <Suspense fallback={<p>Cargando el formulario…</p>}>{form}</Suspense>
          </div>
        </section>

        {sections.map((s) => (
          <section key={s.heading} className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:pt-12">
            <h2 className={h2}>{s.heading}</h2>
            <div className={`max-w-3xl space-y-3 ${body}`}>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:pt-12">
          <h2 className={h2}>{factorsHeading}</h2>
          <ul className={`max-w-3xl space-y-2 ${body}`}>
            {factors.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden="true" className="font-bold text-[#2040E7]">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:pt-12">
          <h2 className={h2}>{coveragesHeading}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {coverages.map((c) => (
              <div key={c.name} className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-1 font-bold text-[#131517]">{c.name}</h3>
                <p className={body}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <h2 className={h2}>Preguntas frecuentes</h2>
          <div className="max-w-3xl space-y-5">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="mb-1 font-bold text-[#131517]">{f.q}</h3>
                <p className={body}>{f.a}</p>
              </div>
            ))}
          </div>
          <a href="#cotizacion" className="mt-8 inline-block rounded-md bg-[#2040E7] px-6 py-3 text-base font-bold text-white hover:bg-[#1A33B9]">
            Quiero mi cotización
          </a>
        </section>

        {related?.length ? (
          <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <h2 className="mb-3 text-xl font-extrabold text-[#131517]">Más páginas en español</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-[#2040E7] underline">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </SpanishShell>
  );
}
