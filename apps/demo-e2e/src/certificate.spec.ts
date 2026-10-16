import {expect, test} from '@playwright/test';

test('loads both certificate examples automatically without moving focus', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  await expect(page.getByRole('button', {name: 'Load Certificate Example', exact: true})).toHaveCount(0);
  const triggers = page.locator('cll-certificate-signpost button');
  await expect(triggers).toHaveCount(2);
  for (const trigger of await triggers.all()) {
    await expect(trigger).toBeVisible();
    await expect(trigger).not.toBeFocused();
  }
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('clr-signpost-content')).toHaveCount(0);
  const first = triggers.first();
  await first.focus();
  await first.press('Enter');
  const details = page.locator('clr-signpost-content');
  await expect(details).toBeVisible();
  await expect(details).toContainText('Issued To');
  await expect(details).toContainText('DigiCert');
});
