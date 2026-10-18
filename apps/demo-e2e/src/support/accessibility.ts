import {expect, Page, TestInfo} from '@playwright/test';
import axe from 'axe-core';

type BrowserAxe = typeof axe;

export async function expectAccessible(page: Page, testInfo: TestInfo) {
  await page.addScriptTag({content: axe.source});
  const results = await page.evaluate(() =>
    (window as unknown as Window & {axe: BrowserAxe}).axe.run(document, {
      runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']},
    }),
  );
  await testInfo.attach('accessibility', {
    body: JSON.stringify({
      url: results.url,
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
