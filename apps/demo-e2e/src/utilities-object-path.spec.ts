import {expect, test, type Page} from '@playwright/test';

import {dictionaryMessages} from './support/demo-locales';
import {expectAccessible} from './support/accessibility';

const route = '/ngx-lift/utilities/object-path';
const english = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.en.ts');
const chinese = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.zh-cn.ts');
const german = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.de.ts');

function controls(page: Page, messages: Record<string, string>) {
  return {
    read: page.getByRole('textbox', {name: messages['objectPath.readPathLabel'], exact: true}),
    remove: page.getByRole('textbox', {name: messages['objectPath.deletePathLabel'], exact: true}),
    apply: page.getByRole('button', {name: messages['objectPath.applyDelete'], exact: true}),
    reset: page.getByRole('button', {name: messages['objectPath.reset'], exact: true}),
    status: page.getByRole('status'),
    resolved: page.getByRole('region', {name: messages['objectPath.resolvedTitle'], exact: true}),
    sample: page.getByRole('region', {name: messages['objectPath.sampleTitle'], exact: true}),
  };
}

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto(route);
});

test('reads own nested values and rejects prototype paths', async ({page}) => {
  const ui = controls(page, english);
  await expect(ui.resolved).toContainText('alice@example.com');

  await ui.read.fill('user.profile.roles.1');
  await expect(ui.resolved).toContainText('editor');

  await ui.read.fill('user.profile.contact.missing');
  await expect(ui.resolved).toContainText(english['objectPath.emptyValue']);

  await ui.read.fill('__proto__.polluted');
  await expect(ui.resolved).toContainText(english['objectPath.emptyValue']);
  expect(await page.evaluate(() => Object.hasOwn(Object.prototype, 'polluted'))).toBe(false);
});

test('deletes, reports repeated deletes and resets with keyboard access', async ({page}, testInfo) => {
  const ui = controls(page, english);
  await expect(ui.sample).toContainText('+1-555-0100');

  await ui.apply.focus();
  await ui.apply.press('Enter');
  await expect(ui.status).toContainText(english['objectPath.deleteSuccess']);
  await expect(ui.sample).not.toContainText('+1-555-0100');

  await ui.apply.press('Enter');
  await expect(ui.status).toContainText(english['objectPath.deleteFailure']);

  await ui.reset.press('Enter');
  await expect(ui.status).toBeEmpty();
  await expect(ui.sample).toContainText('+1-555-0100');

  await expectAccessible(page, testInfo, 'main');
});

test('rejects an unsafe delete path through the library', async ({page}) => {
  const ui = controls(page, english);
  await ui.remove.fill('constructor.prototype');
  await ui.apply.click();
  await expect(ui.status).toContainText(english['objectPath.deleteFailure']);
  await expect(ui.sample).toContainText('+1-555-0100');
});

test('renders Chinese labels without missing keys', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'zh-CN'));
  await page.reload();

  const ui = controls(page, chinese);
  await expect(ui.apply).toBeVisible();
  await expect(ui.resolved).toContainText('alice@example.com');
  await ui.apply.click();
  await expect(ui.status).toContainText(chinese['objectPath.deleteSuccess']);
  await expect(page.locator('body')).not.toContainText('!! Key');
});

for (const theme of ['light', 'dark']) {
  test(`compact RTL stays readable at 390px with long labels in ${theme}`, async ({page}, testInfo) => {
    await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'de'));
    await page.reload();
    await page.evaluate((value) => {
      document.body.setAttribute('cds-theme', value);
      document.body.setAttribute('clr-density', 'compact');
      document.documentElement.dir = 'rtl';
    }, theme);
    await page.setViewportSize({width: 390, height: 800});

    const ui = controls(page, german);
    await expect(ui.read).toBeVisible();
    await expect(ui.apply).toBeVisible();
    await expect(ui.resolved).toContainText('alice@example.com');
    await expect(page.locator('body')).not.toContainText('!! Key');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
    await expectAccessible(page, testInfo, 'main');
  });
}
