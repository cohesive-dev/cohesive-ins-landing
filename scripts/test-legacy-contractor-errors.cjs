const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const base = process.argv[2] || 'http://localhost:3020';
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();
  let intercepted = 0;
  await context.route('**/*', async route => {
    const request = route.request(); const url = new URL(request.url());
    if (url.origin === base && url.pathname === '/api/intake') {
      if (request.postDataJSON()?.partial) return route.fulfill({ status: 200, json: { ok: true } });
      intercepted++;
      return route.fulfill({ status: 422, json: { ok: false, error: 'Please check your phone number and try again.' } });
    }
    if (request.method() !== 'GET' || url.origin !== base) return route.abort();
    return route.continue();
  });
  try {
    const page = await context.newPage();
    await page.goto(base + '/contractors', { waitUntil: 'networkidle' });
    for (const [label, value] of [['Full name', 'QA Intercept'], ['Email', 'intercept@example.invalid'], ['Phone', '2021234567'], ['Legal business name', 'QA Test LLC'], ['Business address', '123 Example St, Austin, TX 78701']]) await page.getByLabel(label, { exact: true }).fill(value);
    for (const [label, value] of [["What's your primary trade?", 'Pool construction / service'], ['How much of your work is your primary trade?', 'All of it (100%)'], ['Annual revenue (roughly)', 'Under $250k'], ['W2 employees', '0 - no W2 employees'], ['Do you hire subcontractors?', 'No']]) await page.getByLabel(label, { exact: true }).selectOption(value);
    await page.getByLabel('Any other trades?', { exact: true }).click();
    await page.getByRole('button', { name: 'None - just my primary trade', exact: true }).click();
    await page.getByLabel('Any other trades?', { exact: true }).click();
    const submit = page.locator('button[type=submit]');
    for (const invalid of ['2021234567', '22025550123']) {
      await page.getByLabel('Phone', { exact: true }).fill(invalid);
      assert.equal(await submit.isDisabled(), true);
      assert.equal(await page.getByText('Please enter a valid phone number.', { exact: true }).isVisible(), true);
    }
    assert.equal(intercepted, 0);
    await page.getByLabel('Phone', { exact: true }).fill('2025550123');
    assert.equal(await submit.isEnabled(), true);
    await submit.click();
    await page.getByText('Please check your phone number and try again.', { exact: true }).waitFor();
    assert.equal(intercepted, 1);
    assert.equal(await page.locator('form').count(), 1);
    const result = { at: new Date().toISOString(), base, invalid_phones_blocked: 2, valid_phone_passed_client: true, server_guidance_shown: true, false_success: false, real_submissions: 0 };
    if (process.env.RECEIPT_PATH) fs.writeFileSync(process.env.RECEIPT_PATH, JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
