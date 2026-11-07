import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';
import {SELECTION_LOCALE_LABELS} from './support/selection-locale-labels';

const route = '/clr-lift/components/datagrid-selection';
const asset = '**/assets/datagrid-selection/organizations-server.json*';
let requests: URL[];
let errors: string[];

function requestFor(page: number, scope = 'commerce', extra: Record<string, string> = {}): (url: URL) => boolean {
  return (url) =>
    url.searchParams.get('page') === String(page) &&
    url.searchParams.get('scope') === scope &&
    Object.entries(extra).every(([key, value]) => url.searchParams.get(key) === value);
}

async function expectRequest(predicate: (url: URL) => boolean): Promise<void> {
  await expect.poll(() => requests.some(predicate)).toBe(true);
}

function deferred(): {promise: Promise<void>; resolve: () => void} {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return {promise, resolve};
}

test.beforeEach(async ({page}) => {
  errors = [];
  requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.endsWith('/organizations-server.json')) requests.push(url);
  });
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto(route);
  const server = page.getByTestId('selection-server');
  await expect(server.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeVisible();
  await expect(server.getByRole('grid')).toHaveAttribute('aria-busy', 'false');
});
test.afterEach(() => expect(errors).toEqual([]));

test('requests one bounded page for every scope, filter, sort and page identity while retaining saved keys', async ({
  page,
}) => {
  const server = page.getByTestId('selection-server');
  const summary = server.getByTestId('server-selection-summary');
  const evidence = server.getByTestId('server-page-evidence');
  expect(requests[0]?.searchParams.get('scope')).toBe('commerce');
  expect(requests[0]?.searchParams.get('name')).toBe('');
  expect(requests[0]?.searchParams.get('status')).toBe('all');
  expect(requests[0]?.searchParams.get('sort')).toBe('name');
  expect(requests[0]?.searchParams.get('page')).toBe('1');
  expect(requests[0]?.searchParams.get('pageSize')).toBe('5');
  await expect(server.locator('clr-dg-row')).toHaveCount(5);
  await expect(evidence).toContainText('page 1 of 3');
  await expect(evidence).toContainText('13 matching');
  await expect(evidence).toContainText('scope Commerce');
  await expect(summary).toContainText('Selected keys (2)');
  await expect(summary).toContainText('Saved key from an unrequested page (org-s-17)');
  await expect(summary).toContainText('Saved key from an unrequested page (org-s-23)');

  await server.getByRole('button', {name: 'Next Page', exact: true}).click();
  await expect(server.getByRole('checkbox', {name: 'Select Quince', exact: true})).toBeChecked();
  await expectRequest(requestFor(2));
  await expect(summary).toContainText('org-s-17');
  await expect(summary).toContainText('org-s-23');

  await server.getByRole('button', {name: 'Next Page', exact: true}).click();
  await expect(server.getByRole('checkbox', {name: 'Select Willow', exact: true})).toBeChecked();
  await expect(summary).toContainText('Selected keys (2)');

  await server.getByRole('button', {name: 'Name', exact: true}).click();
  await expect(evidence).toContainText('page 1 of 3');
  await expect(evidence).toContainText('name descending');
  await expect(server.locator('clr-dg-row').first()).toContainText('Yarrow');
  await expectRequest(requestFor(1, 'commerce', {sort: '-name'}));
  await expect(summary).toContainText('org-s-17');
  await expect(summary).toContainText('org-s-23');

  await server.locator('#server-scope').selectOption('public');
  await expect(server.locator('clr-dg-row').first()).toContainText('Zelkova');
  await expect(evidence).toContainText('scope Public');
  await expectRequest(requestFor(1, 'public', {sort: '-name'}));
  await expect(summary).toContainText('Selected keys (2)');

  await server.locator('#server-status').selectOption('maintenance');
  await expect(server.locator('clr-dg-row')).toHaveCount(2);
  await expect(evidence).toContainText('2 matching');
  await expect(evidence).toContainText('page 1 of 1');
  await expectRequest(requestFor(1, 'public', {status: 'maintenance'}));

  await server.getByRole('button', {name: 'name filter', exact: true}).click();
  await page.getByRole('textbox', {name: 'Filter organizations by name', exact: true}).fill('Vio');
  await page.keyboard.press('Escape');
  await expect(server.getByRole('checkbox', {name: 'Select Violet', exact: true})).toBeVisible();
  await expect(server.locator('clr-dg-row')).toHaveCount(1);
  await expectRequest(requestFor(1, 'public', {status: 'maintenance', name: 'Vio'}));
  await expect(summary).toContainText('org-s-17');
  await expect(summary).toContainText('org-s-23');
});

test('native filter and footer remain keyboard owned across server page changes', async ({page}) => {
  const server = page.getByTestId('selection-server');
  const filterButton = server.getByRole('button', {name: 'name filter', exact: true});
  await filterButton.focus();
  await page.keyboard.press('Enter');
  const filter = page.getByRole('textbox', {name: 'Filter organizations by name', exact: true});
  await filter.fill('Aurora');
  await page.keyboard.press('Escape');
  await expect(server.locator('clr-dg-row')).toHaveCount(1);
  await expect(filterButton).toBeFocused();

  await page.keyboard.press('Enter');
  await filter.fill('');
  await page.keyboard.press('Escape');
  await expect(server.locator('clr-dg-row')).toHaveCount(5);
  const next = server.getByRole('button', {name: 'Next Page', exact: true});
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(server.getByRole('checkbox', {name: 'Select Quince', exact: true})).toBeVisible();
  await expect(server.getByRole('grid')).toBeFocused();
});

test('select-all and scoped clear use the supplied page while key-only submission keeps every saved key', async ({
  page,
}) => {
  const server = page.getByTestId('selection-server');
  const summary = server.getByTestId('server-selection-summary');
  await server.getByRole('checkbox', {name: 'Select All', exact: true}).check();
  await expect(summary).toContainText('Selected keys (6)');
  await expect(server.getByRole('checkbox', {name: 'Select Elm', exact: true})).toBeDisabled();
  await server.getByRole('button', {name: 'Submit keys', exact: true}).click();
  await expect(server.getByTestId('server-submitted')).toContainText(
    'Submitted keys: org-s-17, org-s-23, org-s-01, org-s-03, org-s-07, org-s-09',
  );
  await expect(server.getByTestId('server-json')).toContainText('"org-s-09"');
  await expect(server.getByTestId('server-json')).not.toContainText('*');
  await expect(summary).not.toContainText('all matching');

  await server.getByRole('button', {name: 'Next Page', exact: true}).click();
  await expect(server.getByRole('checkbox', {name: 'Select Koa', exact: true})).toBeVisible();
  await expect(server.getByRole('checkbox', {name: 'Select Koa', exact: true})).not.toBeChecked();
  await server.getByRole('checkbox', {name: 'Select All', exact: true}).check();
  await expect(summary).toContainText('Selected keys (9)');
  await expect(server.getByRole('checkbox', {name: 'Select Oak', exact: true})).toBeDisabled();
  await server.getByRole('checkbox', {name: 'Select All', exact: true}).uncheck();
  await expect(summary).toContainText('Selected keys (5)');
  await expect(server.getByRole('checkbox', {name: 'Select Quince', exact: true})).not.toBeChecked();
  await expect(server.getByRole('checkbox', {name: 'Select Koa', exact: true})).not.toBeChecked();

  await server.getByRole('button', {name: 'Previous Page', exact: true}).click();
  await expect(server.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeChecked();
  await expect(server.getByRole('checkbox', {name: 'Select Cedar', exact: true})).toBeChecked();
  await expect(server.getByRole('checkbox', {name: 'Select Ginkgo', exact: true})).toBeChecked();
  await expect(server.getByRole('checkbox', {name: 'Select Iris', exact: true})).toBeChecked();
  await server.getByRole('button', {name: 'Submit keys', exact: true}).click();
  await expect(server.getByTestId('server-submitted')).toContainText(
    'Submitted keys: org-s-23, org-s-01, org-s-03, org-s-07, org-s-09',
  );

  await server.getByRole('button', {name: 'Load saved keys', exact: true}).click();
  await expect(summary).toContainText('Selected keys (4)');
  const elm = server.getByRole('checkbox', {name: 'Select Elm', exact: true});
  await expect(elm).toBeChecked();
  await expect(elm).toBeEnabled();
  await expect(summary).toContainText('Elm (org-s-05)');
  await expect(summary).toContainText('Maintenance');
  // Elm and Oak are authoritatively unavailable; eligibility validation reacts without fabricating a user edit.
  await expect(server.getByRole('button', {name: 'Submit keys', exact: true})).toBeDisabled();
  await summary.getByRole('button', {name: 'Remove org-s-05', exact: true}).click();
  await expect(summary).toContainText('Selected keys (3)');
  await expect(elm).not.toBeChecked();
  await expect(server.getByText('Remove unavailable organizations before saving.')).toBeVisible();
  await summary.getByRole('button', {name: 'Remove org-s-15', exact: true}).click();
  await expect(summary).toContainText('Selected keys (2)');
  await expect(server.getByText('Remove unavailable organizations before saving.')).toHaveCount(0);
  await expect(server.getByRole('button', {name: 'Submit keys', exact: true})).toBeEnabled();
});

test('distinguishes empty success, initial failure and refresh failure while Retry restores the same owner', async ({
  page,
}) => {
  const server = page.getByTestId('selection-server');
  const summary = server.getByTestId('server-selection-summary');
  await server.getByRole('button', {name: 'name filter', exact: true}).click();
  const filter = page.getByRole('textbox', {name: 'Filter organizations by name', exact: true});
  await filter.fill('ZZ');
  await page.keyboard.press('Escape');
  await expect(server.getByTestId('server-empty')).toHaveText('No organizations match this server page.');
  await expect(server.getByTestId('server-page-evidence')).toContainText('0 matching');
  await expect(summary).toContainText('Selected keys (2)');
  await server.getByRole('button', {name: 'name filter', exact: true}).click();
  await filter.fill('');
  await page.keyboard.press('Escape');
  await expect(server.locator('clr-dg-row')).toHaveCount(5);

  await page.route(asset, (request) => request.fulfill({status: 500, body: 'Failed'}));
  await page.reload();
  await expect(server.getByTestId('server-error')).toContainText('Organizations could not be loaded.');
  await expect(summary).toContainText('Selected keys (2)');
  await expect(server.getByRole('grid')).toHaveAttribute('aria-busy', 'false');
  await page.unroute(asset);
  await server.getByRole('button', {name: 'Retry', exact: true}).click();
  await expect(server.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeVisible();
  await expect(server.getByTestId('server-error')).toHaveCount(0);

  await page.route(asset, (request) => request.fulfill({status: 500, body: 'Failed'}));
  await server.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(server.getByTestId('server-error')).toContainText(
    'Could not refresh organizations. Showing previously loaded data.',
  );
  await expect(server.locator('clr-dg-row')).toHaveCount(5);
  await expect(summary).toContainText('Selected keys (2)');
  await page.unroute(asset);
  await server.getByRole('button', {name: 'Retry', exact: true}).click();
  await expect(server.getByTestId('server-error')).toHaveCount(0);
  await expect(server.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeVisible();
});

test('stale page and scope responses cannot overwrite the current page, and Reset while loading restores the baseline', async ({
  page,
}) => {
  const server = page.getByTestId('selection-server');
  const summary = server.getByTestId('server-selection-summary');
  let gate = deferred();
  let heldPage = '2';
  await page.route(asset, async (request) => {
    const url = new URL(request.request().url());
    if (url.searchParams.get('scope') === 'commerce' && url.searchParams.get('page') === heldPage) {
      await gate.promise;
    }
    await request.continue();
  });

  await server.getByRole('button', {name: 'Load saved keys', exact: true}).click();
  await expect(summary).toContainText('Selected keys (4)');
  await server.getByRole('button', {name: 'Next Page', exact: true}).click();
  await expect(server.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
  await expect(server.getByRole('checkbox', {name: 'Select All', exact: true})).toBeDisabled();
  // Saved keys include unverified maintenance rows, so the eligibility validator keeps submission disabled while it reads.
  await expect(server.getByRole('button', {name: 'Submit keys', exact: true})).toBeDisabled();
  await expect(server.getByRole('button', {name: 'Reset', exact: true})).toBeEnabled();

  await server.locator('#server-scope').selectOption('public');
  await expect(server.getByRole('checkbox', {name: 'Select Beacon', exact: true})).toBeVisible();
  await expect(server.getByTestId('server-page-evidence')).toContainText('scope Public');
  const stale = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.pathname.endsWith('/organizations-server.json') &&
      url.searchParams.get('scope') === 'commerce' &&
      url.searchParams.get('page') === '2'
    );
  });
  gate.resolve();
  await stale;
  await expect(server.getByRole('checkbox', {name: 'Select Beacon', exact: true})).toBeVisible();
  await expect(server.getByTestId('server-page-evidence')).toContainText('scope Public');
  await expect(summary).toContainText('Selected keys (4)');

  gate = deferred();
  heldPage = '3';
  await server.locator('#server-scope').selectOption('commerce');
  await expect(server.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeVisible();
  await server.getByRole('button', {name: 'Load saved keys', exact: true}).click();
  await expect(summary).toContainText('Selected keys (4)');
  await server.getByRole('button', {name: 'Last Page', exact: true}).click();
  await expect(server.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
  await server.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(summary).toContainText('Selected keys (2)');
  gate.resolve();
  await expect(server.getByRole('checkbox', {name: 'Select Willow', exact: true})).toBeChecked();
  await expect(server.getByRole('checkbox', {name: 'Select Umbrella', exact: true})).not.toBeChecked();
  await expect(server.getByRole('grid')).toHaveAttribute('aria-busy', 'false');
  await expect(summary).toContainText('Selected keys (2)');
});

test('readonly and disabled states preserve browsing and owner writes while automated accessibility passes', async ({
  page,
}, testInfo) => {
  const server = page.getByTestId('selection-server');
  const summary = server.getByTestId('server-selection-summary');
  await server.getByRole('checkbox', {name: 'Readonly', exact: true}).check();
  await expect(server.getByRole('grid')).toHaveAttribute('aria-readonly', 'true');
  await expect(server.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeDisabled();
  await expect(summary.getByRole('button', {name: 'Remove org-s-17', exact: true})).toBeDisabled();
  await expect(summary).toContainText('Selected keys (2)');
  await server.getByRole('checkbox', {name: 'Readonly', exact: true}).uncheck();

  await server.getByRole('checkbox', {name: 'Disabled', exact: true}).check();
  await expect(server.getByRole('grid')).toHaveAttribute('aria-disabled', 'true');
  await expect(server.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeDisabled();
  await expect(server.getByTestId('server-json')).not.toContainText('org-s-17');
  await expect(summary).toContainText('Selected keys (2)');
  await server.getByRole('checkbox', {name: 'Disabled', exact: true}).uncheck();
  await expect(server.getByTestId('server-json')).toContainText('org-s-17');
  await expect(summary).toContainText('Selected keys (2)');
  await expect(server.locator('.playground-canvas')).not.toContainText('selectionDemo.');

  await expectAccessible(page, testInfo, '[data-testid="selection-server"] .playground-canvas');
  await page.getByRole('button', {name: 'Toggle to dark theme'}).click();
  await expectAccessible(page, testInfo, '[data-testid="selection-server"] .playground-canvas');
});

test('all supported languages localize server evidence and keep the same saved keys', async ({page}) => {
  const server = page.getByTestId('selection-server');
  for (const {language, organization, commerce} of SELECTION_LOCALE_LABELS) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: language, exact: true}).click();
    await expect(server.getByRole('grid')).toHaveAccessibleName(`${organization}*`);
    await expect(server.getByTestId('server-page-evidence')).toContainText(commerce);
    await expect(server.getByTestId('server-selection-summary')).toContainText('2');
    await expect(server.locator('.playground-canvas')).not.toContainText('selectionDemo.');
  }
  await expect(server.getByTestId('server-selection-summary')).toContainText('org-s-17');
  await expect(server.getByTestId('server-selection-summary')).toContainText('org-s-23');
});

test('stale filter responses cannot overwrite the current filter request', async ({page}) => {
  const server = page.getByTestId('selection-server');
  const gate = deferred();
  await page.route(asset, async (request) => {
    const url = new URL(request.request().url());
    if (url.searchParams.get('scope') === 'commerce' && url.searchParams.get('name') === 'Quin') {
      await gate.promise;
    }
    await request.continue();
  });

  await server.getByRole('checkbox', {name: 'Select Cedar', exact: true}).check();
  await server.getByRole('button', {name: 'name filter', exact: true}).click();
  const filter = page.getByRole('textbox', {name: 'Filter organizations by name', exact: true});
  await filter.fill('Quin');
  await expect(server.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
  await filter.fill('');
  await page.keyboard.press('Escape');
  await expect(server.locator('clr-dg-row')).toHaveCount(5);
  const stale = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.pathname.endsWith('/organizations-server.json') &&
      url.searchParams.get('name') === 'Quin' &&
      url.searchParams.get('scope') === 'commerce'
    );
  });
  gate.resolve();
  await stale;
  await expect(server.locator('clr-dg-row')).toHaveCount(5);
  await expect(server.getByRole('checkbox', {name: 'Select Cedar', exact: true})).toBeChecked();
  await expect(server.getByRole('grid')).toHaveAttribute('aria-busy', 'false');
});

test('the reusable picker owns its own paged server query while the parent owns keys and the saved baseline', async ({
  page,
}) => {
  const pickerHost = page.getByTestId('selection-server-picker');
  await expect(pickerHost.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeVisible();
  await expect(pickerHost.getByTestId('server-picker-json')).toContainText('org-s-13');
  await expect(pickerHost.getByTestId('server-picker-json')).toContainText('org-s-25');

  // The picker, not the page, requests the page, sort, filter and scope identity.
  await pickerHost.getByRole('button', {name: 'Next Page', exact: true}).click();
  const maple = pickerHost.getByRole('checkbox', {name: 'Select Maple', exact: true});
  await expect(maple).toBeChecked();
  await pickerHost.getByRole('checkbox', {name: 'Select Spruce', exact: true}).check();
  await expectRequest(requestFor(2));
  await pickerHost.locator('#picker-scope').selectOption('public');
  await expect(pickerHost.getByRole('checkbox', {name: 'Select Beacon', exact: true})).toBeVisible();
  await expectRequest(requestFor(1, 'public'));

  await pickerHost.getByRole('button', {name: 'Submit keys', exact: true}).click();
  await expect(pickerHost.getByTestId('server-picker-submitted')).toContainText(
    'Submitted keys: org-s-13, org-s-25, org-s-19',
  );
  await expect(pickerHost.getByTestId('server-picker-json')).not.toContainText('*');
});

test('the picker owns failure and retry while the parent keeps its keys, readonly and disabled state', async ({
  page,
}, testInfo) => {
  const pickerHost = page.getByTestId('selection-server-picker');
  let failed = false;
  await page.route(asset, (request) => {
    if (!failed) return request.continue();
    return request.fulfill({status: 500, body: 'Failed'});
  });

  // The picker's first page must settle so the later fault is a refresh, not the initial load.
  await expect(pickerHost.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeVisible();
  failed = true;
  await pickerHost.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(pickerHost.getByTestId('server-picker-error')).toContainText(
    'Could not refresh organizations. Showing previously loaded data.',
  );
  await expect(pickerHost.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeVisible();
  await expect(pickerHost.getByTestId('server-picker-json')).toContainText('org-s-13');
  await expect(pickerHost.getByTestId('server-picker-json')).toContainText('org-s-25');

  await page.unroute(asset);
  await pickerHost.getByRole('button', {name: 'Retry', exact: true}).click();
  await expect(pickerHost.getByTestId('server-picker-error')).toHaveCount(0);
  await expect(pickerHost.getByRole('checkbox', {name: 'Select Aurora', exact: true})).toBeVisible();

  await pickerHost.getByRole('checkbox', {name: 'Readonly', exact: true}).check();
  await expect(pickerHost.getByRole('grid')).toHaveAttribute('aria-readonly', 'true');
  await expect(pickerHost.getByRole('checkbox', {name: 'Select Cedar', exact: true})).toBeDisabled();
  await expect(pickerHost.getByTestId('server-picker-json')).toContainText('org-s-13');
  await pickerHost.getByRole('checkbox', {name: 'Readonly', exact: true}).uncheck();

  await pickerHost.getByRole('checkbox', {name: 'Disabled', exact: true}).check();
  await expect(pickerHost.getByRole('grid')).toHaveAttribute('aria-disabled', 'true');
  await expect(pickerHost.getByRole('checkbox', {name: 'Select Cedar', exact: true})).toBeDisabled();
  await expect(pickerHost.getByTestId('server-picker-json')).not.toContainText('org-s-13');
  await pickerHost.getByRole('checkbox', {name: 'Disabled', exact: true}).uncheck();
  await expect(pickerHost.getByTestId('server-picker-json')).toContainText('org-s-13');

  await expect(pickerHost.locator('.playground-canvas')).not.toContainText('selectionDemo.');
  await expectAccessible(page, testInfo, '[data-testid="selection-server-picker"] .playground-canvas');
  await page.getByRole('button', {name: 'Toggle to dark theme'}).click();
  await expectAccessible(page, testInfo, '[data-testid="selection-server-picker"] .playground-canvas');
});

test('all supported languages localize the reusable picker and keep the same saved keys', async ({page}) => {
  const pickerHost = page.getByTestId('selection-server-picker');
  for (const {language, organization, commerce} of SELECTION_LOCALE_LABELS) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: language, exact: true}).click();
    await expect(pickerHost.getByRole('grid')).toHaveAccessibleName(`${organization}*`);
    await expect(pickerHost.locator('#picker-scope')).toContainText(commerce);
    await expect(pickerHost.locator('.playground-canvas')).not.toContainText('selectionDemo.');
  }
  await expect(pickerHost.getByTestId('server-picker-json')).toContainText('org-s-13');
  await expect(pickerHost.getByTestId('server-picker-json')).toContainText('org-s-25');
});
