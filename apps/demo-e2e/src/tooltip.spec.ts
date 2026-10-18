import {expect, test} from '@playwright/test';

test.describe('Tooltip component & directive', () => {
  test('displays tooltip on hover and hides on mouse leave', async ({page}) => {
    await page.goto('/clr-lift/components/tooltip');

    const trigger = page.getByRole('link', {name: 'Basic Tooltip 1'});
    await expect(trigger).toBeVisible();

    // Scroll into view first so auto-scroll does not trigger the directive's onScroll listener
    await trigger.scrollIntoViewIfNeeded();

    // Hover over the trigger
    await trigger.hover();

    // Expect tooltip content to appear with the expected text
    const tooltipContent = page.locator('cll-tooltip .tooltip-content');
    await expect(tooltipContent).toBeVisible();
    await expect(tooltipContent).toContainText('Basic Tooltip 1');

    // Move mouse away
    await page.mouse.move(0, 0);
    await expect(page.locator('cll-tooltip')).toHaveCount(0);
  });

  test('displays component ref content in tooltip without floating inside close button container', async ({page}) => {
    await page.goto('/clr-lift/components/tooltip');

    const trigger = page.getByRole('link', {name: 'Component Ref Example'});
    await expect(trigger).toBeVisible();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.hover();

    const tooltipContent = page.locator('cll-tooltip .tooltip-content');
    await expect(tooltipContent).toBeVisible();
    await expect(tooltipContent.locator('cll-alert')).toBeVisible();
    await expect(tooltipContent.locator('cll-alert')).toContainText('I am from the alert component');

    // Verify the alert is a sibling of .content-container, not inside it
    const insideContentContainer = await tooltipContent.locator('.content-container cll-alert').count();
    expect(insideContentContainer).toBe(0);
  });
});

test('keyboard focus opens a text tooltip and Escape closes it', async ({page}) => {
  await page.goto('/clr-lift/components/tooltip');
  const trigger = page.getByRole('link', {name: 'Basic Tooltip 1'});
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await expect(page.getByRole('tooltip')).toContainText('Basic Tooltip 1');
  await expect(trigger).toBeFocused();
  await trigger.press('Escape');
  await expect(page.locator('cll-tooltip')).toHaveCount(0);
});

test('interactive content exposes a dialog with a trigger relationship', async ({page}) => {
  await page.goto('/clr-lift/components/tooltip');
  const trigger = page.getByRole('link', {name: 'Component Ref Example'});
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await expect(page.getByRole('dialog', {name: 'Details'})).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(trigger).toHaveAttribute('aria-controls', /cll-tooltip-/);
  await page.keyboard.press('Escape');
  await expect(page.locator('cll-tooltip')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
