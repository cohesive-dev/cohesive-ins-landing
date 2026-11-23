// Reddit pixel (Kevin 11/23): Lead fires only for a CRM-accepted, server-eligible conversion,
// with the shared conversion id; the base code is production-deploy only. Run: node scripts/test-reddit-pixel.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
function load(rel){const file=path.resolve(__dirname,'..',rel);const m=new Module(file);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);return m.exports;}
const calls=[];global.window={rdt:(...a)=>calls.push(a)};
const px=load('lib/reddit-pixel.ts');
assert.equal(px.REDDIT_PIXEL_ID,'a2_k1rko86m4pgj');
const ok={ok:true,crm:'sent',conversion:{eligible:true,eventId:'evt-1'}};
assert.equal(px.trackRedditLead(ok),true);
assert.deepEqual(calls.pop(),['track','Lead',{conversionId:'evt-1'}]);
const never=[
 ['partial (crm skipped)',{ok:true,crm:'skipped',notification:'sent',conversion:{eligible:true,eventId:'evt-p'}}],
 ['quotes@-only fallback',{ok:true,crm:'failed',notification:'sent',conversion:{eligible:false}}],
 ['crm failed but eligible flag',{ok:true,crm:'failed',conversion:{eligible:true,eventId:'evt-f'}}],
 ['duplicate / review',{ok:true,crm:'sent',conversion:{eligible:false,eventId:'evt-d',reason:'duplicate'}}],
 ['rejected',{ok:false,conversion:{eligible:false}}],
 ['no conversion verdict (non-guarded lane)',{ok:true,crm:'sent',notification:'sent'}],
 ['eligible without id',{ok:true,crm:'sent',conversion:{eligible:true}}],
 ['null',null],
];
for(const [name,r] of never)assert.equal(px.trackRedditLead(r),false,name);
assert.equal(calls.length,0,'no Lead for ineligible results');
px.redditPageVisit();assert.deepEqual(calls.pop(),['track','PageVisit']);
const layout=fs.readFileSync(path.resolve(__dirname,'..','app/layout.tsx'),'utf8');
assert.match(layout,/https:\/\/www\.redditstatic\.com\/ads\/pixel\.js/);
assert.match(layout,/const ENABLE_REDDIT = ENABLE_GTM;/);
assert.match(layout,/<RedditPageVisit \/>/);
for(const f of ['app/contractors/page.tsx','components/ContractorIntake.tsx','components/ContractorExperimentForm.tsx','components/ContractorQuoteForm.tsx','components/CommercialPropertyForm.tsx','components/RestaurantIntakeForm.tsx','components/RestaurantQuickQuote.tsx','components/es/SpanishRestaurantForm.tsx','components/es/SpanishContractorForm.tsx'])
 assert.match(fs.readFileSync(path.resolve(__dirname,'..',f),'utf8'),/trackRedditLead\(result\)/,f);
console.log('PASS: Reddit Lead only for crm=sent + eligible conversion with the shared id ('+never.length+' ineligible cases); base code production-only; PageVisit per route; 9 forms wired.');
