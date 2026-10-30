const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: filename,
}).outputText, filename);
const { contractorFallbackReason } = require('../lib/contractor-landing-params.ts');
const { INDUSTRIES } = require('../lib/contractor-experiment.ts');
for (const [industry, angle] of [
  ['roof', 'claims_occurrence'], ['tree', 'job_coi'],
  ['fire_sprinkler', 'project_coi'], ['home_builder', 'ground_up'],
]) {
  const query = new URLSearchParams({ industry, angle });
  assert.equal(contractorFallbackReason(query), null, `${industry}/${angle} must retain its trade context`);
  assert.ok(INDUSTRIES[industry], `${industry} has a named trade`);
}
assert.equal(contractorFallbackReason(new URLSearchParams({ industry: 'tree', angle: 'not-a-real-test' })), 'invalid_industry_angle_pair');
console.log('PASS: four launched ad links keep their intended trade and invalid links still use the safe fallback.');
