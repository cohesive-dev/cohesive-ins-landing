const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),Module=require('node:module');
const file=require('node:path').resolve(__dirname,'../lib/attribution.ts');const m=new Module(file);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);const {captureAttribution}=m.exports;
let saved={};global.sessionStorage={getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v};global.window={location:{hostname:'www.cohesiveinsure.com',pathname:'/guides',search:''}};global.document={referrer:''};
for(const ref of ['https://search.yahoo.com/','https://www.google.com/','https://chatgpt.com/','https://www.bing.com/']){
 saved={};window.location.pathname='/guides';window.location.search='';document.referrer=ref;const first=captureAttribution();assert.equal(first.referrer,ref);assert.equal(first.landing_page,'/guides');
 window.location.pathname='/insurance/hvac/texas';document.referrer='https://www.cohesiveinsure.com/guides';assert.deepEqual(captureAttribution(),first);
 window.location.search='?utm_source=internal-mistake';assert.deepEqual(captureAttribution(),first);
}
for(const ref of ['', 'https://www.cohesiveinsure.com/guides','https://cohesiveinsure.com/','not-a-url']){saved={};window.location.search='';document.referrer=ref;assert.deepEqual(captureAttribution(),{});}
saved={};document.referrer='https://www.google.com/';window.location.search='?utm_source=facebook&ad_id=123456789';const paid=captureAttribution();assert.equal(paid.utm_source,'facebook');assert.equal(paid.ad_id,'123456789');window.location.search='';document.referrer='https://search.yahoo.com/';assert.deepEqual(captureAttribution(),paid);
for(const value of ['null','[]','"bad"','broken']){saved={cohesive_attr_v1:value};window.location.search='';document.referrer='https://chatgpt.com/';assert.equal(captureAttribution().referrer,'https://chatgpt.com/');}
console.log('PASS: four search referrers survive navigation, paid first touch retained, direct/internal unknown, malformed storage recovers. No network.');
