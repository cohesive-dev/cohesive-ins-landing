import { validateFunnelEvent, type FunnelEvent } from './funnel-event';

/** Only attach to a consent-aware experiment form with data-funnel-field wrappers.
 * Never sends answers. Missing/rejected endpoint retains queued events for retry.
 * Integration and durable endpoint must pass QA before advertising this as live.
 */
export function attachFunnelTracker(form:HTMLFormElement, context:{cellId:string;adId?:string;adsetId?:string;campaignId?:string}) {
  const storageKey='cohesive_funnel_session_v1';
  let sessionId=crypto.randomUUID();
  try {
    const previous=sessionStorage.getItem(storageKey);
    if(previous&&/^[a-f0-9-]{36}$/i.test(previous))sessionId=previous as typeof sessionId;
    else sessionStorage.setItem(storageKey,sessionId);
  } catch { /* memory-only fallback; do not claim cross-reload dedup */ }
  const start=performance.now();
  const queueKey='cohesive_funnel_queue_v1';
  const queue:FunnelEvent[]=[];
  try{const saved=JSON.parse(sessionStorage.getItem(queueKey)||'[]');if(Array.isArray(saved))for(const item of saved.slice(0,250)){const event=validateFunnelEvent(item);if(event)queue.push(event);}}catch{/* memory fallback */}
  const saveQueue=()=>{try{sessionStorage.setItem(queueKey,JSON.stringify(queue));}catch{/* memory fallback */}};
  const completed=new Map<string,boolean>();
  const seen=new Set<string>();
  let inflight=false, disposed=false;
  function emit(event:FunnelEvent['event'],field?:string,submissionId?:string) {
    const item=validateFunnelEvent({...context,eventId:crypto.randomUUID(),sessionId,version:'2026-09-12-v1',event,
      elapsedMs:Math.min(86400000,Math.round(performance.now()-start)),...(field?{field}:{}),...(submissionId?{submissionId}:{})});
    if(item&&queue.length<250){queue.push(item);saveQueue();}
  }
  async function flush() {
    if(inflight||!queue.length)return;
    inflight=true;
    const batch=queue.slice(0,25);
    try {
      const result=await fetch('https://crm.cohesiveinsure.com/api/webhooks/fb-funnel',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({events:batch}),keepalive:true});
      if(result.ok&&(await result.json()).ok===true){queue.splice(0,batch.length);saveQueue();}
    } catch { /* retry bounded queue; never block form submission */ }
    finally {inflight=false;}
  }
  const fieldOf=(target:EventTarget|null)=>target instanceof Element?target.closest<HTMLElement>('[data-funnel-field]')?.dataset.funnelField:undefined;
  const focus=(event:Event)=>{const field=fieldOf(event.target);if(field)emit('field_focus',field);};
  const change=(event:Event)=>{
    const element=event.target;
    if(!(element instanceof HTMLInputElement||element instanceof HTMLSelectElement||element instanceof HTMLTextAreaElement))return;
    const field=fieldOf(element);if(!field)return;
    // validity.valid is side-effect-free; checkValidity() would fire invalid events.
    const valid=!!element.value.trim()&&element.validity.valid;
    if(valid&&!completed.get(field))emit('field_complete',field);
    if(!valid&&completed.get(field))emit('field_clear',field);
    completed.set(field,valid);
  };
  const invalid=(event:Event)=>{const field=fieldOf(event.target);if(field)emit('field_error',field);};
  const submit=()=>{if(form.dataset.funnelFinal!=='false')emit('submit_attempt');};
  const exit=()=>{emit('session_exit');void flush();};
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      const field=(entry.target as HTMLElement).dataset.funnelField;
      const key=field||'form';
      if(!seen.has(key)){seen.add(key);emit(field?'field_view':'form_view',field);}
    }
  },{threshold:0.1});
  observer.observe(form);
  form.querySelectorAll('[data-funnel-field]').forEach(e=>observer.observe(e));
  const mutation=new MutationObserver(()=>form.querySelectorAll('[data-funnel-field]').forEach(e=>observer.observe(e)));
  mutation.observe(form,{childList:true,subtree:true});
  form.addEventListener('focusin',focus);
  form.addEventListener('input',change);
  form.addEventListener('change',change);
  form.addEventListener('invalid',invalid,true);
  form.addEventListener('submit',submit);
  window.addEventListener('pagehide',exit);
  const timer=setInterval(()=>void flush(),5000);
  return {sessionId,emit,flush,dispose(){
    if(disposed)return;disposed=true;
    clearInterval(timer);observer.disconnect();mutation.disconnect();
    form.removeEventListener('focusin',focus);form.removeEventListener('input',change);form.removeEventListener('change',change);
    form.removeEventListener('invalid',invalid,true);form.removeEventListener('submit',submit);window.removeEventListener('pagehide',exit);
    void flush();
  }};
}
