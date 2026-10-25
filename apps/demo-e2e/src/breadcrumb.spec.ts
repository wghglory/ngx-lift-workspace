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

test('public documentation exposes the complete API reference', async ({page}) => {
  await expect(page).toHaveURL(route);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('BreadcrumbComponent');
  await expect(page.getByRole('heading', {name: 'Examples', exact: true})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Breadcrumb interaction preview', exact: true})).toHaveCount(0);
  const reference = page.locator('#api-reference');
  await expect(reference.getByRole('heading', {name: 'API Reference', exact: true})).toBeVisible();
  await expect(reference.locator('app-api-table')).toHaveCount(5);
  for (const name of [
    'items',
    'ariaLabel',
    'maxVisible',
    'linkTemplate',
    'navigate',
    'id',
    'label',
    'href',
    'context',
    'bucket',
    'key',
    'kind',
    'rootPrefix',
    'emptySegmentLabel',
    'hrefFor',
    '--cll-breadcrumb-font-size',
  ]) {
    await expect(
      reference
        .locator('.prop-name')
        .filter({hasText: new RegExp('^' + name + '$')})
        .first(),
    ).toBeVisible();
  }
  await expect(reference.getByText('localized', {exact: true})).toHaveCount(0);
  await expect(reference.getByText('display trail + depth', {exact: true})).toHaveCount(0);
  await expect(reference.getByText('Clarity inline typography', {exact: true})).toHaveCount(0);
  await expect(reference.getByText('CSS length', {exact: true})).toHaveCount(0);
  await expect(
    reference.getByText('var(--clr-base-typography-font-size-inline, 0.65rem)', {exact: true}),
  ).toBeVisible();
  await expect(
    reference.getByText('Exact key; empty prefix means bucket root, other prefixes end in /, objects are nonempty.', {
      exact: true,
    }),
  ).toBeVisible();
  await page.setViewportSize({width: 390, height: 844});
  for (const [language, description] of [
    ['简体中文', '有序位置；最后一项为当前位置文本。'],
    ['繁體中文', '有序位置；最後一項為目前位置文字。'],
    ['Deutsch', 'Geordnete Orte; der letzte ist der aktuelle Text.'],
    ['Español', 'Ubicaciones ordenadas; la última es el texto actual.'],
    ['Français', 'Emplacements ordonnés ; le dernier est le texte courant.'],
    ['日本語', '順序付きの場所。最後の項目は現在地のテキストです。'],
    ['한국어', '순서가 있는 위치 목록. 마지막 항목은 현재 위치 텍스트입니다.'],
    ['Nederlands', 'Geordende locaties; de laatste is de huidige tekst.'],
    ['Português', 'Locais ordenados; o último é o texto atual.'],
    ['Русский', 'Упорядоченные места; последнее — текст текущего места.'],
    ['English', 'Ordered locations; the last is current text.'],
  ]) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: language, exact: true}).click();
    await expect(reference.locator('.prop-description').first()).toHaveText(description);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    ).toBeLessThanOrEqual(1);
  }
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
    await page.getByRole('slider', {name: 'Font size'}).first().press('End');
    await expect.poll(() => spa.evaluate((element) => getComputedStyle(element).fontSize)).toBe('30px');
    expect(await native.evaluate((element) => getComputedStyle(element).fontSize)).toBe('30px');
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

test('page font control updates inherited and per-instance breadcrumb sizes and resets', async ({page}) => {
  const initialSize = await page.getByTestId('native-trail').evaluate((element) => getComputedStyle(element).fontSize);
  await page.getByRole('slider', {name: 'Font size'}).first().press('End');
  for (const id of ['native-trail', 'spa-trail', 'storage-trail', 'action-trail']) {
    await expect
      .poll(() => page.getByTestId(id).evaluate((element) => getComputedStyle(element).fontSize))
      .toBe('30px');
  }
  await page.getByRole('button', {name: 'Reset', exact: true}).first().click();
  await expect
    .poll(() => page.getByTestId('native-trail').evaluate((element) => getComputedStyle(element).fontSize))
    .toBe(initialSize);
});
