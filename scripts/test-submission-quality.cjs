const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ts=require('typescript');
const cache={};
let mail=true,crm=true,duplicate=false,calls=[];
function load(file){
 file=path.resolve(file);if(cache[file])return cache[file].exports;
 const module={exports:{}};cache[file]=module;
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const req=id=>{
  if(id==='next/server')return {NextResponse:{json:(b,o)=>Response.json(b,o)}};
  if(id==='@/lib/notify')return {sendIntakeNotification:async()=>{calls.push('mail');return mail;}};
  if(id==='@/lib/guides/catalog')return {getStartupGuide:()=>null};
  if(id==='@/lib/guides/states')return {STARTUP_STATES:[]};
  if(id==='@/lib/guides/eligibility')return {startupPlacementRestriction:()=>null};
  if(id.startsWith('@/'))return load(path.join(process.cwd(),id.slice(2)+'.ts'));
  return require(id);
 };
 vm.runInThisContext('(function(require,module,exports){'+js+'\n})',{filename:file})(req,module,module.exports);return module.exports;
}
global.fetch=async(url,opts)=>{calls.push({url,body:JSON.parse(opts.body)});return String(url).includes('graph.facebook.com')?Response.json({events_received:1}):Response.json({ok:crm,notificationDelivery:duplicate?'duplicate':'sent'});};
process.env.META_CAPI_TOKEN='test-only-no-network';process.env.INTAKE_CONVERSION_SECRET='test-only-conversion-secret';
const {POST}=load('app/api/intake/route.ts'),{identityHash,acquisitionEventId,assessSubmission}=load('lib/submission-quality.ts');
const body={name:'Oscar',email:'real.owner@gmail.com',phone:'+16189224049',company:'Real Business LLC',source:'contractors-landing',eventId:'client-id',details:[{label:'Annual W2 payroll',value:'$0'}]};
const capis=()=>calls.filter(c=>c.url?.includes('graph.facebook.com'));
async function submit(b){calls=[];const req=new Request('https://www.cohesiveinsure.com/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});req.cookies={get:()=>undefined};const res=await POST(req);return {status:res.status,body:await res.json()};}
(async()=>{
 let r=await submit(body);assert.equal(r.status,200);assert.equal(r.body.conversion.eligible,true);assert.equal(capis().length,1);assert.equal(capis()[0].body.data[0].event_id,r.body.conversion.eventId);
 const event=r.body.conversion.eventId;r=await submit({...body,eventId:'different-client-retry'});assert.equal(r.body.conversion.eventId,event);
 duplicate=true;r=await submit(body);assert.equal(r.body.conversion.eligible,false);assert.equal(capis().length,1);assert.equal(capis()[0].body.data[0].event_id,event);duplicate=false;
 for(const changed of [{phone:'1111111111'},{email:'bad'},{name:''},{company:''},{website:'bot-spam'}]){r=await submit({...body,...changed});assert.equal(r.status,422);assert.equal(calls.length,0);}
 process.env.INTAKE_BLOCKED_IDENTITY_HASHES=identityHash(body.email);r=await submit(body);assert.equal(r.status,422);assert.equal(calls.length,0);delete process.env.INTAKE_BLOCKED_IDENTITY_HASHES;
 r=await submit({...body,name:'Dick Butts',company:'B'});assert.equal(r.body.conversion.eligible,false);assert.equal(capis().length,0);assert.ok(calls.some(x=>x==='mail'));
 r=await submit({...body,source:'commercial-property-steps',company:undefined,details:[{label:'Owner / LLC name',value:'Actual Owner LLC'}]});assert.equal(r.status,200);assert.equal(r.body.conversion.eligible,true);
 r=await submit({...body,partial:true,final:true});assert.equal(r.status,200);assert.equal(capis().length,0);assert.equal(calls.filter(c=>c.url).length,0);
 crm=false;r=await submit(body);assert.equal(r.status,200);assert.equal(r.body.crm,'failed');
 mail=false;r=await submit(body);assert.equal(r.status,503);assert.equal(capis().length,0);mail=true;crm=true;
 delete process.env.INTAKE_CONVERSION_SECRET;delete process.env.META_CAPI_TOKEN;r=await submit(body);assert.equal(r.status,200);assert.equal(r.body.conversion.eligible,false);assert.equal(capis().length,0);
 assert.equal(assessSubmission({...body,phone:'+442079460123'}).kind,'accept');
 assert.equal(acquisitionEventId(body,'secret',new Date('2026-09-12T12:00:00Z')),acquisitionEventId(body,'secret',new Date('2026-09-12T23:59:00Z')));
 console.log('PASS: accepted, matching IDs, retries, CRM duplicate, five rejection paths, known fake, review-only, property owner fallback, partial, delivery failures, missing secret, international number. No real network.');
})().catch(e=>{console.error(e);process.exitCode=1;});
