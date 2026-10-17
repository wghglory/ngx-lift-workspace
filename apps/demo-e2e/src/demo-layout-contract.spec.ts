import {expect, test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import ts from 'typescript';

function box(value: {x: number; y: number; width: number; height: number} | null) {
  if (!value) throw new Error('Expected a rendered element');
  return value;
}

function demoRoutes(): string[] {
  const file = resolve(__dirname, '../../demo/src/app/app.routes.ts');
  const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const routes: string[] = [];
  function property(node: ts.ObjectLiteralExpression, name: string): ts.Expression | undefined {
    const property = node.properties.find((item) => ts.isPropertyAssignment(item) && item.name.getText(ast) === name);
    return property && ts.isPropertyAssignment(property) ? property.initializer : undefined;
  }
  function walk(node: ts.Expression, prefix = ''): void {
    if (ts.isArrayLiteralExpression(node)) {
      node.elements.forEach((child) => walk(child, prefix));
      return;
    }
    if (!ts.isObjectLiteralExpression(node)) return;
    const path = property(node, 'path');
    if (!path || !ts.isStringLiteral(path) || path.text === '**') return;
    const full = [prefix, path.text].filter(Boolean).join('/').replace(':id', '42');
    if (property(node, 'loadComponent')) routes.push(`/${full}`);
    const children = property(node, 'children');
    if (children) walk(children, full);
  }
  for (const statement of ast.statements)
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (declaration.name.getText(ast) === 'routes' && declaration.initializer) walk(declaration.initializer);
      }
    }
  return routes;
}

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('clr-lift-lang')) localStorage.setItem('clr-lift-lang', 'en');
  });
  await page.goto('/ngx-lift/query/queryResource');
});

test('application query devtools opens the shared client and stays available across routes', async ({page}) => {
  const launcher = page.locator('cll-query-devtools-root').getByRole('button', {name: 'Query devtools', exact: true});
  await expect(launcher).toHaveCount(1);
  await expect(launcher).toBeInViewport();
  await launcher.click();
  const dialog = page.getByRole('region', {name: 'Query devtools', exact: true});
  await expect(dialog.locator('clr-dg-row').filter({hasText: '["current-user"]'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(launcher).toBeFocused();
  await page.locator('.header-nav').getByRole('link', {name: 'clr-lift', exact: true}).click();
  await expect(launcher).toBeVisible();
  await launcher.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
});

test('comparison tables and tab panels have visible vertical separation', async ({page}) => {
  const section = page.getByTestId('query-placement-architecture');
  const table = box(await section.locator('.query-table').boundingBox());
  const tabs = box(await section.getByRole('tablist').boundingBox());
  expect(tabs.y - (table.y + table.height)).toBeGreaterThanOrEqual(12);
});

test('component placement renders the project and refresh action shown in its code', async ({page}) => {
  await page.locator('#tab-component-placement').click();
  const panel = page.locator('#tab-content-component-placement');
  await expect(panel.locator('.playground-canvas').getByRole('heading', {name: 'Website redesign'})).toBeVisible();
  const refresh = panel.locator('.playground-canvas').getByRole('button', {name: 'Refresh', exact: true});
  const revision = panel.getByTestId('project-revision');
  const previous = await revision.innerText();
  await refresh.click();
  await expect(panel.locator('.playground-canvas').getByRole('heading', {name: 'Website redesign'})).toBeVisible();
  await expect(revision).not.toHaveText(previous);
});

test('profile actions use concise labels and update both consumers', async ({page}) => {
  const panel = page.locator('#tab-content-service-pattern-a');
  const update = panel.getByRole('button', {name: 'Update name', exact: true});
  await expect(update).toBeVisible();
  await update.click();
  await expect(panel.locator('.playground-canvas strong')).toHaveText('Jordan Lee');
  await expect(panel.locator('.playground-canvas p code')).toHaveText('Jordan Lee');
  await panel.getByRole('button', {name: 'HTML', exact: true}).click();
  await expect(panel.locator('app-code-block')).toContainText('(click)="authStateService.updateName()"');
});

test('focus-refetch guidance has space above it', async ({page}) => {
  const note = page.getByTestId('focus-refetch-note');
  await expect(note).toBeVisible();
  const gap = await note.evaluate((element) => {
    const previous = element.previousElementSibling;
    if (!previous) throw new Error('Missing content before focus guidance');
    return element.getBoundingClientRect().top - previous.getBoundingClientRect().bottom;
  });
  expect(gap).toBeGreaterThanOrEqual(12);
});

test('diagnostics panel is nonmodal, restores focus and supports narrow screens', async ({page}, testInfo) => {
  await page.setViewportSize({width: 390, height: 844});
  const section = page.getByTestId('query-diagnostics');
  await expect(page.getByTestId('query-demo-coalesce').locator('.label-success')).toHaveCount(2);
  const trigger = section.locator('.playground-canvas').getByRole('button', {name: 'Query devtools', exact: true});
  for (let attempt = 0; attempt < 2; attempt++) {
    await trigger.click();
    const dialog = page.getByRole('region', {name: 'Query devtools', exact: true});
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('columnheader', {name: 'Query key'})).toBeVisible();
    const keyColumn = box(await dialog.getByRole('columnheader', {name: 'Query key'}).boundingBox());
    expect(keyColumn.width).toBeGreaterThanOrEqual(240);
    await expect(page.locator('.modal-backdrop')).toHaveCount(0);
    await expect(dialog.getByRole('searchbox')).toBeFocused();
    await page.locator('.header-nav').getByRole('link', {name: 'ngx-lift', exact: true}).focus();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('searchbox').focus();
    const bounds = box(await dialog.boundingBox());
    expect(bounds.x).toBe(0);
    expect(bounds.width).toBe(390);
    await expect
      .poll(async () => {
        const bounds = box(await dialog.boundingBox());
        return Math.abs(bounds.y + bounds.height - 844);
      })
      .toBeLessThan(1);
    await dialog.screenshot({path: testInfo.outputPath(`query-diagnostics-narrow-${attempt}.png`)});
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
});

test('diagnostics panel follows dark theme and RTL layout', async ({page}, testInfo) => {
  await page.getByRole('button', {name: 'Toggle to dark theme', exact: true}).click();
  await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
  await page
    .getByTestId('query-diagnostics')
    .locator('.playground-canvas')
    .getByRole('button', {name: 'Query devtools', exact: true})
    .click();
  const dialog = page.getByRole('region', {name: 'Query devtools', exact: true});
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((element) => getComputedStyle(element).direction)).toBe('rtl');
  expect(
    await dialog
      .locator('clr-dg-cell code')
      .first()
      .evaluate((element) => getComputedStyle(element).direction),
  ).toBe('ltr');
  const background = await dialog.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).toMatch(/^rgb\(/);
  const channels = background.slice(4, -1).split(',').map(Number);
  expect(channels).toHaveLength(3);
  expect(Math.max(...channels)).toBeLessThan(128);
  await dialog.screenshot({path: testInfo.outputPath('query-diagnostics-dark-rtl.png')});
  await dialog.getByRole('button', {name: 'Close', exact: true}).click();
  await expect(dialog).toBeHidden();
});

test('diagnostics datagrid filters and sorts without refetching application data', async ({page}) => {
  const metrics = page.getByTestId('query-demo-coalesce');
  await expect(metrics.locator('.label-success')).toHaveCount(2);
  const requests = metrics.locator('.badge').filter({hasText: /^Actual HTTP Calls:/});
  const initialRequests = await requests.innerText();
  await page
    .getByTestId('query-diagnostics')
    .locator('.playground-canvas')
    .getByRole('button', {name: 'Query devtools', exact: true})
    .click();
  const dialog = page.getByRole('region', {name: 'Query devtools', exact: true});
  const rows = dialog.locator('clr-dg-row');
  const keyColumn = dialog.getByRole('columnheader', {name: 'Query key'});
  await keyColumn.locator('.datagrid-filter-toggle').click();
  const filter = page.locator('.datagrid-filter:visible');
  await filter.getByRole('textbox').fill('no-such-query');
  await expect(rows).toHaveCount(0);
  await expect(dialog).toContainText('No matching queries.');
  await filter.getByRole('textbox').fill('metrics');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('cluster-overview');
  await filter.locator('button.close').click();
  await dialog.getByRole('button', {name: 'Read snapshot', exact: true}).click();
  await expect(rows).toHaveCount(1);
  await keyColumn.locator('.datagrid-filter-toggle').click();
  await filter.getByRole('textbox').fill('');
  await filter.locator('button.close').click();
  const observers = dialog.getByRole('columnheader', {name: 'Observers'});
  await observers.getByRole('button', {name: 'Observers', exact: true}).click();
  await expect(observers).toHaveAttribute('aria-sort', 'ascending');
  await expect(rows.first().locator('clr-dg-cell').nth(2)).toHaveText('1');
  await observers.getByRole('button', {name: 'Observers', exact: true}).click();
  await expect(observers).toHaveAttribute('aria-sort', 'descending');
  await expect(rows.first().locator('clr-dg-cell').nth(2)).toHaveText('2');
  await observers.locator('.datagrid-filter-toggle').click();
  await filter.getByRole('spinbutton').first().fill('2');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('cluster-overview');
  await filter.locator('button.close').click();
  await dialog.getByRole('button', {name: 'Read snapshot', exact: true}).click();
  await expect(rows).toHaveCount(1);
  await expect(observers).toHaveAttribute('aria-sort', 'descending');
  await dialog.getByRole('button', {name: 'Close', exact: true}).click();
  await expect(requests).toHaveText(initialRequests);
});

test('query inspector shows cached data and refetches only the selected shared query', async ({page}, testInfo) => {
  await page.setViewportSize({width: 1440, height: 1000});
  const metrics = page.getByTestId('query-demo-coalesce');
  await expect(metrics.locator('.label-success')).toHaveCount(2);
  const requests = metrics.locator('.badge').filter({hasText: /^Actual HTTP Calls:/});
  await expect(requests).toHaveText('Actual HTTP Calls: 1');
  await page.locator('cll-query-devtools-root').getByRole('button', {name: 'Query devtools', exact: true}).click();
  const panel = page.getByRole('region', {name: 'Query devtools', exact: true});
  await expect(panel.getByRole('columnheader')).toHaveCount(5);
  const row = panel.locator('clr-dg-row').filter({hasText: '["metrics","cluster-overview"]'});
  await expect(row.locator('.state-badge')).toHaveText(/^(fresh|stale)$/);
  await row.getByRole('button', {name: 'Inspect', exact: true}).click();
  const inspector = panel.locator('.query-inspector');
  await expect(inspector.getByRole('tab', {name: 'Data', exact: true})).toBeFocused();
  await inspector.locator('.tree-toggle').first().click();
  await expect(inspector.locator('.value-tree')).toContainText('activeUsers');
  await expect(requests).toHaveText('Actual HTTP Calls: 1');
  await inspector.getByRole('button', {name: 'Refetch', exact: true}).click();
  await expect(row.locator('.state-badge')).toHaveText('refreshing');
  await expect(row.getByRole('button', {name: 'Refetch', exact: true})).toBeEnabled();
  await expect(requests).toHaveText('Actual HTTP Calls: 2');
  await page.screenshot({path: testInfo.outputPath('query-devtools-panel-data.png')});
  await inspector.getByRole('tab', {name: 'Details', exact: true}).click();
  await expect(inspector).toContainText('staleTime / gcTime');
  await panel.screenshot({path: testInfo.outputPath('query-devtools-inspector.png')});
  const resize = panel.getByRole('separator');
  const initial = box(await panel.boundingBox());
  await resize.focus();
  await page.keyboard.press('ArrowUp');
  await expect.poll(async () => box(await panel.boundingBox()).height).toBeGreaterThan(initial.height);
  await inspector.getByRole('button', {name: 'Back', exact: true}).click();
  await expect(row.locator('.key-button')).toBeFocused();
  await panel.getByRole('button', {name: 'Full height', exact: true}).click();
  await expect(resize).toHaveAttribute('aria-valuenow', '976');
  await page.setViewportSize({width: 1440, height: 700});
  await expect(resize).toHaveAttribute('aria-valuemax', '676');
  await expect(resize).toHaveAttribute('aria-valuenow', '676');
  await expect.poll(async () => Math.abs(box(await panel.boundingBox()).height - 676)).toBeLessThan(1);
  await panel.getByRole('button', {name: 'Close', exact: true}).click();
});

test('pointer resizing persists height once dragging finishes and restores it on reopen', async ({page}) => {
  await page.locator('cll-query-devtools-root').getByRole('button', {name: 'Query devtools', exact: true}).click();
  const panel = page.getByRole('region', {name: 'Query devtools', exact: true});
  const handle = panel.getByRole('separator');
  await expect
    .poll(() => panel.evaluate((element) => Math.abs(element.getBoundingClientRect().bottom - innerHeight)))
    .toBeLessThan(1);
  const start = box(await handle.boundingBox());
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2 - 80, {steps: 5});
  await expect.poll(async () => box(await panel.boundingBox()).height).toBeGreaterThan(400);
  expect(await page.evaluate(() => sessionStorage.getItem('cll-query-devtools-height'))).toBeNull();
  await page.mouse.up();
  const height = box(await panel.boundingBox()).height;
  await expect
    .poll(() => page.evaluate(() => Number(sessionStorage.getItem('cll-query-devtools-height'))))
    .toBeCloseTo(height, 0);
  await panel.getByRole('button', {name: 'Close', exact: true}).click();
  await page.locator('cll-query-devtools-root').getByRole('button', {name: 'Query devtools', exact: true}).click();
  await expect.poll(async () => Math.abs(box(await panel.boundingBox()).height - height)).toBeLessThan(1);
});

test('Kubernetes comparison previews appear above their code by default', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto('/ngx-lift/query/queryResources');
  for (const mode of ['traditional', 'granular']) {
    await page.locator(`#tab-k8s-${mode}`).click();
    const panel = page.locator(`#tab-content-k8s-${mode}`);
    const preview = box(await panel.locator('.playground-canvas').boundingBox());
    const code = box(await panel.locator('app-code-block').boundingBox());
    expect(code.y).toBeGreaterThanOrEqual(preview.y + preview.height);
  }
});

for (const viewport of [
  {width: 1440, height: 1000},
  {width: 390, height: 844},
]) {
  test(`all demo routes keep tabs separated and action labels concise at ${viewport.width}px`, async ({page}) => {
    test.setTimeout(120_000);
    await page.setViewportSize(viewport);
    for (const route of demoRoutes()) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
      const spacing = await page.locator('clr-tabs').evaluateAll((hosts) =>
        hosts.map((host) => {
          const previous = host.previousElementSibling;
          const navigation = host.querySelector('[role="tablist"]');
          return previous && navigation
            ? navigation.getBoundingClientRect().top - previous.getBoundingClientRect().bottom
            : 16;
        }),
      );
      for (const gap of spacing) expect(gap, `${route}: tabs touch previous content`).toBeGreaterThanOrEqual(12);
      for (const host of await page.locator('clr-tabs').all()) {
        const navigationWidth = await host.getByRole('tablist').evaluate((element) => element.clientWidth);
        for (const tab of await host.getByRole('tab').all()) {
          const tabWidth = await tab.evaluate((element) => element.getBoundingClientRect().width);
          expect(tabWidth, `${route}: an individual tab exceeds its scroll container`).toBeLessThanOrEqual(
            navigationWidth,
          );
          await tab.click();
          await expect(tab).toHaveAttribute('aria-selected', 'true');
          const tabId = await tab.getAttribute('id');
          const panel = host.locator(`[role="tabpanel"][aria-labelledby="${tabId}"]`);
          await expect(panel).toBeVisible();
          await expect(host.locator('[role="tabpanel"][aria-hidden="true"]:visible')).toHaveCount(0);
          const gap = await panel.evaluate((panel) => {
            const parent = panel.parentElement as HTMLElement;
            const navigation = parent.querySelector('[role="tablist"]') as HTMLElement;
            const content = panel.firstElementChild as HTMLElement;
            return content.getBoundingClientRect().top - navigation.getBoundingClientRect().bottom;
          });
          expect(gap, `${route}: panel touches tab navigation`).toBeGreaterThanOrEqual(12);
        }
      }
      const technicalLabels = await page
        .locator('main button:visible')
        .evaluateAll((buttons) =>
          buttons
            .map((button) => button.textContent?.trim() ?? '')
            .filter((label) => /\b\w+\.(?:mutate|reload|execute)\(/.test(label)),
        );
      expect(technicalLabels, `${route}: implementation detail in action label`).toEqual([]);
    }
  });
}

test('Chinese labels stay concise and Pattern C works on a narrow screen', async ({page}, testInfo) => {
  await page.evaluate(() => localStorage.setItem('clr-lift-lang', 'zh-CN'));
  await page.setViewportSize({width: 390, height: 844});
  await page.reload();
  const placement = page.getByTestId('query-placement-architecture');
  await expect(placement.getByRole('button', {name: '更新用户名', exact: true})).toBeVisible();
  await page.locator('#tab-component-placement').click();
  const panel = page.locator('#tab-content-component-placement');
  await expect(panel.locator('.playground-canvas').getByRole('heading', {name: 'Website redesign'})).toBeVisible();
  await panel.locator('.playground-canvas').getByRole('button', {name: '刷新', exact: true}).click();
  await expect(panel.getByTestId('project-revision')).toHaveText('响应版本: 2');
  await panel.locator('.playground-canvas').screenshot({path: testInfo.outputPath('placement-zh-narrow.png')});
});

test('quick profile form saves a snapshot and reset clears it', async ({page}) => {
  await page.goto('/ngx-lift/signals/toSignalForm');
  await page.locator('#quick-username').fill('Alex');
  await page.locator('#quick-email').fill('alex@example.com');
  await page.getByRole('button', {name: 'Save Profile', exact: true}).click();
  await expect(page.getByTestId('quick-saved-profile')).toContainText('alex@example.com');
  await page.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(page.getByTestId('quick-saved-profile')).toHaveCount(0);
  await expect(page.locator('#quick-username')).toHaveValue('');
});
