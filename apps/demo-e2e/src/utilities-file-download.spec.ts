import {expect, test, type Page} from '@playwright/test';

import {dictionaryMessages} from './support/demo-locales';
import {expectAccessible} from './support/accessibility';

const route = '/ngx-lift/utilities/file-download';
const english = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.en.ts');
const chinese = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.zh-cn.ts');
const german = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.de.ts');

function controls(page: Page, messages: Record<string, string>) {
  return {
    fileName: page.getByRole('textbox', {name: messages['downloadFile.fileNameLabel'], exact: true}),
    content: page.getByRole('textbox', {name: messages['downloadFile.contentLabel'], exact: true}),
    start: page.getByRole('button', {name: messages['downloadFile.startButton'], exact: true}),
    status: page.getByRole('status'),
    error: page.getByText(messages['downloadFile.emptyNameError'], {exact: true}),
  };
}

test.beforeEach(async ({page}) => {
  await page.goto(route);
  await page.evaluate(() => localStorage.setItem('demo-lang', 'en'));
  await page.reload();
});

test('validates a blank file name before submission', async ({page}) => {
  const ui = controls(page, english);
  await ui.fileName.fill('   ');
  await expect(ui.error).toBeVisible();
  await expect(ui.start).toBeDisabled();
  await expect(ui.status).toBeEmpty();
});

test('starts a download through the keyboard and announces the localized status', async ({page}, testInfo) => {
  const ui = controls(page, english);
  await ui.start.focus();
  const downloadPromise = page.waitForEvent('download');
  await ui.start.press('Enter');
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('report.txt');
  await expect(ui.status).toContainText(english['downloadFile.startedStatus'].replace('{0}', 'report.txt'));
  await expectAccessible(page, testInfo, 'main');
});

test('uses the edited file name and content', async ({page}) => {
  const ui = controls(page, english);
  await ui.fileName.fill('notes.txt');
  await ui.content.fill('localized browser content');
  const downloadPromise = page.waitForEvent('download');
  await ui.start.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('notes.txt');
  await expect(ui.status).toContainText(english['downloadFile.startedStatus'].replace('{0}', 'notes.txt'));
});

test('renders Chinese labels without missing keys', async ({page}) => {
  await page.evaluate(() => localStorage.setItem('demo-lang', 'zh-CN'));
  await page.reload();

  const ui = controls(page, chinese);
  await expect(ui.start).toBeEnabled();
  await ui.fileName.fill('   ');
  await expect(ui.error).toBeVisible();
  await expect(page.locator('body')).not.toContainText('!! Key');
});

for (const theme of ['light', 'dark']) {
  test(`compact RTL stays readable at 390px with long labels in ${theme}`, async ({page}, testInfo) => {
    await page.evaluate(() => localStorage.setItem('demo-lang', 'de'));
    await page.reload();
    await page.evaluate((value) => {
      document.body.setAttribute('cds-theme', value);
      document.body.setAttribute('clr-density', 'compact');
      document.documentElement.dir = 'rtl';
    }, theme);
    await page.setViewportSize({width: 390, height: 800});

    const ui = controls(page, german);
    await expect(ui.fileName).toBeVisible();
    await expect(ui.start).toBeVisible();
    await expect(page.locator('body')).not.toContainText('!! Key');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
    await expectAccessible(page, testInfo, 'main');
  });
}
