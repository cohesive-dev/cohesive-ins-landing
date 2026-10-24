// Server HTML of the Spanish pages (2026-10-24), run in CI against the built site (`next start`): <html lang="es">
// is in the server response (not set client-side), the contractor form renders on the server (no client-only
// bailout / "Cargando el formulario" placeholder), and the English pages keep <html lang="en">.
// Usage: node scripts/test-es-server-html.mjs http://localhost:3021
import assert from 'node:assert/strict';
const base=(process.argv[2]||'').replace(/\/$/,'');
if(!/^http:\/\/localhost:\d+$/.test(base))throw new Error('usage: node scripts/test-es-server-html.mjs http://localhost:<port>');
const get=async p=>{const r=await fetch(base+p,{redirect:'manual'});assert.equal(r.status,200,`${p} HTTP ${r.status}`);return (await r.text()).replace(/<!-- -->/g,'');};
const CONTRACTOR=['/es/seguro/techadores','/es/seguro/contratistas','/es/seguro/contratistas-generales','/es/seguro/remodelacion'];
for(const p of [...CONTRACTOR,'/es/seguro/restaurantes-mexicanos']){
 const html=await get(p);
 assert.match(html,/<html[^>]*\slang="es"/,`${p}: server <html lang="es">`);
 assert.ok(html.includes(`rel="canonical" href="https://www.cohesiveinsure.com${p}"`),`${p}: absolute self-canonical`);
 assert.match(html,/<form[\s>]/,`${p}: form in the server HTML`);
 assert.doesNotMatch(html,/Cargando el formulario/,`${p}: no client-only form placeholder`);
 // The form renders in place (not in a deferred <div hidden id="S:n"> swapped in by script), so crawlers that do not
 // run JavaScript read it in document order. (The root layout's analytics islands keep their own empty boundaries.)
 const main=html.slice(0,html.indexOf('</footer>'));
 assert.match(main,/<form[\s>]/,`${p}: form in place, before the footer`);
 assert.doesNotMatch(main,/BAILOUT_TO_CLIENT_SIDE_RENDERING/,`${p}: no client-side rendering bailout in the page body`);
}
for(const p of CONTRACTOR){const html=await get(p);assert.match(html,/Paso 1 de \d+/,`${p}: first form step rendered`);}
for(const p of ['/','/insurance/roofer','/insurance/roofer/texas']){const html=await get(p);assert.match(html,/<html[^>]*\slang="en"/,`${p}: English pages stay lang="en"`);}
for(const p of CONTRACTOR){const r=await fetch(base+p);assert.equal(r.headers.get('content-language'),'es-US',`${p}: Content-Language header`);}
console.log('PASS: the 5 Spanish pages serve <html lang="es">, Content-Language es-US and the form in place in the server HTML (no client bailout); English pages stay lang="en".');
