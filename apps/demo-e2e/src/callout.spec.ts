import {expect, test} from '@playwright/test';

test.describe('Callout component', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/callout');
  });

  test('renders page container with Callout title and overview', async ({page}) => {
    await expect(page.locator('h1')).toContainText('Callout');
    await expect(page.locator('p').first()).toContainText('cll-callout');
  });

  test('renders callout containers with role alert and SVG icon', async ({page}) => {
    const callouts = page.locator('cll-callout');
    await expect(callouts).toHaveCount(3);

    const firstCalloutContainer = callouts.first().locator('.callout-container');
    await expect(firstCalloutContainer).toBeVisible();
    await expect(firstCalloutContainer).toHaveAttribute('role', 'alert');

    // Verify SVG icon exists
    const icon = firstCalloutContainer.locator('svg.callout-icon');
    await expect(icon).toBeAttached();
  });

  test('displays projected lists, links, and badge elements inside callouts', async ({page}) => {
    const callouts = page.locator('cll-callout');

    // Example 2 with external documentation link
    const link = callouts.nth(1).locator('a');
    await expect(link).toContainText('Clarity Design System documentation');
    await expect(link).toHaveAttribute('href', 'https://clarity.design');

    // Example 3 with badges and title
    const badges = callouts.nth(2).locator('.label');
    await expect(badges).toHaveCount(2);
    await expect(badges.first()).toContainText('Deployment');
    await expect(badges.nth(1)).toContainText('Validated');
  });
});
