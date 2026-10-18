import {expect, Page, test} from '@playwright/test';

/** Visits every reachable tab, including independent groups and nested lazy panels. */
export async function visitDemoTabs(page: Page, inspectPanel: () => Promise<void>): Promise<Set<string>> {
  const visited = new Set<string>();
  while (true) {
    const candidates = await page.getByRole('tab').evaluateAll((tabs) =>
      tabs.map((tab) => {
        let depth = 0;
        for (let ancestor = tab.parentElement; ancestor; ancestor = ancestor.parentElement) {
          if (ancestor.getAttribute('role') === 'tabpanel') depth++;
        }
        return {id: tab.id, selector: `#${CSS.escape(tab.id)}`, depth};
      }),
    );
    if (candidates.some(({id}) => !id)) throw new Error('Every demo tab needs a stable ID');
    if (new Set(candidates.map(({id}) => id)).size !== candidates.length)
      throw new Error('Demo tab IDs must be unique');
    // Inspect nested groups before another parent tab can remove their lazy content.
    const next = candidates.filter(({id}) => !visited.has(id)).sort((a, b) => b.depth - a.depth)[0];
    if (!next) return visited;
    visited.add(next.id);
    const tab = page.locator(next.selector);
    await test.step(`tab: ${await tab.innerText()}`, async () => {
      await tab.focus();
      await tab.press('Enter');
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      await inspectPanel();
    });
  }
}
