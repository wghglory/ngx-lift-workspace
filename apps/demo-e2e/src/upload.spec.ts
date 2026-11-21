import {expect, test} from '@playwright/test';

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

test('uploads a bundle, registers it, and minimizes the shared panel', async ({page}) => {
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

test('adds files by dropping them onto the dropzone', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  const dropzone = page.getByTestId('upload-demo-basic').locator('.cll-upload__dropzone');
  const dataTransfer = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(['release bundle'], 'dropped.zip', {type: 'application/zip'}));
    return transfer;
  });
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

test('retries a failed item from the footer until it succeeds', async ({page}) => {
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

  await panel.locator('.cll-upload-panel__clear-completed').click();
  await expect(panel.locator('.cll-upload-panel__card')).toHaveCount(0);
});

test('closing with active items keeps uploads running in the background', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await page.getByTestId('upload-demo-add-files').click();
  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__item').first()).toBeVisible();

  await panel.locator('.cll-upload-panel__close').click();
  const confirmation = panel.locator('.cll-upload-panel__confirm');
  await expect(confirmation).toBeVisible();

  await panel.locator('.cll-upload-panel__confirm-background').click();
  await expect(panel.locator('.cll-upload-panel__badge')).toBeVisible();
  await expect(panel).toContainText('background');

  // uploads continue: restore and wait for the summary
  await panel.locator('.cll-upload-panel__badge').click();
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 3 files');
});

test('cancel-all in the confirmation closes the panel and clears the queue', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await page.getByTestId('upload-demo-add-files').click();
  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__item').first()).toBeVisible();

  await panel.locator('.cll-upload-panel__close').click();
  await panel.locator('.cll-upload-panel__confirm-cancel').click();
  await expect(panel.locator('.cll-upload-panel__card')).toHaveCount(0);
  await expect(panel.locator('.cll-upload-panel__badge')).toHaveCount(0);
});

test('the keyboard drives window controls and the confirmation', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  await page.getByTestId('upload-demo-add-files').click();
  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('.cll-upload-panel__item').first()).toBeVisible();

  await panel.locator('.cll-upload-panel__expand').focus();
  await page.keyboard.press('Enter');
  await expect(panel.locator('.cll-upload-panel__list--compact')).toBeVisible();
  await page.keyboard.press('Enter');

  await panel.locator('.cll-upload-panel__close').focus();
  await page.keyboard.press('Enter');
  await expect(panel.locator('.cll-upload-panel__confirm')).toBeVisible();

  await panel.locator('.cll-upload-panel__confirm-background').focus();
  await page.keyboard.press('Enter');
  await expect(panel.locator('.cll-upload-panel__badge')).toBeVisible();
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
