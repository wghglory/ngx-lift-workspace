import {expect, test} from '@playwright/test';

test('loads the certificate examples automatically without moving focus', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  await expect(page.getByRole('button', {name: 'Load Certificate Example', exact: true})).toHaveCount(0);
  const triggers = page.locator('cll-certificate-signpost button');
  await expect(triggers).toHaveCount(3);
  for (const trigger of await triggers.all()) {
    await expect(trigger).toBeVisible();
    await expect(trigger).not.toBeFocused();
  }
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('clr-signpost-content')).toHaveCount(0);
  const first = triggers.first();
  await first.focus();
  await first.press('Enter');
  const details = page.locator('clr-signpost-content');
  await expect(details).toBeVisible();
  await expect(details).toContainText('Issued To');
  await expect(details).toContainText('DigiCert');
});

test('switches between sample certificates by role and algorithm', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  const select = page.getByLabel('Sample certificate');
  await expect(select).toBeVisible();

  await select.selectOption({label: 'Root CA — ECDSA P-256 (self-signed demo)'});
  const triggers = page.locator('cll-certificate-signpost button');
  await expect(triggers).toHaveCount(3);
  await triggers.last().click();
  const details = page.locator('clr-signpost-content');
  await expect(details).toContainText('Demo Root CA (ECDSA)');

  await select.selectOption({label: 'Leaf — RSA (expired, shows the danger status)'});
  await expect(triggers).toHaveCount(3);
  await triggers.last().click();
  await expect(page.locator('clr-signpost-content')).toContainText('Expired');
});

test('parses PEM in the build-your-own-viewer and re-encodes it', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  const pemBox = page.getByLabel('Certificate PEM');
  await expect(pemBox).toHaveValue(/BEGIN CERTIFICATE/);

  await page.getByRole('button', {name: 'Parse', exact: true}).click();
  const results = page.locator('app-state-inspector');
  await expect(results).toBeVisible();
  await expect(results).toContainText('CN=Demo Root CA (RSA)');
  await expect(results).toContainText(/^[0-9A-F]{64}$/m); // SHA-256 fingerprint
  await expect(page.locator('app-code-block').last()).toContainText('-----BEGIN CERTIFICATE-----');
});

test('renders a three-level certificate chain in the viewer', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  const select = page.getByLabel('Sample certificate');
  await select.selectOption({label: 'Chain — leaf → intermediate CA → root (deep nesting)'});

  await page.getByRole('button', {name: 'Parse', exact: true}).click();
  // dsm-ui-style hierarchy: trust anchor first, issued certificates nested below, fully expanded.
  const tree = page.locator('clr-tree clr-tree-node');
  await expect(tree).toHaveCount(3);
  await expect(tree.first()).toContainText('Demo Root CA (RSA)');
  await expect(tree.nth(1)).toContainText('Demo Intermediate CA (ECDSA)');
  await expect(tree.last()).toContainText('deep.ngx-lift.example');

  // Details render as tabs in distributed order (leaf first, active initially).
  const inspector = page.locator('app-state-inspector');
  await expect(inspector).toBeVisible();
  await expect(inspector).toContainText('deep.ngx-lift.example');
  await expect(inspector).toContainText('DNS:deep.ngx-lift.example');
  await page.getByRole('tab', {name: 'Demo Root CA (RSA)'}).click();
  await expect(inspector).toContainText('Demo Root CA (RSA)');
});

test('reports malformed PEM in the viewer', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  await page.getByLabel('Certificate PEM').fill('-----BEGIN CERTIFICATE-----\nnot base64!\n-----END CERTIFICATE-----');
  await page.getByRole('button', {name: 'Parse', exact: true}).click();
  await expect(page.getByText('This input is not a parseable certificate.')).toBeVisible();
});
