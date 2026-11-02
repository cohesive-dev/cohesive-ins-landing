'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {filterTrades,type TradeOption} from '@/lib/trade-search';
const classes='w-full rounded-lg border border-[#D8DEF5] bg-white px-4 py-3 text-base text-[#131517] outline-none transition focus:border-[#2040E7] focus:ring-2 focus:ring-[#2040E7]/20';
export default function TradeSearch({value,onChange,onRawChange,options,placeholder='Select one',ariaLabel='Primary trade'}:{value?:string;onChange:(v:string)=>void;onRawChange:(v:string)=>void;options:TradeOption[];placeholder?:string;ariaLabel?:string}){
 const [open,setOpen]=useState(false),[query,setQuery]=useState(''),[active,setActive]=useState(-1);
 const root=useRef<HTMLDivElement>(null),input=useRef<HTMLInputElement>(null),id=useId();
 const filtered=filterTrades(options,query);
 useEffect(()=>{const close=(e:PointerEvent)=>{if(e.target instanceof Node&&!root.current?.contains(e.target))setOpen(false);};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[]);
 useEffect(()=>{if(active>=0)document.getElementById(`${id}-${active}`)?.scrollIntoView({block:'nearest'});},[active,id]);
 const choose=(v:string)=>{onChange(v);setOpen(false);setQuery('');setActive(-1);input.current?.focus();};
 return <div ref={root}>
  <input ref={input} role="combobox" aria-label={ariaLabel} aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-list`} aria-activedescendant={open&&active>=0?`${id}-${active}`:undefined} autoComplete="off" className={classes} placeholder={placeholder} value={open?query:options.find(o=>o.value===value)?.label||''}
   onFocus={()=>{setOpen(true);setQuery('');setActive(-1);}}
   onChange={e=>{setQuery(e.target.value);setOpen(true);setActive(-1);if(e.target.value)onRawChange(e.target.value);onChange('');}}
   onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);setActive(i=>e.key==='ArrowDown'?Math.min(i+1,filtered.length-1):Math.max(i-1,0));}else if(e.key==='Enter'&&open){e.preventDefault();if(active>=0&&filtered[active])choose(filtered[active].value);}else if(e.key==='Escape'){e.preventDefault();setOpen(false);}else if(e.key==='Tab')setOpen(false);}}/>
  {open&&<ul id={`${id}-list`} role="listbox" aria-label={`${ariaLabel} suggestions`} className="mt-1 max-h-44 overflow-y-auto rounded-lg border border-[#D8DEF5] bg-white p-1 shadow-sm">
   {filtered.map((o,i)=><li key={o.value} id={`${id}-${i}`} role="option" aria-selected={o.value===value} className={i===active?'bg-[#EEF1FF]':''}><button type="button" tabIndex={-1} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(o.value)} className="min-h-[44px] w-full rounded px-3 py-2 text-left text-base text-[#131517] hover:bg-slate-50">{o.label}</button></li>)}
  </ul>}
 </div>;
}
