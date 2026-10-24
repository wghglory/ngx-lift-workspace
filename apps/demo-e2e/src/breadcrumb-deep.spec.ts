import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

const route = '/clr-lift/components/breadcrumb';
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto(route);
});

test('every ancestor has ordered exact destinations, full context and stationary scrollable details', async ({
  page,
}, info) => {
  const host = page.getByTestId('deep-trail');
  const trigger = host.getByRole('button', {name: 'Show path details and ancestors'});
  await trigger.scrollIntoViewIfNeeded();
  const before = await page.getByTestId('object-list').boundingBox();
  await trigger.click();
  const panel = host.getByRole('region');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('link')).toHaveCount(29);
  await expect(panel.getByRole('link').first()).toBeFocused();
  const links = await panel.getByRole('link').evaluateAll((elements) => elements.map((e) => e.getAttribute('href')));
  expect(links).toEqual(Array.from({length: 29}, (_, i) => `${route}?depth=${i}&key=%2F%25`));
  await expect(panel.locator('small').nth(20)).toContainText('Level 21');
  await panel.getByRole('link').last().scrollIntoViewIfNeeded();
  await expect(panel.getByRole('link').last()).toBeInViewport();
  expect((await page.getByTestId('object-list').boundingBox())?.y).toBe(before?.y);
  const rect = await panel.boundingBox();
  if (!rect) throw new Error('Expected visible panel');
  expect(rect.x).toBeGreaterThanOrEqual(0);
  expect(rect.y).toBeGreaterThanOrEqual(0);
  expect(rect.y + rect.height).toBeLessThanOrEqual(page.viewportSize()?.height ?? 0);
  await info.attach('deep-path-layout', {
    body: JSON.stringify(
      await host.evaluate((element) => ({
        suppliedLocations: 30,
        visibleLocations: element.querySelectorAll('.trail > li:not(.overflow)').length,
        hostWidth: element.clientWidth,
        fontSize: getComputedStyle(element).fontSize,
        panelLocations: element.querySelectorAll('.panel-list li').length,
        panelHeight: element.querySelector('[popover]')?.getBoundingClientRect().height,
        panelScrollHeight: element.querySelector('[popover]')?.scrollHeight,
      })),
    ),
    contentType: 'application/json',
  });
  await expectAccessible(page, info);
  await panel.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(panel).toBeHidden();
});

test('fixed-width runtime font changes remove and restore recent ancestors without stealing external focus', async ({
  page,
}) => {
  const host = page.getByTestId('deep-trail');
  const row = host.locator('.trail > li:not(.overflow)');
  const slider = page.getByRole('slider', {name: 'Font size'});
  await slider.press('Home');
  await expect(row).toHaveCount(4);
  const width = await host.evaluate((e) => e.clientWidth);
  await slider.press('End');
  await expect.poll(() => row.count()).toBeLessThan(4);
  expect(await host.evaluate((e) => e.clientWidth)).toBe(width);
  await expect(slider).toBeFocused();
  await slider.press('Home');
  await expect(row).toHaveCount(4);
  await expect(slider).toBeFocused();
});

test('keyboard entry/exit, independent disclosures, replacement and outside focus follow preview contract', async ({
  page,
}) => {
  const host = page.getByTestId('deep-trail');
  const trigger = host.getByRole('button', {name: 'Show path details and ancestors'});
  await trigger.scrollIntoViewIfNeeded();
  await trigger.press('Enter');
  const panel = host.getByRole('region');
  await expect(panel.getByRole('link').first()).toBeFocused();
  await panel.getByRole('link').first().press('Shift+Tab');
  await expect(trigger).toBeFocused();
  await expect(panel).toBeHidden();
  await trigger.click();
  await panel.getByRole('button', {name: 'Close path details'}).press('Tab');
  await expect(panel).toBeHidden();
  await expect(host.locator('.trail > li.current a')).toHaveCount(0);
  await trigger.click();
  await page.getByRole('button', {name: 'Replace path'}).click();
  await expect(panel).toBeHidden();
  await expect(page.getByRole('button', {name: 'Replace path'})).toBeFocused();
  await page.getByRole('button', {name: 'Replace path'}).click();
  await trigger.click();
  await panel.getByRole('button', {name: 'Close path details'}).click();
  await expect(trigger).toBeFocused();
});

test('narrow 200% text and short paths remain touch and keyboard reachable', async ({page}) => {
  await page.setViewportSize({width: 390, height: 800});
  const host = page.getByTestId('deep-trail');
  await page.getByRole('slider', {name: 'Container width'}).press('Home');
  await page.getByRole('slider', {name: 'Font size'}).press('End');
  // Twice the inherited 0.9rem text size, independently of the demo slider ceiling.
  await host.evaluate((element) => (element as HTMLElement).style.setProperty('--cll-breadcrumb-font-size', '1.8rem'));
  await page.getByRole('button', {name: 'Replace path'}).click();
  const trigger = host.getByRole('button', {name: 'Show path details and ancestors'});
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(host.getByRole('region').getByRole('link')).toHaveCount(2);
  await expect(host.getByRole('region')).toContainText('📁 2 · Sql servers');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await host.getByRole('region').press('Escape');
  await expect(trigger).toBeFocused();
});

test('truncation-only singleton details and multiple instances keep independent focus relationships', async ({
  page,
}) => {
  const singleton = page.getByTestId('singleton-trail');
  await singleton.evaluate((element) => {
    const host = element as HTMLElement;
    host.style.inlineSize = '40px';
    host.style.setProperty('--cll-breadcrumb-font-size', '1.5rem');
  });
  const singletonTrigger = singleton.getByRole('button', {name: 'Show path details and ancestors'});
  await expect(singletonTrigger).toBeVisible();
  const deep = page.getByTestId('deep-trail');
  const deepTrigger = deep.getByRole('button', {name: 'Show path details and ancestors'});
  await expect(singletonTrigger).not.toHaveAttribute(
    'aria-controls',
    (await deepTrigger.getAttribute('aria-controls'))!,
  );
  await deepTrigger.click();
  await expect(deep.getByRole('region')).toBeVisible();
  await singletonTrigger.click();
  await expect(deep.getByRole('region')).toBeHidden();
  await expect(singleton.getByRole('region')).toContainText('Database');
  await expect(singleton.getByRole('region').getByRole('link')).toHaveCount(0);
  await singleton.getByRole('region').getByRole('button', {name: 'Close path details'}).press('Escape');
  await expect(singletonTrigger).toBeFocused();
  await singletonTrigger.click();
  await singleton.evaluate((element) => ((element as HTMLElement).style.inlineSize = '400px'));
  await expect(singleton.getByRole('region')).toBeHidden();
  await expect(singleton.getByRole('navigation')).toBeFocused();
});

test('panel links retain browser modified-click behavior and ordinary SPA replacement dismisses stale ancestry', async ({
  page,
}) => {
  const host = page.getByTestId('deep-trail');
  await host.getByRole('button', {name: 'Show path details and ancestors'}).click();
  const link = host.getByRole('region').getByRole('link').nth(10);
  expect(
    await link.evaluate((element) => {
      const event = new MouseEvent('click', {bubbles: true, cancelable: true, ctrlKey: true});
      let prevented = true;
      document.addEventListener(
        'click',
        (observed) => {
          prevented = observed.defaultPrevented;
          observed.preventDefault();
        },
        {once: true},
      );
      element.dispatchEvent(event);
      return prevented;
    }),
  ).toBe(false);
  await link.click();
  await expect(page).toHaveURL(/depth=10/);
  await expect(host.getByRole('region')).toBeHidden();
  await expect(host.locator('.trail > li.current')).toContainText('📁 10');
});
