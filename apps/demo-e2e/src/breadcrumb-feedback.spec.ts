import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.route('**/breadcrumb-server.json', (request) => request.fulfill({json: {id: 'sql-1', name: 'Server'}}));
  await page.goto('/clr-lift/components/breadcrumb?level=1');
});

test('labels fit at the measured boundary or expose full path details', async ({page}) => {
  const host = page.getByTestId('native-trail');
  await expect(host.locator('.measure span')).toHaveCount(2);
  await host.evaluate((element: HTMLElement) => {
    const textWidth = Array.from(element.querySelectorAll('.measure span')).reduce(
      (sum, span) => sum + span.getBoundingClientRect().width,
      0,
    );
    element.style.inlineSize = `${Math.ceil(textWidth + parseFloat(getComputedStyle(element).fontSize) * 0.9 + 2)}px`;
  });
  await expect
    .poll(() =>
      host.evaluate((element) => {
        const labels = Array.from(element.querySelectorAll('.trail > li > .crumb-label'));
        const clipped = labels.some((label) => label.scrollWidth > label.clientWidth + 1);
        return !clipped || !!element.querySelector('.overflow button');
      }),
    )
    .toBe(true);
});

test('host padding reduces available label space without hiding full-text access', async ({page}) => {
  const host = page.getByTestId('native-trail');
  await host.evaluate((element: HTMLElement) => {
    element.style.boxSizing = 'border-box';
    element.style.inlineSize = '300px';
    element.style.paddingInline = '100px';
  });
  await expect(host.getByRole('button', {name: 'Show path details and ancestors'})).toBeVisible();
});

test('consumer link padding participates in the intrinsic width budget', async ({page}) => {
  const host = page.getByTestId('spa-trail');
  await page.addStyleTag({content: '[data-testid="spa-trail"] a { padding-inline: 60px; }'});
  await host.evaluate((element: HTMLElement) => {
    element.style.inlineSize = '250px';
  });
  await expect(host.getByRole('button', {name: 'Show path details and ancestors'})).toBeVisible();
});

test('Tab from Close skips excluded elements and follows native focus order', async ({page, browserName}) => {
  const host = page.getByTestId('native-trail');
  await host.evaluate((element: HTMLElement) => {
    element.style.inlineSize = '100px';
    const candidates = document.createElement('div');
    candidates.innerHTML = `
      <a href="#" tabindex="-1">Programmatic focus only</a>
      <div inert><button>Inert</button></div>
      <fieldset disabled><button>Disabled through fieldset</button></fieldset>
      <button style="visibility:hidden">Hidden</button>
      <button data-testid="next-tab-stop">Next tab stop</button>`;
    element.after(candidates);
  });
  await host.getByRole('button', {name: 'Show path details and ancestors'}).click();
  const panel = host.getByRole('region');
  // macOS WebKit uses Option+Tab to include buttons in native sequential navigation.
  await panel.getByRole('button', {name: 'Close path details'}).press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByTestId('next-tab-stop')).toBeFocused();
  await expect(panel).toBeHidden();
});
