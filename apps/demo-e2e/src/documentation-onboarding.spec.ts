import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('onboarding puts setup and a working task before version history', async ({page}) => {
  for (const library of ['ngx-lift', 'clr-lift']) {
    await page.goto('/' + library);
    const setup = page.locator('#getting-started');
    await expect(setup).toContainText('Get started');
    await expect(setup.locator('app-code-block')).toBeVisible();
    expect(
      await page
        .locator('#getting-started')
        .evaluate((el) =>
          Boolean(
            document.querySelector('#version-support') &&
            el.compareDocumentPosition(document.querySelector('#version-support') as Element) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        ),
    ).toBe(true);
    await setup.getByRole('link').first().click();
    await expect(page.locator('cll-page-container h1').first()).toBeVisible();
  }
});

test('onboarding documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of ['/ngx-lift', '/clr-lift']) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
