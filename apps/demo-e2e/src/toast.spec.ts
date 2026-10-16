import {expect, test} from '@playwright/test';

test.describe('Toast interaction lifetime', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/toast');
    await page.clock.install();
    await page.getByRole('button', {name: 'Error Toast', exact: true}).click();
  });

  test('retains a focused toast when the pointer leaves', async ({page}) => {
    const toast = page.locator('cll-toast', {hasText: 'Error Toast'});
    const action = toast.getByRole('button', {name: 'More Info', exact: true});
    await action.hover();
    await action.focus();
    await page.mouse.move(0, 0);
    await page.clock.fastForward(10_000);
    await expect(action).toBeFocused();
    await expect(toast).toBeVisible();

    await action.blur();
    await page.clock.fastForward(10_000);
    await expect(toast).toHaveCount(0);
  });

  test('retains a hovered toast when keyboard focus leaves', async ({page}) => {
    const toast = page.locator('cll-toast', {hasText: 'Error Toast'});
    const action = toast.getByRole('button', {name: 'More Info', exact: true});
    await action.hover();
    await action.focus();
    await action.blur();
    await page.clock.fastForward(10_000);
    await expect(toast).toBeVisible();

    await page.mouse.move(0, 0);
    await page.clock.fastForward(10_000);
    await expect(toast).toHaveCount(0);
  });
});
