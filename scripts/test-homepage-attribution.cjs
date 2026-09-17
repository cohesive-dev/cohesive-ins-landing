const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.argv[2]||'http://localhost:3017';
const out=process.env.RECEIPT_PATH;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results=[];
 try {
  for(const [label,ref,query]of [['google','https://www.google.com/',''],['duckduckgo','https://duckduckgo.com/',''],['chatgpt','https://chatgpt.com/',''],['paid','https://www.facebook.com/','?utm_source=facebook&utm_medium=paid&ad_id=123456789012345'],['direct',null,'']]){
   const context=await browser.newContext();const page=await context.newPage();const payloads=[];
   await context.route('**/*',async route=>{
    const req=route.request(),url=new URL(req.url());
    if(url.origin===new URL(base).origin&&url.pathname==='/api/intake'){
     payloads.push(req.postDataJSON());return route.fulfill({json:{ok:true,conversion:{eligible:false}}});
    }
    if(req.method()!=='GET'||url.origin!==new URL(base).origin)return route.abort();
    return route.continue();
   });
   await page.goto(base+'/'+query,{...(ref?{referer:ref}:{}),waitUntil:'networkidle'});
   if(ref){await page.goto(base+'/',{referer:base+'/',waitUntil:'networkidle'});}
   await page.locator('input[placeholder="Jane Smith"]').first().fill('QA Intercept Only');
   await page.locator('input[type=email]').first().fill('intercept@example.invalid');
   await page.locator('form button[type=submit]').first().click();
   await page.waitForTimeout(150);
   const submitted=payloads.filter(x=>!x.partial);assert.equal(submitted.length,1);
   const details=Object.fromEntries(submitted[0].details.map(x=>[x.label,x.value]));
   assert.equal(details['Submission page'],'/');
   if(ref){assert.equal(details.Referrer,ref);assert.equal(details['Landing page'],'/');}
   else assert.equal(details.Referrer,undefined);
   if(label==='paid'){assert.equal(details['Ad id (Meta)'],'123456789012345');assert.equal(details['Traffic source'],'facebook / paid');}
   if(label==='direct')assert.equal(details['Traffic source'],undefined);
   results.push({label,pass:true,production_requests_sent:0});await context.close();
  }
 } finally {await browser.close();}
 const receipt={at:new Date().toISOString(),base,results,real_submissions:0};
 if(out)fs.writeFileSync(out,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
})().catch(e=>{console.error(e);process.exitCode=1;});
