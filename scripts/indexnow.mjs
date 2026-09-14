import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifestPath='/.well-known/cohesive-content-release.json';
export function prepare(config,manifest,key){
 if(config.host!=='www.cohesiveinsure.com'||!/^([a-f0-9]{32})\.txt$/.test(config.keyFile)||key.trim()+'.txt'!==config.keyFile)throw new Error('invalid_site_configuration');
 if(!manifest.release||!Array.isArray(manifest.paths)||!manifest.paths.length||manifest.paths.length>100)throw new Error('invalid_release_manifest');
 const origin='https://'+config.host;
 const urls=manifest.paths.map(p=>{if(typeof p!=='string'||!/^\/(guides|insurance)(\/[a-z0-9-]+)*$/.test(p))throw new Error('invalid_content_path');return origin+p;});
 if(new Set(urls).size!==urls.length)throw new Error('duplicate_content_path');
 return {host:config.host,key:key.trim(),keyLocation:origin+'/'+config.keyFile,urlList:urls};
}
export async function notify(config,manifest,key,request=fetch){
 const body=prepare(config,manifest,key),origin='https://'+body.host;
 const get=async(url)=>{const r=await request(url,{redirect:'error',signal:AbortSignal.timeout(20000)});if(r.status!==200)throw new Error('public_readback_http_'+r.status);return r.text();};
 if((await get(body.keyLocation)).trim()!==body.key)throw new Error('public_key_mismatch');
 let live;try{live=JSON.parse(await get(origin+manifestPath));}catch{throw new Error('public_manifest_unreadable');}
 if(JSON.stringify(live)!==JSON.stringify(manifest))throw new Error('public_release_not_current');
 for(const url of body.urlList){
  const html=await get(url);
  if(!html.includes('rel="canonical" href="'+url+'"')||/<meta[^>]*(?:noindex|none)[^>]*>/i.test(html))throw new Error('public_page_not_canonical_indexable');
 }
 const r=await request('https://api.indexnow.org/indexnow',{method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
 return {at:new Date().toISOString(),release:manifest.release,urls:body.urlList,httpStatus:r.status,submission:r.status===200?'received':r.status===202?'received_key_validation_pending':'refused',indexing:'not_proven',ok:r.status===200||r.status===202};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),submit=args.includes('--submit'),receiptAt=args.indexOf('--receipt');
 try{
  for(let i=0;i<args.length;i++){if(args[i]==='--submit')continue;if(args[i]==='--receipt'&&args[i+1]&&!args[i+1].startsWith('--')){i++;continue;}throw new Error('invalid_argument');}
  const config=JSON.parse(fs.readFileSync(path.join(root,'indexnow.config.json'),'utf8'));
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'public',manifestPath),'utf8'));
  const key=fs.readFileSync(path.join(root,'public',config.keyFile),'utf8');
  let result;if(submit)result=await notify(config,manifest,key);else result={submission:'dry_run_no_requests',release:manifest.release,urls:prepare(config,manifest,key).urlList};
  if(receiptAt>=0){const target=args[receiptAt+1];if(!target)throw new Error('missing_receipt_path');fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n');}
  console.log(JSON.stringify(result,null,2));if(result.ok===false)process.exitCode=1;
 }catch(e){console.error(JSON.stringify({submission:'failed_or_unconfirmed',reason:e instanceof Error?e.message:'unknown',indexing:'not_proven'}));process.exitCode=1;}
}
