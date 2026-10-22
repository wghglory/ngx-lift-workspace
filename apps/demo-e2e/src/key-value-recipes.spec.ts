import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/key-value-inputs');
});

test('row fields stay aligned with unequal errors and actions have space', async ({page}, testInfo) => {
  const example = page.getByTestId('key-value-model');
  const editor = example.locator('cll-key-value-control');
  await editor.getByRole('button', {name: 'Add', exact: true}).click();
  await editor.getByRole('textbox', {name: 'Key 2', exact: true}).fill('team');
  await editor.getByRole('textbox', {name: 'Value 2', exact: true}).fill('other');
  for (const width of [1280, 768]) {
    await page.setViewportSize({width, height: 900});
    const key = await editor.getByRole('textbox', {name: 'Key 2', exact: true}).boundingBox();
    const value = await editor.getByRole('textbox', {name: 'Value 2', exact: true}).boundingBox();
    expect(Math.abs((key?.y ?? NaN) - (value?.y ?? NaN))).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await page.setViewportSize({width: 390, height: 900});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const remove = editor.getByRole('button', {name: 'Delete 1', exact: true});
  await expect(remove).toHaveText('');
  await expect(remove.locator('clr-icon')).toHaveAttribute('shape', 'times');
  await expect(editor.locator('legend')).toHaveClass('clr-sr-only');
  await expect(example.getByRole('textbox', {name: 'Enabled sibling'})).toHaveCount(0);
  await expect(example.getByRole('button', {name: 'Submit', exact: true})).toHaveClass('btn btn-primary');
  const sibling = await editor.boundingBox();
  const submit = await example.getByRole('button', {name: 'Submit', exact: true}).boundingBox();
  expect((submit?.y ?? NaN) - ((sibling?.y ?? NaN) + (sibling?.height ?? NaN))).toBeGreaterThanOrEqual(12);
  await page.setViewportSize({width: 1280, height: 1000});
  await example.screenshot({path: testInfo.outputPath('aligned-errors.png')});
});

test('all select combinations update stored values and dependent choices reset', async ({page}) => {
  for (const id of ['keySelect', 'valueSelect', 'bothSelect']) {
    const example = page.getByTestId(`key-value-${id}`);
    const selects = example.locator('select');
    await expect(selects).toHaveCount(id === 'bothSelect' ? 2 : 1);
    await selects.first().selectOption(id === 'valueSelect' ? 'staging' : 'cost-center');
    await expect(example.getByTestId('recipe-value')).toContainText(id === 'valueSelect' ? 'staging' : 'cost-center');
    await example.getByRole('button', {name: 'Reset', exact: true}).click();
    await expect(example.getByTestId('recipe-value')).toContainText('environment');
  }
  const dependent = page.getByTestId('key-value-dependent');
  await dependent.getByRole('combobox', {name: 'Key 1', exact: true}).selectOption('cost-center');
  const value = dependent.getByRole('combobox', {name: 'Value 1', exact: true});
  await expect(value).toHaveValue('');
  await expect(value).toHaveAttribute('aria-invalid', 'false');
  await expect(value.locator('option', {hasText: 'production'})).toHaveCount(0);
  await value.selectOption('engineering');
  await expect(dependent.getByTestId('recipe-value')).toContainText('engineering');
});

test('tags permit repeated categories, reject duplicate pairs and display custom errors', async ({page}) => {
  const tags = page.getByTestId('key-value-tags');
  const key = tags.getByRole('textbox', {name: 'Key 1', exact: true});
  await expect(key).toHaveAttribute('aria-invalid', 'false');
  await tags.getByRole('textbox', {name: 'Value 2', exact: true}).fill('alpha');
  await key.focus();
  await expect(tags.getByText('Key and value must be unique together')).toHaveCount(1);
  await tags.getByRole('textbox', {name: 'Value 2', exact: true}).fill('beta');
  await key.fill(' category');
  await tags.getByRole('button', {name: 'Reset', exact: true}).focus();
  await expect(tags.locator('.error').filter({hasText: 'Do not start or end with whitespace'})).toBeVisible();
});

test('schema keys are searchable and typed values survive edits and reset', async ({page}) => {
  const schema = page.getByTestId('key-value-schema');
  await expect(schema.getByRole('spinbutton', {name: 'Value 1', exact: true})).toHaveValue('3');
  await expect(schema.getByRole('checkbox', {name: 'Value 2', exact: true})).not.toBeChecked();
  await schema.getByRole('spinbutton', {name: 'Value 1', exact: true}).fill('8');
  await expect(schema.getByTestId('recipe-value')).toContainText('"value": 8');
  await schema.getByRole('button', {name: 'Add', exact: true}).click();
  const key = schema.getByRole('combobox', {name: 'Key 4', exact: true});
  await expect(key).toBeFocused();
  await key.pressSequentially('host');
  await page.getByRole('option', {name: 'hostname', exact: true}).click();
  await schema.getByRole('textbox', {name: 'Value 4', exact: true}).fill('node.example');
  await expect(schema.getByRole('button', {name: 'Add', exact: true})).toBeDisabled();
  await expect(schema.getByTestId('recipe-value')).toContainText('node.example');
  await schema.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(schema.getByRole('spinbutton', {name: 'Value 1', exact: true})).toHaveValue('3');
  await expect(schema.getByRole('textbox', {name: 'Value 3', exact: true})).toHaveValue('one.example\ntwo.example');
});

test('advanced editors and errors pass accessibility checks', async ({page}, testInfo) => {
  await page
    .getByTestId('key-value-dependent')
    .getByRole('combobox', {name: 'Key 1', exact: true})
    .selectOption('cost-center');
  await page.getByTestId('key-value-dependent').getByRole('combobox', {name: 'Value 1', exact: true}).focus();
  await page.getByTestId('key-value-dependent').getByRole('button', {name: 'Reset', exact: true}).focus();
  await expect(
    page.getByTestId('key-value-dependent').getByRole('combobox', {name: 'Value 1', exact: true}),
  ).toHaveAttribute('aria-invalid', 'true');
  await expectAccessible(page, testInfo);
});

test('searchable choices support keyboard selection, Escape and accessible open popups', async ({page}, testInfo) => {
  const schema = page.getByTestId('key-value-schema');
  await schema.getByRole('button', {name: 'Add', exact: true}).click();
  const key = schema.getByRole('combobox', {name: 'Key 4', exact: true});
  await key.pressSequentially('host');
  await expect(page.getByRole('option', {name: 'hostname', exact: true})).toBeVisible();
  await expectAccessible(page, testInfo);
  await key.press('Escape');
  await expect(key).toBeFocused();
  await expect(key).toHaveAttribute('aria-expanded', 'false');
  await key.press('ArrowDown');
  await key.press('Enter');
  await expect(schema.getByTestId('recipe-value')).toContainText('hostname');
});

test('required select placeholders are prompts and new rows select real keys', async ({page}) => {
  const example = page.getByTestId('key-value-keySelect');
  await example.getByRole('button', {name: 'Add', exact: true}).click();
  const key = example.getByRole('combobox', {name: 'Key 2', exact: true});
  await expect(key).toBeFocused();
  await expect(key).toHaveValue('');
  await expect(key.locator('option').first()).toHaveText('Key');
  await expect(key.locator('option').first()).toBeDisabled();
  await expect(key.locator('option').first()).toHaveAttribute('hidden', '');
  await expect(key.getByRole('option')).toHaveText(['environment', 'cost-center']);
  await key.selectOption('cost-center');
  const value = example.getByRole('textbox', {name: 'Value 2', exact: true});
  await expect(value).toHaveAttribute('placeholder', 'Value');
  await value.fill('engineering');
  await expect(example.getByTestId('recipe-value')).toContainText('engineering');
  await expect(key).toHaveAttribute('aria-invalid', 'false');
  const sections = page.locator('app-key-value-inputs-demo h2');
  await expect(sections).toHaveText([
    'Bind the list as one form control',
    'Choose editors for your data',
    'Manage row controls with FormArray',
    'API Reference',
  ]);
});

test('disabled Add explains its reason and recipe code has no empty sections', async ({page}) => {
  const model = page.getByTestId('key-value-model');
  const add = model.getByRole('button', {name: 'Add', exact: true});
  await model.getByRole('checkbox', {name: 'Disabled', exact: true}).check();
  await expect(add).toHaveAccessibleDescription('Enable the editor to add rows');
  await expect(model.getByText('Enable the editor to add rows')).toBeVisible();
  await model.getByRole('checkbox', {name: 'Readonly', exact: true}).check();
  await expect(add).toHaveAccessibleDescription('Enable the editor to add rows');
  await model.getByRole('checkbox', {name: 'Disabled', exact: true}).uncheck();
  await expect(add).toHaveAccessibleDescription('Turn off readonly mode to add rows');
  await model.getByRole('checkbox', {name: 'Readonly', exact: true}).uncheck();
  await expect(add).toHaveAccessibleDescription('');
  await add.click();
  await expect(model.getByRole('textbox', {name: 'Key 2', exact: true})).toBeFocused();
  await add.click();
  await expect(add).toHaveAccessibleDescription('At most 3 rows are allowed');
  const schema = page.getByTestId('key-value-schema');
  await schema.getByRole('button', {name: 'Add', exact: true}).click();
  await schema.getByRole('combobox', {name: 'Key 4', exact: true}).pressSequentially('host');
  await page.getByRole('option', {name: 'hostname', exact: true}).click();
  await expect(schema.getByRole('button', {name: 'Add', exact: true})).toHaveAccessibleDescription(
    'All available keys are already in use',
  );
  for (const id of ['keySelect', 'valueSelect', 'bothSelect', 'dependent', 'tags', 'schema']) {
    const code = await page
      .getByTestId('key-value-' + id)
      .locator('code.language-typescript')
      .textContent();
    expect(code).not.toMatch(/\n[ \t]*\n[ \t]*\n/);
    expect(code).not.toContain('[uniquePairs]="false"');
  }
  await expect(page.getByTestId('key-value-starter').getByRole('heading')).toHaveText(
    'FormArray: edit individual rows',
  );
});
