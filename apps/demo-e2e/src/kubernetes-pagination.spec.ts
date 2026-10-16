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
