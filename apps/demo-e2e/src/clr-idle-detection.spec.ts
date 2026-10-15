import {expect, test} from '@playwright/test';

test.describe('IdleDetection component', () => {
  test.beforeEach(async ({page}) => {
    await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
    await page.goto('/clr-lift/components/idle-detection');
  });

  test('renders page title and overview', async ({page}) => {
    await expect(page.locator('h1')).toContainText('Idle Detection');
  });

  test('can start and stop fast simulation', async ({page}) => {
    const startBtn = page.getByRole('button', {name: 'Start Fast Simulation (3s Idle)', exact: true});
    await expect(startBtn).toBeVisible();

    await startBtn.click();

    // Verify simulation active
    await expect(page.locator('article').first()).toContainText('Simulation Active: Yes');

    const stopBtn = page.getByRole('button', {name: 'Stop Simulation', exact: true});
    await expect(stopBtn).toBeVisible();
    await stopBtn.click();

    await expect(page.locator('article').first()).toContainText('Simulation Active: No');
  });

  test('keeps the warning open during activity until explicitly confirmed, then starts a new cycle', async ({page}) => {
    await page.clock.install();
    await page.getByRole('button', {name: 'Start Fast Simulation (3s Idle)', exact: true}).click();
    await page.clock.runFor(3100);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.mouse.move(10, 10);
    await page.keyboard.press('Shift');
    await page.clock.runFor(4000);
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('6');
    await dialog.getByRole('button', {name: 'Keep me signed in', exact: true}).click();
    await expect(dialog).toHaveCount(0);
    await page.clock.runFor(2000);
    await expect(dialog).toHaveCount(0);
    await page.clock.runFor(1200);
    await expect(dialog).toBeVisible();
    await page.mouse.move(20, 20);
    await page.clock.runFor(10000);
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('article').first()).toContainText('Timeout Triggered');
    await expect(page.locator('article').first()).toContainText('Total Timeouts: 1');
  });
});
