import { track } from "@vercel/analytics";

type Stage = "LandingView" | "QuoteClick" | "FormView" | "FormStart" | "ContactDone" | "TradeSelected" | "SubmitAttempt" | "SubmitSuccess" | "SubmitError";
type Properties = { placement?: string; event_id?: string };
const once = new Set(["LandingView", "FormView", "FormStart", "ContactDone", "TradeSelected", "SubmitSuccess"]);
const memory = new Set<string>();
let session = "";

/** No form values, addresses, email, phone, or full URLs in analytics. */
export function trackRooferOffer(stage: Stage, properties: Properties = {}) {
  if (typeof window === "undefined") return;
  try {
    if (!session) {
      session = sessionStorage.getItem("roofer_offer_session") || crypto.randomUUID();
      sessionStorage.setItem("roofer_offer_session", session);
    }
    const key = `roofer_offer_v1:${stage}`;
    if (once.has(stage)) {
      if (memory.has(key) || sessionStorage.getItem(key)) return;
      memory.add(key);
      sessionStorage.setItem(key, "1");
    }
  } catch {
    const key = `roofer_offer_v1:${stage}`;
    if (once.has(stage) && memory.has(key)) return;
    if (once.has(stage)) memory.add(key);
  }
  const ad = new URLSearchParams(location.search).get("ad_id");
  const data = { offer: "roofer-free-leads", page: "/roofers-free-leads", session_id: session || "unavailable", ...(ad && /^\d{5,30}$/.test(ad) ? { ad_id: ad } : {}), ...properties };
  const name = `RooferOffer${stage}`;
  // Local instrumentation is inspectable without sending synthetic events.
  window.dispatchEvent(new CustomEvent("cohesive:roofer-funnel", { detail: { name, data } }));
  if (process.env.NODE_ENV !== "production") return;
  try { track(name, data); } catch { /* Analytics must not break navigation/intake. */ }
  try {
    (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq?.("trackCustom", name, data);
  } catch { /* Optional pixel can be blocked. */ }
}
