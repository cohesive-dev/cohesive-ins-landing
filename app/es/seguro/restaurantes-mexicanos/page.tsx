import SpanishTradePage, { type EsCard, type EsFaq, type EsPrice } from "@/components/es/SpanishTradePage";
import SpanishRestaurantForm from "@/components/es/SpanishRestaurantForm";
import { esMetadata, esRelated } from "@/components/es/EsTradeRoute";

// Spanish Mexican-restaurant page (Kevin 2026-10-22). Copy translated from /insurance/mexican-restaurant's own
// claims. Prices: ONLY the three bound policies Kevin approved for this page, worded "un restaurante que
// aseguramos paga ...", no state names. The form is the restaurant short form's contract in Spanish.
const PATH = "/es/seguro/restaurantes-mexicanos";
const ENGLISH_PATH = "/insurance/mexican-restaurant";

export const metadata = esMetadata(
  PATH,
  "Seguro para restaurantes mexicanos en español | Cohesive",
  "Responsabilidad general, propiedad y alcohol para taquerías y restaurantes mexicanos. Un restaurante que aseguramos paga $2,932 al año. Hablamos español.",
  "Seguro para restaurantes mexicanos, en español",
);

const PRICES: EsPrice[] = [
  { price: "$2,932 al año", who: "Responsabilidad general", detail: "Un restaurante de barbacoa (BBQ) que aseguramos paga $2,932 al año." },
  { price: "$3,320 al año", who: "Responsabilidad general y propiedad", detail: "Un restaurante de comida soul food que aseguramos paga $3,320 al año." },
  { price: "$5,052 al año", who: "Responsabilidad general y propiedad", detail: "Un restaurante buffet que aseguramos paga $5,052 al año." },
];

const COVERAGES: EsCard[] = [
  {
    name: "Responsabilidad general",
    text: "Lesiones de clientes, enfermedades por alimentos, alergias, accidentes en el local, entregas y banquetes (catering), revisado contra lo que usted de verdad hace.",
  },
  {
    name: "Propiedad e ingresos del negocio",
    text: "Equipo, contenido, inventario, mejoras al local y los ingresos que deja de recibir después de una pérdida cubierta. Compare cómo se valúan sus bienes, los deducibles, la comida que se echa a perder y el tiempo de reparación.",
  },
  {
    name: "Responsabilidad por venta de alcohol (liquor liability)",
    text: "Si sirve cerveza, vino o cocteles, reporte sus ventas de alcohol y su horario, y compare esta cobertura por separado de la responsabilidad general.",
  },
  {
    name: "Planchas, freidoras y asadores",
    text: "Totopos, carnitas y carne asada significan freidoras y fuego directo. Las aseguradoras cobran más por una línea completa de cocina que por un mostrador, y esperan limpieza de campana y ductos según el calendario de la norma NFPA 96 para su volumen de cocina, un sistema de supresión de químico húmedo UL 300 sobre la línea y un extintor Clase K cerca de las freidoras.",
  },
  {
    name: "Barras de salsas y autoservicio",
    text: "Una barra de salsas o complementos de autoservicio agrega riesgo de temperatura y contaminación. La aseguradora pregunta por los protectores (sneeze guards) y las temperaturas de conservación.",
  },
  {
    name: "Auto comercial y póliza paraguas (umbrella)",
    text: "Cada una se cotiza aparte, según su propio riesgo. Un paquete para restaurantes no incluye todas las coberturas automáticamente.",
  },
];

const FAQS: EsFaq[] = [
  {
    q: "¿Cuánto cuesta el seguro para un restaurante mexicano?",
    a: "Depende de su cocina, si vende alcohol, sus ventas, su nómina, su local y sus reclamos. Tres pólizas reales: un restaurante de barbacoa (BBQ) que aseguramos paga $2,932 al año por responsabilidad general; un restaurante de comida soul food que aseguramos paga $3,320 al año por responsabilidad general y propiedad; un restaurante buffet que aseguramos paga $5,052 al año por responsabilidad general y propiedad.",
  },
  {
    q: "¿Servir margaritas cambia mi seguro?",
    a: "Sí. Cuando el alcohol pasa más o menos de un tercio de las ventas, la mayoría de los programas normales para restaurantes se hacen a un lado y se cotiza como un riesgo con más alcohol. Por debajo de eso, la cobertura por venta de alcohol normalmente es un agregado moderado. El tipo de bebidas, el horario, la capacitación de los meseros, el entretenimiento y la ley de su estado también pueden cambiar el precio. Reporte por separado sus ventas de comida y de alcohol.",
  },
  {
    q: "¿Qué información necesito para cotizar?",
    a: "Su póliza actual si la tiene a la mano, su historial de reclamos (loss runs), el menú, la lista de equipo, cómo se dividen sus ventas, la nómina, el horario, cuántas mesas tiene, el tamaño del local, los datos de alcohol y de entregas, el valor de su propiedad, los registros de la campana y del sistema contra incendios, lo que pide su contrato de renta y la fecha en que quiere empezar. Los estimados están bien si dice que son estimados.",
  },
  {
    q: "¿La póliza va a cumplir con lo que pide mi contrato de renta?",
    a: "Normalmente sí, para lo que más se pide: $1,000,000 por evento y $2,000,000 en total (agregado) de responsabilidad general, el arrendador como asegurado adicional y un certificado de seguro. Mándenos la parte de seguros de su contrato junto con su solicitud, para revisar los límites, el texto de asegurado adicional, los daños al local rentado y los límites de alcohol y de la póliza paraguas antes de que contrate.",
  },
  {
    q: "¿Me pueden atender en español?",
    a: "Sí. Hablamos español y le contestamos en español, por teléfono, mensaje de texto o correo. Los documentos de la aseguradora y la póliza se emiten en inglés, y nosotros le explicamos en español lo que dicen antes de que decida.",
  },
];

export default function Page() {
  return (
    <SpanishTradePage
      englishHref={ENGLISH_PATH}
      h1="Seguro para restaurantes mexicanos, en español"
      intro="Cotizamos responsabilidad general y propiedad para su restaurante, y la cobertura por venta de alcohol si vende cerveza, vino o margaritas. Le explicamos todo en español."
      alsoFor="Para taquerías, negocios de burritos, cantinas donde la comida es lo principal y restaurantes de cocina regional mexicana."
      priceHeading="Lo que pagan restaurantes que aseguramos"
      prices={PRICES}
      priceNote="Son pólizas reales que aseguramos, no promedios ni un precio garantizado. No son restaurantes mexicanos, pero le dan una idea. Su precio depende de su cocina, si vende alcohol, sus ventas, su nómina, su local y sus reclamos."
      formIntro="Solo le pedimos lo básico. Un agente le da seguimiento en español para lo demás."
      form={<SpanishRestaurantForm source="seo-es-mexican-restaurant" pageType={{ slug: "mexican-restaurant", noun: "Mexican restaurant" }} />}
      sections={[
        {
          heading: "Cómo se arma la cotización de un restaurante mexicano",
          paragraphs: [
            "Una buena cotización empieza con su operación real: planchas, freidoras, equipo para tortillas, servicio a la mesa o en mostrador, comida para llevar, banquetes, y cerveza, vino o cocteles si los vende.",
            "El equipo de cocina, la campana y el sistema contra incendios, los refrigeradores, las mejoras al local y el inventario de alcohol deben declararse con precisión. Mande su menú y su lista de equipo, y separe sus ventas de comer en el local, para llevar, entregas, banquetes y alcohol.",
          ],
        },
        {
          heading: "Margaritas y venta de alcohol",
          paragraphs: [
            "El porcentaje de sus ventas que viene del alcohol mueve el precio más que casi cualquier otra cosa. Una cantina con 40% de alcohol se cotiza como bar; un restaurante familiar con 10% no.",
          ],
        },
        {
          heading: "Hablamos español",
          paragraphs: [
            "Le contestamos en español, desde la cotización hasta el certificado de seguro que le pide su arrendador. Puede llamarnos, mandarnos un mensaje de texto o escribirnos por correo.",
            "Un dato importante: las aseguradoras emiten los documentos y la póliza en inglés. Nosotros le explicamos en español qué cubre, qué no cubre y qué le están pidiendo, antes de que usted decida.",
          ],
        },
      ]}
      factors={[
        "Sus ventas al año, su nómina, cuántas mesas tiene, el tamaño del local, su horario, sus años en el negocio y sus reclamos",
        "Su menú, el equipo de cocina, el combustible, la campana y el sistema contra incendios, la limpieza y las inspecciones",
        "Planchas, freidoras y equipo para hacer tortillas",
        "Servicio en mostrador o servicio completo a la mesa",
        "El porcentaje de alcohol, si sirve margaritas y si abre hasta tarde",
        "El valor del edificio o de las mejoras al local, los refrigeradores, el equipo, la comida que se puede echar a perder y el deducible que pida",
      ]}
      coveragesHeading="Las coberturas de un restaurante mexicano"
      coverages={COVERAGES}
      faqs={FAQS}
      related={esRelated(PATH)}
    />
  );
}
