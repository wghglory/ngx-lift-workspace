import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';
import {demoLocales, dictionaryMessages} from './support/demo-locales';

const demoFile = (locale: string) => `apps/demo/src/app/core/l10n/demo.l10n.${locale.toLowerCase()}.ts`;

test.describe('toSignalForm signal-driven forms', () => {
  test('synchronizes form controls and updates live state panel', async ({page}) => {
    await page.goto('/ngx-lift/signals/toSignalForm');

    // Check region select
    const regionSelect = page.locator('#region-select');
    await expect(regionSelect).toBeVisible();

    // Select US West region
    await regionSelect.selectOption('us-west-1');

    // Verify helper badge updates
    await expect(page.locator('.label.label-success', {hasText: 'Multi-Zone HA Supported'})).toBeVisible();

    // Select postgres engine
    const pgRadio = page.locator('#engine-pg');
    await page.locator('label[for="engine-pg"]').click();
    await expect(pgRadio).toBeChecked();

    // Fill cluster name input
    const clusterNameInput = page.locator('#cluster-name-input');
    await clusterNameInput.fill('production-cluster');
    await expect(clusterNameInput).toHaveValue('production-cluster');
  });

  test('submission options recompute all three payloads by keyboard and stay accessible', async ({page}, testInfo) => {
    await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
    await page.goto('/ngx-lift/signals/toSignalForm');

    const lab = page.getByRole('region', {name: 'Submission options lab', exact: true});
    const raw = page.getByTestId('options-lab-raw');
    const formValue = page.getByTestId('options-lab-form-value');
    const submit = page.getByTestId('options-lab-submit-value');

    await expect(lab.getByRole('heading', {name: 'Submission options lab', exact: true})).toBeVisible();
    await expect(raw).toContainText('eu-central-1');
    await expect(formValue).not.toContainText('eu-central-1');
    await expect(submit).toContainText('eu-central-1');
    await expect(submit).toContainText('"nickname": ""');

    const includeDisabled = lab.getByRole('switch', {name: /includeDisabled/});
    await expect(includeDisabled).toBeChecked();
    await includeDisabled.focus();
    await includeDisabled.press('Space');
    await expect(includeDisabled).not.toBeChecked();
    await expect(submit).not.toContainText('eu-central-1');

    await lab.getByRole('switch', {name: /omitEmptyStrings/}).check();
    await expect(submit).not.toContainText('"nickname"');
    await lab.getByRole('switch', {name: /omitNull/}).check();
    await expect(submit).not.toContainText('"deletedAt"');
    await lab.getByRole('switch', {name: /omitIf/}).check();
    await expect(submit).not.toContainText('"internalCode"');
    await lab.getByRole('switch', {name: /omit\b/}).check();
    await expect(submit).not.toContainText('"confirmEmail"');
    await lab.getByRole('switch', {name: /deep/}).check();
    await expect(submit).not.toContainText('"city"');
    await expect(submit).not.toContainText('""');

    await lab.getByRole('button', {name: 'Reset', exact: true}).click();
    await expect(submit).toContainText('eu-central-1');
    await expect(submit).toContainText('"nickname": ""');
    await expectAccessible(page, testInfo);
  });
});

for (const {code} of demoLocales) {
  test(`submission options lab is localized for ${code}`, async ({page}) => {
    const messages = dictionaryMessages(demoFile(code));
    await page.addInitScript((locale) => localStorage.setItem('clr-lift-lang', locale), code);
    await page.goto('/ngx-lift/signals/toSignalForm');

    const lab = page.getByRole('region', {name: messages['toSignalForm.optionsLabTitle'], exact: true});
    await expect(lab.getByRole('heading', {name: messages['toSignalForm.optionsLabTitle'], exact: true})).toBeVisible();
    await expect(lab.getByRole('button', {name: messages['toSignalForm.optionsLabReset'], exact: true})).toBeVisible();
    await expect(page.locator('body')).not.toContainText('!! Key');
    await expect(page.locator('html')).toHaveAttribute('lang', code);
  });
}

for (const theme of ['light', 'dark']) {
  test(`submission options lab stays accessible with every option on in ${theme}`, async ({page}, testInfo) => {
    await page.addInitScript((activeTheme) => {
      localStorage.setItem('clr-lift-lang', 'en');
      localStorage.setItem('cds-theme', activeTheme);
    }, theme);
    await page.goto('/ngx-lift/signals/toSignalForm');

    const lab = page.getByRole('region', {name: 'Submission options lab', exact: true});
    for (const name of [/omitEmptyStrings/, /omitNull/, /omitIf/, /omit\b/, /deep/]) {
      await lab.getByRole('switch', {name}).check();
    }
    await expect(page.locator('body')).toHaveAttribute('cds-theme', theme);
    await expect(page.getByTestId('options-lab-submit-value')).not.toContainText('"nickname"');
    await expectAccessible(page, testInfo);
  });
}
