import {defineConfig, devices} from '@playwright/test';
import {nxE2EPreset} from '@nx/playwright/preset';
import {workspaceRoot} from '@nx/devkit';

// For CI, set BASE_URL to the already-running app to avoid per-task webServer startup.
const externalBaseURL = process.env['BASE_URL'];
const baseURL = externalBaseURL || 'http://localhost:4307';
const requestedBrowsers = (process.env['PLAYWRIGHT_BROWSERS'] ?? 'chromium,firefox,webkit')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);
const browserProjects = [
  {
    name: 'chromium',
    use: {...devices['Desktop Chrome']},
  },
  {
    name: 'firefox',
    use: {...devices['Desktop Firefox']},
  },
  {
    name: 'webkit',
    use: {...devices['Desktop Safari']},
  },
].filter((project) => requestedBrowsers.includes(project.name));

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, {testDir: './src'}),
  /* Nx Playwright preset forces 1 worker on CI; allow opt-in parallel workers. */
  workers: process.env['CI'] ? Number(process.env['PLAYWRIGHT_WORKERS'] ?? 1) : undefined,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
  webServer: externalBaseURL
    ? undefined
    : {
        command: process.env['CI']
          ? 'pnpm exec nx run demo:serve-static --buildTarget=demo:build:development --staticFilePath=dist/apps/demo/browser --port=4307 --spa'
          : 'pnpm nx run demo:serve --port=4307 --hmr=false',
        url: baseURL,
        reuseExistingServer: !process.env['CI'],
        timeout: 120 * 1000,
        cwd: workspaceRoot,
      },
  projects: browserProjects.length ? browserProjects : [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
});
