/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),Module=require('node:module');
const file=require('node:path').resolve(__dirname,'../lib/attribution.ts');const m=new Module(file);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);
const {visitorSource,attributionDetails}=m.exports;
const cases=[
 [{},'Direct / no referrer'],
 [{referrer:'https://www.cohesiveinsure.com/guides'},'Direct / no referrer'],
 [{referrer:'not-a-url'},'Direct / no referrer'],
 [{referrer:'https://www.google.com/'},'Google organic search'],
 [{referrer:'https://www.google.co.uk/'},'Google organic search'],
 [{referrer:'https://www.bing.com/'},'Bing organic search'],
 [{referrer:'https://duckduckgo.com/'},'DuckDuckGo organic search'],
 [{referrer:'https://search.yahoo.com/'},'Yahoo organic search'],
 [{referrer:'https://chatgpt.com/'},'ChatGPT (organic link)'],
 [{referrer:'https://l.facebook.com/'},'Facebook/Instagram (organic link)'],
 [{referrer:'https://www.roofingtalk.com/t/1'},'Referral from roofingtalk.com'],
 [{fbclid:'x',referrer:'https://www.google.com/'},'Meta ad'],
 [{ad_id:'1'},'Meta ad'],
 [{utm_source:'facebook'},'Meta ad'],
 [{gclid:'g',referrer:'https://www.google.com/'},'Google Ads'],
 [{utm_source:'google',utm_medium:'cpc'},'Google Ads'],
 [{msclkid:'m'},'Microsoft Ads'],
 [{utm_source:'chatgpt',utm_medium:'ads'},'Tagged link (chatgpt / ads)'],
 [{utm_source:'roofingcontractor',utm_medium:'referral'},'Tagged link (roofingcontractor / referral)'],
];
for(const [a,want] of cases) assert.equal(visitorSource(a),want,JSON.stringify(a));
const rows=attributionDetails({landing_page:'/insurance/roofer/texas'});
assert.deepEqual(rows,[{label:'Landing page',value:'/insurance/roofer/texas'},{label:'Visitor source',value:'Direct / no referrer'}]);
assert.equal(attributionDetails({}).filter(r=>r.label==='Visitor source').length,1);
console.log(`PASS: ${cases.length} visitor-source cases; every attribution block carries exactly one Visitor source row. No network.`);
