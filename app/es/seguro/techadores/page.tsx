import EsTradeRoute, { esTradeMetadata } from "@/components/es/EsTradeRoute";
import { ES_ROOFER } from "@/lib/es/contractor-content";

// Spanish roofer page (Kevin 2026-10-22): the target of the Spanish Meta roofer ad, so keep this path stable.
// Copy and prices live in lib/es/contractor-content.ts.
export const metadata = esTradeMetadata(ES_ROOFER);

export default function Page() {
  return <EsTradeRoute content={ES_ROOFER} />;
}
