import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

const zipFile = (name: string, body = 'release bundle') => ({
  name,
  mimeType: 'application/zip',
  buffer: Buffer.from(body),
});

async function selectFiles(page: import('@playwright/test').Page, testId: string, files: ReturnType<typeof zipFile>[]) {
  const playground = page.getByTestId(testId);
  await playground.locator('input[type="file"]').first().setInputFiles(files);
  return playground;
}

async function selectHostFiles(
  page: import('@playwright/test').Page,
  testId: string,
  hostIndex: number,
  files: ReturnType<typeof zipFile>[],
) {
  const host = page.getByTestId(testId).locator('cll-upload').nth(hostIndex);
  await host.locator('input[type="file"]').first().setInputFiles(files);
  return host;
}

test('uploads a bundle, registers it, and minimizes the shared panel @cross-browser-smoke', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await selectFiles(page, 'upload-demo-basic', [zipFile('bundle.zip')]);

  const panel = page.locator('.cll-upload-panel');
  await expect(panel).toContainText('bundle.zip');
  await expect(page.getByTestId('upload-demo-registered')).toContainText('1');

  await panel.getByRole('button', {name: 'Minimize'}).click();
  const badge = panel.locator('.cll-upload-panel__badge');
  await expect(badge).toBeVisible();
  await badge.click();
  await expect(panel.getByRole('button', {name: 'Minimize'})).toBeVisible();
});

test('restores visible Browse focus after selection from the dropzone label', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  const host = page.getByTestId('upload-demo-basic');
  const chooserPromise = page.waitForEvent('filechooser');
  await host.locator('.cll-upload__dropzone-title').click();
  const chooser = await chooserPromise;
  await chooser.setFiles([zipFile('bundle.zip')]);

  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 1 files');
  await panel.locator('.cll-upload-panel__done').click();

  await expect(host.locator('.cll-upload__browse')).toBeFocused();
});

test('adds files by dropping them onto the dropzone', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  const dropzone = page.getByTestId('upload-demo-basic').locator('.cll-upload__dropzone');
  const dataTransfer = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(['release bundle'], 'dropped.zip', {type: 'application/zip'}));
    return transfer;
  });
  await expect(page.locator('.cll-upload-panel')).toBeAttached();
  await dropzone.dispatchEvent('drop', {dataTransfer});

  const panel = page.locator('.cll-upload-panel');
  await expect(panel).toContainText('dropped.zip');
  await expect(page.getByTestId('upload-demo-registered')).toContainText('1');
});

test('rejects a disallowed file without registering it', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await selectFiles(page, 'upload-demo-basic', [{name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('x')}]);

  await expect(page.getByTestId('upload-demo-basic')).toContainText('This file type is not allowed.');
  await expect(page.getByTestId('upload-demo-registered')).toContainText('0');
});

test('uploads several files and collapses successes while failures stay pinned', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await selectFiles(page, 'upload-demo-basic', [zipFile('first.zip'), zipFile('second.zip')]);

  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 2 files');
  await expect(page.getByTestId('upload-demo-registered')).toContainText('2');

  await panel.locator('.cll-upload-panel__summary-toggle').click();
  await expect(panel.locator('.cll-upload-panel__summary-list')).toContainText('first.zip');
});

test('retries a failed item from the footer until it succeeds @cross-browser-smoke', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await selectFiles(page, 'upload-demo-failure', [zipFile('failing.zip'), zipFile('passing.zip')]);

  const panel = page.locator('.cll-upload-panel');
  const retryFailed = panel.locator('.cll-upload-panel__retry-failed');
  await expect(retryFailed).toContainText('(1)');
  await expect(panel).toContainText('A chunk could not be uploaded.');

  await retryFailed.click();
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 2 files');
  await expect(retryFailed).toHaveCount(0);
});

test('cancels an active upload from its row', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await selectFiles(page, 'upload-demo-panel', [zipFile('pending.zip')]);

  const panel = page.locator('.cll-upload-panel');
  await expect(panel).toContainText('pending.zip');

  await panel.getByRole('button', {name: 'Cancel', exact: true}).first().click();
  await expect(panel).toContainText('Cancelled');

  await panel.locator('.cll-upload-panel__done').click();
  await expect(panel.locator('.cll-upload-panel__card')).toHaveCount(0);
});

test('active work offers collapse rather than Close and continues in the background', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  await page.getByTestId('upload-demo-add-files').click();
  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__item').first()).toBeVisible();
  await expect(panel.locator('.cll-upload-panel__close')).toHaveCount(0);
  await panel.locator('.cll-upload-panel__minimize').click();
  await expect(panel.locator('.cll-upload-panel__badge')).toBeVisible();
  await panel.locator('.cll-upload-panel__badge').click();
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 3 files');
});

test('Cancel all confirms first and retains cancelled records until explicit Close', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  await page.getByTestId('upload-demo-add-files').click();
  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__item').first()).toBeVisible();
  await panel.locator('.cll-upload-panel__cancel-all').click();
  await expect(panel.locator('[role="alertdialog"]')).toBeVisible();
  await panel.locator('.cll-upload-panel__confirm-cancel').click();
  await expect(panel).toContainText('Cancelled');
  await panel.locator('.cll-upload-panel__done').click();
  await expect(panel.locator('.cll-upload-panel__card')).toHaveCount(0);
  await expect(page.getByTestId('upload-demo-add-files')).toBeFocused();
});

// Safari uses Option+Tab to include buttons when full keyboard access is off.
const traversalKeys = {
  chromium: {tab: 'Tab', backTab: 'Shift+Tab'},
  firefox: {tab: 'Tab', backTab: 'Shift+Tab'},
  webkit: {tab: 'Alt+Tab', backTab: 'Alt+Shift+Tab'},
};

test('the keyboard operates collapse and safe cancellation confirmation', async ({page, browserName}) => {
  const {tab, backTab} = traversalKeys[browserName];
  await page.goto('/clr-lift/components/upload');
  await page.getByTestId('upload-demo-add-files').click();
  const panel = page.locator('.cll-upload-panel');
  const collapse = panel.locator('.cll-upload-panel__minimize');
  await collapse.focus();
  await page.keyboard.press('Enter');
  await expect(panel.locator('.cll-upload-panel__badge')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(collapse).toBeFocused();
  await page.keyboard.press(tab);
  await expect(panel.locator('.cll-upload-panel__cancel-all')).toBeFocused();
  await page.keyboard.press('Enter');
  const background = panel.locator('.cll-upload-panel__confirm-background');
  await expect(background).toBeFocused();
  await page.keyboard.press(tab);
  await expect(panel.locator('.cll-upload-panel__confirm-cancel')).toBeFocused();
  await page.keyboard.press(backTab);
  await expect(background).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel.locator('.cll-upload-panel__confirm')).toHaveCount(0);
  await expect(panel.locator('.cll-upload-panel__cancel-all')).toBeFocused();
});

test('forms binding keeps the control value in sync', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await selectFiles(page, 'upload-demo-forms', [zipFile('form.zip')]);
  await expect(page.getByTestId('upload-demo-form-value')).toContainText('1');

  await page.getByRole('button', {name: 'Reset'}).click();
  await expect(page.getByTestId('upload-demo-form-value')).toContainText('0');
});

test('composition transfers, registers and refreshes the query list', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await page.getByTestId('upload-demo-transfer').click();

  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 1 files');
  await expect(page.getByTestId('upload-demo-registered-composition')).toContainText('1');
  await expect(page.getByTestId('upload-demo-bundles')).toContainText('container-image.tar');
});

test('a keyboard-only journey opens the file chooser and restores the panel @cross-browser-smoke', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  const browse = page.getByTestId('upload-demo-basic').getByRole('button', {name: 'Browse'});
  await browse.focus();
  await expect(browse).toBeFocused();
  const chooser = page.waitForEvent('filechooser');
  await browse.press('Space');
  await (await chooser).setFiles([zipFile('keyboard.zip')]);

  const panel = page.locator('.cll-upload-panel');
  await expect(panel).toContainText('keyboard.zip');

  await panel.locator('.cll-upload-panel__minimize').press('Enter');
  const badge = panel.locator('.cll-upload-panel__badge');
  await expect(badge).toBeVisible();
  await badge.focus();
  await expect(badge).toBeFocused();
  await badge.press('Enter');
  await expect(panel.getByRole('button', {name: 'Minimize'})).toBeVisible();
});

test('error rows expose keyboard-operable Retry and Remove actions', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  await selectFiles(page, 'upload-demo-failure', [zipFile('failing.zip')]);

  const panel = page.locator('.cll-upload-panel');
  const errorRow = panel.locator('.cll-upload-panel__item[data-status="error"]');
  await expect(errorRow).toBeVisible();

  const retry = errorRow.getByRole('button', {name: 'Retry'});
  await retry.focus();
  await expect(retry).toBeFocused();
  await retry.press('Enter');
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 1 files');

  await selectFiles(page, 'upload-demo-failure', [zipFile('failing.zip')]);
  const nextError = panel.locator('.cll-upload-panel__item[data-status="error"]');
  await expect(nextError).toBeVisible();
  const remove = nextError.getByRole('button', {name: /Dismiss failing\.zip/});
  await remove.focus();
  await expect(remove).toBeFocused();
  await remove.press('Enter');
  await expect(panel.locator('.cll-upload-panel__item[data-status="error"]')).toHaveCount(0);
});

test('ngModel and signal-form facade bindings reflect the selected files', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await selectHostFiles(page, 'upload-demo-forms', 1, [zipFile('model.zip')]);
  await expect(page.getByTestId('upload-demo-ngmodel-value')).toContainText('1');

  await selectHostFiles(page, 'upload-demo-forms', 2, [zipFile('signal.zip')]);
  await expect(page.getByTestId('upload-demo-signal-form-value')).toContainText('1');
});

test('the upload playground and an active panel pass accessibility checks', async ({page}, testInfo) => {
  await page.goto('/clr-lift/components/upload');
  await expect(page.getByTestId('upload-demo-basic').getByRole('button', {name: 'Browse', exact: true})).toBeVisible();
  await expectAccessible(page, testInfo, '[data-testid="upload-demo-basic"]');

  await selectFiles(page, 'upload-demo-basic', [zipFile('a11y.zip')]);
  await expect(page.locator('.cll-upload-panel')).toContainText('a11y.zip');
  await expectAccessible(page, testInfo, '.cll-upload-panel');
});

test('HttpClient adapter maps stubbed progress events and reports success @cross-browser-smoke', async ({page}) => {
  await page.route('**/api/upload/**', (route) => route.fulfill({status: 200, body: 'ok'}));
  await page.addInitScript(() => {
    (window as unknown as {__uploadDemoStub?: boolean}).__uploadDemoStub = false;
  });
  await page.goto('/clr-lift/components/upload');

  await page.getByTestId('upload-demo-http-transfer').click();
  await expect(page.getByTestId('upload-demo-http-result')).toHaveText('success');
  await page.locator('.cll-upload-panel__done').click();
  await expect(page.getByTestId('upload-demo-http-transfer')).toBeFocused();
});

test('HttpClient adapter surfaces a stubbed server failure', async ({page}) => {
  await page.route('**/api/upload/**', (route) => route.fulfill({status: 500, body: 'boom'}));
  await page.addInitScript(() => {
    (window as unknown as {__uploadDemoStub?: boolean}).__uploadDemoStub = false;
  });
  await page.goto('/clr-lift/components/upload');

  await page.getByTestId('upload-demo-http-transfer').click();
  await expect(page.getByTestId('upload-demo-http-result')).not.toHaveText('');
  await expect(page.getByTestId('upload-demo-http-result')).not.toHaveText('success');
});

test('cancelling an HTTP transfer settles completion with the abort error', async ({page}) => {
  await page.route('**/api/upload/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 4_000));
    await route.fulfill({status: 200, body: 'ok'});
  });
  await page.addInitScript(() => {
    (window as unknown as {__uploadDemoStub?: boolean}).__uploadDemoStub = false;
  });
  await page.goto('/clr-lift/components/upload');

  await page.getByTestId('upload-demo-http-transfer').click();
  const item = page.locator('.cll-upload-panel__item').filter({hasText: 'http-bundle.zip'});
  await expect(item).toBeVisible();
  await item.getByRole('button', {name: 'Cancel'}).click();
  await expect(page.getByTestId('upload-demo-http-result')).toContainText(/cancel/i);
});

const queuedItemCount = async (page: import('@playwright/test').Page) => {
  await page.waitForFunction(() => Boolean((window as unknown as {__uploadQueue?: unknown}).__uploadQueue));
  return page.evaluate(
    () =>
      (window as unknown as {__uploadQueue: {snapshot(): {items: readonly unknown[]}}}).__uploadQueue.snapshot().items
        .length,
  );
};

test('advanced staging waits for the required destination @cross-browser-smoke', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  const before = await queuedItemCount(page);

  await selectFiles(page, 'upload-demo-confirm-first', [zipFile('staged.zip')]);

  await expect(page.getByTestId('upload-demo-confirm')).toBeVisible();
  expect(await queuedItemCount(page)).toBe(before);

  await expect(page.getByTestId('upload-demo-confirm')).toBeDisabled();
  await page.locator('clr-modal input[clrInput]').fill('archive');
  await page.getByTestId('upload-demo-confirm').click();
  await expect(page.locator('.cll-upload-panel')).toContainText('staged.zip');
  expect(await queuedItemCount(page)).toBe(before + 1);
  await page.locator('.cll-upload-panel__done').click();
  await expect(
    page.getByTestId('upload-demo-confirm-first').getByRole('button', {name: 'Browse', exact: true}),
  ).toBeFocused();
});

test('the minimized panel survives in-app navigation and restores @cross-browser-smoke', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  await page.getByTestId('upload-demo-add-files').click();

  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__item').first()).toBeVisible();
  await panel.locator('.cll-upload-panel__minimize').click();

  const badge = panel.locator('.cll-upload-panel__badge');
  await expect(badge).toBeVisible();
  const before = await queuedItemCount(page);

  await page.locator('.header-nav').getByRole('link', {name: 'ngx-lift', exact: true}).click();
  await expect(page).not.toHaveURL(/\/clr-lift\/components\/upload/);
  await expect(badge).toBeVisible();
  expect(await queuedItemCount(page)).toBe(before);

  await badge.click();
  await expect(panel.locator('.cll-upload-panel__item').first()).toBeVisible();
});

test('row retry, remove and cancel preserve keyboard focus on a stable window control', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  await selectFiles(page, 'upload-demo-failure', [zipFile('failing.zip')]);
  const panel = page.locator('.cll-upload-panel');
  const header = panel.locator('.cll-upload-panel__minimize');
  const retry = panel.locator('[data-status="error"]').getByRole('button', {name: 'Retry', exact: true});
  await retry.focus();
  await retry.press('Enter');
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 1 files');
  await expect(header).toBeFocused();

  await selectFiles(page, 'upload-demo-failure', [zipFile('failing.zip')]);
  const remove = panel.locator('[data-status="error"]').getByRole('button', {name: /Dismiss failing/});
  await remove.focus();
  await remove.press('Enter');
  await expect(header).toBeFocused();

  await selectFiles(page, 'upload-demo-panel', [zipFile('cancel-focus.zip')]);
  const cancel = panel.locator('[data-status="uploading"]').getByRole('button', {name: 'Cancel', exact: true});
  await cancel.focus();
  await cancel.press('Enter');
  await expect(panel).toContainText('Cancelled');
  await expect(header).toBeFocused();
});

test('picker validation has an associated live error description', async ({page}, testInfo) => {
  await page.goto('/clr-lift/components/upload');
  const picker = await selectFiles(page, 'upload-demo-basic', [
    {name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('x')},
  ]);
  const input = picker.locator('input[type="file"]').first();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  const live = picker.locator('[aria-live="polite"]');
  await expect(live).toContainText('bad.txt');
  const id = await live.getAttribute('id');
  await expect(input).toHaveAttribute('aria-describedby', String(id));
  await expect(picker.getByRole('button', {name: 'Browse', exact: true})).toHaveAttribute(
    'aria-describedby',
    String(id),
  );
  await expect(page.getByTestId('upload-demo-basic').getByRole('button', {name: 'Browse', exact: true})).toBeVisible();
  await expectAccessible(page, testInfo, '[data-testid="upload-demo-basic"]');
});

test('modal files upload automatically and only one transfer view stays interactive', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  const launcher = page.getByTestId('upload-demo-modal-open');
  await launcher.click();
  const modal = page.locator('clr-modal').filter({has: page.locator('cll-upload')});
  await modal.locator('cll-upload input[type="file"]').first().setInputFiles(zipFile('modal.zip'));
  await expect(modal.locator('details')).toContainText('Uploaded 1 files');
  await expect(page.locator('.cll-upload-panel__card')).toHaveCount(0);
  await modal.getByRole('button', {name: 'Close', exact: true}).click();
  await expect(launcher).toBeFocused();
  await expect.poll(() => queuedItemCount(page)).toBe(0);
});

test('mixed folder intake keeps valid files and skips a repeated file with an informational notice', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  const host = page.getByTestId('upload-demo-basic').locator('cll-upload');
  const zone = host.locator('.cll-upload__dropzone');
  const transfer = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(['bundle'], 'same.zip', {type: 'application/zip', lastModified: 7}));
    transfer.items.add(new File(['bundle'], 'same.zip', {type: 'application/zip', lastModified: 7}));
    transfer.items.add(new File(['notes'], 'notes.txt', {type: 'text/plain', lastModified: 7}));
    return transfer;
  });
  await expect(page.locator('.cll-upload-panel')).toBeAttached();
  await zone.dispatchEvent('drop', {dataTransfer: transfer});
  await expect(host.locator('.alert-danger')).toContainText('notes.txt');
  await expect(host.locator('.alert-info')).toContainText('same.zip');
  await expect(page.getByTestId('upload-demo-registered')).toContainText('1');
  await expect.poll(() => queuedItemCount(page)).toBe(1);
  await host.locator('.alert-info').getByRole('button').click();
  await expect(page.locator('.cll-upload-panel__summary-list')).toContainText('same.zip');
});

test('an intended modal minimize cannot turn into destructive Close when the upload settles', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  await page.getByTestId('upload-demo-modal-open').click();
  const modal = page.locator('clr-modal').filter({has: page.locator('cll-upload')});
  await modal.locator('input[type="file"]').first().setInputFiles(zipFile('activation.zip'));
  const minimize = modal.getByRole('button', {name: 'Minimize to background', exact: true});
  await minimize.focus();
  await page.keyboard.down('Space');
  await expect(modal.getByRole('button', {name: 'Close', exact: true})).toBeVisible();
  await page.keyboard.up('Space');
  await expect.poll(() => queuedItemCount(page)).toBe(1);
});
