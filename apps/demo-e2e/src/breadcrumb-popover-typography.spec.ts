import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

for (const theme of ['light', 'dark']) {
  for (const trail of ['deep-trail', 'search-trail']) {
    test(`${trail} popover keeps default typography with enlarged trail in ${theme}`, async ({page}, info) => {
      await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
      await page.goto('/clr-lift/components/breadcrumb');
      await page.evaluate((value) => document.body.setAttribute('cds-theme', value), theme);
      await page.setViewportSize({width: 390, height: 844});
      const host = page.getByTestId(trail);
      await host.evaluate((element) => {
        (element as HTMLElement).style.setProperty(
          '--cll-breadcrumb-font-size',
          'var(--clr-base-typography-font-size-inline, 0.65rem)',
        );
      });
      const defaultFont = await host.evaluate((element) => getComputedStyle(element).fontSize);
      const trigger = host.getByRole('button', {name: 'Show path details and ancestors'});
      await trigger.click();
      const panel = host.getByRole('region');
      const baselineLineHeight = await panel.evaluate((element) => getComputedStyle(element).lineHeight);
      await panel.getByRole('button', {name: 'Close path details'}).click();
      await host.evaluate((element) =>
        (element as HTMLElement).style.setProperty('--cll-breadcrumb-font-size', '1.8rem'),
      );
      await expect.poll(() => host.evaluate((element) => getComputedStyle(element).fontSize)).toBe('36px');
      await trigger.click();
      await expect(panel).toBeVisible();
      for (const target of [
        panel,
        panel.locator('.full-path'),
        panel.getByRole('link').first(),
        panel.getByRole('button', {name: 'Close path details'}),
      ]) {
        await expect.poll(() => target.evaluate((element) => getComputedStyle(element).fontSize)).toBe(defaultFont);
      }
      await expect
        .poll(() => panel.evaluate((element) => getComputedStyle(element).lineHeight))
        .toBe(baselineLineHeight);
      const contextMetrics = await panel
        .locator('small')
        .first()
        .evaluate((element) => {
          const style = getComputedStyle(element);
          return {fontSize: parseFloat(style.fontSize), lineHeight: parseFloat(style.lineHeight)};
        });
      expect(contextMetrics.lineHeight).toBeGreaterThanOrEqual(contextMetrics.fontSize);
      await expectAccessible(page, info, `[data-testid="${trail}"]`);
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }
}

test('popover default typography still scales with the root font', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/breadcrumb');
  const host = page.getByTestId('search-trail');
  await host.evaluate((element) => (element as HTMLElement).style.setProperty('--cll-breadcrumb-font-size', '1.8rem'));
  const trigger = host.getByRole('button', {name: 'Show path details and ancestors'});
  await trigger.click();
  const panel = host.getByRole('region');
  const baseline = await panel.evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  await panel.getByRole('button', {name: 'Close path details'}).click();
  await page.evaluate(() => {
    const root = document.documentElement;
    root.style.fontSize = `${parseFloat(getComputedStyle(root).fontSize) * 2}px`;
  });
  await trigger.click();
  await expect
    .poll(() => panel.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)))
    .toBeCloseTo(baseline * 2, 1);
  await expect(panel.getByRole('searchbox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
