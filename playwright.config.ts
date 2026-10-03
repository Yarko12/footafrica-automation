import { defineConfig, devices } from '@playwright/test';
import { getStorageStateFileName, isHeadless } from './common/config';

const CI = !!process.env.CI;
const USER_AGENT = 'QA autotest v1.0';

export default defineConfig({
  fullyParallel: !CI,
  forbidOnly: CI,
  retries: CI ? 2 : 1,
  workers: CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'test-reports/html', open: 'never' }]],

  use: {
    userAgent: USER_AGENT,
    baseURL: 'https://foot-africa.com/',
    headless: isHeadless() || CI,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
  },

  expect: {
    timeout: 10_000,
  },

  outputDir: 'test-results',

  projects: [
    {
      name: 'foot-africa-setup',
      testMatch: '**/foot-africa-setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://foot-africa.com/',
      },
    },
    {
      name: 'foot-africa',
      testDir: './tests',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://foot-africa.com/',
        storageState: getStorageStateFileName('foot-africa'),
      },
      dependencies: ['foot-africa-setup'],
    },
  ],
});
