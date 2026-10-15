import {expect, test} from '@playwright/test';

test.describe('key-value editors with toSignalForm', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/key-value-inputs');
  });

  test('edits all four combinations and saves string values instead of option labels', async ({page}) => {
    const tags = page.locator('[data-scenario="tags"]');
    await tags.locator('input').nth(0).fill('business-unit');
    await tags.locator('input').nth(1).fill('engineering');
    const parameters = page.locator('[data-scenario="parameters"]');
    await parameters.locator('select').selectOption('shared_buffers');
    await parameters.locator('input').fill('256MB');
    const assignments = page.locator('[data-scenario="assignments"]');
    await assignments.locator('input').fill('reviewer');
    await assignments.locator('select').selectOption({label: 'Security'});
    const policy = page.locator('[data-scenario="policy"]');
    await policy.locator('select').nth(0).selectOption('region');
    await expect(policy.locator('select').nth(1)).toHaveValue('');
    await expect(page.getByRole('button', {name: 'Save configuration'})).toBeDisabled();
    await policy.locator('select').nth(1).selectOption('eu-central');
    await page.getByRole('button', {name: 'Save configuration'}).click();
    const saved = page.locator('[data-saved-value]');
    await expect(saved).toBeVisible();
    expect(JSON.parse(await saved.innerText())).toEqual({
      tags: [{key: 'business-unit', value: 'engineering'}],
      parameters: [{key: 'shared_buffers', value: '256MB'}],
      assignments: [{key: 'reviewer', value: 'security'}],
      policy: [{key: 'region', value: 'eu-central'}],
    });
  });

  test('focuses new select keys, disables occupied choices and restores focus after delete', async ({page}) => {
    const policy = page.locator('[data-scenario="policy"]');
    await policy.getByRole('button', {name: 'Add', exact: true}).click();
    const second = policy.locator('[data-key-value-row="1"]');
    await expect(second.locator('select').nth(0)).toBeFocused();
    await expect(second.locator('option[value="environment"]')).toBeDisabled();
    await second.locator('select').nth(0).selectOption('region');
    await second.locator('select').nth(1).selectOption('us-east');
    await expect(policy.getByRole('button', {name: 'Add', exact: true})).toBeDisabled();
    await second.getByRole('button', {name: 'Delete 2', exact: true}).click();
    await expect(policy.locator('select').nth(0)).toBeFocused();
    await expect(policy.getByRole('button', {name: 'Add', exact: true})).toBeEnabled();
  });

  test('validates duplicate pairs, binds disabled state and restores pristine defaults', async ({page}) => {
    const tags = page.locator('[data-scenario="tags"]');
    await tags.getByRole('button', {name: 'Add', exact: true}).click();
    const second = tags.locator('[data-key-value-row="1"]');
    await second.locator('input').nth(0).fill('team');
    await second.locator('input').nth(1).fill('platform');
    await second.locator('input').nth(1).blur();
    await expect(tags.getByText('This key and value combination already exists').first()).toBeVisible();
    await expect(page.getByRole('button', {name: 'Save configuration'})).toBeDisabled();
    await second.locator('input').nth(1).fill('security');
    await expect(page.getByRole('button', {name: 'Save configuration'})).toBeEnabled();
    await page.getByRole('switch', {name: 'Enable editing'}).uncheck();
    for (const scenario of ['tags', 'parameters', 'assignments', 'policy']) {
      const editor = page.locator(`[data-scenario="${scenario}"]`);
      await expect(editor.getByRole('button', {name: 'Add', exact: true})).toBeDisabled();
      await expect(editor.locator('input, select').first()).toBeDisabled();
      await expect(editor.getByRole('button', {name: 'Delete 1', exact: true})).toBeDisabled();
    }
    await page.getByRole('button', {name: 'Restore defaults'}).click();
    await expect(page.getByRole('switch', {name: 'Enable editing'})).toBeChecked();
    await expect(tags.locator('[data-key-value-row]')).toHaveCount(1);
    await expect(page.getByRole('button', {name: 'Save configuration'})).toBeEnabled();
    const payload = JSON.parse(await page.locator('[data-submit-value]').innerText());
    expect(payload.tags).toEqual([{key: 'team', value: 'platform'}]);
    expect(payload).not.toHaveProperty('editing');
  });

  test('keeps fields inside a narrow viewport and associates every field with a label', async ({page}, testInfo) => {
    await page.setViewportSize({width: 390, height: 844});
    const fields = page.locator('cll-key-value-inputs input, cll-key-value-inputs select');
    await expect(fields).toHaveCount(8);
    for (const field of await fields.all()) {
      await field.scrollIntoViewIfNeeded();
      const bounds = await field.evaluate((element) => {
        const {x, width} = element.getBoundingClientRect();
        return {x, width};
      });
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
    }
    const labelled = await fields.evaluateAll((elements) =>
      elements.every((element) => (element as HTMLInputElement | HTMLSelectElement).labels?.length === 1),
    );
    expect(labelled).toBe(true);
    const ids = await fields.evaluateAll((elements) => elements.map((element) => element.id));
    expect(new Set(ids).size).toBe(ids.length);
    await page.locator('[data-scenario="tags"]').screenshot({path: testInfo.outputPath('key-value-mobile.png')});
  });
});
