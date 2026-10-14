import {expect, test} from '@playwright/test';

test('loads certificate details on interaction and preserves keyboard focus', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  await expect(page.locator('cll-certificate-signpost')).toHaveCount(0);
  const load = page.locator('[data-test-id="load-certificate"]');
  await load.focus();
  await load.press('Enter');
  const trigger = page.locator('cll-certificate-signpost button');
  await expect(trigger).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await expect(page.locator('clr-signpost-content')).toBeVisible();
  await expect(page.locator('clr-signpost-content')).toContainText('Issued To');
});
