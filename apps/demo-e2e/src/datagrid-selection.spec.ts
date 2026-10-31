import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

const route = '/clr-lift/components/datagrid-selection';
let errors: string[];
test.beforeEach(async ({page}) => {
  errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto(route);
  await expect(
    page.getByTestId('selection-multiple').getByRole('checkbox', {name: 'Select North', exact: true}),
  ).toBeVisible();
});
test.afterEach(() => expect(errors).toEqual([]));

test('native single radios, Clear, ngModel required validation and reset', async ({page}) => {
  const single = page.getByTestId('selection-single');
  const radio = single.getByRole('radio', {name: 'Select South', exact: true});
  await radio.check();
  await expect(radio).toBeChecked();
  await single.getByRole('button', {name: 'Clear', exact: true}).click();
  await expect(radio).not.toBeChecked();
  const model = page.getByTestId('selection-model');
  await model.getByRole('button', {name: 'Submit', exact: true}).click();
  await expect(model.locator('.field-feedback.error')).toHaveText('Choose an organization.');
  await expect(model.locator('clr-control-error cds-icon[shape="error-standard"]')).toBeVisible();
  expect(
    await model.locator('.field-body').evaluate((element) => getComputedStyle(element).borderInlineStartWidth),
  ).toBe('0px');
  await model.getByRole('radio', {name: 'Select North', exact: true}).check();
  await expect(model.locator('.field-feedback.error')).toHaveCount(0);
  await model.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(model.getByRole('radio', {name: 'Select North', exact: true})).not.toBeChecked();
  await expect(model.locator('.field-feedback.error')).toHaveCount(0);
});

test('picker keeps edits buffered across its grid, filter popup and signpost until composite departure', async ({
  page,
}) => {
  const picker = page.getByTestId('selection-picker');
  const preview = picker.locator('app-policy-form > pre');
  await expect(preview).toContainText('org-1');
  await picker.getByRole('checkbox', {name: 'Select South', exact: true}).check();
  await expect(preview).not.toContainText('org-2');
  await picker.getByRole('button', {name: 'About organization assignments'}).click();
  await expect(preview).not.toContainText('org-2');
  await page.keyboard.press('Escape');
  await picker.getByRole('button', {name: 'name filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('North');
  await expect(picker.locator('clr-dg-row')).toHaveCount(1);
  await expect(preview).not.toContainText('org-2');
  await page.keyboard.press('Escape');
  await picker.getByRole('button', {name: 'Submit', exact: true}).focus();
  await expect(preview).toContainText('org-2');
  await picker.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(preview).not.toContainText('org-2');
});

test('filtered select-all keeps the unfiltered footprint and paging uses the logical page', async ({page}) => {
  const multiple = page.getByTestId('selection-multiple');
  const content = multiple.locator('.datagrid');
  const height = await content.evaluate((element) => element.getBoundingClientRect().height);
  expect(height).toBeGreaterThan(0);
  await multiple.getByRole('checkbox', {name: 'Select South', exact: true}).check();
  await multiple.getByRole('button', {name: 'name filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('North');
  await expect(multiple.locator('clr-dg-row')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await multiple.getByRole('checkbox', {name: 'Select All', exact: true}).check();
  await expect(multiple.getByRole('checkbox', {name: 'Select North', exact: true})).toBeChecked();
  await expect
    .poll(() => content.evaluate((element) => element.getBoundingClientRect().height))
    .toBeGreaterThanOrEqual(height - 1);
  await multiple.getByRole('button', {name: 'name filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('');
  await page.keyboard.press('Escape');
  await expect(multiple.getByRole('checkbox', {name: 'Select South', exact: true})).toBeChecked();
  const policy = page.getByTestId('selection-policy');
  await policy.getByRole('checkbox', {name: 'Select All', exact: true}).check();
  await policy.getByRole('button', {name: 'Next Page', exact: true}).click();
  await expect(policy.getByRole('checkbox', {name: 'Select River', exact: true})).not.toBeChecked();
});

test('real fields have unique names and descriptions, reflow in both themes and pass automated accessibility', async ({
  page,
}, testInfo) => {
  const labels = page.locator('cll-datagrid-selection .field-label > label');
  const ids = await labels.evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.every(Boolean)).toBe(true);
  for (const example of ['selection-policy', 'selection-picker']) {
    const labelGroup = page.getByTestId(example).locator('.field-label');
    const label = await labelGroup.locator(':scope > label').boundingBox();
    const signpost = await labelGroup.locator(':scope > clr-signpost').boundingBox();
    expect(label).not.toBeNull();
    expect(signpost).not.toBeNull();
    const gap = (signpost?.x ?? 0) - ((label?.x ?? 0) + (label?.width ?? 0));
    expect(gap).toBeGreaterThanOrEqual(4);
    expect(gap).toBeLessThanOrEqual(12);
  }
  await expectAccessible(page, testInfo, 'main');
  const model = page.getByTestId('selection-model');
  await model.getByRole('button', {name: 'Submit', exact: true}).click();
  await expect(model.locator('clr-control-error')).toBeVisible();
  await expectAccessible(page, testInfo, '[data-testid="selection-model"] .playground-canvas');
  await page.getByRole('button', {name: 'Toggle to dark theme'}).click();
  await page.setViewportSize({width: 390, height: 844});
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
  await expectAccessible(page, testInfo, 'main');
});

test('loading locks a focused selection cell and the header without removing the accepted payload', async ({page}) => {
  const policy = page.getByTestId('selection-policy');
  const preview = policy.locator('app-data-service-policy-form > pre');
  let release: () => void = () => undefined;
  const response = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/assets/datagrid-selection/organizations.json*', async (request) => {
    await response;
    await request.continue();
  });
  await policy.getByRole('gridcell', {name: 'Select North', exact: true}).focus();
  await policy.getByRole('button', {name: 'Refresh', exact: true}).dispatchEvent('click');
  await expect(policy.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
  await page.keyboard.press('Space');
  await expect(policy.getByRole('checkbox', {name: 'Select North', exact: true})).not.toBeChecked();
  await expect(policy.getByRole('checkbox', {name: 'Select All', exact: true})).toBeDisabled();
  await expect(preview).toContainText('org-2');
  release();
  await expect(policy.getByRole('grid')).toHaveAttribute('aria-busy', 'false');
  await expect(policy.getByRole('checkbox', {name: 'Select North', exact: true})).toBeEnabled();
});

test('request failure and Retry retain the native grid, owner values and distinct validation feedback', async ({
  page,
}) => {
  const policy = page.getByTestId('selection-policy');
  await page.route('**/assets/datagrid-selection/organizations.json*', (request) =>
    request.fulfill({status: 500, body: 'Failed'}),
  );
  const original = await policy.locator('clr-datagrid').elementHandle();
  await policy.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(policy.locator('cll-alert')).toContainText('Could not refresh organizations.');
  await expect(policy.locator('app-data-service-policy-form > pre')).toContainText('org-2');
  await expect(policy.locator('.field-feedback.error')).toHaveCount(0);
  await page.unroute('**/assets/datagrid-selection/organizations.json*');
  await policy.getByRole('button', {name: 'Retry', exact: true}).click();
  await expect(policy.locator('cll-alert')).toHaveCount(0);
  expect(await original?.evaluate((element) => element.isConnected)).toBe(true);
});

test('all supported languages keep selected keys and active translated status filtering', async ({page}) => {
  const policy = page.getByTestId('selection-policy');
  const preview = policy.locator('app-data-service-policy-form > pre');
  await policy.getByRole('button', {name: 'status filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('Ready');
  await expect(policy.getByRole('checkbox', {name: 'Select East', exact: true})).toHaveCount(0);
  await page.keyboard.press('Escape');
  for (const [language, label] of [
    ['简体中文', '组织'],
    ['繁體中文', '組織'],
    ['Deutsch', 'Organisationen'],
    ['Español', 'Organizaciones'],
    ['Français', 'Organisations'],
    ['日本語', '組織'],
    ['한국어', '조직'],
    ['Nederlands', 'Organisaties'],
    ['Português', 'Organizações'],
    ['Русский', 'Организации'],
    ['English', 'Organizations'],
  ]) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: language, exact: true}).click();
    await expect(policy.getByRole('grid')).toHaveAccessibleName(`${label}*`);
    await expect(preview).toContainText('org-2');
    await expect(page.locator('#api-reference app-api-table tbody tr')).toHaveCount(6);
    await expect(page.locator('#api-reference')).not.toContainText('selectionDemo.reference.');
  }
  await expect(policy.getByRole('checkbox', {name: 'Select South', exact: true})).toBeChecked();
  await expect(policy.getByRole('checkbox', {name: 'Select East', exact: true})).toHaveCount(0);
});

test('readonly and disabled selection preserve browsing, availability reasons and owner writes', async ({page}) => {
  const policy = page.getByTestId('selection-policy');
  const preview = policy.locator('app-data-service-policy-form > pre');
  await expect(policy.getByRole('checkbox', {name: 'Select East', exact: true})).toBeDisabled();
  await expect(policy.getByRole('checkbox', {name: 'Select East', exact: true})).toHaveAccessibleDescription(
    'Maintenance',
  );
  await expect(policy.locator('.selection-availability-reason').first()).toBeVisible();
  await policy.getByRole('checkbox', {name: 'Readonly', exact: true}).check();
  await expect(policy.getByRole('grid')).toHaveAttribute('aria-readonly', 'true');
  expect(
    await policy
      .locator('clr-dg-row input')
      .evaluateAll((inputs) => inputs.every((input) => (input as HTMLInputElement).disabled)),
  ).toBe(true);
  await policy.getByRole('button', {name: 'name filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('North');
  await expect(policy.locator('clr-dg-row')).toHaveCount(1);
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('');
  await page.keyboard.press('Escape');
  await policy.getByRole('checkbox', {name: 'Readonly', exact: true}).uncheck();
  await policy.getByRole('checkbox', {name: 'Disabled', exact: true}).check();
  await expect(policy.getByRole('grid')).toHaveAttribute('aria-disabled', 'true');
  await expect(preview).not.toContainText('org-2');
  await policy.getByRole('checkbox', {name: 'Disabled', exact: true}).uncheck();
  await expect(preview).toContainText('org-2');
  await policy.getByRole('button', {name: 'Load saved selection', exact: true}).click();
  await expect(preview).toContainText('unresolved');
  await expect(policy.getByRole('checkbox', {name: 'Select South', exact: true})).toBeChecked();
  await expect(policy.getByRole('checkbox', {name: 'Select North', exact: true})).not.toBeChecked();
});

test('native inventories bound scrolling and paged rendering while select-all includes offscreen items', async ({
  page,
}, testInfo) => {
  const inventory = Array.from({length: 120}, (_, index) => ({
    id: `org-${index + 1}`,
    name: `Resource ${index + 1}`,
    status: 'ready',
  }));
  await page.route('**/assets/datagrid-selection/organizations.json*', (request) => request.fulfill({json: inventory}));
  await page.reload();
  const multiple = page.getByTestId('selection-multiple');
  await expect(multiple.locator('clr-dg-row')).toHaveCount(120);
  const started = Date.now();
  await multiple.getByRole('checkbox', {name: 'Select All', exact: true}).check();
  await expect(multiple.getByRole('checkbox', {name: 'Select Resource 120', exact: true})).toBeChecked();
  const selectionMs = Date.now() - started;
  const viewport = multiple.locator('.datagrid');
  const sizes = await viewport.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    limit: parseFloat(getComputedStyle(element).maxBlockSize),
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(sizes.height).toBeGreaterThan(0);
  expect(sizes.limit).toBeGreaterThan(0);
  expect(sizes.height).toBeLessThanOrEqual(sizes.limit + 1);
  expect(sizes.scrollHeight).toBeGreaterThan(sizes.clientHeight);
  await multiple.getByRole('checkbox', {name: 'Select Resource 120', exact: true}).scrollIntoViewIfNeeded();
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(page.getByTestId('selection-policy').locator('clr-dg-row')).toHaveCount(10);
  const pagerPosition = await page
    .getByTestId('selection-policy')
    .locator('clr-datagrid')
    .evaluate((grid) => ({
      viewportBottom: grid.querySelector('.datagrid')?.getBoundingClientRect().bottom ?? 0,
      footerTop: grid.querySelector('clr-dg-footer')?.getBoundingClientRect().top ?? -1,
    }));
  expect(pagerPosition.viewportBottom).toBeGreaterThan(0);
  expect(pagerPosition.footerTop).toBeGreaterThanOrEqual(pagerPosition.viewportBottom);
  await testInfo.attach('selection-rendering-bounds', {
    body: JSON.stringify({suppliedItems: 120, unpagedRows: 120, pagedRows: 10, selectionMs, ...sizes}),
    contentType: 'application/json',
  });
});

test('small inventories fit naturally and retain their rendered viewport through filtering and fresh data', async ({
  page,
}) => {
  const inventory = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map((name, index) => ({
    id: `org-${index + 1}`,
    name,
    status: 'ready',
  }));
  let refreshed = false;
  await page.route('**/assets/datagrid-selection/organizations.json*', (route) =>
    route.fulfill({json: inventory.map((item) => ({...item, name: refreshed ? `${item.name} refreshed` : item.name}))}),
  );
  await page.reload();
  const multiple = page.getByTestId('selection-multiple');
  await expect(multiple.locator('clr-dg-row')).toHaveCount(5);
  const viewport = multiple.locator('.datagrid');
  const natural = await viewport.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    max: parseFloat(getComputedStyle(element).maxBlockSize),
    client: element.clientHeight,
    scroll: element.scrollHeight,
  }));
  expect(natural.height).toBeGreaterThan(0);
  expect(natural.height).toBeLessThan(natural.max);
  expect(natural.scroll).toBeLessThanOrEqual(natural.client + 1);
  const stableHeight = async () => {
    await expect
      .poll(() => viewport.evaluate((element) => element.getBoundingClientRect().height))
      .toBeCloseTo(natural.height, 0);
  };
  await multiple.getByRole('checkbox', {name: 'Select Beta', exact: true}).check();
  await multiple.getByRole('button', {name: 'name filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('Alpha');
  await page.keyboard.press('Escape');
  await expect(multiple.locator('clr-dg-row')).toHaveCount(1);
  await stableHeight();
  refreshed = true;
  await page.getByTestId('selection-policy').getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(multiple.getByRole('checkbox', {name: 'Select Alpha refreshed', exact: true})).toBeVisible();
  await stableHeight();
  await multiple.getByRole('button', {name: 'name filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('No match');
  await page.keyboard.press('Escape');
  await expect(multiple.locator('clr-dg-row')).toHaveCount(0);
  await stableHeight();
  await multiple.getByRole('button', {name: 'name filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter items', exact: true}).fill('');
  await page.keyboard.press('Escape');
  await expect(multiple.locator('clr-dg-row')).toHaveCount(5);
  await expect(multiple.getByRole('checkbox', {name: 'Select Beta refreshed', exact: true})).toBeChecked();
  await stableHeight();
});

test('native horizontal layout, compact density, RTL and 200 percent text reflow keep the field usable', async ({
  page,
}) => {
  const policy = page.getByTestId('selection-policy');
  await policy.getByRole('checkbox', {name: 'Horizontal layout', exact: true}).check();
  await expect(policy.locator('.selection-field')).toHaveClass(/horizontal/);
  await expect(page.getByTestId('selection-model').locator('form')).toHaveClass(/clr-form-horizontal/);
  const label = policy.locator('.field-label');
  const body = policy.locator('.field-body');
  const positions = await Promise.all([label.boundingBox(), body.boundingBox()]);
  expect(positions[1]?.x).toBeGreaterThan(positions[0]?.x ?? 0);
  expect(positions[0]?.y).toBeLessThanOrEqual((positions[1]?.y ?? 0) + 8);
  await policy.locator('clr-datagrid').evaluate((element) => element.classList.add('datagrid-compact'));
  await page.setViewportSize({width: 390, height: 844});
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.style.fontSize = '200%';
  });
  await expect(policy.getByRole('button', {name: 'Submit', exact: true})).toBeVisible();
  const field = policy.locator('cll-datagrid-selection');
  const overflow = await field.evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await policy.getByRole('button', {name: 'Load saved selection', exact: true}).click();
  await expect(policy.locator('app-data-service-policy-form > pre')).toContainText('unresolved');
});

test('saved selection stays checked after refresh and reset restores both edit baselines without clearing pagination', async ({
  page,
}) => {
  const policy = page.getByTestId('selection-policy');
  const picker = page.getByTestId('selection-picker');
  await policy.getByRole('button', {name: 'Load saved selection', exact: true}).click();
  await policy.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(policy.getByRole('grid')).toHaveAttribute('aria-busy', 'false');
  await expect(policy.getByRole('checkbox', {name: 'Select South', exact: true})).toBeChecked();
  for (const [example, initialName, initialKey] of [
    [policy, 'South', 'org-2'],
    [picker, 'North', 'org-1'],
  ] as const) {
    await example.getByRole('checkbox', {name: 'Select West', exact: true}).check();
    await example.getByRole('button', {name: 'Reset', exact: true}).click();
    await expect.soft(example.locator('clr-dg-pagination input')).toHaveValue('1');
    await expect.soft(example.getByRole('checkbox', {name: `Select ${initialName}`, exact: true})).toBeChecked();
    await expect(example.getByRole('checkbox', {name: 'Select West', exact: true})).not.toBeChecked();
    await expect(example.locator('.playground-canvas pre')).toContainText(initialKey);
    await expect(example.locator('.field-feedback.error')).toHaveCount(0);
    await example.getByRole('button', {name: 'Next Page', exact: true}).click();
    await expect(example.getByRole('textbox', {name: 'Current Page', exact: true})).toHaveValue('2');
    await example.getByRole('button', {name: 'Reset', exact: true}).click();
    await expect(example.getByRole('textbox', {name: 'Current Page', exact: true})).toHaveValue('2');
    await example.getByRole('button', {name: 'Previous Page', exact: true}).click();
    await expect(example.getByRole('checkbox', {name: `Select ${initialName}`, exact: true})).toBeChecked();
  }
});

test('saved writes after reset also update the checked South row', async ({page}) => {
  const policy = page.getByTestId('selection-policy');
  await policy.getByRole('button', {name: 'Reset', exact: true}).click();
  await policy.getByRole('button', {name: 'Load saved selection', exact: true}).click();
  await policy.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(policy.getByRole('grid')).toHaveAttribute('aria-busy', 'false');
  await expect(policy.locator('app-data-service-policy-form > pre')).toContainText('org-2');
  await expect(policy.getByRole('checkbox', {name: 'Select South', exact: true})).toBeChecked();
});

test('in-page API reference and complete parent sources follow the component demo pattern', async ({page}) => {
  const reference = page.locator('#api-reference');
  await expect(reference.getByRole('heading', {name: 'API Reference', exact: true})).toBeVisible();
  await expect(reference.locator('app-api-table tbody tr')).toHaveCount(6);
  for (const name of ['required', 'helper', 'error', 'layout', 'readonly', 'itemAvailability']) {
    await expect(reference.getByRole('cell', {name, exact: true})).toBeVisible();
  }
  await expect(reference).toContainText('DatagridSelectionAccessorDirective');
  await expect(reference).toContainText('cllDatagridSelectionBinding');
  await expect(page.getByTestId('selection-policy')).toContainText('South (org-2)');
  await expect(page.getByTestId('selection-picker')).toContainText('North (org-1)');
  await expect(page.locator('app-code-block').filter({hasText: 'export class PolicyFormComponent'})).toBeVisible();
});
