// Homepage discovery links (2026-10-24): the roofer state pages Google has not indexed are linked from the homepage
// footer (the most-crawled page). Every link is a built route, every linked state carries the roofer price (no
// closed-state page is promoted), and the footer renders the list plus the Spanish roofer page.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),originalLoad=Module._load;
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:f}).outputText,f);
Module._load=function(req,parent,isMain){if(req.startsWith('@/'))req=path.join(root,req.slice(2));return originalLoad.call(this,req,parent,isMain);};
const appFile=rel=>fs.existsSync(path.join(root,'app/(site)',rel))?path.join(root,'app/(site)',rel):path.join(root,'app',rel);
const {ROOFER_DISCOVERY_LINKS}=require('../lib/seo/outcome-priority-links.ts');
const {tradePrice}=require('../lib/seo/trade-prices.ts');
const {getContractorState}=require('../lib/seo/contractor-states.ts');
const geo=require(appFile('insurance/[vertical]/[geo]/page.tsx'));
const built=new Set(geo.generateStaticParams().map(p=>`/insurance/${p.vertical}/${p.geo}`));
assert.ok(ROOFER_DISCOVERY_LINKS.length>=9&&ROOFER_DISCOVERY_LINKS.length<=12,'a short list, not a state dump');
for(const l of ROOFER_DISCOVERY_LINKS){
 assert.ok(built.has(l.href),`${l.href} is a built route`);
 const st=getContractorState(l.href.split('/').pop());assert.ok(st,`${l.href} state exists`);
 assert.ok(tradePrice('roofer',st.abbr),`${l.href}: priced (open) roofer state only`);
 assert.equal(l.label,st.name);
}
for(const h of ['/insurance/roofer/new-york','/insurance/roofer/florida'])assert.ok(ROOFER_DISCOVERY_LINKS.some(l=>l.href===h),h);
assert.ok(!ROOFER_DISCOVERY_LINKS.some(l=>/oklahoma|louisiana|washington/.test(l.href)),'no closed-state roofer page');
const home=fs.readFileSync(appFile('page.tsx'),'utf8');
assert.match(home,/ROOFER_DISCOVERY_LINKS\.map\(/,'homepage footer renders the list');
assert.match(home,/href="\/es\/seguro\/techadores"/,'homepage footer links the Spanish roofer page');
console.log(`PASS: ${ROOFER_DISCOVERY_LINKS.length} homepage roofer discovery links are built, priced (open) state pages incl. NY/FL, plus the Spanish roofer page.`);
