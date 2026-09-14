// Exercise composed page data and generated guide/sitemap records; no network.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module'), ts = require('typescript');
const root = path.resolve(__dirname, '..'), originalLoad = Module._load;
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: f }).outputText, f);
Module._load = function (req, parent, main) { return originalLoad.call(this, req.startsWith('@/') ? path.join(root, req.slice(2)) : req, parent, main); };
const { getTrade, buildContractorNational } = require('../lib/seo/contractors.ts');
const { CONTRACTOR_STATE_SLUGS, getContractorState, buildContractorState, contractorStateBuildable } = require('../lib/seo/contractor-states.ts');
const { STARTUP_GUIDES } = require('../lib/guides/catalog.ts');
const sitemap = require('../app/sitemap.ts').default();
const pool = getTrade('pool');
assert.equal(pool.intakeLabel, 'Pool & Spa');
const pages = [buildContractorNational(pool), ...CONTRACTOR_STATE_SLUGS.filter(s => contractorStateBuildable('pool', s)).map(s => buildContractorState(getContractorState(s), pool))];
for (const page of pages) {
  assert.match(page.title, /Swimming Pool Contractor|Pool Construction/);
  assert.doesNotMatch(page.title, /\$|Instant|Pool & Spa/);
  assert.doesNotMatch(JSON.stringify(page.costRows), /69|89|from \$/);
  assert.ok(page.faqs.length && page.priceDrivers.length);
}
assert.match(buildContractorState(getContractorState('texas'), pool).heroSub, /gunite/);
assert.match(buildContractorState(getContractorState('new-jersey'), pool).heroSub, /excavate/);
assert.match(buildContractorState(getContractorState('massachusetts'), getTrade('carpenter')).title, /Carpenter Insurance in Massachusetts/);
const resourceSlugs = [...require('../lib/guides/trade-coverage-resources.ts').TRADE_COVERAGE_RESOURCES.map(g => g.slug), 'cleaning-insurance-customer-property-damage', 'contractor-insurance-quote-comparison', 'general-contractor-subcontractor-insurance-checklist', 'pool-construction-vs-maintenance-insurance', 'tree-service-insurance-quote-checklist'];
for (const slug of resourceSlugs) {
  const guide = STARTUP_GUIDES.find(g => g.slug === slug); assert.ok(guide);
  assert.equal(new Set(guide.sections.map(s => s.id)).size, guide.sections.length);
  assert.ok(guide.sections.some(s => s.checklist?.length));
  assert.ok(sitemap.some(s => s.url.endsWith('/guides/' + slug)));
  for (const link of guide.sections.flatMap(s => s.links || [])) if (link.href.startsWith('/checklists/')) assert.ok(fs.existsSync(path.join(root, 'public', link.href)));
}
const cashGuides = STARTUP_GUIDES.filter(g => g.sections.some(s => s.id === 'startup-cash-plan'));
assert.equal(cashGuides.length, 102);
for (const g of cashGuides.filter(g => g.noQuote)) assert.ok(!g.sections.some(s => s.id === 'cohesive-ai-referrals'));
assert.ok(!sitemap.some(s => s.url.endsWith('/about')));
assert.ok(!sitemap.some(s => s.url.endsWith('/insurance/pool/california')));
assert.equal(new Set(sitemap.map(s => s.url)).size, sitemap.length);
console.log(`PASS: ${pages.length} pool pages, state-profile precedence, ${resourceSlugs.length} resource guides, 102 cash plans, sitemap uniqueness and restricted-state scope. No network.`);
