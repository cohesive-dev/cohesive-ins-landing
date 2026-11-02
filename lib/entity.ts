// One entity graph for the site (SEO 2026-10-03): the agency and the licensed producer behind it,
// each with a stable @id so every page's JSON-LD points at the same two nodes instead of minting
// an anonymous Organization per page.
//
// sameAs lists only profile URLs we already publish ourselves. The agency has none yet, so its list
// is empty on purpose; Kevin's LinkedIn is the one already used in our email signatures.
import { PRIMARY_NPN } from "./licenses";

export const SITE_URL = "https://www.cohesiveinsure.com";
export const ORG_ID = "https://cohesiveinsure.com/#org";
export const PERSON_ID = "https://cohesiveinsure.com/about/kevin-zhang#person";
export const ORG_NAME = "Cohesive Insurance Services";
export const PRODUCER_NAME = "Kevin Zhang";
export const PRODUCER_PATH = "/about/kevin-zhang";
// NY DFS license number (shown on the homepage as BR-1983645; the PC- prefix is the same number).
export const PRODUCER_NY_LICENSE = "1983645";

// The phone already used in every tel: link on the site.
export const PHONE_E164 = "+19295945450";
export const PHONE_TEL = "+1-929-594-5450";
export const PHONE_DISPLAY = "(929) 594-5450";

export const ORG_SAME_AS: string[] = [];
export const PERSON_SAME_AS: string[] = ["https://www.linkedin.com/in/kevindzhang"];

export function organizationJsonLd(areaServed?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: SITE_URL,
    telephone: PHONE_TEL,
    ...(areaServed ? { areaServed } : {}),
    ...(ORG_SAME_AS.length ? { sameAs: ORG_SAME_AS } : {}),
  };
}

// Reference form for use inside another node (author, publisher, worksFor).
export const ORG_REF = { "@type": "InsuranceAgency", "@id": ORG_ID, name: ORG_NAME, url: SITE_URL };
export const PERSON_REF = { "@type": "Person", "@id": PERSON_ID, name: PRODUCER_NAME, url: `${SITE_URL}${PRODUCER_PATH}` };

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: PRODUCER_NAME,
    url: `${SITE_URL}${PRODUCER_PATH}`,
    jobTitle: "Licensed property and casualty insurance producer",
    worksFor: { "@id": ORG_ID },
    identifier: [{ "@type": "PropertyValue", propertyID: "NPN", value: PRIMARY_NPN }],
    ...(PERSON_SAME_AS.length ? { sameAs: PERSON_SAME_AS } : {}),
  };
}

// Visible attribution line on the /insurance pages.
export const PRODUCER_LINE = `${ORG_NAME} · licensed producer ${PRODUCER_NAME}, NPN ${PRIMARY_NPN}`;
