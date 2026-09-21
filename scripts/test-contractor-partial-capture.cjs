const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:3021';

async function open(browser, path, init) {
  const context = await browser.newContext();
  if (init) await context.addInitScript(init);
  const payloads = [];
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === base && url.pathname === '/api/intake') {
      const payload = request.postDataJSON();
      if (payload?.partial) payloads.push(payload);
      return route.fulfill({ status: 200, json: { ok: true, notification: 'sent', conversion: { eligible: false } } });
    }
    if (url.origin !== base) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  return { context, page, payloads };
}

async function leave(page) {
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
}

function details(payload) {
  return Object.fromEntries((payload.details || []).map(item => [item.label, item.value]));
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  try {
    // Current Meta destination: advancing past contact must not freeze an early
    // snapshot. Leaving after later answers must include those answers.
    {
      const { context, page, payloads } = await open(browser, '/contractor-test?industry=remodel&angle=trade_mix', () => {
        localStorage.setItem('cohesive_experiment_remodel_trade_mix_v1', 'step');
      });
      await page.getByLabel('Email', { exact: true }).fill('partial-test@example.invalid');
      await page.getByLabel('Phone', { exact: true }).fill('2025550123');
      await page.getByLabel('Full name', { exact: true }).fill('QA Partial Test');
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(750);
      assert.equal(payloads.length, 0, 'contact-screen advance must not send an early partial');
      await page.getByLabel('Legal business name', { exact: true }).fill('QA Complete Snapshot LLC');
      await page.getByLabel('Business address', { exact: true }).fill('123 Main St, Austin, TX 78701');
      await leave(page);
      await page.waitForTimeout(300);
      assert.equal(payloads.length, 1);
      const captured = details(payloads[0]);
      assert.equal(captured['Legal business name'], 'QA Complete Snapshot LLC');
      assert.equal(captured['Business address'], '123 Main St, Austin, TX 78701');
      await context.close();
    }

    // Exercise the 120-second idle path with only that exact timer shortened.
    {
      const { context, page, payloads } = await open(browser, '/contractor-test?industry=remodel&angle=trade_mix', () => {
        localStorage.setItem('cohesive_experiment_remodel_trade_mix_v1', 'long');
        const nativeSetTimeout = window.setTimeout;
        window.setTimeout = (callback, delay, ...args) => nativeSetTimeout(callback, delay === 120000 ? 1200 : delay, ...args);
      });
      await page.getByLabel('Email', { exact: true }).fill('idle-test@example.invalid');
      await page.getByLabel('Phone', { exact: true }).fill('2025550123');
      await page.getByLabel('Full name', { exact: true }).fill('QA Idle Test');
      await page.getByLabel('Legal business name', { exact: true }).fill('QA Idle Snapshot LLC');
      await page.getByLabel('Business address', { exact: true }).fill('456 Main St, Dallas, TX 75201');
      await page.waitForTimeout(1600);
      assert.equal(payloads.length, 1, 'idle should send one latest partial');
      const captured = details(payloads[0]);
      assert.equal(captured['Legal business name'], 'QA Idle Snapshot LLC');
      assert.equal(captured['Business address'], '456 Main St, Dallas, TX 75201');
      await context.close();
    }

    // Legacy /contractors and its /contractor alias already use the desired
    // exit/idle snapshot. Verify the live route retains a later field.
    for (const path of ['/contractors', '/contractor']) {
      const { context, page, payloads } = await open(browser, path);
      await page.getByLabel('Email', { exact: true }).fill('partial-test@example.invalid');
      await page.getByLabel('Phone', { exact: true }).fill('2025550123');
      await page.getByLabel('Legal business name', { exact: true }).fill('QA Legacy Snapshot LLC');
      await leave(page);
      await page.waitForTimeout(300);
      assert.equal(payloads.length, 1, `${path} should send one partial`);
      assert.equal(details(payloads[0])['Legal business name'], 'QA Legacy Snapshot LLC');
      await context.close();
    }

    // SEO/state contractor pages are also valid future paid destinations.
    {
      const { context, page, payloads } = await open(browser, '/insurance/painter/texas');
      await page.getByPlaceholder('Business name').fill('QA SEO Snapshot LLC');
      await page.getByPlaceholder('Email').fill('partial-test@example.invalid');
      await page.getByPlaceholder('Phone').fill('2025550123');
      const operations = page.locator('textarea');
      if (await operations.count()) await operations.fill('Interior and exterior painting work');
      await leave(page);
      await page.waitForTimeout(300);
      assert.equal(payloads.length, 1);
      const captured = details(payloads[0]);
      assert.equal(captured.Business, 'QA SEO Snapshot LLC');
      if (await operations.count()) assert.equal(captured['Services described'], 'Interior and exterior painting work');
      await context.close();
    }

    console.log('PASS: contractor-test, contractors, contractor alias, and contractor SEO pages capture one latest exit snapshot with downstream answers; no real intake sent.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
