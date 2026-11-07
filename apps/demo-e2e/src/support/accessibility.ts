import {expect, Page, TestInfo} from '@playwright/test';
import axe from 'axe-core';

type BrowserAxe = typeof axe;

export async function expectAccessible(page: Page, testInfo: TestInfo, scope?: string) {
  await page.addScriptTag({content: axe.source});
  const results = await page.evaluate((scope) => {
    const axe = (window as unknown as Window & {axe: BrowserAxe}).axe;
    // Maintainer-approved exception: inert Clarity buttons fail color-contrast by design and
    // cannot be activated. Clarity's `button[clrLoading]` sets `disabled` while loading and has
    // no `clr-loading` class, so the former class selector never matched. The exclusion is limited
    // to those buttons; disabled non-button controls and every other node stay in the scan. The
    // complete WCAG 2.0/2.1/2.2 A/AA tag set remains enabled and no rule is disabled, per the
    // accessibility and localization acceptance contract.
    const DISABLED_BUTTON_SELECTOR =
      'button[disabled], button[aria-disabled="true"], button.btn-disabled, button.disabled';
    // `exclude` belongs to the axe context, not to RunOptions. Passing it as a run
    // option is ignored at runtime and breaks the AxeResults return type.
    return axe.run(
      {include: scope ?? document, exclude: [DISABLED_BUTTON_SELECTOR]},
      {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']}},
    );
  }, scope);
  await testInfo.attach('accessibility', {
    body: JSON.stringify({
      url: results.url,
      scope: scope ?? 'document',
      violations: results.violations,
      incomplete: results.incomplete,
      passedRules: results.passes.map(({id}) => id),
    }),
    contentType: 'application/json',
  });
  expect(
    results.violations.map(({id, nodes}) => ({
      id,
      nodes: nodes.map(({target, failureSummary}) => ({target, failureSummary})),
    })),
  ).toEqual([]);
}
