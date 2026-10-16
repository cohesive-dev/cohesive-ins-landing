// Restaurant-family titles and meta descriptions (Kevin 2026-10-12): every page leads with ITS type's approved
// real price, never the New York caterer's $597 on a Charlotte or coffee-shop page. Walks every statically
// generated restaurant/bar page through the real generateMetadata and page builders.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),originalLoad=Module._load;
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,resolveJsonModule:true},fileName:f}).outputText,f);
Module._load=function(req,parent,isMain){if(req.startsWith('@/'))req=path.join(root,req.slice(2));return originalLoad.call(this,req,parent,isMain);};
const R=p=>require(path.join(root,p));
const prices=R('lib/seo/restaurant-prices.ts'),{HEADLINE_PRICES:H}=prices;
const {RESTAURANT_CITY_TYPES}=R('lib/seo/restaurant-types.ts'),{VERTICALS}=R('lib/seo/data.ts');
const vRoute=R('app/insurance/[vertical]/page.tsx'),gRoute=R('app/insurance/[vertical]/[geo]/page.tsx'),mRoute=R('app/insurance/[vertical]/[geo]/[metro]/page.tsx');

// Approved sentences, verbatim (wording is the approval).
assert.equal(H.coffeeShop.sentence,'a coffee shop was quoted $686 a year for general liability');
assert.equal(H.caterer.sentence,'a caterer we insure pays $597 a year for general liability');
assert.equal(H.fullService.sentence,'a full-service restaurant we insure pays $1,153 a year for liability and property');
assert.equal(H.quickService.sentence,'a quick-service restaurant was quoted $1,167 a year for liability and personal property');
// Kevin's mapping; bar has no price.
const EXPECT={'coffee-shop':'coffeeShop',bakery:'coffeeShop','juice-bar':'coffeeShop',catering:'caterer','fast-food-restaurant':'quickService',deli:'quickService','food-truck':'quickService',restaurant:'fullService','fine-dining-restaurant':'fullService'};
for(const [slug,key] of Object.entries(EXPECT))assert.equal(prices.headlinePrice(slug),H[key],slug);
assert.equal(prices.headlinePrice('bar'),undefined);

const families=new Set([...RESTAURANT_CITY_TYPES.map(t=>t.slug),...VERTICALS.map(v=>v.slug)]);
// Every restaurant-family slug is mapped explicitly; nothing inherits a price by omission.
for(const slug of families)assert.ok(prices.HEADLINE_MAPPED_SLUGS.includes(slug),`${slug} has no explicit headline mapping`);
assert.equal(prices.headlinePrice('not-a-mapped-type'),undefined);
assert.equal(prices.headlinePrice('donut-shop'),H.quickService,'a donut shop fries: not the coffee-shop price');
(async()=>{
 const pages=[
  ...vRoute.generateStaticParams().filter(p=>families.has(p.vertical)).map(p=>[vRoute,p]),
  ...gRoute.generateStaticParams().filter(p=>families.has(p.vertical)).map(p=>[gRoute,p]),
  ...mRoute.generateStaticParams({params:{}}).filter(p=>families.has(p.vertical)).map(p=>[mRoute,p]),
 ];
 assert.ok(pages.length>2000,`walked ${pages.length} restaurant-family pages`);
 const seen=new Set();let priced=0;
 for(const [route,params] of pages){
  const url=`/insurance/${Object.values(params).join('/')}`;if(seen.has(url))continue;seen.add(url);
  const md=await route.generateMetadata({params:Promise.resolve(params)});
  const {title,description}=md;assert.ok(title&&description,url);
  assert.ok(title.length<=60,`${url} title ${title.length}: ${title}`);
  assert.ok(description.length<=155,`${url} description ${description.length}: ${description}`);
  const snippet=`${title} ${description}`;
  assert.doesNotMatch(snippet,/from \$/i,`${url}: no "from $X"`);
  assert.doesNotMatch(snippet,/policy we wrote|caterer in New York/,url);
  if(params.geo!=='new-york')assert.doesNotMatch(snippet,/New York/,`${url}: New York on a non-NY page`);
  const h=prices.headlinePrice(params.vertical);
  if(!h){
   assert.equal(params.vertical,'bar');assert.doesNotMatch(snippet,/\$\d/,`${url}: bar pages carry no price`);
   assert.equal(md.robots?.index,false,`${url}: bar pages stay noindexed`);
   const barBody=JSON.stringify((await route.default({params:Promise.resolve(params)})).props.content);
   for(const p of Object.values(H))assert.ok(!barBody.includes(p.sentence)&&!barBody.includes(`$${p.usd.toLocaleString('en-US')}`),`${url}: bar body carries a restaurant headline price`);
   continue;
  }
  // The description carries this type's approved sentence, and no other type's price.
  assert.ok(description.includes(h.sentence)||description===`${h.sentence[0].toUpperCase()}${h.sentence.slice(1)}.`,`${url}: ${description}`);
  for(const other of Object.values(H))if(other!==h)assert.ok(!snippet.includes(`$${other.usd.toLocaleString('en-US')}`),`${url} shows another type's price`);
  // A title price is always this type's, and a quote is worded as a quote.
  if(['restaurant','coffee-shop','catering'].includes(params.vertical))assert.ok(title.includes('$'),`${url}: the price's own type always shows it: ${title}`);
  if(title.includes('$')){priced++;assert.ok(title.includes(`$${h.usd.toLocaleString('en-US')}/yr`),title);if(!h.bound)assert.match(title,/Quoted \$/,title);}
  // Page body: the NY caterer line is gone everywhere, and no state is attached to a non-local price line.
  const page=await route.default({params:Promise.resolve(params)});const body=JSON.stringify(page.props.content);
  assert.doesNotMatch(body,/caterer in New York|in Massachusetts \(renting|coffee house in North Carolina|café-bakery in Chicago|pizzeria in upstate/,`${url} body`);
  if(params.geo!=='new-york')assert.doesNotMatch(body,/in New York|New York\b(?! City)/,`${url}: New York in the body of a non-NY page`);
  if(params.vertical!=='catering')assert.ok(!page.props.content.costNarrative[0].startsWith('The lowest food-service general liability policy we have bound is $597'),`${url}: cost answer still leads with the caterer`);
 }
 // Long city/concept names drop the title price rather than borrow a tag that misdescribes the type;
 // the description always carries it.
 assert.ok(priced/seen.size>0.6,`${priced}/${seen.size} titles carry the price`);

 // The cost guide: same four approved lines, registered in the catalog and the guides sitemap.
 const guide=R('lib/guides/catalog.ts').getStartupGuide('restaurant-insurance-cost');assert.ok(guide);
 assert.equal(guide.title,'What restaurant insurance costs: real policies and quotes');assert.equal(guide.quoteForm,'restaurant-short');
 const lines=guide.sections.find(s=>s.id==='real-prices').paragraphs;
 for(const h of Object.values(H))assert.ok(lines.some(l=>l.startsWith(`${h.sentence[0].toUpperCase()}${h.sentence.slice(1)}.`)),h.sentence);
 const all=JSON.stringify(guide);
 assert.doesNotMatch(all,/average (?:is|of|cost)|\branges? from\b|save \d|savings|New York|North Carolina|Massachusetts/i,'no averages, ranges, savings or state claims');
 for(const want of ['Yearly sales.','Alcohol share of sales.','Type of restaurant.','Address.','Your current policy or declarations page.','Your renewal date.'])assert.ok(guide.sections.find(s=>s.id==='what-to-have-ready').checklist.includes(want),want);
 const drivers=guide.sections.find(s=>s.id==='price-drivers').paragraphs.join(' ');
 for(const w of [/sales/,/alcohol/i,/fryers/i,/open flame/,/hood/i,/suppression/,/owning the building|rent/i,/contents/i,/claims/i])assert.match(drivers,w);
 assert.ok(guide.description.length<=155);
 const sitemap=R('lib/seo/sitemap-sections.ts').sitemapSection('guides');
 assert.ok(sitemap.some(e=>e.url==='https://www.cohesiveinsure.com/guides/restaurant-insurance-cost'),'guide in the guides sitemap');
 // The guide renders the short restaurant form, not the startup form (which demands a state).
 const pageSrc=fs.readFileSync(path.join(root,'app/guides/[slug]/page.tsx'),'utf8');
 assert.match(pageSrc,/guide\.quoteForm === "restaurant-short" \? <RestaurantQuickQuote source=\{`seo-guide-\$\{guide\.slug\}`\} \/> : <StartupQuoteForm bundleOffer=\{bundle\} slug=\{guide\.slug\}/,'both arms: short form for the cost guide, startup form for every other guide');
assert.equal((pageSrc.match(/<StartupQuoteForm /g)||[]).length,1);
 // Linked from the restaurant SEO pages' existing guide links.
 assert.match(fs.readFileSync(path.join(root,'components/SeoPage.tsx'),'utf8'),/href="\/guides\/restaurant-insurance-cost"/);
 // ---- Kevin 2026-10-15: coffee shop + bakery cost guides, state hubs, sitemap pruning, New York rebuild ----
 const cat=R('lib/guides/catalog.ts');
 for(const [slug,figures] of [['coffee-shop-insurance-cost',[prices.conceptQuote('coffee-shop').usd,prices.conceptBindable('coffee-shop').usd]],['bakery-insurance-cost',[prices.conceptBind('bakery').usd,prices.conceptBindable('bakery').usd]]]){
  const g=cat.getStartupGuide(slug);assert.ok(g,slug);assert.equal(g.quoteForm,'restaurant-short');
  assert.ok(g.title.length<=60&&g.description.length<=155,`${slug} title/description length`);
  const real=g.sections.find(x=>x.id==='real-prices').paragraphs.join(' ');
  for(const f of figures)assert.ok(real.includes(`$${f.toLocaleString('en-US')} a year`),`${slug}: $${f}`);
  assert.deepEqual([...new Set(JSON.stringify(g).match(/\$[\d,]+/g))].sort(),figures.map(f=>`$${f.toLocaleString('en-US')}`).sort(),`${slug}: only its approved figures`);
  assert.match(real,/quote/);assert.doesNotMatch(JSON.stringify(g),/average (?:is|of|cost)|\branges? from\b|save \d|savings|New York|North Carolina|Chicago/i);
  assert.ok(sitemap.some(e=>e.url===`https://www.cohesiveinsure.com/guides/${slug}`),`${slug} in the guides sitemap`);
 }
 // Sitemap: type x state URLs with 0 impressions in 60 days leave the sitemap; the pages stay generated and indexable.
 const SM=R('lib/seo/sitemap-sections.ts'),RT=R('lib/seo/restaurant-types.ts');
 const typeState=RT.RESTAURANT_TYPES.flatMap(t=>RT.RESTAURANT_TYPE_STATES.map(st=>[t.slug,st.slug]));
 const restSm=new Set(SM.sitemapSection('restaurant').map(e=>e.url));
 const out=typeState.filter(([t,st])=>!restSm.has(`https://www.cohesiveinsure.com/insurance/${t}/${st}`));
 assert.equal(typeState.length,1900);assert.equal(out.length,1122,'1,122 zero-impression type x state URLs leave the sitemap');
 // Independent fixture from the same Search Console pull: pages WITH impressions stay, sampled zero-impression pages go.
 for(const u of ['fast-food-restaurant/new-york','deli/new-york','bakery/new-york','coffee-shop/north-carolina'])assert.ok(restSm.has(`https://www.cohesiveinsure.com/insurance/${u}`),`${u} had impressions and stays`);
 for(const u of ['soul-food-restaurant/alabama','korean-restaurant/wyoming','halal-restaurant/vermont'])assert.ok(!restSm.has(`https://www.cohesiveinsure.com/insurance/${u}`),`${u} had 0 impressions and leaves`);
 for(const [t,st] of out)assert.equal(SM.restaurantTypeStateInSitemap(t,st),false);
 for(const st of RT.RESTAURANT_TYPE_STATES)assert.ok(restSm.has(`https://www.cohesiveinsure.com/insurance/restaurant/${st.slug}`),`state hub ${st.slug} stays in the sitemap`);
 const staticParams=new Set(gRoute.generateStaticParams().map(p=>`${p.vertical}/${p.geo}`));
 for(const [t,st] of out.slice(0,1122))assert.ok(staticParams.has(`${t}/${st}`),`${t}/${st} still generated`);
 for(const [t,st] of [out[0],out[out.length-1]]){const md=await gRoute.generateMetadata({params:Promise.resolve({vertical:t,geo:st})});assert.equal(md.robots,undefined,`${t}/${st} stays indexable`);assert.equal(md.alternates.canonical,`/insurance/${t}/${st}`);}
 // Hub and spoke: each type x state page links up to its state hub (breadcrumb + related link); the hub links down.
 {const page=await gRoute.default({params:Promise.resolve({vertical:'coffee-shop',geo:'ohio'})});
  assert.deepEqual(page.props.breadcrumbs.at(-1),{label:'Ohio restaurant insurance',href:'/insurance/restaurant/ohio'});
  assert.ok(page.props.relatedLinks.some(l=>l.href==='/insurance/restaurant/ohio'));
  for(const st of ['new-york','idaho']){const hub=await gRoute.default({params:Promise.resolve({vertical:'restaurant',geo:st})});
   for(const t of RT.RESTAURANT_TYPES)assert.ok(hub.props.relatedLinks.some(l=>l.href===`/insurance/${t.slug}/${st}`),`${st} hub links ${t.slug}`);}}
 // New York hub: the New York policies we placed and New York's own rules, each with an official source.
 {const ny=(await gRoute.default({params:Promise.resolve({vertical:'restaurant',geo:'new-york'})})).props.content;const body=JSON.stringify(ny);
  for(const want of ['$1,153 a year for liability and property','$597 a year for general liability','$849 a year for general liability','$509 a year'])assert.ok(body.includes(want),want);
  assert.doesNotMatch(body,/most expensive state|pricing credit|\$\d+-\$?\d+\/mo/,'no unsupported claims or template ranges');
  const official=/^https:\/\/(www\.wcb\.ny\.gov|www\.nysenate\.gov|nyc-business\.nyc\.gov|regs\.health\.ny\.gov)\//;
  for(const want of [/Workers' comp/,/Disability and Paid Family Leave/,/Dram shop/,/five boroughs/,/Outside New York City/]){
   const f=ny.stateFacts.find(x=>want.test(x.title));assert.ok(f,`NY fact ${want}`);assert.match(f.source?.href??'',official,f.title);}
  assert.match(fs.readFileSync(path.join(root,'app/page.tsx'),'utf8'),/href: "\/insurance\/restaurant\/new-york"/,'homepage links the NY hub');
  assert.match(fs.readFileSync(path.join(root,'app/insurance/page.tsx'),'utf8'),/href="\/insurance\/restaurant\/new-york"/,'/insurance links the NY hub');}
 // CTR pass 2026-10-16: restaurant opening guides and the lease guide fit ~60 characters with " | Cohesive" (H1 unchanged);
 // church titles lead with the bound $445 liability price; price-free trade titles name the full state.
 {const gR=R('app/guides/[slug]/page.tsx'),{STARTUP_GUIDES}=R('lib/guides/catalog.ts');
  const open=STARTUP_GUIDES.filter(g=>/^how-to-open-a-restaurant-in-/.test(g.slug));assert.ok(open.length>=50,`${open.length} state opening guides`);
  for(const g of [...open,STARTUP_GUIDES.find(x=>x.slug==='restaurant-lease-insurance-requirements')]){
   const md=await gR.generateMetadata({params:Promise.resolve({slug:g.slug})});
   assert.ok(md.title.length<=60,`${g.slug} title ${md.title.length}: ${md.title}`);assert.ok(md.description.length<=155,`${g.slug} description ${md.description.length}`);
   assert.equal(md.alternates.canonical,`/guides/${g.slug}`);assert.ok(g.title.length>0&&g.title!==md.title,'H1 keeps the long title');}
  const church=R('lib/seo/church-content.ts'),chR=R('app/insurance/church/[geo]/page.tsx');
  assert.match(church.CHURCH_CONTENT.title,/\$445\/yr/);
  for(const st of church.CHURCH_STATES){const md=await chR.generateMetadata({params:Promise.resolve({geo:st.slug})});
   assert.ok(md.title.startsWith(st.name)&&md.title.includes('$445/yr')&&md.title.length<=60,md.title);assert.ok(md.description.length<=155,md.description);
   const c=church.buildChurchStateContent(st);assert.match(c.faqs[0].q,/How much does church insurance cost/);assert.match(c.faqs[0].a,/\$445 a year/);assert.equal(c.costRows[0].coverage,'General liability (bound)');}
  for(const [v,g,name] of [['excavation','new-hampshire','New Hampshire'],['snow-removal','new-york','New York'],['snow-removal','pennsylvania','Pennsylvania']]){const md=await gRoute.generateMetadata({params:Promise.resolve({vertical:v,geo:g})});
   assert.ok(md.title.includes(name),`${v}/${g}: ${md.title}`);assert.doesNotMatch(md.title,/\$/,`${v}/${g} is price-free: ${md.title}`);assert.ok(md.title.length<=60,md.title);}
  const mR=mRoute;const hou=await mR.generateMetadata({params:Promise.resolve({vertical:'electrician',geo:'texas',metro:'houston'})});assert.match(hou.title,/^Electrician Insurance in Houston/,hou.title);}
 console.log(`PASS: ${seen.size} restaurant-family pages (${priced} titles priced): titles <=60 and descriptions <=155, each with its own type's approved price (bar: none), no "from $X", no New York caterer, no NY on non-NY pages; cost guide carries the four approved lines and is in the sitemap.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
