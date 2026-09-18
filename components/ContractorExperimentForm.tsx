'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {INDUSTRIES,QUESTION_OPTIONS,LABELS,fieldsFor,validField,normalizeAnswers,validExperiment,contractorScreens,contractorFields,validContractorField,type Answers} from '@/lib/contractor-experiment';
import {captureAttribution,attributionDetails} from '@/lib/attribution';
import {attachFunnelTracker} from '@/lib/funnel-tracker';
import {coldEmailContext,isColdIndustry,type ColdLayout} from '@/lib/cold-email-landing';
import ContractorQuestionSet from '@/components/ContractorQuestionSet';
import ContractorPageHero,{contractorMainClass,contractorFormClass,contractorButtonClass} from '@/components/ContractorPageTheme';
import {FULL_LABELS,fullScreens,validFullField,normalizeFull} from '@/lib/contractor-full-form';
import {TRADES} from '@/lib/contractor-trades';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import PartialCaptureDisclosure from '@/components/PartialCaptureDisclosure';
import {contractorFallbackReason} from '@/lib/contractor-landing-params';

export default function ContractorExperimentForm({coldLayout}:{coldLayout?:ColdLayout}={}){
 const query=useSearchParams();
 const cold=useMemo(()=>coldLayout?coldEmailContext(query,coldLayout):null,[query,coldLayout]);
 const needsTrade=!coldLayout&&!isColdIndustry(query.get('industry')||'');
 const fallbackReason=coldLayout?null:contractorFallbackReason(query);
 const industry=cold?.industry||(fallbackReason?'contractor':query.get('industry')||'');
 const angle=coldLayout?'coi':fallbackReason?(fallbackReason.startsWith('missing_')?'missing_params':'invalid_params'):query.get('angle')||'';
 const valid=!!fallbackReason||(isColdIndustry(industry)&&validExperiment(industry,angle));
 const industryLabel=INDUSTRIES[industry as keyof typeof INDUSTRIES]||'Contractor';
 const [assignedLayout,setLayout]=useState<'step'|'long'|null>(null),[answers,setAnswers]=useState<Answers>({});
 const layout=coldLayout||assignedLayout;
 const [step,setStep]=useState(0),[status,setStatus]=useState('idle'),[error,setError]=useState('');
 const form=useRef<HTMLFormElement>(null),tracker=useRef<ReturnType<typeof attachFunnelTracker>|null>(null);
 const submission=useRef<string>('');
 const sentPartial=useRef(false),partialInFlight=useRef(false);
 const capturePartial=useRef<()=>Promise<void>>(async()=>{});
 const honeypot=useRef<HTMLInputElement>(null);
 const cellId=cold?.cellId||`${industry}__${angle}__${layout}__v1`;
 const formVersion=coldLayout?'2026-09-12-v1':'2026-09-18-theme-v4';
 const labels=coldLayout?LABELS:FULL_LABELS;
 const sourceDetails=useMemo(()=>cold?[{label:'Acquisition channel',value:'Cold email landing'},
   {label:'Cold email campaign',value:cold.campaign},{label:'Landing layout',value:coldLayout!}]:fallbackReason?[
     {label:'Landing fallback reason',value:fallbackReason},
     {label:'Landing form mode',value:'Generic contractor fallback; trade not inferred'},
   ]:[],[cold,coldLayout,fallbackReason]);
 useEffect(()=>{
   if(!layout||!valid||query.get('preview')==='1')return;
   const capture=async()=>{
    if(sentPartial.current||partialInFlight.current||status==='sending'||status==='done')return;
    const email=validField('email',answers.email)?answers.email:undefined;
    const phone=validField('phone',answers.phone)?answers.phone:undefined;
    if(!email&&!phone)return;
    submission.current ||=crypto.randomUUID();
    const details=[{label:'Experiment cell',value:cellId},{label:'Form version',value:formVersion},
      {label:'Submission id',value:submission.current},{label:'Session id',value:tracker.current?.sessionId||'unavailable'},
      {label:'Advertised industry (not confirmed trade)',value:industryLabel},...sourceDetails,
      ...Object.entries(answers).filter(([k])=>!['email','phone','fullName'].includes(k)).map(([k,value])=>({label:labels[k],value})),
      ...attributionDetails(captureAttribution())];
    const body=JSON.stringify({name:answers.fullName,email,phone,company:answers.legalName,businessType:'Contractor enquiry - work unconfirmed',source:'contractors-landing',partial:true,final:true,details,website:honeypot.current?.value||''});
    if(coldLayout){sentPartial.current=navigator.sendBeacon('/api/intake',new Blob([body],{type:'application/json'}));return;}
    partialInFlight.current=true;
    try{const res=await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true});
      const result=await res.json();if(res.ok&&result.ok===true&&result.notification==='sent'){sentPartial.current=true;tracker.current?.emit('contact_saved',undefined,submission.current);void tracker.current?.flush();}
    }catch{/* retain leave/idle retry; never block completion */}finally{partialInFlight.current=false;}
   };
   capturePartial.current=capture;
   const hidden=()=>{if(document.visibilityState==='hidden')capture();};
   const timer=setTimeout(capture,120000);
   window.addEventListener('pagehide',capture);document.addEventListener('visibilitychange',hidden);
   return()=>{clearTimeout(timer);window.removeEventListener('pagehide',capture);document.removeEventListener('visibilitychange',hidden);};
 },[answers,status,layout,industry,industryLabel,query,cellId,valid,sourceDetails,formVersion,coldLayout,labels]);
 useEffect(()=>{
   if(coldLayout||layout!=='long'||query.get('preview')==='1'||!['email','phone','fullName'].every(k=>validField(k,answers[k])))return;
   const timer=setTimeout(()=>void capturePartial.current(),400);return()=>clearTimeout(timer);
 },[answers,coldLayout,layout,query]);
 useEffect(()=>{
   if(!valid)return;
   if(coldLayout)return;
   const key=`cohesive_experiment_${industry}_${angle}_v1`;
   let chosen:'step'|'long'=crypto.getRandomValues(new Uint32Array(1))[0]<2147483648?'step':'long';
   try{const stored=localStorage.getItem(key);if(stored==='step'||stored==='long')chosen=stored;else localStorage.setItem(key,chosen);}catch{/* stable for this mount only */}
   // Preview controls never enter production experiment assignment or lead submission.
   if(query.get('preview')==='1'&&(query.get('layout')==='step'||query.get('layout')==='long'))chosen=query.get('layout') as 'step'|'long';
   const timer=setTimeout(()=>setLayout(chosen),0);
   return()=>clearTimeout(timer);
 },[industry,angle,query,coldLayout,valid]);
 useEffect(()=>{
   if(!layout||!form.current||!valid||query.get('preview')==='1')return;
   const ids:Record<string,string>={};
   if(!coldLayout)for(const [q,k]of [['ad_id','adId'],['adset_id','adsetId'],['campaign_id','campaignId']]){const v=query.get(q);if(v&&/^\d{5,30}$/.test(v))ids[k]=v;}
   tracker.current=attachFunnelTracker(form.current,{cellId,version:formVersion,...ids});
   if(coldLayout){tracker.current.emit('page_view');void tracker.current.flush();}
   return()=>{tracker.current?.dispose();tracker.current=null;};
 },[layout,query,cellId,coldLayout,valid,formVersion]);
 if(!valid&&coldLayout)return <main className="max-w-xl mx-auto p-8"><h1 className="text-3xl font-bold">Get a contractor insurance quote</h1><p className="my-4">What type of work do you do?</p><ul className="space-y-3">{Object.entries(INDUSTRIES).map(([id,name])=><li key={id}><a className="underline" href={`?${new URLSearchParams({...Object.fromEntries(query),industry:id})}`}>{name}</a></li>)}</ul><a className="mt-6 inline-block underline" href="/contractors">Another trade</a></main>;
 if(!layout)return <main className="p-8">Loading your quote request…</main>;
 const screens=coldLayout?fieldsFor(answers,layout).map(k=>[k]):fullScreens(answers),lastStep=screens.length-1;
 const fields=screens.flat(),shown=layout==='step'?screens[Math.min(step,lastStep)]:fields;
 const fieldValid=coldLayout?validField:validFullField;
 const offer=angle==='free_gen',label=industryLabel,preview=query.get('preview')==='1';
 function update(k:string,v:string){setError('');if(answers[k]!==v&&fieldValid(k,v)&&v)tracker.current?.emit('field_complete',k);setAnswers(a=>coldLayout?normalizeAnswers({...a,[k]:v}):normalizeFull(a,k,v));}
 function showFieldError(k:string){
   setError(k in QUESTION_OPTIONS?'Please select an option to continue.':`Please enter a valid ${labels[k].toLowerCase()}.`);
   tracker.current?.emit('field_error',k);
   const control=document.getElementById(k)||form.current?.querySelector<HTMLElement>(`[data-funnel-field="${k}"] input, [data-funnel-field="${k}"] select, [data-funnel-field="${k}"] summary`);
   control?.scrollIntoView({block:'center',behavior:'smooth'});
   if(control?.getAttribute('role')==='group')control.querySelector('button')?.focus();else control?.focus();
 }
 async function submit(e:React.FormEvent){
   e.preventDefault();
   if(layout==='step'&&step<lastStep){const invalid=shown.find(k=>!fieldValid(k,answers[k]));if(invalid){showFieldError(invalid);return;}
    if(!coldLayout&&step===0&&!preview)void capturePartial.current();setError('');setStep(step+1);return;}
   const invalid=fields.find(k=>!fieldValid(k,answers[k]));if(invalid){showFieldError(invalid);return;}
   if(preview){setStatus('done');return;}
   if(status==='sending')return;
   setStatus('sending');setError('');
   submission.current ||=crypto.randomUUID();
   const details=[
    {label:'Experiment cell',value:cellId},
    {label:'Form version',value:formVersion},
    {label:'Session id',value:tracker.current?.sessionId||'unavailable'},
    {label:'Submission id',value:submission.current},
    {label:'Advertised industry (not confirmed trade)',value:label},...sourceDetails,
    {label:'Marketing offer',value:offer?'free lead gen - outreach after insurance bind':'insurance quote'},
    {label:'Actual work and business state',value:'Confirm during follow-up before quoting'},
    ...Object.entries(answers).filter(([k])=>!['email','phone','fullName'].includes(k)).map(([k,v])=>({label:labels[k],value:v})),
    ...attributionDetails(captureAttribution()),
    ...['ad_id','adset_id','campaign_id'].filter(k=>/^\d{5,30}$/.test(query.get(k)||'')).map(k=>({label:`Current ${k}`,value:query.get(k)!})),
   ];
   try{
    const res=await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:answers.fullName,email:answers.email,phone:answers.phone,company:answers.legalName,businessType:`Contractor enquiry - advertised ${label}; actual work unconfirmed`,source:'contractors-landing',details,eventId:submission.current,website:honeypot.current?.value||''})});
    const result=await res.json();
    if(!res.ok||result.ok!==true)throw new Error(typeof result.error==='string' ? result.error : 'Unable to save your request. Please try again.');
    tracker.current?.emit('intake_accepted',undefined,submission.current);void tracker.current?.flush();
    if(result.conversion?.eligible===true&&typeof result.conversion.eventId==='string')
     (window as unknown as {fbq?:(...args:unknown[])=>void}).fbq?.('track','Lead',{}, {eventID:result.conversion.eventId});
    setStatus('done');
   }catch(err){tracker.current?.emit('submit_error');setStatus('error');setError(err instanceof Error?err.message:'Please try again.');}
 }
 if(status==='done')return <main className="max-w-xl mx-auto p-8"><h1 className="text-3xl font-bold">{preview?'Preview complete. Nothing sent.':'Thanks - we received your request.'}</h1><p>We’ll contact you about your business insurance{offer?' and the free lead gen offer':''}.</p></main>;
 return <main className={coldLayout?'mx-auto max-w-2xl p-6 text-slate-900':contractorMainClass}>{coldLayout?<><p>Cohesive Insurance Services</p><h1 className="my-6 text-3xl font-bold">{offer?`${label}: free lead gen. Up to 6 leads.`:`Get a ${label.toLowerCase()} insurance quote.`}</h1></>:<ContractorPageHero title={offer?`${label}: free lead gen. Up to 6 leads.`:undefined}/>}
 <div className={coldLayout?undefined:'mx-auto max-w-2xl px-5 sm:px-6'}>
 {offer&&<p className="mb-6">Bind your business insurance with us and we’ll run an email outreach campaign to property and facility managers in your service area at no extra charge.</p>}
 {offer&&<figure className="mb-6"><img src={`/contractor-proof/${industry}-reply.png`} alt={`Actual ${label.toLowerCase()} outreach reply excerpt`} className="w-full rounded-lg border"/><figcaption className="text-xs mt-2 text-slate-600">Actual outreach reply - excerpt. An interested reply is not a booked job.</figcaption></figure>}
 {preview&&<p role="status">Preview only - no lead will be sent.</p>}
 </div>
 <form ref={form} onSubmit={submit} data-funnel-final={layout==='long'||step===lastStep?'true':'false'} className={coldLayout?"space-y-6":contractorFormClass}>
 <div aria-hidden="true" style={{position:'absolute',left:'-10000px'}}><label>Leave this field empty<input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" /></label></div>
 {layout==='step'&&<div><p>Step {step+1} of {screens.length}</p><div className="mt-2 h-1.5 rounded-full bg-[#EEF1FF]" role="progressbar" aria-label="Form progress" aria-valuemin={0} aria-valuemax={screens.length} aria-valuenow={step+1}><div className="h-full rounded-full bg-[#2040E7] transition-all" style={{width:`${((step+1)/screens.length)*100}%`}}/></div></div>}
 {!coldLayout?<><ContractorQuestionSet f={answers} set={update} contactFirst visible={layout==='step'?shown:undefined}/>{shown.includes('mailingAddress')&&<div data-funnel-field="mailingAddress"><label htmlFor="mailingAddress" className="block text-sm font-medium text-[#131517] mb-1.5">Mailing address (optional)</label><AddressAutocomplete id="mailingAddress" value={answers.mailingAddress} onChange={v=>update('mailingAddress',v)} ariaLabel="Mailing address" placeholder="Street, city, state, ZIP"/></div>}</>:<>
 {shown.map(k=><div key={k} data-funnel-field={k}><label htmlFor={k} className="block font-semibold mb-2">{LABELS[k]}{k==='mailingAddress'?' (optional)':' *'}</label>
 {k==='payroll'&&<p>Select $0 if you have no W2 payroll. Do not include subcontractor payments.</p>}
 {k==='trade'?<select id={k} name={k} required value={answers[k]||''} onChange={e=>update(k,e.target.value)} className="border rounded-lg p-4 w-full"><option value="" disabled>Select your primary trade</option>{TRADES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select>:k==='mailingAddress'?<AddressAutocomplete id={k} value={answers[k]} onChange={v=>update(k,v)} ariaLabel={LABELS[k]} placeholder="Street, city, state, ZIP"/>:k in QUESTION_OPTIONS?<div id={k} role="group" aria-label={LABELS[k]} className="flex flex-wrap gap-2">{QUESTION_OPTIONS[k as keyof typeof QUESTION_OPTIONS].map(v=><button type="button" key={v} aria-pressed={answers[k]===v} onClick={()=>update(k,v)} className={'min-h-[48px] touch-manipulation rounded-lg border px-4 py-3 text-[15px] font-medium transition '+(answers[k]===v?'border-[#2040E7] bg-[#EEF1FF] text-[#1A33B9]':'border-[#D8DEF5] bg-white text-[#131517] hover:border-[#2040E7]')}>{v}</button>)}</div>:
 <input id={k} name={k} required maxLength={200} type={k==='email'?'email':k==='phone'?'tel':'text'} autoComplete={k==='fullName'?'name':k==='email'?'email':k==='phone'?'tel':'organization'} value={answers[k]||''} onChange={e=>update(k,e.target.value)} className="border rounded-lg p-4 w-full"/>}</div>)}
 </>}
 {error&&<p role="alert">{error}</p>}
 <div className="flex gap-4">{layout==='step'&&step>0&&<button type="button" onClick={()=>setStep(step-1)} className="border rounded p-4">Back</button>}<button disabled={status==='sending'} className={coldLayout?"bg-blue-700 text-white rounded p-4":contractorButtonClass} type="submit">{status==='sending'?'Sending…':layout==='step'&&step<lastStep?'Next':'Get my insurance quote'}</button></div>
 <PartialCaptureDisclosure>By submitting, you request contact about your business insurance quote. {offer?'The free lead gen offer is included when you bind your business insurance with us. ':''}</PartialCaptureDisclosure>
 </form></main>;
}
