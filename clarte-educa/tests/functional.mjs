#!/usr/bin/env node
/* Test FONCTIONNEL de bout en bout (navigateur réel via puppeteer-core).
 *
 * Prérequis : un Chromium + puppeteer-core.
 *   CHROME_BIN=/chemin/vers/chrome  NODE_PATH=/chemin/vers/node_modules \
 *   node clarte-educa/tests/functional.mjs
 *
 * Scénario : remplir → choisir la suggestion → ouvrir l'outil → revenir →
 * confirmer une stratégie → rédiger un plan → recharger → vérifier la reprise →
 * ajouter un suivi → ouvrir le récapitulatif. + un test de condition de passage.
 *
 * Si puppeteer-core n'est pas disponible, le test se SAUTE proprement (exit 0)
 * en le signalant — il ne doit jamais être déclaré "réussi" sans exécution.
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Par défaut file://, mais on privilégie une URL http (BASE_URL) pour un localStorage
// au comportement identique à la production (file:// isole le stockage en headless).
const INDEX = process.env.BASE_URL || pathToFileURL(path.join(ROOT, "index.html")).href;
const CHROME = process.env.CHROME_BIN || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

let puppeteer;
try { puppeteer = (await import("puppeteer-core")).default; }
catch { console.log("⏭️  puppeteer-core absent → test fonctionnel SAUTÉ (non exécuté)."); process.exit(0); }

const results = [];
const ok = (n, c, d = "") => results.push({ n, c: !!c, d });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 780 });
  await page.goto(INDEX, { waitFor: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const clickText = async (sel, txt) => page.evaluate((s, t) => {
    const el = [...document.querySelectorAll(s)].find(e => e.textContent.trim() === t);
    if (el) { el.click(); return true; } return false;
  }, sel, txt);
  const visibleStep = () => page.evaluate(() =>
    [...document.querySelectorAll("section[data-step]")].filter(s => !s.classList.contains("hidden")).map(s => s.getAttribute("data-step"))[0]);
  const errText = () => page.$eval("#err", e => e.textContent.trim()).catch(() => "");
  const store = () => page.evaluate(() => JSON.parse(localStorage.getItem("clarte_educa_parcours_v2") || "null"));
  const clickSel = async (s) => page.evaluate((x) => { const e = document.querySelector(x); if (e) e.click(); }, s);
  const type = async (s, v) => { await page.focus(s); await page.evaluate((x) => { document.querySelector(x).value = ""; }, s); await page.type(s, v); };

  // Intro
  await page.type("#f-enfant", "Lina");
  await page.select("#f-age", "6-7 ans");
  await clickSel("#start-btn");
  ok("Démarrage → étape 1", (await visibleStep()) === "1");

  // GATE : Continuer sans situation → doit rester sur l'étape 1 + message
  await page.evaluate(() => document.querySelector('[data-next="1"]').click());
  ok("Condition douce (bloque sans situation)", (await visibleStep()) === "1" && (await errText()).length > 0);

  // Étape 1 : choisir une situation "émotions" puis continuer
  await clickText("#chips-situation .chip", "Émotions / crises");
  await page.evaluate(() => document.querySelector('[data-next="1"]').click());
  ok("Étape 1 → 2 après sélection", (await visibleStep()) === "2");

  // Étape 2 : observation
  await type("#f-observation", "Hier au moment des devoirs, il a crié et est parti 5 minutes.");
  await page.evaluate(() => { document.querySelector("#f-observation").dispatchEvent(new Event("input", { bubbles: true })); });
  await page.evaluate(() => document.querySelector('[data-next="2"]').click());
  ok("Étape 2 → 3", (await visibleStep()) === "3");

  // Étape 3 : besoin "Du calme"
  await clickText("#chips-besoin .chip", "Du calme");
  await page.evaluate(() => document.querySelector('[data-next="3"]').click());
  ok("Étape 3 → 4", (await visibleStep()) === "4");

  // Étape 4 : routage → suggestion = "Apaiser une émotion forte" (kit)
  const sugTxt = await page.$eval("#suggest-zone", e => e.textContent).catch(() => "");
  ok("Routage émotions → kit suggéré", /Apaiser une émotion forte/.test(sugTxt));

  // Ouvrir l'outil suggéré (même onglet) → navigation vers le kit
  await Promise.all([
    page.waitForNavigation({ waitUntil: "load" }),
    page.evaluate(() => document.querySelector("#suggest-zone a.tool").click()),
  ]);
  ok("Ouverture outil = même onglet vers le kit", /kit-gestion-emotions\.html/.test(page.url()));
  const st1 = await page.evaluate(() => JSON.parse(localStorage.getItem("clarte_educa_parcours_v2") || "null"));
  ok("outilChoisi + currentStep sauvegardés avant l'outil", st1 && st1.outilChoisi && st1.outilChoisi.id === "kit" && st1.currentStep === 4);

  // Retour au parcours via le lien du kit
  await Promise.all([
    page.waitForNavigation({ waitUntil: "load" }),
    page.evaluate(() => { const a = document.querySelector('a.retour[href="../index.html"]') || document.querySelector('a[href="../index.html"]'); a.click(); }),
  ]);
  ok("Retour outil → reprise à l'étape 4 (pas l'accueil)", (await visibleStep()) === "4");
  ok("Champ 'stratégie que je retiens' présent au retour", await page.$("#chosen-strategie") !== null);

  // Stratégie retenue
  await type("#chosen-strategie", "Une seule consigne à la fois, et je félicite dès qu'il commence.");
  await page.evaluate(() => document.querySelector("#chosen-strategie").dispatchEvent(new Event("input", { bubbles: true })));
  await page.evaluate(() => document.querySelector('[data-next="4"]').click());
  ok("Étape 4 → 5 (avec stratégie)", (await visibleStep()) === "5");

  // Rappel outil+stratégie dans le plan
  const planRecall = await page.$eval("#plan-recall", e => e.textContent).catch(() => "");
  ok("Plan rappelle outil + stratégie", /Apaiser une émotion forte/.test(planRecall) && /une seule consigne/i.test(planRecall));

  // Plan
  await type("#f-plan", "Avant les devoirs : 5 min de pause calme, puis une consigne à la fois.");
  await page.evaluate(() => { document.querySelector("#f-plan").dispatchEvent(new Event("input", { bubbles: true })); });
  await page.evaluate(() => document.querySelector('[data-next="5"]').click());
  ok("Étape 5 → 6", (await visibleStep()) === "6");

  // Suivi
  await type("#f-suivi", "Jour 1 et 2 : plus calme. Jour 3 plus dur (fatigue).");
  await clickSel("#add-suivi");
  const suiviCount = await page.$$eval("#suivi-list .suivi-item", els => els.length);
  ok("Ajout d'un suivi", suiviCount === 1);

  // RECHARGEMENT → reprise
  await page.reload({ waitUntil: "load" });
  ok("Reprise après rechargement (étape 6)", (await visibleStep()) === "6");
  const st2 = await store();
  ok("Données persistées après reload (plan+suivi+outil)", st2 && st2.plan && st2.suivi.length === 1 && st2.outilChoisi.id === "kit");

  // Récap
  await page.evaluate(() => document.querySelector('[data-next="6"]').click());
  ok("Étape 6 → Récap", (await visibleStep()) === "7");
  const recap = await page.$eval("#recap", e => e.textContent);
  ok("Récap : outil choisi", /Apaiser une émotion forte/.test(recap));
  ok("Récap : stratégie retenue", /une seule consigne/i.test(recap));
  ok("Récap : plan d'essai", /pause calme/i.test(recap));
  ok("Récap : suivi", /fatigue/i.test(recap));
  ok("Récap : dates créé + mis à jour", /Créé le/.test(recap) && /Dernière mise à jour/.test(recap));

} catch (e) { ok("Exécution complète du scénario sans erreur", false, e.message); }
finally { await browser.close(); }

console.log("\n=== Test fonctionnel Clarté Educa (navigateur réel) ===\n");
let fail = 0;
for (const r of results) { console.log(`${r.c ? "✅" : "❌"} ${r.n}${!r.c && r.d ? " — " + r.d : ""}`); if (!r.c) fail++; }
console.log(`\n${results.length - fail} réussis · ${fail} échoués\n`);
process.exit(fail === 0 ? 0 : 1);
