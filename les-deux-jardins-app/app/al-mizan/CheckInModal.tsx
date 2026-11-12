"use client";

import { useEffect, useRef, useState } from "react";
import { addCheckIn } from "./lib/storage";

type Dim = { key: "energie" | "humeur" | "clarte" | "elan"; label: string; low: string; high: string };

const DIMS: Dim[] = [
  { key: "energie", label: "Énergie", low: "épuisée", high: "pleine d'énergie" },
  { key: "humeur", label: "Humeur", low: "très basse", high: "très légère" },
  { key: "clarte", label: "Clarté mentale", low: "brouillard", high: "très claire" },
  { key: "elan", label: "Élan d'agir", low: "aucun élan", high: "grand élan" },
];

function niveauMot(v: number): string {
  if (v <= 1) return "très bas";
  if (v <= 3) return "bas";
  if (v <= 5) return "moyen";
  if (v <= 7) return "assez haut";
  if (v <= 9) return "haut";
  return "au maximum";
}

// Ce qui peut colorer une journée — facultatif, sans jugement.
const CONTEXTES = ["Prémenstruel", "Fatigue", "Charge mentale", "Surcharge", "Solitude", "Reprise"];

export function CheckInModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [vals, setVals] = useState({ energie: 5, humeur: 5, clarte: 5, elan: 5 });
  const [contextes, setContextes] = useState<string[]>([]);
  const [err, setErr] = useState("");

  function toggleCtx(c: string) {
    setContextes((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }
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

  function save() {
    const res = addCheckIn({ ...vals, contextes });
    if (!res.ok) {
      setErr(
        "L'enregistrement n'a pas fonctionné (mémoire du navigateur indisponible). Vos réponses ne sont pas perdues — réessayez."
      );
      return;
    }
    onSaved("Votre état a bien été déposé. Merci d'avoir pris ce moment pour vous.");
    onClose();
  }

  return (
    <div className="amz-modal-ov" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="amz-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ci-title"
        aria-describedby="ci-desc"
        ref={cardRef}
      >
        <button ref={firstRef} className="amz-modal-x" aria-label="Fermer" onClick={onClose}>
          ×
        </button>
        <h2 id="ci-title" className="amz-modal-h">Comment vous sentez-vous ?</h2>
        <p id="ci-desc" className="amz-modal-d">
          Déplacez chaque curseur là où vous êtes aujourd'hui. Il n'y a pas de bonne réponse.
        </p>

        <div className="amz-ci-fields">
          {DIMS.map((d) => {
            const v = vals[d.key];
            return (
              <div key={d.key} className="amz-ci-field">
                <div className="amz-ci-top">
                  <label htmlFor={"ci-" + d.key} className="amz-ci-label">{d.label}</label>
                  <span className="amz-ci-val" aria-hidden="true">{v}/10</span>
                </div>
                <input
                  id={"ci-" + d.key}
                  className="amz-ci-range"
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={v}
                  aria-valuetext={`${v} sur 10, ${niveauMot(v)}`}
                  onChange={(e) => setVals((s) => ({ ...s, [d.key]: Number(e.target.value) }))}
                />
                <div className="amz-ci-ends" aria-hidden="true">
                  <span>{d.low}</span>
                  <span>{d.high}</span>
                </div>
              </div>
            );
          })}
        </div>

        <fieldset className="amz-ctx">
          <legend className="amz-ctx-legend">Quelque chose colore cette journée ? <span>(facultatif)</span></legend>
          <div className="amz-ctx-chips">
            {CONTEXTES.map((c) => {
              const on = contextes.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  className={"amz-chip" + (on ? " on" : "")}
                  aria-pressed={on}
                  onClick={() => toggleCtx(c)}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </fieldset>

        {err && <p className="amz-note" role="alert">⚠️ {err}</p>}

        <div className="amz-modal-actions">
          <button className="amz-ob-btn ghost" onClick={onClose}>Annuler</button>
          <button className="amz-ob-btn primary" onClick={save}>Déposer mon état</button>
        </div>
      </div>
    </div>
  );
}
