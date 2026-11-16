import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';
import {dictionaryMessages} from './support/demo-locales';

const english = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.en.ts');
const german = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.de.ts');

test.describe('English validator journeys', () => {
  test.beforeEach(async ({page}) => {
    await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  });

  test('integerValidator validates a replica count and recovers from errors', async ({page}, testInfo) => {
    await page.goto('/ngx-lift/validators/integer');
    const input = page.getByRole('textbox', {name: english['integerValidator.firstLabel'], exact: true});
    const status = page.getByTestId('integer-status');
    const clear = page.getByRole('button', {name: english['common.clear'], exact: true});

    await expect(page.getByRole('heading', {level: 1})).toHaveText('integerValidator');
    await expect(status).toContainText(english['standardValidators.statusInvalid']);

    await input.fill('3');
    await input.blur();
    await expect(status).toContainText(english['standardValidators.statusValid']);

    await input.fill('3.5');
    await input.blur();
    await expect(page.getByText(english['integerValidator.firstError'])).toBeVisible();
    await expect(status).toContainText(english['standardValidators.statusInvalid']);

    await clear.focus();
    await clear.press('Enter');
    await expect(input).toHaveValue('');
    await expect(status).toContainText(english['standardValidators.statusInvalid']);
    await expectAccessible(page, testInfo, 'main');
  });

  test('jsonValidator distinguishes valid JSON text from malformed text', async ({page}, testInfo) => {
    await page.goto('/ngx-lift/validators/json');
    const input = page.getByRole('textbox', {name: english['jsonValidator.firstLabel'], exact: true});
    const status = page.getByTestId('json-status');

    await input.fill('{"enabled": true}');
    await input.blur();
    await expect(status).toContainText(english['standardValidators.statusValid']);

    await input.fill('{enabled: true}');
    await input.blur();
    await expect(page.getByText(english['jsonValidator.firstError'])).toBeVisible();
    await expect(status).toContainText(english['standardValidators.statusInvalid']);

    await input.fill('{"enabled": false}');
    await input.blur();
    await expect(page.getByText(english['jsonValidator.firstError'])).toBeHidden();
    await expect(input).toHaveValue('{"enabled": false}');
    await expect(status).toContainText(english['standardValidators.statusValid']);
    await expectAccessible(page, testInfo, 'main');
  });

  test('fileExtensionValidator validates a name and a real file selection', async ({page}, testInfo) => {
    await page.goto('/ngx-lift/validators/file-extension');
    const name = page.getByRole('textbox', {name: english['fileExtensionValidator.firstLabel'], exact: true});
    const files = page.getByTestId('file-extension-files');

    await name.fill('photo.PNG');
    await name.blur();
    await expect(name).toHaveValue('photo.PNG');
    await name.fill('notes.txt');
    await name.blur();
    await expect(page.getByTestId('file-extension-file-error')).toHaveCount(0);
    await expect(page.getByText(english['fileExtensionValidator.firstError']).first()).toBeVisible();

    await files.setInputFiles({name: 'photo.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('image')});
    await expect(page.getByTestId('file-extension-names')).toContainText('photo.jpg');
    await expect(page.getByTestId('file-extension-file-error')).toHaveCount(0);

    await files.setInputFiles({name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('text')});
    await expect(page.getByTestId('file-extension-file-error')).toContainText(
      english['fileExtensionValidator.firstError'],
    );

    const clear = page.getByTestId('file-extension-reset');
    await clear.click();
    await expect(files).toHaveValue('');
    await expect(name).toHaveValue('');
    await expect(page.getByTestId('file-extension-names')).toHaveCount(0);
    await expect(page.getByTestId('file-extension-file-error')).toHaveCount(0);

    await files.setInputFiles({name: 'photo.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('image')});
    await expect(page.getByTestId('file-extension-names')).toContainText('photo.jpg');

    const disable = page.getByTestId('file-extension-disable');
    const status = page.getByTestId('file-extension-status');
    await disable.focus();
    await disable.press('Enter');
    await expect(status).toContainText(english['standardValidators.statusDisabled']);
    await expect(files).toBeDisabled();
    await disable.press('Enter');
    await expect(status).not.toContainText(english['standardValidators.statusDisabled']);
    await expect(files).toBeEnabled();
    await expectAccessible(page, testInfo, 'main');
  });

  test('numberRangeValidator reports a group error and clears it after correction', async ({page}, testInfo) => {
    await page.goto('/ngx-lift/validators/number-range');
    const error = page.getByTestId('number-range-error');
    const status = page.getByTestId('number-range-status');
    const clear = page.getByRole('button', {name: english['common.clear'], exact: true});

    await expect(error).toContainText(english['numberRangeValidator.groupError']);
    await page.getByTestId('number-range-max').fill('20');
    await expect(error).toBeEmpty();
    await expect(status).toContainText(english['standardValidators.statusValid']);

    await clear.focus();
    await clear.press('Enter');
    await expect(page.getByTestId('number-range-min')).toHaveValue('');
    await expect(error).toBeEmpty();
    await expectAccessible(page, testInfo, 'main');
  });

  test('passwordMatchValidator keeps child errors independent of the group error', async ({page}, testInfo) => {
    await page.goto('/ngx-lift/validators/password-match');
    const password = page.getByTestId('password-match-password');
    const confirmation = page.getByTestId('password-match-confirm');
    const error = page.getByTestId('password-match-error');
    const status = page.getByTestId('password-match-status');

    await password.fill('secret123');
    await confirmation.fill('secret124');
    await confirmation.blur();
    await expect(error).toContainText(english['passwordMatchValidator.groupError']);

    await password.fill('short');
    await password.blur();
    await expect(page.getByText(english['passwordMatchValidator.minLengthError'])).toBeVisible();
    await expect(error).toContainText(english['passwordMatchValidator.groupError']);

    await password.fill('secret123');
    await confirmation.fill('secret123');
    await expect(error).toBeEmpty();
    await expect(status).toContainText(english['standardValidators.statusValid']);
    await expectAccessible(page, testInfo, 'main');
  });
});

test('the new validator pages render translated messages after a language switch', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'de'));
  const pages = [
    {route: '/ngx-lift/validators/integer', key: 'integerValidator.overview'},
    {route: '/ngx-lift/validators/json', key: 'jsonValidator.overview'},
    {route: '/ngx-lift/validators/file-extension', key: 'fileExtensionValidator.overview'},
    {route: '/ngx-lift/validators/number-range', key: 'numberRangeValidator.overview'},
    {route: '/ngx-lift/validators/password-match', key: 'passwordMatchValidator.overview'},
  ];
  for (const {route, key} of pages) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('main p').first()).toContainText(german[key]);
    await expect(page.locator('main h2').first()).toContainText(german['common.liveDemo']);
    await expect(page.locator('body')).not.toContainText('!! Key');
  }
});

test('switching language at runtime updates validator page messages', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/ngx-lift/validators/password-match');
  const overview = page.locator('main p').first();
  await expect(overview).toContainText(english['passwordMatchValidator.overview']);

  await page.getByRole('button', {name: english['header.selectLanguage'], exact: true}).click();
  await page.getByRole('menuitem', {name: 'Deutsch', exact: true}).click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(overview).toContainText(german['passwordMatchValidator.overview']);
  await expect(page.getByRole('button', {name: german['common.clear'], exact: true})).toBeVisible();
  await expect(page.locator('body')).not.toContainText('!! Key');
});
