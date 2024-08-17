import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */


const runTime = process.env.RUN_TIME || 'stage';
const envConfigurations = require(`./Integration-E2E/utilities/env.config.json`); // load env configuration from json
const configurations = runTime == "prod" ? envConfigurations.prod : runTime == "stage" ? envConfigurations.stage : envConfigurations.ci; /*need to enhance this get the configuration using the run time*/


export default defineConfig({

  runTime: process.env.RUN_TIME || 'ci',
  //  envConfigurations:require(`./Integration-E2E/utilities/env.config.json`), // load env configuration from json
  //  configurations:runTime=="prod"? envConfigurations.prod : runTime=="stage"? envConfigurations.stage: envConfigurations.ci, /*need to enhance this get the configuration using the run time*/

  testDir: './Integration-E2E',
  output: './test-results',
  expect: {
      /*** Maximum time expect() should wait for the condition to be met.*/
      timeout: 600000000
    },
  reporter: [

    ['html', { open: 'never' }],

    ['json', { outputFile: './test-results/json/Playwrighttestreport.json' }],

    ['junit', { outputFile: './test-results/xml/test-results.xml' }],

  ],
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries:  runTime=="ci" ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: runTime == "stage" ? 1 : 2,

  //   reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: configurations.BASE_URL,
    headless: true,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chromium'],
        viewport: null,
        launchOptions: {
          args: ["--start-maximized"]
        }
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  /* Run your local dev server before starting the Integration-E2E */
  webServer: process.env.RUN_TIME == "ci" ? {
    command: 'npm run start',
    url: configurations.BASE_URL,
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 240 * 1000,
  } : undefined,
});
