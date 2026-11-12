import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const URL = "/al-mizan";
const PROFILE = JSON.stringify({
  schema: 1, onboarded: true, mode: "real", name: "Nawel", useName: true, consent: true, createdAt: "2026-07-21T00:00:00.000Z",
});
async function seedProfile(page: Page) {
  await page.addInitScript((p) => localStorage.setItem("almizan.profile.v1", p), PROFILE);
}
async function runQuiz(page: Page, answerFor: (label: string) => string | null) {
  await page.getByRole("button", { name: /parcours guidé/i }).click();
  await page.getByRole("button", { name: "Commencer" }).click();
  for (let s = 0; s < 6; s++) {
    const label = await page.locator(".amz-quiz-h").innerText();
    const opt = answerFor(label);
    if (opt) {
      const items = page.locator(".amz-q-item");
      const n = await items.count();
      for (let i = 0; i < n; i++) await items.nth(i).getByText(opt, { exact: true }).click();
    }
    if (s < 5) await page.getByRole("button", { name: "Continuer" }).click();
    else await page.getByRole("button", { name: "Voir le résultat" }).click();
  }
}

test("onboarding → espace vide → check-in qui persiste", async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Commencer" }).click();
  await page.getByLabel("Prénom (facultatif)").fill("Nawel");
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByRole("button", { name: /espace vide/i }).click();

  await expect(page.locator(".amz-h1")).toContainText("Bonjour");
  await page.getByRole("button", { name: /point du jour/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.locator("#ci-energie").fill("8");
  await page.getByRole("button", { name: /déposer mon état/i }).click();
  await expect(page.locator(".amz-flash")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".amz-streak")).toHaveText("1");
});

test("questionnaire → synthèse par domaine (jamais une note globale)", async ({ page }) => {
  await seedProfile(page);
  await page.goto(URL);
  await runQuiz(page, () => "Parfois");
  await expect(page.getByText("Ce que vos réponses montrent aujourd'hui")).toBeVisible();
  await expect(page.getByText("ni une note, ni un diagnostic")).toBeVisible();
});

test("route la plus protectrice → soutien + 3114", async ({ page }) => {
  await seedProfile(page);
  await page.goto(URL);
  await runQuiz(page, (label) => (label.includes("Trop-plein") ? "Presque toujours" : null));
  await expect(page.getByText("Vous semblez porter beaucoup")).toBeVisible();
  await expect(page.getByText("3114")).toBeVisible();
});

test("aucun scroll horizontal de 320 à 1280 px", async ({ page }) => {
  await seedProfile(page);
  for (const w of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(URL);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `overflow à ${w}px`).toBeLessThanOrEqual(0);
  }
});

test("accessibilité (axe) — onboarding & app : 0 violation", async ({ page }) => {
  await page.goto(URL);
  const ob = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(ob.violations, JSON.stringify(ob.violations.map((v) => v.id))).toEqual([]);

  await seedProfile(page);
  await page.goto(URL);
  const app = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(app.violations, JSON.stringify(app.violations.map((v) => v.id))).toEqual([]);
});
