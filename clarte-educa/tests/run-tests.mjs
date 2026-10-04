#!/usr/bin/env node
/* Tests structurels de Clarté Educa — sans dépendance externe.
   Lancer :  node clarte-educa/tests/run-tests.mjs
   Couvre les 12 points de recette (statiques). Le test fonctionnel navigateur
   n'est PAS automatisé ici (pas de jsdom/puppeteer) → voir la recette manuelle. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import os from "node:os";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTILS = path.join(ROOT, "outils");
const htmlFiles = [
  path.join(ROOT, "index.html"),
  ...fs.readdirSync(OUTILS).filter(f => f.endsWith(".html")).map(f => path.join(OUTILS, f)),
];
const read = f => fs.readFileSync(f, "utf8");
const rel = f => path.relative(ROOT, f);

let pass = 0, fail = 0;
const results = [];
function check(name, cond, detail = "") {
  const ok = !!cond;
  results.push({ name, ok, detail });
  ok ? pass++ : fail++;
}

/* 1. Syntaxe JS de tous les HTML (scripts inline) */
{
  let syntaxOk = true, bad = [];
  for (const f of htmlFiles) {
    const html = read(f);
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
    scripts.forEach((code, i) => {
      const tmp = path.join(os.tmpdir(), `ce_${path.basename(f)}_${i}.js`);
      fs.writeFileSync(tmp, code);
      try { execSync(`node --check "${tmp}"`, { stdio: "pipe" }); }
      catch (e) { syntaxOk = false; bad.push(`${rel(f)}#${i}`); }
      finally { fs.unlinkSync(tmp); }
    });
  }
  check("1. Syntaxe JS de tous les HTML", syntaxOk, bad.join(", "));
}

/* 2 & 11. Existence des liens locaux (href/src .html/.css) — aucun lien cassé */
{
  let allExist = true, missing = [];
  for (const f of htmlFiles) {
    const html = read(f);
    const links = [...html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/gi)].map(m => m[1]);
    for (const l of links) {
      if (/^(https?:|data:|mailto:|tel:|#|\/\/)/i.test(l)) continue;
      if (!/\.(html|css)$/i.test(l)) continue;
      const abs = path.resolve(path.dirname(f), l.split("#")[0].split("?")[0]);
      if (!fs.existsSync(abs)) { allExist = false; missing.push(`${rel(f)} → ${l}`); }
    }
  }
  check("2. Liens locaux .html/.css existants (aucun cassé)", allExist, missing.join(" | "));
}

/* 3. Absence de Mode/Espace Pro et notes cliniques */
{
  const re = /mode.?pro|pro-panel|toggle-pro|data-note|btn-pro|notes pro|cas cliniques|\bpatients\b|en cabinet|notes cliniques|pour les pros|show-pro/i;
  const hits = htmlFiles.filter(f => re.test(read(f))).map(rel);
  check("3. Aucun Mode/Espace Pro ni note clinique", hits.length === 0, hits.join(", "));
}

/* 4. Absence de liens Ado */
{
  const re = /outils-ado|espace ado|href="[^"]*\/ado/i;
  const hits = htmlFiles.filter(f => re.test(read(f))).map(rel);
  check("4. Aucun lien Ado", hits.length === 0, hits.join(", "));
}

/* 5. Présence des clés dédiées clarte_educa_* */
{
  const map = {
    "index.html": "clarte_educa_parcours_v2",
    "outils/emotionometre-parental.html": "clarte_educa_emotionometre_v1",
    "outils/guide-consignes-efficaces.html": "clarte_educa_consignes_v1",
    "outils/kit-gestion-emotions.html": "clarte_educa_kit_emotions_v1",
    "outils/chrono-energies-maman.html": "clarte_educa_chrono_energies_v1",
    "outils/mon-plan-pas-a-pas.html": "clarte_educa_plan_v1",
  };
  let ok = true, bad = [];
  for (const [file, key] of Object.entries(map)) {
    if (!read(path.join(ROOT, file)).includes(key)) { ok = false; bad.push(`${file} manque ${key}`); }
  }
  check("5. Clés de stockage dédiées clarte_educa_* présentes", ok, bad.join(", "));
}

/* 6. Anciennes clés génériques uniquement en migration (jamais actives) */
{
  const olds = {
    "outils/emotionometre-parental.html": "educatypique_emotionometre_v1",
    "outils/guide-consignes-efficaces.html": "neuroped_guide_parents_consignes_v1",
    "outils/kit-gestion-emotions.html": "educatypique_kit_emotions_v1",
    "outils/chrono-energies-maman.html": "educatypique_chrono_energies_maman_v1",
    "outils/mon-plan-pas-a-pas.html": "educatypique_mon_plan_pas_a_pas_v1",
  };
  let ok = true, bad = [];
  for (const [file, oldKey] of Object.entries(olds)) {
    const lines = read(path.join(ROOT, file)).split("\n").filter(l => l.includes(oldKey));
    // toutes les occurrences de l'ancienne clé doivent être sur une ligne de migration (contenant aussi clarte_educa_)
    if (lines.some(l => !l.includes("clarte_educa_"))) { ok = false; bad.push(`${file}: ancienne clé hors migration`); }
  }
  check("6. Anciennes clés uniquement en migration", ok, bad.join(", "));
}

/* 7. État principal : currentStep, outilChoisi, strategieRetenue, createdAt, updatedAt */
{
  const idx = read(path.join(ROOT, "index.html"));
  const needed = ["currentStep", "outilChoisi", "strategieRetenue", "createdAt", "updatedAt"];
  const missing = needed.filter(k => !idx.includes(k));
  check("7. Champs d'état (step/outil/stratégie/dates)", missing.length === 0, "manque: " + missing.join(", "));
}

/* 8. Conditions minimales de passage */
{
  const idx = read(path.join(ROOT, "index.html"));
  const needed = ["function done(", "function canEnter(", "function tryNext(", "firstIncomplete"];
  const missing = needed.filter(k => !idx.includes(k));
  check("8. Conditions de passage (done/canEnter/tryNext)", missing.length === 0, "manque: " + missing.join(", "));
}

/* 9. Impression + remise à zéro confirmée */
{
  const idx = read(path.join(ROOT, "index.html"));
  const printOk = idx.includes("window.print");
  const resetOk = /function resetAll\([\s\S]*?confirm\(/.test(idx) && idx.includes('indexOf("clarte_educa_")');
  check("9. Impression + reset confirmé (clés clarte_educa_ seulement)", printOk && resetOk, `print:${printOk} reset:${resetOk}`);
}

/* 10. Aucun diagnostic/score-verdict AJOUTÉ (le seul 'verdict' toléré = disclaimer 'jamais un verdict') */
{
  let ok = true, bad = [];
  for (const f of htmlFiles) {
    const lines = read(f).split("\n");
    lines.forEach((l, i) => {
      if (/\bverdict\b/i.test(l) && !/jamais.*verdict|pas un.*verdict|aucun.*verdict/i.test(l)) {
        // tolère les mécaniques internes d'outils déjà auditées ? -> non : on veut zéro verdict visible ajouté.
        ok = false; bad.push(`${rel(f)}:${i + 1}`);
      }
    });
  }
  check("10. Aucun score-verdict (hors disclaimer)", ok, bad.slice(0, 6).join(", "));
}

/* 12. Routage des 3 familles de besoins */
{
  const idx = read(path.join(ROOT, "index.html"));
  const ok = idx.includes("function suggest(") &&
    ["kit", "consignes", "energie"].every(k => new RegExp(`\\b${k}\\b`).test(idx));
  check("12. Routage 3 familles (kit/consignes/energie)", ok);
}

/* ---- Rapport ---- */
console.log("\n=== Tests structurels Clarté Educa ===\n");
for (const r of results) {
  console.log(`${r.ok ? "✅" : "❌"} ${r.name}${r.detail && !r.ok ? "  — " + r.detail : ""}`);
}
console.log(`\n${pass} réussis · ${fail} échoués\n`);
console.log("ℹ️  Test fonctionnel navigateur (remplir→outil→retour→stratégie→plan→recharger→reprise→suivi→récap) :");
console.log("   non automatisé (pas de jsdom/puppeteer ici) → à exécuter en recette manuelle.\n");
process.exit(fail === 0 ? 0 : 1);
