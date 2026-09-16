// Exercise actual guide data, rendered component handlers and intake routing offline.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),load=Module._load;
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:f}).outputText,f);
let values=[],cursor=0,effect=false,payload,calls=[],emails=[],mode='ok';
Module._load=function(req,parent,main){
 if(req==='react')return {...load.call(this,req,parent,main),useState(init){let i=cursor++;if(!(i in values))values[i]=init;return[values[i],v=>values[i]=typeof v==='function'?v(values[i]):v];},useEffect(fn){if(!effect){effect=true;fn();}}};
 if(req==='@vercel/analytics')return {track(){}};
 if(req==='@/lib/notify')return {sendIntakeNotification:async f=>{emails.push(f);return true;}};
 if(req.startsWith('@/'))req=path.join(root,req.slice(2));return load.call(this,req,parent,main);
};
const store=new Map();global.sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
global.window={location:{pathname:'/guides/how-to-start-a-pool-construction-business',search:'?utm_source=smartlead&utm_medium=email&utm_content=bundle-growth-v1'}};global.document={referrer:''};
const {STARTUP_GUIDES}=require('../lib/guides/catalog.ts'),Form=require('../components/guides/StartupQuoteForm.tsx').default,{POST}=require('../app/api/intake/route.ts'),{NextRequest}=require('next/server');
const props={slug:'how-to-start-a-pool-construction-business',industry:'Pool construction',tradeLabel:'Pool construction',initialState:'texas',states:[{slug:'texas',name:'Texas'},{slug:'california',name:'California'}],bundleOffer:true};
function render(p=props){cursor=0;return Form(p);}
function nodes(n){if(!n||typeof n!=='object')return[];if(Array.isArray(n))return n.flatMap(nodes);return[n,...nodes(n.props?.children)];}
function text(n){if(typeof n==='string')return n;if(!n||typeof n!=='object')return '';if(Array.isArray(n))return n.map(text).join('');return text(n.props?.children);}
function reset(p=props){values=[];effect=false;store.clear();calls=[];emails=[];render(p);render(p);}
const NativeFormData=global.FormData;global.FormData=class{constructor(v){this.v=v;}get(k){return this.v[k]??null;}};
const fields={name:'QA TEST ONLY',company:'QA TEST ONLY Startup',email:'startup-test@example.invalid',phone:'2025550184',timeline:'Within 30 days',operations:'Pool installation',bundleInterest:'yes'};
global.fetch=async(url,opt)=>{
 if(url==='/api/intake'){payload=JSON.parse(opt.body);if(mode==='unconfirmed')return new Response(JSON.stringify({ok:true,crm:'skipped',notification:'skipped'}));return POST(new NextRequest('http://localhost/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:opt.body}));}
 assert.equal(url,'https://crm.cohesiveinsure.com/api/webhooks/inbound-lead');calls.push(JSON.parse(opt.body));return new Response(JSON.stringify({ok:true}));
};
(async()=>{
 const eligible=STARTUP_GUIDES.filter(g=>g.sections.some(s=>s.id==='cohesive-ai-referrals'));
 assert.equal(eligible.filter(g=>g.kind!=='growth').length,100);assert.equal(eligible.filter(g=>g.kind==='growth').length,21);assert.ok(eligible.every(g=>!g.noQuote));
 const plans=STARTUP_GUIDES.filter(g=>g.sections.some(s=>s.id==='first-customer-plan'));
 assert.equal(plans.length,102);assert.equal(plans.filter(g=>g.noQuote).length,2);
 for(const g of plans){assert.equal(g.updatedAt,'2026-09-14');assert.equal(new Set(g.sections.map(s=>s.id)).size,g.sections.length);assert.ok(g.sections.find(s=>s.id==='first-customer-plan').links.every(l=>fs.existsSync(path.join(root,'public',l.href))));}
 const growthRoute=require('../app/guides/[slug]/page.tsx');
 const {METRO_PAGES}=require('../lib/seo/metro-pages.ts');
 const growth=STARTUP_GUIDES.filter(g=>g.kind==='growth');assert.equal(growth.length,21);
 assert.equal(growth.filter(g=>g.industry==='Pool construction').length,20);
 const sitemap=require('../app/sitemap.ts').default();
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/.well-known/cohesive-content-release.json')));
 for(const g of growth){
  const page=await growthRoute.default({params:Promise.resolve({slug:g.slug})});
  const form=nodes(page).find(n=>n.type===Form);assert.ok(form,'actual route renders existing intake form');
  assert.equal(form.props.initialState,g.stateSlug);assert.equal(form.props.bundleOffer,true);assert.ok(g.sections.find(s=>s.id==='cohesive-ai-referrals').paragraphs[0].includes('free list of local property managers and general contractors'));
  const meta=await growthRoute.generateMetadata({params:Promise.resolve({slug:g.slug})});assert.equal(meta.alternates.canonical,'/guides/'+g.slug);
  assert.ok(sitemap.some(u=>u.url.endsWith('/guides/'+g.slug)&&u.lastModified==='2026-09-16'));
  assert.ok(manifest.paths.includes('/guides/'+g.slug));
  assert.equal(new Set(g.sections.map(s=>s.id)).size,g.sections.length);
  assert.equal(g.sections.some(s=>s.id==='startup-vendors'),false,'growth guide does not inherit unrelated setup/vendor pitch');
  assert.ok(g.sections.some(s=>s.links?.some(l=>l.href.startsWith('https://')&&!l.href.includes('cohesive'))));
  assert.equal(require('../lib/guides/catalog.ts').getStateGuides(g).length,0,'no fake duplicate city entries in all-state navigation');
  if(g.industry==='Pool construction')assert.ok(METRO_PAGES.some(p=>p.path===g.insurancePath));
  for(const search of ['', '?utm_source=smartlead&utm_medium=email&utm_content=metro-growth']){
   window.location={pathname:'/guides/'+g.slug,search};document.referrer='https://www.bing.com/';reset(form.props);
   await render(form.props).props.onSubmit({preventDefault(){},currentTarget:{...fields,operations:'Actual '+g.industry+' work; original client facts'}});
   assert.match(text(render(form.props)),/request has been received/);assert.equal(calls.length,1);assert.equal(calls[0].suppress_first_touch,'true');
   assert.equal(payload.source,'seo-startup-'+g.slug);assert.equal(payload.startupState,g.stateSlug);
   const d=Object.fromEntries(payload.details.map(v=>[v.label,v.value]));assert.equal(d['Startup guide'],'/guides/'+g.slug);assert.equal(d.Referrer,'https://www.bing.com/');
   assert.equal(d['Cohesive AI bundle interest'],'Requested information about free outreach with insurance');
   assert.ok(JSON.stringify(calls[0]).includes(g.slug));assert.ok(JSON.stringify(calls[0]).includes('original client facts'));
   if(search)assert.equal(d['Traffic source'],'smartlead / email');
  }
 }
 window.location={pathname:'/guides/how-to-start-a-pool-construction-business',search:'?utm_source=smartlead&utm_medium=email&utm_content=bundle-growth-v1'};document.referrer='';
 reset();await render().props.onSubmit({preventDefault(){},currentTarget:fields});assert.match(text(render()),/request has been received/);assert.equal(calls.length,1);assert.equal(emails[0].partial,false);assert.equal(calls[0].suppress_first_touch,'true');
 const d=Object.fromEntries(payload.details.map(v=>[v.label,v.value]));assert.equal(d['Ad name'],'bundle-growth-v1');assert.equal(d['Traffic source'],'smartlead / email');assert.equal(d['Cohesive AI bundle interest'],'Requested information about free outreach with insurance');assert.equal(payload.source,'seo-startup-'+props.slug);
 reset();await render().props.onSubmit({preventDefault(){},currentTarget:{...fields,bundleInterest:undefined}});assert.match(text(render()),/request has been received/);assert.equal(payload.details.find(x=>x.label==='Cohesive AI bundle interest').value,'Not requested');
 mode='unconfirmed';reset();await render().props.onSubmit({preventDefault(){},currentTarget:fields});assert.doesNotMatch(text(render()),/request has been received/);assert.match(text(render()),/could not confirm/);
 reset();nodes(render()).find(n=>n.type==='select'&&n.props.name==='state').props.onChange({target:{value:'california'}});assert.equal(nodes(render()).some(n=>n.props?.name==='bundleInterest'),false);assert.equal(nodes(render()).find(n=>n.type==='button').props.disabled,true);await render().props.onSubmit({preventDefault(){},currentTarget:fields});assert.equal(calls.length,0);
 reset();assert.equal(nodes(render({...props,bundleOffer:false})).some(n=>n.props?.name==='bundleInterest'),false);
 console.log('PASS: 100 existing offers + 21 growth guides, 102 customer plans, all growth routes/metadata and organic/email intake paths, optional interest and source persist through real CRM route, unconfirmed delivery refuses success, restricted state blocks submit. No external requests.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{global.FormData=NativeFormData;});
