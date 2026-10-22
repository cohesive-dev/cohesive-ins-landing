import type { Metadata } from "next";
import { Suspense } from "react";
import SpanishShell from "@/components/es/SpanishShell";
import SpanishContractorForm from "@/components/es/SpanishContractorForm";
import { organizationJsonLd, PHONE_DISPLAY, PHONE_E164 } from "@/lib/entity";

// Spanish roofer landing page (Kevin 2026-10-22: "Try Mexican restaurants and contractors sure ... Let's try SEO").
// Target of the Spanish Meta roofer ad and the Spanish roofer SEO page. English equivalent: /insurance/roofer.
// Prices are QUOTES (never "we insure"), each beside its revenue; no carrier names, no testimonials, no license numbers.
const PATH = "/es/seguro/techadores";
const ENGLISH_PATH = "/insurance/roofer";

export const metadata: Metadata = {
  title: "Seguro para techadores en español: cotizaciones reales | Cohesive",
  description:
    "Techador con unos $475,000 de ingresos al año: su cotización de responsabilidad general le salió en $1,795 al año. Hablamos español. Pida su cotización.",
  alternates: {
    canonical: PATH,
    languages: { "es-US": PATH, "en-US": ENGLISH_PATH, "x-default": ENGLISH_PATH },
  },
  openGraph: {
    type: "website",
    locale: "es_US",
    siteName: "Cohesive Insurance",
    url: PATH,
    title: "Seguro para techadores: cotizaciones reales, en español",
    description: "Responsabilidad general para techadores. Cotizamos con varias aseguradoras y le contestamos en español.",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Cohesive Insurance" }],
  },
};

const PRICES = [
  {
    price: "$1,795 al año",
    who: "Techador con unos $475,000 de ingresos al año",
    detail: "$150,000 pagados a subcontratistas y un empleado W2. Cotización de responsabilidad general.",
  },
  {
    price: "$7,497 al año",
    who: "Compañía de techos con unos $1.3 millones de ingresos al año",
    detail: "$800,000 de su trabajo subcontratado. Cotización de responsabilidad general.",
  },
];

const PRICE_FACTORS = [
  "Si solo necesita responsabilidad general o también quiere cubrir herramientas y la troca de trabajo",
  "Su nómina y cuántos empleados tiene (la compensación al trabajador suele ser lo más caro)",
  "Sus ingresos al año y cuánto paga a subcontratistas",
  "Sus reclamos de los últimos 3 a 5 años",
  "La altura y la inclinación de los techos, y cuánto trabajo hace con soplete (torch-down) o calor",
  "Si trabaja en casas o en edificios comerciales, y cómo protege a su gente contra caídas",
  "Su estado y sus reglas de licencias y fianzas",
];

const COVERAGES = [
  {
    name: "Responsabilidad general (general liability)",
    text: "Le cubre si daña la propiedad de un cliente o si alguien se lastima en la obra. Los contratistas generales (GC), los administradores de propiedades y las oficinas de permisos casi siempre la piden, normalmente con límites de $1M/$2M y con ellos como asegurado adicional.",
  },
  {
    name: "Herramientas y equipo",
    text: "Cubre sus herramientas si se las roban o se dañan, en la obra o en la troca. Cuesta poco agregarla y es la pérdida más común en los oficios.",
  },
  {
    name: "Compensación al trabajador (workers' comp)",
    text: "Es obligatoria en casi todos los estados en cuanto tiene empleados, y muchos GC la piden incluso a sus subcontratistas. Se calcula sobre la nómina y suele ser lo más caro cuando ya tiene cuadrilla.",
  },
  {
    name: "Auto comercial",
    text: "Cubre su troca o camioneta de trabajo. El seguro de su auto personal no paga un reclamo si estaba trabajando.",
  },
  {
    name: "Asegurado adicional y renuncia de subrogación",
    text: "Son los endosos que piden los GC y los administradores de propiedades antes de que empiece a trabajar. Los ponemos en su certificado de seguro (COI) cuando contrata la póliza.",
  },
];

const FAQS = [
  {
    q: "¿Cuánto cuesta el seguro para techadores?",
    a: "Depende del trabajo que hace, sus ingresos, su nómina, sus subcontratistas y sus reclamos. Dos ejemplos reales de responsabilidad general: a un techador con unos $475,000 de ingresos al año, $150,000 en subcontratistas y un empleado W2 la cotización le salió en $1,795 al año; a una compañía de techos con unos $1.3 millones de ingresos y $800,000 subcontratados le salió en $7,497 al año. Son cotizaciones, no un precio garantizado.",
  },
  {
    q: "¿Qué seguro me pide un contratista general (GC)?",
    a: "Casi siempre una póliza de responsabilidad general de $1M/$2M con el GC como asegurado adicional, compensación al trabajador si tiene cuadrilla y muchas veces una renuncia de subrogación. Si la póliza incluye asegurado adicional general (blanket additional insured), podemos sacar esos certificados el mismo día.",
  },
  {
    q: "¿Necesito seguro por ley como techador?",
    a: "En cuanto tiene empleados, la compensación al trabajador es obligatoria en casi todos los estados. Muchos estados y ciudades tampoco le otorgan ni le renuevan la licencia de contratista ni el permiso sin comprobante de responsabilidad general, y a veces piden una fianza. Y aunque la ley no lo pida, ningún GC ni administrador de propiedades lo va a dejar entrar a la obra sin seguro.",
  },
  {
    q: "¿Qué tan rápido me pueden asegurar y darme el certificado (COI)?",
    a: "Los techos son un oficio de más riesgo y se cotizan en un mercado especializado, así que cuente con uno o dos días hábiles. Una vez que están listos los términos, normalmente sacamos el certificado rápido.",
  },
  {
    q: "¿Me pueden atender en español?",
    a: "Sí. Hablamos español y le contestamos en español, por teléfono, mensaje de texto o correo. Los documentos de la aseguradora y la póliza se emiten en inglés, y nosotros le explicamos en español lo que dicen antes de que decida.",
  },
];

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-US",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <SpanishShell englishHref={ENGLISH_PATH}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd("United States")) }} />
      <main>
        <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-9">
            <p className="mb-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#2040E7]">
              Hablamos español
            </p>
            <h1 className="mb-3 max-w-3xl text-2xl font-extrabold leading-tight text-[#131517] lg:text-4xl">
              Seguro para techadores: cotizaciones reales, en español
            </h1>
            <p className="mb-4 max-w-2xl text-base leading-relaxed text-[#27455C]">
              Cotizamos su seguro de responsabilidad general con varias aseguradoras y le explicamos todo en español. Llene el
              formulario en unos minutos y le mandamos su cotización.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
          <h2 className="mb-4 text-2xl font-extrabold text-[#131517] lg:text-3xl">Cuánto les salió a otros techadores</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PRICES.map((p) => (
              <div key={p.price} className="rounded-xl border border-slate-200 p-5">
                <p className="text-3xl font-extrabold text-[#131517]">{p.price}</p>
                <p className="mt-2 font-semibold text-[#131517]">{p.who}</p>
                <p className="mt-1 text-sm text-[#27455C]">{p.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-sm text-[#6B6D71]">
            Son cotizaciones reales que sacamos para techadores, no pólizas contratadas ni un precio garantizado. Su precio
            depende de su trabajo, sus ingresos, su nómina, sus subcontratistas y sus reclamos.
          </p>
        </section>

        <section id="cotizacion" className="scroll-mt-4 bg-[#F7F9FF] py-8 lg:py-12">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="mb-2 text-2xl font-extrabold text-[#131517] lg:text-3xl">Pida su cotización</h2>
            <p className="mb-5 text-[#27455C]">
              Son unas cuantas preguntas sobre su negocio. Con eso cotizamos con varias aseguradoras y le contestamos en español.
            </p>
            <Suspense fallback={<p>Cargando el formulario…</p>}>
              <SpanishContractorForm advertisedIndustry="Roofing" cellIndustry="roof" tradeFirst="Roofing" />
            </Suspense>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <h2 className="mb-4 text-2xl font-extrabold text-[#131517] lg:text-3xl">Hablamos español</h2>
          <div className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-[#27455C]">
            <p>
              Nuestro equipo le contesta en español, desde la cotización hasta los certificados para sus clientes. Puede
              llamarnos, mandarnos un mensaje de texto o escribirnos por correo.
            </p>
            <p>
              Un dato importante: las aseguradoras emiten los documentos y la póliza en inglés. Nosotros le explicamos en
              español qué cubre, qué no cubre y qué le están pidiendo, antes de que usted decida.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:pb-12">
          <h2 className="mb-4 text-2xl font-extrabold text-[#131517] lg:text-3xl">Qué mueve su precio</h2>
          <ul className="max-w-3xl space-y-2 text-[15px] text-[#27455C]">
            {PRICE_FACTORS.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden="true" className="font-bold text-[#2040E7]">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:pb-12">
          <h2 className="mb-4 text-2xl font-extrabold text-[#131517] lg:text-3xl">La cobertura que necesita un techador</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {COVERAGES.map((c) => (
              <div key={c.name} className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-1 font-bold text-[#131517]">{c.name}</h3>
                <p className="text-[15px] leading-relaxed text-[#27455C]">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="mb-4 text-2xl font-extrabold text-[#131517] lg:text-3xl">Preguntas frecuentes</h2>
          <div className="max-w-3xl space-y-5">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="mb-1 font-bold text-[#131517]">{f.q}</h3>
                <p className="text-[15px] leading-relaxed text-[#27455C]">{f.a}</p>
              </div>
            ))}
          </div>
          <a href="#cotizacion" className="mt-8 inline-block rounded-md bg-[#2040E7] px-6 py-3 text-base font-bold text-white hover:bg-[#1A33B9]">
            Quiero mi cotización
          </a>
        </section>
      </main>
    </SpanishShell>
  );
}
