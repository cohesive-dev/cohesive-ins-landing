// Run with: node scripts/test-referral-partner-notice.cjs
/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), Module = require("node:module"), ts = require("typescript");
const root = path.resolve(__dirname, "..");
require.extensions[".ts"] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: f }).outputText, f);
const load = Module._load;
Module._load = function (r, p, m) { if (r.startsWith("@/")) r = path.join(root, r.slice(2)); return load.call(this, r, p, m); };
const { alertText } = require("../lib/referral-partners.ts");
const { notifyReferralPartner, lookupPartner } = require("../lib/referral-partner-notice.ts");
(async () => {

const code = "a1b2c3d4e5f60718293a";
const alert = alertText({ fullName: "Pat Builder", businessName: "Pat GC LLC", email: "Pat@Example.com", phone: "5551234567", payoutHandle: "pat" }, code);
const queries = [];
const find = async (q) => { queries.push(q); return alert; };
const mails = [];
const mail = async (m) => { mails.push(m); return true; };

// Lookup parses the real alert format.
assert.deepEqual(await lookupPartner(code, find), { code, name: "Pat Builder", email: "pat@example.com", rate: 40 });
assert.match(alert, /^RATE_USD: 40$/m);
// Rate is per partner: a $30 partner's notice says $30/$90; an old alert without RATE_USD = $40.
assert.equal((await lookupPartner(code, async () => alert.replace("RATE_USD: 40", "RATE_USD: 30"))).rate, 30);
assert.equal((await lookupPartner(code, async () => alert.replace(/^RATE_USD.*\n/m, ""))).rate, 40);
// Kevin 11/23: cold = cold-email (smartlead) signup; only those partners keep the no-website-only proof rule.
assert.equal((await lookupPartner(code, async () => alert + "\nSource: smartlead / 4660664 Cohesive Insurance | Referral Program")).cold, true);
assert.equal((await lookupPartner(code, async () => alert + "\nSIGNUP_CHANNEL: cold_email")).cold, true);
assert.equal((await lookupPartner(code, async () => alert + "\nSource: facebook / gc")).cold, undefined);
assert.equal((await lookupPartner(code, find)).cold, undefined);
{ const m2 = []; await notifyReferralPartner({ code, company: "Z Co" }, {}, async () => alert.replace("RATE_USD: 40", "RATE_USD: 30"), async (m) => { m2.push(m); return true; });
  assert.match(m2[0].text, /next \$90 \(\$30 each/); }
assert.equal(queries[0], `in:sent subject:"[referral-partner]" "${code}"`);

// Kevin 11/23: a shut-down partner code is no partner (no lookup, no notice); env adds more codes.
{ const blocked = "267047b09879e8e16c95"; const q = []; const m3 = [];
  assert.equal(await lookupPartner(blocked, async (x) => { q.push(x); return alert.replace(code, blocked); }), null);
  assert.equal(q.length, 0);
  assert.equal(await notifyReferralPartner({ code: blocked, company: "X" }, {}, async () => alert.replace(code, blocked), async (m) => { m3.push(m); return true; }), "no-partner");
  assert.equal(m3.length, 0);
  process.env.REFERRAL_BLOCKED_CODES = ` ${code} `; assert.equal(await lookupPartner(code, find), null); delete process.env.REFERRAL_BLOCKED_CODES;
  assert.ok(await lookupPartner(code, find)); }

// Sent: partner only, business name only, no contact details of the sub.
let r = await notifyReferralPartner({ code, company: "Acme Plumbing", name: "Al Sub", email: "al@acme.com" }, {}, find, mail);
assert.equal(r, "sent"); assert.equal(mails.length, 1);
assert.deepEqual(mails[0].to, ["pat@example.com"]); assert.equal(mails[0].replyTo, "kevin@cohesiveinsure.com");
assert.equal(mails[0].subject, "Acme Plumbing used your referral link");
assert.match(mails[0].text, /^Hi Pat,/); assert.match(mails[0].text, /Acme Plumbing just requested a quote/); assert.match(mails[0].text, /next \$120 \(\$40 each/);
assert.ok(!mails[0].text.includes("al@acme.com") && !mails[0].text.includes("Al Sub"));

// Falls back to the person's name, strips header injection.
mails.length = 0; await notifyReferralPartner({ code, company: "", name: "Al\r\nBcc: x@y.z" }, {}, find, mail);
assert.ok(!/[\r\n]/.test(mails[0].subject));

// Self-referral, off switch, unknown code, mismatched alert, throwing deps: no mail.
mails.length = 0;
assert.equal(await notifyReferralPartner({ code, company: "Pat GC", email: "pat@example.com" }, {}, find, mail), "self");
assert.equal(await notifyReferralPartner({ code, company: "X" }, { REFERRAL_PARTNER_NOTICE: "off" }, find, mail), "off");
assert.equal(await notifyReferralPartner({ code, company: "X" }, {}, async () => null, mail), "no-partner");
assert.equal(await notifyReferralPartner({ code: "ffffffffffffffffffff", company: "X" }, {}, find, mail), "no-partner");
assert.equal(await notifyReferralPartner({ code: "bad", company: "X" }, {}, find, mail), "no-partner");
assert.equal(await notifyReferralPartner({ code, company: "X" }, {}, async () => { throw new Error("x"); }, mail), "failed");
assert.equal(mails.length, 0);
assert.equal(await notifyReferralPartner({ code, company: "X" }, {}, find, async () => false), "failed");
// Desk 11/20 copy QA 5: REFERRAL_NOTICE_PER_QUOTE=on -> "That's another $40 once we quote it." (default OFF = old sentence).
{ const m3 = []; await notifyReferralPartner({ code, company: "Q Co" }, { REFERRAL_NOTICE_PER_QUOTE: "on" }, find, async (m) => { m3.push(m); return true; });
  assert.match(m3[0].text, /That's another \$40 once we quote it\. Keep sharing your link!/);
  assert.ok(!m3[0].text.includes("$120") && !m3[0].text.includes("every 3"));
  const m4 = []; await notifyReferralPartner({ code, company: "Q Co" }, { REFERRAL_NOTICE_PER_QUOTE: "yes" }, find, async (m) => { m4.push(m); return true; });
  assert.match(m4[0].text, /next \$120 \(\$40 each/);
  const m5 = []; await notifyReferralPartner({ code, company: "Q Co" }, { REFERRAL_NOTICE_PER_QUOTE: "on" }, async () => alert.replace("RATE_USD: 40", "RATE_USD: 30"), async (m) => { m5.push(m); return true; });
  assert.match(m5[0].text, /That's another \$30 once we quote it/); }
// Nam 11/21: Industry "Other" -> partner told it is not a qualifying referral; no earnings line.
{ const m6 = []; assert.equal(await notifyReferralPartner({ code, company: "Smoke Co", industry: "Other" }, {}, find, async (m) => { m6.push(m); return true; }), "sent");
  assert.equal(m6[0].subject, "Smoke Co used your referral link");
  assert.match(m6[0].text, /doesn't count as a qualifying referral/); assert.ok(!m6[0].text.includes("$"));
  const m7 = []; await notifyReferralPartner({ code, company: "Roof Co", industry: "Contractor or trade business" }, {}, find, async (m) => { m7.push(m); return true; });
  assert.match(m7[0].text, /next \$120/); }
// Nam 11/21: IP/mailing-state mismatch -> "Where did this lead come from?" with no reason given; ineligible copy is short.
{ const m8 = []; await notifyReferralPartner({ code, company: "Hurd Co", industry: "Contractor or trade business", suspicious: true }, {}, find, async (m) => { m8.push(m); return true; });
  assert.match(m8[0].text, /Where did this lead come from\? It does not seem like a real lead unfortunately based on submission data\./);
  assert.ok(!/IP|address|state|\$/.test(m8[0].text.replace("Hi Pat,", "")));
  const m9 = []; await notifyReferralPartner({ code, company: "Smoke Co", industry: "Other" }, {}, find, async (m) => { m9.push(m); return true; });
  assert.ok(!m9[0].text.includes("reach out") && !m9[0].text.includes("keep sharing")); }
console.log("referral-partner-notice: all assertions passed");
})().catch((e) => { console.error(e); process.exit(1); });
