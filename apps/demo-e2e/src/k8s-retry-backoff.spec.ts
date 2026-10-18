import {expect, test} from '@playwright/test';

test.describe('Kubernetes 429 Retry Backoff Demos', () => {
  test('documents setup and navigates between the operator and interceptor', async ({page}, testInfo) => {
    await page.goto('/ngx-lift/operators/k8sRetryBackoff');
    await expect(page.locator('h1')).toContainText('retryOnK8sBackoff');
    await expect(page.locator('app-code-block').first()).toContainText('retryOnK8sBackoff');
    await expect(page.getByTestId('retry-scenarios')).toContainText('executeSimulation');
    await expect(page.getByTestId('retry-scenarios')).not.toContainText('@Component({ ... })');
    await testInfo.attach('operator-page', {body: await page.screenshot(), contentType: 'image/png'});
    await page.getByRole('link', {name: 'k8sRetryBackoffInterceptor', exact: true}).click();
    await expect(page).toHaveURL(/\/interceptors\/k8sRetryBackoff$/);
    await expect(page.locator('app-code-block').first()).toContainText('k8sRetryBackoffInterceptor');
    await expect(page.getByTestId('interceptor-scenarios')).toContainText('executeRequest');
    await testInfo.attach('interceptor-page', {body: await page.screenshot(), contentType: 'image/png'});
    await page.getByRole('link', {name: 'retryOnK8sBackoff', exact: true}).click();
    await expect(page).toHaveURL(/\/operators\/k8sRetryBackoff$/);
  });

  test('retryOnK8sBackoff operator demo handles 429 retries and non-retryable errors', async ({page}) => {
    await page.goto('/ngx-lift/operators/k8sRetryBackoff');

    await expect(page.locator('h1')).toContainText('retryOnK8sBackoff');

    // Run default 429 scenario (Retry-After: 1s header)
    const simulateBtn = page.getByRole('button', {name: 'Simulate Request'});
    await expect(simulateBtn).toBeVisible();
    await simulateBtn.click();

    const firstPlayground = page.getByTestId('retry-scenarios');

    // Verify loading spinner appears and then resolves to success after backoff
    const successBadge = firstPlayground.locator('.badge-success');
    await expect(successBadge).toBeVisible({timeout: 5000});
    await expect(successBadge).toContainText('Success (HTTP 200)');

    // Verify log contents
    const logBox = firstPlayground.locator('.card');
    await expect(logBox).toBeVisible();
    await expect(logBox).toContainText('Retry-After: 1');
    await expect(logBox).toContainText('HTTP 200 OK');

    // Test non-retryable 500 scenario
    const errorRadio = page.getByRole('radio', {name: /500 Internal Server Error/});
    await errorRadio.check();
    await simulateBtn.click();

    const dangerBadge = firstPlayground.locator('.badge-danger');
    await expect(dangerBadge).toBeVisible({timeout: 3000});
    await expect(dangerBadge).toContainText('Failed (HTTP 500)');
    await expect(logBox).toContainText('HTTP 500 Internal Server Error');

    // Verify architectural comparison table is rendered at the bottom
    const compTable = page.locator('table').last();
    await expect(compTable).toBeVisible();
    await expect(compTable).toContainText('retryOnK8sBackoff');
    await expect(compTable).toContainText('k8sRetryBackoffInterceptor');
  });

  test('k8sRetryBackoffInterceptor demo handles global retry and HttpContext opt-out', async ({page}) => {
    await page.goto('/ngx-lift/interceptors/k8sRetryBackoff');

    await expect(page.locator('h1')).toContainText('k8sRetryBackoffInterceptor');

    // Verify API tables
    await expect(page.getByRole('heading', {name: 'k8sRetryBackoffInterceptor', level: 3, exact: true})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'createK8sRetryBackoffInterceptor', level: 3})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'K8S_RETRY_BACKOFF_CONFIG', level: 3})).toBeVisible();

    const sendBtn = page.getByRole('button', {name: 'Send Intercepted Request'});
    await expect(sendBtn).toBeVisible();

    const firstPlayground = page.getByTestId('interceptor-scenarios');

    // Test 1: Default mode (429 retried via global interceptor, resolves to 200)
    await sendBtn.click();
    const successBadge = firstPlayground.locator('.badge-success');
    await expect(successBadge).toBeVisible({timeout: 5000});
    await expect(successBadge).toContainText('Success (HTTP 200)');

    // Test 2: Disabled mode via HttpContextToken
    const disabledRadio = page.getByRole('radio', {name: /Disabled via HttpContext/});
    await disabledRadio.check();
    await sendBtn.click();

    const dangerBadge = firstPlayground.locator('.badge-danger');
    await expect(dangerBadge).toBeVisible({timeout: 3000});
    await expect(dangerBadge).toContainText('Failed (HTTP 429)');

    // Verify clear logs
    const clearBtn = page.getByRole('button', {name: 'Clear Log'});
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(firstPlayground.locator('.card')).toBeHidden();

    const overrides = page.getByTestId('interceptor-overrides');
    await page.getByRole('button', {name: 'Test Fast Probe (Opt-out)'}).click();
    await expect(overrides).toContainText('Attempts: 1');
    await page.getByRole('button', {name: 'Test Workload Read (10 Attempts)'}).click();
    await expect(overrides).toContainText('Attempts: 3');

    // Verify architectural comparison table is rendered at the bottom
    const compTable = page.locator('table').last();
    await expect(compTable).toBeVisible();
    await expect(compTable).toContainText('retryOnK8sBackoff');
    await expect(compTable).toContainText('k8sRetryBackoffInterceptor');
  });
  test('write retries require explicit endpoint opt-in and reject gateway errors', async ({page}) => {
    await page.goto('/ngx-lift/interceptors/k8sRetryBackoff');
    const preview = page.getByTestId('interceptor-scenarios');
    const send = page.getByRole('button', {name: 'Send Intercepted Request'});
    await page.getByRole('radio', {name: 'POST: default (no retry)', exact: true}).check();
    await send.click();
    await expect(preview).toContainText('Total attempts: 1');
    await expect(preview).toContainText('write retries require explicit endpoint opt-in');
    await page.getByRole('radio', {name: 'POST: explicit Kubernetes opt-in', exact: true}).check();
    await send.click();
    await expect(preview).toContainText('Success (HTTP 200)');
    await expect(preview).toContainText('Total attempts: 2');
    await expect(preview).toContainText('POST /api/v1/namespaces/default/pods status 429');
    await page.getByRole('radio', {name: 'POST: gateway 429 (rejected)', exact: true}).check();
    await send.click();
    await expect(preview).toContainText('Total attempts: 1');
    await expect(preview).toContainText('configured Kubernetes predicate rejected it');
  });
});
