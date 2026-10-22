import EsTradeRoute, { esTradeMetadata } from "@/components/es/EsTradeRoute";
import { ES_GENERAL_CONTRACTOR } from "@/lib/es/contractor-content";

// Spanish contractor page (Kevin 2026-10-22). Copy and prices live in lib/es/contractor-content.ts.
export const metadata = esTradeMetadata(ES_GENERAL_CONTRACTOR);

export default function Page() {
  return <EsTradeRoute content={ES_GENERAL_CONTRACTOR} />;
}
