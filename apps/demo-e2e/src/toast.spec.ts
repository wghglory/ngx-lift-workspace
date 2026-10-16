import {expect, test} from '@playwright/test';

test.describe('Toast interaction lifetime', () => {
  test.beforeEach(async ({page}) => {
    await page.clock.install();
    await page.goto('/clr-lift/components/toast');
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
      await page.clock.install({time: new Date('2026-10-16T00:00:00Z')});
      await page.goto('/clr-lift/components/toast');
      await page.clock.pauseAt(new Date('2026-10-16T00:01:00Z'));
      const pageSize = () =>
        page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight,
        }));
      await page.addStyleTag({content: 'cll-toast.toast-enter { animation-play-state: paused !important; }'});
      const before = await pageSize();
      const add = page.getByRole('button', {name: 'Error Toast', exact: true});
      for (let index = 0; index < 8; index++) {
        await add.press('Enter');
        await page.clock.runFor(20);
        await expect(page.locator('cll-toast')).toHaveCount(index + 1);
        const latest = page.locator('cll-toast').first();
        await expect(latest).toBeAttached();
        const sizes = await latest.evaluate((element) => {
          const animation = element
            .getAnimations()
            .find((item) => item instanceof CSSAnimation && item.animationName.includes('toast-enter-anim'));
          if (!animation) throw new Error('New toast must have its entry animation');
          animation.pause();
          const snapshots = [];
          for (const time of [0, 16, 100, 200, 399, 400]) {
            animation.currentTime = time;
            snapshots.push({
              width: document.documentElement.scrollWidth,
              height: document.documentElement.scrollHeight,
              clientWidth: document.documentElement.clientWidth,
              clientHeight: document.documentElement.clientHeight,
            });
          }
          animation.finish();
          return snapshots;
        });
        for (const size of sizes) expect(size).toEqual(before);
      }
      await expect(page.locator('cll-toast')).toHaveCount(8);
      const last = page.locator('cll-toast').last();
      const action = last.getByRole('button', {name: 'More Info', exact: true});
      await action.focus();
      await expect(action).toBeFocused();
      const bounds = (element: Element) => {
        const {x, y, width, height} = element.getBoundingClientRect();
        return {x, y, width, height};
      };
      const stack = await page.locator('cll-toast-container').evaluate(bounds);
      for (const control of await last.getByRole('button').all()) {
        await expect(control).toBeVisible();
        const rect = await control.evaluate(bounds);
        expect(rect.x).toBeGreaterThanOrEqual(0);
        expect(rect.x + rect.width).toBeLessThanOrEqual(width);
        expect(rect.y).toBeGreaterThanOrEqual(stack.y);
        expect(rect.y + rect.height).toBeLessThanOrEqual(Math.min(stack.y + stack.height, 480));
      }
      expect(await pageSize()).toEqual(before);
      const screenshot = testInfo.outputPath('toast-stack.png');
      await page.screenshot({path: screenshot});
      await testInfo.attach('toast-stack', {path: screenshot, contentType: 'image/png'});
    });
  }
});
