import {expect, test} from '@playwright/test';

import {demoLocales, dictionaryMessages} from './support/demo-locales';
import {demoRoutes} from './support/demo-routes';

const demoFile = (locale: string) => `apps/demo/src/app/core/l10n/demo.l10n.${locale.toLowerCase()}.ts`;
const library = 'libs/clr-lift/src/lib/components/';

for (const {code, label} of demoLocales) {
  const messages = dictionaryMessages(demoFile(code));
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
        const tabs = page.getByRole('tablist').first().getByRole('tab');
        const tabCount = await tabs.count();
        for (let index = 1; index < tabCount; index++) {
          const tab = tabs.nth(index);
          await tab.click();
          await expect(tab).toHaveAttribute('aria-selected', 'true');
          await expect(page.locator('body')).not.toContainText('!! Key');
          expect
            .soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route)
            .toBe(true);
        }
      });
    }
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
