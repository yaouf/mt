import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '__integration_tests__',
  use: {
    headless: true, // Run tests in headful mode
  },
});
