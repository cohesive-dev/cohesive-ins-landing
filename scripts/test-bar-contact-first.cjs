const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:3021';
const details = body => Object.fromEntries((body.details || []).map(({ label, value }) => [label, value]));

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext();
    const partials = [], completions = [];
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === base && url.pathname === '/api/intake') {
        const body = request.postDataJSON();
        (body.partial ? partials : completions).push(body);
        return route.fulfill({ status: 200, json: { ok: true, notification: 'sent' } });
      }
      if (url.origin !== base) return route.abort();
      return route.continue();
    });

    const page = await context.newPage();
    await page.goto(base + '/bar', { waitUntil: 'networkidle' });
    assert.equal(await page.getByLabel('Email', { exact: true }).count(), 1, 'bar starts with email');
    const earlyDisclosure = page.getByText(/Contact details you enter may be saved before submission/).first();
    assert.ok((await earlyDisclosure.boundingBox()).y > (await page.getByLabel('Email', { exact: true }).boundingBox()).y, 'early capture is disclosed beside the first field');
    assert.equal(await page.getByText('Which best describes your business?').count(), 0, 'business questions follow contact');

    await page.getByLabel('Email', { exact: true }).fill('bar-partial@example.invalid');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    assert.equal(await page.getByLabel('Phone', { exact: true }).count(), 1);
    await page.getByLabel('Phone', { exact: true }).fill('2025550184');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByLabel('Your full name', { exact: true }).fill('QA Bar Visitor');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    assert.equal(await page.getByText('Which best describes your business?').count(), 1);
    await page.getByRole('button', { name: 'Full-service / sit-down restaurant' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: '$500K - $1M' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: '70% or more' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Rent (tenant)' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    assert.equal(await page.getByText('What would you like us to quote?').count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Help me decide' }).count(), 0, 'removed option stays absent');
    await page.getByRole('button', { name: 'Liquor liability', exact: true }).click();
    await page.getByRole('button', { name: 'General liability', exact: true }).click();
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(300);

    assert.equal(partials.length, 1, 'one abandoned fill');
    assert.equal(completions.length, 0, 'abandon is not a completed quote request');
    const body = partials[0];
    assert.equal(body.source, 'bar-landing');
    assert.equal(body.email, 'bar-partial@example.invalid');
    assert.equal(body.phone, '2025550184');
    assert.equal(body.name, 'QA Bar Visitor');
    assert.equal(body.businessType, 'Full-service / sit-down restaurant', 'visitor-stated type is preserved');
    assert.equal(details(body)['Alcohol share range'], '70%+');
    assert.equal(details(body)['Alcohol as % of sales'], 'Over 50%');
    assert.deepEqual(body.coverage, ['General Liability', 'Liquor Liability']);
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(100);
    assert.equal(partials.length, 1, 'abandon dedupes');
    await context.close();

    const emailOnlyContext = await browser.newContext();
    const emailOnlyPartials = [];
    await emailOnlyContext.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === base && url.pathname === '/api/intake') {
        emailOnlyPartials.push(request.postDataJSON());
        return route.fulfill({ status: 200, json: { ok: true } });
      }
      if (url.origin !== base) return route.abort();
      return route.continue();
    });
    const emailOnlyPage = await emailOnlyContext.newPage();
    await emailOnlyPage.goto(base + '/bar', { waitUntil: 'networkidle' });
    await emailOnlyPage.getByLabel('Email', { exact: true }).fill('early@example.invalid');
    await emailOnlyPage.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await emailOnlyPage.waitForTimeout(300);
    assert.equal(emailOnlyPartials.length, 1, 'email alone makes an abandon reachable');
    assert.equal(emailOnlyPartials[0].businessType, undefined, 'no bar or restaurant type inferred from page');
    assert.equal(emailOnlyPartials[0].phone, undefined);
    await emailOnlyContext.close();

    const restaurantContext = await browser.newContext();
    const restaurantPage = await restaurantContext.newPage();
    await restaurantPage.goto(base + '/restaurant', { waitUntil: 'networkidle' });
    assert.equal(await restaurantPage.getByText('Which best describes your business?').count(), 1, 'restaurant form order remains unchanged');
    await restaurantContext.close();
    console.log('PASS: /bar asks for contact first, preserves later answers in one abandoned partial, and leaves /restaurant order unchanged; all intake requests intercepted.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
