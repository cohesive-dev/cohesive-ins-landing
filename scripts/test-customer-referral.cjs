const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
process.env.META_CAPI_TOKEN = 'local-test-token';
const load = Module._load;
let forwarded, notified;
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: filename,
}).outputText, filename);
Module._load = function (request, parent, isMain) {
  if (request === '@/lib/notify') return { sendIntakeNotification: async (body) => { notified = body; return true; } };
  if (request.startsWith('@/')) request = path.join(root, request.slice(2));
  return load.call(this, request, parent, isMain);
};
global.fetch = async (url, options) => {
  assert.equal(url, 'https://crm.cohesiveinsure.com/api/webhooks/inbound-lead');
  forwarded = JSON.parse(options.body);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
const { NextRequest } = require('next/server');
const { POST } = require('../app/api/intake/route.ts');
async function submit(details) {
  forwarded = notified = undefined;
  const req = new NextRequest('http://localhost/api/intake', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
    source: 'customer-referral', name: 'Real Person', company: 'Real Roofing LLC', businessType: 'Roofing',
    email: 'person@example.com', phone: '2025550134', details,
  }) });
  const response = await POST(req);
  return { status: response.status, body: await response.json() };
}
(async () => {
  const code = '0123456789abcdefabcd';
  const result = await submit([{ label: 'Referral code', value: code }, { label: 'Referral landing page', value: '/refer' }]);
  assert.equal(result.status, 200); assert.equal(result.body.crm, 'sent');
  assert.equal(forwarded.source, 'webform'); assert.equal(forwarded.suppress_first_touch, 'true');
  assert.equal(forwarded.details.find((d) => d.label === 'Referral code').value, code);
  assert.equal(notified.details.find((d) => d.label === 'Referral code').value, code);
  const bad = await submit([{ label: 'Referral code', value: '<script>' }]);
  assert.equal(bad.status, 400); assert.equal(forwarded, undefined); assert.equal(notified, undefined);
  console.log('PASS: referred quote request preserves code in CRM and quotes@, suppresses automated first touch, rejects invalid code. No external requests.');
})().catch((e) => { console.error(e); process.exitCode = 1; });
