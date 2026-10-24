import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

const route = '/clr-lift/components/breadcrumb-preview';
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto(route);
});

test('renders both trails and preserves ordinary versus SPA navigation ownership', async ({page}) => {
  const database = page.getByRole('navigation', {name: 'Database', exact: true});
  const buckets = page.getByRole('navigation', {name: 'Buckets', exact: true});
  await expect(database).toContainText('Sql server 1');
  await expect(database.getByRole('link', {name: 'Sql servers', exact: true})).toHaveAttribute(
    'href',
    `${route}?level=1`,
  );
  await expect(buckets.locator('[aria-current="page"]')).toHaveText('object-4');
  await page.evaluate(() => {
    (window as unknown as Record<string, unknown>)['previewDocument'] = 'same';
  });
  await buckets.getByRole('link', {name: 'folder-nested-2', exact: true}).click();
  await expect(buckets.locator('[aria-current="page"]')).toHaveText('folder-nested-2');
  expect(await page.evaluate(() => (window as unknown as Record<string, unknown>)['previewDocument'])).toBe('same');
  await page.goBack();
  await expect(buckets.locator('[aria-current="page"]')).toHaveText('object-4');
  await database.getByRole('link', {name: 'Sql servers', exact: true}).click();
  await expect(database.locator('[aria-current="page"]')).toHaveText('Sql servers');
  expect(await page.evaluate(() => (window as unknown as Record<string, unknown>)['previewDocument'])).toBeUndefined();
});

for (const name of ['Database', 'Buckets']) {
  test(`${name} anchors open tabs with modified and middle clicks`, async ({page, context, browserName}) => {
    // A plain-anchor reproduction confirms the headless WebKit tab-creation limitation.
    test.skip(
      browserName === 'webkit',
      'Headless WebKit does not open new tabs for modifier/middle clicks, reproduced with a plain standalone anchor.',
    );
    const link = page.getByRole('navigation', {name, exact: true}).getByRole('link').first();
    const href = await link.getAttribute('href');
    for (const mode of ['modified', 'middle']) {
      const opened = context.waitForEvent('page');
      await link.click(
        mode === 'middle' ? {button: 'middle'} : {modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control']},
      );
      const tab = await opened;
      await tab.waitForURL(`**${href}`);
      await tab.close();
      await expect(page).toHaveURL(route);
    }
  });
  test(`${name} anchors preserve native context-menu and modified activation events`, async ({page}) => {
    const link = page.getByRole('navigation', {name, exact: true}).getByRole('link').first();
    expect(
      await link.evaluate((element) => {
        return [
          new MouseEvent('click', {bubbles: true, cancelable: true, ctrlKey: true}),
          new MouseEvent('click', {bubbles: true, cancelable: true, metaKey: true}),
          new MouseEvent('auxclick', {bubbles: true, cancelable: true, button: 1}),
        ].map((event) => {
          let preventedByApplication = true;
          element.ownerDocument.addEventListener(
            event.type,
            (observed) => {
              preventedByApplication = observed.defaultPrevented;
              // Observe app handlers, then suppress synthetic native navigation in this assertion.
              observed.preventDefault();
            },
            {once: true},
          );
          element.dispatchEvent(event);
          return preventedByApplication;
        });
      }),
    ).toEqual([false, false, false]);
    await link.evaluate((element) => {
      element.addEventListener(
        'contextmenu',
        (event) => {
          queueMicrotask(() => element.setAttribute('data-context-prevented', String(event.defaultPrevented)));
        },
        {once: true},
      );
    });
    await link.click({button: 'right'});
    await expect(link).toHaveAttribute('data-context-prevented', 'false');
  });
}

test('panel remains stationary, contains full text and supports keyboard entry, exit and dismissal', async ({page}) => {
  const nav = page.getByRole('navigation', {name: 'Buckets', exact: true});
  const trigger = nav.getByRole('button', {name: 'Show path details and ancestors'});
  const region = page.getByRole('region', {name: 'Path details and ancestors'});
  const content = page.getByTestId('stationary-content');
  await trigger.scrollIntoViewIfNeeded();
  const before = await content.boundingBox();
  await trigger.press('Enter');
  await expect(region.getByRole('link', {name: 'bucket-1', exact: true})).toBeFocused();
  await expect(region).toContainText('Buckets > bucket-1 > folder-1 > folder-nested-2 > object-4');
  expect(await content.boundingBox()).toEqual(before);
  await page.keyboard.press('Shift+Tab');
  await expect(trigger).toBeFocused();
  await expect(region).toBeHidden();
  await trigger.press('Space');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await trigger.click();
  await expect(region).toBeHidden();
  await trigger.click();
  await region.getByRole('button', {name: 'Close path details'}).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await region.getByRole('button', {name: 'Close path details'}).focus();
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', {name: 'folder-1', exact: true})).toBeFocused();
  await expect(region).toBeHidden();
  await trigger.click();
  await page.getByRole('slider', {name: 'Font size'}).click();
  await expect(region).toBeHidden();
  await expect(page.getByRole('slider', {name: 'Font size'})).toBeFocused();
  await trigger.click();
  await page.getByRole('heading', {name: 'Buckets · SPA links'}).click();
  await expect(region).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await region.getByRole('link', {name: 'bucket-1', exact: true}).click();
  await expect(region).toBeHidden();
  await expect(nav.locator('[aria-current="page"]')).toHaveText('bucket-1');
});

test('addressless controls emit without submitting a surrounding form', async ({page}) => {
  const nav = page.getByRole('navigation', {name: 'Addressless actions inside a form'});
  const action = nav.getByRole('button', {name: 'Buckets', exact: true});
  await expect(action).toHaveAttribute('type', 'button');
  await action.press('Space');
  await expect(page.getByText('Selected location: Buckets', {exact: true})).toBeVisible();
  await page.getByText('Inspect contract state', {exact: true}).click();
  await expect(page.getByTestId('preview-state')).toContainText('"formSubmissions": 0');
});

for (const theme of ['light', 'dark']) {
  test(`panel contains large text at narrow width and passes axe in ${theme} theme`, async ({page}, testInfo) => {
    await page.evaluate((value) => {
      document.body.setAttribute('cds-theme', value);
    }, theme);
    await page.setViewportSize({width: 390, height: 740});
    const nav = page.getByRole('navigation', {name: 'Buckets', exact: true});
    const slider = page.getByRole('slider', {name: 'Font size'});
    await slider.focus();
    await slider.press('End');
    const trigger = nav.getByRole('button', {name: 'Show path details and ancestors'});
    await trigger.click();
    const panel = page.getByRole('region', {name: 'Path details and ancestors'});
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((element) => getComputedStyle(element).fontSize)).toBe(
      await nav.evaluate((element) => getComputedStyle(element).fontSize),
    );
    // Change only this instance while its top-layer panel is open.
    await nav.evaluate((element) => element.parentElement?.style.setProperty('--cll-breadcrumb-font-size', '1.1rem'));
    await expect.poll(() => panel.evaluate((element) => getComputedStyle(element).fontSize)).toBe('22px');
    await expect(panel).toBeVisible();
    expect(
      await page
        .getByRole('navigation', {name: 'Database', exact: true})
        .evaluate((element) => getComputedStyle(element).fontSize),
    ).toBe('30px');
    const bounds = await panel.boundingBox();
    expect(bounds).not.toBeNull();
    const box = bounds ?? {x: -1, y: -1, width: 0, height: 0};
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(740);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await expectAccessible(page, testInfo);
  });
}

test('direct-linked raw keys and permitted-root fixtures retain distinct prefix/object destinations', async ({
  page,
}) => {
  await page.getByLabel('Exact-key fixture', {exact: true}).selectOption('3');
  await page.getByText('Inspect contract state', {exact: true}).click();
  const state = page.getByTestId('preview-state');
  await expect(state).toContainText('allowed/a/nested/object/');
  const nav = page.getByRole('navigation', {name: 'Buckets', exact: true});
  await expect(nav.getByRole('link', {name: 'allowed', exact: true})).toBeVisible();
  await expect(nav.getByRole('link', {name: 'bucket-1', exact: true})).toHaveCount(0);
  await expect(nav.locator('[aria-current="page"]')).toHaveText('(empty segment)');
  const href = await nav.getByRole('link', {name: 'object', exact: true}).getAttribute('href');
  expect(href).toContain('kind=prefix');
  expect(href).toContain('prefix=allowed%2Fa%2Fnested%2Fobject%2F');
  await page.goto(`${route}?fixture=2&kind=object&key=${encodeURIComponent('/a//%2F/雪/../object')}`);
  await page.getByText('Inspect contract state', {exact: true}).click();
  await expect(state).toContainText('/a//%2F/雪/../object');
});

test('all supported locales update mounted panel names and empty-segment labels', async ({page}) => {
  await page.getByLabel('Exact-key fixture', {exact: true}).selectOption('3');
  for (const [locale, label, title] of [
    ['zh-CN', '简体中文', '面包屑交互预览'],
    ['zh-TW', '繁體中文', '麵包屑互動預覽'],
    ['de', 'Deutsch', 'Breadcrumb-Interaktionsvorschau'],
    ['es', 'Español', 'Vista previa de navegación por migas de pan'],
    ['fr', 'Français', 'Aperçu interactif du fil d’Ariane'],
    ['ja', '日本語', 'パンくずリストの操作プレビュー'],
    ['ko', '한국어', '탐색 경로 상호작용 미리 보기'],
    ['nl', 'Nederlands', 'Interactief voorbeeld van broodkruimelnavigatie'],
    ['pt-BR', 'Português', 'Prévia interativa do caminho de navegação'],
    ['ru', 'Русский', 'Предварительный просмотр навигационной цепочки'],
  ]) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: label, exact: true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByRole('heading', {level: 1})).toHaveText(title);
    await expect(page.locator('main')).not.toContainText('!! Key');
    await expect(page.locator('main [aria-current="page"]').nth(1)).not.toHaveText('(empty segment)');
    const trigger = page.locator('app-breadcrumb-preview-trail').nth(1).getByRole('button');
    await expect(trigger).not.toHaveAccessibleName('Show path details and ancestors');
    await trigger.click();
    const region = page.getByRole('region');
    await expect(region).toBeVisible();
    await expect(region).not.toHaveAccessibleName('Path details and ancestors');
    await page.keyboard.press('Escape');
  }
});

for (const theme of ['light', 'dark']) {
  test(`feedback: opaque ancestor surface and compact breadcrumb controls in ${theme}`, async ({page}) => {
    await page.evaluate((value) => document.body.setAttribute('cds-theme', value), theme);
    const nav = page.getByRole('navigation', {name: 'Buckets', exact: true});
    const trigger = nav.getByRole('button', {name: 'Show path details and ancestors'});
    const metrics = await trigger.evaluate((element) => ({
      width: element.getBoundingClientRect().width,
      font: parseFloat(getComputedStyle(element).fontSize),
    }));
    expect(metrics.width).toBeLessThanOrEqual(metrics.font * 3);
    await page.getByRole('slider', {name: 'Font size'}).press('End');
    await trigger.click();
    const panel = page.getByRole('region', {name: 'Path details and ancestors'});
    const typography = await panel.locator('p').evaluate((element) => ({
      font: parseFloat(getComputedStyle(element).fontSize),
      line: parseFloat(getComputedStyle(element).lineHeight),
    }));
    expect(typography.line).toBeGreaterThanOrEqual(typography.font * 1.25);
    const background = await panel.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(background).not.toBe('rgba(0, 0, 0, 0)');
    await expect(panel).toBeVisible();
  });
}

test('feedback: Clarity range/select and ordinary-case action labels', async ({page}) => {
  await expect(page.getByRole('slider', {name: 'Font size'})).toHaveClass(/clr-range/);
  await expect(page.locator('clr-select-container select[clrSelect]')).toBeVisible();
  await page.goto(`${route}?fixture=2`);
  await expect(page.getByLabel('Exact-key fixture', {exact: true})).toHaveValue('2');
  const button = page
    .getByRole('navigation', {name: 'Addressless actions inside a form'})
    .getByRole('button', {name: 'Buckets', exact: true});
  expect(await button.evaluate((element) => getComputedStyle(element).textTransform)).toBe('none');
});

test('feedback: separators scale with text, dot-segment links stay literal, and Close keeps Clarity sizing', async ({
  page,
}) => {
  const nav = page.getByRole('navigation', {name: 'Database', exact: true});
  const measure = () =>
    nav
      .locator('.trail > li')
      .nth(1)
      .evaluate((item) => {
        const separator = item.querySelector('span')?.getBoundingClientRect();
        const link = item.querySelector('a')?.getBoundingClientRect();
        return {font: parseFloat(getComputedStyle(item).fontSize), gap: (link?.left ?? 0) - (separator?.right ?? 0)};
      });
  const small = await measure();
  await page.getByRole('slider', {name: 'Font size'}).press('End');
  const large = await measure();
  expect(large.gap / small.gap).toBeCloseTo(large.font / small.font, 1);
  await page.goto(`${route}?fixture=2`);
  const storage = page.getByRole('navigation', {name: 'Buckets', exact: true});
  await expect(storage.getByRole('link', {name: '..', exact: true})).toHaveAttribute('href', /prefix=.*%2F\.\.%2F/);
  const overflow = storage.getByRole('button', {name: 'Show path details and ancestors'});
  await expect(overflow).toHaveText('…');
  await page.getByRole('slider', {name: 'Font size'}).press('End');
  await overflow.click();
  const close = page.getByRole('region').getByRole('button', {name: 'Close path details'});
  expect(await close.evaluate((element) => getComputedStyle(element).fontSize)).toBe(
    await page
      .getByRole('button', {name: 'Reset', exact: true})
      .evaluate((element) => getComputedStyle(element).fontSize),
  );
});

test('review: the open ancestor panel stays inside the viewport after its trigger scrolls away', async ({page}) => {
  await page.setViewportSize({width: 600, height: 450});
  await page.goto(`${route}?fixture=2`);
  await page.getByRole('slider', {name: 'Font size'}).press('End');
  const trigger = page
    .getByRole('navigation', {name: 'Buckets', exact: true})
    .getByRole('button', {name: 'Show path details and ancestors'});
  await trigger.click();
  await page.locator('main').evaluate(
    (element) =>
      new Promise<void>((resolve) => {
        element.addEventListener('scroll', () => requestAnimationFrame(() => resolve()), {once: true});
        element.scrollTop = element.scrollHeight;
      }),
  );
  expect(await trigger.evaluate((element) => element.getBoundingClientRect().bottom)).toBeLessThan(0);
  const panel = page.getByRole('region', {name: 'Path details and ancestors'});
  const bounds = await panel.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {top: rect.top, bottom: rect.bottom};
  });
  expect(bounds.top).toBeGreaterThanOrEqual(8);
  expect(bounds.bottom).toBeLessThanOrEqual(442);
  const close = panel.getByRole('button', {name: 'Close path details'});
  await close.focus();
  await expect(close).toBeInViewport();
  await close.press('Enter');
  await expect(panel).toBeHidden();
});

test('review: explicit URL kinds override fixture defaults and keep object/prefix destinations distinct', async ({
  context,
}) => {
  const errors: string[] = [];
  const destinations = [
    {query: 'fixture=4&kind=object&key=object', current: 'object', kind: 'object', raw: 'object'},
    {query: 'fixture=4&kind=object&key=same%2F', current: '(empty segment)', kind: 'object', raw: 'same/'},
    {query: 'fixture=0&kind=prefix&prefix=prefix%2F', current: 'prefix', kind: 'prefix', raw: 'prefix/'},
    {query: 'fixture=4&kind=bucket', current: 'bucket-1', kind: 'bucket', raw: 'bucket-1'},
  ];
  // Independent documents exercise direct links without aborting another document's pending lazy imports.
  const pages = [];
  for (const destination of destinations) {
    const page = await context.newPage();
    pages.push(page);
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`${route}?${destination.query}`);
    await expect(
      page.getByRole('navigation', {name: 'Buckets', exact: true}).locator('[aria-current="page"]'),
    ).toHaveText(destination.current);
    await page.getByText('Inspect contract state', {exact: true}).click();
    const state = JSON.parse(await page.getByTestId('preview-state').innerText());
    expect(JSON.parse(state.helper.at(-1).id)[0]).toBe(destination.kind);
    expect(state.helper.at(-1).context).toBe(destination.raw);
  }
  await expect(
    pages[1].getByRole('navigation', {name: 'Buckets', exact: true}).getByRole('link', {name: 'same', exact: true}),
  ).toHaveAttribute('href', /kind=prefix/);
  expect(errors).toEqual([]);
});
