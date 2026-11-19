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
assert.deepEqual(await lookupPartner(code, find), { code, name: "Pat Builder", email: "pat@example.com" });
assert.equal(queries[0], `in:sent subject:"[referral-partner]" "${code}"`);

// Sent: partner only, business name only, no contact details of the sub.
let r = await notifyReferralPartner({ code, company: "Acme Plumbing", name: "Al Sub", email: "al@acme.com" }, {}, find, mail);
assert.equal(r, "sent"); assert.equal(mails.length, 1);
assert.deepEqual(mails[0].to, ["pat@example.com"]); assert.equal(mails[0].replyTo, "kevin@cohesiveinsure.com");
assert.equal(mails[0].subject, "Acme Plumbing used your referral link");
assert.match(mails[0].text, /^Hi Pat,/); assert.match(mails[0].text, /Acme Plumbing just requested a quote/);
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
console.log("referral-partner-notice: all assertions passed");
})().catch((e) => { console.error(e); process.exit(1); });
