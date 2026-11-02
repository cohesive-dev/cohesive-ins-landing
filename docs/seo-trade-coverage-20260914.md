# Contractor coverage expansion — September 14, 2026

Kevin approved more focused guides for remodeling, pool construction, painting, roofing,
handyman and related trades; documented examples; crawler checks; Bing/IndexNow and search
acquisition measurement. About/team changes are explicitly parked.

Five new guides: remodeling structural/existing-property questions; painters' overspray,
heights and lead; roofers' open-roof/hot-work/subcontractors; handyman task boundaries; HVAC
installation and water damage. Pool comparison expanded within the existing URL. No mass
state-page generation or placement expansion. Guide links are added to matching trade pages.
Roofing uses the existing Roofing industry value so California/New York/Florida restrictions
remain enforced by the shared form and intake route.

Public source checks:
- Coterie contractor guidance: https://coterieinsurance.com/blog/insurance-for-contractors/
  Distinguishes interior remodeling and structural/other operations. Described as one provider
  example, not a blanket knockout. No old percentage cutoff is made a routing rule.
- NEXT handyman scope: https://www.nextinsurance.com/business/handyman-insurance/
- NEXT painter overview: https://www.nextinsurance.com/business/painter-insurance/
- EPA RRP: https://www.epa.gov/lead/renovation-repair-and-painting-program-contractors
  Scope/exception wording retained. Certification is not insurance coverage.
- Roofers Choice published supplemental:
  https://www.rooferschoiceinsurance.com/RoofersInsurancePacketEditable.pdf
  Hot-tar/torch/hot-air questions are underwriting evidence, not policy coverage confirmation.
- TDI general liability: https://www.tdi.texas.gov/pubs/pc/pcgenliab.html
  Quote comparison and actual-form review. No local legal obligation generalized nationwide.

Anonymized documentary example: a September 2026 saved Thimble housekeeper proposal, insurer
National Specialty, lists GL 2,000,000 and Customer Property Protection 5,000, and states poor
workmanship is outside that extension. Page 1 visually checked against extracted text.
Source SHA256: 08c05ebeb5d2f56076bbb5cb8459880628026fbd15ae2452b5de9830fa39a12c.
The source remains private in insurance-app. No name, address, contact, quote identifier or
premium is published. This is ONE quote-document example, not a two-carrier price comparison,
bind or paid claim. Full carrier-to-carrier price comparisons still require matched artifacts.

Attribution defect: captureAttribution previously returned without saving whenever URL tracking
parameters were absent. A subsequent full navigation could therefore replace the true search
landing/referrer with the current page/internal referrer. External referrals now persist, and
a global no-network component captures entry pages without forms. Bare direct/internal visits
remain unclassified. Tests preserve existing paid first-touch behavior.

IndexNow setup and receipts: see seo-publication-and-discovery.md. Notification is performed
only after exact-commit deployment/public readback. Hosted verification is separate from Bing
account access. Actual OpenAI-IP firewall access remains unverified until Vercel logs are available.

Verification: production webpack build/TypeScript, targeted lint, existing intake and startup
functional tests, all composed resource/sitemap checks, attribution navigation regressions,
IndexNow preflight/response tests and local/public mobile/desktop tests. No live form submission,
CAPI event, carrier action or client message is required. Rollback: revert the release after
checking subsequent main changes; no database migration. Search effects require later observation.

Second anonymized documentary example: saved August2026 Sierra/Blitz tree proposal, page6
coverage-modification schedule. Work-height exclusion above60ft and separate tree-felling
height limitation visually verified. Only schedule contents are reported; full wording is
not inferred from the title. No private identity, premium, payroll or quoteID published.
SHA256 7368c17b34c1cd21692fed1abb397a4e4cd5e17b8a3ef4b288d567f75fa506c1.
