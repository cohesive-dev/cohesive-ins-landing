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
const { metroUpdatedForPath } = require('../lib/seo/metro-pages.ts');
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

// New state profiles must reach the composed pages without reopening restricted routes
// or reintroducing national price floors as state-specific evidence.
const { STATE_EXPANSION_PROFILES } = require('../lib/seo/state-expansion-profiles.ts');
const release = JSON.parse(fs.readFileSync(path.join(root, 'public/.well-known/cohesive-content-release.json')));
const stateKeys = Object.keys(STATE_EXPANSION_PROFILES);
assert.equal(stateKeys.length, 12);
for (const key of stateKeys) {
  const [trade, state] = key.split('/');
  assert.ok(contractorStateBuildable(trade, state));
  const p = buildContractorState(getContractorState(state), getTrade(trade));
  assert.equal(p.reviewedOn, '2026-09-14');
  assert.ok(p.stateFacts.filter(f => f.source?.href.startsWith('https://')).length >= 2);
  assert.doesNotMatch([p.title, p.heroSub, ...p.costRows.map(r => r.range)].join(' '), /from \$|as low as|\/mo|instant/i);
  assert.ok(sitemap.some(s => s.url.endsWith('/insurance/' + key) && s.lastModified === (metroUpdatedForPath('/insurance/' + key) || (['pool', 'remodeler'].includes(trade) ? '2026-09-15' : '2026-09-14'))));
  if (release.release === 'seo-20260914-state-depth-v1') assert.ok(release.paths.includes('/insurance/' + key));
}
for (const trade of ['pool', 'tree-service', 'remodeler', 'painter', 'handyman', 'roofer']) {
  for (const state of ['california', 'michigan', 'washington']) {
    assert.equal(contractorStateBuildable(trade, state), false);
    assert.ok(!sitemap.some(s => s.url.endsWith(`/insurance/${trade}/${state}`)));
  }
}
for (const state of ['new-york', 'florida']) assert.equal(contractorStateBuildable('roofer', state), false);
const ny = buildContractorState(getContractorState('new-york'), getTrade('painter'));
assert.match(JSON.stringify(ny.stateFacts), /New York City|NYC/);
assert.match(JSON.stringify(ny.stateFacts), /not acceptable proof/);
const okRoof = buildContractorState(getContractorState('oklahoma'), getTrade('roofer'));
assert.match(JSON.stringify(okRoof.stateFacts), /future milestones/);
assert.match(JSON.stringify(okRoof.stateFacts), /January 1, 2028/);
console.log('PASS: 12 state profiles composed, notification coverage, source links, truthful pricing, local/future rule scope and placement restrictions.');

// Shared coverage review must survive the priority-profile FAQ replacements.
const { withConstructionHazardReview } = require('../lib/seo/construction-hazard-review.ts');
for (const trade of ['pool', 'remodeler']) {
  const t = getTrade(trade), pattern = trade === 'pool' ? /silica claims/ : /occupied-home project/;
  const composed = [buildContractorNational(t), ...CONTRACTOR_STATE_SLUGS.filter(s => contractorStateBuildable(trade, s)).map(s => buildContractorState(getContractorState(s), t))];
  for (const p of composed) {
    assert.equal(p.faqs.filter(f => pattern.test(f.q)).length, 1);
    assert.deepEqual(withConstructionHazardReview(p, trade), p);
  }
  const texas = buildContractorState(getContractorState('texas'), t);
  assert.ok(texas.stateFacts.length > 0);
  const expected = [`/insurance/${trade}`, ...CONTRACTOR_STATE_SLUGS.filter(s => contractorStateBuildable(trade, s)).map(s => `/insurance/${trade}/${s}`)];
  for (const route of expected) {
    if (release.release === 'seo-20260915-pool-silica-remodeling-v1') assert.ok(release.paths.includes(route));
    assert.ok(sitemap.some(s => s.url.endsWith(route) && s.lastModified === (metroUpdatedForPath(route) || '2026-09-15')));
  }
}
const painter = buildContractorNational(getTrade('painter'));
assert.equal(withConstructionHazardReview(painter, 'painter'), painter);
console.log('PASS: pool/remodeler questions survive all state overrides, remain unique, preserve local facts and update only their release routes.');
