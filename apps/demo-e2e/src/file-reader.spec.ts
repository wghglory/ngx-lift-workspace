import {expect, test} from '@playwright/test';

test.describe('FileReader component', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/file-reader');
  });

  test('Example 1: reads file, enables submit, and logs only basicForm data without Example 2 caCert', async ({
    page,
  }) => {
    const example1 = page.locator('article', {hasText: 'Example 1: Basic File Reader'});
    const submitBtn = example1.locator('button[type="submit"]');

    // Initially, Example 1 submit button is disabled because file is empty
    await expect(submitBtn).toBeDisabled();

    // Upload a text file in Example 1
    const fileInput = example1.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-config.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('port=8080\nenv=production'),
    });

    // Verify file name is shown and success message appears
    await expect(example1).toContainText('test-config.txt');
    await expect(example1).toContainText('File content has been read successfully');

    // Submit button should now be enabled
    await expect(submitBtn).toBeEnabled();

    // Click submit and wait for console log
    const [msg1] = await Promise.all([
      page.waitForEvent(
        'console',
        async (msg) =>
          msg.type() === 'log' && (JSON.stringify(await msg.args()[0]?.jsonValue()) ?? '').includes('port=8080'),
      ),
      submitBtn.click(),
    ]);

    // Verify that the logged data contains the file content but NOT caCert from Example 2
    const values1 = await Promise.all(msg1.args().map((arg) => arg.jsonValue().catch(() => msg1.text())));
    const logStr = JSON.stringify(values1);
    expect(logStr).toContain('port=8080');
    expect(logStr).not.toContain('BEGIN CERTIFICATE');

    // Remove the file and verify submit button becomes disabled again
    const removeBtn = example1.locator('button.btn-close');
    await removeBtn.click();
    await expect(example1).not.toContainText('test-config.txt');
    await expect(submitBtn).toBeDisabled();
  });

  test('Example 2: displays pre-filled certificate and certificate signpost', async ({page}) => {
    const example2 = page.locator('article', {hasText: 'Example 2: Certificate File Reader'});
    await example2.locator('[data-test-id="load-certificate"]').click();
    const signpostTrigger = example2.locator('cll-certificate-signpost button');

    // Verify certificate signpost is present
    await expect(signpostTrigger).toBeVisible();

    // Click signpost to open details
    await signpostTrigger.click();

    // Verify certificate details are visible in the signpost content
    const signpostContent = page.locator('clr-signpost-content');
    await expect(signpostContent).toBeVisible();
    await expect(signpostContent).toContainText('Issued To');
    await expect(signpostContent).toContainText('Issued By');
    await expect(signpostContent).toContainText('Broadcom Inc.');

    // Example 2 submit button is enabled for the valid pre-filled cert
    const submitBtn = example2.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();

    // Click submit and wait for console log
    const [msg2] = await Promise.all([
      page.waitForEvent(
        'console',
        async (msg) =>
          msg.type() === 'log' &&
          (JSON.stringify(await msg.args()[0]?.jsonValue()) ?? '').includes('BEGIN CERTIFICATE'),
      ),
      submitBtn.click(),
    ]);
    const values2 = await Promise.all(msg2.args().map((arg) => arg.jsonValue().catch(() => msg2.text())));
    const lastLog = JSON.stringify(values2);
    expect(lastLog).toContain('BEGIN CERTIFICATE');
    expect(lastLog).not.toContain('port=8080');
  });

  test('Example 2: validates file size limit', async ({page}) => {
    const example2 = page.locator('article', {hasText: 'Example 2: Certificate File Reader'});
    const fileInput = example2.locator('input[type="file"]');

    // Create a virtual file that exceeds the 5MB limit (6MB)
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'a');
    await fileInput.setInputFiles({
      name: 'oversized.pem',
      mimeType: 'application/x-pem-file',
      buffer: largeBuffer,
    });

    // Check error message
    await expect(example2).toContainText('Exceed the maximum file size (5 MB)');
  });
});
