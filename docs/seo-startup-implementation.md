# Startup-guide SEO implementation

Implemented September 7, 2026 in `cohesive-ins-landing`. Release deployment runs through GitHub main and Vercel; use the release commit’s deployment status as the publishing record. Search Console submission is separate.

## Scope

- 300 state guides: all 50 states for restaurants, janitorial businesses, pool construction, roofing, tree services, and remodeling.
- All 306 national/state startup guides include lead generation: industry-specific real estate agent, general contractor, and property manager referral opportunities; insurance-before-vendor-pitch preparation; COI/endorsement distinctions; sample introductions; and pipeline tracking. Restaurant examples cover catering, tenant events, and employer meals. The three focused restaurant support articles retain their specific topics.
- Six national startup hubs and three restaurant supporting guides (startup costs, lease insurance requirements, pre-opening checklist): 309 articles total, plus `/guides`.
- State/business finder, national-to-state links, related articles, insurance-page cross-links, homepage navigation, canonical metadata, Article/Breadcrumb structured data, and sitemap inclusion.
- Interactive downloadable startup checklists and an editable restaurant opening-budget calculator with CSV export. Downloads need no email. Progress/input values are temporary until downloaded.
- Inquiry form captures contact/business details, state, timeline, operations, and the converting guide. Success is shown only after the intake API accepts the request; retry preserves inputs.

## Cohesive placement and provider shortlist

All 306 startup articles include a provider comparison after the business-registration step (or the nearest setup section). It compares direct state filing, Northwest Registered Agent, ZenBusiness Starter, Stripe Atlas, IRS EIN application, and Bluevine. Service guides add Jobber and Stripe Payment Links; restaurant guides add Square for Restaurants. Provider links are ordinary direct URLs with no affiliate identifiers added. Recommendations describe fit and tradeoffs rather than claiming a universal best provider or a commercial partnership.

Pricing and features were checked on September 7, 2026 against the linked official provider pages. Northwest's formation and registered-agent prices are shown separately, with package inclusion to be confirmed. ZenBusiness headline pricing is accompanied by add-on/trial/renewal checks. Atlas is presented for deliberately chosen Delaware entities, including additional operating-state registration considerations. Bluevine is identified as a fintech and evaluated separately from formation, with cash-deposit considerations for restaurants. Refresh prices and terms before future publication or price changes.

Eligible startup articles have two inline Cohesive calls to action: after the provider comparison and after insurance preparation for vendor outreach. Sidebar and quote-form copy also explicitly name Cohesive. Unsupported state/industry pages omit those solicitations. CTA click events retain the guide and now include placement (`setup`, `vendor`, or `sidebar`). No savings, binding-speed, vendor-approval, or universal coverage promises were added.

## Content and source maintenance

`lib/guides/states.ts` contains 50 food-authority and construction-resource records plus specialty resources for janitorial and tree-service programs. `services.ts` contains five trade-specific national guides and operational profiles. `restaurant.ts` contains six authored restaurant articles, including the Ohio and North Carolina guides. `catalog.ts` composes the remaining state pages from these records.

The state pages are planning and agency-routing guides, not an exhaustive legal analysis for every locality. Shared business-setup material is intentional; state links and agency notes supply the local starting point, and industry profiles supply scope, estimating, startup-cost, and first-job questions. There are no fabricated permit fees, market price averages, customer examples, or human reviewer endorsements. Operator interviews and deeper local examples from the original plan remain future editorial work.

`registration.json` records the SBA directory source and retrieval date. Refresh with `python3 scripts/fetch-startup-registration.py`; inspect changes before publishing. Official agency URLs were researched, but no claim is made that every external URL passes an automated live-link audit. Review state and specialty resources quarterly and when agencies change their programs. Update article dates only after actual content review.

## Inquiry routing and measurement

All 50 states have educational content. California pages omit insurance inquiry forms; roofing pages also omit forms in New York and Florida. National forms enforce those restrictions when a state is selected. The API validates guide/state and applies the same restrictions before CRM, notification, or CAPI effects. Michigan and Washington follow the current internal licensing reference as eligible states.

Startup inquiries use `seo-startup-{guide-slug}` and retain the guide, state, operations, and timeline in the existing intake flow. They omit the API's `final`/`partial` abandonment flags and suppress automated first-touch outreach. Existing unrelated intake sources retain their behavior.

Analytics events: `GuideQuoteClick`, `GuideBudgetDownload`, `StartupChecklistDownload`, and `StartupQuoteCaptured`. Capture events include the API's CRM status; budget amounts and contact fields are not included in these events. API acceptance requires either a CRM response with `ok: true` or a successful Gmail send. Both destinations are attempted independently. A failure of both returns HTTP 503 and no capture event; the form retains inputs for retry. Responses expose `crm` and `notification` status, so accepted requests and CRM-confirmed leads must be reconciled separately.

This records the converting guide, not full first-touch or assisted organic attribution. Search Console query/indexing baselines, GA4 acquisition joins, CRM-to-bind reporting, and verification after production deployment are not complete. Live delivery from localhost to the production CRM and quotes inbox was verified in the approved test below. No ranking, traffic, or revenue improvement has been measured.

## Validation

- Production build generates all 309 guide articles within 3,233 site pages and passes TypeScript.
- Rendered audit: 309 unique canonical URLs, Article schema, one H1 per article, working TOC anchors/internal guide links, sitemap inclusion, exactly 50 state guides per industry, and eight restricted articles without inquiry forms.
- `node scripts/test-guide-budget.mjs`: cash reserve, contingency basis, funding gap, invalid/capped inputs, CSV precision, 50-state resources, and placement rules.
- Scoped ESLint: no errors; two existing logo-image optimization warnings in shared insurance components.
- Playwright on localhost: 390px and desktop overflow checks, finder filtering, checklist progress/download, budget totals/CSV, mocked failed/successful inquiries and payloads, national form restrictions, print visibility, and unknown-slug 404.
- Provider-update browser checks: mobile page width, vendor comparison rows and links, both inline Cohesive placements, quote navigation, restaurant-specific tools, and California CTA suppression passed with all external requests and submissions blocked.
- Five local API rejection cases cover invalid guide/state and unsupported placement states. No contact information or live inquiry was sent during those rejection checks. Browser external requests were blocked and valid submissions mocked.

## After publishing

Submit the sitemap and inspect representative national/state URLs in Search Console. Establish a 28-day baseline by industry and state, then compare impressions, clicks, index coverage, eligible requests, quotes, and binds. Use observed queries to improve individual pages with more specific local workflows and original examples. Confirm production inquiry delivery through the team's controlled test process before interpreting conversion counts.

## Intake reliability follow-up

The quotes notification now returns its transport status and includes the business name. Startup state and guide details are reconstructed from validated server data, and operations text retains the full 2,000-character form limit. The notification-only restaurant branch also fails visibly if email delivery fails. Ordinary partial saves still do not send or create CRM records; abandonment behavior remains separate.

The ignored local `.env.local` now has the existing delegated Gmail credential, with file mode 0600. A read-only Gmail profile request authenticated successfully as quotes@cohesiveinsure.com. No credential is committed or printed. Production environment configuration is managed in Vercel and remains separate from the localhost setup.

`node scripts/test-intake-delivery.cjs` tests the real route with mocked external transports: both destinations succeeding, each independently failing, both failing, HTTP-200 rejection/invalid responses, timeout, invalid payload/state, business-name and full operations preservation, authoritative state details, first-touch suppression, existing commercial-property routing, and the real MIME composer's result propagation. This does not send mail or create a CRM record. The subsequently approved live delivery test is recorded below.

## Approved live delivery test

Verified 2026-09-07T19:21:49.265Z with one clearly labeled internal submission from localhost. No real prospect or phone number was used. The handler returned HTTP 200, `crm: sent`, and `notification: sent`; all CAPI events were skipped.

- Quotes inbox: Gmail message `1a07d51d60c76b24` confirmed in INBOX, not spam, with the business name, New Jersey state, timeline, operations, and guide source intact.
- Production CRM: contact `cmtrmn0x702l50ttea5xpq1gh`, account `cmtrmn0z902l60ttem5uuboh8`, and inbound activity `cmtrmn18l02la0tte4ntlisq2` confirmed through a read-only database query. Business name, state, timeline, operations, and guide source were preserved. No outbound activity was recorded for the test contact at verification.
- Test reference: `seo-intake-1788808909265`. The CRM record and inbox message are labeled INTERNAL TEST / DO NOT CONTACT and retained as receipts.

This confirms the local form handler's real downstream delivery. Production deployment is tracked by the release commit in GitHub/Vercel. This test was run against localhost, not against the deployed build.
