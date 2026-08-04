/* ===========================================================================
   Mode d'Emploi de Moi — application (routeur + écrans)
   ---------------------------------------------------------------------------
   App autonome de l'espace Ado (13-17 ans) d'Educa Typique.
   Rails non négociables tenus ici :
     • privé par défaut · code local distinct du parent · aucune donnée en ligne
     • aucun diagnostic, aucun score global, aucun classement alarmiste
     • « passer » et « quitter pour aujourd'hui » toujours possibles
   Écrans livrés : AD-01 (espace & droits), AD-02 (check-in de 2 min).
   =========================================================================== */
(function (global) {
  "use strict";

  var APP = { nom: "Mode d'Emploi de Moi" };

  /* ---------- État ---------- */
  var S = {
    vue: "garde",
    prefs: {},
    checkin: {},      // saisie transitoire du check-in en cours
    modale: null
  };

  /* ---------- Données de contenu ---------- */
  var PROGRAMMES = [
    {
      id: 1, couleur: "var(--jaune)", titre: "Je me comprends",
      sous: "Faire connaissance avec soi, sans jugement.",
      ecrans: [
        { code: "AD-01", ico: "🔐", titre: "Mon espace & mes droits", desc: "C'est ton espace. Tu choisis.", vue: "ad01", etat: "dispo" },
        { code: "AD-02", ico: "🌤️", titre: "Comment je vais aujourd'hui", desc: "Un check-in de 2 minutes", vue: "ad02", etat: "dispo" },
        { code: "AD-03", ico: "🧭", titre: "Mode d'emploi de Moi", desc: "Ce qui m'aide, ce qui me coûte", vue: "ad03", etat: "dispo" },
        { code: "AD-04", ico: "🎭", titre: "Mes émotions", desc: "Ma météo intérieure — la honte comprise", etat: "bientot" },
        { code: "AD-05", ico: "⭐", titre: "Mes valeurs", desc: "Ce qui compte vraiment pour moi", etat: "bientot" }
      ]
    },
    {
      id: 2, couleur: "var(--menthe)", titre: "Je me relie et je me protège",
      sous: "Les autres, les limites, et demander de l'aide.",
      ecrans: [
        { code: "AD-06", ico: "🤝", titre: "Mes relations", desc: "Poser une limite, dire non", etat: "bientot" },
        { code: "AD-07", ico: "🌱", titre: "Reprendre confiance", desc: "L'erreur, la comparaison, mon discours intérieur", etat: "bientot" },
        { code: "AD-08", ico: "🛡️", titre: "Ma sécurité numérique", desc: "Demander de l'aide sans tout expliquer", etat: "bientot" }
      ]
    },
    {
      id: 3, couleur: "var(--ciel)", titre: "Je construis la suite",
      sous: "Mon quotidien, mes forces, mes études et mon avenir.",
      ecrans: [
        { code: "AD-09", ico: "🧩", titre: "Mon quotidien & mes forces", desc: "Ma semaine, mon organisation, mes intérêts", etat: "bientot" },
        { code: "ET", ico: "🧭", titre: "Mon orientation", desc: "Études & métiers : intelligences, intérêts (RIASEC), style d'apprentissage", etat: "bientot" },
        { code: "AD-10", ico: "✉️", titre: "Ma demande d'accompagnement", desc: "Dire ce dont j'ai besoin, à mon rythme", etat: "bientot" },
        { code: "AD-11", ico: "🔀", titre: "Centre de partage", desc: "Je choisis quoi partager, et avec qui", etat: "bientot" }
      ]
    }
  ];

  var CHECKIN = [
    { id: "energie", titre: "Mon énergie", aide: "Là, tout de suite.", options: [
      { v: 1, emo: "🪫", lib: "Vidé·e" }, { v: 2, emo: "😮‍💨", lib: "Bas" }, { v: 3, emo: "😐", lib: "Moyen" }, { v: 4, emo: "🙂", lib: "En forme" }, { v: 5, emo: "⚡", lib: "À fond" }
    ] },
    { id: "humeur", titre: "Mon humeur", aide: "Comment je me sens dans ma tête.", options: [
      { v: 1, emo: "😞", lib: "Pas bien" }, { v: 2, emo: "😕", lib: "Bof" }, { v: 3, emo: "😐", lib: "Neutre" }, { v: 4, emo: "🙂", lib: "Plutôt bien" }, { v: 5, emo: "😄", lib: "Bien" }
    ] },
    { id: "stress", titre: "Mon stress", aide: "", options: [
      { v: 1, emo: "😌", lib: "Calme" }, { v: 2, emo: "🙂", lib: "Un peu" }, { v: 3, emo: "😬", lib: "Moyen" }, { v: 4, emo: "😰", lib: "Tendu·e" }, { v: 5, emo: "🤯", lib: "Sous pression" }
    ] },
    { id: "sommeil", titre: "Ma nuit dernière", aide: "", options: [
      { v: 1, emo: "😵", lib: "Très mauvaise" }, { v: 2, emo: "🥱", lib: "Mauvaise" }, { v: 3, emo: "😐", lib: "Moyenne" }, { v: 4, emo: "🙂", lib: "Bonne" }, { v: 5, emo: "🌙", lib: "Très bonne" }
    ] }
  ];

  var BESOINS = [
    { id: "parler", emo: "💬", lib: "Parler à quelqu'un" },
    { id: "tranquille", emo: "🤫", lib: "Être tranquille" },
    { id: "bouger", emo: "💨", lib: "Bouger, me défouler" },
    { id: "organiser", emo: "🗂️", lib: "De l'aide pour m'organiser" },
    { id: "souffler", emo: "🫁", lib: "Juste souffler" },
    { id: "ca-va", emo: "✨", lib: "Ça va, rien de spécial" }
  ];

  /* Numéros d'aide (France) — à revérifier avant diffusion. */
  var AIDES = [
    { num: "3114", tel: "3114", lib: "Souffrance, idées noires", detail: "Prévention du suicide · 24h/24 · gratuit et confidentiel" },
    { num: "3018", tel: "3018", lib: "Harcèlement en ligne, images", detail: "Violences numériques · gratuit" },
    { num: "3020", tel: "3020", lib: "Harcèlement à l'école", detail: "Numéro national · gratuit" },
    { num: "119", tel: "119", lib: "Enfance en danger", detail: "24h/24 · gratuit" },
    { num: "0 800 235 236", tel: "0800235236", lib: "Fil Santé Jeunes", detail: "Écoute anonyme pour les jeunes" }
  ];

  /* ---------- Petits utilitaires UI ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var toastTimer = null;
  function toast(msg) {
    var t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.style.display = "none"; }, 2600);
  }

  function auj() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dateJolie(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1];
  }

  /* ---------- Préférences (thème, confort dys…) ---------- */
  function appliquerPrefs() {
    var r = document.documentElement;
    var p = S.prefs;
    if (p.theme === "soir") r.setAttribute("data-theme", "soir"); else r.removeAttribute("data-theme");
    if (p.dys === "on") r.setAttribute("data-dys", "on"); else r.removeAttribute("data-dys");
    if (p.taille) r.setAttribute("data-taille", p.taille); else r.removeAttribute("data-taille");
    if (p.contraste === "fort") r.setAttribute("data-contraste", "fort"); else r.removeAttribute("data-contraste");
  }
  function majPref(cle, val) {
    S.prefs[cle] = val;
    Vault.ecrirePrefs(S.prefs);
    appliquerPrefs();
  }

  /* ===========================================================================
     RENDU
     =========================================================================== */
  var SCREENS = {}; // modules d'écrans enregistrés (ex. AD-03), voir MEM.register

  function render() {
    var app = $("#app");
    var html;
    if (SCREENS[S.vue]) {
      html = coquille(SCREENS[S.vue].render());
    } else {
      switch (S.vue) {
        case "bienvenue": html = vueBienvenue(); break;
        case "verrou":    html = vueVerrou(); break;
        case "accueil":   html = coquille(vueAccueil()); break;
        case "ad01":      html = coquille(vueAD01()); break;
        case "ad02":      html = coquille(vueAD02()); break;
        case "ad02-fin":  html = coquille(vueAD02Fin()); break;
        case "ad02-histo":html = coquille(vueAD02Histo()); break;
        case "reglages":  html = coquille(vueReglages()); break;
        default:          html = vueGarde();
      }
    }
    app.innerHTML = html + (S.modale ? modaleAide() : "");
    // Bouton d'aide flottant permanent (sauf écran de chargement)
    if (S.vue !== "garde") app.insertAdjacentHTML("beforeend", boutonAideFlottant());
    bind();
    if (SCREENS[S.vue]) {
      if (SCREENS[S.vue].enter) SCREENS[S.vue].enter();
      if (SCREENS[S.vue].bind) SCREENS[S.vue].bind();
    }
    if (S.vue !== S._last) {
      var main = $("#contenu"); if (main) main.focus();
      window.scrollTo(0, 0);
    }
    S._last = S.vue;
  }

  /* Coquille commune (barre du haut + conteneur) pour les écrans déverrouillés */
  function coquille(contenu) {
    return `
      <header class="topbar">
        <a class="marque" href="#" data-nav="accueil" aria-label="Accueil ${esc(APP.nom)}">
          ${logoSVG(30)}
          <span class="nom">${esc(APP.nom)}</span>
        </a>
        <div class="topbar-actions">
          <button class="icon-btn" data-nav="reglages" aria-label="Réglages" title="Réglages">⚙️</button>
          <button class="icon-btn" data-act="quitter" aria-label="Quitter pour aujourd'hui" title="Quitter pour aujourd'hui">🔒</button>
        </div>
      </header>
      <main id="contenu" class="enveloppe" tabindex="-1">${contenu}</main>`;
  }

  function logoSVG(size) {
    return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <rect width="512" height="512" rx="120" fill="#3C6478"/>
      <path d="M256 176 C224 156 168 156 136 168 L136 356 C168 344 224 344 256 362 Z" fill="#FAF7F2"/>
      <path d="M256 176 C288 156 344 156 376 168 L376 356 C344 344 288 344 256 362 Z" fill="#B4F0F0"/>
      <rect x="250" y="176" width="12" height="186" rx="6" fill="#C8A0F0"/>
      <circle cx="256" cy="126" r="17" fill="#F050C8"/>
    </svg>`;
  }

  /* ---------- Écran de chargement ---------- */
  function vueGarde() {
    return `<div class="centre-ecran"><div style="color:#fff;text-align:center">${logoSVG(56)}<p style="margin-top:1rem">Un instant…</p></div></div>`;
  }

  /* ===========================================================================
     BIENVENUE + AD-01 (première fois : droits, puis création du code)
     =========================================================================== */
  function vueBienvenue() {
    var repli = !Vault.chiffrementActif()
      ? `<p class="aide-champ">ℹ️ Astuce : ouvre cette app depuis son adresse en ligne (https) pour que ton espace soit <strong>chiffré</strong>. En local (fichier), il reste privé sur l'appareil mais non chiffré.</p>` : "";
    return `
      <div class="centre-ecran">
        <div class="carte-garde">
          <div class="logo-rond">${logoSVG(64)}</div>
          <h1>Bienvenue ✨</h1>
          <p class="sous">Ton espace à toi. Personne d'autre.</p>

          <div class="encadre menthe">
            <span class="titre">Ce que tu dois savoir, avant tout</span>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">
              <li>🔒 <strong>C'est ton espace.</strong> Tu choisis ce que tu écris et ce que tu partages.</li>
              <li>📱 Tout reste <strong>sur cet appareil</strong>. Rien n'est envoyé sur Internet.</li>
              <li>🙈 Tes parents <strong>ne voient pas</strong> tes réponses automatiquement.</li>
              <li>🔑 Ton <strong>code personnel</strong> est différent de celui de tes parents.</li>
              <li>⏸️ Tu peux <strong>passer une question</strong> ou <strong>quitter</strong> quand tu veux.</li>
            </ul>
          </div>

          <div class="encadre beige">
            <span class="titre">⚠️ Si l'appareil est partagé</span>
            <p class="mini-note">Sur une tablette ou un ordi utilisé par d'autres, ton code protège ton espace — mais choisis-en un que personne ne devine, et pense à « Quitter » en partant.</p>
          </div>

          <h2 style="font-size:1.1rem;margin:1.2rem 0 0.6rem">Crée ton code personnel</h2>
          <div class="champ">
            <label for="code1">Ton code <span style="color:var(--texte-doux);font-weight:400">(4 caractères minimum)</span></label>
            <input id="code1" class="saisie" type="password" inputmode="text" autocomplete="new-password" placeholder="Un code que toi seul·e connais">
          </div>
          <div class="champ">
            <label for="code2">Répète ton code</label>
            <input id="code2" class="saisie" type="password" autocomplete="new-password" placeholder="Pour être sûr·e">
          </div>
          <p class="erreur-champ" id="err-code"></p>
          <p class="aide-champ">Garde-le bien : <strong>sans ce code, ton espace ne peut pas être rouvert</strong> (c'est ce qui le rend privé).</p>
          ${repli}
          <button class="btn btn-plein btn-bloc" data-act="creer" style="margin-top:0.8rem">Créer mon espace →</button>
        </div>
      </div>`;
  }

  /* ---------- Verrou (retour) ---------- */
  function vueVerrou() {
    return `
      <div class="centre-ecran">
        <div class="carte-garde">
          <div class="logo-rond">${logoSVG(64)}</div>
          <h1>Re-bonjour 👋</h1>
          <p class="sous">Entre ton code pour ouvrir ton espace.</p>
          <div class="champ">
            <label for="code" class="sr-only">Ton code personnel</label>
            <input id="code" class="saisie" type="password" autocomplete="current-password" placeholder="Ton code" autofocus>
          </div>
          <p class="erreur-champ" id="err-code"></p>
          <button class="btn btn-plein btn-bloc" data-act="ouvrir">Ouvrir mon espace →</button>
          <button class="lien-doux" data-act="oubli" style="display:block;margin:0.9rem auto 0">J'ai oublié mon code</button>
        </div>
      </div>`;
  }

  /* ===========================================================================
     ACCUEIL — les 3 programmes
     =========================================================================== */
  function vueAccueil() {
    var progs = PROGRAMMES.map(function (p) {
      var etapes = p.ecrans.map(function (e) {
        var dispo = e.etat === "dispo";
        var badge = dispo
          ? `<span class="etat faire">à découvrir</span>`
          : `<span class="etat plus-tard">bientôt</span>`;
        var attrs = dispo ? `data-nav="${e.vue}"` : `disabled aria-disabled="true"`;
        return `<button class="etape ${dispo ? "dispo" : "bientot"}" ${attrs}>
            <span class="ico" aria-hidden="true">${e.ico}</span>
            <span class="corps"><span class="t">${esc(e.titre)}</span><span class="d">${esc(e.desc)}</span></span>
            ${badge}
          </button>`;
      }).join("");
      return `
        <section class="prog-groupe" aria-label="Programme ${p.id} : ${esc(p.titre)}">
          <div class="prog-titre"><span class="prog-puce" style="background:${p.couleur}">${p.id}</span>${esc(p.titre)}</div>
          <p class="prog-sous">${esc(p.sous)}</p>
          ${etapes}
        </section>`;
    }).join("");

    return `
      <div class="hero-accueil">
        <h1>Salut 👋</h1>
        <p>Voici ton parcours. Avance à ton rythme — rien n'est obligatoire, rien n'est chronométré.</p>
      </div>
      <div class="encadre ciel" style="margin-top:1rem">
        <span class="titre">🌤️ Envie de commencer simplement ?</span>
        <p>Fais le point en 2 minutes sur comment tu vas aujourd'hui.</p>
        <button class="btn btn-plein btn-petit" data-nav="ad02" style="margin-top:0.6rem">Faire mon check-in</button>
      </div>
      ${progs}
      <p class="pied">Mode d'Emploi de Moi · Educa Typique<br>🔒 Ton espace reste privé, sur cet appareil.</p>`;
  }

  /* ===========================================================================
     AD-01 — Mon espace & mes droits (consultable à tout moment)
     =========================================================================== */
  function vueAD01() {
    return `
      <div class="entete-ecran">
        <div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>
        <span class="ruban">Programme 1 · AD-01</span>
        <h1>🔐 Mon espace & mes droits</h1>
        <p class="intro">Ce petit espace t'appartient. Voici comment il te protège.</p>
      </div>

      <div class="carte">
        <div class="encadre menthe"><span class="titre">Tu choisis</span><p>Tu décides de ce que tu écris. Tu peux passer une question, la laisser vide, ou revenir plus tard. Il n'y a pas de mauvaise réponse.</p></div>
        <div class="encadre ciel"><span class="titre">C'est privé</span><p>Tes réponses restent <strong>sur cet appareil</strong>, protégées par ton code. Rien n'est envoyé sur Internet. Personne ne les lit à ta place.</p></div>
        <div class="encadre lavande"><span class="titre">Tes parents ne voient rien automatiquement</span><p>Si un jour tu veux partager quelque chose (à un parent, à un·e pro), <strong>c'est toi qui choisis</strong> quoi, et à qui. Par défaut, tout est privé.</p></div>
        <div class="encadre jaune"><span class="titre">Ton code est à toi</span><p>Il est différent de celui de tes parents. Ne le partage pas. Sur un appareil partagé, pense à « Quitter » (🔒 en haut) quand tu as fini.</p></div>
        <div class="encadre beige"><span class="titre">Ce n'est pas un test</span><p>Cet espace ne met pas de note, ne pose pas d'étiquette et ne dit pas ce qui « va » ou « ne va pas ». Il t'aide juste à mieux te comprendre.</p></div>
      </div>

      <div class="carte">
        <h2 style="font-size:1.1rem;margin-bottom:0.5rem">Gérer mon espace</h2>
        <p class="mini-note" style="margin-bottom:0.8rem">Changer ton code, exporter ou effacer tes données : tout est dans les réglages.</p>
        <button class="btn btn-ligne btn-petit" data-nav="reglages">⚙️ Ouvrir les réglages</button>
      </div>

      <div class="actions-bas">
        <button class="btn btn-plein" data-nav="ad02">🌤️ Faire mon check-in du jour</button>
      </div>`;
  }

  /* ===========================================================================
     AD-02 — Check-in de 2 minutes (aucun score)
     =========================================================================== */
  function itemEchelle(item) {
    var choisi = S.checkin[item.id];
    var pips = item.options.map(function (o) {
      var on = choisi === o.v;
      return `<button class="pip" role="button" aria-pressed="${on}" data-item="${item.id}" data-val="${o.v}" aria-label="${esc(o.lib)}">
        <span class="emo" aria-hidden="true">${o.emo}</span><span class="lib">${esc(o.lib)}</span>
      </button>`;
    }).join("");
    return `<div class="q-bloc">
      <div class="q-titre">${esc(item.titre)}</div>
      ${item.aide ? `<div class="q-aide">${esc(item.aide)}</div>` : ""}
      <div class="echelle" role="group" aria-label="${esc(item.titre)}">${pips}</div>
    </div>`;
  }

  function vueAD02() {
    var echelles = CHECKIN.map(itemEchelle).join("");
    var jetons = BESOINS.map(function (b) {
      var on = S.checkin.besoin === b.id;
      return `<button class="jeton" role="button" aria-pressed="${on}" data-besoin="${b.id}">${b.emo} ${esc(b.lib)}</button>`;
    }).join("");
    return `
      <div class="entete-ecran">
        <div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>
        <span class="ruban">Programme 1 · AD-02</span>
        <h1>🌤️ Comment je vais aujourd'hui</h1>
        <p class="intro">Deux minutes pour toi. Réponds à ce que tu veux — tu peux tout à fait en passer.</p>
      </div>

      <div class="carte">
        ${echelles}
      </div>

      <div class="carte">
        <div class="q-bloc" style="margin:0">
          <div class="q-titre">De quoi j'aurais besoin, là ?</div>
          <div class="q-aide">Choisis ce qui te parle le plus (ou rien).</div>
          <div class="jetons" role="group" aria-label="Mon besoin principal">${jetons}</div>
        </div>
      </div>

      <div class="carte">
        <label class="q-titre" for="note" style="display:block;margin-bottom:0.5rem">Envie d'écrire un mot ? <span style="font-weight:400;color:var(--texte-doux)">(optionnel, privé)</span></label>
        <textarea id="note" class="saisie" rows="3" placeholder="Ce que tu veux, ou rien du tout…">${esc(S.checkin.note || "")}</textarea>
      </div>

      <div class="actions-bas">
        <button class="btn btn-plein" data-act="enregistrer-checkin">Enregistrer mon check-in</button>
        <button class="btn btn-doux" data-act="quitter">Quitter pour aujourd'hui</button>
      </div>`;
  }

  function vueAD02Fin() {
    var c = S.checkin;
    var doux = (c.humeur && c.humeur <= 2) || (c.stress && c.stress >= 4) || c.besoin === "parler";
    var emo = doux ? "💛" : "🌱";
    var titre = doux ? "Merci de l'avoir noté." : "C'est enregistré. 🌱";

    var messageBesoin = "";
    if (c.besoin === "parler") messageBesoin = "Tu as mis que tu aurais besoin de parler. C'est une bonne idée — un·e proche, un·e adulte de confiance, ou un des numéros d'écoute plus bas.";
    else if (c.besoin === "bouger") messageBesoin = "Bouger, même 5 minutes, ça aide vraiment à faire redescendre la pression.";
    else if (c.besoin === "souffler") messageBesoin = "Souffler, c'est légitime. Trois respirations lentes, en allongeant l'expiration, et tu peux y revenir quand tu veux.";
    else if (c.besoin === "organiser") messageBesoin = "L'organisation, ça se travaille avec des outils — on en ajoutera bientôt dans ton parcours.";
    else if (c.besoin === "tranquille") messageBesoin = "T'accorder du calme, c'est prendre soin de toi. Rien à justifier.";
    else if (c.besoin === "ca-va") messageBesoin = "Content·e que ça aille aujourd'hui. Repasse quand tu veux.";

    var douxBloc = doux
      ? `<div class="encadre lavande" style="text-align:left">
           <span class="titre">Si c'est lourd en ce moment</span>
           <p>Tu n'as pas à porter ça tout·e seul·e. Parler à quelqu'un en qui tu as confiance change vraiment les choses. Et si tu préfères un·e inconnu·e à l'écoute, les numéros ci-dessous sont gratuits et confidentiels.</p>
           <button class="btn btn-magenta btn-petit" data-act="aide" style="margin-top:0.6rem">🆘 Voir les numéros d'aide</button>
         </div>` : "";

    return `
      <div class="reflet">
        <div class="grand-emo" aria-hidden="true">${emo}</div>
        <h2>${titre}</h2>
        <p style="color:var(--texte-doux)">Prendre 2 minutes pour faire le point, c'est déjà prendre soin de toi.</p>
      </div>
      <div class="carte">
        ${messageBesoin ? `<p style="margin-bottom:0.6rem">${esc(messageBesoin)}</p>` : ""}
        ${douxBloc}
        <p class="mini-note" style="margin-top:0.8rem">Ce check-in est privé. Il n'y a ni note, ni score : juste une photo de ton jour, à toi.</p>
      </div>
      <div class="actions-bas">
        <button class="btn btn-plein" data-nav="accueil">Retour à l'accueil</button>
        <button class="btn btn-ligne" data-nav="ad02-histo">Voir mes check-in</button>
      </div>`;
  }

  function vueAD02Histo() {
    return `
      <div class="entete-ecran">
        <div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>
        <span class="ruban">Programme 1 · AD-02</span>
        <h1>📆 Mes check-in</h1>
        <p class="intro">Juste pour toi, pour voir comment ça évolue.</p>
      </div>
      <div class="carte" id="histo-liste"><p class="mini-note">Chargement…</p></div>
      <div class="actions-bas"><button class="btn btn-plein" data-nav="ad02">Nouveau check-in</button></div>`;
  }

  function remplirHistorique() {
    Vault.lire("checkins").then(function (arr) {
      var box = $("#histo-liste");
      if (!box) return;
      if (!arr || !arr.length) { box.innerHTML = `<p class="mini-note">Tu n'as pas encore de check-in enregistré. 🌤️</p>`; return; }
      var libH = {}; CHECKIN[1].options.forEach(function (o) { libH[o.v] = o; });
      var rows = arr.slice(0, 30).map(function (c) {
        var h = libH[c.humeur];
        var b = BESOINS.filter(function (x) { return x.id === c.besoin; })[0];
        return `<div class="historique-item">
          <span class="date">${dateJolie(c.date)}</span>
          <span>${h ? h.emo + " " + esc(h.lib) : "—"}</span>
          ${b ? `<span style="margin-left:auto;color:var(--texte-doux);font-size:0.85rem">${b.emo} ${esc(b.lib)}</span>` : ""}
        </div>`;
      }).join("");
      box.innerHTML = rows;
    });
  }

  /* ===========================================================================
     RÉGLAGES
     =========================================================================== */
  function seg(cle, _val, options) {
    var courant = S.prefs[cle] || "";
    return `<div class="segments" role="group">` + options.map(function (o) {
      var actif = courant === o.v || (!courant && o.parDefaut);
      return `<button data-pref="${cle}" data-val="${o.v}" aria-pressed="${actif}">${esc(o.lib)}</button>`;
    }).join("") + `</div>`;
  }

  function vueReglages() {
    return `
      <div class="entete-ecran">
        <div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>
        <h1>⚙️ Réglages</h1>
        <p class="intro">Ton confort, et tes données.</p>
      </div>

      <div class="carte">
        <h2 style="font-size:1.05rem;margin-bottom:0.3rem">Confort de lecture</h2>
        <div class="reglage-ligne">
          <span class="lib">Mode soir <small>Couleurs sombres, reposantes</small></span>
          ${seg("theme", "", [{ v: "", lib: "Jour", parDefaut: true }, { v: "soir", lib: "Soir" }])}
        </div>
        <div class="reglage-ligne">
          <span class="lib">Confort « dys » <small>Espacement renforcé</small></span>
          ${seg("dys", "", [{ v: "", lib: "Normal", parDefaut: true }, { v: "on", lib: "Activé" }])}
        </div>
        <div class="reglage-ligne">
          <span class="lib">Taille du texte</span>
          ${seg("taille", "", [{ v: "", lib: "A", parDefaut: true }, { v: "grand", lib: "A+" }, { v: "tres-grand", lib: "A++" }])}
        </div>
        <div class="reglage-ligne">
          <span class="lib">Contraste renforcé</span>
          ${seg("contraste", "", [{ v: "", lib: "Normal", parDefaut: true }, { v: "fort", lib: "Fort" }])}
        </div>
      </div>

      <div class="carte">
        <h2 style="font-size:1.05rem;margin-bottom:0.5rem">Mon code & mes données</h2>
        <div class="reglage-ligne">
          <span class="lib">Changer mon code personnel</span>
          <button class="btn btn-ligne btn-petit" data-act="changer-code">Changer</button>
        </div>
        <div class="reglage-ligne">
          <span class="lib">Exporter mes données <small>Une copie de sauvegarde, pour toi</small></span>
          <button class="btn btn-ligne btn-petit" data-act="exporter">Exporter</button>
        </div>
        <div class="reglage-ligne">
          <span class="lib" style="color:#C0392B">Tout effacer <small>Supprime définitivement tout mon espace</small></span>
          <button class="btn btn-petit" style="background:#C0392B;color:#fff" data-act="tout-effacer">Effacer</button>
        </div>
        <p class="mini-note" style="margin-top:0.7rem">${Vault.chiffrementActif() ? "🔒 Ton espace est chiffré avec ton code." : "ℹ️ Ton espace est privé sur cet appareil (chiffrement indisponible ici)."}</p>
      </div>

      <div class="actions-bas">
        <button class="btn btn-ligne" data-nav="ad01">📖 Revoir mes droits (AD-01)</button>
      </div>`;
  }

  /* ---------- Modale d'aide (numéros) ---------- */
  function modaleAide() {
    var lignes = AIDES.map(function (a) {
      return `<a class="aide-numero" href="tel:${a.tel}"><strong>${esc(a.num)}</strong> — ${esc(a.lib)}<span>${esc(a.detail)}</span></a>`;
    }).join("");
    return `
      <div class="modale-fond" data-act="fermer-modale">
        <div class="modale" role="dialog" aria-modal="true" aria-label="Numéros d'aide" data-stop>
          <h2>🆘 Tu peux demander de l'aide</h2>
          <p style="color:var(--texte-doux);font-size:0.9rem;margin-bottom:1rem">Parler à quelqu'un n'est jamais un aveu de faiblesse. Ces numéros sont gratuits et confidentiels.</p>
          ${lignes}
          <p class="mini-note" style="margin:0.8rem 0 1rem">En cas de danger immédiat, appelle le <strong>15</strong> (Samu) ou le <strong>112</strong>.</p>
          <button class="btn btn-plein btn-bloc" data-act="fermer-modale">Fermer</button>
        </div>
      </div>`;
  }

  function boutonAideFlottant() {
    return `<button class="aide-flottante" data-act="aide" aria-label="Besoin d'aide maintenant">🆘 Aide</button>`;
  }

  /* ===========================================================================
     ÉVÉNEMENTS
     =========================================================================== */
  function bind() {
    // Navigation par data-nav
    $all("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        var v = b.getAttribute("data-nav");
        aller(v);
      });
    });

    // Actions par data-act
    $all("[data-act]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        var a = b.getAttribute("data-act");
        if (a === "fermer-modale" && b.hasAttribute("data-stop")) return;
        gererAction(a, e);
      });
    });
    // Empêche la fermeture quand on clique dans la modale
    var mod = $("[data-stop]"); if (mod) mod.addEventListener("click", function (e) { e.stopPropagation(); });

    // Échelles du check-in
    $all(".pip").forEach(function (p) {
      p.addEventListener("click", function () {
        var id = p.getAttribute("data-item"), val = parseInt(p.getAttribute("data-val"), 10);
        S.checkin[id] = (S.checkin[id] === val) ? undefined : val;
        // maj visuelle du groupe
        $all('.pip[data-item="' + id + '"]').forEach(function (o) {
          o.setAttribute("aria-pressed", parseInt(o.getAttribute("data-val"), 10) === S.checkin[id] ? "true" : "false");
        });
      });
    });
    // Jetons besoin
    $all(".jeton").forEach(function (j) {
      j.addEventListener("click", function () {
        var id = j.getAttribute("data-besoin");
        S.checkin.besoin = (S.checkin.besoin === id) ? undefined : id;
        $all(".jeton").forEach(function (o) {
          o.setAttribute("aria-pressed", o.getAttribute("data-besoin") === S.checkin.besoin ? "true" : "false");
        });
      });
    });
    // Note libre
    var note = $("#note");
    if (note) note.addEventListener("input", function () { S.checkin.note = note.value; });

    // Préférences (segments)
    $all("[data-pref]").forEach(function (b) {
      b.addEventListener("click", function () {
        majPref(b.getAttribute("data-pref"), b.getAttribute("data-val"));
        render();
      });
    });

    // Entrée clavier sur les champs code
    var code1 = $("#code1"); if (code1) code1.focus();
    var codeV = $("#code");
    if (codeV) codeV.addEventListener("keydown", function (e) { if (e.key === "Enter") gererAction("ouvrir"); });
    var code2 = $("#code2");
    if (code2) code2.addEventListener("keydown", function (e) { if (e.key === "Enter") gererAction("creer"); });
  }

  function aller(vue) {
    S.vue = vue;
    render();
    if (vue === "ad02-histo") remplirHistorique();
  }

  function gererAction(a, e) {
    switch (a) {
      case "creer": actionCreer(); break;
      case "ouvrir": actionOuvrir(); break;
      case "oubli": actionOubli(); break;
      case "quitter": actionQuitter(); break;
      case "enregistrer-checkin": actionEnregistrerCheckin(); break;
      case "aide": S.modale = "aide"; render(); break;
      case "fermer-modale": S.modale = null; render(); break;
      case "changer-code": actionChangerCode(); break;
      case "exporter": actionExporter(); break;
      case "tout-effacer": actionToutEffacer(); break;
    }
  }

  /* ---------- Actions ---------- */
  function actionCreer() {
    var c1 = ($("#code1") || {}).value || "";
    var c2 = ($("#code2") || {}).value || "";
    var err = $("#err-code");
    if (c1.length < 4) { if (err) err.textContent = "Ton code doit faire au moins 4 caractères."; return; }
    if (c1 !== c2) { if (err) err.textContent = "Les deux codes ne sont pas identiques."; return; }
    Vault.creer(c1).then(function () {
      S.vue = "accueil"; render();
      toast("Ton espace est créé 🎉");
    }).catch(function () { if (err) err.textContent = "Une erreur est survenue. Réessaie."; });
  }

  function actionOuvrir() {
    var c = ($("#code") || {}).value || "";
    var err = $("#err-code");
    Vault.ouvrir(c).then(function (ok) {
      if (ok) { S.vue = "accueil"; render(); }
      else if (err) err.textContent = "Code incorrect. Réessaie.";
    });
  }

  function actionOubli() {
    if (confirm("Ton espace est chiffré avec ton code : sans lui, tes données ne peuvent pas être récupérées (c'est ce qui le rend privé).\n\nVeux-tu tout effacer et recréer un nouvel espace ? Cette action est définitive.")) {
      Vault.reset(true); // garde les préférences de confort
      S.vue = "bienvenue"; render();
    }
  }

  function actionQuitter() {
    Vault.fermer();
    S.checkin = {};
    S.vue = "verrou"; render();
    toast("À bientôt 👋");
  }

  function actionEnregistrerCheckin() {
    var entree = {
      date: auj(),
      energie: S.checkin.energie || null,
      humeur: S.checkin.humeur || null,
      stress: S.checkin.stress || null,
      sommeil: S.checkin.sommeil || null,
      besoin: S.checkin.besoin || null,
      note: (S.checkin.note || "").trim() || null
    };
    Vault.lire("checkins").then(function (arr) {
      arr = Array.isArray(arr) ? arr : [];
      // remplace un check-in déjà fait le même jour
      arr = arr.filter(function (x) { return x.date !== entree.date; });
      arr.unshift(entree);
      return Vault.ecrire("checkins", arr);
    }).then(function () {
      S.vue = "ad02-fin"; render();
    }).catch(function () { toast("Impossible d'enregistrer. Réessaie."); });
  }

  function actionChangerCode() {
    if (!Vault.chiffrementActif()) { toast("Changement de code indisponible ici."); return; }
    var actuel = prompt("Pour changer ton code, entre d'abord ton code actuel :");
    if (actuel == null) return;
    Vault.ouvrir(actuel).then(function (ok) {
      if (!ok) { toast("Code actuel incorrect."); return; }
      var neuf = prompt("Ton nouveau code (4 caractères minimum) :");
      if (neuf == null) return;
      if (neuf.length < 4) { toast("Trop court (4 caractères min)."); return; }
      var neuf2 = prompt("Répète ton nouveau code :");
      if (neuf !== neuf2) { toast("Les deux codes ne correspondent pas."); return; }
      // Ré-chiffrer : on exporte en clair, on recrée la clé, on ré-écrit tout.
      Vault.exporter().then(function (dump) {
        Vault.reset(true);
        Vault.creer(neuf).then(function () {
          var noms = Object.keys(dump.donnees || {});
          return Promise.all(noms.map(function (n) { return Vault.ecrire(n, dump.donnees[n]); }));
        }).then(function () { toast("Ton code a été changé ✅"); });
      });
    });
  }

  function actionExporter() {
    Vault.exporter().then(function (dump) {
      var blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "mode-emploi-de-moi_sauvegarde.json";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      toast("Sauvegarde téléchargée 💾");
    });
  }

  function actionToutEffacer() {
    if (confirm("Effacer définitivement tout ton espace (check-in, notes, code) ? Cette action ne peut pas être annulée.")) {
      Vault.reset(false);
      S.prefs = {}; appliquerPrefs();
      S.vue = "bienvenue"; render();
      toast("Ton espace a été effacé.");
    }
  }

  /* ===========================================================================
     DÉMARRAGE
     =========================================================================== */
  function start() {
    S.prefs = Vault.lirePrefs();
    appliquerPrefs();
    // petit délai pour laisser le thème s'appliquer proprement
    S.vue = Vault.existe() ? "verrou" : "bienvenue";
    render();
  }

  /* API exposée aux modules d'écrans (ex. screens/ad03.js) */
  global.MEM = {
    start: start,
    register: function (id, def) { SCREENS[id] = def; },
    go: aller,
    render: render,
    esc: esc,
    toast: toast,
    auj: auj,
    dateJolie: dateJolie
  };
})(window);
