const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function load(file){const module={exports:{}};const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInThisContext('(function(exports,module){'+js+'\n})')(module.exports,module);return module.exports;}
const {coldEmailContext,coldEmailUrl,COLD_CAMPAIGNS}=load('lib/cold-email-landing.ts');
const {validateFunnelEvent}=load('lib/funnel-event.ts');
for(const campaign of Object.keys(COLD_CAMPAIGNS))for(const layout of ['long','step']){
 const url=new URL(coldEmailUrl(layout,campaign));assert.equal(url.pathname,`/email/contractors/${layout}`);
 assert.equal(url.searchParams.get('utm_source'),'smartlead');assert.equal(url.searchParams.get('utm_medium'),'email');
 url.searchParams.set('layout',layout==='step'?'long':'step');url.searchParams.set('industry','hvac');
 const c=coldEmailContext(url.searchParams,layout);assert.equal(c.industry,COLD_CAMPAIGNS[campaign].industry);assert.ok(c.cellId.endsWith(`__${layout}__v1`));
 assert.ok(validateFunnelEvent({eventId:'00000000-0000-4000-8000-000000000001',sessionId:'00000000-0000-4000-8000-000000000002',cellId:c.cellId,version:'2026-09-12-v1',event:'page_view',elapsedMs:0}));
 assert.equal(c.campaign,campaign);
}
const unknown=coldEmailContext(new URLSearchParams('industry=roof&utm_campaign=someone@example.com'),'long');
assert.equal(unknown.campaign,'unattributed');assert.equal(unknown.cellId,'roof__email_direct__long__v1');
assert.equal(coldEmailContext(new URLSearchParams('utm_campaign=__proto__&industry=pool'),'step').campaign,'unattributed');
assert.equal(coldEmailContext(new URLSearchParams(),'long').industry,'');
console.log('PASS: eight campaign/layout URLs; fixed layout and mapped industry; accepted client event shape; unknown/private campaign omitted; prototype key rejected; bare URL requires trade selection.');
