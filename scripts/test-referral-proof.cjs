// Run with: node scripts/test-referral-proof.cjs
/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), Module = require("node:module"), ts = require("typescript");
const root = path.resolve(__dirname, "..");
require.extensions[".ts"] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: f }).outputText, f);
const load = Module._load;
Module._load = function (r, p, m) { if (r.startsWith("@/")) r = path.join(root, r.slice(2)); return load.call(this, r, p, m); };
const { checkFein, parseProof, parseVerdict, reviewProof, DEFAULT_IMAGE_MODEL, DEFAULT_PDF_MODEL } = require("../lib/referral-proof.ts");
const { alertText } = require("../lib/referral-partners.ts");
const { lookupPartner, notifyReferralPartner } = require("../lib/referral-partner-notice.ts");
(async () => {
// FEIN shape + IRS prefix
assert.equal(checkFein("45-2781903"), "45-2781903"); assert.equal(checkFein("12-3456789"), null); // the placeholder itself
assert.equal(checkFein("27 1234567"), "27-1234567");
for (const bad of ["", "12345678", "1234567890", "00-1234567", "07-1234567", "89-1234567", "11-1111111", "123456789", "ab-cdefghi", "96-1234567"]) assert.equal(checkFein(bad), null, bad);
// payload shape
assert.equal(parseProof(null), null);
assert.equal(parseProof({ name: "a.jpg", type: "image/jpeg", data: "not base64!" }), null);
assert.equal(parseProof({ name: "a.jpg", type: "image/jpeg", data: "A".repeat(3_400_000) }), null); // > 2.5MB decoded
assert.deepEqual(parseProof({ name: "../x<y>.pdf", type: "application/pdf", data: "data:application/pdf;base64,QUJD" }), { name: ".._x_y_.pdf", type: "application/pdf", data: "QUJD" });
// verdict parsing
assert.deepEqual(parseVerdict('```json\n{"verdict":"PASS","reason":"license names Acme LLC"}\n```'), { verdict: "pass", reason: "license names Acme LLC" });
assert.equal(parseVerdict("FAIL - selfie").verdict, "fail");
assert.equal(parseVerdict("hmm").verdict, "unclear");
// Bedrock call: image -> Luna, pdf -> Sonnet, bearer key, never throws
const calls = [];
const fakeFetch = (reply, status = 200) => async (url, init) => { calls.push({ url, init }); return { ok: status < 300, status, json: async () => reply }; };
const env = { BEDROCK_LLM_API: "k" };
const ok = { output: { message: { content: [{ text: '{"verdict":"PASS","reason":"ok"}' }] } } };
let r = await reviewProof({ name: "p.jpg", type: "image/jpeg", data: "QUJD" }, { company: "Acme" }, env, fakeFetch(ok));
assert.equal(r.verdict, "pass"); assert.equal(r.model, DEFAULT_IMAGE_MODEL);
assert.match(calls[0].url, /bedrock-runtime\.us-east-1\.amazonaws\.com\/model\/us\.openai\.gpt-5\.6-luna\/converse$/);
assert.equal(calls[0].init.headers.Authorization, "Bearer k");
assert.equal(JSON.parse(calls[0].init.body).messages[0].content[0].image.format, "jpeg");
r = await reviewProof({ name: "p.pdf", type: "application/pdf", data: "QUJD" }, {}, env, fakeFetch(ok));
assert.equal(r.model, DEFAULT_PDF_MODEL); assert.ok(JSON.parse(calls[1].init.body).messages[0].content[0].document);
assert.equal((await reviewProof({ name: "p.jpg", type: "image/jpeg", data: "QUJD" }, {}, {}, fakeFetch(ok))).verdict, "unclear"); // no key
assert.equal((await reviewProof({ name: "p.heic", type: "image/heic", data: "QUJD" }, {}, env, fakeFetch(ok))).verdict, "unclear");
assert.equal((await reviewProof({ name: "p.jpg", type: "image/jpeg", data: "QUJD" }, {}, env, fakeFetch({}, 500))).verdict, "unclear");
assert.equal((await reviewProof({ name: "p.jpg", type: "image/jpeg", data: "QUJD" }, {}, env, async () => { throw new Error("x"); })).verdict, "unclear");
// Partner channel: FB-ad signups carry SIGNUP_CHANNEL and look up as facebook; cold-email ones don't.
const code = "a1b2c3d4e5f60718293a";
const base = { fullName: "Pat Builder", businessName: "Pat GC LLC", email: "pat@example.com", phone: "5551234567", payoutHandle: "pat" };
const fbAlert = alertText({ ...base, utm: { utm_source: "facebook", utm_campaign: "gc-referral" } }, code);
assert.match(fbAlert, /^SIGNUP_CHANNEL: facebook$/m);
assert.equal((await lookupPartner(code, async () => fbAlert)).facebook, true);
assert.equal((await lookupPartner(code, async () => alertText(base, code))).facebook, undefined);
assert.equal((await lookupPartner(code, async () => alertText({ ...base, utm: { utm_source: "smartlead" } }, code))).facebook, undefined);
// hold = no partner mail
const mails = [];
assert.equal(await notifyReferralPartner({ code, company: "Z", hold: true }, {}, async () => fbAlert, async (m) => { mails.push(m); return true; }), "held");
assert.equal(mails.length, 0);
console.log("referral proof tests passed");
})().catch((e) => { console.error(e); process.exit(1); });
