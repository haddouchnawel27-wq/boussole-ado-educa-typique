import { defineConfig } from "@playwright/test";

// Réutilise le Chromium déjà présent dans l'environnement (pas de téléchargement).
const CHROME = process.env.AMZ_CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3210",
    launchOptions: { executablePath: CHROME, args: ["--no-sandbox"] },
  },
  projects: [{ name: "chromium", use: { browserName: "chromium", viewport: { width: 390, height: 820 } } }],
  webServer: {
    command: "PORT=3210 npm run dev",
    url: "http://localhost:3210/al-mizan",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
