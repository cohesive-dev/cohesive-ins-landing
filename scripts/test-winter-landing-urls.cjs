// Every winter 2026 per-industry Meta ad URL (Kevin 11/19) opens the right form on a phone and tags its lead.
// Contractor URLs: no generic fallback, contact form above the fold, saved contact carries industry/angle/variant/ad id.
// Property URLs: form renders, church ads pre-select "Religious institution", partial capture carries the ad tags.
// All /api/intake traffic is intercepted or stubbed; nothing real is sent.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');

const base = process.argv[2] || 'http://localhost:3021';
const urls = JSON.parse(fs.readFileSync('scripts/winter-ad-urls-20261119.json', 'utf8'));
const phone = { viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true };
const AD_ID = '120299999999990660';
const tags = `ad_id=${AD_ID}&utm_source=facebook&utm_medium=paid&utm_content=winter_qa`;
const details = p => Object.fromEntries((p.details || []).map(d => [d.label, d.value]));
const withTags = u => u + (u.includes('?') ? '&' : '?') + tags;

async function context(browser) {
  const ctx = await browser.newContext(phone);
  await ctx.addInitScript(() => {
    localStorage.setItem('cohesive_contractor_short_first_ab_v1', 'short');
    localStorage.setItem('cohesive_contractor_hero_ab_v1', 'trust');
    window.__beacons = [];
    navigator.sendBeacon = (_url, blob) => { blob.text().then(t => window.__beacons.push(JSON.parse(t))); return true; };
  });
  const intake = [];
  await ctx.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === base && url.pathname === '/api/intake') {
      intake.push(request.postDataJSON());
      return route.fulfill({ status: 200, json: { ok: true, crm: 'skipped', notification: 'sent', conversion: { eligible: false } } });
    }
    if (url.origin !== base) return route.abort();
    return route.continue();
  });
  return { ctx, intake };
}

async function contractor(browser, path) {
  const q = new URL(base + path).searchParams;
  const industry = q.get('industry'), angle = q.get('angle'), variant = q.get('creative_variant');
  const { ctx, intake } = await context(browser);
  const page = await ctx.newPage();
  const res = await page.goto(base + withTags(path), { waitUntil: 'networkidle', timeout: 120000 });
  assert.equal(res.status(), 200, path);
  const save = page.getByRole('button', { name: 'Save my details and continue', exact: true });
  await save.waitFor();
  const email = page.getByLabel('Email', { exact: true });
  const box = await email.boundingBox();
  assert.ok(box && box.y + box.height <= 664, `${path}: email above the fold on a 390x664 phone (bottom ${box && box.y + box.height})`);
  await email.fill('qa-winter@example.invalid');
  await page.getByLabel('Phone', { exact: true }).fill('2025550123');
  await page.getByLabel('Your full name', { exact: true }).fill('QA Winter Test');
  const combo = page.getByRole('combobox', { name: "What's your primary trade?" });
  if (await combo.count()) {
    await combo.fill('General');
    await page.getByRole('option', { name: 'General contractor' }).getByRole('button').click();
  }
  await save.click();
  await page.getByText(/Step 2 of 2/).waitFor();
  const saved = intake.find(p => p.partial);
  assert.ok(saved, `${path}: contact saved on page 1`);
  const d = details(saved);
  assert.equal(d['Landing fallback reason'], undefined, `${path}: no generic fallback`);
  assert.equal(d['Experiment cell'], `${industry}__${angle}__step__v1`, path);
  assert.equal(d['Ad URL industry key'], industry, path);
  assert.equal(d['Ad URL angle'], angle, path);
  assert.equal(d['Ad URL creative variant'], variant, path);
  assert.equal(d['Current ad_id'], AD_ID, path);
  assert.ok(d['Advertised industry (not confirmed trade)'] && d['Advertised industry (not confirmed trade)'] !== 'Contractor', path);
  await ctx.close();
  return `${industry}/${angle}`;
}

async function property(browser, path) {
  const q = new URL(base + path).searchParams;
  const industry = q.get('industry'), steps = path.startsWith('/commercial-property-quote');
  const { ctx } = await context(browser);
  const page = await ctx.newPage();
  const res = await page.goto(base + withTags(path), { waitUntil: 'networkidle', timeout: 120000 });
  assert.equal(res.status(), 200, path);
  await page.getByRole('heading', { name: 'Commercial property insurance for your building' }).waitFor();
  const own = page.getByRole('button', { name: 'Yes, I own it' });
  // Step form opens on the ownership question; the long form opens on contact info.
  const first = steps ? own : page.getByLabel('Full name', { exact: true });
  const box = await first.boundingBox();
  assert.ok(box && box.y + box.height <= 664, `${path}: first question above the fold (bottom ${box && box.y + box.height})`);
  await own.click();
  if (steps) await page.getByRole('button', { name: 'Next', exact: true }).click();
  const type = page.getByLabel('What kind of property is it?');
  await type.waitFor();
  assert.equal(await type.inputValue(), industry === 'church' ? 'Religious institution' : '', `${path}: property type preset`);
  if (!steps) {
    await page.getByLabel('Email', { exact: true }).fill('qa-winter@example.invalid');
    await page.getByLabel('Phone', { exact: true }).fill('2025550123');
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForFunction(() => window.__beacons.length > 0);
    const d = details((await page.evaluate(() => window.__beacons))[0]);
    assert.equal(d['Ad id (Meta)'], AD_ID, path);
    if (industry) {
      assert.equal(d['Ad URL industry key'], industry, path);
      assert.equal(d['Ad URL angle'], q.get('angle'), path);
      assert.equal(d['Ad URL creative variant'], q.get('creative_variant'), path);
    } else assert.equal(d['Ad URL industry key'], undefined, path);
  }
  await ctx.close();
  return path.split('?')[0] + (industry ? `/${industry}/${q.get('angle')}` : '');
}

(async () => {
  assert.ok(urls.length >= 30, 'winter URL list loaded');
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const done = [];
  try {
    for (const path of urls) done.push(path.startsWith('/contractor-test') ? await contractor(browser, path) : await property(browser, path));
    // Church step-form URLs collect contact last, so check their tags through the long form on the same params.
    for (const path of urls.filter(u => u.startsWith('/commercial-property-quote?')))
      done.push(await property(browser, path.replace('/commercial-property-quote', '/commercial-property')));
  } finally { await browser.close(); }
  console.log(`PASS: ${done.length} winter ad URLs on a 390x664 phone: ${done.join(', ')}`);
})().catch(e => { console.error(e); process.exitCode = 1; });
