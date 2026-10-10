import {expect, test} from '@playwright/test';

import {dictionaryMessages} from './support/demo-locales';
import {expectAccessible} from './support/accessibility';

const route = '/ngx-lift/utilities/file-download';
const english = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.en.ts');
const chinese = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.zh-cn.ts');

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto(route);
});

test('validates a blank file name before submission', async ({page}) => {
  await page.getByTestId('download-file-name').fill('   ');
  await expect(page.getByTestId('download-file-error')).toContainText(english['downloadFile.emptyNameError']);
  await expect(page.getByTestId('download-file-start')).toBeDisabled();
  await expect(page.getByTestId('download-file-status')).toBeEmpty();
});

test('starts a download through the keyboard and announces the localized status', async ({page}, testInfo) => {
  const start = page.getByTestId('download-file-start');
  await start.focus();
  const downloadPromise = page.waitForEvent('download');
  await start.press('Enter');
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('report.txt');
  await expect(page.getByTestId('download-file-status')).toContainText(
    english['downloadFile.startedStatus'].replace('{0}', 'report.txt'),
  );
  await expectAccessible(page, testInfo, 'main');
});

test('uses the edited file name and content', async ({page}) => {
  await page.getByTestId('download-file-name').fill('notes.txt');
  await page.getByTestId('download-file-content').fill('localized browser content');
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-file-start').click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('notes.txt');
  await expect(page.getByTestId('download-file-status')).toContainText(
    english['downloadFile.startedStatus'].replace('{0}', 'notes.txt'),
  );
});

test('renders Chinese labels without missing keys', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'zh-CN'));
  await page.reload();

  await expect(page.getByTestId('download-file-playground')).toContainText(chinese['downloadFile.playgroundTitle']);
  await expect(page.getByRole('button', {name: chinese['downloadFile.startButton']})).toBeEnabled();
  await page.getByTestId('download-file-name').fill('   ');
  await expect(page.getByTestId('download-file-error')).toContainText(chinese['downloadFile.emptyNameError']);
  await expect(page.locator('body')).not.toContainText('!! Key');
});
