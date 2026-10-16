import {expect, test} from '@playwright/test';

test('bounded pagination demo completes and can be run again', async ({page}) => {
  await page.goto('/ngx-lift/operators/kubernetesPagination');
  const fetch = page.getByRole('button', {name: 'Fetch Paginated Pods', exact: true});
  for (let run = 0; run < 2; run++) {
    await fetch.click();
    await expect(fetch).toBeDisabled();
    await expect(page.getByText('Aggregation Complete', {exact: true})).toBeVisible();
    await expect(page.getByRole('table').first().getByRole('row')).toHaveCount(6);
    await expect(fetch).toBeEnabled();
  }
});

test('distinguishes page and item caps, shows errors, and recovers', async ({page}) => {
  await page.goto('/ngx-lift/operators/kubernetesPagination');
  const fetch = page.getByRole('button', {name: 'Fetch Paginated Pods', exact: true});
  const pages = page.getByLabel('maxPages', {exact: true});
  const items = page.getByLabel('maxItems', {exact: true});
  const progress = page.getByText('Pages fetched (including the first):', {exact: false});
  const error = page.locator('cll-alert');

  await pages.selectOption({label: '1'});
  await fetch.click();
  await expect(error).toContainText('maxPages');
  await expect(progress).toHaveText('Pages fetched (including the first): 1');
  await expect(page.getByText('Aggregation Complete', {exact: true})).toHaveCount(0);

  await pages.selectOption({label: '3'});
  await items.selectOption({label: '3'});
  await fetch.click();
  await expect(error).toContainText('maxItems');
  await expect(progress).toHaveText('Pages fetched (including the first): 2');
  await expect(page.getByText('Aggregation Complete', {exact: true})).toHaveCount(0);

  await items.selectOption({label: '5'});
  await fetch.click();
  await expect(page.getByText('Aggregation Complete', {exact: true})).toBeVisible();
  await expect(error).toHaveCount(0);
  await expect(progress).toHaveText('Pages fetched (including the first): 3');
  await expect(page.getByRole('table').first().getByRole('row')).toHaveCount(6);
});
