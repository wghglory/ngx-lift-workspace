import {expect, test} from '@playwright/test';

test.describe('Multiple alerts actions', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/multi-alerts');
  });

  test('renders an inline button in the sentence that is clearly visible without hover', async ({page}, testInfo) => {
    const button = page.locator('cll-alert-container').locator('#click-target');
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveClass(/alert-action/);

    const alertText = page.locator('cll-alert-container').locator('.alert-text', {has: page.locator('#click-target')});
    await expect(alertText).toBeVisible();

    // Verify button has visible non-transparent white text and border without needing hover
    const styles = await button.evaluate((element) => {
      const cs = getComputedStyle(element);
      return {
        color: cs.color,
        borderColor: cs.borderColor,
      };
    });
    expect(styles.color).toBe('rgb(255, 255, 255)');
    expect(styles.borderColor).toBe('rgb(255, 255, 255)');

    await testInfo.attach('interactive-alert', {
      body: await page.locator('cll-alert-container').screenshot(),
      contentType: 'image/png',
    });
    const dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      return message;
    });
    await button.click();
    expect(await dialogPromise).toBe('You did it correctly!');
  });

  test('activates the inline action from the keyboard', async ({page}) => {
    const button = page.locator('cll-alert-container').locator('#click-target');
    await button.focus();
    await expect(button).toBeFocused();
    const dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      return message;
    });
    await page.keyboard.press('Enter');
    expect(await dialogPromise).toBe('You did it correctly!');
  });

  test('renders trailing action buttons and invokes their callbacks', async ({page}) => {
    // Navigate to the alert with action buttons using the pager
    const nextAlertBtn = page.locator('button.alerts-pager-button[aria-label*="Next"]');
    await nextAlertBtn.click();

    const detailsBtn = page.locator('cll-alert-container').getByRole('button', {name: 'Details', exact: true});
    await expect(detailsBtn).toBeVisible();

    const dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      return message;
    });
    await detailsBtn.click();
    expect(await dialogPromise).toBe('Details action clicked!');
  });

  test('supports all demo interactions: add standard, add inline, add action, and clear', async ({page}) => {
    const container = page.locator('cll-alert-container');

    // Clear all alerts
    await page.getByRole('button', {name: 'Clear All Alerts', exact: true}).click();
    await expect(container.locator('clr-alert')).toHaveCount(0);

    // Add standard alert
    await page.getByRole('button', {name: 'Add Standard Alert', exact: true}).click();
    await expect(container.locator('clr-alert')).toHaveCount(1);
    await expect(container.locator('.alert-text')).toContainText('New standard alert added on');

    // Add alert with inline button
    await page.getByRole('button', {name: 'Add Alert with Inline Button', exact: true}).click();
    await expect(container.locator('clr-alert')).toHaveCount(2);
    const inlineBtn = container.locator('#inline-click-target');
    await expect(inlineBtn).toBeVisible();

    // Add alert with action button
    await page.getByRole('button', {name: 'Add Alert with Action', exact: true}).click();
    await expect(container.locator('clr-alert')).toHaveCount(3);
    const ackBtn = container.getByRole('button', {name: 'Acknowledge', exact: true});
    await expect(ackBtn).toBeVisible();
  });
});
