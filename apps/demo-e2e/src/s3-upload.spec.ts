import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {type AddressInfo} from 'node:net';

import {expect, test} from '@playwright/test';

import {expectAccessible} from './support/accessibility';
import {demoLocales, dictionaryMessages} from './support/demo-locales';

const file = (name: string, body = 'object contents') => ({
  name,
  mimeType: 'text/plain',
  buffer: Buffer.from(body),
});

test('S3 demo stages files and enforces overwrite protection', async ({page}, testInfo) => {
  await page.goto('/clr-lift/components/upload');
  const demo = page.getByTestId('upload-demo-s3');
  const picker = demo.locator('input[type="file"]').first();
  const start = demo.getByRole('button', {name: 'Upload', exact: true});
  await picker.setInputFiles(file('readme.txt'));
  await expect(page.locator('.cll-upload-panel__card')).toHaveCount(0);
  await start.click();
  const panel = page.locator('.cll-upload-panel');
  await expect(demo.getByTestId('s3-demo-stored')).toContainText('/api/s3/demo-uploads/documents/readme.txt');
  await picker.setInputFiles(file('readme.txt'));
  await start.click();
  await expect(panel.locator('[data-status="error"]')).toContainText('412');
  for (const theme of ['light', 'dark']) {
    await page.evaluate((activeTheme) => document.body.setAttribute('cds-theme', activeTheme), theme);
    await expectAccessible(page, testInfo, '[data-testid="upload-demo-s3"]');
    await expectAccessible(page, testInfo, '.cll-upload-panel');
  }
  await demo.getByRole('checkbox', {name: 'Overwrite existing objects'}).check();
  await picker.setInputFiles(file('readme.txt'));
  await start.click();
  await expect(panel.locator('.cll-upload-panel__summary')).toContainText('Uploaded 2 files');
});

test('S3 PUT preserves bytes, encodes keys and snapshots the destination for queued files', async ({page}) => {
  await page.addInitScript(() => {
    (window as unknown as {__s3UploadDemoStub?: boolean}).__s3UploadDemoStub = false;
  });
  let releaseFirst: () => void = () => undefined;
  const firstResponse = new Promise<void>((resolve) => {
    releaseFirst = resolve;
  });
  const requests: {url: string; sha: string; condition: string; contentType: string; body: string}[] = [];
  // WebKit does not expose File request bodies through Playwright's postDataBuffer().
  // Read bytes at an actual HTTP receiver in every browser instead.
  const receiver = createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    if (request.method === 'OPTIONS') {
      response.writeHead(204).end();
      return;
    }
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    requests.push({
      url: request.url ?? '',
      sha: String(request.headers['x-amz-content-sha256']),
      condition: String(request.headers['if-none-match']),
      contentType: String(request.headers['content-type']),
      body: Buffer.concat(chunks).toString(),
    });
    if (requests.length === 1) await firstResponse;
    response.writeHead(200).end();
  });
  await new Promise<void>((resolve) => receiver.listen(0, '127.0.0.1', resolve));
  const address = receiver.address() as AddressInfo;
  await page.route('**/api/s3/**', (route) =>
    route.continue({url: 'http://127.0.0.1:' + address.port + new URL(route.request().url()).pathname}),
  );
  try {
    await page.goto('/clr-lift/components/upload');
    const demo = page.getByTestId('upload-demo-s3');
    await demo.getByLabel('Object key prefix', {exact: true}).fill('a folder/#100%/');
    await demo
      .locator('input[type="file"]')
      .first()
      .setInputFiles([file('a #%.txt', 'first'), file('empty.txt', '')]);
    await demo.getByRole('button', {name: 'Upload', exact: true}).click();
    await expect.poll(() => requests.length).toBe(1);
    await demo.getByLabel('Bucket', {exact: true}).fill('other-bucket');
    await demo.getByLabel('Object key prefix', {exact: true}).fill('other-prefix');
    await demo.getByRole('checkbox').check();
    releaseFirst();
    await expect(demo.getByTestId('s3-demo-stored').locator('li')).toHaveCount(2);
    expect(requests.map((request) => new URL(request.url, 'http://localhost').pathname)).toEqual([
      '/api/s3/demo-uploads/a%20folder/%23100%25/a%20%23%25.txt',
      '/api/s3/demo-uploads/a%20folder/%23100%25/empty.txt',
    ]);
    expect(requests.map((request) => request.body)).toEqual(['first', '']);
    expect(requests.map((request) => request.sha)).toEqual([
      createHash('sha256').update('first').digest('hex'),
      createHash('sha256').update('').digest('hex'),
    ]);
    expect(requests.every((request) => request.condition === '*' && request.contentType === 'text/plain')).toBe(true);
  } finally {
    releaseFirst();
    receiver.closeAllConnections();
    await new Promise<void>((resolve, reject) => receiver.close((error) => (error ? reject(error) : resolve())));
  }
});

test('S3 manual retry repeats a whole PUT and cancellation aborts without DELETE', async ({page}) => {
  await page.addInitScript(() => {
    (window as unknown as {__s3UploadDemoStub?: boolean}).__s3UploadDemoStub = false;
  });
  const methods: string[] = [];
  let attempts = 0;
  let releaseCancel: () => void = () => undefined;
  const cancelResponse = new Promise<void>((resolve) => {
    releaseCancel = resolve;
  });
  await page.route('**/api/s3/**', async (route) => {
    methods.push(route.request().method());
    attempts++;
    if (attempts === 1) return route.fulfill({status: 503, body: ''});
    if (attempts === 3) await cancelResponse;
    return route.fulfill({status: 200, body: ''});
  });
  await page.goto('/clr-lift/components/upload');
  const demo = page.getByTestId('upload-demo-s3');
  await demo.locator('input[type="file"]').first().setInputFiles(file('retry.txt'));
  await demo.getByRole('button', {name: 'Upload', exact: true}).click();
  const panel = page.locator('.cll-upload-panel');
  await expect(panel.locator('[data-status="error"]')).toContainText('503');
  await panel.getByRole('button', {name: 'Retry', exact: true}).click();
  await expect(demo.getByTestId('s3-demo-stored').locator('li')).toHaveCount(1);
  await demo.getByRole('checkbox').check();
  await demo.locator('input[type="file"]').first().setInputFiles(file('cancel.txt'));
  await demo.getByRole('button', {name: 'Upload', exact: true}).click();
  await expect.poll(() => methods.length).toBe(3);
  await panel.getByRole('button', {name: 'Cancel', exact: true}).click();
  await expect(panel).toContainText('Cancelled');
  releaseCancel();
  await expect(demo.getByTestId('s3-demo-stored').locator('li')).toHaveCount(1);
  expect(methods).toEqual(['PUT', 'PUT', 'PUT']);
});

test('cancelling while S3 hashing is pending prevents any PUT', async ({page}) => {
  await page.addInitScript(() => {
    (window as unknown as {__s3UploadDemoStub?: boolean}).__s3UploadDemoStub = false;
    // A controllable digest tests the late-result race without a fixed delay or huge allocation.
    const digest = crypto.subtle.digest.bind(crypto.subtle);
    crypto.subtle.digest = (...args: Parameters<SubtleCrypto['digest']>) =>
      new Promise<ArrayBuffer>((resolve, reject) => {
        (window as unknown as {__finishS3Hash: () => Promise<void>}).__finishS3Hash = () =>
          digest(...args).then(resolve, reject);
      });
  });
  const requests: string[] = [];
  await page.route('**/api/s3/**', (route) => {
    requests.push(route.request().url());
    return route.fulfill({status: 200, body: ''});
  });
  await page.goto('/clr-lift/components/upload');
  const demo = page.getByTestId('upload-demo-s3');
  await demo.locator('input[type="file"]').first().setInputFiles(file('hashing.txt'));
  await demo.getByRole('button', {name: 'Upload', exact: true}).click();
  await page.waitForFunction(() => '__finishS3Hash' in window);
  const panel = page.locator('.cll-upload-panel');
  await panel.getByRole('button', {name: 'Cancel', exact: true}).click();
  await page.evaluate(() => (window as unknown as {__finishS3Hash: () => Promise<void>}).__finishS3Hash());
  await expect(panel).toContainText('Cancelled');
  await expect(demo.getByTestId('s3-demo-stored').locator('li')).toHaveCount(0);
  expect(requests).toEqual([]);
});

test('S3 fields and teaching text render in every locale at a narrow width', async ({page}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/clr-lift/components/upload');
  for (const {code} of demoLocales) {
    const messages = dictionaryMessages('apps/demo/src/app/core/l10n/demo.l10n.' + code.toLowerCase() + '.ts');
    await page.evaluate((locale) => localStorage.setItem('clr-lift-lang', locale), code);
    await page.reload();
    const demo = page.getByTestId('upload-demo-s3');
    await expect(demo.getByLabel(messages['uploadDemo.s3.bucket'], {exact: true})).toBeVisible();
    await expect(demo.getByLabel(messages['uploadDemo.s3.prefix'], {exact: true})).toBeVisible();
    await expect(demo.getByRole('checkbox', {name: messages['uploadDemo.s3.overwrite']})).toBeVisible();
    await expect(demo).toContainText(messages['uploadDemo.s3.note']);
    await expect(demo).toContainText(messages['uploadDemo.s3.limits']);
    expect(await demo.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  }
});

test('S3 preserves leading and repeated prefix slashes as distinct object keys', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  const demo = page.getByTestId('upload-demo-s3');
  for (const prefix of ['documents/', '/documents/', '//documents//']) {
    await demo.getByLabel('Object key prefix', {exact: true}).fill(prefix);
    await demo.locator('input[type="file"]').first().setInputFiles(file('same.txt'));
    await demo.getByRole('button', {name: 'Upload', exact: true}).click();
    await expect(demo.getByTestId('s3-demo-stored')).toContainText('/api/s3/demo-uploads/' + prefix + 'same.txt');
  }
  await expect(demo.getByTestId('s3-demo-stored').locator('li')).toHaveCount(3);
  await expect(page.locator('.cll-upload-panel [data-status="error"]')).toHaveCount(0);
});

test('S3 Close returns keyboard focus to its Browse control', async ({page}) => {
  await page.goto('/clr-lift/components/upload');
  const demo = page.getByTestId('upload-demo-s3');
  await demo.locator('input[type="file"]').first().setInputFiles(file('focus.txt'));
  await demo.getByRole('button', {name: 'Upload', exact: true}).click();
  const done = page.locator('.cll-upload-panel').getByRole('button', {name: 'Close', exact: true});
  await expect(done).toBeVisible();
  await done.focus();
  await page.keyboard.press('Enter');
  await expect(demo.getByRole('button', {name: 'Browse', exact: true})).toBeFocused();
});
