const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:3021';

async function open(browser, path, init) {
  const context = await browser.newContext();
  if (init) await context.addInitScript(init);
  const payloads = [], finals = [];
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === base && url.pathname === '/api/intake') {
      const payload = request.postDataJSON();
      if (payload?.partial) payloads.push(payload);
      else if (payload) finals.push(payload);
      return route.fulfill({ status: 200, json: { ok: true, notification: 'sent', conversion: { eligible: false } } });
    }
    if (url.origin !== base) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  return { context, page, payloads, finals };
}

// Staged workers' comp question (Kevin 2026-10-14): /contractor-test asks it ONLY with ?wc=1.
const WC_QUESTION = "Do you also need workers' comp?";
const WC_ROW = "Workers' comp requested";
// Today's completed paid-form body, key for key and in order. Without wc=1 it must stay exactly this.
const FINAL_KEYS = ['name', 'email', 'phone', 'company', 'businessType', 'source', 'details', 'eventId', 'website'];
// A contact-screen-only partial: no business name yet, so `company` is undefined and JSON drops it.
const PARTIAL_KEYS = ['name', 'email', 'phone', 'businessType', 'source', 'partial', 'final', 'details', 'website'];

// Fill every required answer on the long layout (all questions on one screen).
async function fillRequired(page) {
  await page.getByLabel('Email', { exact: true }).fill('wc-test@example.invalid');
  await page.getByLabel('Phone', { exact: true }).fill('2025550123');
  await page.getByLabel('Full name', { exact: true }).fill('QA WC Test');
  await page.getByLabel('Legal business name', { exact: true }).fill('QA WC Remodel LLC');
  await page.getByLabel('Business address', { exact: true }).fill('123 Main St, Austin, TX 78701');
  await page.getByRole('combobox', { name: "What's your primary trade?" }).fill('Remodel');
  await page.getByRole('option', { name: 'Remodeling / renovations' }).getByRole('button').click();
  await page.getByLabel('Any other trades?', { exact: true }).click();
  await page.getByRole('button', { name: 'None - just my primary trade' }).click();
  await page.getByLabel('Any other trades?', { exact: true }).click();
  await page.getByLabel('How much of your work is your primary trade?', { exact: true }).selectOption('All of it (100%)');
  await page.getByLabel('Annual revenue (roughly)', { exact: true }).selectOption('Under $250k');
  await page.getByLabel('W2 employees', { exact: true }).selectOption('0 - no W2 employees');
  await page.getByLabel('Do you hire subcontractors?', { exact: true }).selectOption('No');
}

async function submitLong(page, finals) {
  await page.getByRole('button', { name: 'Get my quote', exact: true }).click();
  await page.getByText('Thanks - we').waitFor();
  assert.equal(finals.length, 1, 'one completed submission');
  return finals[0];
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
      // Kevin 2026-10-09: an abandoned SEO form never claims the page's trade as the client's; with no stated trade, Trade is omitted.
      assert.equal(captured.Trade, undefined, 'no stated trade -> Trade omitted');
      assert.equal(captured['Page trade'], 'Painter');
      assert.equal(payloads[0].businessType, undefined, 'no stated trade -> businessType omitted');
      if (await operations.count()) assert.equal(captured['Services described'], 'Interior and exterior painting work');
      await context.close();
    }

    {
      const { context, page, payloads } = await open(browser, '/insurance/roofer/pennsylvania');
      await page.getByPlaceholder('Email').fill('partial-test@example.invalid');
      await page.getByPlaceholder('Phone').fill('2025550123');
      await page.locator('select').selectOption('General contractor');
      await leave(page);
      await page.waitForTimeout(300);
      assert.equal(payloads.length, 1);
      const captured = details(payloads[0]);
      assert.equal(captured.Trade, 'General contractor');
      assert.equal(captured['Page trade'], 'Roofer');
      await context.close();
    }

    // --- Staged WC question -------------------------------------------------------------------
    // No wc=1 (all current paid traffic): no question rendered and today's exact payload, on both layouts.
    {
      const { context, page, finals } = await open(browser, '/contractor-test?industry=remodel&angle=trade_mix', () => localStorage.setItem('cohesive_experiment_remodel_trade_mix_v1', 'long'));
      assert.equal(await page.getByText(WC_QUESTION).count(), 0, 'no wc=1 -> no WC question');
      assert.equal(await page.locator('[data-funnel-field="wcRequested"], input[name="wcRequested"]').count(), 0);
      await fillRequired(page);
      const body = await submitLong(page, finals);
      assert.deepEqual(Object.keys(body), FINAL_KEYS, 'no wc=1 -> exactly today\'s payload keys');
      assert.equal(body.coverage, undefined);
      assert.equal(details(body)[WC_ROW], undefined);
      assert.ok(!body.details.some(d => /workers'? comp/i.test(d.label + d.value)), 'no WC trace in details');
      await context.close();
    }
    {
      const { context, page, payloads } = await open(browser, '/contractor-test?industry=roof&angle=coi', () => localStorage.setItem('cohesive_experiment_roof_coi_v1', 'step'));
      assert.equal(await page.getByText('Step 1 of 7').count(), 1, 'no wc=1 -> same 7 steps');
      await page.getByLabel('Email', { exact: true }).fill('wc-partial@example.invalid');
      await page.getByLabel('Phone', { exact: true }).fill('2025550123');
      await page.getByLabel('Full name', { exact: true }).fill('QA WC Partial');
      await leave(page);
      await page.waitForTimeout(300);
      assert.equal(payloads.length, 1);
      assert.deepEqual(Object.keys(payloads[0]), PARTIAL_KEYS, 'no wc=1 -> exactly today\'s partial keys');
      assert.equal(details(payloads[0])[WC_ROW], undefined);
      await context.close();
    }
    // wc=1: the question shows (optional, accessible, 16px on phones) and each answer maps to the contract.
    for (const [answer, coverage] of [['Yes', ['General Liability', 'Workers Comp']], ['Not sure', undefined], ['No', undefined], [null, undefined]]) {
      const { context, page, finals } = await open(browser, '/contractor-test?industry=remodel&angle=trade_mix&wc=1', () => localStorage.setItem('cohesive_experiment_remodel_trade_mix_v1', 'long'));
      await page.setViewportSize({ width: 390, height: 844 });
      const group = page.getByRole('group', { name: WC_QUESTION });
      assert.equal(await group.count(), 1, 'wc=1 -> WC question shown');
      assert.deepEqual(await group.getByRole('button').allTextContents(), ['Yes', 'No', 'Not sure']);
      assert.equal(await group.getByRole('button', { name: 'Yes' }).evaluate(el => getComputedStyle(el).fontSize), '16px', '16px on phones (no iOS zoom)');
      await fillRequired(page);
      if (answer) {
        await group.getByRole('button', { name: answer, exact: true }).click();
        assert.equal(await group.getByRole('button', { name: answer, exact: true }).getAttribute('aria-pressed'), 'true');
      }
      const body = await submitLong(page, finals);
      assert.deepEqual(body.coverage, coverage, `wc=1 + ${answer} -> coverage`);
      assert.deepEqual(Object.keys(body), coverage ? [...FINAL_KEYS, 'coverage'] : FINAL_KEYS);
      assert.equal(details(body)[WC_ROW], answer ?? undefined, `wc=1 + ${answer} -> details row`);
      await context.close();
    }
    // wc=1 on the step layout: no extra step; the question sits on the last (coverage) screen; a
    // partial carries the answer only once the visitor gave one.
    for (const answer of [null, 'Yes']) {
      const { context, page, payloads } = await open(browser, '/contractor-test?industry=tree&angle=coi&wc=1', () => localStorage.setItem('cohesive_experiment_tree_coi_v1', 'step'));
      assert.equal(await page.getByText('Step 1 of 7').count(), 1, 'wc=1 adds no step');
      await page.getByLabel('Email', { exact: true }).fill('wc-step@example.invalid');
      await page.getByLabel('Phone', { exact: true }).fill('2025550123');
      await page.getByLabel('Full name', { exact: true }).fill('QA WC Step');
      assert.equal(await page.getByText(WC_QUESTION).count(), 0, 'not on the contact screen');
      if (answer) {
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await page.getByLabel('Legal business name', { exact: true }).fill('QA WC Tree LLC');
        await page.getByLabel('Business address', { exact: true }).fill('9 Oak St, Austin, TX 78701');
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await page.getByRole('combobox', { name: "What's your primary trade?" }).fill('Tree');
        await page.getByRole('option', { name: 'Tree service' }).getByRole('button').click();
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
        await page.getByText('Step 7 of 7').waitFor();
        const group = page.getByRole('group', { name: WC_QUESTION });
        assert.equal(await group.count(), 1, 'WC question on the coverage screen');
        await group.getByRole('button', { name: answer, exact: true }).click();
      }
      await leave(page);
      await page.waitForTimeout(300);
      assert.equal(payloads.length, 1);
      const captured = details(payloads[0]);
      if (answer) {
        assert.equal(captured[WC_ROW], 'Yes');
        assert.deepEqual(payloads[0].coverage, ['General Liability', 'Workers Comp']);
      } else {
        assert.equal(captured[WC_ROW], undefined, 'unanswered -> no WC row');
        assert.deepEqual(Object.keys(payloads[0]), PARTIAL_KEYS, 'unanswered -> no coverage key');
      }
      await context.close();
    }

    console.log('PASS: contractor-test, contractors, contractor alias, and contractor SEO pages capture one latest exit snapshot with downstream answers; staged WC question (wc=1 only) maps Yes/No/Not sure to the coverage contract; no real intake sent.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
