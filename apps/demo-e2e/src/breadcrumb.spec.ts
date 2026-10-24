import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

const route = '/clr-lift/components/breadcrumb';
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.route('**/breadcrumb-server.json', (request) =>
    request.fulfill({json: {id: 'api-42', name: 'API server 42'}}),
  );
  await page.goto(route);
  await expect(page.getByTestId('spa-trail').locator('[aria-current]')).toHaveText('API server 42');
});

test('starts with automatically built links and expanded simple usage code', async ({page}) => {
  const first = page.locator('app-demo-playground').first();
  await expect(first.getByRole('navigation')).toHaveAccessibleName('Database · ordinary links');
  await expect(first.getByRole('button', {name: 'Hide Code'})).toHaveAttribute('aria-expanded', 'true');
  await expect(first.locator('app-code-block')).toBeVisible();
  await expect(first.locator('app-code-block')).not.toContainText('ng-template');
  await first.getByRole('button', {name: 'HTML', exact: true}).click();
  await expect(first.locator('code')).toHaveText('<cll-breadcrumb [items]="items()" />');
  await expect(first.locator('li').last().getByRole('link')).toHaveCount(0);
});

test('API name, SPA/history and ordinary native navigation preserve ownership', async ({page}) => {
  const spa = page.getByTestId('spa-trail');
  await expect(spa.getByRole('link', {name: 'Sql servers', exact: true})).toHaveAttribute('href', `${route}?level=1`);
  await expect(spa.locator('[aria-current] a,[aria-current] button')).toHaveCount(0);
  await page.evaluate(() => {
    document.body.dataset['sameDocument'] = 'yes';
  });
  await spa.getByRole('link', {name: 'Sql servers', exact: true}).click();
  await expect(spa.locator('[aria-current]')).toHaveText('Sql servers');
  await expect(page.locator('body')).toHaveAttribute('data-same-document', 'yes');
  await page.goBack();
  await expect(spa.locator('[aria-current]')).toHaveText('API server 42');
  await page.getByTestId('native-trail').getByRole('link', {name: 'Database', exact: true}).click();
  await expect(spa.locator('[aria-current]')).toHaveText('Database');
  await expect(page.locator('body')).not.toHaveAttribute('data-same-document');
});

test('anchors keep native modified, middle and context-menu events', async ({page}) => {
  for (const name of ['spa-trail', 'native-trail']) {
    const link = page.getByTestId(name).getByRole('link').first();
    expect(
      await link.evaluate((element) =>
        [
          new MouseEvent('click', {bubbles: true, cancelable: true, ctrlKey: true}),
          new MouseEvent('click', {bubbles: true, cancelable: true, metaKey: true}),
          new MouseEvent('auxclick', {bubbles: true, cancelable: true, button: 1}),
          new MouseEvent('contextmenu', {bubbles: true, cancelable: true, button: 2}),
        ].map((event) => {
          let prevented = true;
          document.addEventListener(
            event.type,
            (observed) => {
              prevented = observed.defaultPrevented;
              observed.preventDefault();
            },
            {once: true},
          );
          element.dispatchEvent(event);
          return prevented;
        }),
      ),
    ).toEqual([false, false, false, false]);
  }
});

test('keyboard actions are form-safe; empty and singleton trails have documented semantics', async ({
  page,
  browserName,
}) => {
  await expect(page.getByTestId('empty-trail').getByRole('navigation')).toHaveCount(0);
  await expect(page.getByTestId('singleton-trail').locator('[aria-current]')).toHaveText('Database');
  await expect(page.getByTestId('singleton-trail').locator('a,button')).toHaveCount(0);
  const button = page.getByTestId('action-trail').getByRole('button', {name: 'Database', exact: true});
  await button.press('Space');
  await expect(page.getByText('Selected location: Database', {exact: true})).toBeVisible();
  await expect(page.getByTestId('form-state')).toHaveText('Form submissions: 0');
  await expect(button).toBeFocused();
  // On macOS, WebKit uses Option+Tab to include native buttons in keyboard traversal.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByTestId('action-trail').getByRole('button', {name: 'Sql servers', exact: true})).toBeFocused();
});

for (const theme of ['light', 'dark']) {
  test(`runtime font inheritance, compact RTL, wrapping and accessibility in ${theme}`, async ({page}, testInfo) => {
    await page.evaluate((value) => {
      document.body.setAttribute('cds-theme', value);
      document.body.setAttribute('clr-density', 'compact');
      document.documentElement.dir = 'rtl';
    }, theme);
    await page.setViewportSize({width: 390, height: 800});
    const spa = page.getByTestId('spa-trail');
    const native = page.getByTestId('native-trail');
    const inherited = await native.evaluate((element) => getComputedStyle(element).fontSize);
    await page.getByRole('slider', {name: 'Font size'}).press('End');
    await expect.poll(() => spa.evaluate((element) => getComputedStyle(element).fontSize)).toBe('30px');
    expect(await native.evaluate((element) => getComputedStyle(element).fontSize)).toBe(inherited);
    expect(
      await spa
        .getByRole('link')
        .first()
        .evaluate((element) => getComputedStyle(element).fontSize),
    ).toBe('30px');
    expect(
      await spa
        .locator('li')
        .first()
        .evaluate((element) => element.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(42);
    await spa.getByRole('link').first().focus();
    await expect(spa.getByRole('link').first()).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    // Wait for the playground's theme transition before measuring final contrast.
    await expect
      .poll(() =>
        page
          .locator('.tab-btn.active')
          .first()
          .evaluate((element) => getComputedStyle(element).backgroundColor),
      )
      .toBe(theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(255, 255, 255)');
    await expectAccessible(page, testInfo);
  });
}

test('all locales update the mounted public default and application names', async ({page}) => {
  for (const [locale, label, name] of [
    ['zh-CN', '简体中文', '面包屑导航'],
    ['zh-TW', '繁體中文', '麵包屑導覽'],
    ['de', 'Deutsch', 'Brotkrümelnavigation'],
    ['es', 'Español', 'Migas de pan'],
    ['fr', 'Français', 'Fil d’Ariane'],
    ['ja', '日本語', 'パンくずリスト'],
    ['ko', '한국어', '탐색 경로'],
    ['nl', 'Nederlands', 'Broodkruimelnavigatie'],
    ['pt-BR', 'Português', 'Navegação estrutural'],
    ['ru', 'Русский', 'Навигационная цепочка'],
    ['en', 'English', 'Breadcrumb'],
  ]) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: label, exact: true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByTestId('singleton-trail').getByRole('navigation')).toHaveAccessibleName(name);
    await expect(page.locator('main')).not.toContainText('!! Key');
    await expect(page.getByTestId('spa-trail').locator('[aria-current]')).toHaveText('API server 42');
  }
});

test('HTTP failure shows localized recovery while route ancestors stay usable', async ({page}) => {
  await page.route('**/breadcrumb-server.json', (request) => request.fulfill({status: 503, body: ''}));
  await page.reload();
  await expect(page.getByRole('alert')).toHaveText('Could not load the server. Reload the page to retry.');
  await expect(page.getByTestId('spa-trail').getByRole('link', {name: 'Database', exact: true})).toBeVisible();
});
