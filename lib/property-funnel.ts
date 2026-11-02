import { captureAttribution } from './attribution';
import { trafficSession } from './traffic-session';

/** Property engagement telemetry only. Never sends answers or creates a lead. */
export function createPropertyFunnel() {
  const sessionId = trafficSession();
  const key = `cohesive_property_form_start_${sessionId}`;
  let started = false, sent = false, inflight = false, attempts = 0;
  let event: Record<string, string | number> | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const enabled = process.env.NEXT_PUBLIC_FB_FUNNEL_ENABLED === 'true'
    && new URLSearchParams(window.location.search).get('preview') !== '1';
  try { sent = sessionStorage.getItem(key) === 'sent'; } catch { /* memory fallback */ }

  async function flush() {
    if (!event || sent || inflight || attempts >= 3) return;
    inflight = true;
    attempts++;
    try {
      const response = await fetch('https://crm.cohesiveinsure.com/api/webhooks/fb-funnel', {
        method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: [event] }), keepalive: true,
      });
      if (response.ok && (await response.json()).ok === true) {
        sent = true;
        try { sessionStorage.setItem(key, 'sent'); } catch { /* memory fallback */ }
      }
    } catch { /* Never interrupt the quote form; retry the same event ID. */ }
    finally { inflight = false; }
    if (!sent && attempts < 3) timer = setTimeout(() => void flush(), 5000);
  }

  function start() {
    if (!enabled || started || sent) return;
    started = true;
    const query = new URLSearchParams(window.location.search);
    const attribution = captureAttribution();
    const ids: Record<string, string> = {};
    for (const [source, target] of [['ad_id', 'adId'], ['adset_id', 'adsetId'], ['campaign_id', 'campaignId']] as const) {
      const value = query.get(source) || attribution[source];
      if (value && /^\d{5,30}$/.test(value)) ids[target] = value;
    }
    // Reuse the existing, accepted property page cell and version. The ad ID
    // identifies the route/layout; no contractor schema or Meta event changes.
    event = { eventId: crypto.randomUUID(), sessionId,
      cellId: 'site__commercial_property__page__v1', version: '2026-09-12-v1',
      event: 'form_start', elapsedMs: 0, ...ids };
    void flush();
  }

  const exit = () => { void flush(); };
  window.addEventListener('pagehide', exit);
  return { start, dispose() { clearTimeout(timer); window.removeEventListener('pagehide', exit); } };
}
