// Nam 11/21: partners who arrive from the FB ads (not cold email) also answer what their business is and where
// they will source referrals, so the team can judge partner quality before paying. Client-safe (no node imports).
export const SOURCING_OPTIONS = ["My subcontractors / crews", "Other contractors I know", "Suppliers / vendors", "My customers", "Social media / Facebook groups", "Trade groups / associations", "Real estate / property contacts", "Other"] as const;
export const isFacebookUtm = (utm?: { utm_source?: string | null; fbclid?: string | null }) =>
  /^(facebook|fb|meta|ig|instagram)$/i.test((utm?.utm_source ?? "").trim()) || Boolean((utm?.fbclid ?? "").trim());
