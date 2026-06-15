import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir:   './e2e',
  timeout:   30_000,
  retries:   1,
  reporter:  'list',

  use: {
    baseURL:     'http://localhost:5173',
    trace:       'on-first-retry',
    screenshot:  'only-on-failure',
  },

  projects: [
    {
      // Desktop: runs race-flow and persistence specs (both panels visible in DOM)
      name:       'chromium',
      testIgnore: '**/mobile.spec.ts',
      use:        { ...devices['Desktop Chrome'] },
    },
    {
      // Mobile: runs only mobile.spec.ts with iPhone 13 viewport
      name:      'mobile',
      testMatch: '**/mobile.spec.ts',
      use:       { ...devices['iPhone 13'] },
    },
  ],

  webServer: {
    command:            'npx vite --mode e2e',
    url:                'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout:            15_000,
  },
})
