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

  // Close the popover explicitly: an outside click on the select does not dismiss it in every
  // browser, and a second trigger click would otherwise toggle the previous sample's popover shut.
  await triggers.last().click();
  await expect(details).toHaveCount(0);

  await select.selectOption({label: 'Leaf — RSA (expired, shows the danger status)'});
  await expect(triggers).toHaveCount(3);
  await triggers.last().click();
  await expect(details).toContainText('Expired');
  await expect(details.locator('cds-icon[status="danger"]')).toHaveCount(1);
  await expect(page.locator('cll-certificate-signpost').last().locator('clr-icon[status="danger"]')).toHaveCount(1);
});

test('parses PEM in the build-your-own-viewer and re-encodes it', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  const pemBox = page.getByLabel('Certificate PEM');
  await expect(pemBox).toHaveValue(/BEGIN CERTIFICATE/);
  expect((await pemBox.boundingBox())?.width ?? 0).toBeGreaterThan(400);

  await page.getByRole('button', {name: 'Parse', exact: true}).click();
  const results = page.locator('app-state-inspector');
  await expect(results).toBeVisible();
  // The viewer starts with the selected sample, which defaults to the real DigiCert root.
  await expect(results).toContainText('CN=DigiCert Assured ID Root G2');
  await expect(results).toContainText('SHA256 with RSA');
  await expect(results).not.toContainText('1.2.840.113549.1.1.11');
  await expect(results).toContainText(/SHA-256 Fingerprint:\s*[0-9A-F]{64}/);
  await expect(page.locator('.chain-section .inspector-rows')).toBeVisible();
  await expect(page.locator('.chain-section .state-pill')).toHaveCount(0);
  await expect(page.locator('.chain-section app-code-block')).toContainText('-----BEGIN CERTIFICATE-----');
  await expect(
    page.getByRole('heading', {name: 'First certificate DER re-encoded to PEM with pemEncodeDer'}),
  ).toBeVisible();
});

test('renders a three-level certificate chain in the viewer', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  const select = page.getByLabel('Sample certificate');
  await select.selectOption({label: 'Chain — leaf → intermediate CA → root (deep nesting)'});

  await page.getByRole('button', {name: 'Parse', exact: true}).click();
  // Reference hierarchy: trust anchor first, issued certificates nested below, fully expanded.
  const tree = page.locator('clr-tree clr-tree-node');
  await expect(tree).toHaveCount(3);
  await expect(tree.first()).toContainText('Demo Root CA (RSA)');
  await expect(tree.nth(1)).toContainText('Demo Intermediate CA (ECDSA)');
  await expect(tree.last()).toContainText('deep.ngx-lift.example');

  // Details render as tabs in distributed order (leaf first, active initially). Inactive tab
  // content stays in the DOM, so address each certificate by its named tabpanel.
  const inspectorIn = (tabName: string) => page.getByRole('tabpanel', {name: tabName}).locator('app-state-inspector');
  const leafInspector = inspectorIn('deep.ngx-lift.example');
  await expect(leafInspector).toBeVisible();
  await expect(leafInspector).toContainText('deep.ngx-lift.example');
  await expect(leafInspector).toContainText('dns:deep.ngx-lift.example');

  // Clicking a hierarchy tree node opens that certificate's details tab.
  await page.locator('.chain-node-link').filter({hasText: 'Demo Intermediate CA (ECDSA)'}).click();
  await expect(inspectorIn('Demo Intermediate CA (ECDSA)')).toContainText('CN=Demo Intermediate CA (ECDSA)');
  await page.getByRole('tab', {name: 'Demo Root CA (RSA)'}).click();
  await expect(inspectorIn('Demo Root CA (RSA)')).toContainText('Demo Root CA (RSA)');
});

test('reports malformed PEM in the viewer', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/clr-lift/components/certificate');
  await page.getByLabel('Certificate PEM').fill('-----BEGIN CERTIFICATE-----\nnot base64!\n-----END CERTIFICATE-----');
  await page.getByRole('button', {name: 'Parse', exact: true}).click();
  await expect(page.getByText('This input is not a parseable certificate.')).toBeVisible();
});
