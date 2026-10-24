import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';
import {demoLocales, dictionaryMessages} from './support/demo-locales';

const route = '/clr-lift/components/key-value-inputs';

test.describe('key/value array form control', () => {
  test.beforeEach(async ({page}) => {
    await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
    await page.goto(route);
  });

  test('ngModel preserves invalid rows, corrects duplicates, recovers focus and resets repeatedly', async ({page}) => {
    const example = page.getByTestId('key-value-model');
    const editor = example.locator('cll-key-value-control');
    const keys = editor.getByRole('textbox', {name: /^Key /});
    await editor.getByRole('button', {name: 'Add', exact: true}).press('Enter');
    await expect(keys.nth(1)).toBeFocused();
    await expect(keys.nth(1)).toHaveAttribute('aria-invalid', 'false');
    await expect(keys.nth(1)).toHaveAttribute('placeholder', 'Key');
    await editor.getByRole('textbox', {name: 'Value 2', exact: true}).focus();
    await expect(keys.nth(1)).toHaveAttribute('aria-invalid', 'true');
    await keys.nth(1).fill('team');
    await editor.getByRole('textbox', {name: 'Value 2', exact: true}).fill('app');
    await expect(keys.first()).toHaveAttribute('aria-invalid', 'false');
    await example.getByRole('button', {name: 'Submit', exact: true}).click();
    await expect(example.getByTestId('payload')).toHaveText('null');
    await keys.nth(1).fill('service');
    await expect(keys.first()).toHaveAttribute('aria-invalid', 'false');
    await example.getByRole('button', {name: 'Submit', exact: true}).press('Enter');
    await expect(example.getByTestId('payload')).toContainText('service');
    await editor.getByRole('button', {name: 'Delete 2', exact: true}).press('Enter');
    await expect(keys.first()).toBeFocused();
    await editor.getByRole('button', {name: 'Delete 1', exact: true}).press('Enter');
    await expect(editor.getByRole('button', {name: 'Add', exact: true})).toBeFocused();
    await expect(keys).toHaveCount(0);
    await expect(example.getByTestId('value')).toContainText('"labels": []');
    for (let repeat = 0; repeat < 2; repeat++) {
      await example.getByRole('button', {name: 'Reset', exact: true}).click();
      await expect(keys.first()).toHaveValue('team');
      await expect(example.getByTestId('state')).toContainText('"touched": false');
      await keys.first().press('Tab');
      await expect(editor.getByRole('textbox', {name: 'Value 1', exact: true})).toBeFocused();
      await expect(example.getByTestId('state')).toContainText('"touched": false');
      await example.getByRole('button', {name: 'Submit', exact: true}).focus();
      await expect(example.getByTestId('state')).toContainText('"touched": true');
    }
  });

  test('Reactive Forms buffers blur edits and preserves disabled/readonly payload policy', async ({page}) => {
    const example = page.getByTestId('key-value-reactive');
    const editor = example.locator('cll-key-value-control');
    const value = editor.getByRole('textbox', {name: 'Value 1', exact: true});
    await value.fill('blur-commit');
    await editor.getByRole('textbox', {name: 'Key 1', exact: true}).focus();
    await expect(example.getByTestId('value')).not.toContainText('blur-commit');
    await example.getByRole('button', {name: 'Submit', exact: true}).focus();
    await expect(example.getByTestId('value')).toContainText('blur-commit');
    await example.getByRole('checkbox', {name: 'Disabled', exact: true}).check();
    await expect(value).toBeDisabled();
    await example.getByRole('button', {name: 'Submit', exact: true}).click();
    await expect(example.getByTestId('payload')).toHaveText('null');
    await example.getByRole('checkbox', {name: 'Disabled', exact: true}).uncheck();
    await expect(value).toHaveValue('blur-commit');
    await example.getByRole('checkbox', {name: 'Readonly', exact: true}).check();
    await expect(value).toHaveAttribute('readonly', '');
    await expect(editor.getByRole('button', {name: 'Add', exact: true})).toBeDisabled();
    await value.focus();
    await value.press('x');
    await expect(value).toHaveValue('blur-commit');
    await example.getByRole('button', {name: 'Submit', exact: true}).click();
    await expect(example.getByTestId('payload')).toContainText('blur-commit');
    await example.getByRole('checkbox', {name: 'Readonly', exact: true}).uncheck();
    await expect(editor.getByRole('button', {name: 'Delete 1', exact: true})).toBeDisabled();
    await editor.getByRole('button', {name: 'Add', exact: true}).click();
    await expect(editor.getByRole('textbox', {name: 'Key 2', exact: true})).toBeFocused();
    await editor.getByRole('button', {name: 'Add', exact: true}).click();
    await expect(editor.getByRole('textbox')).toHaveCount(6);
    await expect(editor.getByRole('button', {name: 'Add', exact: true})).toBeDisabled();
  });

  test('toSignalForm sees submit commits, invalid correction and disabled state on the original group', async ({
    page,
  }) => {
    const example = page.getByTestId('key-value-facade');
    const key = example.getByRole('textbox', {name: 'Key 1', exact: true});
    await key.fill('');
    await expect(example.getByTestId('signals')).toContainText('team');
    await example.getByRole('button', {name: 'Submit', exact: true}).press('Enter');
    await expect(example.getByTestId('payload')).toHaveText('null');
    await expect(example.getByTestId('signals')).toContainText('INVALID');
    await key.fill('corrected');
    await example.getByRole('button', {name: 'Submit', exact: true}).press('Enter');
    await expect(example.getByTestId('payload')).toContainText('corrected');
    await expect(example.getByTestId('signals')).toContainText('VALID');
    await example.getByRole('checkbox', {name: 'Disabled', exact: true}).check();
    await example.getByRole('button', {name: 'Submit', exact: true}).click();
    await expect(example.getByTestId('signals')).toContainText('DISABLED');
    await expect(example.getByTestId('payload')).toContainText('corrected');
    await example.getByRole('checkbox', {name: 'Disabled', exact: true}).uncheck();
    await example.getByRole('button', {name: 'Reset', exact: true}).click();
    await expect(key).toHaveValue('team');
    await expect(example.getByTestId('signals')).toContainText('"touched": false');
  });

  test('repeated route disposal cancels queued row focus', async ({page}) => {
    for (let repeat = 0; repeat < 2; repeat++) {
      await page.getByTestId('key-value-model').getByRole('button', {name: 'Add', exact: true}).click();
      await page.goto('/clr-lift/components/spinner');
      await page.goto(route);
      await expect(page.getByTestId('key-value-model').getByRole('textbox', {name: 'Key 1', exact: true})).toHaveValue(
        'team',
      );
    }
  });
});

for (const theme of ['light', 'dark']) {
  test(`array editor accessibility, narrow layout, compact and RTL (${theme})`, async ({page}, testInfo) => {
    await page.addInitScript((theme) => {
      localStorage.setItem('clr-lift-lang', 'en');
      localStorage.setItem('cds-theme', theme);
    }, theme);
    await page.setViewportSize({width: 390, height: 844});
    await page.goto(route);
    await expect(page.getByRole('heading', {name: 'Bind the list as one form control', exact: true})).toBeVisible();
    await expect(page.getByTestId('key-value-facade').getByRole('textbox', {name: 'Key 1', exact: true})).toHaveValue(
      'team',
    );
    await expect(
      page.getByTestId('key-value-starter').getByRole('button', {name: 'add key value', exact: true}),
    ).toBeVisible();
    await expectAccessible(page, testInfo);
    const editor = page.getByTestId('key-value-model').locator('cll-key-value-control');
    await editor.getByRole('button', {name: 'Add', exact: true}).click();
    await expect(editor.getByRole('textbox', {name: 'Key 2', exact: true})).toBeFocused();
    await expectAccessible(page, testInfo);
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
      document.body.setAttribute('clr-density', 'compact');
    });
    await expect(editor.getByRole('button', {name: 'Delete 2', exact: true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await editor.getByRole('button', {name: 'Delete 2', exact: true}).press('Enter');
    await expect(editor.getByRole('textbox', {name: 'Key 1', exact: true})).toBeFocused();
    await expectAccessible(page, testInfo);
  });
}

for (const {code, label} of demoLocales) {
  const messages = dictionaryMessages(`apps/demo/src/app/core/l10n/demo.l10n.${code.toLowerCase()}.ts`);
  const alternateCode = code === 'en' ? 'zh-cn' : 'en';
  const alternateLabel = code === 'en' ? '简体中文' : 'English';
  const alternateMessages = dictionaryMessages(`apps/demo/src/app/core/l10n/demo.l10n.${alternateCode}.ts`);
  const library = dictionaryMessages('libs/clr-lift/src/lib/components/key-value-inputs/key-value.l10n.ts', code);
  test(`array editor translates all three hosts and switches language without clearing rows (${code})`, async ({
    page,
  }) => {
    await page.addInitScript((locale) => localStorage.setItem('clr-lift-lang', locale), code);
    await page.setViewportSize({width: 390, height: 844});
    await page.goto(route);
    for (const mode of ['model', 'reactive', 'facade']) {
      const example = page.getByTestId(`key-value-${mode}`);
      await expect(
        example.getByRole('heading', {name: messages[`keyValueControl.${mode}Title`], exact: true}),
      ).toBeVisible();
      await expect(example.getByRole('textbox', {name: `${library['key']} 1`, exact: true})).toHaveValue('team');
    }
    const example = page.getByTestId('key-value-model');
    const key = example.getByRole('textbox', {name: `${library['key']} 1`, exact: true});
    await key.fill('saved-row');
    await example.getByRole('button', {name: library['add'], exact: true}).click();
    await expect(example).not.toContainText(library['required']);
    await example.getByRole('textbox', {name: `${library['value']} 2`, exact: true}).focus();
    await expect(example).toContainText(library['required']);
    await page.getByRole('button', {name: messages['header.selectLanguage'], exact: true}).click();
    await page.getByRole('menuitem', {name: alternateLabel, exact: true}).click();
    await expect(example.locator('cll-key-value-control input').first()).toHaveValue('saved-row');
    await expect(example.locator('cll-key-value-control input')).toHaveCount(4);
    await page.getByRole('button', {name: alternateMessages['header.selectLanguage'], exact: true}).click();
    await page.getByRole('menuitem', {name: label, exact: true}).click();
    await expect(example.getByRole('button', {name: `${library['delete']} 2`, exact: true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}
