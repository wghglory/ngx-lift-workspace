import {expect, test} from '@playwright/test';

import {demoLocales, dictionaryMessages} from './support/demo-locales';
import {demoRoutes} from './support/demo-routes';
import {visitDemoTabs} from './support/demo-tabs';

const demoFile = (locale: string) => `apps/demo/src/app/core/l10n/demo.l10n.${locale.toLowerCase()}.ts`;
const library = 'libs/clr-lift/src/lib/components/';

for (const {code, label} of demoLocales) {
  const messages = dictionaryMessages(demoFile(code));
  const inlineButtonLabel = messages['multiAlerts.inlineMessage'].match(/<button[^>]*>([^<]+)<\/button>/)?.[1];
  if (!inlineButtonLabel) throw new Error(`Missing localized inline action for ${code}`);
  const statusMessages = dictionaryMessages(library + 'status-indicator/status-indicator.l10n.ts', code);
  const fileMessages = dictionaryMessages(library + 'file-reader/file-reader.l10n.ts', code);
  const alternate = code === 'en' ? 'zh-CN' : 'en';
  const alternateMessages = dictionaryMessages(demoFile(alternate));
  const alternateStatus = dictionaryMessages(library + 'status-indicator/status-indicator.l10n.ts', alternate);
  const alternateLanguage = demoLocales.find((locale) => locale.code === alternate);
  if (!alternateLanguage) throw new Error(`Missing alternate locale ${alternate}`);
  const alternateLabel = alternateLanguage.label;

  test(`all demo routes and library labels support ${code}`, async ({page}) => {
    test.setTimeout(180_000);
    await page.setViewportSize({width: 390, height: 844});
    await page.addInitScript((locale) => localStorage.setItem('clr-lift-lang', locale), code);
    for (const route of demoRoutes) {
      await test.step(route, async () => {
        await page.goto(route);
        await expect(page.getByRole('button', {name: messages['header.selectLanguage'], exact: true})).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', code);
        await expect(page.locator('main h1').first()).not.toBeEmpty();
        await expect(page.locator('body')).not.toContainText('!! Key');
        expect
          .soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route)
          .toBe(true);
        await visitDemoTabs(page, async () => {
          await expect(page.locator('body')).not.toContainText('!! Key');
          expect
            .soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route)
            .toBe(true);
        });
      });
    }
    await page.goto('/clr-lift/components/multi-alerts');
    await expect(page.locator('cll-alert-container')).toContainText(messages['multiAlerts.dangerMessage']);
    await expect(page.locator('#click-target')).toHaveAccessibleName(inlineButtonLabel);
    await page.goto('/clr-lift/components/file-reader');
    await expect(page.getByRole('button', {name: fileMessages['browse'], exact: true}).first()).toBeVisible();
    await page.goto('/clr-lift/components/status-indicator');
    await expect(page.getByRole('img', {name: statusMessages['success'], exact: true}).first()).toBeVisible();
    await page.getByRole('button', {name: messages['header.selectLanguage'], exact: true}).click();
    const activeLanguage = page.getByRole('menuitem', {name: label, exact: true});
    await expect(activeLanguage).toHaveAttribute('aria-current', 'true');
    await expect(activeLanguage).toHaveAttribute('lang', code);
    await page.getByRole('menuitem', {name: alternateLabel, exact: true}).click();
    await expect(page.getByRole('img', {name: alternateStatus['success'], exact: true}).first()).toBeVisible();
    await page.getByRole('button', {name: alternateMessages['header.selectLanguage'], exact: true}).click();
    await page.getByRole('menuitem', {name: label, exact: true}).click();
    await expect(page.getByRole('img', {name: statusMessages['success'], exact: true}).first()).toBeVisible();
  });
}

test('switching languages preserves dismissed seeds and user-created alerts', async ({page}) => {
  const english = dictionaryMessages(demoFile('en'));
  const chinese = dictionaryMessages(demoFile('zh-CN'));
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/multi-alerts');
  const danger = page.locator('cll-alert-container clr-alert').filter({hasText: english['multiAlerts.dangerMessage']});
  await page.getByRole('button', {name: /Previous alert message/}).click();
  await expect(danger).toBeVisible();
  await danger.getByRole('button').click();
  await page.getByRole('button', {name: english['multiAlerts.addStandard'], exact: true}).click();
  const userAlert = page.locator('cll-alert-container .alert-text').filter({hasText: /New standard alert/});
  await expect(userAlert).toHaveCount(1);
  const originalText = await userAlert.innerText();
  await page.getByRole('button', {name: english['header.selectLanguage'], exact: true}).click();
  await page.getByRole('menuitem', {name: '简体中文', exact: true}).click();
  await expect(page.locator('cll-alert-container')).toContainText(chinese['multiAlerts.warningMessage']);
  await expect(
    page.locator('cll-alert-container .alert-text').filter({hasText: chinese['multiAlerts.dangerMessage']}),
  ).toHaveCount(0);
  await expect(page.locator('cll-alert-container .alert-text').filter({hasText: originalText})).toHaveCount(1);
});

test('wizard language changes preserve the current step and entered values', async ({page}) => {
  const english = dictionaryMessages(demoFile('en'));
  const chinese = dictionaryMessages(demoFile('zh-CN'));
  const wizardChinese = dictionaryMessages(library + 'timeline-wizard/timeline-wizard.l10n.ts', 'zh-CN');
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/timeline-wizard');
  await expect(page.locator('#operator-name')).toHaveValue('my-operator');
  await page.locator('#operator-name').fill('localized-operator');
  await page.getByRole('button', {name: 'Next', exact: true}).press('Enter');
  await expect(page.locator('app-configure-service')).toBeVisible();
  await expect(page.locator('#service-cpu')).toHaveValue('2');
  await page.locator('#service-cpu').fill('7');
  await page.getByRole('button', {name: english['header.selectLanguage'], exact: true}).click();
  await page.getByRole('menuitem', {name: '简体中文', exact: true}).click();
  await expect(page.locator('clr-timeline-step-title').first()).toHaveText(chinese['timelineWizard.configureOperator']);
  await expect(page.locator('clr-timeline-step-title').nth(1)).toHaveText(chinese['timelineWizard.configureService']);
  await expect(page.locator('#service-cpu')).toHaveValue('7');
  await page.getByRole('button', {name: wizardChinese['previous'], exact: true}).press('Enter');
  await expect(page.locator('#operator-name')).toHaveValue('localized-operator');
});

test('query guide scans both failure and service-placement tab groups', async ({page}) => {
  await page.goto('/ngx-lift/query/queryResource');
  await expect(page.locator('main h1')).toHaveText('queryResource');
  const failureTabs = await page
    .getByTestId('query-failure-examples')
    .getByRole('tab')
    .evaluateAll((tabs) => tabs.map((tab) => tab.id));
  const visiblePanels = new Set<string>();
  const visited = await visitDemoTabs(page, async () => {
    for (const panel of await page.getByRole('tabpanel').all()) {
      visiblePanels.add((await panel.getAttribute('id')) ?? '');
    }
  });
  expect(failureTabs.length).toBeGreaterThan(1);
  expect([...visited]).toEqual(
    expect.arrayContaining([...failureTabs, 'tab-service-pattern-b', 'tab-component-placement']),
  );
  expect([...visiblePanels]).toEqual(
    expect.arrayContaining(['tab-content-service-pattern-b', 'tab-content-component-placement']),
  );
  await expect(page.getByTestId('query-failure-examples')).toBeVisible();
});
