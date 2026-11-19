import assert from "node:assert/strict";
import { handlePartnerSignup, alertRecipients, partnerLink } from "../lib/referral-partners.ts";
import { referralCode } from "../lib/referral-code.ts";

const good = { fullName: "Pat Builder", businessName: "Pat GC LLC", trade: "GC", email: "Pat@Example.com", phone: "(555) 123-4567",
  payoutHandle: "@pat-builds", agree: true, utm: { utm_source: "facebook", utm_campaign: "gc-referral" } };
const mails = [];
const ok = async (m) => { mails.push(m); return true; };
const code = "a1b2c3d4e5f60718293a";

let r = await handlePartnerSignup(good, {}, ok, () => code);
assert.equal(r.status, 200); assert.equal(r.body.ok, true); assert.equal(r.body.code, code);
assert.equal(r.body.url, "https://www.cohesiveinsure.com/refer?ref=" + code);
assert.equal(referralCode(code), code, "partner code must pass /refer validation");
assert.equal(mails.length, 2);
assert.deepEqual(mails[0].to, ["kevin@cohesiveinsure.com", "nam@cohesiveinsure.com"]);
assert.match(mails[0].subject, /^\[referral-partner\] Pat GC LLC - Pat Builder$/);
assert.match(mails[0].text, new RegExp("PARTNER_CODE: " + code));
assert.match(mails[0].text, /Payout: Venmo - @pat-builds/);
assert.match(mails[0].text, /Source: facebook \/ gc-referral/);
assert.deepEqual(mails[1].to, ["pat@example.com"]); assert.equal(mails[1].replyTo, "kevin@cohesiveinsure.com");
assert.ok(mails[1].text.includes(partnerLink(code))); assert.match(mails[1].text, /whether or not they buy/); assert.match(mails[1].text, /by Venmo\./);

// Never quotes@ (fleet ingests it as insurance leads).
assert.deepEqual(alertRecipients({ REFERRAL_PARTNERS_EMAIL_TO: "x@example.com, quotes@cohesiveinsure.com" }), ["x@example.com"]);

// Honeypot: fake success, nothing sent.
mails.length = 0; r = await handlePartnerSignup({ ...good, website: "spam" }, {}, ok);
assert.equal(r.body.ok, true); assert.equal(r.body.url, undefined); assert.equal(mails.length, 0);

// Validation.
r = await handlePartnerSignup({ ...good, agree: false, payoutHandle: "", phone: "12" }, {}, ok);
assert.equal(r.status, 400); assert.ok(r.body.errors.agree && r.body.errors.payoutHandle && r.body.errors.phone); assert.equal(mails.length, 0);

// Header injection stripped from subject.
await handlePartnerSignup({ ...good, businessName: "Evil\r\nBcc: x@y.z" }, {}, ok);
assert.ok(!/[\r\n]/.test(mails.at(-2).subject));

// Alert fails -> 502, no code handed out, no welcome email.
mails.length = 0; r = await handlePartnerSignup(good, {}, async (m) => { mails.push(m); return false; });
assert.equal(r.status, 502); assert.equal(r.body.code, undefined); assert.equal(mails.length, 1);

// Welcome fails -> still ok (the link is on screen).
let n = 0; r = await handlePartnerSignup(good, {}, async () => { if (n++) throw new Error("x"); return true; });
assert.equal(r.status, 200); assert.ok(r.body.url);
console.log("referral-partners: all assertions passed");
