// Real component handlers and intake route; all external services replaced locally.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),originalLoad=Module._load;
let states=[],cursor=0,effectRan=false,crmCalls=[],emails=[],mode='success',payload;
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:f}).outputText,f);
Module._load=function(req,parent,isMain){
 if(req==='react'){const real=originalLoad.call(this,req,parent,isMain);return {...real,useState(init){const i=cursor++;if(!(i in states))states[i]=init;return[states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];},useRef(init){return{current:init};},useCallback(fn){return fn;},useEffect(fn){if(!effectRan){effectRan=true;fn();}}};}
 if(req==='@/lib/notify')return {sendIntakeNotification:async f=>{emails.push(f);return true;}};
 if(req.startsWith('@/'))req=path.join(root,req.slice(2));return originalLoad.call(this,req,parent,isMain);
};
const store=new Map();global.sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
global.window={location:{pathname:'/insurance/painter/new-york',search:''}};global.document={referrer:'https://www.google.com/'};
const {NextRequest}=require('next/server'),{POST}=require('../app/api/intake/route.ts'),Form=require('../components/ContractorQuoteForm.tsx').default;
global.fetch=async(url,options)=>{
 if(url==='/api/intake'){
  payload=JSON.parse(options.body);
  if(mode==='network')throw new Error('offline');
  if(mode==='http')return new Response(JSON.stringify({ok:false}),{status:503});
  if(mode==='false-ok')return new Response(JSON.stringify({ok:false}),{status:200});
  if(mode==='skipped')return new Response(JSON.stringify({ok:true,crm:'skipped'}),{status:200});
  if(mode==='non-json')return new Response('<html>gateway</html>',{status:200});
  return POST(new NextRequest('http://localhost/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:options.body}));
 }
 assert.equal(url,'https://crm.cohesiveinsure.com/api/webhooks/inbound-lead','unexpected network destination');
 crmCalls.push(JSON.parse(options.body));return new Response(JSON.stringify({ok:true}),{status:200});
};
let formProps={source:'seo-painter-new-york',tradeLabel:'Painter'};
function render(){cursor=0;return Form(formProps);}
function nodes(n){if(!n||typeof n!=='object')return[];if(Array.isArray(n))return n.flatMap(nodes);return[n,...nodes(n.props?.children)];}
function text(n){if(typeof n==='string')return n;if(!n||typeof n!=='object')return '';if(Array.isArray(n))return n.map(text).join('');return text(n.props?.children);}
function reset(search=''){states=[];effectRan=false;store.clear();crmCalls=[];emails=[];window.location.search=search;render();}
function fill(){for(const [placeholder,value] of Object.entries({'Business name':'QA TEST ONLY Painter','Your name':'QA TEST ONLY','ZIP code':'10001',Email:'seo-test@example.invalid',Phone:'2025550184'})){const input=nodes(render()).find(n=>n.type==='input'&&n.props.placeholder===placeholder);assert.ok(input);input.props.onChange({target:{value}});}}
(async()=>{
 for(const search of ['', '?utm_source=facebook&utm_medium=paid_social&ad_id=120251012015050660']){
  mode='success';reset(search);fill();await render().props.onSubmit({preventDefault(){}});
  assert.equal(payload.final,undefined);assert.equal(payload.partial,undefined);assert.equal(payload.source,'contractors-landing');assert.equal(payload.company,'QA TEST ONLY Painter');
  assert.equal(crmCalls.length,1);assert.equal(crmCalls[0].suppress_first_touch,'true');assert.equal(emails.length,1);assert.equal(emails[0].partial,false);assert.match(text(render()),/Got it/);
  const d=Object.fromEntries(payload.details.map(x=>[x.label,x.value]));assert.equal(d['Page source'],'seo-painter-new-york');assert.equal(d['Landing page'],'/insurance/painter/new-york');assert.equal(d.Referrer,'https://www.google.com/');
  if(search)assert.equal(d['Ad id (Meta)'],'120251012015050660');else assert.equal(d['Ad id (Meta)'],undefined);
 }
 for(const service of require('../lib/seo/service-industries.ts').INSURANCE_SERVICES){
  formProps={source:`seo-${service.slug}-texas`,tradeLabel:service.intakeLabel,operationsPrompt:service.operationsPrompt};
  window.location.pathname=`/insurance/${service.slug}/texas`;mode='success';reset();fill();
  const textarea=nodes(render()).find(n=>n.type==='textarea');assert.ok(textarea);assert.equal(textarea.props.required,undefined);
  textarea.props.onChange({target:{value:'Actual work: cleaning plus occasional repairs.'}});
  await render().props.onSubmit({preventDefault(){}});assert.match(text(render()),/Got it/);
  assert.equal(crmCalls.length,1);assert.equal(crmCalls[0].suppress_first_touch,'true');
  assert.equal(payload.businessType,service.intakeLabel);
  assert.equal(Object.fromEntries(payload.details.map(d=>[d.label,d.value]))['Services described'],'Actual work: cleaning plus occasional repairs.');
  assert.ok(JSON.stringify(crmCalls[0]).includes('Actual work: cleaning plus occasional repairs.'));
  reset();fill();await render().props.onSubmit({preventDefault(){}});assert.match(text(render()),/Got it/);
  assert.ok(!payload.details.some(d=>d.label==='Services described'));
 }
 const metroRoute=require('../app/insurance/[vertical]/[geo]/[metro]/page.tsx');
 for(const p of require('../lib/seo/metro-pages.ts').METRO_PAGES){
  const page=await metroRoute.default({params:Promise.resolve({vertical:p.trade,geo:p.state,metro:p.city})});
  formProps=page.props;window.location.pathname=p.path;
  for(const query of ['', '?utm_source=facebook&utm_medium=paid_social&ad_id=120251012015050660']){
   mode='success';reset(query);fill();
   const textarea=nodes(render()).find(n=>n.type==='textarea');textarea.props.onChange({target:{value:'Client-described operations; no inferred hazard answers.'}});
   await render().props.onSubmit({preventDefault(){}});assert.match(text(render()),/Got it/);
   const details=Object.fromEntries(payload.details.map(d=>[d.label,d.value]));
   assert.equal(details['Page source'],p.source);assert.equal(details['Landing page'],p.path);
   assert.equal(details.Referrer,'https://www.google.com/');
   if(query)assert.equal(details['Ad id (Meta)'],'120251012015050660');
   assert.equal(payload.businessType,page.props.tradeLabel);assert.equal(crmCalls.length,1);
   assert.equal(crmCalls[0].suppress_first_touch,'true');
   assert.ok(JSON.stringify(crmCalls[0]).includes(p.source));assert.ok(JSON.stringify(crmCalls[0]).includes(p.path));
   assert.ok(JSON.stringify(crmCalls[0]).includes('Client-described operations; no inferred hazard answers.'));
  }
 }
 for(const failure of ['network','http','false-ok','skipped','non-json']){
  mode=failure;reset();fill();await render().props.onSubmit({preventDefault(){}});assert.doesNotMatch(text(render()),/Got it/);assert.match(text(render()),/couldn't save/);assert.equal(nodes(render()).find(n=>n.type==='button').props.disabled,false);
 }
 crmCalls=[];emails=[];await POST(new NextRequest('http://localhost/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,partial:true,final:true})}));assert.equal(crmCalls.length,0);assert.equal(emails[0].partial,true);
 console.log('PASS: real form and route deliver completed intake, preserve page/referrer/ad attribution, suppress automated first touch; five failures never confirm; abandonment stays email-only. No external requests.');
})().catch(e=>{console.error(e);process.exitCode=1;});
