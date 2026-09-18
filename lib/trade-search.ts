export type TradeOption = {label:string;value:string};
const normalize=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
// Search aliases only. Existing canonical values and market-routing questions stay unchanged.
const aliases:[RegExp,string[]][]=[
 [/janitorial|cleaning/,['cleaning','cleaner','cleaners','janitor','custodial']],
 [/hvac|heating/,['ac','a c','aircon','air conditioning','furnace','hvac']],
 [/roof/,['roofer','roofers','roofs','roofing']],
 [/painting/,['painter','painters']],
 [/plumbing/,['plumber','plumbers']],
 [/electrical/,['electric','electrician','electricians']],
 [/remodel|renovation/,['remodeler','remodeller','renovation','reno','rehab']],
 [/carpentry|framing/,['carpenter','carpentery','framer']],
 [/masonry|concrete/,['mason','brick','stucco']],
 [/tree/,['arborist','tree removal']],
 [/general contract/,['gc','builder','construction']],
 [/pool construction/,['gunite','shotcrete','pool builder','pool installation']],
 [/pool.*service|pool.*cleaning/,['pool cleaning','pool maintenance','pool service']],
];
export function filterTrades<T extends TradeOption>(options:T[],query:string):T[]{
 const q=normalize(query);if(!q)return options;
 const matches=options.filter(o=>{const label=normalize(o.label);return (q.length<=2?label.split(' ').some(w=>w.startsWith(q)):label.includes(q))||aliases.some(([re,words])=>re.test(label)&&words.some(a=>a===q||(q.length>=3&&a.startsWith(q))));});
 // Other remains an ordinary last option; no automatic selection or guessed trade.
 const other=options.find(o=>/^other(?: trade)?$/i.test(o.value));
 return other&&!matches.includes(other)?[...matches,other]:matches;
}
