import {expect, test} from '@playwright/test';

test.describe('PageContainer component', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/page-container');
  });

  test('renders page title and container shell', async ({page}) => {
    await expect(page.locator('h1').first()).toContainText('Page Container');
  });

  test('renders nested demonstration containers with titles and body content', async ({page}) => {
    const exampleContainers = page.locator('app-demo-playground cll-page-container');
    await expect(exampleContainers).toHaveCount(3);

    // Example 1 title
    await expect(exampleContainers.first().locator('h1')).toContainText('User Management');

    // Example 2 renders its projected card content.
    await expect(exampleContainers.nth(1).locator('h1')).toContainText('Cluster Settings');
    await expect(exampleContainers.nth(1).locator('.card-text')).toContainText('Configured');

    // Example 3 with HTML markup in title
    const htmlTitleContainer = exampleContainers.nth(2);
    await expect(htmlTitleContainer.locator('.badge.badge-info')).toHaveText('Live');
  });
});
