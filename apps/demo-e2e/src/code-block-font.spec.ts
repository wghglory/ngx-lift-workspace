import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('highlighted code blocks use the shared mono font on the rendered code element', async ({page}) => {
  await page.goto('/ngx-lift/signals/toSignalForm');
  const code = page.locator('app-code-block pre code[class^="language-"]').first();
  await expect(code).toBeVisible();
  await expect(code).toHaveCSS('font-family', /JetBrains Mono Variable/);
  await expect(code).toHaveCSS('font-variant-ligatures', 'none');

  const font = await page.request.get('/assets/fonts/jetbrains-mono-latin-wght-normal.woff2');
  expect(font.status()).toBe(200);
});
