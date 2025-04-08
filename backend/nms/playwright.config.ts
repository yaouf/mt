import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '__integration_tests__',
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    headless: true, // Run tests in headful mode
    baseURL: 'http://localhost:3000/',
  },
});
