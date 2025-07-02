import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: /.*\.spec\.js/,
  use: {
    launchOptions: {
      args: ['--no-sandbox']
    }
  }
});