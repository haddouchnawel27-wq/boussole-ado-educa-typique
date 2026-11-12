"use client";

import { useEffect, useRef, useState } from "react";

const PHASES = ["Inspire…", "Retiens…", "Expire…"];

export function Breathe({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    return () => opener.current?.focus?.();
  }, []);

  // Rythme 4-4-4 : on avance de phase toutes les 4 s.
  useEffect(() => {
    const id = setInterval(() => {
      setPhase((p) => {
        const next = (p + 1) % 3;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Échap + piège de focus
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

  return (
    <div className="amz-breathe-ov" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="amz-breathe" role="dialog" aria-modal="true" aria-labelledby="br-title" ref={cardRef}>
        <button ref={closeRef} className="amz-modal-x" aria-label="Fermer la respiration" onClick={onClose}>×</button>
        <div className="amz-br-kicker">Un temps pour soi</div>
        <h2 id="br-title" className="amz-br-title">Respire, 4-4-4</h2>
        <p className="amz-br-sub">Suis l'orbe, à ton rythme. Le corps s'apaise le premier.</p>

        <div className="amz-orb-wrap">
          <div className="amz-orb-ring">
            <div className={"amz-orb amz-orb-p" + phase} aria-hidden="true" />
          </div>
          <div className="amz-orb-phase" aria-live="polite">{PHASES[phase]}</div>
          <div className="amz-orb-count">cycle {cycle}</div>
        </div>

        <button className="amz-ob-btn primary amz-br-done" onClick={onClose}>Je me sens plus posée</button>
        <p className="amz-br-note">Rien n'est enregistré. Ce moment reste à toi.</p>
      </div>
    </div>
  );
}
