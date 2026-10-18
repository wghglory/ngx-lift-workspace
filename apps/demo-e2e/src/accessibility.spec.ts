import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';
import {demoRoutes} from './support/demo-routes';

for (const theme of ['light', 'dark']) {
  test.describe(`accessibility ${theme}`, () => {
    test.beforeEach(async ({page}) => {
      await page.addInitScript((activeTheme) => {
        localStorage.setItem('clr-lift-lang', 'en');
        localStorage.setItem('cds-theme', activeTheme);
      }, theme);
    });

    for (const route of demoRoutes) {
      test(`${route}`, async ({page}, testInfo) => {
        await page.goto(route);
        await expect(page.locator('body')).toHaveAttribute('cds-theme', theme);
        await expect(page.locator('main h1').first()).not.toBeEmpty();
        await expectAccessible(page, testInfo);
      });
    }

    test('text tooltip and interactive dialog support keyboard entry and exit', async ({page}, testInfo) => {
      await page.goto('/clr-lift/components/tooltip');
      const textTrigger = page.getByRole('link', {name: 'Basic Tooltip 1', exact: true});
      await textTrigger.focus();
      await expect(page.getByRole('tooltip')).toBeVisible();
      await expectAccessible(page, testInfo);
      await textTrigger.press('Escape');
      await expect(page.getByRole('tooltip')).toHaveCount(0);
      await expect(textTrigger).toBeFocused();
      const dialogTrigger = page.getByRole('link', {name: 'Component Ref Example', exact: true});
      await dialogTrigger.focus();
      const dialog = page.getByRole('dialog', {name: 'Details', exact: true});
      await expect(dialog).toBeVisible();
      await expectAccessible(page, testInfo);
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(dialogTrigger).toBeFocused();
    });

    test('file selection and removal preserve keyboard access', async ({page}, testInfo) => {
      await page.goto('/clr-lift/components/file-reader');
      const example = page.getByTestId('file-reader-demo-starter');
      const browse = example.getByRole('button', {name: 'Browse', exact: true});
      await browse.focus();
      const [chooser] = await Promise.all([page.waitForEvent('filechooser'), browse.press('Space')]);
      await chooser.setFiles({name: 'accessible.txt', mimeType: 'text/plain', buffer: Buffer.from('hello')});
      await expect(example).toContainText('accessible.txt');
      const remove = example.getByRole('button', {name: 'Remove file', exact: true});
      await remove.focus();
      await remove.press('Enter');
      await expect(browse).toBeFocused();
      await expectAccessible(page, testInfo);
    });

    test('wizard navigation remains named and keyboard operable', async ({page}, testInfo) => {
      await page.goto('/clr-lift/components/timeline-wizard');
      const wizard = page.locator('cll-timeline-wizard');
      const next = wizard.getByRole('button', {name: 'Next', exact: true});
      await next.focus();
      await next.press('Enter');
      await expect(wizard.getByRole('button', {name: 'Previous', exact: true})).toBeVisible();
      await expect(next).toHaveAttribute('aria-label', 'Next');
      await expectAccessible(page, testInfo);
      await wizard.getByRole('button', {name: 'Previous', exact: true}).press('Enter');
      await expect(wizard.getByRole('button', {name: 'Previous', exact: true})).toHaveCount(0);
    });
  });
}
