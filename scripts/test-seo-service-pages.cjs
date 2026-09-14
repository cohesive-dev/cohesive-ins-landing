// Exercise the public route allowlists, composed pages and rendered link identity.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),load=Module._load;
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:f}).outputText,f);
Module._load=function(req,parent,main){return load.call(this,req.startsWith('@/')?path.join(root,req.slice(2)):req,parent,main);};
const {INSURANCE_SERVICES,SERVICE_PATHS,serviceContent,relatedServiceLinks}=require('../lib/seo/service-industries.ts');
const national=require('../app/insurance/[vertical]/page.tsx'),state=require('../app/insurance/[vertical]/[geo]/page.tsx'),sitemap=require('../app/sitemap.ts').default();
const SeoPage=require('../components/SeoPage.tsx').default;
function nodes(n){if(!n||typeof n!=='object')return[];if(Array.isArray(n))return n.flatMap(nodes);return[n,...nodes(n.props?.children)];}
(async()=>{
assert.equal(SERVICE_PATHS.length,18);assert.equal(new Set(sitemap.map(s=>s.url)).size,sitemap.length);
for(const service of INSURANCE_SERVICES){
 assert.ok(national.generateStaticParams().some(p=>p.vertical===service.slug));
 assert.deepEqual(Object.keys(service.stateProfiles).sort(),['arizona','florida','georgia','north-carolina','texas']);
 assert.equal(new Set(Object.values(service.stateProfiles).map(p=>p.intro)).size,5);
 for(const geo of [undefined,...Object.keys(service.stateProfiles)]){
  const content=serviceContent(service.slug,geo);assert.ok(content);assert.doesNotMatch(JSON.stringify(content.costRows),/\$|\/mo/);
  const url='/insurance/'+service.slug+(geo?'/'+geo:'');assert.ok(sitemap.some(s=>s.url.endsWith(url)));
  const rendered=await(geo?state.default({params:Promise.resolve({vertical:service.slug,geo})}):national.default({params:Promise.resolve({vertical:service.slug})}));
  assert.equal(rendered.props.tradeSlug,service.slug);assert.equal(rendered.props.stateSlug,geo);assert.equal(rendered.props.tradeLabel,service.intakeLabel);
  const links=nodes(SeoPage(rendered.props)).map(n=>n.props?.href).filter(Boolean);
  for(const href of links.filter(h=>h.startsWith('/insurance/')||h.startsWith('/guides/')))assert.ok(sitemap.some(s=>s.url.endsWith(href)),href);
  assert.ok(!links.some(h=>h.includes('-in-service-')));assert.ok(links.includes(service.guidePath));
  if(geo)assert.ok(state.generateStaticParams().some(p=>p.vertical===service.slug&&p.geo===geo));
 }
 for(const geo of ['california','michigan','washington','new-york','toString','not-a-state']){
  assert.equal(serviceContent(service.slug,geo),undefined);assert.ok(!state.generateStaticParams().some(p=>p.vertical===service.slug&&p.geo===geo));
  await assert.rejects(()=>state.default({params:Promise.resolve({vertical:service.slug,geo})}),/404/);
 }
}
assert.ok(relatedServiceLinks('pool','texas').some(l=>l.href==='/insurance/pool-service/texas'));
assert.ok(relatedServiceLinks('pool','new-york').some(l=>l.href==='/insurance/pool-service'));
const {POOL_TREE_STATE_PROFILES}=require('../lib/seo/pool-tree-state-profiles.ts');const {getTrade}=require('../lib/seo/contractors.ts');const {getContractorState,buildContractorState}=require('../lib/seo/contractor-states.ts');
assert.equal(Object.keys(POOL_TREE_STATE_PROFILES).length,6);
for(const [key,profile]of Object.entries(POOL_TREE_STATE_PROFILES)){const [trade,geo]=key.split('/'),content=buildContractorState(getContractorState(geo),getTrade(trade));assert.equal(content.heroSub,profile.intro);assert.equal(content.reviewedOn,'2026-09-14');assert.ok(sitemap.some(s=>s.url.endsWith('/insurance/'+key)&&s.lastModified==='2026-09-14'));}
console.log('PASS: 18 new pages, six enriched pages, explicit five-state scope, sitemap agreement, real route props and rendered links, pool/pool-service identity separation.');
})().catch(e=>{console.error(e);process.exitCode=1;});
