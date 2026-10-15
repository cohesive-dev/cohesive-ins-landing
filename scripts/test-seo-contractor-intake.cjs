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
function choose(value){const select=nodes(render()).find(n=>n.type==='select');assert.ok(select,'trade select rendered');select.props.onChange({target:{value}});}
function fill(trade=formProps.tradeLabel){for(const [placeholder,value] of Object.entries({'Business name':'QA TEST ONLY Painter','Your name':'QA TEST ONLY','ZIP code':'10001',Email:'seo-test@example.invalid',Phone:'2025550184'})){const input=nodes(render()).find(n=>n.type==='input'&&n.props.placeholder===placeholder);assert.ok(input);input.props.onChange({target:{value}});}if(trade!==null)choose(trade);}
(async()=>{
 for(const search of ['', '?utm_source=facebook&utm_medium=paid_social&ad_id=120251012015050660']){
  mode='success';reset(search);fill();await render().props.onSubmit({preventDefault(){}});
  assert.equal(payload.final,undefined);assert.equal(payload.partial,undefined);assert.equal(payload.source,'contractors-landing');assert.equal(payload.company,'QA TEST ONLY Painter');
  assert.equal(crmCalls.length,1);assert.equal(crmCalls[0].suppress_first_touch,'true');assert.equal(emails.length,1);assert.equal(emails[0].partial,false);assert.match(text(render()),/Got it/);
  const d=Object.fromEntries(payload.details.map(x=>[x.label,x.value]));assert.equal(d['Page source'],'seo-painter-new-york');assert.equal(d['Landing page'],'/insurance/painter/new-york');assert.equal(d.Referrer,'https://www.google.com/');
  if(search)assert.equal(d['Ad id (Meta)'],'120251012015050660');else assert.equal(d['Ad id (Meta)'],undefined);
 }
 // ★ Kevin 2026-10-09: the visitor states the trade; the page trade is attribution only and never pre-selected.
 {const FormMod=require('../components/ContractorQuoteForm.tsx');
  mode='success';reset();
  const select=nodes(render()).find(n=>n.type==='select');assert.ok(select);assert.equal(select.props.value,'','nothing pre-selected');assert.equal(select.props.required,true);
  const opts=nodes(select).filter(n=>n.type==='option');assert.equal(opts[0].props.value,'');assert.equal(opts[0].props.disabled,true);
  assert.equal(opts[1].props.value,'Painter','page trade listed first');assert.equal(opts.at(-1).props.value,FormMod.SOMETHING_ELSE);
  assert.ok(!opts.some(o=>/^other(?: trade)?$/i.test(String(o.props.value))),'generic Other replaced by Something else');
  const roof=FormMod.tradeOptions('Roofer');assert.equal(roof[0],'Roofer');assert.ok(!roof.includes('Roofing'),'page-trade synonym not listed twice');assert.ok(roof.includes('General contractor'));
  // no choice -> refused, nothing sent
  payload=undefined;fill(null);await render().props.onSubmit({preventDefault(){}});assert.equal(payload,undefined);assert.match(text(render()),/Please choose the work you do/);
  // a different listed trade -> Trade = the visitor's pick; Page trade = the page
  reset();fill('General contractor');await render().props.onSubmit({preventDefault(){}});assert.match(text(render()),/Got it/);
  let d=Object.fromEntries(payload.details.map(x=>[x.label,x.value]));assert.equal(payload.businessType,'General contractor');assert.equal(d.Trade,'General contractor');assert.equal(d['Page trade'],'Painter');
  assert.ok(crmCalls[0].business_type.startsWith('General contractor'),'CRM business_type carries the visitor trade');assert.ok(!crmCalls[0].business_type.includes('Painter'));
  // Something else -> the visitor's own words are required and become the Trade
  reset();fill(FormMod.SOMETHING_ELSE);payload=undefined;await render().props.onSubmit({preventDefault(){}});assert.equal(payload,undefined);assert.match(text(render()),/Please tell us what work you do/);
  const other=nodes(render()).find(n=>n.type==='input'&&n.props.placeholder==='Describe your work');assert.ok(other);assert.equal(other.props.required,true);
  other.props.onChange({target:{value:'  General construction, sole prop  '}});await render().props.onSubmit({preventDefault(){}});assert.match(text(render()),/Got it/);
  d=Object.fromEntries(payload.details.map(x=>[x.label,x.value]));assert.equal(d.Trade,'General construction, sole prop');assert.equal(payload.businessType,'General construction, sole prop');assert.equal(d['Page trade'],'Painter');
  assert.equal(FormMod.statedTrade('',''),'');assert.equal(FormMod.NOT_STATED,undefined);
 }
 // Workers' comp guides (2026-10-10): the form records coverage ["Workers Comp"] in the CRM; trade pages send none.
 {const saved=formProps;
  formProps={source:'seo-wc-contractor-workers-comp-insurance',tradeLabel:'Contractor',coverageRequested:['Workers Comp']};
  mode='success';reset();
  const opts=nodes(nodes(render()).find(n=>n.type==='select')).filter(n=>n.type==='option').map(o=>o.props.value);
  assert.ok(!opts.includes('Contractor'),'generic page label is not offered as a trade');assert.ok(opts.includes('General contractor'));
  fill('General contractor');await render().props.onSubmit({preventDefault(){}});assert.match(text(render()),/Got it/);
  assert.deepEqual(payload.coverage,['Workers Comp']);
  const wd=Object.fromEntries(payload.details.map(x=>[x.label,x.value]));assert.equal(wd['Coverage requested'],"Workers' comp");assert.equal(wd['Page source'],'seo-wc-contractor-workers-comp-insurance');
  assert.deepEqual(crmCalls[0].coverage,['Workers Comp'],'CRM forward carries the WC request');
  formProps=saved;reset();fill();await render().props.onSubmit({preventDefault(){}});
  assert.equal(payload.coverage,undefined);assert.equal(crmCalls[0].coverage,undefined,'trade pages send no coverage');
  // the route drops anything outside the allowlist
  const {NextRequest:NR}=require('next/server');crmCalls=[];
  const bad={name:'QA TEST ONLY',email:'seo-test@example.invalid',phone:'2025550184',company:'QA TEST ONLY Co',businessType:'Painter',source:'contractors-landing',coverage:['Workers Comp','Cyber'],details:[{label:'Page source',value:'seo-painter-new-york'}]};
  await POST(new NR('http://localhost/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(bad)}));
  assert.equal(crmCalls[0].coverage,undefined,'a non-allowlisted value drops the whole coverage key');
 }
 // Workers' comp trade/state/restaurant pages (Kevin 2026-10-15): real bound policies only, every page records WC.
 {const WC=require('../lib/guides/workers-comp-resources.ts'),{getStartupGuide}=require('../lib/guides/catalog.ts');
  const slugs=['workers-comp-insurance-for-remodelers','workers-comp-insurance-for-general-contractors','workers-comp-insurance-for-electricians','workers-comp-insurance-for-hvac-contractors','workers-comp-insurance-for-concrete-and-masonry-contractors','restaurant-workers-comp-insurance','workers-comp-cost-for-contractors-in-florida','workers-comp-cost-for-contractors-in-new-york','workers-comp-cost-for-contractors-in-georgia','workers-comp-cost-for-contractors-in-north-carolina'];
  const real=new Set(Object.values(WC.WC_POLICIES).map(p=>`$${p.usd.toLocaleString('en-US')}`));
  assert.deepEqual([...real].sort(),['$1,182','$1,237','$1,575','$2,565','$3,562','$3,774','$509','$572'].sort(),'the approved bound WC policies');
  const sitemap=require('../lib/seo/sitemap-sections.ts').sitemapSection('guides').map(e=>e.url);
  const hub=JSON.stringify(getStartupGuide('contractor-workers-comp-insurance'));
  for(const slug of slugs){const guide=getStartupGuide(slug);assert.ok(guide,slug);
   assert.deepEqual(guide.coverageRequested,['Workers Comp'],`${slug} records WC`);
   assert.ok(guide.title.length<=62,`${slug} title length`);assert.ok(guide.description.length<=155,`${slug} description length`);
   const body=JSON.stringify(guide);
   for(const amount of body.match(/\$[\d,]+(?= a year|\/yr)/g)||[])assert.ok(real.has(amount),`${slug}: ${amount} is not a real WC policy`);
   assert.doesNotMatch(body,/average (?:is|of|cost)|\branges? from\b|save \d|savings|guarantee/i,`${slug}: no averages, savings or guarantees`);
   assert.ok(sitemap.includes(`https://www.cohesiveinsure.com/guides/${slug}`),`${slug} in the guides sitemap`);
   assert.ok(hub.includes(`/guides/${slug}`),`${slug} linked from the WC hub guide`);}
  assert.equal(getStartupGuide('restaurant-workers-comp-insurance').quoteForm,'restaurant-short','restaurant WC uses the restaurant short form');
  // No WC page for Texas or the state-fund states, and no teaser on their trade pages.
  for(const st of ['texas','ohio','washington','north-dakota','wyoming']){
   assert.ok(!sitemap.some(u=>u.includes('workers-comp')&&u.includes(st)),`no WC page for ${st}`);
   assert.equal(WC.wcTeaserAllowed(st,'Anywhere'),false,st);}
  assert.equal(WC.wcTeaserAllowed(undefined,'Columbus, Ohio'),false);assert.equal(WC.wcTeaserAllowed(undefined,'Texas'),false);
  assert.equal(WC.wcTeaserAllowed(undefined,'United States'),true);assert.equal(WC.wcTeaserAllowed('georgia','Georgia'),true);
  assert.equal(WC.wcTeaserAllowed(undefined,'Washington, District of Columbia'),true);
  for(const t of ['remodeler','general-contractor','electrician','hvac','concrete','masonry','restaurant'])assert.ok(WC.WC_TRADE_TEASERS[t],t);
  // Rendered SeoPage: the teaser shows on an eligible trade/state page and on a restaurant page, never in TX or a
  // state-fund state, and never on catering / food-truck pages.
  {const geo=require('../app/insurance/[vertical]/[geo]/page.tsx'),nat=require('../app/insurance/[vertical]/page.tsx');
   const shown=async(route,params)=>{const el=await route.default({params:Promise.resolve(params)});return text(el.type(el.props));};
   assert.match(await shown(geo,{vertical:'electrician',geo:'georgia'}),/Workers' comp for electricians.*\$3,774 a year/s);
   assert.match(await shown(nat,{vertical:'hvac'}),/\$1,182 a year for workers' comp/);
   assert.match(await shown(geo,{vertical:'restaurant',geo:'new-york'}),/\$509 a year for workers' comp/);
   for(const st of ['texas','ohio'])assert.doesNotMatch(await shown(geo,{vertical:'electrician',geo:st}),/\$3,774/,`no WC teaser on electrician/${st}`);
   assert.doesNotMatch(await shown(geo,{vertical:'restaurant',geo:'ohio'}),/\$509 a year for workers' comp/);
   for(const v of ['catering','food-truck'])assert.doesNotMatch(await shown(nat,{vertical:v}),/Workers' comp for restaurants/,v);
   assert.doesNotMatch(await shown(geo,{vertical:'painter',geo:'georgia'}),/for workers' comp, written with/,'no teaser on a trade without a WC policy');}
  // A trade WC page pre-lists its trade but selects nothing; the submit records WC.
  formProps={source:'seo-wc-workers-comp-insurance-for-electricians',tradeLabel:'Electrician',coverageRequested:['Workers Comp']};mode='success';reset();
  assert.equal(nodes(nodes(render()).find(n=>n.type==='select')).filter(n=>n.type==='option').map(o=>o.props.value)[1],'Electrician');
  fill('Electrician');await render().props.onSubmit({preventDefault(){}});
  assert.deepEqual(payload.coverage,['Workers Comp']);assert.deepEqual(crmCalls[0].coverage,['Workers Comp']);
  formProps={source:'seo-painter-new-york',tradeLabel:'Painter'};reset();
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
