// Domain classification for deriving an Account's identity from a submitter's email.
// Ported from cohesive-crm (src/backend/services/domains.ts) so intake-created
// accounts key on the same notion of a "company domain" the CRM uses.

// Consumer email providers. A contact here isn't identifiable by domain, so it does
// not yield a company Account website.
export const GENERIC_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.ca",
  "ymail.com",
  "rocketmail.com",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.uk",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "fastmail.com",
  "hey.com",
  "comcast.net",
  "verizon.net",
  "att.net",
  "sbcglobal.net",
  "cox.net",
  "bellsouth.net",
  "charter.net",
  "earthlink.net",
]);

// Social, blogging, site-builder, code-host and generic-hosting domains. These identify a
// platform, not the business — never treat one as an Account website (subdomains too, e.g.
// acme.wixsite.com).
export const NON_COMPANY_DOMAINS: ReadonlySet<string> = new Set([
  // social
  "facebook.com",
  "fb.com",
  "instagram.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "youtube.com",
  "youtu.be",
  "tiktok.com",
  "pinterest.com",
  "snapchat.com",
  "reddit.com",
  "threads.net",
  "whatsapp.com",
  "t.me",
  // blogging / publishing
  "tumblr.com",
  "medium.com",
  "substack.com",
  "blogspot.com",
  "blogger.com",
  // site builders / hosting
  "wordpress.com",
  "wordpress.org",
  "wix.com",
  "wixsite.com",
  "squarespace.com",
  "weebly.com",
  "webflow.io",
  "carrd.co",
  "godaddy.com",
  "shopify.com",
  "myshopify.com",
  "netlify.app",
  "vercel.app",
  "pages.dev",
  "herokuapp.com",
  "web.app",
  "firebaseapp.com",
  // code hosts / misc platforms
  "github.com",
  "github.io",
  "gitlab.com",
  "sites.google.com",
  "google.com",
  "linktr.ee",
  "about.me",
  "bit.ly",
  "notion.site",
]);

export function normalizeToDomain(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const host = raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[/?#]/)[0] // cut at path, query (?), or fragment (#) — even with no path segment
    .split(":")[0] // drop any :port
    .toLowerCase();
  return host || null;
}

export function domainFromEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const domain = email.slice(at + 1).trim().toLowerCase();
  return domain || null;
}

function inList(domain: string, list: ReadonlySet<string>): boolean {
  if (list.has(domain)) return true;
  for (const d of list) {
    if (domain.endsWith(`.${d}`)) return true;
  }
  return false;
}

export function isGenericEmailDomain(domain: string): boolean {
  return inList(domain, GENERIC_EMAIL_DOMAINS);
}

export function isNonCompanyDomain(domain: string): boolean {
  return inList(domain, NON_COMPANY_DOMAINS);
}

export function isCompanyDomain(domain: string): boolean {
  return !isGenericEmailDomain(domain) && !isNonCompanyDomain(domain);
}

/**
 * The company domain a submitter's email identifies, or null when the email is a
 * consumer/platform address (gmail, hotmail, a wix subdomain, …) that doesn't map
 * to a business website. Used as the Account's `website` and its dedup handle.
 */
export function companyDomainFromEmail(email: string): string | null {
  const domain = domainFromEmail(email);
  if (domain && isCompanyDomain(domain)) return domain;
  return null;
}
