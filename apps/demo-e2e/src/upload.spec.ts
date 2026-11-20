import {expect, test} from '@playwright/test';

test('uploads a bundle, registers it, and minimizes the shared panel', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  const playground = page.getByTestId('upload-demo-basic');
  await playground.locator('input[type="file"]').setInputFiles({
    name: 'bundle.zip',
    mimeType: 'application/zip',
    buffer: Buffer.from('release bundle'),
  });

  const panel = page.locator('.cll-upload-panel');
  await expect(panel).toContainText('bundle.zip');
  await expect(page.getByTestId('upload-demo-registered')).toContainText('1');

  await panel.getByRole('button', {name: 'Minimize'}).click();
  const badge = panel.getByRole('button', {name: 'Restore upload progress'});
  await expect(badge).toBeVisible();
  await badge.click();
  await expect(panel.getByRole('button', {name: 'Minimize'})).toBeVisible();
});

test('rejects a disallowed file without registering it', async ({page}) => {
  await page.goto('/clr-lift/components/upload');

  const playground = page.getByTestId('upload-demo-basic');
  await playground.locator('input[type="file"]').setInputFiles({
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not a bundle'),
  });

  await expect(playground).toContainText('This file type is not allowed.');
  await expect(page.getByTestId('upload-demo-registered')).toContainText('0');
});
