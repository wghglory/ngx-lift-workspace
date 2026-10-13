import {expect, test} from '@playwright/test';

test('switches visible API descriptions, accessible language name and document metadata', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/status-indicator');
  await expect(page.getByText('Status represented by the icon.', {exact: true})).toBeVisible();
  await page.getByRole('button', {name: 'Select Language', exact: true}).click();
  await page.getByRole('menuitem', {name: '简体中文', exact: true}).click();
  await expect(page.getByText('图标表示的状态。', {exact: true})).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('button', {name: '选择语言', exact: true})).toBeVisible();
  await expect(page.locator('body')).not.toContainText('!! Key');
});

test('shows an explicit partial-language notice while keeping English fallback usable', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'de'));
  await page.goto('/ngx-lift/query/queryResource');
  await expect(page.locator('.language-trigger .lang-text')).toHaveText('Deutsch');
  await expect(page.locator('.language-trigger [title]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('body')).not.toContainText('!! Key');
});
