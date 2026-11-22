const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
function load(rel,deps={}){const file=path.resolve(__dirname,'..',rel);const m=new Module(file);m.require=(id)=>deps[id]||require(id);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);return m.exports;}
const attr=load('lib/attribution.ts');const {trafficChannel}=attr;
const cases=[
 [{ad_id:'120252457392220660',utm_source:'facebook'},'meta'],[{fbclid:'x'},'meta'],
 [{utm_source:'google',utm_medium:'cpc'},'google_ads'],[{gclid:'abc'},'google_ads'],
 [{msclkid:'m'},'microsoft_ads'],
 [{utm_source:'chatgpt',utm_medium:'cpc'},'chatgpt_ads'],
 [{utm_source:'chatgpt.com'},'ai_referral'],[{referrer:'https://chatgpt.com/'},'ai_referral'],[{referrer:'https://www.perplexity.ai/search'},'ai_referral'],[{referrer:'https://gemini.google.com/app'},'ai_referral'],
 [{utm_source:'smartlead',utm_medium:'email'},'email'],
 [{referrer:'https://www.google.com/'},'organic_search'],[{referrer:'https://search.yahoo.com/'},'organic_search'],[{referrer:'https://www.bing.com/'},'organic_search'],
 [{referrer:'https://l.facebook.com/'},'social_organic'],
 [{utm_source:'newsletter'},'tagged_other'],
 [{referrer:'https://example.org/post'},'referral'],
 [{},'direct'],[{referrer:'https://www.cohesiveinsure.com/x'},'direct'],
];
for(const [a,want] of cases)assert.equal(trafficChannel(a),want,JSON.stringify(a));
const {validateFunnelEvent}=load('lib/funnel-event.ts',{'./attribution':attr});
const u='00000000-0000-4000-8000-000000000001';
const base={eventId:u,sessionId:u,cellId:'roof__quote__step__v1',version:'2026-11-19-short-ai-v2',event:'variant_view',elapsedMs:0};
assert.ok(validateFunnelEvent(base));
for(const c of attr.TRAFFIC_CHANNELS)assert.ok(validateFunnelEvent({...base,channel:c}),c);
assert.equal(validateFunnelEvent({...base,channel:'someone@example.com'}),null);
console.log('PASS: traffic channel classification for '+cases.length+' cases; funnel events accept every channel and reject arbitrary values.');
