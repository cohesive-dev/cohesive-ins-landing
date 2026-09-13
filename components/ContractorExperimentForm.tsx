'use client';
import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {INDUSTRIES,QUESTION_OPTIONS,LABELS,fieldsFor,validField,normalizeAnswers,experimentValid,validExperiment,type Answers} from '@/lib/contractor-experiment';
import {captureAttribution,attributionDetails} from '@/lib/attribution';
import {attachFunnelTracker} from '@/lib/funnel-tracker';

export default function ContractorExperimentForm(){
 const query=useSearchParams(),industry=query.get('industry')||'',angle=query.get('angle')||'';
 const [layout,setLayout]=useState<'step'|'long'|null>(null),[answers,setAnswers]=useState<Answers>({});
 const [step,setStep]=useState(0),[status,setStatus]=useState('idle'),[error,setError]=useState('');
 const form=useRef<HTMLFormElement>(null),tracker=useRef<ReturnType<typeof attachFunnelTracker>|null>(null);
 const submission=useRef<string>('');
 const sentPartial=useRef(false);
 const honeypot=useRef<HTMLInputElement>(null);
 useEffect(()=>{
   if(!layout||!validExperiment(industry,angle)||query.get('preview')==='1')return;
   const capture=()=>{
    if(sentPartial.current||status==='sending'||status==='done')return;
    const email=validField('email',answers.email)?answers.email:undefined;
    const phone=validField('phone',answers.phone)?answers.phone:undefined;
    if(!email&&!phone)return;
    submission.current ||=crypto.randomUUID();
    const details=[{label:'Experiment cell',value:`${industry}__${angle}__${layout}__v1`},
      {label:'Submission id',value:submission.current},{label:'Session id',value:tracker.current?.sessionId||'unavailable'},
      {label:'Advertised industry (not confirmed trade)',value:INDUSTRIES[industry]},
      ...Object.entries(answers).filter(([k])=>!['email','phone','fullName'].includes(k)).map(([k,value])=>({label:LABELS[k],value})),
      ...attributionDetails(captureAttribution())];
    const body=JSON.stringify({name:answers.fullName,email,phone,company:answers.legalName,businessType:'Contractor enquiry - work unconfirmed',source:'contractors-landing',partial:true,final:true,details});
    sentPartial.current=navigator.sendBeacon('/api/intake',new Blob([body],{type:'application/json'}));
   };
   const hidden=()=>{if(document.visibilityState==='hidden')capture();};
   const timer=setTimeout(capture,120000);
   window.addEventListener('pagehide',capture);document.addEventListener('visibilitychange',hidden);
   return()=>{clearTimeout(timer);window.removeEventListener('pagehide',capture);document.removeEventListener('visibilitychange',hidden);};
 },[answers,status,layout,industry,angle,query]);
 useEffect(()=>{
   if(!validExperiment(industry,angle))return;
   const key=`cohesive_experiment_${industry}_${angle}_v1`;
   let chosen:'step'|'long'=crypto.getRandomValues(new Uint32Array(1))[0]<2147483648?'step':'long';
   try{const stored=localStorage.getItem(key);if(stored==='step'||stored==='long')chosen=stored;else localStorage.setItem(key,chosen);}catch{/* stable for this mount only */}
   // Preview controls never enter production experiment assignment or lead submission.
   if(query.get('preview')==='1'&&(query.get('layout')==='step'||query.get('layout')==='long'))chosen=query.get('layout') as 'step'|'long';
   setLayout(chosen);
 },[industry,angle,query]);
 useEffect(()=>{
   if(!layout||!form.current||!validExperiment(industry,angle)||query.get('preview')==='1')return;
   const ids:Record<string,string>={};
   for(const [q,k]of [['ad_id','adId'],['adset_id','adsetId'],['campaign_id','campaignId']]){const v=query.get(q);if(v&&/^\d{5,30}$/.test(v))ids[k]=v;}
   tracker.current=attachFunnelTracker(form.current,{cellId:`${industry}__${angle}__${layout}__v1`,...ids});
   return()=>{tracker.current?.dispose();tracker.current=null;};
 },[layout,industry,angle,query]);
 if(!validExperiment(industry,angle))return <main className="p-8">This test link is not valid. <a href="/contractors">Get a contractor insurance quote.</a></main>;
 if(!layout)return <main className="p-8">Loading your quote request…</main>;
 const fields=fieldsFor(answers,layout),shown=layout==='step'?[fields[Math.min(step,fields.length-1)]]:fields;
 const offer=angle==='free_gen',label=INDUSTRIES[industry],preview=query.get('preview')==='1';
 function update(k:string,v:string){setError('');if(k in QUESTION_OPTIONS&&answers[k]!==v)tracker.current?.emit('field_complete',k);setAnswers(a=>normalizeAnswers({...a,[k]:v}));}
 function showFieldError(k:string){
   setError(k in QUESTION_OPTIONS?'Please select an option to continue.':`Please enter a valid ${LABELS[k].toLowerCase()}.`);
   tracker.current?.emit('field_error',k);
   const control=document.getElementById(k);
   control?.scrollIntoView({block:'center',behavior:'smooth'});
   if(control?.getAttribute('role')==='group')control.querySelector('button')?.focus();else control?.focus();
 }
 async function submit(e:React.FormEvent){
   e.preventDefault();
   if(layout==='step'&&step<fields.length-1){if(validField(fields[step],answers[fields[step]])){setError('');setStep(step+1);}else showFieldError(fields[step]);return;}
   if(!experimentValid(answers)){showFieldError(fields.find(k=>!validField(k,answers[k]))!);return;}
   if(preview){setStatus('done');return;}
   if(status==='sending')return;
   setStatus('sending');setError('');
   submission.current ||=crypto.randomUUID();
   const details=[
    {label:'Experiment cell',value:`${industry}__${angle}__${layout}__v1`},
    {label:'Form version',value:'2026-09-12-v1'},
    {label:'Session id',value:tracker.current?.sessionId||'unavailable'},
    {label:'Submission id',value:submission.current},
    {label:'Advertised industry (not confirmed trade)',value:label},
    {label:'Marketing offer',value:offer?'free lead gen - outreach after insurance bind':'insurance quote'},
    {label:'Actual work and business state',value:'Confirm during follow-up before quoting'},
    ...Object.entries(answers).filter(([k])=>!['email','phone','fullName'].includes(k)).map(([k,v])=>({label:LABELS[k],value:v})),
    ...attributionDetails(captureAttribution()),
    ...['ad_id','adset_id','campaign_id'].filter(k=>/^\d{5,30}$/.test(query.get(k)||'')).map(k=>({label:`Current ${k}`,value:query.get(k)!})),
   ];
   try{
    const res=await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:answers.fullName,email:answers.email,phone:answers.phone,company:answers.legalName,businessType:`Contractor enquiry - advertised ${label}; actual work unconfirmed`,source:'contractors-landing',details,eventId:submission.current,website:honeypot.current?.value||''})});
    if(!res.ok)throw new Error('Unable to save your request. Please try again.');
    const result=await res.json();if(result.ok!==true)throw new Error('Unable to confirm your request. Please try again.');
    tracker.current?.emit('intake_accepted',undefined,submission.current);void tracker.current?.flush();
    if(result.conversion?.eligible===true&&typeof result.conversion.eventId==='string')
     (window as unknown as {fbq?:(...args:unknown[])=>void}).fbq?.('track','Lead',{}, {eventID:result.conversion.eventId});
    setStatus('done');
   }catch(err){tracker.current?.emit('submit_error');setStatus('error');setError(err instanceof Error?err.message:'Please try again.');}
 }
 if(status==='done')return <main className="max-w-xl mx-auto p-8"><h1 className="text-3xl font-bold">{preview?'Preview complete. Nothing sent.':'Thanks - we received your request.'}</h1><p>We’ll contact you about your business insurance{offer?' and the free lead gen offer':''}.</p></main>;
 return <main className="mx-auto max-w-2xl p-6 text-slate-900"><p>Cohesive Insurance Services</p><h1 className="my-6 text-3xl font-bold">{offer?`${label}: free lead gen. Up to 6 leads.`:`Get a ${label.toLowerCase()} insurance quote.`}</h1>
 {offer&&<p className="mb-6">Bind your business insurance with us and we’ll run an email outreach campaign to property and facility managers in your service area at no extra charge.</p>}
 {offer&&<figure className="mb-6"><img src={`/contractor-proof/${industry}-reply.png`} alt={`Actual ${label.toLowerCase()} outreach reply excerpt`} className="w-full rounded-lg border"/><figcaption className="text-xs mt-2 text-slate-600">Actual outreach reply - excerpt. An interested reply is not a booked job.</figcaption></figure>}
 {preview&&<p role="status">Preview only - no lead will be sent.</p>}
 <p className="text-sm mb-4">Contact details you enter may be saved before submission to help recover an unfinished quote request. <a href="/privacy" className="underline">Privacy policy</a></p>
 <form ref={form} onSubmit={submit} data-funnel-final={layout==='long'||step===fields.length-1?'true':'false'} className="space-y-6">
 <div aria-hidden="true" style={{position:'absolute',left:'-10000px'}}><label>Leave this field empty<input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" /></label></div>
 {layout==='step'&&<div><p>Question {step+1} of {fields.length}</p><div className="mt-2 h-1.5 rounded-full bg-[#EEF1FF]" role="progressbar" aria-label="Form progress" aria-valuemin={0} aria-valuemax={fields.length} aria-valuenow={step+1}><div className="h-full rounded-full bg-[#2040E7] transition-all" style={{width:`${((step+1)/fields.length)*100}%`}}/></div></div>}
 {shown.map(k=><div key={k} data-funnel-field={k}><label htmlFor={k} className="block font-semibold mb-2">{LABELS[k]} *</label>
 {k==='payroll'&&<p>Select $0 if you have no W2 payroll. Do not include subcontractor payments.</p>}
 {k in QUESTION_OPTIONS?<div id={k} role="group" aria-label={LABELS[k]} className="flex flex-wrap gap-2">{QUESTION_OPTIONS[k as keyof typeof QUESTION_OPTIONS].map(v=><button type="button" key={v} aria-pressed={answers[k]===v} onClick={()=>update(k,v)} className={'min-h-[48px] touch-manipulation rounded-lg border px-4 py-3 text-[15px] font-medium transition '+(answers[k]===v?'border-[#2040E7] bg-[#EEF1FF] text-[#1A33B9]':'border-[#D8DEF5] bg-white text-[#131517] hover:border-[#2040E7]')}>{v}</button>)}</div>:
 <input id={k} name={k} required maxLength={200} type={k==='email'?'email':k==='phone'?'tel':'text'} autoComplete={k==='fullName'?'name':k==='email'?'email':k==='phone'?'tel':'organization'} value={answers[k]||''} onChange={e=>update(k,e.target.value)} className="border rounded-lg p-4 w-full"/>}</div>)}
 {error&&<p role="alert">{error}</p>}
 {(layout==='long'||step===fields.length-1)&&<p className="text-sm">By submitting, you request contact about your business insurance quote. {offer?'The free lead gen offer is included when you bind your business insurance with us. ':''}<a href="/privacy" className="underline">Privacy policy</a></p>}
 <div className="flex gap-4">{layout==='step'&&step>0&&<button type="button" onClick={()=>setStep(step-1)} className="border rounded p-4">Back</button>}<button disabled={status==='sending'} className="bg-blue-700 text-white rounded p-4" type="submit">{status==='sending'?'Sending…':layout==='step'&&step<fields.length-1?'Next':'Get my insurance quote'}</button></div>
 </form></main>;
}
