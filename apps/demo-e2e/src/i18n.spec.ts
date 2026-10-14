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

test('switches all secondary locales and updates mounted API descriptions without partial markers', async ({page}) => {
  test.setTimeout(60000);
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/ngx-lift/query/queryResource');
  for (const [locale, label, description] of [
    [
      'de',
      'Deutsch',
      'Reaktive Factory mit einem Observable- oder Promise-Loader; undefined deaktiviert die Ressource.',
    ],
    ['es', 'Español', 'Fábrica reactiva con un cargador de Observable o Promise, o undefined para deshabilitar.'],
    ['fr', 'Français', 'Fabrique réactive avec un chargeur Observable ou Promise ; undefined désactive la ressource.'],
    [
      'ja',
      '日本語',
      'Observable または Promise ローダーを持つリアクティブなファクトリー。undefined を返すとリソースを無効にします。',
    ],
    [
      'ko',
      '한국어',
      'Observable 또는 Promise 로더를 가진 반응형 팩터리. undefined를 반환하면 리소스를 비활성화합니다.',
    ],
    [
      'nl',
      'Nederlands',
      'Reactieve factory met een Observable- of Promise-loader; undefined schakelt de resource uit.',
    ],
    ['pt-BR', 'Português', 'Fábrica reativa com um carregador de Observable ou Promise, ou undefined para desativar.'],
    ['ru', 'Русский', 'Реактивная фабрика с загрузчиком Observable или Promise; undefined отключает ресурс.'],
  ] as const) {
    await page.locator('.language-trigger').click();
    await page.getByRole('menuitem', {name: label, exact: true}).click();
    await expect(page.locator('.language-trigger .lang-text')).toHaveText(label);
    await expect(page.locator('.language-trigger [title]')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByText(description, {exact: true})).toBeVisible();
    await expect(page.locator('body')).not.toContainText('!! Key');
  }
});
