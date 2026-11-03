import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 25000,
  expect: { timeout: 7000 },
  retries: 1,
  workers: 2,
  reporter: 'list',
  use: { browserName: 'chromium', headless: true },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
    timeout: 120000,
  },
})
