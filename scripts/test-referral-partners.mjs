import assert from "node:assert/strict";
import { handlePartnerSignup, alertRecipients, partnerLink, SOURCING_OPTIONS, isColdUtm, INVITE_ONLY_MESSAGE } from "../lib/referral-partners.ts";
import { SOURCING_OPTIONS as CLIENT_SOURCING, isColdUtm as clientIsCold, INVITE_ONLY_MESSAGE as CLIENT_INVITE } from "../lib/referral-partner-sourcing.ts";
assert.equal(CLIENT_INVITE, INVITE_ONLY_MESSAGE, "form and server invite-only copy must match");
for (const u of [{ utm_source: "smartlead" }, { utm_source: " SmartLead " }, { utm_source: "facebook" }, {}, undefined]) assert.equal(clientIsCold(u), isColdUtm(u));
assert.deepEqual(CLIENT_SOURCING, SOURCING_OPTIONS, "form and server sourcing lists must match");
import { referralCode } from "../lib/referral-code.ts";

const good = { fullName: "Pat Builder", businessName: "Pat GC LLC", trade: "GC", email: "Pat@Example.com", phone: "(555) 123-4567",
  payoutHandle: "@pat-builds", agree: true, utm: { utm_source: "facebook", utm_campaign: "gc-referral" },
  currentBusiness: "Roofing company", sourcing: ["My subcontractors / crews", "Suppliers / vendors", "bogus"] };
const mails = [];
const ok = async (m) => { mails.push(m); return true; };
const code = "a1b2c3d4e5f60718293a";
const OFF = { REFERRAL_PARTNER_COLD_ONLY: "off" }; // tests below predate the Kevin 11/23 cold-only gate

// Kevin 11/23: partner signups only from cold-email (smartlead) links; FB / direct / anything else is refused, nothing sent.
{
  const sent = [];
  const rec = async (m) => { sent.push(m); return true; };
  for (const utm of [{ utm_source: "facebook" }, { fbclid: "x" }, {}, { utm_source: "chatgpt.com" }, undefined]) {
    const g = await handlePartnerSignup({ ...good, utm }, {}, rec, () => code);
    assert.equal(g.status, 403); assert.equal(g.body.message, INVITE_ONLY_MESSAGE); assert.equal(g.body.code, undefined);
  }
  assert.equal(sent.length, 0);
  const c = await handlePartnerSignup({ ...good, utm: { utm_source: "smartlead", utm_campaign: "4660664" }, currentBusiness: "", sourcing: [] }, {}, rec, () => code);
  assert.equal(c.status, 200); assert.match(sent[0].text, /SIGNUP_CHANNEL: cold_email/); assert.match(sent[0].text, /Source: smartlead \/ 4660664/);
  const cl = await handlePartnerSignup({ ...good, program: "client", utm: {} }, {}, rec, () => code);
  assert.equal(cl.status, 200, "client program stays open");
  const off = await handlePartnerSignup({ ...good, utm: {} }, { REFERRAL_PARTNER_COLD_ONLY: "off" }, rec, () => code);
  assert.notEqual(off.status, 403, "env off switch");
}

let r = await handlePartnerSignup(good, OFF, ok, () => code);
assert.equal(r.status, 200); assert.equal(r.body.ok, true); assert.equal(r.body.code, code);
assert.equal(r.body.url, "https://www.cohesiveinsure.com/refer?ref=" + code);
assert.equal(referralCode(code), code, "partner code must pass /refer validation");
assert.equal(mails.length, 2);
assert.deepEqual(mails[0].to, ["kevin@cohesiveinsure.com", "nam@cohesiveinsure.com"]);
assert.match(mails[0].subject, /^\[referral-partner\] Pat GC LLC - Pat Builder$/);
assert.match(mails[0].text, new RegExp("PARTNER_CODE: " + code));
assert.match(mails[0].text, /Payout: Venmo - @pat-builds/);
assert.match(mails[0].text, /Source: facebook \/ gc-referral/);
assert.match(mails[0].text, /Current business: Roofing company/);
assert.match(mails[0].text, /Sourcing referrals from: My subcontractors \/ crews, Suppliers \/ vendors\n/);

assert.deepEqual(mails[1].to, ["pat@example.com"]); assert.equal(mails[1].replyTo, "kevin@cohesiveinsure.com");
assert.ok(mails[1].text.includes(partnerLink(code))); assert.match(mails[1].text, /whether or not they buy/); assert.match(mails[1].text, /by Venmo\./);

// Nam 11/21: FB signups must answer business + sourcing; non-FB (cold email) signups need neither.
r = await handlePartnerSignup({ ...good, currentBusiness: "", sourcing: [] }, OFF, async () => true);
assert.equal(r.status, 400); assert.ok(r.body.errors.currentBusiness && r.body.errors.sourcing);
r = await handlePartnerSignup({ ...good, utm: { fbclid: "abc" }, currentBusiness: "", sourcing: ["bogus"] }, OFF, async () => true);
assert.equal(r.status, 400); assert.ok(r.body.errors.sourcing);
const coldMails = [];
r = await handlePartnerSignup({ ...good, utm: { utm_source: "smartlead" }, currentBusiness: "", sourcing: [] }, {}, async (m) => { coldMails.push(m); return true; }, () => code);
assert.equal(r.status, 200); assert.ok(!/Current business|Sourcing referrals/.test(coldMails[0].text));
mails.length = 0;

// Never quotes@ (fleet ingests it as insurance leads).
assert.deepEqual(alertRecipients({ REFERRAL_PARTNERS_EMAIL_TO: "x@example.com, quotes@cohesiveinsure.com" }), ["x@example.com"]);

// Honeypot: fake success, nothing sent.
mails.length = 0; r = await handlePartnerSignup({ ...good, website: "spam" }, OFF, ok);
assert.equal(r.body.ok, true); assert.equal(r.body.url, undefined); assert.equal(mails.length, 0);

// Validation.
r = await handlePartnerSignup({ ...good, agree: false, payoutHandle: "", phone: "12" }, OFF, ok);
assert.equal(r.status, 400); assert.ok(r.body.errors.agree && r.body.errors.payoutHandle && r.body.errors.phone); assert.equal(mails.length, 0);

// Header injection stripped from subject.
await handlePartnerSignup({ ...good, businessName: "Evil\r\nBcc: x@y.z" }, OFF, ok);
assert.ok(!/[\r\n]/.test(mails.at(-2).subject));

// Alert fails -> 502, no code handed out, no welcome email.
mails.length = 0; r = await handlePartnerSignup(good, OFF, async (m) => { mails.push(m); return false; });
assert.equal(r.status, 502); assert.equal(r.body.code, undefined); assert.equal(mails.length, 1);

// Welcome fails -> still ok (the link is on screen).
let n = 0; r = await handlePartnerSignup(good, OFF, async () => { if (n++) throw new Error("x"); return true; });
assert.equal(r.status, 200); assert.ok(r.body.url);
console.log("referral-partners: all assertions passed");
