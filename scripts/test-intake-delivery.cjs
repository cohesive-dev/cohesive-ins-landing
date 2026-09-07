// Run with: node scripts/test-intake-delivery.cjs
// Exercise the real route and MIME composer; all external delivery is replaced locally.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalLoad = Module._load;
let emailOk = true, crmMode = 'accepted', crmCalls = [], emails = [], rawMessages = [];
let mockNotification = true;
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true }, fileName: filename,
}).outputText, filename);
Module._load = function (request, parent, isMain) {
  if (request === '@/lib/notify' && mockNotification) return { sendIntakeNotification: async fields => { emails.push(fields); return emailOk; } };
  if (request === '@/lib/gmail') return { QUOTES_ADDRESS: 'quotes@cohesiveinsure.com', sendRawFromQuotes: async raw => { rawMessages.push(raw.toString()); return emailOk; } };
  if (request.startsWith('@/')) request = path.join(root, request.slice(2));
  return originalLoad.call(this, request, parent, isMain);
};
global.fetch = async (url, options) => {
  assert.equal(url, 'https://crm.cohesiveinsure.com/api/webhooks/inbound-lead', 'Unexpected network destination');
  crmCalls.push(JSON.parse(options.body));
  if (crmMode === 'timeout') throw new Error('Simulated timeout');
  if (crmMode === 'html') return new Response('<html>Gateway</html>', { status: 200 });
  return new Response(JSON.stringify({ ok: crmMode === 'accepted' }), { status: crmMode === 'http-failure' ? 503 : 200 });
};
const { NextRequest } = require('next/server');
const { POST } = require('../app/api/intake/route.ts');
const base = { name: 'Internal Test', email: 'test@example.invalid', phone: '2025550123', company: 'Internal Test LLC', businessType: 'Roofing', source: 'seo-startup-how-to-start-a-roofing-business-in-new-jersey', startupState: 'new-jersey', details: [{ label: 'State', value: 'Wrong client state' }, { label: 'Starting or coverage timeline', value: 'Within 30 days' }, { label: 'Planned operations', value: 'x'.repeat(2000) }] };
async function submit(body) {
  crmCalls = []; emails = [];
  const response = await POST(new NextRequest('http://localhost/api/intake', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }));
  return { status: response.status, body: await response.json() };
}
(async () => {
  // Complete delivery and either-channel fallback preserve the captured lead.
  for (const [crm, mail, accepted] of [['accepted', true, true], ['accepted', false, true], ['http-failure', true, true], ['http-failure', false, false], ['false-ok', false, false], ['html', false, false], ['timeout', false, false]]) {
    crmMode = crm; emailOk = mail;
    const result = await submit(base);
    assert.equal(result.status, accepted ? 200 : 503, crm);
    assert.equal(result.body.ok, accepted, crm);
    assert.equal(result.body.notification, mail ? 'sent' : 'failed');
    assert.equal(result.body.crm, crm === 'accepted' ? 'sent' : 'failed');
    assert.equal(crmCalls.length, 1); assert.equal(emails.length, 1);
    assert.equal(crmCalls[0].source, 'webform');
    assert.equal(crmCalls[0].suppress_first_touch, 'true');
    assert.equal(crmCalls[0].business_name, base.company);
    assert.equal(emails[0].company, base.company);
    for (const fields of [crmCalls[0].details, emails[0].details]) {
      assert.equal(fields.find(x => x.label === 'State').value, 'New Jersey');
      assert.equal(fields.find(x => x.label === 'Planned operations').value.length, 2000);
      assert.equal(fields.find(x => x.label === 'Starting or coverage timeline').value, 'Within 30 days');
    }
  }
  for (const body of [null, [], { ...base, startupState: 'california' }, { ...base, startupState: 'florida' }, { ...base, source: 'seo-startup-invalid' }]) {
    assert.equal((await submit(body)).status, 400);
    assert.equal(crmCalls.length, 0); assert.equal(emails.length, 0);
  }
  emailOk = true; crmMode = 'accepted';
  await submit({ ...base, source: 'commercial-property-landing' });
  assert.deepEqual(crmCalls[0].coverage, ['Property']); assert.equal(crmCalls[0].suppress_first_touch, 'true');
  await submit({ ...base, source: 'ordinary-webform' }); assert.equal(crmCalls[0].suppress_first_touch, undefined);
  await submit({ ...base, partial: true }); assert.equal(crmCalls.length, 0); assert.equal(emails.length, 0);
  await submit({ ...base, final: true }); assert.equal(crmCalls.length, 0); assert.equal(emails[0].partial, true);
  emailOk = false;
  assert.equal((await submit({ ...base, source: 'restaurant-landing', capiEventName: 'RestaurantDisqualified' })).status, 503);
  assert.equal(crmCalls.length, 0);
  emailOk = true;
  assert.equal((await submit({ ...base, source: 'restaurant-landing', capiEventName: 'RestaurantDisqualified' })).body.notification, 'sent');
  // The real notification wrapper must return the transport result and include the business.
  mockNotification = false;
  const { sendIntakeNotification } = require('../lib/notify.ts');
  for (const expected of [false, true]) {
    emailOk = expected;
    assert.equal(await sendIntakeNotification({ name: 'Internal Test', company: 'Internal Test LLC', email: 'test@example.invalid', source: base.source }), expected);
    assert.match(rawMessages.at(-1), /To: quotes@cohesiveinsure.com/);
    assert.match(rawMessages.at(-1), /Business name: Internal Test LLC/);
  }
  console.log('PASS: real intake route acceptance/fallback/failure, invalid payloads, authoritative details, full operations text, first-touch suppression, legacy lane routing, and MIME delivery status. No external requests or messages.');
})().catch(error => { console.error(error); process.exitCode = 1; });
