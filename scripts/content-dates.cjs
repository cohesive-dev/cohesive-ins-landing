#!/usr/bin/env node
// Sitemap lastmod from each page's real last content change (SEO 2026-11-27).
//
// Why: lastmod used to come only from hand-set dates (CONTRACTOR_HUB_UPDATED, price asOf, ...). Copy changes on
// the roofer and tree hubs and the tree state pages (11/24-11/26) did not bump them, so the daily IndexNow job,
// which submits only URLs whose <lastmod> changed, never sent those pages.
//
// How: after `npm run build`, this script hashes the visible text (title, meta description and <main>) of every
// prerendered sitemap URL (forms, header, nav and footer excluded) and compares it with lib/seo/content-dates.json ({ path: [date | null, hash] }).
//   --check (default, CI): fails when a page's text changed and the ledger was not updated.
//   --write [--date YYYY-MM-DD]: records the new hash; a changed or new page gets the date (default today, UTC).
// lib/seo/sitemap-sections.ts uses the newest of the ledger date and the page's own dated fields. null means
// "unchanged since the ledger started, real date unknown", which keeps the page's own date.
// Workflow for any content PR: npm run build && node scripts/content-dates.cjs --write, commit the ledger.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const write = args.includes("--write");
const date = opt("--date") ?? new Date().toISOString().slice(0, 10);
const buildDir = path.resolve(root, opt("--next") ?? ".next");
const ledgerPath = path.resolve(root, opt("--ledger") ?? "lib/seo/content-dates.json");
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`bad --date ${date}`);

const appDir = path.join(buildDir, "server/app");
const sitemapDir = path.join(appDir, "sitemap");
if (!fs.existsSync(sitemapDir)) { console.error(`No built sitemaps in ${sitemapDir}; run npm run build first.`); process.exit(2); }

const paths = [...new Set(fs.readdirSync(sitemapDir).filter((f) => f.endsWith(".xml.body"))
  .flatMap((f) => [...fs.readFileSync(path.join(sitemapDir, f), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/")))].sort();

function pageText(html) {
  const pick = (re) => (html.match(re) ?? [])[1] ?? "";
  const title = pick(/<title>([\s\S]*?)<\/title>/);
  const description = pick(/<meta name="description" content="([^"]*)"/);
  const body = pick(/<main[^>]*>([\s\S]*)<\/main>/) || pick(/<body[^>]*>([\s\S]*)<\/body>/);
  const text = body
    .replace(/<!--[\s\S]*?-->/g, "")
    // Quote forms and site chrome (header, nav, footer) are not page content: a form-copy or footer-link tweak
    // must not move lastmod on thousands of pages.
    .replace(/<(script|style|noscript|template|form|header|nav|footer)[^>]*>[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `${title}\n${description}\n${text}`;
}
const htmlFile = (p) => path.join(appDir, p === "/" ? "index.html" : `${p}.html`);

const ledger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, "utf8")) : {};
const next = {};
const changed = [], added = [], missing = [];
for (const p of paths) {
  const file = htmlFile(p);
  if (!fs.existsSync(file)) { missing.push(p); continue; }
  const hash = crypto.createHash("sha256").update(pageText(fs.readFileSync(file, "utf8"))).digest("hex").slice(0, 16);
  const prev = ledger[p];
  if (!prev) { added.push(p); next[p] = [date, hash]; }
  else if (prev[1] !== hash) { changed.push(p); next[p] = [date, hash]; }
  else next[p] = prev;
}
const removed = Object.keys(ledger).filter((p) => !(p in next));

if (write) {
  const body = "{\n" + Object.keys(next).sort().map((p) => `${JSON.stringify(p)}:${JSON.stringify(next[p])}`).join(",\n") + "\n}\n";
  fs.writeFileSync(ledgerPath, body);
  console.log(JSON.stringify({ wrote: path.relative(root, ledgerPath), date, pages: Object.keys(next).length, changed: changed.length, added: added.length, removed: removed.length, notPrerendered: missing.length, changedSample: changed.slice(0, 20) }, null, 1));
} else {
  const stale = [...changed, ...added];
  if (stale.length || removed.length) {
    console.error(`FAIL: ${stale.length} sitemap page(s) changed or are new and ${removed.length} left the sitemap without a lib/seo/content-dates.json update, so their lastmod would not move and IndexNow would skip them.\nRun: npm run build && node scripts/content-dates.cjs --write, then commit lib/seo/content-dates.json.\n${[...stale, ...removed].slice(0, 30).join("\n")}`);
    process.exit(1);
  }
  console.log(`PASS: ${Object.keys(next).length} prerendered sitemap pages match their recorded content dates (${missing.length} not prerendered, kept on their own dates).`);
}
