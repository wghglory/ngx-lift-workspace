import {expect, test} from '@playwright/test';

test.describe('Alert closable', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/alert');
  });

  test('renders a localized close button on a closable alert', async ({page}) => {
    const warning = page.locator('cll-alert', {hasText: 'You can dismiss me.'});
    await expect(warning).toBeVisible();

    const closeButton = warning.getByRole('button', {name: 'Close', exact: true});
    await expect(closeButton).toBeVisible();
    // Button is keyboard-focusable.
    await closeButton.focus();
    await expect(closeButton).toBeFocused();
  });

  test('hides the close button when closable is false', async ({page}) => {
    const persistent = page.locator('cll-alert', {hasText: 'Persistent notice.'});
    await expect(persistent).toBeVisible();
    await expect(persistent.locator('button.close')).toHaveCount(0);
  });

  test('removes the alert when the close button is clicked', async ({page}) => {
    const warning = page.locator('cll-alert', {hasText: 'You can dismiss me.'});
    await expect(warning).toBeVisible();

    await warning.getByRole('button', {name: 'Close', exact: true}).click();
    await expect(warning).toHaveCount(0);
  });

  test('closes the alert with the keyboard', async ({page}) => {
    const warning = page.locator('cll-alert', {hasText: 'You can dismiss me.'});
    const closeButton = warning.getByRole('button', {name: 'Close', exact: true});
    await closeButton.focus();
    await page.keyboard.press('Enter');
    await expect(warning).toHaveCount(0);
  });
});
