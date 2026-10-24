import assert from 'node:assert/strict';
import {prepare,notify} from './indexnow.mjs';
const key='a'.repeat(32),config={host:'www.cohesiveinsure.com',keyFile:key+'.txt'},manifest={release:'test',paths:['/guides/example']};
for(const p of ['https://evil.test/x','//evil.test/x','/guides/x?email=secret','/guides/../api/intake','/api/intake'])assert.throws(()=>prepare(config,{...manifest,paths:[p]},key));
assert.throws(()=>prepare(config,{...manifest,paths:['/guides/example','/guides/example']},key));
for(const mode of ['ok','pending','refused','old_release','bad_key','page_fail','noindex']){
 let posts=0;const request=async(url,opts)=>{
  if(opts.method==='POST'){posts++;assert.equal(url,'https://api.indexnow.org/indexnow');assert.deepEqual(JSON.parse(opts.body).urlList,['https://www.cohesiveinsure.com/guides/example']);return new Response('',{status:mode==='pending'?202:mode==='refused'?429:200});}
  if(url.endsWith('.txt'))return new Response(mode==='bad_key'?'wrong':key);
  if(url.endsWith('.json'))return Response.json(mode==='old_release'?{release:'old'}:manifest);
  return new Response('<link rel="canonical" href="'+url+'">'+(mode==='noindex'?'<meta name="robots" content="noindex">':''),{status:mode==='page_fail'?404:200});
 };
 if(['old_release','bad_key','page_fail','noindex'].includes(mode)){await assert.rejects(()=>notify(config,manifest,key,request));assert.equal(posts,0);}else{const r=await notify(config,manifest,key,request);assert.equal(posts,1);assert.equal(r.indexing,'not_proven');assert.equal(r.ok,mode!=='refused');if(mode==='pending')assert.equal(r.submission,'received_key_validation_pending');}
}
console.log('PASS: IndexNow validates host/path/release/key/canonical before notifying, distinguishes 200/202/refusal. No real requests.');

const large={release:'large',paths:Array.from({length:410},(_,i)=>'/guides/example-'+i)};
assert.equal(prepare(config,large,key).urlList.length,410);
assert.throws(()=>prepare(config,{...large,paths:Array.from({length:10001},(_,i)=>'/guides/p-'+i)},key));
for(const failLast of [false,true]){
 let reads=0,posts=0;const request=async(url,opts)=>{
  if(opts.method==='POST'){posts++;assert.equal(reads,410);assert.equal(JSON.parse(opts.body).urlList.length,410);return new Response('',{status:200});}
  if(url.endsWith('.txt'))return new Response(key);if(url.endsWith('.json'))return Response.json(large);reads++;
  return new Response('<link rel="canonical" href="'+url+'">',{status:failLast&&reads===410?404:200});
 };
 if(failLast){await assert.rejects(()=>notify(config,large,key,request));assert.equal(posts,0);}else{const r=await notify(config,large,key,request);assert.equal(r.ok,true);assert.equal(posts,1);}
}
console.log('PASS: 410URL release checks every page before POST; last-page failure sends nothing; 10001URL manifest rejected.');

// 2026-10-24: the Spanish pages (/es/seguro/...) are content paths; the same path shape rules apply to them.
assert.deepEqual(prepare(config,{release:'es',paths:['/es/seguro/techadores','/insurance/roofer/new-york']},key).urlList,['https://www.cohesiveinsure.com/es/seguro/techadores','https://www.cohesiveinsure.com/insurance/roofer/new-york']);
for(const p of ['/es/seguro/techadores?utm_source=x','/es/../api/intake','/es/Seguro','/esx/seguro','/api/es'])assert.throws(()=>prepare(config,{release:'es',paths:[p]},key),p);
// The committed release manifest is valid, carries the 5 Spanish pages and the New York / Florida roofer pages.
import fs from 'node:fs';
const live=JSON.parse(fs.readFileSync(new URL('../public/.well-known/cohesive-content-release.json',import.meta.url),'utf8'));
const urls=prepare(config,live,key).urlList;assert.ok(live.paths.length<=100,'release manifests stay <=100 paths (docs/seo-publication-and-discovery.md)');
for(const p of ['/es/seguro/techadores','/es/seguro/contratistas','/es/seguro/contratistas-generales','/es/seguro/remodelacion','/es/seguro/restaurantes-mexicanos','/insurance/roofer/new-york','/insurance/roofer/florida'])assert.ok(urls.includes('https://www.cohesiveinsure.com'+p),p);
console.log('PASS: /es/seguro paths accepted with the same shape rules; the release manifest carries the Spanish pages and NY/FL roofer pages.');
