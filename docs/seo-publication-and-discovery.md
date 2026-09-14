# SEO publication and discovery

## Release notifications

IndexNow notifies participating search engines of changed URLs; acceptance is not indexing,
a ChatGPT citation or a ranking guarantee. No Bing Webmaster account is provisioned by this
file, and no automatic scheduler or GitHub workflow is installed.

For each approved content release:
1. Update public/.well-known/cohesive-content-release.json with a unique release identifier,
   editorial date and the exact added/materially changed guide or insurance paths. No query
   strings, lead records, tracking links or whole historical sitemap dumps. Maximum 100 paths.
2. Build, test, review the diff and publish through GitHub/Vercel. Confirm the exact commit
   deployed and verify the actual public content before notification.
3. Run `node scripts/indexnow.mjs` to inspect the notification without making requests.
4. Run `node scripts/indexnow.mjs --submit --receipt /absolute/private/path/receipt.json`.
   The tool verifies the public key, release manifest and every page's canonical before POST.
5. Keep the receipt. HTTP 200 means received; 202 means received with key validation pending.
   Neither proves indexing. Nonaccepted responses exit nonzero; investigate before retrying.
6. Use authenticated Bing Webmaster Tools to check subsequent indexing when access exists.

The site ownership file is intentionally public as required by IndexNow. It is not a credential
for Bing Webmaster Tools or the CRM. Do not use this identifier as a reusable secret elsewhere.

Sources checked September 14, 2026:
https://www.indexnow.org/documentation
https://www.bing.com/indexnow/getstarted

## AI crawler checks

robots.txt already permits OAI-SearchBot. Keep public guide text in server-rendered HTML and
maintain canonical URLs, ordinary internal links and sitemap entries. A request from this VM
using an OAI-SearchBot user agent tests only user-agent handling, not verified OpenAI source IPs.

With Vercel account access, inspect Firewall/Traffic and request records for OAI-SearchBot,
source IP, requested path, response/action and time. Compare IPs with OpenAI's published ranges.
Keep search crawling separate from GPTBot training preferences. Do not disable broad firewall
protections merely to make a synthetic crawler test pass.

https://developers.openai.com/api/docs/bots
https://vercel.com/docs/vercel-firewall/firewall-observability

## Search source measurement

AcquisitionAttribution records external first-touch referrals on pages without forms as well as
on form pages. lib/attribution.ts retains this through internal navigation without inventing an
organic source for direct traffic. Existing campaign attribution wins when captured first.
No new visitor-tracking network endpoint or persistent person identifier is added.

The insurance-app read-only tool goals/marketing/tools/search_acquisition_report.py reports
explicit search referrals and subsequent CRM quote/BOUND-policy records by contact and landing
page. Missing attributes, ambiguous accounts and qualification remain gaps. CRM quote absence
is not proof that a price was never delivered. No direct query of a carrier or automatic
qualification is implied. Use the report alongside owned producer review, not in its place.
