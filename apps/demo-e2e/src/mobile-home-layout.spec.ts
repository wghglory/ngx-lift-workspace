import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';

for (const width of [320, 390, 576, 768, 992, 1440]) {
  const minCardGap = width < 992 ? 16 : Number.NEGATIVE_INFINITY;
  test(`home cards and header fit at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    for (const route of ['/ngx-lift', '/clr-lift']) {
      await page.goto(route);
      const cards = page.locator('.home-feature-cards app-tile');
      await expect(cards).toHaveCount(3);
      const rectangles = await cards.evaluateAll((elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return {top: rect.top, bottom: rect.bottom};
        }),
      );
      for (const [previous, next] of rectangles.slice(1).map((rect, i) => [rectangles[i], rect])) {
        expect(next.top - previous.bottom).toBeGreaterThanOrEqual(minCardGap);
      }
      const header = page.locator('clr-header');
      for (const control of await header
        .locator(
          '.branding a:visible, .header-actions a:visible, .header-actions button:visible, .header-hamburger-trigger:visible, .header-overflow-trigger:visible',
        )
        .all()) {
        const rect = await control.evaluate((element) => {
          const {x, width} = element.getBoundingClientRect();
          return {x, width};
        });
        expect(rect.x).toBeGreaterThanOrEqual(0);
        expect(rect.x + rect.width).toBeLessThanOrEqual(width + 1);
      }
      const githubInset = await header.locator('a[href*="github.com"]').evaluate((link) => {
        const icon = link.querySelector('svg');
        return (icon?.getBoundingClientRect().left ?? 0) - link.getBoundingClientRect().left;
      });
      expect(githubInset).toBeGreaterThanOrEqual(8);
      await expect(header.locator('.branding')).toHaveCSS('display', width <= 575 ? 'none' : 'flex');
    }
  });
}

for (const width of [320, 390]) {
  test(`compact header switches languages at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    await page.goto('/ngx-lift');
    const header = page.locator('clr-header');
    await expect(header.locator('.brand-mark')).toHaveCount(0);
    await expect(header.locator('.lang-code')).toHaveText('English');
    for (const [name, compact] of [
      ['简体中文', '简'],
      ['繁體中文', '繁'],
      ['日本語', '日本語'],
      ['한국어', '한국어'],
      ['Deutsch', 'Deutsch'],
      ['Español', 'Español'],
      ['Français', 'Français'],
      ['Português', 'Português'],
      ['Nederlands', 'Nederlands'],
      ['Русский', 'Русский'],
      ['English', 'English'],
    ]) {
      await header.locator('.language-trigger').click();
      await page.getByRole('menuitem', {name, exact: true}).click();
      await expect(header.locator('.lang-code')).toHaveText(compact);
      const rightEdge = await header
        .locator('.language-trigger')
        .evaluate((element) => element.getBoundingClientRect().right);
      expect(rightEdge).toBeLessThanOrEqual(width - 88);
    }
  });
}

for (const width of [320, 390, 576, 768, 992]) {
  test(`overflow close stays beside the navigation at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    await page.goto('/ngx-lift');
    for (const repeat of [1, 2]) {
      await page.getByRole('button', {name: 'Open navigation overflow menu', exact: true}).click();
      const close = page
        .locator('clr-vertical-nav')
        .getByRole('button', {name: 'Close navigation overflow menu', exact: true});
      await expect(close, `opening ${repeat}`).toBeVisible();
      await expect
        .poll(() =>
          close.evaluate((element) => {
            const button = element.getBoundingClientRect();
            const panel = document.querySelector('clr-vertical-nav')?.getBoundingClientRect();
            return button.x >= 0 && !!panel && button.right + 8 <= panel.left;
          }),
        )
        .toBe(true);
      await close.click();
      await expect(close).toBeHidden();
    }
  });
}

for (const theme of ['light', 'dark']) {
  test(`mobile navigation supports keyboard and accessibility in ${theme} mode`, async ({page}, testInfo) => {
    await page.setViewportSize({width: 390, height: 900});
    await page.addInitScript((value) => localStorage.setItem('cds-theme', value), theme);
    await page.goto('/ngx-lift');
    await expect(page.locator('body')).toHaveAttribute('cds-theme', theme);
    await expectAccessible(page, testInfo);
    const language = page.locator('.language-trigger');
    await language.focus();
    await language.press('Enter');
    await expect(page.getByRole('menuitem', {name: 'English', exact: true})).toBeVisible();
    await expectAccessible(page, testInfo);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menuitem', {name: 'English', exact: true})).toBeHidden();
    await expect(language).toBeFocused();
    const overflow = page.locator('.header-overflow-trigger');
    await overflow.focus();
    await overflow.press('Enter');
    const close = page.locator('clr-vertical-nav .clr-nav-close');
    await expect(close).toBeVisible();
    await expectAccessible(page, testInfo);
    await close.focus();
    await page.keyboard.press('Escape');
    await expect(close).toBeHidden();
    await expect(overflow).toBeFocused();
  });
}

test('desktop branding reuses the favicon and links to the library home', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('/clr-lift');
  const home = page.getByRole('link', {name: 'ngx-lift and clr-lift home', exact: true});
  await expect(home).toBeVisible();
  const logo = home.locator('img');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon.svg');
  await expect(logo).toHaveAttribute('src', 'favicon.svg');
  await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await home.focus();
  await home.press('Enter');
  await expect(page).toHaveURL(/\/ngx-lift$/);
});

test('desktop library links remain visible with a scrollbar beside the responsive breakpoint', async ({page}) => {
  await page.setViewportSize({width: 1000, height: 900});
  await page.goto('/ngx-lift');
  await page.addStyleTag({content: 'html { scrollbar-gutter: stable; }'});
  const header = page.locator('.header-nav');
  for (const name of ['clr-lift', 'ngx-lift', 'clr-lift']) {
    await header.getByRole('link', {name, exact: true}).click();
    await expect(page.locator('h1').first()).toHaveText(name);
    await expect(header.getByRole('link', {name: 'ngx-lift', exact: true})).toBeVisible();
    await expect(header.getByRole('link', {name: 'clr-lift', exact: true})).toBeVisible();
  }
  await page.setViewportSize({width: 768, height: 900});
  await page.locator('.header-hamburger-trigger').click();
  await header.getByRole('link', {name: 'ngx-lift', exact: true}).click();
  await expect(page.locator('h1').first()).toHaveText('ngx-lift');
  await page.setViewportSize({width: 1000, height: 900});
  await expect(header.getByRole('link', {name: 'ngx-lift', exact: true})).toBeVisible();
  await expect(header.getByRole('link', {name: 'clr-lift', exact: true})).toBeVisible();
});

test('closed navigation stays outside the page while shrinking the desktop viewport', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('/clr-lift');
  for (const width of [992, 768, 576, 390, 320]) {
    await page.setViewportSize({width, height: 900});
    await expect(page.locator('.main-container')).not.toHaveClass(/open-overflow-menu/);
    await page.locator('clr-vertical-nav').evaluate(async (element) => {
      element.getBoundingClientRect();
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    await expect
      .poll(() =>
        page.locator('clr-vertical-nav').evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width === 0 ? innerWidth : rect.left;
        }),
      )
      .toBeGreaterThanOrEqual(width);
  }
});

for (const opener of ['.header-hamburger-trigger', '.header-overflow-trigger']) {
  test(`enlarging an open ${opener} restores ordinary desktop navigation`, async ({page}) => {
    await page.setViewportSize({width: 390, height: 900});
    await page.goto('/ngx-lift');
    await page.locator(opener).click();
    await expect(page.locator('.main-container')).toHaveClass(/open-(hamburger|overflow)-menu/);
    await page.setViewportSize({width: 1440, height: 900});
    await expect(page.locator('.main-container')).not.toHaveClass(/open-(hamburger|overflow)-menu/);
    await expect(page.locator('.clr-nav-close:visible')).toHaveCount(0);
    await expect(page.locator('clr-vertical-nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('clr-vertical-nav')).toBeVisible();
    await page.locator('.desktop-library-nav').getByRole('link', {name: 'clr-lift', exact: true}).click();
    await expect(page.locator('h1').first()).toHaveText('clr-lift');
  });
}
