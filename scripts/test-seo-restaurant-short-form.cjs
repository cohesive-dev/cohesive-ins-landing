// Short restaurant form (RestaurantQuickQuote) on the restaurant SEO pages + the REAL /api/intake route.
// Every external service is replaced locally: the CRM webhook and quotes@ mailer are captured, Meta CAPI is
// dark (no token), analytics is a no-op. Proves: a completed submit reaches the CRM with the restaurant lane
// fields; the type the visitor selected is what is sent; an abandoned partial carries only what was typed;
// nothing is sent as a fake default. Also proves SeoPage switched only its restaurant/bar branch.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),originalLoad=Module._load;
let states=[],cursor=0,effects=[],effectCursor=0,crmCalls=[],emails=[],mode='success',payload,beacons=[],tracked=[];
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:f}).outputText,f);
Module._load=function(req,parent,isMain){
 if(req==='react'){const real=originalLoad.call(this,req,parent,isMain);return {...real,
  useState(init){const i=cursor++;if(!(i in states))states[i]=init;return[states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];},
  useRef(init){const i=cursor++;if(!(i in states))states[i]={current:init};return states[i];},
  useCallback(fn){return fn;},
  // Effects run on every render; the previous run's cleanup runs first (listeners and timers stay balanced).
  useEffect(fn){const i=effectCursor++;if(typeof effects[i]==='function')effects[i]();effects[i]=fn()||null;}};}
 if(req==='@vercel/analytics')return {track:(name,props)=>tracked.push([name,props])};
 if(req==='@/lib/notify')return {sendIntakeNotification:async f=>{emails.push(f);return true;}};
 if(req.startsWith('@/'))req=path.join(root,req.slice(2));return originalLoad.call(this,req,parent,isMain);
};
delete process.env.META_CAPI_TOKEN;
const store=new Map();global.sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const listeners={};
global.window={location:{pathname:'/insurance/coffee-shop/north-carolina',search:''},addEventListener:(t,h)=>{listeners[t]=h;},removeEventListener:(t,h)=>{if(listeners[t]===h)delete listeners[t];}};
global.document={referrer:'https://www.google.com/',visibilityState:'visible',addEventListener(){},removeEventListener(){}};
Object.defineProperty(globalThis,'navigator',{value:{sendBeacon:(url,blob)=>{assert.equal(url,'/api/intake');beacons.push(blob);return true;}},configurable:true});
const {NextRequest}=require('next/server'),{POST}=require('../app/api/intake/route.ts');
const FormMod=require('../components/RestaurantQuickQuote.tsx'),Form=FormMod.default;
global.fetch=async(url,options)=>{
 if(url==='/api/intake'){
  payload=JSON.parse(options.body);
  if(mode==='network')throw new Error('offline');
  if(mode==='http')return new Response(JSON.stringify({ok:false}),{status:503});
  return POST(new NextRequest('http://localhost/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:options.body}));
 }
 assert.equal(url,'https://crm.cohesiveinsure.com/api/webhooks/inbound-lead','unexpected network destination');
 crmCalls.push(JSON.parse(options.body));return new Response(JSON.stringify({ok:true}),{status:200});
};
let formProps;
function render(){cursor=0;effectCursor=0;return Form(formProps);}
function nodes(n){if(!n||typeof n!=='object')return[];if(Array.isArray(n))return n.flatMap(nodes);return[n,...nodes(n.props?.children)];}
function text(n){if(typeof n==='string')return n;if(!n||typeof n!=='object')return '';if(Array.isArray(n))return n.map(text).join('');return text(n.props?.children);}
function cleanup(){for(const c of effects)if(typeof c==='function')c();effects=[];}
function reset(props,search=''){cleanup();formProps=props;states=[];store.clear();crmCalls=[];emails=[];beacons=[];tracked=[];payload=undefined;window.location.search=search;render();}
const input=placeholder=>nodes(render()).find(n=>n.type==='input'&&n.props.placeholder===placeholder);
const selects=()=>nodes(render()).filter(n=>n.type==='select');
function type(placeholder,value){const el=input(placeholder);assert.ok(el,`${placeholder} input rendered`);el.props.onChange({target:{value}});}
function fillContact(){for(const [p,v] of Object.entries({'Business name':'QA TEST ONLY Cafe','Your name':'QA TEST ONLY',Email:'seo-rest-test@example.invalid',Phone:'2025550184'}))type(p,v);}
const details=p=>Object.fromEntries(p.details.map(x=>[x.label,x.value]));
const submit=async()=>render().props.onSubmit({preventDefault(){}});
const FAKE_DEFAULT_LABELS=['Business structure','Approximate annual revenue','Alcohol as % of sales','Own or rent','When did you open','Coverage timeline','Building address','Claims','Building replacement value (owner-stated)'];

(async()=>{
 // ---- SeoPage: restaurant + bar pages render the short form, with the page's type and source -------------
 const SeoPage=require('../components/SeoPage.tsx').default;
 const verticalRoute=require('../app/insurance/[vertical]/page.tsx'),geoRoute=require('../app/insurance/[vertical]/[geo]/page.tsx'),metroRoute=require('../app/insurance/[vertical]/[geo]/[metro]/page.tsx');
 const pages=[
  [verticalRoute,{vertical:'restaurant'},'restaurant','seo-restaurant-national','Full-service / sit-down restaurant'],
  [verticalRoute,{vertical:'coffee-shop'},'restaurant','seo-coffee-shop-national','Coffee / café / bakery (little or no cooking)'],
  [verticalRoute,{vertical:'bakery'},'restaurant','seo-bakery-national','Coffee / café / bakery (little or no cooking)'],
  [verticalRoute,{vertical:'catering'},'restaurant','seo-catering-national','Catering business'],
  [verticalRoute,{vertical:'bar'},'bar','seo-bar-national','Bar / tavern / brewery'],
  [geoRoute,{vertical:'deli',geo:'new-york'},'restaurant','seo-deli-new-york','Deli or sandwich shop'],
  [geoRoute,{vertical:'bar',geo:'ohio'},'bar','seo-bar-ohio','Bar / tavern / brewery'],
  [geoRoute,{vertical:'restaurant',geo:'alaska'},'restaurant','seo-restaurant-alaska','Full-service / sit-down restaurant'],
  [geoRoute,{vertical:'fine-dining-restaurant',geo:'texas'},'restaurant','seo-fine-dining-restaurant-texas','Fine dining'],
  [metroRoute,{vertical:'restaurant',geo:'north-carolina',metro:'charlotte'},'restaurant','seo-restaurant-north-carolina-charlotte','Full-service / sit-down restaurant'],
  [metroRoute,{vertical:'juice-bar',geo:'north-carolina',metro:'charlotte'},'restaurant','seo-juice-bar-north-carolina-charlotte','Juice bar'],
 ];
 for(const [route,params,formMode,source,prefill] of pages){
  const page=await route.default({params:Promise.resolve(params)});
  assert.equal(page.type,SeoPage);assert.equal(page.props.formMode,formMode);assert.equal(page.props.source,source);
  const forms=nodes(SeoPage(page.props)).filter(n=>n.type===Form);
  assert.equal(forms.length,1,`${source}: one short form`);
  assert.deepEqual({source:forms[0].props.source,mode:forms[0].props.mode},{source,mode:formMode});
  reset(forms[0].props);
  const [typeSelect]=selects();assert.equal(typeSelect.props.value,prefill,`${source}: type pre-filled from page context`);
  assert.equal(typeSelect.props.required,true);assert.equal(typeSelect.props.disabled,undefined,'editable');
  const opts=nodes(typeSelect).filter(n=>n.type==='option').map(o=>o.props.value);
  assert.ok(opts.includes(prefill));assert.equal(opts.at(-1),FormMod.SOMETHING_ELSE);
  assert.ok(!opts.includes('Not a food business'));
  assert.equal(new Set(opts).size,opts.length,'no duplicate options');
 }
 // Only the SEO branch moved: paid /restaurant and /bar keep the long intake form.
 for(const f of ['app/restaurant/page.tsx','app/bar/page.tsx'])assert.match(fs.readFileSync(path.join(root,f),'utf8'),/import RestaurantIntakeForm from "@\/components\/RestaurantIntakeForm"/);
 assert.doesNotMatch(fs.readFileSync(path.join(root,'components/SeoPage.tsx'),'utf8'),/RestaurantIntakeForm/);
 // Choice values mirror the long form's BUSINESS_TYPES (same strings + Rainbow class for the quoter).
 const longForm=fs.readFileSync(path.join(root,'components/RestaurantIntakeForm.tsx'),'utf8');
 for(const c of FormMod.RESTAURANT_TYPE_CHOICES){assert.ok(longForm.includes(`value: "${c.value}"`)||longForm.includes(`const BAR_TYPE = "${c.value}"`),c.value);if(c.rainbowClass)assert.ok(longForm.includes(`rainbowClass: "${c.rainbowClass}"`));}

 // ---- Completed submit, pre-filled type kept: reaches the CRM with the restaurant lane fields ---------------
 const coffeeProps={source:'seo-coffee-shop-north-carolina',mode:'restaurant',pageType:{slug:'coffee-shop',noun:'coffee shop'}};
 for(const search of ['','?utm_source=facebook&utm_medium=paid_social&ad_id=120251012015050660']){
  reset(coffeeProps,search);fillContact();type('ZIP code','28202');
  selects()[1].props.onChange({target:{value:'March'}});
  await submit();
  assert.match(text(render()),/Got it/);
  assert.equal(payload.partial,undefined);assert.equal(payload.final,undefined);
  assert.equal(payload.source,'seo-coffee-shop-north-carolina','same per-page source as the long form sent');
  assert.equal(payload.businessType,'Coffee / café / bakery (little or no cooking)');
  assert.equal(payload.company,'QA TEST ONLY Cafe');assert.equal(payload.name,'QA TEST ONLY');
  assert.equal(payload.email,'seo-rest-test@example.invalid');assert.equal(payload.phone,'2025550184');assert.equal(payload.zip,'28202');
  assert.equal(payload.capiEventName,'Lead');assert.match(payload.eventId,/\S{8,}/);assert.equal(payload.urgentEventId,undefined);
  const d=details(payload);
  assert.equal(d['Business name'],'QA TEST ONLY Cafe');assert.equal(d['Business type'],'Coffee / café / bakery (little or no cooking)');
  assert.equal(d['Rainbow class'],'E');assert.equal(d['Page type'],'Coffee / café / bakery (little or no cooking)');
  assert.equal(d['Current policy renews'],'March');assert.equal(d['Form layout'],'seo-short');assert.match(d['Not asked on this form'],/Revenue, alcohol share/);
  assert.equal(d['Landing page'],'/insurance/coffee-shop/north-carolina');assert.equal(d.Referrer,'https://www.google.com/');
  if(search)assert.equal(d['Ad id (Meta)'],'120251012015050660');else assert.equal(d['Ad id (Meta)'],undefined);
  for(const label of FAKE_DEFAULT_LABELS)assert.equal(d[label],undefined,`no fake default: ${label}`);
  // The route forwarded it to the CRM and to quotes@.
  assert.equal(crmCalls.length,1);assert.equal(emails.length,1);assert.equal(emails[0].partial,false);
  const crm=crmCalls[0];
  assert.equal(crm.source,'webform');assert.equal(crm.email,'seo-rest-test@example.invalid');assert.equal(crm.phone,'+12025550184');
  assert.equal(crm.name,'QA TEST ONLY');assert.equal(crm.business_name,'QA TEST ONLY Cafe');assert.equal(crm.zip,'28202');
  assert.equal(crm.business_type,'Coffee / café / bakery (little or no cooking) — via seo-coffee-shop-north-carolina');
  assert.equal(crm.coverage,undefined,'restaurant lane: no coverage override');
  assert.ok(crm.details.some(x=>x.label==='Current policy renews'&&x.value==='March'));
  assert.ok(tracked.some(([n])=>n==='FormStart'));assert.ok(tracked.some(([n])=>n==='ContactDone'));assert.ok(tracked.some(([n,p])=>n==='RestShortSubmit'&&p.outcome==='Lead'));
 }

 // ---- The visitor changes the pre-filled type: the selected type is what is sent ------------------------
 reset(coffeeProps);fillContact();selects()[0].props.onChange({target:{value:'Fast food / counter service (grill or fryer)'}});
 await submit();assert.match(text(render()),/Got it/);
 assert.equal(payload.businessType,'Fast food / counter service (grill or fryer)');
 let d=details(payload);assert.equal(d['Business type'],'Fast food / counter service (grill or fryer)');assert.equal(d['Rainbow class'],'A');
 assert.equal(d['Page type'],'Coffee / café / bakery (little or no cooking)','page type stays attribution only');
 assert.ok(crmCalls[0].business_type.startsWith('Fast food / counter service'));assert.ok(!crmCalls[0].business_type.includes('Coffee'));
 // Optional answers left blank are omitted, never defaulted.
 assert.ok(!('zip' in payload));assert.equal(d['Current policy renews'],undefined);assert.ok(!('zip' in crmCalls[0]));
 for(const label of FAKE_DEFAULT_LABELS)assert.equal(d[label],undefined);

 // Something else: the visitor's own words become the type; no Rainbow class is inferred.
 reset({source:'seo-chinese-restaurant-national',mode:'restaurant',pageType:{slug:'chinese-restaurant',noun:'Chinese restaurant'}});
 assert.equal(selects()[0].props.value,'Chinese restaurant');
 fillContact();selects()[0].props.onChange({target:{value:FormMod.SOMETHING_ELSE}});
 await submit();assert.equal(payload,undefined);assert.match(text(render()),/tell us what kind of restaurant/);
 type('Describe your restaurant','  Dim sum takeout counter  ');await submit();assert.match(text(render()),/Got it/);
 assert.equal(payload.businessType,'Dim sum takeout counter');d=details(payload);assert.equal(d['Rainbow class'],undefined);assert.equal(d['Page type'],'Chinese restaurant');

 // No page type (the cost guide): nothing pre-selected, the visitor must choose.
 reset({source:'seo-guide-restaurant-insurance-cost'});assert.equal(selects()[0].props.value,'');
 fillContact();await submit();assert.equal(payload,undefined);assert.match(text(render()),/choose your type of restaurant/);
 selects()[0].props.onChange({target:{value:'Full-service / sit-down restaurant'}});await submit();assert.match(text(render()),/Got it/);
 assert.equal(payload.source,'seo-guide-restaurant-insurance-cost');assert.equal(details(payload)['Page type'],undefined);assert.equal(crmCalls.length,1);

 // Required answers are enforced before anything is sent.
 for(const [missing,msg] of [['Business name',/business name/],['Your name',/your name/],['Email',/valid email/],['Phone',/valid phone/]]){
  reset(coffeeProps);fillContact();type(missing,missing==='Phone'?'555':'');await submit();
  assert.equal(payload,undefined,`${missing} refused`);assert.match(text(render()),msg);
 }

 // ---- Bar gating: kept exactly as the long form routes it -------------------------------------------------
 // Bar page (mode "bar"): a bar is the audience -> E&S lead, forwarded to the CRM.
 reset({source:'seo-bar-ohio',mode:'bar',pageType:{slug:'bar',noun:'bar'}});fillContact();await submit();
 assert.equal(payload.capiEventName,'RestaurantLeadES');assert.equal(payload.businessType,'Bar / tavern / brewery');
 assert.equal(crmCalls.length,1);assert.equal(emails.length,1);assert.match(text(render()),/Got it/);
 // Restaurant page, visitor picks bar -> RestaurantDisqualified: quotes@ only (Hedge triage), no CRM fan-out.
 reset(coffeeProps);fillContact();selects()[0].props.onChange({target:{value:'Bar / tavern / brewery'}});await submit();
 assert.equal(payload.capiEventName,'RestaurantDisqualified');assert.equal(crmCalls.length,0);assert.equal(emails.length,1);
 assert.match(emails[0].details[0].label,/NOT INSTANT-QUOTABLE/);assert.match(text(render()),/bit longer/);
 assert.equal(FormMod.capiEventFor('Fine dining','bar'),'Lead');

 // ---- Abandoned partial: only what was typed, email-only, absent fields omitted --------------------------
 reset(coffeeProps);type('Email','seo-rest-partial@example.invalid');
 render();listeners.pagehide();
 assert.equal(beacons.length,1);
 const partial=JSON.parse(await beacons[0].text());
 assert.deepEqual(Object.keys(partial).sort(),['details','email','final','partial','source']);
 assert.equal(partial.email,'seo-rest-partial@example.invalid');assert.equal(partial.source,'seo-coffee-shop-north-carolina');
 assert.equal(partial.partial,true);assert.equal(partial.final,true);
 const pd=details(partial);
 assert.equal(pd['Business type'],undefined,'an untouched pre-filled type is page context, not an answer');assert.equal(pd['Rainbow class'],undefined);
 assert.equal(pd['Page type'],'Coffee / café / bakery (little or no cooking)');assert.equal(pd['Business name'],undefined);assert.equal(pd['Current policy renews'],undefined);
 for(const label of FAKE_DEFAULT_LABELS)assert.equal(pd[label],undefined);
 render();listeners.pagehide();assert.equal(beacons.length,1,'partial fires once');
 // The route keeps an abandon email-only: quotes@ alert, no CRM, no SMS.
 let res=await POST(new NextRequest('http://localhost/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(partial)}));
 assert.equal(res.status,200);assert.equal(crmCalls.length,0);assert.equal(emails.length,1);assert.equal(emails[0].partial,true);
 assert.equal(emails[0].email,'seo-rest-partial@example.invalid');
 for(const k of ['name','phone','businessType','company','zip'])assert.equal(emails[0][k],undefined,`partial omits ${k}`);
 assert.ok(tracked.some(([n])=>n==='RestFormAbandon'));
 // A type the visitor changed before leaving IS their answer and rides along.
 reset(coffeeProps);type('Phone','2025550184');selects()[0].props.onChange({target:{value:'Fine dining'}});render();listeners.pagehide();
 const partial2=JSON.parse(await beacons[0].text());
 assert.deepEqual(Object.keys(partial2).sort(),['businessType','details','final','partial','phone','source']);
 assert.equal(partial2.businessType,'Fine dining');assert.equal(details(partial2)['Rainbow class'],'D');
 // Nothing reachable typed -> nothing sent; a completed submit never sends a partial afterwards.
 reset(coffeeProps);type('Your name','QA');render();listeners.pagehide();assert.equal(beacons.length,0);
 reset(coffeeProps);fillContact();await submit();render();listeners.pagehide();assert.equal(beacons.length,0);

 // ---- Failures never confirm, and the button comes back --------------------------------------------------
 for(const failure of ['network','http']){
  mode=failure;reset(coffeeProps);fillContact();await submit();
  assert.doesNotMatch(text(render()),/Got it/);assert.match(text(render()),/couldn't save/);
  assert.equal(nodes(render()).find(n=>n.type==='button').props.disabled,false);
 }
 mode='success';cleanup();
 console.log('PASS: restaurant/bar SEO pages render the short form with the page type pre-filled and editable; completed submits reach the CRM with the restaurant lane fields and the visitor-selected type; bar gating unchanged; abandoned partials are email-only and omit absent fields; no fake defaults. No external requests.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(cleanup);
