// Spanish contractor page copy (Kevin 2026-10-22). Translated from the English trade pages' own claims
// (/insurance/roofer, /insurance/general-contractor, /insurance/remodeler and the site's subcontractor-audit
// wording), never new facts. Prices: only the two verified roofer QUOTES, each beside its revenue. The GC and
// remodeling pages publish no price: the English pages' bound figures carry no revenue, and a price without
// revenue is not allowed on the Spanish pages.
import type { EsCard, EsFaq, EsPrice, EsSection } from "@/components/es/SpanishTradePage";

export const ES_SPANISH_SECTION: EsSection = {
  heading: "Hablamos español",
  paragraphs: [
    "Nuestro equipo le contesta en español, desde la cotización hasta los certificados para sus clientes. Puede llamarnos, mandarnos un mensaje de texto o escribirnos por correo.",
    "Un dato importante: las aseguradoras emiten los documentos y la póliza en inglés. Nosotros le explicamos en español qué cubre, qué no cubre y qué le están pidiendo, antes de que usted decida.",
  ],
};

export const ES_SUBS_SECTION: EsSection = {
  heading: "Subcontratistas: lo que cuenta en su póliza",
  paragraphs: [
    "Al final del periodo, la aseguradora normalmente hace una auditoría de su nómina real y de lo que pagó a subcontratistas.",
    "En esa auditoría, muchas aseguradoras cobran lo que pagó a un subcontratista sin seguro como si fuera su propia nómina, en la compensación al trabajador y muchas veces también en la responsabilidad general. Un solo subcontratista sin seguro puede subirle la prima cuando ya terminó el año.",
    "Por eso conviene pedirle a cada subcontratista su certificado de seguro (COI) antes de que empiece y guardarlo.",
  ],
};

const COVERAGE_GL: EsCard = {
  name: "Responsabilidad general (general liability)",
  text: "Le cubre si daña la propiedad de un cliente o si alguien se lastima en la obra. Los contratistas generales (GC), los administradores de propiedades y las oficinas de permisos casi siempre la piden, normalmente con límites de $1M/$2M y con ellos como asegurado adicional.",
};
const COVERAGE_TOOLS: EsCard = {
  name: "Herramientas y equipo",
  text: "Cubre sus herramientas si se las roban o se dañan, en la obra o en la troca. Cuesta poco agregarla y es la pérdida más común en los oficios.",
};
const COVERAGE_WC: EsCard = {
  name: "Compensación al trabajador (workers' comp)",
  text: "Es obligatoria en casi todos los estados en cuanto tiene empleados, y muchos GC la piden incluso a sus subcontratistas. Se calcula sobre la nómina y suele ser lo más caro cuando ya tiene cuadrilla.",
};
const COVERAGE_AUTO: EsCard = {
  name: "Auto comercial",
  text: "Cubre su troca o camioneta de trabajo. El seguro de su auto personal no paga un reclamo si estaba trabajando.",
};
const COVERAGE_AI: EsCard = {
  name: "Asegurado adicional y renuncia de subrogación",
  text: "Son los endosos que piden los GC y los administradores de propiedades antes de que empiece a trabajar. Los ponemos en su certificado de seguro (COI) el mismo día que contrata la póliza.",
};
export const ES_COVERAGES: EsCard[] = [COVERAGE_GL, COVERAGE_TOOLS, COVERAGE_WC, COVERAGE_AUTO, COVERAGE_AI];

const FACTORS_HEAD = [
  "Si solo necesita responsabilidad general o también quiere cubrir herramientas y la troca de trabajo",
  "Su nómina y cuántos empleados tiene (la compensación al trabajador suele ser lo más caro)",
];
const FACTOR_STATE = "Su estado y sus reglas de licencias y fianzas";

const faqGc: EsFaq = {
  q: "¿Qué seguro me pide un contratista general (GC)?",
  a: "Casi siempre una póliza de responsabilidad general de $1M/$2M con el GC como asegurado adicional, compensación al trabajador si tiene cuadrilla y muchas veces una renuncia de subrogación. Si la póliza incluye asegurado adicional general (blanket additional insured), podemos sacar esos certificados el mismo día.",
};
const faqLaw = (who: string): EsFaq => ({
  q: `¿Necesito seguro por ley como ${who}?`,
  a: "En cuanto tiene empleados, la compensación al trabajador es obligatoria en casi todos los estados. Muchos estados y ciudades tampoco le otorgan ni le renuevan la licencia de contratista ni el permiso sin comprobante de responsabilidad general, y a veces piden una fianza. Y aunque la ley no lo pida, ningún GC ni administrador de propiedades lo va a dejar entrar a la obra sin seguro.",
});
const faqFastStandard: EsFaq = {
  q: "¿Qué tan rápido me pueden asegurar y darme el certificado (COI)?",
  a: "La mayoría de los oficios se pueden asegurar el mismo día, y le mandamos el certificado (COI) en cuanto contrata la póliza. Muchas veces es el mismo día que el GC o el administrador se lo pide.",
};
const faqSpanish: EsFaq = {
  q: "¿Me pueden atender en español?",
  a: "Sí. Hablamos español y le contestamos en español, por teléfono, mensaje de texto o correo. Los documentos de la aseguradora y la póliza se emiten en inglés, y nosotros le explicamos en español lo que dicen antes de que decida.",
};

export type EsTradeContent = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  h1: string;
  intro: string;
  alsoFor?: string;
  priceHeading: string;
  prices?: EsPrice[];
  priceNote: string;
  formIntro: string;
  form: { advertisedIndustry: string; cellIndustry: string; tradeFirst: string };
  sections: EsSection[];
  factors: string[];
  coveragesHeading: string;
  coverages: EsCard[];
  faqs: EsFaq[];
};

export const ES_ROOFER: EsTradeContent = {
  path: "/es/seguro/techadores",
  metaTitle: "Seguro para techadores en español: cotizaciones reales | Cohesive",
  metaDescription:
    "Techador con unos $475,000 de ingresos al año: su cotización de responsabilidad general le salió en $1,795 al año. Hablamos español. Pida su cotización.",
  ogTitle: "Seguro para techadores: cotizaciones reales, en español",
  h1: "Seguro para techadores: cotizaciones reales, en español",
  intro:
    "Cotizamos su seguro de responsabilidad general con varias aseguradoras y le explicamos todo en español. Llene el formulario en unos minutos y le mandamos su cotización.",
  priceHeading: "Cuánto les salió a otros techadores",
  prices: [
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
  ],
  priceNote:
    "Son cotizaciones reales que sacamos para techadores, no pólizas contratadas ni un precio garantizado. Su precio depende de su trabajo, sus ingresos, su nómina, sus subcontratistas y sus reclamos.",
  formIntro: "Son unas cuantas preguntas sobre su negocio. Con eso cotizamos con varias aseguradoras y le contestamos en español.",
  form: { advertisedIndustry: "Roofing", cellIndustry: "roof", tradeFirst: "Roofing" },
  sections: [ES_SPANISH_SECTION],
  factors: [
    "Si solo necesita responsabilidad general o también quiere cubrir herramientas y la troca de trabajo",
    "Su nómina y cuántos empleados tiene (la compensación al trabajador suele ser lo más caro)",
    "Sus ingresos al año y cuánto paga a subcontratistas",
    "Sus reclamos de los últimos 3 a 5 años",
    "La altura y la inclinación de los techos, y cuánto trabajo hace con soplete (torch-down) o calor",
    "Si trabaja en casas o en edificios comerciales, y cómo protege a su gente contra caídas",
    FACTOR_STATE,
  ],
  coveragesHeading: "La cobertura que necesita un techador",
  coverages: ES_COVERAGES,
  faqs: [
    {
      q: "¿Cuánto cuesta el seguro para techadores?",
      a: "Depende del trabajo que hace, sus ingresos, su nómina, sus subcontratistas y sus reclamos. Dos ejemplos reales de responsabilidad general: a un techador con unos $475,000 de ingresos al año, $150,000 en subcontratistas y un empleado W2 la cotización le salió en $1,795 al año; a una compañía de techos con unos $1.3 millones de ingresos y $800,000 subcontratados le salió en $7,497 al año. Son cotizaciones, no un precio garantizado.",
    },
    faqGc,
    faqLaw("techador"),
    {
      q: "¿Qué tan rápido me pueden asegurar y darme el certificado (COI)?",
      a: "Los techos son un oficio de más riesgo y se cotizan en un mercado especializado, así que cuente con uno o dos días hábiles. Una vez que están listos los términos, normalmente sacamos el certificado rápido.",
    },
    faqSpanish,
  ],
};

export const ES_GENERAL_CONTRACTOR: EsTradeContent = {
  path: "/es/seguro/contratistas-generales",
  metaTitle: "Seguro para contratistas generales en español | Cohesive",
  metaDescription:
    "Seguro de responsabilidad general para contratistas generales (GC): subcontratistas, certificados y asegurado adicional, en español. Pida su cotización.",
  ogTitle: "Seguro para contratistas generales, en español",
  h1: "Seguro para contratistas generales (GC), en español",
  intro:
    "Cotizamos su responsabilidad general con varias aseguradoras, revisamos cómo cuentan sus subcontratistas y le explicamos todo en español.",
  alsoFor: "También para administradores de obra, constructores y empresas de diseño y construcción.",
  priceHeading: "Cuánto cuesta el seguro para un contratista general",
  priceNote:
    "Depende sobre todo de sus ventas, su nómina, cuánto subcontrata, si sus subcontratistas tienen seguro, el tipo de obra que hace y sus reclamos. Muchos contratistas generales que reciben una cotización alta no están pagando por su riesgo real, sino por cómo los clasificaron. Su nómina, el trabajo que de verdad hace y sus reclamos mueven el precio mucho más que su código postal. Llene el formulario y le mostramos lo que ofrece cada aseguradora.",
  formIntro: "Son unas cuantas preguntas sobre su negocio, incluido cuánto paga a subcontratistas. Con eso cotizamos y le contestamos en español.",
  form: { advertisedIndustry: "General contractor", cellIndustry: "gc", tradeFirst: "General contractor" },
  sections: [ES_SUBS_SECTION, ES_SPANISH_SECTION],
  factors: [
    ...FACTORS_HEAD,
    "Sus ventas al año",
    "Sus reclamos de los últimos 3 a 5 años",
    "Cuánto trabajo subcontrata y si sus subcontratistas tienen su propio seguro",
    "Si usted saca los permisos y queda como el contratista responsable de la obra",
    FACTOR_STATE,
  ],
  coveragesHeading: "La cobertura que necesita un contratista general",
  coverages: ES_COVERAGES,
  faqs: [
    {
      q: "¿Cuánto cuesta el seguro para un contratista general?",
      a: "No hay un precio único. Su prima normalmente sube con sus ventas, su nómina, el tipo de obra y sus reclamos, y también con lo que paga a subcontratistas sin seguro. Le cotizamos con varias aseguradoras y le mostramos las ofertas reales.",
    },
    {
      q: "¿Mis subcontratistas cuentan en mi seguro?",
      a: "Sí, pueden contar. En la auditoría al final del periodo, muchas aseguradoras cobran lo que pagó a un subcontratista sin seguro como si fuera su propia nómina, en la compensación al trabajador y muchas veces en la responsabilidad general. Pida el certificado de seguro (COI) de cada subcontratista antes de que empiece.",
    },
    faqGc,
    faqLaw("contratista general"),
    faqFastStandard,
    faqSpanish,
  ],
};

export const ES_REMODELER: EsTradeContent = {
  path: "/es/seguro/remodelacion",
  metaTitle: "Seguro para contratistas de remodelación en español | Cohesive",
  metaDescription:
    "Seguro de responsabilidad general para remodelación: cocinas, baños y renovaciones en casas habitadas. Hablamos español. Pida su cotización.",
  ogTitle: "Seguro para contratistas de remodelación, en español",
  h1: "Seguro para contratistas de remodelación, en español",
  intro:
    "Cotizamos su responsabilidad general con varias aseguradoras según el trabajo que de verdad hace, y le explicamos todo en español.",
  alsoFor: "También para remodelación de cocinas y baños, renovaciones y acabados de interiores (build-outs).",
  priceHeading: "Cuánto cuesta el seguro de remodelación",
  priceNote:
    "Depende de sus ventas, su nómina, el tipo de trabajo (no es lo mismo pintar y cambiar pisos que tumbar muros de carga o hacer ampliaciones), sus subcontratistas y sus reclamos. Muchos contratistas de remodelación que reciben una cotización alta están pagando por cómo los clasificaron, no por su riesgo real. Llene el formulario y le mostramos lo que ofrece cada aseguradora.",
  formIntro: "Son unas cuantas preguntas sobre su negocio y sus otros oficios. Con eso cotizamos y le contestamos en español.",
  form: { advertisedIndustry: "Remodeling", cellIndustry: "remodel", tradeFirst: "Remodeling / renovations" },
  sections: [
    {
      heading: "Qué decirle a la aseguradora sobre una casa habitada",
      paragraphs: [
        "Separe el trabajo cosmético de la demolición, los cambios en muros de carga, las ampliaciones y los cimientos.",
        "Diga si la casa sigue habitada, qué áreas se siguen usando, si va a cerrar el agua, si deja aberturas temporales, si corta concreto y si el trabajo va a alterar materiales viejos.",
        "Dé por separado sus ventas, su nómina W2 y lo que paga a subcontratistas. Y pregunte cómo trata la propuesta el daño a la parte en la que está trabajando, el daño que resulte en otras partes de la casa y los reclamos por polvo o contaminación. Decir solo \"remodelación\" no contesta esas preguntas.",
      ],
    },
    ES_SUBS_SECTION,
    ES_SPANISH_SECTION,
  ],
  factors: [
    ...FACTORS_HEAD,
    "Sus ventas al año",
    "Sus reclamos de los últimos 3 a 5 años",
    "Si sus trabajos incluyen cambios estructurales o ampliaciones",
    "Si usa subcontratistas",
    FACTOR_STATE,
  ],
  coveragesHeading: "La cobertura que necesita un contratista de remodelación",
  coverages: ES_COVERAGES,
  faqs: [
    {
      q: "¿Cuánto cuesta el seguro para un contratista de remodelación?",
      a: "No hay un precio único. Su prima normalmente sube con sus ventas, su nómina, el tipo de trabajo y sus reclamos. Le cotizamos con varias aseguradoras y le mostramos las ofertas reales.",
    },
    faqGc,
    faqLaw("contratista de remodelación"),
    faqFastStandard,
    faqSpanish,
  ],
};

export const ES_TRADE_CONTENT: EsTradeContent[] = [ES_ROOFER, ES_GENERAL_CONTRACTOR, ES_REMODELER];
