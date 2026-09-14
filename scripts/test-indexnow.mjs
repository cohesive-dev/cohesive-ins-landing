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
