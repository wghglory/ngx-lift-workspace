import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

const route = '/clr-lift/components/breadcrumb';
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto(route);
});

test('100 supplied locations filter locally, recover empty results and keep exact native destinations', async ({
  page,
}, info) => {
  const host = page.getByTestId('search-trail');
  const trigger = host.getByRole('button', {name: 'Show path details and ancestors'});
  await host.evaluate((element) => {
    const form = document.createElement('form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.dataset['submitted'] = 'true';
    });
    element.replaceWith(form);
    form.append(element);
  });
  await trigger.click();
  const panel = host.getByRole('region');
  const filter = panel.getByRole('searchbox', {name: 'Filter ancestors'});
  await expect(filter).toBeFocused();
  await expect(panel.getByRole('link')).toHaveCount(99);
  await expect(panel.getByRole('status')).toBeEmpty();
  const summary = await panel.locator('.full-path').textContent();
  const requests: string[] = [];
  page.on('request', (request) => {
    if (['fetch', 'xhr'].includes(request.resourceType())) requests.push(request.url());
  });
  await filter.fill('  level 38  ');
  await expect(panel.getByRole('link')).toHaveCount(1);
  await expect(panel.getByRole('link')).toHaveAttribute('href', route + '?ancestor=37&key=%2F%25');
  await expect(panel.getByRole('status')).toHaveText('Matching ancestors: 1');
  await filter.press('Enter');
  await expect(host.locator('..')).not.toHaveAttribute('data-submitted', 'true');
  await expect(panel.locator('.full-path')).toHaveText(summary ?? '');
  await expect(panel.locator('.current')).toBeVisible();
  await expect(panel.locator('small').first()).toContainText('node-36/node-37 · Level 38');
  await filter.fill('no-such-ancestor');
  await expect(panel.getByText('No matching ancestors', {exact: true})).toBeVisible();
  await expect(panel.getByRole('link')).toHaveCount(0);
  await expect(panel.locator('.current')).toBeVisible();
  await expectAccessible(page, info);
  await panel.getByRole('button', {name: 'Clear filter'}).click();
  await expect(filter).toBeFocused();
  await expect(filter).toHaveValue('');
  await expect(panel.getByRole('link')).toHaveCount(99);
  await filter.fill('Level 38');
  expect(
    await panel.getByRole('link').evaluate((element) => {
      let prevented = true;
      document.addEventListener(
        'click',
        (event) => {
          prevented = event.defaultPrevented;
          event.preventDefault();
        },
        {once: true},
      );
      element.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, ctrlKey: true}));
      return prevented;
    }),
  ).toBe(false);
  await expect(panel.getByRole('link')).toHaveAttribute('href', route + '?ancestor=37&key=%2F%25');
  expect(new URL(page.url()).pathname).toBe(route);
  expect(new URL(page.url()).search).toBe('');
  expect(requests).toEqual([]);
  await filter.press('Shift+Tab');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await expect(filter).toHaveValue('');
  await filter.fill('Level 38');
  await panel.getByRole('link').click();
  await expect(page).toHaveURL(/ancestor=37&key=%2F%25/);
});

test('replaces stale state and switches all supported dictionaries in the 100-level playground', async ({page}) => {
  test.setTimeout(60000);
  const host = page.getByTestId('search-trail');
  const trigger = host.locator('.overflow > button');
  const playground = host.locator('..');
  await trigger.click();
  await host.getByRole('searchbox').fill('absent');
  await playground.getByRole('button', {name: 'Replace path'}).click();
  await expect(host.getByRole('region')).toBeHidden();
  await expect(playground.getByRole('button', {name: 'Replace path'})).toBeFocused();
  await playground.getByRole('button', {name: 'Replace path'}).click();
  await trigger.click();
  await expect(host.getByRole('searchbox')).toHaveValue('');
  for (const [label, filterName, clearName] of [
    ['简体中文', '筛选祖先', '清除筛选'],
    ['繁體中文', '篩選祖先', '清除篩選'],
    ['Deutsch', 'Vorfahren filtern', 'Filter löschen'],
    ['Español', 'Filtrar antecesores', 'Borrar filtro'],
    ['Français', 'Filtrer les ancêtres', 'Effacer le filtre'],
    ['日本語', '祖先を絞り込む', '絞り込みをクリア'],
    ['한국어', '상위 경로 필터링', '필터 지우기'],
    ['Nederlands', 'Bovenliggende locaties filteren', 'Filter wissen'],
    ['Português', 'Filtrar ancestrais', 'Limpar filtro'],
    ['Русский', 'Фильтр предков', 'Очистить фильтр'],
    ['English', 'Filter ancestors', 'Clear filter'],
  ]) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: label, exact: true}).click();
    await trigger.click();
    await expect(host.getByRole('searchbox', {name: filterName, exact: true})).toBeFocused();
    await host.getByRole('searchbox').fill('node-98');
    await expect(host.getByRole('region').getByRole('link')).toHaveCount(1);
    await expect(host.getByRole('button', {name: clearName, exact: true})).toBeVisible();
    await host.getByRole('searchbox').press('Escape');
    await expect(trigger).toBeFocused();
  }
});

for (const theme of ['light', 'dark']) {
  test(`100-level RTL compact enlarged text and touch in ${theme}`, async ({page, browserName}, info) => {
    await page.evaluate((value) => document.body.setAttribute('cds-theme', value), theme);
    await expect
      .poll(() =>
        page
          .locator('.tab-btn.active')
          .first()
          .evaluate((element) => getComputedStyle(element).backgroundColor),
      )
      .toBe(theme === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(255, 255, 255)');
    await page.setViewportSize({width: 390, height: 800});
    const host = page.getByTestId('search-trail');
    await host.evaluate((element) => {
      document.documentElement.dir = 'rtl';
      document.body.setAttribute('clr-density', 'compact');
      (element as HTMLElement).style.setProperty('--cll-breadcrumb-font-size', '1.8rem');
    });
    const trigger = host.locator('.overflow > button');
    await trigger.scrollIntoViewIfNeeded();
    const started = await page.evaluate(() => performance.now());
    await trigger.dispatchEvent('pointerdown', {pointerType: 'touch'});
    await trigger.click();
    const panel = host.getByRole('region');
    const filter = panel.getByRole('searchbox');
    await expect(filter).toBeFocused();
    const opened = await page.evaluate(() => performance.now());
    await filter.fill('Level 38');
    await expect(panel.getByRole('link')).toHaveCount(1);
    const filtered = await page.evaluate(() => performance.now());
    await page.setViewportSize({width: 430, height: 800});
    await expect(filter).toBeFocused();
    await expect(panel.getByRole('link')).toBeVisible();
    const measured = await host.evaluate((element) => {
      const panel = element.querySelector('[popover]');
      if (!panel) throw new Error('Expected panel');
      const rect = panel.getBoundingClientRect();
      return {
        renderedElements: element.querySelectorAll('*').length,
        panelRows: panel.querySelectorAll('li').length,
        x: rect.x,
        right: rect.right,
        bottom: rect.bottom,
        width: panel.clientWidth,
        scrollWidth: panel.scrollWidth,
      };
    });
    expect(measured.x).toBeGreaterThanOrEqual(0);
    expect(measured.right).toBeLessThanOrEqual(430);
    expect(measured.bottom).toBeLessThanOrEqual(800);
    expect(measured.scrollWidth).toBeLessThanOrEqual(measured.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(430);
    await info.attach('100-level-measurements', {
      body: JSON.stringify({
        browserName,
        openMs: opened - started,
        filterMs: filtered - opened,
        resizeMs: (await page.evaluate(() => performance.now())) - filtered,
        ...measured,
      }),
      contentType: 'application/json',
    });
    // The nonmodal popover can cover other playgrounds; scan this open component explicitly.
    // Existing breadcrumb journeys retain whole-document scans.
    await expectAccessible(page, info, '[data-testid="search-trail"]');
    await panel.getByRole('button', {name: 'Close path details'}).click();
    await expect(trigger).toBeFocused();
  });
}

test('records browser render cycles and DOM for 100 supplied locations', async ({page}, info) => {
  const host = page.getByTestId('search-trail');
  await host.scrollIntoViewIfNeeded();
  const samples = await host.evaluate(async (element) => {
    const nextRender = () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const trigger = element.querySelector<HTMLButtonElement>('.overflow > button');
    const panel = element.querySelector<HTMLElement>('[popover]');
    const input = element.querySelector<HTMLInputElement>('input');
    if (!trigger || !panel || !input) throw new Error('Expected supplied-item filter host');
    await nextRender();
    const samples = [];
    for (let cycle = 0; cycle < 5; cycle++) {
      const start = performance.now();
      trigger.click();
      await nextRender();
      const opened = performance.now();
      const unfilteredElements = element.querySelectorAll('*').length;
      const unfilteredRows = panel.querySelectorAll('li').length;
      input.value = 'Level 38';
      input.dispatchEvent(new Event('input', {bubbles: true}));
      await nextRender();
      const filtered = performance.now();
      const filteredRows = panel.querySelectorAll('li').length;
      (element as HTMLElement).style.inlineSize = '140px';
      await nextRender();
      const resized = performance.now();
      const resizeFocusValid = document.activeElement === trigger || document.activeElement === input;
      if (panel.matches(':popover-open')) trigger.click();
      (element as HTMLElement).style.inlineSize = '640px';
      await nextRender();
      samples.push({
        openMs: opened - start,
        filterMs: filtered - opened,
        resizeMs: resized - filtered,
        unfilteredElements,
        unfilteredRows,
        filteredRows,
        resizeFocusValid,
      });
    }
    return samples;
  });
  for (const sample of samples) {
    expect(sample.unfilteredRows).toBe(100);
    expect(sample.filteredRows).toBe(2);
    expect(sample.resizeFocusValid).toBe(true);
  }
  await info.attach('render-cycle-measurements', {
    body: JSON.stringify({
      observation: 'Each operation includes two animation frames; five samples, no CPU-only timing claim.',
      samples,
    }),
    contentType: 'application/json',
  });
});

test.describe('touch interaction', () => {
  test.use({hasTouch: true});
  test('touch opens, clears empty results and closes the ancestor filter', async ({page}) => {
    const host = page.getByTestId('search-trail');
    const trigger = host.locator('.overflow > button');
    await trigger.tap();
    const filter = host.getByRole('searchbox');
    await expect(filter).toBeFocused();
    await filter.fill('absent');
    await expect(host.getByRole('region').getByRole('link')).toHaveCount(0);
    await host.getByRole('button', {name: 'Clear filter'}).tap();
    await expect(filter).toHaveValue('');
    await expect(host.getByRole('region').getByRole('link')).toHaveCount(99);
    await host.getByRole('button', {name: 'Close path details'}).tap();
    await expect(trigger).toBeFocused();
    await expect(host.getByRole('region')).toBeHidden();
  });
});

test('forward Tab traverses filtered results and empty recovery before leaving normally', async ({
  page,
  browserName,
}) => {
  const host = page.getByTestId('search-trail');
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  const trigger = host.locator('.overflow > button');
  await trigger.click();
  const panel = host.getByRole('region');
  const input = panel.getByRole('searchbox');
  await input.fill('Level 38');
  await input.press(tab);
  await expect(panel.getByRole('button', {name: 'Clear filter'})).toBeFocused();
  await page.keyboard.press(tab);
  await expect(panel.getByRole('link')).toBeFocused();
  await page.keyboard.press(tab);
  await expect(panel.getByRole('button', {name: 'Close path details'})).toBeFocused();
  await page.keyboard.press(tab);
  await expect(host.locator('.trail > li:not(.overflow) a').nth(1)).toBeFocused();
  await expect(panel).toBeHidden();
  await trigger.click();
  await input.fill('absent');
  await expect(panel.getByRole('link')).toHaveCount(0);
  await input.press(tab);
  await expect(panel.getByRole('button', {name: 'Clear filter'})).toBeFocused();
  await page.keyboard.press(tab);
  await expect(panel.getByRole('button', {name: 'Close path details'})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
