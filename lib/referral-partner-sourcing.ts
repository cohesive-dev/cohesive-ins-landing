// Nam 11/21: partners who arrive from the FB ads (not cold email) also answer what their business is and where
// they will source referrals, so the team can judge partner quality before paying. Client-safe (no node imports).
export const SOURCING_OPTIONS = ["My subcontractors / crews", "Other contractors I know", "Suppliers / vendors", "My customers", "Social media / Facebook groups", "Trade groups / associations", "Real estate / property contacts", "Friends / family", "Other"] as const;
// Kevin 11/23: new referral partners come ONLY from the cold-email campaigns (Smartlead links carry utm_source=smartlead).
export const isColdUtm = (utm?: { utm_source?: string | null }) => /^smartlead$/i.test((utm?.utm_source ?? "").trim());
export const INVITE_ONLY_MESSAGE = "Our referral partner program is invite-only right now. If we emailed you about it, please sign up with the link in that email, or email kevin@cohesiveinsure.com.";
export const isFacebookUtm = (utm?: { utm_source?: string | null; fbclid?: string | null }) =>
  /^(facebook|fb|meta|ig|instagram)$/i.test((utm?.utm_source ?? "").trim()) || Boolean((utm?.fbclid ?? "").trim());
