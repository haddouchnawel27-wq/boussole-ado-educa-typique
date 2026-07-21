"use client";

import { useEffect, useRef, useState } from "react";
import { addThought } from "./lib/storage";

// Les 5 temps, dans un langage doux — jamais injonctif.
const STEPS = [
  {
    key: "situation" as const,
    num: "1",
    label: "Ce qui s'est passé",
    hint: "En quelques mots, la situation. Juste les faits, sans vous juger.",
    ph: "Ex. : un message resté sans réponse toute la journée…",
  },
  {
    key: "pensee" as const,
    num: "2",
    label: "La pensée qui a traversé",
    hint: "La phrase que votre esprit s'est dite, telle quelle.",
    ph: "Ex. : « on m'a oubliée, je ne compte pas »…",
  },
  {
    key: "emotion" as const,
    num: "3",
    label: "Ce que ça a fait ressentir",
    hint: "Une émotion, ou plusieurs. Il n'y a rien de mal à ressentir.",
    ph: "Ex. : tristesse, un peu de rejet…",
  },
  {
    key: "regard" as const,
    num: "4",
    label: "Un regard plus juste",
    hint: "Si une amie bienveillante vous voyait, que vous dirait-elle ? Prenez ce qui vous aide, laissez le reste.",
    ph: "Ex. : une journée chargée n'est pas un abandon…",
  },
  {
    key: "apres" as const,
    num: "5",
    label: "Comment je me sens après",
    hint: "Rien à forcer. Même un tout petit apaisement compte.",
    ph: "Ex. : un peu plus légère, je peux attendre sans conclure le pire…",
  },
];

function intensiteMot(v: number): string {
  if (v <= 1) return "à peine";
  if (v <= 3) return "légère";
  if (v <= 5) return "moyenne";
  if (v <= 7) return "forte";
  if (v <= 9) return "très forte";
  return "au maximum";
}

export function ThoughtModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [vals, setVals] = useState({ situation: "", pensee: "", emotion: "", regard: "", apres: "" });
  const [intensite, setIntensite] = useState(5);
  const [err, setErr] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  const openerRestore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    openerRestore.current = document.activeElement as HTMLElement;
    firstRef.current?.focus();
    return () => openerRestore.current?.focus?.();
  }, []);

  // Échap + piège de focus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rempli = vals.situation.trim() || vals.pensee.trim();

  function save() {
    if (!rempli) {
      setErr("Notez au moins la situation ou la pensée — le reste peut rester vide.");
      return;
    }
    const res = addThought({ ...vals, intensite });
    if (!res.ok) {
      setErr("L'enregistrement n'a pas fonctionné (mémoire du navigateur indisponible). Réessayez.");
      return;
    }
    onSaved("Pensée déposée. Vous l'avez regardée en face, avec douceur — c'est déjà beaucoup.");
    onClose();
  }

  return (
    <div className="amz-modal-ov" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="amz-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="th-title"
        aria-describedby="th-desc"
        ref={cardRef}
      >
        <button ref={firstRef} className="amz-modal-x" aria-label="Fermer" onClick={onClose}>
          ×
        </button>
        <h2 id="th-title" className="amz-modal-h">Observer une pensée</h2>
        <p id="th-desc" className="amz-modal-d">
          Cinq temps, tout en douceur. Répondez à ce qui vous parle, laissez le reste. Rien n'est obligatoire.
        </p>

        <div className="amz-th-fields">
          {STEPS.map((s) => (
            <div key={s.key} className="amz-th-field">
              <label htmlFor={"th-" + s.key} className="amz-th-label">
                <span className="amz-th-num" aria-hidden="true">{s.num}</span>
                {s.label}
              </label>
              <p className="amz-th-hint">{s.hint}</p>
              <textarea
                id={"th-" + s.key}
                className="amz-th-area"
                rows={s.key === "situation" || s.key === "regard" ? 3 : 2}
                value={vals[s.key]}
                placeholder={s.ph}
                onChange={(e) => setVals((v) => ({ ...v, [s.key]: e.target.value }))}
              />
              {s.key === "emotion" && (
                <div className="amz-th-intens">
                  <div className="amz-ci-top">
                    <label htmlFor="th-intensite" className="amz-th-intens-label">Intensité du ressenti</label>
                    <span className="amz-ci-val" aria-hidden="true">{intensite}/10</span>
                  </div>
                  <input
                    id="th-intensite"
                    className="amz-ci-range"
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={intensite}
                    aria-valuetext={`${intensite} sur 10, intensité ${intensiteMot(intensite)}`}
                    onChange={(e) => setIntensite(Number(e.target.value))}
                  />
                  <div className="amz-ci-ends" aria-hidden="true">
                    <span>à peine</span>
                    <span>au maximum</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {err && <p className="amz-note" role="alert">⚠️ {err}</p>}

        <div className="amz-modal-actions">
          <button className="amz-ob-btn ghost" onClick={onClose}>Annuler</button>
          <button className="amz-ob-btn primary" onClick={save}>Déposer ma pensée</button>
        </div>
      </div>
    </div>
  );
}
