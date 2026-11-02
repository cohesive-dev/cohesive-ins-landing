// Spanish contractor form (/es/seguro/techadores, Kevin 2026-10-22): the real component and the real /api/intake
// route, every external service stubbed. Proves a Spanish lead reaches the CRM forward with the SAME English labels
// and values as /contractor-test, plus formAnswers "Preferred language": "Spanish", and keeps the ad attribution.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),originalLoad=Module._load;
let states=[],cursor=0,effects=[],effectCursor=0,crmCalls=[],emails=[],mode='success',payload,intakeBodies=[],notifyOk=true;
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:f}).outputText,f);
Module._load=function(req,parent,isMain){
 if(req==='react'){const real=originalLoad.call(this,req,parent,isMain);return {...real,useState(init){const i=cursor++;if(!(i in states))states[i]=init;return[states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];},useRef(init){const i=cursor++;if(!(i in states))states[i]={current:init};return states[i];},useMemo(fn){return fn();},useCallback(fn){return fn;},useEffect(fn,deps){const i=effectCursor++,slot=effects[i];if(!slot||!deps||deps.some((d,j)=>!Object.is(d,slot.deps[j]))){slot?.cleanup?.();effects[i]={deps,cleanup:fn()};}}};}
 if(req==='next/navigation')return {useSearchParams:()=>new URLSearchParams(global.window.location.search)};
 if(req==='@/lib/notify')return {sendIntakeNotification:async f=>{emails.push(f);return notifyOk;}};
 if(req.startsWith('@/'))req=path.join(root,req.slice(2));return originalLoad.call(this,req,parent,isMain);
};
const store=new Map(),local=new Map();
global.sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
global.localStorage={getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v)};
// Real leave listeners (pagehide / visibilitychange); the 120 s idle timer is held, never scheduled for real.
const listeners=new Map(),on=(t,f)=>{if(!listeners.has(t))listeners.set(t,new Set());listeners.get(t).add(f);},off=(t,f)=>listeners.get(t)?.delete(f);
global.window={location:{pathname:'/es/seguro/techadores',search:''},addEventListener:on,removeEventListener:off};
global.document={referrer:'',getElementById:()=>null,visibilityState:'visible',addEventListener:on,removeEventListener:off};
const realSetTimeout=global.setTimeout,realClearTimeout=global.clearTimeout;
global.setTimeout=(fn,ms,...a)=>ms>=100000?{held:fn}:realSetTimeout(fn,ms,...a);global.clearTimeout=h=>h&&h.held?undefined:realClearTimeout(h);
const leave=async(type='pagehide')=>{render();if(type==='visibilitychange')document.visibilityState='hidden';try{for(const f of [...(listeners.get(type)||[])])await f();}finally{document.visibilityState='visible';}await new Promise(r=>setImmediate(r));};
const {NextRequest}=require('next/server'),{POST}=require('../app/api/intake/route.ts');
const Form=require('../components/es/SpanishContractorForm.tsx').default;
const ES=require('../lib/es/contractor-form-es.ts');
const {FULL_LABELS}=require('../lib/contractor-full-form.ts');
global.fetch=async(url,options)=>{
 if(url==='/api/intake'){
  payload=JSON.parse(options.body);intakeBodies.push(payload);
  if(mode==='network')throw new Error('offline');
  if(mode==='http')return new Response(JSON.stringify({ok:false}),{status:503});
  return POST(new NextRequest('http://localhost/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:options.body}));
 }
 assert.equal(url,'https://crm.cohesiveinsure.com/api/webhooks/inbound-lead','unexpected network destination');
 crmCalls.push(JSON.parse(options.body));return new Response(JSON.stringify({ok:true}),{status:200});
};
const props={advertisedIndustry:'Roofing',cellIndustry:'roof',tradeFirst:'Roofing'};
function render(){cursor=0;effectCursor=0;return Form(props);}
function nodes(n){if(!n||typeof n!=='object')return[];if(Array.isArray(n))return n.flatMap(nodes);return[n,...nodes(n.props?.children)];}
function text(n){if(typeof n==='string'||typeof n==='number')return String(n);if(!n||typeof n!=='object')return '';if(Array.isArray(n))return n.map(text).join('');return text(n.props?.children);}
const byId=id=>nodes(render()).find(n=>n.props?.id===`es-${id}`);
function set(k,v){const el=byId(k);assert.ok(el,`field ${k} rendered`);el.props.onChange(el.type==='input'||el.type==='select'?{target:{value:v}}:v);}
const next=async()=>render().props.onSubmit({preventDefault(){}});
function reset(search=''){for(const e of effects)e?.cleanup?.();effects=[];notifyOk=true;states=[];store.clear();local.clear();crmCalls=[];emails=[];intakeBodies=[];payload=undefined;window.location.search=search;render();}
async function fillAll(){
 set('email','es-test@example.invalid');set('phone','2025550184');set('fullName','QA TEST ONLY Juan');await next();
 set('legalName','QA TEST ONLY Techos LLC');set('address','123 Main St, San Antonio, TX 78216');await next();
 set('trade','Roofing');
 const none=nodes(render()).find(n=>n.type==='input'&&n.props.type==='checkbox');assert.ok(none,'other-trades checkboxes rendered');none.props.onChange();
 set('primaryPct','All of it (100%)');await next();
 set('revenue','$250k - $500k');set('employees','1 - 5');set('payroll','$0 - $50k');await next();
 set('usesSubcontractors','Yes');set('subcontractorCosts','$100k - $250k');await next();
 set('structure','LLC');await next();
 set('currentGl','Yes - renews within 30 days');set('currentPremium','$2K - $5K');await next();
}
(async()=>{
 // Visible text is Spanish; submitted values are the English option values.
 reset();
 let t=text(render());assert.match(t,/Paso 1 de 7/);assert.match(t,/Correo electrónico/);assert.match(t,/Siguiente/);assert.doesNotMatch(t,/Email address|Next\b|Get my quote/);
 // Required field refused in Spanish, nothing sent.
 await next();assert.match(text(render()),/correo electrónico válido/);assert.equal(payload,undefined);
 // Trade select: Roofing listed first, nothing pre-selected, Spanish labels, English values.
 set('email','es-test@example.invalid');set('phone','2025550184');set('fullName','QA');await next();set('legalName','QA');set('address','123 Main St');await next();
 const select=byId('trade');assert.equal(select.props.value,'');const opts=nodes(select).filter(n=>n.type==='option');
 assert.equal(opts[1].props.value,'Roofing');assert.equal(text(opts[1]),'Techos (roofing)');assert.equal(opts.length,1+ES.ES_TRADES.length);

 for(const search of ['','?utm_source=facebook&utm_medium=paid_social&utm_campaign=es_roofers&utm_content=es_ad_1&ad_id=120251012015050660&adset_id=120251012015050661&campaign_id=120251012015050662&fbclid=QA_TEST_ONLY']){
  mode='success';reset(search);await fillAll();
  assert.match(text(render()),/¡Gracias! Ya recibimos su solicitud/);
  assert.equal(intakeBodies.length,1,'one final submission');
  assert.equal(payload.source,'contractors-landing');assert.equal(payload.partial,undefined);assert.equal(payload.final,undefined);
  assert.equal(payload.businessType,'Contractor enquiry - advertised Roofing; actual work unconfirmed');
  assert.equal(payload.company,'QA TEST ONLY Techos LLC');assert.ok(payload.eventId);
  const d=Object.fromEntries(payload.details.map(x=>[x.label,x.value]));
  assert.equal(d['Preferred language'],'Spanish','formAnswers Preferred language: Spanish');
  assert.equal(d['Experiment cell'],'roof__es__step__v1');assert.equal(d['Form version'],'2026-10-22-es-v1');
  assert.equal(d['Advertised industry (not confirmed trade)'],'Roofing');
  assert.equal(d[FULL_LABELS.trade],'Roofing');assert.equal(d[FULL_LABELS.otherTrades],'None');assert.equal(d[FULL_LABELS.revenue],'$250k - $500k');
  assert.equal(d[FULL_LABELS.employees],'1 - 5');assert.equal(d[FULL_LABELS.payroll],'$0 - $50k');assert.equal(d[FULL_LABELS.usesSubcontractors],'Yes');
  assert.equal(d[FULL_LABELS.subcontractorCosts],'$100k - $250k');assert.equal(d[FULL_LABELS.currentGl],'Yes - renews within 30 days');
  assert.equal(d[FULL_LABELS.address],'123 Main St, San Antonio, TX 78216');
  for(const label of Object.keys(d))assert.doesNotMatch(label,/[áéíóúñ¿]/,`detail labels stay English: ${label}`);
  assert.equal(d['Landing page'],'/es/seguro/techadores');
  if(search){assert.equal(d['Ad id (Meta)'],'120251012015050660');assert.equal(d['Campaign'],'es_roofers');assert.equal(d['Ad name'],'es_ad_1');
   assert.equal(d['Traffic source'],'facebook / paid_social');assert.equal(d['Click id'],'QA_TEST_ONLY');assert.equal(d['Current ad_id'],'120251012015050660');assert.equal(d['Current campaign_id'],'120251012015050662');}
  else assert.equal(d['Ad id (Meta)'],undefined);
  // The real route forwarded it to the CRM (first touch suppressed) with the language row inside formAnswers/details.
  assert.equal(crmCalls.length,1);assert.equal(crmCalls[0].suppress_first_touch,'true');
  assert.ok(crmCalls[0].details.some(x=>x.label==='Preferred language'&&x.value==='Spanish'),'CRM forward carries Preferred language');
  assert.ok(crmCalls[0].business_type.includes('via contractors-landing'));
  assert.equal(emails.length,1);assert.ok(emails[0].details.some(x=>x.label==='Preferred language'&&x.value==='Spanish'));
 }
 // Abandoned fill (pagehide): quotes@ only, never the CRM, with the language row; a failed quotes@ save retries.
 mode='success';reset('?ad_id=120251012015050660');set('email','es-test@example.invalid');set('phone','2025550184');
 notifyOk=false;await leave();
 assert.equal(intakeBodies.length,1);assert.equal(payload.partial,true);assert.equal(payload.final,true);assert.equal(crmCalls.length,0);
 let pd=Object.fromEntries(payload.details.map(x=>[x.label,x.value]));assert.equal(pd['Preferred language'],'Spanish');assert.equal(pd['Form version'],'2026-10-22-es-v1');assert.equal(pd['Ad id (Meta)'],'120251012015050660');
 assert.equal(payload.email,'es-test@example.invalid');assert.equal(payload.phone,'2025550184','the partial carries the latest contact snapshot');
 notifyOk=true;await leave();assert.equal(intakeBodies.length,2,'failed quotes@ save is retried on the next leave');assert.equal(emails.at(-1).partial,true);
 await leave();assert.equal(intakeBodies.length,2,'a saved partial is not sent twice');assert.equal(crmCalls.length,0,'partials never reach the CRM');
 // Tab hidden (visibilitychange) is a leave signal too.
 reset();set('email','es-test@example.invalid');set('phone','2025550184');await leave('visibilitychange');
 assert.equal(intakeBodies.length,1);assert.equal(payload.partial,true);assert.equal(payload.phone,'2025550184');assert.equal(crmCalls.length,0);
 // Failures never show success.
 for(const failure of ['network','http']){mode=failure;reset();await fillAll();const out=text(render());assert.doesNotMatch(out,/Gracias/);assert.match(out,/No pudimos guardar su solicitud/);}
 // Preview mode sends nothing.
 mode='success';reset('?preview=1');await fillAll();assert.equal(intakeBodies.length,0);assert.match(text(render()),/Vista previa terminada/);
 // Every Spanish option maps back to a real English value.
 for(const [k,opts] of Object.entries(ES.ES_OPTIONS))for(const o of opts)assert.notEqual(o.label,'',`${k}:${o.value}`);
 const untranslated=Object.values(ES.ES_OPTIONS).flat().filter(o=>o.label===o.value&&/[a-z]{3,}/.test(o.value)&&!['LLC','Roofing'].includes(o.value));
 assert.deepEqual(untranslated.map(o=>o.value),[],'every worded option has a Spanish label');
 console.log('PASS: Spanish form submits through the real /api/intake as contractors-landing with English labels/values, "Preferred language: Spanish", ad attribution and suppressed first touch; abandoned fills go to quotes@ only and retry a failed save; failures never confirm; preview sends nothing. No external requests.');
})().catch(e=>{console.error(e);process.exitCode=1;});
