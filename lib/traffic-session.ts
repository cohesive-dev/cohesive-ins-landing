/** Thirty-minute browser-session estimate, not an identified person. No PII. */
let memorySession: {id:string;at:number}|undefined;
export function trafficSession():string {
 const key='cohesive_traffic_session_v2',now=Date.now();
 let id=memorySession&&now>=memorySession.at&&now-memorySession.at<1800000?memorySession.id:crypto.randomUUID();
 try {
  const old=JSON.parse(localStorage.getItem(key)||'null');
  if(old&&/^[a-f0-9-]{36}$/i.test(old.id)&&Number.isFinite(old.at)&&now-old.at<1800000&&now>=old.at)id=old.id;
  localStorage.setItem(key,JSON.stringify({id,at:now}));
 }catch{/* Storage disabled: preserve the session for this page's lifetime. */}
 memorySession={id,at:now};
 return id;
}
