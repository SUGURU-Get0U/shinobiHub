import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: '**/*.spec.ts',
  use: { baseURL: "http://127.0.0.1:8081", headless: true },
  webServer: {
    command: "python -m http.server 8081 --bind 127.0.0.1 --directory dist",
    url: "http://127.0.0.1:8081",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
