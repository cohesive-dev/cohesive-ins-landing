import EsTradeRoute, { esTradeMetadata } from "@/components/es/EsTradeRoute";
import { ES_REMODELER } from "@/lib/es/contractor-content";

// Spanish contractor page (Kevin 2026-10-22). Copy and prices live in lib/es/contractor-content.ts.
export const metadata = esTradeMetadata(ES_REMODELER);

export default function Page() {
  return <EsTradeRoute content={ES_REMODELER} />;
}
