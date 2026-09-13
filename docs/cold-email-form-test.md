# Cold-email long/step form comparison

Two dedicated, noindex routes reuse ContractorExperimentForm with a fixed layout:

- `/email/contractors/long`
- `/email/contractors/step`

Use the four allowlisted `utm_campaign` values from `lib/cold-email-landing.ts`.
`coldEmailUrl()` produces the full link with industry, source and medium. Campaign identity
sets the advertised industry; an arbitrary industry parameter cannot override that mapping.
Bare routes offer trade selection. Unknown campaign values are labelled unattributed in
telemetry rather than copied into event labels. Do not put email addresses or names in URLs.

The URL fixes layout, including on repeat visits with existing Facebook experiment storage.
The existing Facebook `/contractor-test` assignment stays separate. Both layouts use the
same eight questions, validation, offer and guarded `contractors-landing` intake route.
The existing long contact-first / step business-first field order is preserved, so compare
these whole form experiences, not an isolated effect of pagination alone. Actual operations
and state still require confirmation before quoting, as with the existing experiment form.

## Smartlead links

Kevin confirmed the quick `forgot the link` message is intentional. Preserve the text and
cadence. Only replace existing quote URLs with `{LONG_URL|STEP_URL}`, using the appropriate
campaign parameters in both alternatives. Leave referral openers without a link unchanged.
Spintax is randomized selection, not guaranteed equal allocation or strict alternation.
Kevin said keeping one layout per prospect does not matter; follow-ups may expose both.
Use Smartlead's rendered preview to verify full URLs before resuming an approved edit.

## Measurement

Cold-email events use cells such as `pool__email_quick_link__long__v1`; Facebook cells do not
use the `email_` prefix. The shared page tracker skips these two paths to avoid also recording
`site__other__page__v1`; the form tracker emits the campaign/layout page view. These events
contain no answers or contact values. Full submissions retain the existing intake source so
they cannot bypass the contractor quality gate, and add explicit acquisition channel, cold
campaign and layout details. Original first-touch attribution is preserved separately.

The tracker requires `NEXT_PUBLIC_FB_FUNNEL_ENABLED=true` at build time. Existing client event
validation accepts the new cell shape. Verify the production receiver accepts and persists
these cells before switching campaign links; local mocked receiver tests are not proof of
production ingestion. Receiver source access was unavailable from the implementation workspace.
Vercel Analytics also tracks distinct paths, but its dashboard was not accessed here.

Report distinct 30-minute browser session IDs by campaign/layout, interaction-started sessions,
accepted submission IDs, and cross-layout sessions. Session IDs are not identified people.
`is_test=false` alone does not prove human traffic. Report raw and interaction-observed counts
separately; don't claim complete bot/security-scanner removal. Dedicated URLs identify use of
the cold-email destination, not cryptographic proof of a Smartlead click (links can be shared).
Historical /contractors visits cannot be reassigned retroactively to this experiment.

Example bounded read-only SQL (use supplied start/end timestamps, exclusive end):

```sql
SELECT cell_id,
       count(DISTINCT session_id) FILTER (WHERE event='page_view') AS browser_sessions,
       count(DISTINCT session_id) FILTER (WHERE event='form_start') AS started_sessions,
       count(DISTINCT submission_id) FILTER (WHERE event='intake_accepted') AS browser_accepted
FROM fb_funnel_events
WHERE received_at >= :start_at AND received_at < :end_at
  AND cell_id ~ '^(pool|roof|remodel|tree|painting|hvac)__email_[a-z_]+__(long|step)__v1$'
  AND is_test = false
GROUP BY cell_id;
```

This is an event-received-window diagnostic, not a completed landing-session cohort conversion
rate: a session can begin before the boundary, finish after it, or visit both forms. For a
conversion comparison, select first page-view cohorts, follow those session IDs through an
explicit cutoff, identify crossovers, reconcile server/CRM acceptance, and exclude known QA.
Neither a browser acceptance nor CAPI attempt proves CRM receipt or a genuine unique lead.

## Validation and rollout

- `node scripts/test-cold-email-landing.cjs`
- `node scripts/test-submission-quality.cjs`
- `node scripts/test-intake-delivery.cjs`
- targeted ESLint and `npm run build`
- mobile/desktop browser checks of both layouts, invalid input, $0 payroll, campaign details,
  preview isolation, old Facebook preview, and accepted-event/session/submission identity;
  all intake/telemetry requests intercepted, no client or real analytics submissions.

Publish the exact reviewed website commit and verify its deployment before replacing any
Smartlead links. Confirm a single writer with local Astra, snapshot sequences again, stop on
configuration drift, preserve sequence/variant IDs and all non-link content, and validate
provider readback/rendered spintax before resuming. No budgets, send caps or lead lists change.
