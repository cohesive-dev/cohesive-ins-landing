// Reddit Ads pixel (Kevin 11/23: "Just install it reddit pixel").
// The base code lives in app/layout.tsx (production deploy only, never preview/localhost);
// off production window.rdt is a no-op, so these helpers never need guards.

export const REDDIT_PIXEL_ID = "a2_k1rko86m4pgj";

type Rdt = (...args: unknown[]) => void;

function rdt(...args: unknown[]) {
  if (typeof window === "undefined") return;
  (window as unknown as { rdt?: Rdt }).rdt?.(...args);
}

export function redditPageVisit() {
  rdt("track", "PageVisit");
}

/** A paid-lead conversion counts only for a completed submit the CRM accepted as a new,
 * conversion-eligible person (the same gate as the Google Ads conversion). Partials
 * (crm "skipped"), rejects, duplicates and quotes@-only fallbacks (crm "failed") never count.
 * Returns the server's conversion event id, the same id Meta/OpenAI use for dedupe. */
export function redditLeadConversionId(result: unknown): string | undefined {
  if (!result || typeof result !== "object") return undefined;
  const r = result as { ok?: unknown; crm?: unknown; conversion?: { eligible?: unknown; eventId?: unknown } | null };
  if (r.ok !== true || r.crm !== "sent") return undefined;
  const c = r.conversion;
  if (!c || typeof c !== "object" || c.eligible !== true) return undefined;
  return typeof c.eventId === "string" && c.eventId ? c.eventId : undefined;
}

/** Fire the Reddit Lead for a completed /api/intake result; no-op unless eligible. */
export function trackRedditLead(result: unknown): boolean {
  const conversionId = redditLeadConversionId(result);
  if (!conversionId) return false;
  rdt("track", "Lead", { conversionId });
  return true;
}
