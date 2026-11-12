"use client";

import { useEffect, useRef, useState } from "react";
import type { Mode, Profile } from "./lib/storage";
import { SCHEMA_VERSION } from "./lib/storage";

export function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [step, setStep] = useState(0);
  const [useName, setUseName] = useState(true);
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function finish(mode: Mode) {
    onDone({
      schema: SCHEMA_VERSION,
      onboarded: true,
      mode,
      name: useName ? name.trim() : "",
      useName,
      consent: true,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div
      className="amz-ob"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ob-title"
    >
      <div className="amz-ob-card">
        <div className="amz-ob-steps" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={"amz-ob-dot" + (i <= step ? " on" : "")} />
          ))}
        </div>

        {step === 0 && (
          <div className="amz-ob-body">
            <h2 id="ob-title" className="amz-ob-h" tabIndex={-1} ref={headingRef}>
              Bienvenue dans Al Mizan Al Qalb
            </h2>
            <p className="amz-ob-p">
              Un espace doux pour observer où vous en êtes, sans jugement et sans
              obligation de performance.
            </p>
            <div className="amz-ob-actions">
              <button className="amz-ob-btn primary" onClick={() => setStep(1)}>
                Commencer
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="amz-ob-body">
            <h2 id="ob-title" className="amz-ob-h" tabIndex={-1} ref={headingRef}>
              Comment souhaitez-vous être appelée ?
            </h2>
            <p className="amz-ob-p">C'est facultatif — vous pouvez rester anonyme.</p>

            <label className="amz-ob-label" htmlFor="ob-name">Prénom (facultatif)</label>
            <input
              id="ob-name"
              className="amz-ob-input"
              type="text"
              value={name}
              disabled={!useName}
              placeholder="Votre prénom"
              onChange={(e) => setName(e.target.value)}
              aria-describedby="ob-name-help"
            />
            <p id="ob-name-help" className="amz-ob-hint">
              Il reste sur votre appareil et ne sert qu'à personnaliser l'accueil.
            </p>

            <label className="amz-ob-check">
              <input
                type="checkbox"
                checked={!useName}
                onChange={(e) => setUseName(!e.target.checked)}
              />
              <span>Ne pas utiliser mon prénom</span>
            </label>

            <div className="amz-ob-actions">
              <button className="amz-ob-btn ghost" onClick={() => setStep(0)}>Retour</button>
              <button className="amz-ob-btn primary" onClick={() => setStep(2)}>Continuer</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="amz-ob-body">
            <h2 id="ob-title" className="amz-ob-h" tabIndex={-1} ref={headingRef}>
              Vos données vous appartiennent
            </h2>
            <p className="amz-ob-p">
              Vos réponses peuvent être très personnelles. Elles restent
              <strong> uniquement sur cet appareil</strong> — rien n'est envoyé sur
              internet. Vous pourrez les <strong>consulter, exporter et supprimer</strong> à
              tout moment.
            </p>
            <label className="amz-ob-check">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>J'ai compris comment mes données seront enregistrées.</span>
            </label>
            <div className="amz-ob-actions">
              <button className="amz-ob-btn ghost" onClick={() => setStep(1)}>Retour</button>
              <button
                className="amz-ob-btn primary"
                disabled={!consent}
                onClick={() => setStep(3)}
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="amz-ob-body">
            <h2 id="ob-title" className="amz-ob-h" tabIndex={-1} ref={headingRef}>
              Par où commencer ?
            </h2>
            <p className="amz-ob-p">Vous pourrez changer d'avis à tout moment.</p>
            <div className="amz-ob-choices">
              <button className="amz-ob-choice" onClick={() => finish("demo")}>
                <span className="amz-ob-choice-t">Découvrir avec des exemples</span>
                <span className="amz-ob-choice-d">
                  Voir à quoi ressemble l'app avec des données de démonstration.
                </span>
              </button>
              <button className="amz-ob-choice" onClick={() => finish("real")}>
                <span className="amz-ob-choice-t">Commencer avec un espace vide</span>
                <span className="amz-ob-choice-d">
                  Partir de zéro, à votre rythme. Rien n'est déjà rempli.
                </span>
              </button>
            </div>
            <div className="amz-ob-actions">
              <button className="amz-ob-btn ghost" onClick={() => setStep(2)}>Retour</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
