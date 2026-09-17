const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const base=process.argv[2]||'http://localhost:3019';const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});const context=await browser.newContext();const page=await context.newPage();let submissions=0;
 await context.addInitScript(()=>localStorage.setItem('cohesive_experiment_roof_coi_v1','long'));
 await context.route('**/*',async route=>{const r=route.request(),u=new URL(r.url());if(u.origin===base&&u.pathname==='/api/intake'){submissions++;return route.fulfill({status:422,json:{ok:false,error:'Please check your name, business, email and phone. If you need help, call (929) 594-5450.'}});}if(r.method()!=='GET'||u.origin!==base)return route.abort();return route.continue();});
 try{
  await page.goto(base+'/contractor-test?industry=roof&angle=coi',{waitUntil:'networkidle'});
  for(const [id,value]of [['email','intercept@example.invalid'],['phone','2021234567'],['fullName','QA Intercept'],['legalName','QA Test LLC']])await page.locator('#'+id).fill(value);
  for(const id of ['revenue','payroll','subcontractorCosts','currentGl'])await page.locator('#'+id+' button').first().click();
  await page.locator('button[type=submit]').click();assert.equal(submissions,0);assert.ok(await page.getByText('Please enter a valid phone number.').isVisible());
  await page.locator('#phone').fill('2025550123');await page.locator('button[type=submit]').click();await page.getByText('Please check your name, business, email and phone. If you need help, call (929) 594-5450.').waitFor();assert.equal(submissions,1);assert.equal(await page.getByText('Thanks - we received your request.').count(),0);
  const result={at:new Date().toISOString(),base,invalid_phone_stopped_before_submit:true,server_guidance_displayed:true,false_success:false,real_submissions:0};if(process.env.RECEIPT_PATH)fs.writeFileSync(process.env.RECEIPT_PATH,JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
