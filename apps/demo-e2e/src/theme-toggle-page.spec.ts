import {expect, test} from '@playwright/test';

test.describe('ThemeToggle demo page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/theme-toggle');
  });

  test('toggles theme when clicking component button in example', async ({page}) => {
    const exampleToggle = page.locator('article cll-theme-toggle button').first();
    await expect(exampleToggle).toBeVisible();

    const initialTheme = await page.evaluate(() => document.body.getAttribute('cds-theme') ?? 'light');

    await exampleToggle.click();

    const updatedTheme = await page.evaluate(() => document.body.getAttribute('cds-theme'));
    expect(updatedTheme).not.toBe(initialTheme);

    // Toggle back
    await exampleToggle.click();
    const finalTheme = await page.evaluate(() => document.body.getAttribute('cds-theme') ?? 'light');
    expect(finalTheme).toBe(initialTheme);
  });

  test('programmatically sets dark and light theme via ThemeService buttons', async ({page}) => {
    const darkBtn = page.getByRole('button', {name: 'Set Dark Theme', exact: true});
    const lightBtn = page.getByRole('button', {name: 'Set Light Theme', exact: true});

    await darkBtn.click();
    let theme = await page.evaluate(() => document.body.getAttribute('cds-theme'));
    expect(theme).toBe('dark');

    await lightBtn.click();
    theme = await page.evaluate(() => document.body.getAttribute('cds-theme'));
    expect(theme).toBe('light');
  });
});
