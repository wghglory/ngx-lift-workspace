import {expect, Page, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

const route = '/clr-lift/components/breadcrumb';
function destination(key: string, kind = 'object', rootPrefix?: string): string {
  const params = new URLSearchParams({bucket: 'bucket-1', storeKind: kind, storeKey: key});
  if (rootPrefix !== undefined) params.set('rootPrefix', rootPrefix);
  return `${route}?${params}`;
}
async function open(page: Page, url = route) {
  await page.goto(url);
  await expect(page.getByTestId('storage-browser')).toBeVisible();
}
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.route('**/breadcrumb-server.json', (request) => request.fulfill({json: {id: 'sql-1', name: 'Server'}}));
});

test('navigates bucket listing, prefixes and objects from fixture responses, then resets', async ({page}) => {
  await open(page, `${route}?storeKind=buckets`);
  const browser = page.getByTestId('storage-browser');
  await browser.getByTestId('bucket-list').getByRole('link', {name: 'bucket-1', exact: true}).click();
  await expect(browser.locator('[aria-current]')).toHaveText('bucket-1');
  await browser.getByTestId('storage-children').getByRole('link', {name: '"folder-1/"', exact: true}).click();
  await expect(browser.locator('[aria-current]')).toHaveText('folder-1');
  await browser.getByTestId('storage-children').getByRole('link', {name: '"folder-1/readme.txt"', exact: true}).click();
  await expect(browser.locator('[aria-current]')).toHaveText('readme.txt');
  await expect(browser.getByTestId('storage-object')).toContainText('120');
  await page.goBack();
  await expect(browser.locator('[aria-current]')).toHaveText('folder-1');
  await browser.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(browser.locator('[aria-current]')).toHaveText('bucket-1');
  await browser.getByRole('link', {name: 'Buckets', exact: true}).first().click();
  await browser.getByTestId('bucket-list').getByRole('link', {name: 'empty-bucket'}).click();
  await expect(browser.getByRole('status')).toHaveText('This prefix has no children.');
});

for (const key of ['same/same/object', '/a//%2F/雪/../object', 'marker/']) {
  test(`direct link retains exact key and generated identity: ${key}`, async ({page}) => {
    await open(page, destination(key));
    const browser = page.getByTestId('storage-browser');
    await browser.getByText('Route, API response and generated items', {exact: true}).click();
    await expect(browser.getByTestId('storage-state')).toContainText(JSON.stringify(key));
    await expect(browser.getByTestId('storage-object')).toContainText(JSON.stringify(key));
    await expect(browser.locator('[aria-current]')).toHaveText(key.endsWith('/') ? '(empty segment)' : 'object');
    const currentPrefix = browser.getByTestId('storage-trail').getByRole('link').last();
    const context = key.slice(0, key.lastIndexOf('/') + 1);
    const href = await currentPrefix.getAttribute('href');
    expect(new URL(href!, 'http://localhost').searchParams.get('storeKey')).toBe(context);
    expect(new URL(href!, 'http://localhost').searchParams.get('storeKind')).toBe('prefix');
    await page.evaluate(() => {
      document.body.dataset['sameDocument'] = 'yes';
    });
    await currentPrefix.click();
    await expect(page.locator('body')).toHaveAttribute('data-same-document', 'yes');
    await expect(browser.getByTestId('storage-children')).toBeVisible();
    await expect(browser.getByTestId('storage-state')).toContainText('"kind": "prefix"');
  });
}

test('restricted direct link omits every higher destination; invalid scope recovers', async ({page}) => {
  await open(page, destination('folder-1/folder-nested-2/object-4', 'object', 'folder-1/'));
  const browser = page.getByTestId('storage-browser');
  const trail = browser.getByTestId('storage-trail');
  await expect(trail.getByRole('link', {name: 'bucket-1', exact: true})).toHaveCount(0);
  await expect(browser.getByRole('link', {name: 'Buckets', exact: true})).toHaveCount(0);
  await expect(trail.getByRole('link', {name: 'folder-1', exact: true})).toBeVisible();
  await trail.getByRole('link', {name: 'folder-1', exact: true}).click();
  await expect(trail.locator('[aria-current]')).toHaveText('folder-1');
  await expect(trail.getByRole('link')).toHaveCount(0);
  await open(page, destination('other/object', 'object', 'folder-1/'));
  await expect(browser.getByRole('alert')).toHaveText(
    'The route kind, key or permitted root is invalid. Reset to recover.',
  );
  await expect(browser.getByTestId('storage-trail')).toHaveCount(0);
  await browser.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(browser.locator('[aria-current]')).toHaveText('bucket-1');
});

test('generated anchors retain modified-click and context-menu semantics', async ({page}) => {
  await open(page, destination('marker/'));
  const link = page.getByTestId('storage-trail').getByRole('link', {name: 'marker', exact: true});
  expect(
    await link.evaluate((element) =>
      ['click', 'auxclick', 'contextmenu'].map((type) => {
        const event = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          ctrlKey: true,
          button: type === 'auxclick' ? 1 : 0,
        });
        let prevented = true;
        document.addEventListener(
          type,
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
  ).toEqual([false, false, false]);
});

for (const theme of ['light', 'dark']) {
  test(`storage example is accessible and contains long exact keys at narrow width in ${theme}`, async ({
    page,
  }, testInfo) => {
    await open(page, destination('marker/'));
    await page.evaluate((value) => document.body.setAttribute('cds-theme', value), theme);
    await page.setViewportSize({width: 390, height: 800});
    await expect
      .poll(() =>
        page
          .locator('.tab-btn.active')
          .first()
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      .toBe(theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(255, 255, 255)');
    await page.getByTestId('storage-trail').getByRole('link').first().focus();
    await expect(page.getByTestId('storage-trail').getByRole('link').first()).toBeFocused();
    await expectAccessible(page, testInfo);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
}

test('storage prose and empty segment names switch in every locale without changing the exact key', async ({page}) => {
  await open(page, destination('marker/'));
  const browser = page.getByTestId('storage-browser');
  for (const [locale, language, title, empty] of [
    ['zh-CN', '简体中文', '存储桶与对象浏览器', '（空段）'],
    ['zh-TW', '繁體中文', '儲存桶與物件瀏覽器', '（空區段）'],
    ['de', 'Deutsch', 'Bucket- und Objektbrowser', '(leeres Segment)'],
    ['es', 'Español', 'Explorador de buckets y objetos', '(segmento vacío)'],
    ['fr', 'Français', 'Explorateur de buckets et d’objets', '(segment vide)'],
    ['ja', '日本語', 'バケットとオブジェクトのブラウザー', '（空のセグメント）'],
    ['ko', '한국어', '버킷 및 객체 탐색기', '(빈 세그먼트)'],
    ['nl', 'Nederlands', 'Bucket- en objectbrowser', '(leeg segment)'],
    ['pt-BR', 'Português', 'Navegador de buckets e objetos', '(segmento vazio)'],
    ['ru', 'Русский', 'Обозреватель бакетов и объектов', '(пустой сегмент)'],
    ['en', 'English', 'Bucket and object browser', '(empty segment)'],
  ]) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: language, exact: true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(browser.getByRole('navigation')).toHaveAccessibleName(title);
    await expect(browser.locator('[aria-current]')).toHaveText(empty);
    await expect(browser.getByTestId('storage-object')).toContainText('"marker/"');
    await expect(browser).not.toContainText('!! Key');
  }
});
