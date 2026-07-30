/* ============================================================
   Mode DÉMO — outils pro NeuroPed (décision 22/07/2026)
   L'outil reste CONSULTABLE (vitrine : structure, qualité).
   Sont VERROUILLÉS : l'enregistrement (persistance) et l'export/impression.
   → la valeur réelle (conserver ses dossiers) passe par Les Deux Jardins.

   NON DESTRUCTIF : ce script enrobe des comportements à l'exécution.
   Il ne supprime aucun fichier, ne modifie aucune donnée déjà stockée,
   et se retire en enlevant la balise <script> qui l'inclut.
   ============================================================ */
(function () {
  "use strict";

  var LDJ = "https://les-deux-jardins.vercel.app/";
  var MSG = "Pour utiliser cet outil avec vos accompagnées et conserver vos dossiers → Les Deux Jardins.";
  var PRO_PREFIX = /^(neuroped_|educatypique_)/; // clés de persistance des outils pro

  // --- styles (injectés, sans toucher le CSS de l'outil) ---
  var css = document.createElement("style");
  css.textContent = [
    "#ldj-demo-banner{position:sticky;top:0;z-index:9999;display:flex;flex-wrap:wrap;align-items:center;gap:10px;",
    "padding:10px 16px;background:linear-gradient(90deg,#2f6f6a,#3a857e);color:#fff;font-family:system-ui,sans-serif;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.12)}",
    "#ldj-demo-banner .ldj-demo-tag{flex:none;background:rgba(255,255,255,.22);border-radius:999px;padding:3px 10px;font-weight:800;font-size:11px;letter-spacing:.06em;text-transform:uppercase}",
    "#ldj-demo-banner .ldj-demo-txt{flex:1;min-width:180px;line-height:1.4}",
    "#ldj-demo-banner .ldj-demo-cta{flex:none;background:#fff;color:#2f6f6a;font-weight:700;text-decoration:none;border-radius:10px;padding:7px 14px}",
    "#ldj-demo-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(20px);z-index:10000;max-width:90vw;",
    "background:#3b2b23;color:#fff;font-family:system-ui,sans-serif;font-size:14px;line-height:1.4;padding:13px 16px;border-radius:14px;",
    "box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;text-align:center}",
    "#ldj-demo-toast.on{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}",
    "#ldj-demo-toast a{color:#ffd27a;font-weight:700;text-decoration:underline}"
  ].join("");
  (document.head || document.documentElement).appendChild(css);

  function banner() {
    if (document.getElementById("ldj-demo-banner")) return;
    var b = document.createElement("div");
    b.id = "ldj-demo-banner";
    b.setAttribute("role", "note");
    b.innerHTML =
      '<span class="ldj-demo-tag">Aperçu</span>' +
      '<span class="ldj-demo-txt">' + MSG + '</span>' +
      '<a class="ldj-demo-cta" href="' + LDJ + '" target="_blank" rel="noopener">Découvrir Les Deux Jardins →</a>';
    document.body.insertBefore(b, document.body.firstChild);
  }

  var _timer;
  function toast() {
    var x = document.getElementById("ldj-demo-toast");
    if (!x) { x = document.createElement("div"); x.id = "ldj-demo-toast"; document.body.appendChild(x); }
    x.innerHTML = MSG + ' <a href="' + LDJ + '" target="_blank" rel="noopener">Les Deux Jardins →</a>';
    x.classList.add("on");
    clearTimeout(_timer);
    _timer = setTimeout(function () { x.classList.remove("on"); }, 4500);
  }

  // 1) Verrouiller l'ENREGISTREMENT : neutraliser la persistance des clés pro.
  try {
    var _set = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = function (k, v) {
      if (PRO_PREFIX.test(String(k))) { toast(); return; }
      return _set(k, v);
    };
  } catch (e) { /* stockage indisponible : rien à verrouiller */ }

  // 2) Verrouiller l'IMPRESSION.
  try {
    window.print = function () { toast(); };
  } catch (e) { /* ignore */ }

  // 3) Verrouiller l'EXPORT / TÉLÉCHARGEMENT / ENREGISTRER (capture, avant les handlers de l'outil).
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("button, a") : null;
    if (!el) return;
    var sig = ((el.id || "") + " " + (el.textContent || "") + " " + (el.getAttribute && (el.getAttribute("download") || "") || "")).toLowerCase();
    if (/(export|t[ée]l[ée]charger|download|imprim|enregistr|\.txt|\.json|\.pdf|sauvegard)/.test(sig)) {
      e.preventDefault();
      e.stopPropagation();
      toast();
    }
  }, true);

  if (document.body) banner();
  else document.addEventListener("DOMContentLoaded", banner);
})();
