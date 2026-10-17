import {expect, test} from '@playwright/test';

const base = '/ngx-lift/query/';
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('clr-lift-lang')) localStorage.setItem('clr-lift-lang', 'en');
  });
});

for (const [route, testId] of [
  ['queryResource', 'query-starter'],
  ['mutateResource', 'mutation-starter'],
  ['queryResources', 'query-demo-dynamic'],
]) {
  test(`${route} shows code initially and visibly rotates its caret on repeated toggles`, async ({page}) => {
    await page.goto(base + route);
    const playground = page.getByTestId(testId).locator('app-demo-playground');
    const toggle = playground.locator('.toggle-btn');
    const icon = toggle.locator('clr-icon');
    const code = playground.locator('.playground-code-body');
    for (const expanded of [true, false, true, false, true]) {
      await expect(toggle).toHaveAttribute('aria-expanded', String(expanded));
      await expect(toggle).toHaveText(expanded ? 'Hide Code' : 'View Code');
      await expect(icon).toHaveAttribute('direction', expanded ? 'up' : 'down');
      // Clarity's direction input drives the actual rotation; dir only sets text direction.
      await expect(icon).toHaveCSS('transform', expanded ? 'matrix(1, 0, 0, 1, 0, 0)' : 'matrix(-1, 0, 0, -1, 0, 0)');
      if (expanded) await expect(code).toBeVisible();
      else await expect(code).toHaveCount(0);
      await toggle.click();
    }
  });
}

test('first read shows retained data on refresh failure and recovers without changing selection', async ({page}) => {
  await page.goto(base + 'queryResource');
  const starter = page.getByTestId('query-starter');
  const team = starter.getByTestId('starter-team');
  await expect(team).toContainText('Atlas');
  const order = await page
    .locator('[data-testid="query-starter"], #lifecycle, #comparison')
    .evaluateAll((nodes) => nodes.map((node) => node.id || node.getAttribute('data-testid')));
  expect(order).toEqual(['query-starter', 'lifecycle', 'comparison']);
  const fail = starter.getByRole('checkbox', {name: 'Simulate failure', exact: true});
  await fail.check();
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(team).toContainText('Atlas');
  await expect(starter.getByRole('alert')).toContainText('The read failed');
  await fail.uncheck();
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(starter.getByRole('alert')).toHaveCount(0);
  await expect(team).toContainText('Atlas');
  // A different, uncached ID has no data to retain on its initial failure.
  await fail.check();
  await starter.getByRole('button', {name: 'Team B', exact: true}).click();
  await expect(starter.getByRole('alert')).toBeVisible();
  await expect(team).toHaveCount(0);
  await fail.uncheck();
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(team).toContainText('Beacon');
  await expect(starter.locator('app-demo-playground app-code-block')).toContainText("from 'ngx-lift'");
  await starter.getByRole('button', {name: 'HTML', exact: true}).click();
  await expect(starter.locator('app-demo-playground app-code-block')).toContainText('teamQuery.isRefreshing()');
});

test('first save retains input after failure and supports repeated successful submission', async ({page}) => {
  await page.goto(base + 'mutateResource');
  const starter = page.getByTestId('mutation-starter');
  const input = starter.getByRole('textbox', {name: 'Name', exact: true});
  const save = starter.getByRole('button', {name: 'Save', exact: true});
  await expect(save).toBeDisabled();
  await input.fill('Atlas team');
  await save.click();
  await expect(save).toBeDisabled();
  await expect(starter.getByTestId('starter-saved')).toContainText('Atlas team');
  const fail = starter.getByRole('checkbox', {name: 'Simulate failure', exact: true});
  await fail.check();
  await input.fill('Beacon team');
  await save.click();
  await expect(starter.getByRole('alert')).toContainText('The save failed');
  await expect(input).toHaveValue('Beacon team');
  await expect(starter.getByTestId('starter-saved')).toHaveCount(0);
  await fail.uncheck();
  await save.click();
  await expect(starter.getByTestId('starter-saved')).toContainText('Beacon team');
  await expect(starter.getByRole('alert')).toHaveCount(0);
  await expect(starter.locator('app-demo-playground app-code-block')).toContainText(
    'await this.saveTeamMutation.mutate',
  );
});

test('guides are reachable from the sidebar and reference anchors reveal their target', async ({page}) => {
  await page.goto(base);
  await expect(page).toHaveURL(/overview$/);
  const nav = page.locator('app-vertical-nav');
  for (const name of [
    'Overview',
    'Cache freshness and refresh',
    'Keys and invalidation',
    'Organizing queries',
    'Choosing an async API',
    'API reference',
    'Query devtools',
  ]) {
    await nav.getByRole('link', {name, exact: true}).click();
    await expect(page.locator('h1')).toHaveText(name);
    await expect(page.getByTestId('query-guide')).not.toContainText('!! Key');
  }
  await nav.getByRole('link', {name: 'API reference', exact: true}).click();
  await page
    .getByTestId('query-guide')
    .getByRole('link', {name: 'Lifecycle States & Signal Matrix', exact: true})
    .click();
  await expect(page).toHaveURL(/queryResource#lifecycle$/);
  await expect
    .poll(() => page.locator('#lifecycle').evaluate((element) => element.getBoundingClientRect().top))
    .toBeLessThan(160);
});

test('query learning pages fit a narrow viewport with translated guidance', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto(base + 'overview');
  for (const route of [
    'overview',
    'queryResource',
    'mutateResource',
    'queryResources',
    'cache',
    'keys',
    'organization',
    'choosing',
    'reference',
  ]) {
    await page.goto(base + route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('cll-page-container')).not.toContainText('!! Key');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('query learning guides switch language across all supported dictionaries', async ({page}) => {
  test.setTimeout(120_000);
  await page.goto(base + 'overview');
  const titles: Record<string, string> = {
    en: 'Overview',
    'zh-CN': '概览',
    'zh-TW': '概覽',
    de: 'Überblick',
    es: 'Descripción general',
    fr: 'Vue d’ensemble',
    ja: '概要',
    ko: '개요',
    nl: 'Overzicht',
    'pt-BR': 'Visão geral',
    ru: 'Обзор',
  };
  for (const [locale, title] of Object.entries(titles)) {
    await page.evaluate((language) => localStorage.setItem('clr-lift-lang', language), locale);
    await page.reload();
    await expect(page.locator('h1')).toHaveText(title);
    for (const route of ['cache', 'keys', 'organization', 'choosing', 'reference', 'overview']) {
      await page.locator(`app-vertical-nav a[href="${base + route}"]`).click();
      await expect(page).toHaveURL(new RegExp(route + '$'));
      await expect(page.getByTestId('query-guide')).toHaveCount(1);
      await expect(page.getByTestId('query-guide')).not.toContainText('!! Key');
      await expect(page.locator('h1')).not.toContainText('queryDocs.');
    }
  }
});
