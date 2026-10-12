import {expect, test} from '@playwright/test';

test.describe('ThemeToggle component', () => {
  test('toggles cds-theme between light and dark', async ({page}) => {
    await page.goto('/');

    const themeToggle = page.locator('cll-theme-toggle button');
    await expect(themeToggle).toBeVisible();

    // Check initial body cds-theme or light/dark attribute
    const initialTheme = await page.evaluate(() => document.body.getAttribute('cds-theme') ?? 'light');

    // Click theme toggle
    await themeToggle.click();

    // Verify theme changed
    const newTheme = await page.evaluate(() => document.body.getAttribute('cds-theme'));
    expect(newTheme).not.toBe(initialTheme);

    // Click again to toggle back
    await themeToggle.click();
    const revertedTheme = await page.evaluate(() => document.body.getAttribute('cds-theme') ?? 'light');
    expect(revertedTheme).toBe(initialTheme);
  });
});
