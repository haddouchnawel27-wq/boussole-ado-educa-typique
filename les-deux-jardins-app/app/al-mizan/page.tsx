"use client";

import { useEffect, useRef, useState } from "react";
import "./al-mizan.css";
import { Onboarding } from "./Onboarding";
import { CheckInModal } from "./CheckInModal";
import { Questionnaire } from "./Questionnaire";
import { Trends } from "./Trends";
import { Breathe } from "./Breathe";
import { ThoughtModal } from "./ThoughtModal";
import { PenseesList } from "./PenseesList";
import { Jardin } from "./Jardin";
import {
  getProfile,
  saveProfile,
  getCheckIns,
  getThoughts,
  deleteThought,
  computeStreak,
  exportAll,
  deleteAllData,
  type Profile,
  type CheckIn,
  type Thought,
} from "./lib/storage";
import { demoCheckIns, demoThoughts, DEMO_STREAK } from "./lib/demo";
import { graineDuJour } from "./lib/graines";

type SpaceKey = "aujourdhui" | "tendances" | "jardin" | "pensees" | "espace";

const SPACES: { key: SpaceKey; label: string; icon: JSX.Element }[] = [
  { key: "aujourdhui", label: "Aujourd'hui", icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" /><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  ) },
  { key: "tendances", label: "Tendances", icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M7 15l3.5-4 3 2.5L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) },
  { key: "jardin", label: "Jardin", icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M12 14c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 12c0-3 2-5 5-5 0 3-2 5-5 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ) },
  { key: "pensees", label: "Pensées", icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 17c-2.5 0-4.5-1.9-4.5-4.3 0-2 1.4-3.7 3.3-4.2C6.7 5.7 9 4 11.7 4c3 0 5.5 2.2 5.9 5.1 1.9.3 3.4 1.9 3.4 3.9 0 2.2-1.9 4-4.2 4H7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ) },
  { key: "espace", label: "Espace", icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h8M16 8h4M4 16h4M12 16h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="14" cy="8" r="2.3" stroke="currentColor" strokeWidth="1.6" /><circle cx="10" cy="16" r="2.3" stroke="currentColor" strokeWidth="1.6" /></svg>
  ) },
];

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M12 3.5v15" stroke="#5E4D42" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 8h14" stroke="#5E4D42" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 8c-1 1.6-2 2.8-2 4 0 1.4 1.3 2.3 2 2.3s2-.9 2-2.3c0-1.2-1-2.4-2-4ZM19 8c-1 1.6-2 2.8-2 4 0 1.4 1.3 2.3 2 2.3s2-.9 2-2.3c0-1.2-1-2.4-2-4Z" stroke="#5E4D42" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8.5 19.5h7" stroke="#5E4D42" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AlMizanPage() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [space, setSpace] = useState<SpaceKey>("aujourdhui");
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [dateStr, setDateStr] = useState("");
  const [greeting, setGreeting] = useState("Bonjour");
  const [graine, setGraine] = useState("");
  const [breatheOpen, setBreatheOpen] = useState(false);
  const [flash, setFlash] = useState("");
  const [checkOpen, setCheckOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [thoughtOpen, setThoughtOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const userNavigated = useRef(false);

  useEffect(() => {
    setProfile(getProfile());
    setCheckIns(getCheckIns());
    setThoughts(getThoughts());
    const now = new Date();
    setGreeting(now.getHours() >= 18 || now.getHours() < 5 ? "Bonsoir" : "Bonjour");
    setDateStr(now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
    setGraine(graineDuJour(now));
  }, []);

  useEffect(() => {
    if (!userNavigated.current) return;
    userNavigated.current = false;
    headingRef.current?.focus();
  }, [space]);

  function goTo(key: SpaceKey) {
    userNavigated.current = true;
    setFlash("");
    setSpace(key);
  }

  function onOnboardingDone(p: Profile) {
    saveProfile(p);
    setProfile(p);
  }

  function switchToReal() {
    if (!profile) return;
    const p = { ...profile, mode: "real" as const };
    saveProfile(p);
    setProfile(p);
    setCheckIns(getCheckIns());
    setThoughts(getThoughts());
    setFlash("Votre espace personnel est prêt. Rien n'est encore rempli — à votre rythme.");
  }

  function onCheckSaved(msg: string) {
    setCheckIns(getCheckIns());
    setFlash(msg);
  }

  function onThoughtSaved(msg: string) {
    setThoughts(getThoughts());
    setFlash(msg);
  }

  function onThoughtDelete(id: string) {
    deleteThought(id);
    setThoughts(getThoughts());
    setFlash("Pensée supprimée.");
  }

  function doExport() {
    download(`al-mizan-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`, exportAll(), "application/json");
    setFlash("Vos données ont été exportées (fichier téléchargé).");
  }

  function doDeleteAll() {
    if (!window.confirm("Supprimer toutes vos données Al Mizan ? Cette action est définitive.")) return;
    deleteAllData();
    setCheckIns([]);
    setThoughts([]);
    setProfile(null); // repart sur l'onboarding
  }

  // ─── Onboarding tant qu'il n'y a pas de profil ───
  if (profile === undefined) {
    // Écran de chargement de marque (jamais blanc, même avant l'hydratation).
    return (
      <div className="amz-root">
        <div className="amz-wrap">
          <div className="amz-splash" aria-live="polite">
            <span className="amz-logo amz-splash-logo"><LogoMark /></span>
            <div className="amz-splash-title">Al Mizan Al Qalb</div>
            <p className="amz-splash-txt">Un instant, votre espace s'ouvre…</p>
          </div>
        </div>
      </div>
    );
  }
  if (profile === null) {
    return (
      <div className="amz-root">
        <div className="amz-wrap">
          <Onboarding onDone={onOnboardingDone} />
        </div>
      </div>
    );
  }

  const demo = profile.mode === "demo";
  const streak = demo ? DEMO_STREAK : computeStreak(checkIns);
  const nbCheckins = demo ? demoCheckIns().length : checkIns.length;
  const hello = greeting + (profile.useName && profile.name ? `, ${profile.name}` : "");
  const current = SPACES.find((s) => s.key === space)!;

  return (
    <div className="amz-root">
      <a href="#amz-content" className="amz-skip">Aller au contenu</a>

      <div className="amz-wrap">
        <div className="amz-shell">
          <header className="amz-top">
            <div className="amz-brand">
              <span className="amz-logo"><LogoMark /></span>
              <span className="amz-title">Al Mizan Al Qalb</span>
            </div>
            <button type="button" className="amz-respirer" aria-label="Respirer — un temps de pause" onClick={() => setBreatheOpen(true)}>
              <span className="dot" aria-hidden="true" />
              Respirer
            </button>
          </header>

          <main id="amz-content" className="amz-main">
            <div className="amz-kicker">{dateStr || " "}</div>
            <h1 className="amz-h1" tabIndex={-1} ref={headingRef}>
              {space === "aujourdhui" ? hello : current.label}
            </h1>

            <div aria-live="polite">
              {flash && <p className="amz-flash">{flash}</p>}
            </div>

            {space === "aujourdhui" && (
              <>
                {demo && (
                  <div className="amz-demo-banner">
                    <span>🌱 <strong>Mode découverte</strong> — les données ci-dessous sont des exemples.</span>
                    <button className="amz-ob-btn primary small" onClick={switchToReal}>Commencer mon espace</button>
                  </div>
                )}

                {graine && (
                  <section className="amz-graine" aria-label="Graine du jour">
                    <span className="amz-graine-k">Graine du jour</span>
                    <p className="amz-graine-t">{graine}</p>
                  </section>
                )}

                {streak > 0 ? (
                  <section className="amz-card" aria-label="Votre série">
                    <div className="amz-card-row">
                      <div className="amz-streak" aria-hidden="true">{streak}</div>
                      <div className="amz-card-body">
                        <div className="amz-card-title">
                          {streak > 1 ? "jours" : "jour"} que vous revenez à vous
                          {demo && <span className="amz-tag">exemple</span>}
                        </div>
                        <div className="amz-progress" aria-hidden="true"><i style={{ width: `${Math.min(100, streak * 12)}%` }} /></div>
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className="amz-empty">
                    <p className="amz-empty-h">C'est votre tout premier passage.</p>
                    <p>Prenez un instant pour observer comment vous allez, sans rien attendre de particulier.</p>
                  </div>
                )}

                {!demo && (
                  <button className="amz-cta" onClick={() => setCheckOpen(true)}>
                    Faire mon point du jour
                  </button>
                )}
                {!demo && nbCheckins > 0 && (
                  <p className="amz-lead">{nbCheckins} {nbCheckins > 1 ? "observations déposées" : "observation déposée"} jusqu'ici.</p>
                )}
                <button className="amz-cta secondary" onClick={() => setQuizOpen(true)}>
                  Où en êtes-vous vraiment ? · parcours guidé
                </button>
              </>
            )}

            {space === "tendances" && (
              <Trends checkIns={demo ? demoCheckIns() : checkIns} demo={demo} />
            )}

            {space === "jardin" && (
              <>
                <p className="amz-lead">Chaque observation déposée fait grandir votre jardin. Aucun objectif — seulement le vôtre.</p>
                <Jardin count={nbCheckins} demo={demo} />
              </>
            )}

            {space === "pensees" && (
              <>
                <p className="amz-lead">Une pensée vous pèse ? Regardez-la en douceur, en cinq temps. Rien n'est envoyé nulle part.</p>
                {!demo && (
                  <button className="amz-cta" onClick={() => setThoughtOpen(true)}>
                    Observer une pensée
                  </button>
                )}
                {demo && (
                  <div className="amz-demo-banner">
                    <span>🌱 <strong>Mode découverte</strong> — pensées d'exemple ci-dessous.</span>
                    <button className="amz-ob-btn primary small" onClick={switchToReal}>Commencer mon espace</button>
                  </div>
                )}
                <PenseesList thoughts={demo ? demoThoughts() : thoughts} demo={demo} onDelete={onThoughtDelete} />
              </>
            )}

            {space === "espace" && (
              <div className="amz-space">
                <div className="amz-space-row"><span>Mode actuel</span><strong>{demo ? "Découverte (exemples)" : "Mon espace"}</strong></div>
                <p className="amz-space-note">🔒 Vos données restent <strong>uniquement sur cet appareil</strong>. Rien n'est envoyé sur internet.</p>

                {demo ? (
                  <button className="amz-ob-btn primary" onClick={switchToReal}>Commencer mon espace personnel</button>
                ) : (
                  <button className="amz-ob-btn" onClick={doExport}>Exporter mes données (fichier)</button>
                )}
                <button className="amz-ob-btn danger" onClick={doDeleteAll}>Supprimer toutes mes données</button>

                <p className="amz-space-foot">Al Mizan Al Qalb est un outil de soutien à l'observation de soi. Il ne remplace pas un professionnel de santé et ne fournit pas de diagnostic.</p>
              </div>
            )}
          </main>

          <nav className="amz-nav" aria-label="Navigation principale">
            {SPACES.map((s) => (
              <button key={s.key} type="button" className="amz-tab" aria-current={space === s.key ? "page" : undefined} onClick={() => goTo(s.key)}>
                <span className="amz-ico">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {checkOpen && <CheckInModal onClose={() => setCheckOpen(false)} onSaved={onCheckSaved} />}
      {quizOpen && <Questionnaire onClose={() => setQuizOpen(false)} />}
      {breatheOpen && <Breathe onClose={() => setBreatheOpen(false)} />}
      {thoughtOpen && <ThoughtModal onClose={() => setThoughtOpen(false)} onSaved={onThoughtSaved} />}
    </div>
  );
}
