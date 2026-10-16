import {expect, test} from '@playwright/test';

test.describe('Toast interaction lifetime', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/toast');
    await page.clock.install();
    await page.getByRole('button', {name: 'Error Toast', exact: true}).click();
  });

  test('retains a focused toast when the pointer leaves', async ({page}) => {
    const toast = page.locator('cll-toast', {hasText: 'Error Toast'});
    const action = toast.getByRole('button', {name: 'More Info', exact: true});
    await action.hover();
    await action.focus();
    await page.mouse.move(0, 0);
    await page.clock.fastForward(10_000);
    await expect(action).toBeFocused();
    await expect(toast).toBeVisible();

    await action.blur();
    await page.clock.fastForward(10_000);
    await expect(toast).toHaveCount(0);
  });

  test('retains a hovered toast when keyboard focus leaves', async ({page}) => {
    const toast = page.locator('cll-toast', {hasText: 'Error Toast'});
    const action = toast.getByRole('button', {name: 'More Info', exact: true});
    await action.hover();
    await action.focus();
    await action.blur();
    await page.clock.fastForward(10_000);
    await expect(toast).toBeVisible();

    await page.mouse.move(0, 0);
    await page.clock.fastForward(10_000);
    await expect(toast).toHaveCount(0);
  });
});

test.describe('Toast viewport containment', () => {
  for (const width of [1280, 390, 320]) {
    test(`keeps page dimensions stable during entry and stacking at ${width}px`, async ({page}, testInfo) => {
      await page.setViewportSize({width, height: 480});
      await page.goto('/clr-lift/components/toast');
      const pageSize = () =>
        page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight,
        }));
      const before = await pageSize();
      const add = page.getByRole('button', {name: 'Error Toast', exact: true});
      for (let index = 0; index < 8; index++) {
        await add.press('Enter');
        const latest = page.locator('cll-toast').last();
        await expect(latest).toBeAttached();
        const sizes = await latest.evaluate((element) => {
          const animation = element
            .getAnimations()
            .find((item) => item instanceof CSSAnimation && item.animationName === 'toast-enter-anim');
          animation?.pause();
          const snapshots = [];
          for (const time of [0, 16, 100, 200, 399, 400]) {
            if (animation) animation.currentTime = time;
            snapshots.push({
              width: document.documentElement.scrollWidth,
              height: document.documentElement.scrollHeight,
              clientWidth: document.documentElement.clientWidth,
              clientHeight: document.documentElement.clientHeight,
            });
          }
          animation?.finish();
          return snapshots;
        });
        for (const size of sizes) expect(size).toEqual(before);
        if (index === 0) {
          const screenshot = testInfo.outputPath('toast-entry.png');
          await page.screenshot({path: screenshot});
          await testInfo.attach('toast-entry', {path: screenshot, contentType: 'image/png'});
        }
      }
      await expect(page.locator('cll-toast')).toHaveCount(8);
      const last = page.locator('cll-toast').last();
      await last.getByRole('button', {name: 'More Info', exact: true}).focus();
      for (const control of await last.getByRole('button').all()) {
        const rect = await control.boundingBox();
        if (!rect) throw new Error('Toast action must be visible');
        expect(rect.x).toBeGreaterThanOrEqual(0);
        expect(rect.x + rect.width).toBeLessThanOrEqual(width);
      }
      await page.locator('cll-toast').last().getByRole('button', {name: 'More Info', exact: true}).focus();
      expect(await pageSize()).toEqual(before);
    });
  }
});
