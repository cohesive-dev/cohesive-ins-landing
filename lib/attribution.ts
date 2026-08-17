/**
 * Ad attribution capture (2026-08-17).
 *
 * THE GAP THIS CLOSES: the landing forms captured no utm / ad id / fbclid, so no lead could be
 * traced back to the ad that bought it. Every per-ad CPL figure was an inference from Meta's own
 * (over-)count — Meta reported 9 leads on a day the CRM received ~4-5 real contacts.
 *
 * How it works:
 *  - FIRST TOUCH WINS. The params are read once per session and kept in sessionStorage, so an
 *    internal navigation (or a param-less refresh) can't erase the ad that actually sent them.
 *  - Meta fills the params via ad-level `url_tags` using its own macros ({{ad.id}}, {{ad.name}},
 *    {{adset.name}}, {{campaign.name}}), so `ad_id` is authoritative even if utm_content drifts.
 *  - `fbclid` is the click id; the pixel separately turns it into the `_fbc` cookie that the
 *    intake route already forwards for CAPI match quality. Capturing it raw as well means a lead
 *    stays traceable even when the cookie is missing (blocked, cross-browser, cleared).
 *
 * The captured values ride into /api/intake as ordinary `details` rows, so they land in the
 * quotes@ email and the CRM note with zero schema changes.
 */

const KEY = "cohesive_attr_v1";

const FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "ad_id",
  "adset_id",
  "campaign_id",
  "gclid",
  "msclkid",
] as const;

export type Attribution = Partial<Record<(typeof FIELDS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  captured_at?: string;
};

/** Read + persist attribution for this session. Safe to call on every mount. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) || "{}") as Attribution;
  } catch {
    stored = {};
  }

  const qs = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};
  for (const f of FIELDS) {
    const v = qs.get(f);
    if (v && v.trim()) fresh[f] = v.trim().slice(0, 200);
  }

  // Nothing in the URL: keep whatever the first touch recorded.
  if (Object.keys(fresh).length === 0) return stored;

  // First touch wins — only write if this session has no attribution yet.
  if (Object.keys(stored).length > 0) return stored;

  fresh.landing_page = window.location.pathname;
  fresh.referrer = document.referrer ? document.referrer.slice(0, 200) : undefined;
  fresh.captured_at = new Date().toISOString();
  try {
    sessionStorage.setItem(KEY, JSON.stringify(fresh));
  } catch {
    /* private mode - in-memory value still rides this submit */
  }
  return fresh;
}

/** Attribution as `details` rows for /api/intake (empty array when there is nothing to report). */
export function attributionDetails(a: Attribution): Array<{ label: string; value: string }> {
  const out: Array<{ label: string; value: string }> = [];
  const push = (label: string, value?: string) => {
    if (value && value.trim()) out.push({ label, value: value.trim() });
  };
  // ad_id is the one that matters for per-ad CPL; name it so a human reading quotes@ knows.
  push("Ad id (Meta)", a.ad_id);
  push("Ad name", a.utm_content);
  push("Adset", a.utm_term);
  push("Campaign", a.utm_campaign);
  push("Traffic source", [a.utm_source, a.utm_medium].filter(Boolean).join(" / ") || undefined);
  push("Click id", a.fbclid || a.gclid || a.msclkid);
  push("Landing page", a.landing_page);
  return out;
}
