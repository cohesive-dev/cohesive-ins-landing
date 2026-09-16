const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),load=Module._load;
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:f}).outputText,f);
Module._load=function(req,parent,main){return load.call(this,req.startsWith('@/')?path.join(root,req.slice(2)):req,parent,main)};
const {METRO_PAGES,metroLinksFor,METRO_RELEASE_PATHS}=require('../lib/seo/metro-pages.ts');
const route=require('../app/insurance/[vertical]/[geo]/[metro]/page.tsx');
const {getTrade}=require('../lib/seo/contractors.ts');const stateRoute=require('../app/insurance/[vertical]/[geo]/page.tsx');
const sitemap=require('../app/sitemap.ts').default();const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/.well-known/cohesive-content-release.json')));
(async()=>{
 assert.equal(METRO_PAGES.length,183);assert.equal(new Set(METRO_PAGES.map(p=>p.path)).size,183);assert.equal(route.dynamicParams,false);
 for(const t of ['remodeler','siding','glass-glazing','electrician','plumber','handyman','hvac','painter'])assert.equal(METRO_PAGES.filter(p=>p.trade===t).length,20,t+' cohort');
 const parents=stateRoute.generateStaticParams();
 for(const p of METRO_PAGES){
  const params={vertical:p.trade,geo:p.state,metro:p.city};
  assert.ok(parents.some(v=>v.vertical===p.trade&&v.geo===p.state),'parent is buildable');
  const el=await route.default({params:Promise.resolve(params)});assert.equal(el.props.source,p.source);assert.equal(el.props.tradeLabel,getTrade(p.trade).intakeLabel??getTrade(p.trade).name);assert.equal(el.props.operationsPrompt,p.operationsPrompt);
  assert.equal(el.props.areaServed,`${p.cityName}, ${p.stateName}`);assert.equal(el.props.stateSlug,p.state);
  assert.ok(el.props.breadcrumbs.some(b=>b.href===p.parentPath));
  const meta=await route.generateMetadata({params:Promise.resolve(params)});assert.equal(meta.alternates.canonical,p.path);assert.equal(meta.title,p.content.title);
  assert.ok(metroLinksFor(p.trade,p.state).some(l=>l.href===p.path));assert.ok(metroLinksFor(p.trade).some(l=>l.href===p.path));assert.ok(!metroLinksFor(p.trade,p.state,p.city).some(l=>l.href===p.path));
  assert.ok(p.content.stateFacts.some(f=>f.source?.href.startsWith('https://')));assert.match(p.content.heroH1,new RegExp(p.cityName));
  assert.doesNotMatch(JSON.stringify(p.content.costRows),/\$|\/mo|from /i);assert.ok(p.content.metaDescription.length<=210);
  assert.ok(sitemap.some(e=>e.url.endsWith(p.path)&&e.lastModified==='2026-09-16'));
 }
 assert.equal(route.generateStaticParams().length,183);
 assert.deepEqual(route.generateStaticParams({params:{vertical:'pool',geo:'texas'}}),['dallas','houston','austin','san-antonio'].map(metro=>({vertical:'pool',geo:'texas',metro})));
 assert.deepEqual(route.generateStaticParams({params:{vertical:'pool',geo:'california'}}),[]);
 for(const params of [{vertical:'pool',geo:'florida',metro:'dallas'},{vertical:'cleaning',geo:'florida',metro:'orlando'},{vertical:'pool',geo:'california',metro:'los-angeles'}]){
  await assert.rejects(()=>route.default({params:Promise.resolve(params)}),/404/);assert.deepEqual(await route.generateMetadata({params:Promise.resolve(params)}),{});
 }
 assert.equal(new Set(sitemap.map(e=>e.url)).size,sitemap.length);
 if(manifest.release==='seo-20260916-metro-pilot-v1')assert.deepEqual(new Set(manifest.paths),new Set(METRO_RELEASE_PATHS));
 assert.deepEqual(metroLinksFor('unknown'),[]);
 console.log('PASS: 183 real metro routes, canonical metadata, parent/national discovery, actual trade labels, source attribution props, nested generation, restricted/unknown404 and sitemap/release scope.');
})().catch(e=>{console.error(e);process.exitCode=1});
