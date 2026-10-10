import {expect, test} from '@playwright/test';

import {dictionaryMessages} from './support/demo-locales';
import {expectAccessible} from './support/accessibility';

const route = '/ngx-lift/utilities/object-path';
const english = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.en.ts');
const chinese = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.zh-cn.ts');

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto(route);
});

test('reads own nested values and rejects prototype paths', async ({page}) => {
  await expect(page.getByTestId('object-path-resolved')).toContainText('alice@example.com');

  const read = page.getByTestId('object-path-read');
  await read.fill('user.profile.roles.1');
  await expect(page.getByTestId('object-path-resolved')).toContainText('editor');

  await read.fill('user.profile.contact.missing');
  await expect(page.getByTestId('object-path-resolved')).toContainText(english['objectPath.emptyValue']);

  await read.fill('__proto__.polluted');
  await expect(page.getByTestId('object-path-resolved')).toContainText(english['objectPath.unsafePath']);
});

test('deletes, reports repeated deletes and resets with keyboard access', async ({page}, testInfo) => {
  await expect(page.getByTestId('object-path-sample')).toContainText('+1-555-0100');

  const apply = page.getByTestId('object-path-apply');
  await apply.focus();
  await apply.press('Enter');
  await expect(page.getByTestId('object-path-status')).toContainText(english['objectPath.deleteSuccess']);
  await expect(page.getByTestId('object-path-sample')).not.toContainText('+1-555-0100');

  await apply.press('Enter');
  await expect(page.getByTestId('object-path-status')).toContainText(english['objectPath.deleteFailure']);

  await page.getByTestId('object-path-reset').press('Enter');
  await expect(page.getByTestId('object-path-status')).toBeEmpty();
  await expect(page.getByTestId('object-path-sample')).toContainText('+1-555-0100');

  await expectAccessible(page, testInfo, 'main');
});

test('rejects an unsafe delete path', async ({page}) => {
  await page.getByTestId('object-path-delete').fill('constructor.prototype');
  await page.getByTestId('object-path-apply').click();
  await expect(page.getByTestId('object-path-status')).toContainText(english['objectPath.unsafePath']);
  await expect(page.getByTestId('object-path-sample')).toContainText('+1-555-0100');
});

test('renders Chinese labels without missing keys', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'zh-CN'));
  await page.reload();

  await expect(page.getByTestId('object-path-playground')).toContainText(chinese['objectPath.playgroundTitle']);
  await expect(page.getByTestId('object-path-resolved')).toContainText('alice@example.com');
  await page.getByTestId('object-path-apply').click();
  await expect(page.getByTestId('object-path-status')).toContainText(chinese['objectPath.deleteSuccess']);
  await expect(page.locator('body')).not.toContainText('!! Key');
});
