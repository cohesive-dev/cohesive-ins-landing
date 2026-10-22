// Spanish SEO pages (Kevin 2026-10-22): copy rules, hreflang/canonical/sitemap plumbing, and the Spanish restaurant
// short form through the real /api/intake (externals stubbed).
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),originalLoad=Module._load;
let states=[],cursor=0,effectRan=false,crmCalls=[],emails=[],payload,intakeBodies=[];
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:f}).outputText,f);
Module._load=function(req,parent,isMain){
 if(req==='react'){const real=originalLoad.call(this,req,parent,isMain);return {...real,useState(init){const i=cursor++;if(!(i in states))states[i]=init;return[states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];},useRef(init){const i=cursor++;if(!(i in states))states[i]={current:init};return states[i];},useMemo(fn){return fn();},useCallback(fn){return fn;},useEffect(fn){if(!effectRan){effectRan=true;fn();}}};}
 if(req==='@vercel/analytics')return {track(){}};
 if(req==='next/navigation')return {useSearchParams:()=>new URLSearchParams('')};
 if(req==='@/lib/notify')return {sendIntakeNotification:async f=>{emails.push(f);return true;}};
 if(req.startsWith('@/'))req=path.join(root,req.slice(2));return originalLoad.call(this,req,parent,isMain);
};
const store=new Map();global.sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
global.window={location:{pathname:'/es/seguro/restaurantes-mexicanos',search:''}};global.document={referrer:''};
const {NextRequest}=require('next/server'),{POST}=require('../app/api/intake/route.ts');
global.fetch=async(url,options)=>{
 if(url==='/api/intake'){payload=JSON.parse(options.body);intakeBodies.push(payload);return POST(new NextRequest('http://localhost/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:options.body}));}
 assert.equal(url,'https://crm.cohesiveinsure.com/api/webhooks/inbound-lead','unexpected network destination');
 crmCalls.push(JSON.parse(options.body));return new Response(JSON.stringify({ok:true}),{status:200});
};
function nodes(n){if(!n||typeof n!=='object')return[];if(Array.isArray(n))return n.flatMap(nodes);return[n,...nodes(n.props?.children)];}
function text(n){if(typeof n==='string'||typeof n==='number')return String(n);if(!n||typeof n!=='object')return '';if(Array.isArray(n))return n.map(text).join('');return text(n.props?.children);}
const BASE='https://www.cohesiveinsure.com';
(async()=>{
 const P=require('../lib/es/pages.ts');
 // 1. Copy rules over every Spanish source file.
 const files=['lib/es/contractor-content.ts','lib/es/contractor-form-es.ts','components/es/SpanishShell.tsx','components/es/SpanishTradePage.tsx','components/es/SpanishContractorForm.tsx','components/es/SpanishRestaurantForm.tsx','app/es/seguro/contratistas/page.tsx','app/es/seguro/restaurantes-mexicanos/page.tsx'];
 const visible=f=>fs.readFileSync(path.join(root,f),'utf8').split('\n').filter(l=>!/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
 for(const f of files){const src=visible(f);
  assert.doesNotMatch(src,/—/,`${f}: no em dashes in copy`);
  assert.doesNotMatch(src,/encore|pcic|hartford|amtrust|great american|rainbow|pathpoint|foxquilt|next insurance|coterie/i,`${f}: no carrier names`);
  assert.doesNotMatch(src,/NPN|PRIMARY_NPN|license number|licencia n[uú]mero/i,`${f}: no license numbers`);
  assert.doesNotMatch(src,/testimonio|testimonial|“[^”]*”\s*-\s*[A-Z]/i,`${f}: no testimonials`);}
 // Roofer (and other contractor) prices are QUOTES with revenue beside them; never "aseguramos".
 const C=require('../lib/es/contractor-content.ts');
 const contractorCopy=JSON.stringify(C.ES_TRADE_CONTENT)+visible('app/es/seguro/contratistas/page.tsx');
 assert.doesNotMatch(contractorCopy,/aseguramos/i,'contractor prices are quotes, never "aseguramos"');
 const contractorPrices=new Set(contractorCopy.match(/\$[\d,]+(?= al año)/g));
 assert.deepEqual([...contractorPrices].sort(),['$1,795','$7,497'],'only the two verified roofer quotes');
 for(const p of C.ES_ROOFER.prices)assert.match(p.who,/ingresos/,'revenue beside every roofer price');
 for(const m of contractorCopy.matchAll(/[^.;:]*\$(?:1,795|7,497)[^.;]*/g))assert.match(m[0]+contractorCopy.slice(Math.max(0,m.index-160),m.index),/ingresos/,`revenue near "${m[0].trim()}"`);
 assert.equal(C.ES_GENERAL_CONTRACTOR.prices,undefined);assert.equal(C.ES_REMODELER.prices,undefined);
 assert.match(JSON.stringify(C.ES_ROOFER),/Hablamos español/);assert.match(JSON.stringify(C.ES_ROOFER),/en inglés/,'documents-in-English note');
 // Restaurant prices: exactly the three approved binds, worded "que aseguramos paga", no state names.
 const rest=visible('app/es/seguro/restaurantes-mexicanos/page.tsx');
 assert.deepEqual([...new Set(rest.match(/\$[\d,]+(?= al año)/g))].sort(),['$2,932','$3,320','$5,052']);
 for(const amt of ['$2,932','$3,320','$5,052'])assert.match(rest,new RegExp(`que aseguramos paga \\${amt} al año`),amt);
 const STATES=['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','Nueva York','North Carolina','Carolina del Norte','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Pensilvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
 for(const st of STATES)assert.ok(!new RegExp(`\\b${st}\\b`).test(rest),`no state name on the restaurant page: ${st}`);
 // 2. Metadata: canonical self + hreflang pairs only where an English page exists.
 for(const p of P.ES_PAGES){
  const a=P.esAlternates(p.path);assert.equal(a.canonical,p.path);
  if(p.english)assert.deepEqual(a.languages,{'es-US':p.path,'en-US':p.english,'x-default':p.english});else assert.equal(a.languages,undefined);
 }
 for(const [route,file] of [['/es/seguro/techadores','techadores'],['/es/seguro/contratistas-generales','contratistas-generales'],['/es/seguro/remodelacion','remodelacion'],['/es/seguro/restaurantes-mexicanos','restaurantes-mexicanos'],['/es/seguro/contratistas','contratistas']]){
  const m=require(`../app/es/seguro/${file}/page.tsx`).metadata;
  assert.equal(m.alternates.canonical,route);assert.equal(m.openGraph.locale,'es_US');
  const title=typeof m.title==='string'?m.title:m.title.absolute;assert.ok(title.length<=66,`${route} title length ${title.length}`);assert.ok(m.description.length<=160,`${route} description length ${m.description.length}`);
 }
 // English pages that the hreflang points at must exist as routes (generateStaticParams).
 const nat=require('../app/insurance/[vertical]/page.tsx');const slugs=new Set(nat.generateStaticParams().map(p=>p.vertical));
 for(const p of P.ES_PAGES.filter(p=>p.english))assert.ok(slugs.has(p.english.replace('/insurance/','')),`${p.english} is a real English page`);
 // 3. Sitemap: every Spanish page listed once; reciprocal alternates on the Spanish AND the English URL.
 const S=require('../lib/seo/sitemap-sections.ts');const all=S.allSitemapEntries();
 for(const p of P.ES_PAGES){
  const hits=all.filter(e=>e.url===BASE+p.path);assert.equal(hits.length,1,`${p.path} in the sitemap once`);
  if(p.english){
   const want={'en-US':BASE+p.english,'es-US':BASE+p.path};
   assert.deepEqual(hits[0].alternates?.languages,want,`${p.path} alternates`);
   const en=all.filter(e=>e.url===BASE+p.english);assert.equal(en.length,1,`${p.english} in the sitemap once`);
   assert.deepEqual(en[0].alternates?.languages,want,`${p.english} carries the reciprocal alternate`);
  }else assert.equal(hits[0].alternates,undefined);
 }
 assert.equal(all.filter(e=>e.alternates).length,P.ES_PAGES.filter(p=>p.english).length*2,'no other URL gains alternates');
 // 4. Spanish restaurant form through the real route.
 const Form=require('../components/es/SpanishRestaurantForm.tsx').default;
 const props={source:'seo-es-mexican-restaurant',pageType:{slug:'mexican-restaurant',noun:'Mexican restaurant'}};
 const render=()=>{cursor=0;return Form(props);};
 const reset=()=>{states=[];effectRan=false;store.clear();crmCalls=[];emails=[];intakeBodies=[];payload=undefined;render();};
 const input=ph=>nodes(render()).find(n=>n.type==='input'&&n.props.placeholder===ph);
 reset();
 const select=nodes(render()).find(n=>n.type==='select');assert.equal(select.props.value,'Mexican restaurant','page type pre-filled (editable)');
 assert.equal(text(nodes(select).find(n=>n.type==='option'&&n.props.value==='Mexican restaurant')),'Restaurante mexicano');
 await render().props.onSubmit({preventDefault(){}});assert.match(text(render()),/nombre de su negocio/);assert.equal(intakeBodies.length,0);
 for(const [ph,v] of Object.entries({'Nombre del negocio':'QA TEST ONLY Taquería','Su nombre':'QA TEST ONLY','Código postal':'78216','Correo electrónico':'es-test@example.invalid','Teléfono':'2025550184'}))input(ph).props.onChange({target:{value:v}});
 const renewal=nodes(render()).filter(n=>n.type==='select')[1];assert.equal(text(nodes(renewal).find(n=>n.props?.value==='March')),'marzo');renewal.props.onChange({target:{value:'March'}});
 await render().props.onSubmit({preventDefault(){}});
 assert.match(text(render()),/Ya estamos trabajando en su cotización/);
 assert.equal(payload.source,'seo-es-mexican-restaurant');assert.equal(payload.businessType,'Mexican restaurant');assert.equal(payload.capiEventName,'Lead');
 const d=Object.fromEntries(payload.details.map(x=>[x.label,x.value]));
 assert.equal(d['Preferred language'],'Spanish');assert.equal(d['Business type'],'Mexican restaurant');assert.equal(d['Page type'],'Mexican restaurant');
 assert.equal(d['Current policy renews'],'March');assert.equal(d['Form layout'],'seo-short');assert.ok(d['Not asked on this form']);assert.equal(d['Landing page'],'/es/seguro/restaurantes-mexicanos');
 assert.equal(crmCalls.length,1);assert.ok(crmCalls[0].details.some(x=>x.label==='Preferred language'&&x.value==='Spanish'),'CRM forward carries Preferred language');
 assert.equal(emails.length,1);
 // A bar picked on the restaurant page keeps the English short form's routing (quotes@ + Hedge, no CRM fan-out).
 reset();for(const [ph,v] of Object.entries({'Nombre del negocio':'QA TEST ONLY Cantina','Su nombre':'QA TEST ONLY','Correo electrónico':'es-test@example.invalid','Teléfono':'2025550184'}))input(ph).props.onChange({target:{value:v}});
 nodes(render()).find(n=>n.type==='select').props.onChange({target:{value:'Bar / tavern / brewery'}});
 await render().props.onSubmit({preventDefault(){}});assert.equal(payload.capiEventName,'RestaurantDisqualified');assert.equal(crmCalls.length,0);assert.equal(emails.length,1);
 assert.ok(emails[0].details.some(x=>x.label==='Preferred language'&&x.value==='Spanish'));assert.match(text(render()),/Gracias por escribirnos/);
 console.log('PASS: Spanish pages keep the copy rules (quotes vs binds, revenue beside roofer prices, no carriers/NPN/em dashes/state names), canonical + reciprocal es-US/en-US hreflang in metadata and sitemap, and the Spanish restaurant form reaches the real route with "Preferred language: Spanish". No external requests.');
})().catch(e=>{console.error(e);process.exitCode=1;});
