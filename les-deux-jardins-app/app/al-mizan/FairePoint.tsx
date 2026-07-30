"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ORGA_SCALE, ORGA_CATS, tierFor } from "./lib/espace-content";

export function FairePoint({ onClose }: { onClose: () => void }) {
  const total = ORGA_CATS.reduce((s, c) => s + c.qs.length, 0); // 12
  const [reps, setReps] = useState<number[]>(() => Array(total).fill(-1));
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    return () => opener.current?.focus?.();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "Tab" && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // index d'une question dans le tableau à plat
  function idxOf(cat: number, q: number): number {
    let n = 0;
    for (let i = 0; i < cat; i++) n += ORGA_CATS[i].qs.length;
    return n + q;
  }

  const result = useMemo(() => {
    if (!done) return null;
    let score = 0;
    ORGA_CATS.forEach((c, ci) => {
      c.qs.forEach((q, qi) => {
        const v = reps[idxOf(ci, qi)] + 1; // 1..5
        score += q.rev ? 6 - v : v;
      });
    });
    // score par rubrique (pourcentage)
    const cats = ORGA_CATS.map((c, ci) => {
      let sc = 0;
      c.qs.forEach((q, qi) => { const v = reps[idxOf(ci, qi)] + 1; sc += q.rev ? 6 - v : v; });
      const max = c.qs.length * 5;
      return { label: c.label, emoji: c.emoji, pct: Math.round((sc / max) * 100) };
    });
    return { score, tier: tierFor(score), cats };
  }, [done, reps]);

  function setRep(i: number, v: number) { setReps((p) => { const n = [...p]; n[i] = v; return n; }); setErr(""); }

  function voir() {
    if (reps.some((r) => r < 0)) {
      setErr("Il reste des affirmations sans réponse. Réponds à chacune selon ton ressenti d'aujourd'hui.");
      const fm = reps.findIndex((r) => r < 0);
      document.getElementById("fp-q-" + fm)?.scrollIntoView({ block: "center" });
      return;
    }
    setDone(true);
    cardRef.current?.scrollTo({ top: 0 });
  }

  return (
    <div className="amz-modal-ov" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="amz-modal amz-fp" role="dialog" aria-modal="true" aria-labelledby="fp-title" ref={cardRef}>
        <button ref={closeRef} className="amz-modal-x" aria-label="Fermer" onClick={onClose}>×</button>
        <div className="amz-br-kicker">Mini-audit · 12 points</div>
        <h2 id="fp-title" className="amz-modal-h">Mon mode d'organisation</h2>

        {!done ? (
          <>
            <p className="amz-modal-d">Réponds spontanément, sans te juger.</p>
            <div className="amz-fp-legend"><span>1 · Pas du tout</span><span>5 · Tout à fait</span></div>

            {ORGA_CATS.map((c, ci) => (
              <fieldset key={c.key} className="amz-fp-cat">
                <legend className="amz-fp-cat-h"><span aria-hidden="true">{c.emoji}</span> {c.label}</legend>
                {c.qs.map((q, qi) => {
                  const i = idxOf(ci, qi);
                  return (
                    <div key={i} id={"fp-q-" + i} className="amz-fp-q">
                      <p className="amz-fp-qt">{q.t}</p>
                      <div className="amz-fp-opts" role="radiogroup" aria-label={q.t}>
                        {ORGA_SCALE.map((lab, v) => {
                          const on = reps[i] === v;
                          return (
                            <button key={v} type="button" role="radio" aria-checked={on} aria-label={`${v + 1} — ${lab}`}
                              className={"amz-fp-opt" + (on ? " on" : "")} onClick={() => setRep(i, v)}>{v + 1}</button>
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
              <button className="amz-ob-btn ghost" onClick={onClose}>Plus tard</button>
              <button className="amz-ob-btn primary" onClick={voir}>Voir mon bilan ✦</button>
            </div>
          </>
        ) : result && (
          <>
            <div className="amz-fp-hero" style={{ borderColor: result.tier.color }}>
              <div className="amz-fp-hero-lab" style={{ color: result.tier.color }}>{result.tier.label}</div>
              <div className="amz-fp-hero-score">{result.score}<span>/60</span></div>
              <p className="amz-fp-hero-sum">{result.tier.summary}</p>
            </div>

            <div className="amz-fp-cats">
              {result.cats.map((c) => (
                <div key={c.label} className="amz-fp-catres">
                  <div className="amz-fp-catres-top"><span>{c.emoji} {c.label}</span><span aria-hidden="true">{c.pct}%</span></div>
                  <div className="amz-bs-bar" aria-hidden="true"><i style={{ width: c.pct + "%", background: result.tier.color }} /></div>
                </div>
              ))}
            </div>

            <h3 className="amz-fp-adv-h">Des pistes, à ton rythme</h3>
            <ul className="amz-fp-adv">
              {result.tier.advice.map((a, i) => <li key={i}>{a}</li>)}
            </ul>

            <p className="amz-br-note">Ce bilan ne pose aucun diagnostic. C'est un reflet pour cibler ta priorité d'allègement — rien n'est enregistré.</p>
            <div className="amz-modal-actions">
              <button className="amz-ob-btn ghost" onClick={() => { setReps(Array(total).fill(-1)); setDone(false); }}>Refaire</button>
              <button className="amz-ob-btn primary" onClick={onClose}>Fermer</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
