// Spanish display text for the contractor quote form (Kevin 2026-10-22: "Try Mexican restaurants and contractors
// sure. Our AI can speak spanish and mario/christopher speak spanish natively").
//
// Only what the visitor SEES is Spanish. Every value the form submits stays the English option value from
// lib/contractor-full-options.ts / lib/contractor-trades.ts, and every detail label stays FULL_LABELS, so the
// CRM, quotes@ and the quoting pipeline read a Spanish lead exactly like an English /contractor-test lead.
// The one addition is the formAnswers row PREFERRED_LANGUAGE ("Preferred language": "Spanish").
import { TRADES } from "@/lib/contractor-trades";
import {
  PRIMARY_PCT,
  REVENUE,
  EMPLOYEES,
  PAYROLL,
  USES_SUBCONTRACTORS,
  SUBCONTRACTOR_COSTS,
  STRUCTURE,
  CURRENT_GL,
  CURRENT_PREMIUM,
  type Option,
} from "@/lib/contractor-full-options";

export const PREFERRED_LANGUAGE = { label: "Preferred language", value: "Spanish" } as const;

// English option value -> Spanish label. A value missing here would render in English, never break the form.
const ES: Record<string, string> = {
  // Trades
  "General contractor": "Contratista general",
  "New home construction / builder": "Construcción de casas nuevas / constructor",
  "Remodeling / renovations": "Remodelación / renovaciones",
  Roofing: "Techos (roofing)",
  "HVAC / heating and air conditioning": "HVAC / calefacción y aire acondicionado",
  Plumbing: "Plomería",
  "Fire sprinkler installation": "Instalación de rociadores contra incendios",
  Electrical: "Electricidad",
  Painting: "Pintura",
  "Carpentry / framing": "Carpintería / framing",
  "Masonry / concrete": "Albañilería / concreto",
  "Siding / gutters": "Siding / canaletas",
  "Flooring / tile": "Pisos / loseta y azulejo",
  "Excavation / grading / site work": "Excavación / nivelación de terreno",
  Demolition: "Demolición",
  "Deck construction": "Construcción de decks",
  "Fence installation / repair": "Instalación y reparación de cercas",
  "Paving / asphalt": "Pavimentación / asfalto",
  "Tree service": "Servicio de árboles",
  "Restoration (water / fire damage)": "Restauración (daños por agua o fuego)",
  Waterproofing: "Impermeabilización",
  "Foundation repair / underpinning": "Reparación de cimientos",
  "Pool construction / service": "Construcción o servicio de albercas",
  "Welding / metal fabrication": "Soldadura / fabricación de metal",
  "Other trade": "Otro oficio",
  None: "Ninguno, solo mi oficio principal",
  // Share of work in the primary trade
  "All of it (100%)": "Todo (100%)",
  "75% - 99%": "75% - 99%",
  "50% - 75%": "50% - 75%",
  "Under 50%": "Menos del 50%",
  // Revenue
  "Under $250k": "Menos de $250,000",
  "$250k - $500k": "$250,000 - $500,000",
  "$500k - $1M": "$500,000 - $1 millón",
  "$1M - $2M": "$1 millón - $2 millones",
  "$2M - $4M": "$2 millones - $4 millones",
  "$4M - $8M": "$4 millones - $8 millones",
  "Over $8M": "Más de $8 millones",
  // W2 employees
  "0 - no W2 employees": "0 (no tengo empleados W2)",
  "1 - 5": "1 - 5",
  "6 - 10": "6 - 10",
  "11 - 20": "11 - 20",
  "More than 20": "Más de 20",
  // Payroll / subcontractor bands
  "$0 - $50k": "$0 - $50,000",
  "$50k - $100k": "$50,000 - $100,000",
  "$100k - $250k": "$100,000 - $250,000",
  "$1M+": "Más de $1 millón",
  "Under $25k": "Menos de $25,000",
  "$25k - $50k": "$25,000 - $50,000",
  // Yes / no
  Yes: "Sí",
  No: "No",
  // Business structure
  "Sole proprietor": "Dueño único / trabajo por mi cuenta",
  LLC: "LLC",
  Corporation: "Corporación / Inc.",
  Partnership: "Sociedad (partnership)",
  // Current general liability
  "Yes - renews within 30 days": "Sí, se renueva en los próximos 30 días",
  "Yes - renews later": "Sí, se renueva más adelante",
  "No - need coverage within 30 days": "No, necesito seguro en los próximos 30 días",
  "No - just comparing": "No, solo estoy comparando",
  // Current premium
  "Under $2K": "Menos de $2,000",
  "$2K - $5K": "$2,000 - $5,000",
  "$5K - $20K": "$5,000 - $20,000",
  "$20K+": "Más de $20,000",
  "Not insured yet": "Todavía no tengo seguro",
};

export function esLabel(value: string): string {
  return ES[value] ?? value;
}
const es = (options: Option[]): Option[] => options.map((o) => ({ value: o.value, label: esLabel(o.value) }));

export const ES_TRADES = es(TRADES);
export const ES_OTHER_TRADES: Option[] = [{ value: "None", label: esLabel("None") }, ...ES_TRADES];
export const ES_OPTIONS: Record<string, Option[]> = {
  trade: ES_TRADES,
  primaryPct: es(PRIMARY_PCT),
  revenue: es(REVENUE),
  employees: es(EMPLOYEES),
  payroll: es(PAYROLL),
  usesSubcontractors: es(USES_SUBCONTRACTORS),
  subcontractorCosts: es(SUBCONTRACTOR_COSTS),
  structure: es(STRUCTURE),
  currentGl: es(CURRENT_GL),
  currentPremium: es(CURRENT_PREMIUM),
};

// Visible question text per field key (the submitted label stays FULL_LABELS[key]).
export const ES_FIELD: Record<string, { label: string; hint?: string; placeholder?: string; optional?: boolean }> = {
  email: { label: "Correo electrónico", placeholder: "usted@ejemplo.com" },
  phone: { label: "Teléfono celular", placeholder: "(929) 594-5450" },
  fullName: { label: "Nombre completo", placeholder: "Juan Pérez" },
  legalName: { label: "Nombre legal del negocio", placeholder: "Pérez Roofing LLC" },
  address: { label: "Dirección del negocio", hint: "Calle, ciudad, estado y código postal.", placeholder: "123 Main St, San Antonio, TX 78216" },
  trade: { label: "¿Cuál es su oficio principal?" },
  otherTrades: { label: "¿Hace otros trabajos?", hint: "Marque todos los que apliquen." },
  primaryPct: { label: "¿Qué parte de su trabajo es su oficio principal?" },
  otherTradeDescription: { label: "Describa sus otros trabajos o servicios", placeholder: "Cuéntenos qué trabajos hace" },
  revenue: { label: "Ingresos anuales (aproximados)" },
  employees: { label: "Empleados W2", hint: "No cuente a los dueños ni a los subcontratistas." },
  payroll: { label: "Nómina anual W2 (aproximada)", hint: "Sueldos a sus empleados, no pagos a subcontratistas." },
  usesSubcontractors: { label: "¿Contrata subcontratistas?" },
  subcontractorCosts: { label: "Pagos anuales a subcontratistas (aproximados)", hint: "Lo que les paga en total al año." },
  structure: { label: "Tipo de negocio", optional: true },
  yearStarted: { label: "¿En qué año empezó el negocio?", placeholder: "2015", optional: true },
  currentGl: { label: "¿Tiene seguro de responsabilidad general ahora?", optional: true },
  currentPremium: { label: "¿Cuánto paga ahora al año por ese seguro?", hint: "Un estimado está bien.", optional: true },
};

export const ES_SECTION: Record<string, string> = {
  contact: "Sus datos de contacto",
  business: "Sobre su negocio",
  coverage: "Su seguro actual",
};
export function sectionOf(key: string): "contact" | "business" | "coverage" {
  return ["email", "phone", "fullName"].includes(key) ? "contact" : ["currentGl", "currentPremium"].includes(key) ? "coverage" : "business";
}
