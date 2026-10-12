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
 console.log(`PASS: ${seen.size} restaurant-family pages (${priced} titles priced): titles <=60 and descriptions <=155, each with its own type's approved price (bar: none), no "from $X", no New York caterer, no NY on non-NY pages; cost guide carries the four approved lines and is in the sitemap.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
