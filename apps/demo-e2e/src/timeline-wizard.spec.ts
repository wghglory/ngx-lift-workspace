import {expect, test} from '@playwright/test';

test.describe('TimelineWizard component', () => {
  test('navigates through wizard steps and displays step data', async ({page}) => {
    await page.goto('/clr-lift/components/timeline-wizard');

    const wizard = page.locator('cll-timeline-wizard');
    await wizard.scrollIntoViewIfNeeded();
    await expect(wizard).toBeVisible();

    // Verify initial step (Configure Operator)
    await expect(wizard.locator('clr-timeline-step-title', {hasText: 'Configure Operator'})).toBeVisible();

    // Verify next button is visible
    const nextBtn = wizard.getByRole('button', {name: /next/i});
    await expect(nextBtn).toBeVisible();

    // Move to step 2 (Configure Service)
    await nextBtn.click();
    await expect(wizard.locator('clr-timeline-step-title', {hasText: 'Configure Service'})).toBeVisible();

    // Move to step 3 (Configure Runtime Properties)
    await nextBtn.click();
    await expect(wizard.locator('clr-timeline-step-title', {hasText: 'Configure Runtime Properties'})).toBeVisible();

    // Verify previous button takes us back
    const prevBtn = wizard.getByRole('button', {name: /previous/i});
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();
    await expect(wizard.locator('clr-timeline-step-title', {hasText: 'Configure Service'})).toBeVisible();
  });
});
