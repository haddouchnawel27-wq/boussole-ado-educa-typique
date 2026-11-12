"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AXES, ECHELLE, calculerBilan, niveau, type Bilan } from "./lib/boussole";

// Radar : pentagone à 5 axes. Sommet 0 en haut, sens horaire.
function Radar({ scores }: { scores: number[] }) {
  const cx = 130, cy = 122, R = 92;
  const n = AXES.length;
  const pt = (i: number, f: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + R * f * Math.cos(a), cy + R * f * Math.sin(a)];
  };
  const rings = [0.25, 0.5, 0.75, 1];
  const dataPts = scores.map((s, i) => pt(i, Math.max(0.04, s / 100)));
  const dataStr = dataPts.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox="0 0 260 250" className="amz-radar" role="img"
      aria-label={"Radar des 5 axes : " + AXES.map((a, i) => `${a.court} ${scores[i]} sur 100`).join(", ")}>
      {/* anneaux */}
      {rings.map((f, ri) => (
        <polygon key={ri}
          points={AXES.map((_, i) => pt(i, f).join(",")).join(" ")}
          fill="none" stroke="#DACDBC" strokeWidth={ri === rings.length - 1 ? 1.4 : 1} opacity="0.8" />
      ))}
      {/* rayons */}
      {AXES.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#DACDBC" strokeWidth="1" opacity="0.7" />;
      })}
      {/* données */}
      <polygon points={dataStr} fill="rgba(138,151,137,.35)" stroke="#4A554A" strokeWidth="2" strokeLinejoin="round" />
      {dataPts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.2" fill="#4A554A" />)}
      {/* étiquettes */}
      {AXES.map((a, i) => {
        const [x, y] = pt(i, 1.2);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize="11" fontWeight="600" fill="#5E4D42">{a.court}</text>
        );
      })}
    </svg>
  );
}

export function Boussole({ onClose }: { onClose: () => void }) {
  const total = AXES.reduce((s, a) => s + a.items.length, 0); // 20
  const [reps, setReps] = useState<number[]>(() => Array(total).fill(-1));
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [err, setErr] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement;
    firstRef.current?.focus();
    return () => opener.current?.focus?.();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "Tab" && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const bilan: Bilan | null = useMemo(
    () => (phase === "result" ? calculerBilan(reps) : null),
    [phase, reps]
  );

  function setRep(idx: number, v: number) {
    setReps((prev) => { const n = [...prev]; n[idx] = v; return n; });
    setErr("");
  }

  function voir() {
    if (reps.some((r) => r < 0)) {
      setErr("Il reste des affirmations sans réponse. Prenez le temps qu'il faut — répondez à chacune selon votre ressenti d'aujourd'hui.");
      const firstMissing = reps.findIndex((r) => r < 0);
      document.getElementById("bs-q-" + firstMissing)?.scrollIntoView({ block: "center" });
      return;
    }
    setPhase("result");
    cardRef.current?.scrollTo({ top: 0 });
  }

  return (
    <div className="amz-modal-ov" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="amz-modal amz-bs" role="dialog" aria-modal="true" aria-labelledby="bs-title" ref={cardRef}>
        <button ref={firstRef} className="amz-modal-x" aria-label="Fermer la boussole" onClick={onClose}>×</button>

        {phase === "intro" && (
          <>
            <div className="amz-br-kicker">Bilan doux · 5 axes</div>
            <h2 id="bs-title" className="amz-modal-h">Boussole intérieure</h2>
            <p className="amz-modal-d">
              Vingt affirmations, cinq axes de vie : le corps, les émotions, le stress, les liens, l'ancrage.
              Ce n'est pas une note — c'est un reflet, pour mieux voir où poser votre attention. Rien n'est enregistré, rien n'est envoyé.
            </p>
            <ul className="amz-bs-axes-intro">
              {AXES.map((a) => (
                <li key={a.court}><strong>{a.court}</strong> — {a.sub}</li>
              ))}
            </ul>
            <div className="amz-modal-actions">
              <button className="amz-ob-btn ghost" onClick={onClose}>Plus tard</button>
              <button className="amz-ob-btn primary" onClick={() => setPhase("quiz")}>Commencer le bilan</button>
            </div>
          </>
        )}

        {phase === "quiz" && (
          <>
            <h2 id="bs-title" className="amz-modal-h">Boussole intérieure</h2>
            <p className="amz-modal-d">À quel point chaque phrase vous correspond aujourd'hui ? Il n'y a pas de bonne réponse.</p>

            {AXES.map((axe, ai) => (
              <fieldset key={axe.court} className="amz-bs-group">
                <legend className="amz-bs-legend">{axe.court}</legend>
                {axe.items.map((it, ii) => {
                  const idx = ai * 4 + ii;
                  return (
                    <div key={idx} id={"bs-q-" + idx} className="amz-bs-q">
                      <p className="amz-bs-qt">{it.t}</p>
                      <div className="amz-bs-opts" role="radiogroup" aria-label={it.t}>
                        {ECHELLE.map((lab, v) => {
                          const on = reps[idx] === v;
                          return (
                            <button
                              key={v}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              className={"amz-bs-opt" + (on ? " on" : "")}
                              onClick={() => setRep(idx, v)}
                            >
                              {lab}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </fieldset>
            ))}

            {err && <p className="amz-note" role="alert">⚠️ {err}</p>}
            <div className="amz-modal-actions">
              <button className="amz-ob-btn ghost" onClick={() => setPhase("intro")}>Retour</button>
              <button className="amz-ob-btn primary" onClick={voir}>Voir mon reflet</button>
            </div>
          </>
        )}

        {phase === "result" && bilan && (
          <>
            <div className="amz-br-kicker">Votre reflet du jour</div>
            <h2 id="bs-title" className="amz-modal-h">Boussole intérieure</h2>

            <div className="amz-radar-wrap">
              <Radar scores={bilan.scores} />
            </div>

            <p className="amz-bs-synth">
              Plus qu'un chiffre global, c'est le contraste qui compte. Votre appui le plus clair est{" "}
              <strong>{AXES[bilan.iMax].court.toLowerCase()}</strong> — une ressource sur laquelle vous adosser.
              Votre zone la plus tendue est <strong>{AXES[bilan.iMin].court.toLowerCase()}</strong> — c'est là que
              vous pouvez poser l'attention en premier, en douceur.
            </p>

            <div className="amz-bs-cards">
              {AXES.map((axe, i) => {
                const pct = bilan.scores[i];
                const niv = niveau(pct);
                return (
                  <div key={axe.court} className="amz-bs-card">
                    <div className="amz-bs-card-top">
                      <span className="amz-bs-card-nom">{axe.nom}</span>
                      <span className="amz-bs-card-pct" aria-hidden="true">{pct}%</span>
                    </div>
                    <div className="amz-bs-bar" aria-hidden="true"><i style={{ width: pct + "%" }} className={"n-" + niv} /></div>
                    <p className="amz-bs-card-txt">{axe.interp[niv]}</p>
                  </div>
                );
              })}
            </div>

            <p className="amz-br-note">
              Ce reflet ne pose aucun diagnostic et ne remplace pas un professionnel. L'axe « ancrage » n'évalue jamais votre foi — seulement un ressenti d'appui, aujourd'hui.
            </p>
            <div className="amz-modal-actions">
              <button className="amz-ob-btn ghost" onClick={() => { setReps(Array(total).fill(-1)); setPhase("quiz"); }}>Refaire</button>
              <button className="amz-ob-btn primary" onClick={onClose}>Fermer</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
