import assert from "node:assert/strict";
import { handleRoofingLeadSubmission, slackLeadText, calendlyBookingUrl, resolveOffer } from "../lib/roofing-leads.ts";

const good = { fullName: "Pat Roof", businessName: "Pat Roofing LLC", email: "pat@example.com", phone: "(555) 123-4567",
  serviceArea: "Tampa, FL", roofingWork: "Residential", offer: "monthly", utm: { utm_campaign: "roof-test" } };
const calls = [];
const okFetch = async (url, init) => { calls.push({ url, init }); return { ok: true, status: 200, json: async () => ({ ok: true }) }; };
const slackEnv = { ROOFING_LEADS_SLACK_BOT_TOKEN: "xoxb-test", ROOFING_LEADS_SLACK_CHANNEL: "C123" };

// Slack path: posts once to the group DM with the lead and the offer.
let r = await handleRoofingLeadSubmission(good, slackEnv, okFetch);
assert.equal(r.status, 200); assert.equal(r.body.status, "ok");
assert.equal(calls.length, 1); assert.equal(calls[0].url, "https://slack.com/api/chat.postMessage");
const sent = JSON.parse(calls[0].init.body);
assert.equal(sent.channel, "C123");
assert.match(sent.text, /New roofing-leads signup \(website, \$100\/mo offer\)/);
assert.match(sent.text, /Pat Roofing LLC \(Residential\)/);
assert.match(sent.text, /Service area: Tampa, FL/);

// Non-roofer: polite stop, never forwarded.
calls.length = 0;
r = await handleRoofingLeadSubmission({ ...good, roofingWork: "I'm not a roofer" }, slackEnv, okFetch);
assert.equal(r.body.status, "disqualified"); assert.equal(calls.length, 0);

// Honeypot: pretend success, nothing sent.
r = await handleRoofingLeadSubmission({ ...good, website: "spam" }, slackEnv, okFetch);
assert.equal(r.body.status, "ok"); assert.equal(calls.length, 0);

// Validation: missing fields -> 400 with field errors, nothing sent.
r = await handleRoofingLeadSubmission({ ...good, phone: "12", businessName: "" }, slackEnv, okFetch);
assert.equal(r.status, 400); assert.ok(r.body.errors.phone && r.body.errors.businessName); assert.equal(calls.length, 0);

// Partial: needs only a reachable email or phone; the Slack text says it was not submitted.
r = await handleRoofingLeadSubmission({ email: "p@x.co", partial: true, offer: "per-lead" }, slackEnv, okFetch);
assert.equal(r.body.status, "ok");
assert.match(JSON.parse(calls.at(-1).init.body).text, /Partial roofing-leads signup \(website, ~\$30\/lead offer\)/);

// Not configured: 503 with the email fallback (never silently dropped, never the insurance intake).
r = await handleRoofingLeadSubmission(good, {}, okFetch);
assert.equal(r.status, 503); assert.match(r.body.message, /quotes@cohesiveinsure\.com/);

// Slack failure: 502 with the email fallback.
r = await handleRoofingLeadSubmission(good, slackEnv, async () => ({ ok: true, status: 200, json: async () => ({ ok: false }) }));
assert.equal(r.status, 502);

// Calendly prefill + tags; offer default.
const u = new URL(calendlyBookingUrl({ fullName: "Pat", email: "PAT@Example.com", phone: "5551234567", offer: "monthly" }));
assert.equal(u.searchParams.get("email"), "pat@example.com");
assert.equal(u.searchParams.get("utm_source"), "roofing-leads");
assert.equal(u.searchParams.get("utm_medium"), "monthly");
assert.equal(resolveOffer("nope"), "per-lead");
assert.ok(!slackLeadText(good).includes("\n\n"));
console.log("test-roofing-leads: all assertions passed");
