'use client';
import {useEffect} from 'react';
import {usePathname,useSearchParams} from 'next/navigation';
import {trafficSession} from '@/lib/traffic-session';
/** No URL, search text, answers, IP, contact fields or persistent person ID sent. */
export function WebsiteTraffic(){
 const path=usePathname(),query=useSearchParams();
 useEffect(()=>{
  if(process.env.NEXT_PUBLIC_FB_FUNNEL_ENABLED!=='true'||query.get('preview')==='1')return;
  const routes:Record<string,string>={'/':'home','/contractors':'contractors','/contractor':'contractor','/contractor-test':'contractor_test','/commercial-property-quote':'commercial_property','/roofers-free-leads':'roofer_offer','/religious':'religious'};
  const ids:Record<string,string>={};for(const [key,value]of [['ad_id','adId'],['adset_id','adsetId'],['campaign_id','campaignId']]){const id=query.get(key);if(id&&/^\d{5,30}$/.test(id))ids[value]=id;}
  const event={eventId:crypto.randomUUID(),sessionId:trafficSession(),cellId:`site__${routes[path]||'other'}__page__v1`,version:'2026-09-12-v1',event:'page_view',elapsedMs:0,...ids};
  // One event per mounted navigation; StrictMode cleanup cancels the initial dev effect.
  const timer=setTimeout(()=>{void fetch('https://crm.cohesiveinsure.com/api/webhooks/fb-funnel',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({events:[event]}),keepalive:true}).catch(()=>{});},0);
  return()=>clearTimeout(timer);
 },[path,query]);
 return null;
}
