import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.route(
    (url) => url.origin === 'https://randomuser.me' && url.pathname === '/api',
    (route) => {
      const count = Number(new URL(route.request().url()).searchParams.get('results') ?? 1);
      return route.fulfill({
        json: {
          results: Array.from({length: count}, (_, index) => ({
            id: {name: 'test', value: String(index)},
            gender: 'female',
            name: {first: 'API', last: 'User'},
            picture: {thumbnail: `https://randomuser.me/api/portraits/thumb/women/${index}.jpg`},
          })),
          info: {page: 1, results: count, seed: 'test', version: '1'},
        },
      });
    },
  );
  await page.goto('/ngx-lift/signals/computedAsync');
});

test('computedAsync renders a typed fallback and recovers', async ({page}) => {
  const demo = page.getByTestId('computed-fallback-demo');
  await expect(demo.getByTestId('computed-fallback-value')).toContainText('42');
  await demo.getByRole('button', {name: 'Fail source', exact: true}).click();
  await expect(demo.getByTestId('computed-fallback-value')).toContainText('0');
  await demo.getByRole('button', {name: 'Recover source', exact: true}).click();
  await expect(demo.getByTestId('computed-fallback-value')).toContainText('42');
});

test('computedAsync catches a read-time failure without a page error and recovers', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const demo = page.getByTestId('computed-read-error-demo');
  const result = demo.getByTestId('computed-last-read');
  await expect(result).toContainText('Not read yet');
  await demo.getByRole('button', {name: 'Read signal', exact: true}).click();
  await expect(result).toContainText('42');
  await demo.getByRole('button', {name: 'Fail source', exact: true}).click();
  await expect(result).toContainText('42');
  await demo.getByRole('button', {name: 'Read signal', exact: true}).click();
  await expect(result.getByRole('alert')).toContainText('The read threw');
  await expect(result).not.toContainText('42');
  await demo.getByRole('button', {name: 'Recover source', exact: true}).click();
  await expect(result.getByRole('alert')).toContainText('The read threw');
  await demo.getByRole('button', {name: 'Read signal', exact: true}).click();
  await expect(result).toContainText('42');
  expect(errors).toEqual([]);
});

test('computedAsync loads API portraits and refreshes through HTTP', async ({page}) => {
  const demo = page.getByTestId('computed-http-users-demo');
  await expect(demo.locator('app-user-card')).toHaveCount(9);
  await expect(demo.locator('img').first()).toHaveAttribute(
    'src',
    'https://randomuser.me/api/portraits/thumb/women/0.jpg',
  );
  const request = page.waitForRequest((req) => req.url().startsWith('https://randomuser.me/api?results=9'));
  await demo.getByRole('button', {name: 'Refresh', exact: true}).click();
  await request;
  await expect(demo.locator('app-user-card')).toHaveCount(9);
});

test('deferred users show a spinner for each request, an alert on failure, and recover on retry', async ({page}) => {
  await expect(page.getByTestId('computed-http-users-demo').locator('app-user-card')).toHaveCount(9);
  const demo = page.getByTestId('computed-lazy-users-demo');
  const load = demo.getByRole('button', {name: 'Load Users', exact: true});
  let respond!: (status: number) => void;
  let requests = 0;
  await page.route(
    (url) => url.origin === 'https://randomuser.me' && url.pathname === '/api',
    async (route) => {
      requests++;
      const status = await new Promise<number>((resolve) => {
        respond = resolve;
      });
      await route.fulfill({
        status,
        json:
          status === 503
            ? {message: 'Users unavailable'}
            : {
                results: [
                  {
                    id: {value: 'retry-user'},
                    gender: 'female',
                    name: {first: 'API', last: 'User'},
                    picture: {thumbnail: 'https://randomuser.me/api/portraits/thumb/women/0.jpg'},
                  },
                ],
                info: {page: 1, results: 1, seed: 'test', version: '1'},
              },
      });
    },
  );
  await expect(demo.locator('app-user-card')).toHaveCount(0);
  await expect(demo.locator('cll-spinner')).toHaveCount(0);
  await load.click();
  await expect(demo.locator('cll-spinner')).toBeVisible();
  await expect.poll(() => requests).toBe(1);
  respond(503);
  await expect(demo.getByRole('alert')).toContainText('Users unavailable');
  await expect(demo.locator('cll-spinner')).toHaveCount(0);
  await load.click();
  await expect(demo.locator('cll-spinner')).toBeVisible();
  await expect(demo.getByRole('alert')).toHaveCount(0);
  await expect.poll(() => requests).toBe(2);
  respond(200);
  await expect(demo.locator('app-user-card')).toHaveCount(1);
  await expect(demo.locator('cll-spinner')).toHaveCount(0);
  await load.click();
  await expect(demo.locator('cll-spinner')).toBeVisible();
  await expect.poll(() => requests).toBe(3);
  respond(200);
  await expect(demo.locator('app-user-card')).toHaveCount(1);
  await expect(demo.locator('cll-spinner')).toHaveCount(0);
  expect(requests).toBe(3);
});
