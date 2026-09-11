# Roofer offer funnel

Draft implementation; deploy and verify production ingestion before claiming live measurement.

Events go to Vercel Web Analytics custom events and Meta custom events in production. Local runs emit only the `cohesive:roofer-funnel` browser diagnostic event. Standard Meta Lead/CAPI deduplication is unchanged. Custom events require the site's analytics plan/configuration to support them; blockers can cause undercounting.

| Event prefix: RooferOffer | Meaning |
| --- | --- |
| LandingView | Hydrated landing visit |
| QuoteClick | Header, hero, or midpage CTA click, including keyboard activation |
| FormView | Quote-form heading enters viewport |
| FormStart | First form value change, not the preselected roofing value |
| ContactDone | Required contact inputs completed |
| SubmitAttempt | Valid form submitted |
| SubmitError | Submission fails |
| SubmitSuccess | Intake responds successfully; carries existing Lead event ID |

Filter `offer=roofer-free-leads` and group by `page`, `ad_id`, and CTA `placement`. No entered field values or full URL are sent. `session_id` is a random tab-session identifier; milestones are once per tab session, clicks/attempts/errors repeat. Use distinct session IDs for conversion rates, not raw click counts. Sessions without tracking are not observable. Reloads retain milestone deduplication; another tab/device can count separately.

Review landing-to-click, landing-to-form-view, form-view-to-start, start-to-success and attempt error rate. Also report landing-to-success directly because visitors can scroll to the form without clicking a CTA. Split clicks by placement without interpreting downstream totals as attribution to a single button. For comparisons to /contractors, compare existing shared FormStart/ContactDone/Lead events by page, and separately reconcile CRM contacts with the offer tag. Do not compare raw custom-event totals to a different event's denominator.

First production QA: verify all events in Vercel and Meta test/debug views, exact ad IDs and CRM offer tag, with controlled non-converting checks for clicks. Do not send fake Leads to the production pixel. No automatic dashboard, alerting or scheduled monitoring is implemented by this change.
