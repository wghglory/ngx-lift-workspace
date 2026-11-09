import {expect, test, type Page} from '@playwright/test';

import {expectAccessible} from './support/accessibility';
import {demoRoutes} from './support/demo-routes';
import {visitDemoTabs} from './support/demo-tabs';

async function waitForInitialRouteData(page: Page, route: string) {
  if (route !== '/ngx-lift/signals/computedAsync') return;

  const usersDemo = page.getByTestId('computed-http-users-demo');
  await expect(usersDemo.locator('app-user-card')).toHaveCount(9);
  await expect(usersDemo.getByRole('button', {name: 'Refresh', exact: true})).toBeEnabled();
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
}

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
        await page.route(
          (url) => url.origin === 'https://randomuser.me' && url.pathname === '/api',
          (request) => {
            const count = Number(new URL(request.request().url()).searchParams.get('results') ?? 1);
            return request.fulfill({
              json: {
                results: Array.from({length: count}, (_, index) => ({
                  id: {name: 'test', value: String(index)},
                  gender: 'female',
                  name: {first: 'API', last: 'User'},
                  picture: {thumbnail: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='},
                })),
                info: {page: 1, results: count, seed: 'test', version: '1'},
              },
            });
          },
        );
        await page.goto(route, {waitUntil: 'domcontentloaded'});
        await expect(page.locator('body')).toHaveAttribute('cds-theme', theme);
        await expect(page.locator('main h1').first()).not.toBeEmpty();
        await waitForInitialRouteData(page, route);
        // Wait for the raw, encoded and sample-picker examples, rather than scanning a partially
        // created deferred view.
        for (const demo of await page.locator('app-certificate-demo').all()) {
          await expect(demo.locator('app-certificate-example')).toHaveCount(3);
          for (const example of await demo.locator('app-certificate-example').all()) {
            await expect(example.getByRole('button')).toHaveCount(1);
            await expect(example.getByRole('button')).toHaveAccessibleName('Show certificate');
            await expect(example.getByRole('button')).toBeEnabled();
          }
        }
        await expectAccessible(page, testInfo);
        await visitDemoTabs(page, () => expectAccessible(page, testInfo));
      });
    }

    test('text tooltip and interactive dialog support keyboard entry and exit', async ({page}, testInfo) => {
      await page.goto('/clr-lift/components/tooltip', {waitUntil: 'domcontentloaded'});
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
      await page.goto('/clr-lift/components/file-reader', {waitUntil: 'domcontentloaded'});
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

    test('resource controls keep names during local edits and loading', async ({page}, testInfo) => {
      await page.goto('/ngx-lift/signals/resourceAsync', {waitUntil: 'domcontentloaded'});
      await page.getByRole('tab', {name: 'Local state', exact: true}).click();
      await page.getByRole('button', {name: 'Load Todo', exact: true}).click();
      const todo = page.getByRole('checkbox', {name: 'Learn WritableResourceRef', exact: true});
      await todo.focus();
      await todo.press('Space');
      await expect(todo).toBeChecked();
      await page.getByRole('button', {name: 'Load Counter', exact: true}).click();
      const increase = page.getByRole('button', {name: 'Increase counter', exact: true});
      await increase.focus();
      await increase.press('Enter');
      await expect(page.locator('.counter-display')).toHaveText('1');
      await page.getByRole('button', {name: 'Decrease counter', exact: true}).press('Enter');
      await expect(page.locator('.counter-display')).toHaveText('0');
      await expectAccessible(page, testInfo);
      await page.getByRole('tab', {name: 'Practical recipes', exact: true}).click();
      const execute = page.getByRole('button', {name: 'Await execute()', exact: true});
      await execute.press('Enter');
      await expect(execute).toHaveAttribute('aria-label', 'Await execute()');
      await expect(execute).toBeVisible();
      await expectAccessible(page, testInfo);
    });

    test('wizard navigation remains named and keyboard operable', async ({page}, testInfo) => {
      await page.goto('/clr-lift/components/timeline-wizard', {waitUntil: 'domcontentloaded'});
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
