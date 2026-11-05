const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs'), ts = require('typescript');
const compiled = { exports: {} };
const validatorJs = ts.transpileModule(fs.readFileSync('lib/funnel-event.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
new Function('require', 'module', 'exports', validatorJs)(require, compiled, compiled.exports);
const { validateFunnelEvent } = compiled.exports;

const base = process.argv[2] || 'http://localhost:3021';
async function open(browser, arm, layout = 'step', failFirst = false, query = 'industry=tree&angle=savings&ad_id=120251397789610660', storedAttribution = null) {
  const context = await browser.newContext();
  await context.addInitScript(({ arm, layout, storedAttribution }) => {
    localStorage.setItem('cohesive_contractor_short_first_ab_v1', arm);
    localStorage.setItem('cohesive_experiment_tree_savings_v1', layout);
    if (storedAttribution) sessionStorage.setItem('cohesive_attr_v1', JSON.stringify(storedAttribution));
  }, { arm, layout, storedAttribution });
  const attempts = [], finals = [];
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === base && url.pathname === '/api/intake') {
      const payload = request.postDataJSON();
      if (payload.partial) {
        attempts.push(payload);
        if (failFirst && attempts.length === 1) return route.fulfill({ status: 503, json: { ok: false, notification: 'failed' } });
        return route.fulfill({ status: 200, json: { ok: true, crm: 'skipped', notification: 'sent', conversion: { eligible: false } } });
      }
      finals.push(payload);
      return route.fulfill({ status: 200, json: { ok: true, crm: 'sent', notification: 'sent', conversion: { eligible: true, eventId: 'qa-final-event' } } });
    }
    if (url.origin !== base) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  await page.goto(base + '/contractor-test?' + query, { waitUntil: 'networkidle', timeout: 120000 });
  await page.getByRole('button', { name: arm === 'short' ? 'Save my details and continue' : 'Next', exact: true }).waitFor();
  return { context, page, attempts, finals };
}
const details = payload => Object.fromEntries((payload.details || []).map(item => [item.label, item.value]));
async function contact(page) {
  await page.getByLabel('Email', { exact: true }).fill('qa-short@example.invalid');
  await page.getByLabel('Phone', { exact: true }).fill('2025550123');
  await page.getByLabel('Full name', { exact: true }).fill('QA Short Test');
}
async function trade(page) {
  await page.getByRole('combobox', { name: "What's your primary trade?" }).fill('Tree');
  await page.getByRole('option', { name: 'Tree service' }).getByRole('button').click();
}

(async () => {
  for (const cellId of ['tree__savings__step__v1', 'fire_sprinkler__project_coi__step__v1', 'home_builder__ground_up__step__v1']) {
    assert.ok(validateFunnelEvent({ eventId: '00000000-0000-4000-8000-000000000001', sessionId: '00000000-0000-4000-8000-000000000002', cellId, version: '2026-11-05-shortfirst-v1', event: 'variant_view', elapsedMs: 0 }), cellId);
  }
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  try {
    {
      const { context, page, attempts } = await open(browser, 'current');
      assert.equal(await page.getByText('Step 1 of 7').count(), 1);
      assert.equal(await page.getByRole('button', { name: 'Save my details and continue' }).count(), 0);
      await contact(page);
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.getByLabel('Legal business name', { exact: true }).waitFor();
      assert.equal(attempts.length, 0, 'control Next keeps existing no-save behavior');
      await context.close();
    }
    {
      const { context, page, attempts, finals } = await open(browser, 'short', 'long', true);
      assert.equal(await page.getByText('Step 1 of 7').count(), 0);
      assert.equal(await page.getByLabel('Legal business name', { exact: true }).count(), 0);
      await contact(page); await trade(page);
      await page.getByRole('button', { name: 'Save my details and continue' }).click();
      await page.getByRole('alert').getByText('We could not save your details').waitFor();
      assert.equal(await page.getByLabel('Legal business name', { exact: true }).count(), 0, 'failure holds first screen');
      assert.equal(attempts.length, 1);
      await page.getByRole('button', { name: 'Save my details and continue' }).click();
      await page.getByLabel('Legal business name', { exact: true }).waitFor();
      assert.equal(attempts.length, 2, 'retry saved once');
      assert.equal(finals.length, 0, 'stage one is not a completed application');
      const first = details(attempts[1]);
      assert.equal(first['Website form arm'], 'short-first-v1');
      assert.equal(first['Form version'], '2026-11-05-shortfirst-v1');
      assert.equal(first['Primary trade'], 'Tree service');
      assert.equal(first['Current ad_id'], '120251397789610660');
      await page.getByRole('button', { name: 'Back', exact: true }).click();
      await page.getByRole('button', { name: 'Save my details and continue' }).click();
      await page.getByLabel('Legal business name', { exact: true }).waitFor();
      assert.equal(attempts.length, 2, 'back and continue cannot duplicate stage-one capture');
      await page.getByLabel('Legal business name', { exact: true }).fill('QA Tree LLC');
      await page.getByLabel('Business address', { exact: true }).fill('123 Main St, Austin, TX 78701');
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      assert.equal(await page.getByRole('combobox', { name: "What's your primary trade?" }).count(), 0, 'trade is not asked twice');
      await page.getByLabel('Any other trades?', { exact: true }).click();
      await page.getByRole('button', { name: 'None - just my primary trade' }).click();
      await page.getByLabel('Any other trades?', { exact: true }).click();
      await page.getByLabel('How much of your work is your primary trade?', { exact: true }).selectOption('All of it (100%)');
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.getByLabel('Annual revenue (roughly)', { exact: true }).selectOption('Under $250k');
      await page.getByLabel('W2 employees', { exact: true }).selectOption('0 - no W2 employees');
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.getByLabel('Do you hire subcontractors?', { exact: true }).selectOption('No');
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.getByRole('button', { name: 'Get my quote', exact: true }).click();
      await page.getByText('Thanks - we').waitFor();
      assert.equal(finals.length, 1);
      assert.equal(attempts.length, 2);
      const completed = details(finals[0]);
      assert.equal(completed['Website form arm'], 'short-first-v1');
      assert.equal(completed['Primary trade'], 'Tree service');
      assert.equal(completed['Current ad_id'], '120251397789610660');
      assert.equal(completed['Submission id'], first['Submission id'], 'partial and final share a submission ID');
      await context.close();
    }
    {
      // This live roofing URL currently falls back to the generic form. Its ad URL
      // still identifies the advertised industry even if the visitor gives only email.
      const { context, page, attempts, finals } = await open(browser, 'short', 'step', false,
        'industry=roof&angle=dollars&creative_variant=roof_quote_card&fbclid=IwARsourceOnly&utm_source=facebook&utm_medium=paid_social&utm_campaign=Roof%20Campaign',
        { ad_id: '120250000000000001', utm_source: 'facebook', utm_campaign: 'Earlier Campaign' });
      await page.getByLabel('Email', { exact: true }).fill('source-only@example.invalid');
      const receipt = page.waitForResponse(response => new URL(response.url()).pathname === '/api/intake');
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await receipt;
      assert.equal(attempts.length, 1, 'email-only abandonment sends a partial');
      assert.equal(finals.length, 0);
      const source = details(attempts[0]);
      assert.equal(source['Ad URL industry (not confirmed trade)'], 'Roofing');
      assert.equal(source['Ad URL industry key'], 'roof');
      assert.equal(source['Ad URL creative variant'], 'roof_quote_card');
      assert.equal(source['Current Meta click id'], 'IwARsourceOnly');
      assert.equal(source['Current URL traffic source'], 'facebook');
      assert.equal(source['Current URL campaign'], 'Roof Campaign');
      assert.equal(source['Campaign'], 'Earlier Campaign', 'first-touch history stays separate');
      assert.equal(source['Current ad_id'], undefined, 'click ID does not imply exact ad ID');
      assert.equal(source['Primary trade'], undefined, 'advertised industry is not customer-confirmed trade');
      await context.close();
    }
    console.log('PASS: control unchanged; short first screen, receipt failure/retry, source/trade/arm, email-only ad-source partial, no premature final, no duplicate save, same-ID final application. All intake requests intercepted.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
