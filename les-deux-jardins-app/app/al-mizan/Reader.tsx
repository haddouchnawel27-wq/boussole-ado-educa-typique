"use client";

import { useEffect, useRef } from "react";
import type { Fiche, Article } from "./lib/espace-content";

type Content =
  | { kind: "fiche"; data: Fiche }
  | { kind: "article"; data: Article };

export function Reader({ content, onClose }: { content: Content; onClose: () => void }) {
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

  const titre = content.data.titre;
  const emoji = content.data.emoji;

  return (
    <div className="amz-modal-ov" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="amz-modal amz-rd" role="dialog" aria-modal="true" aria-labelledby="rd-title" ref={cardRef}>
        <button ref={closeRef} className="amz-modal-x" aria-label="Fermer la lecture" onClick={onClose}>×</button>

        <div className="amz-rd-emoji" aria-hidden="true">{emoji}</div>
        {content.kind === "fiche" && content.data.tag && <div className="amz-br-kicker">{content.data.tag}</div>}
        {content.kind === "article" && <div className="amz-br-kicker">Lecture · {content.data.min}</div>}
        <h2 id="rd-title" className="amz-modal-h">{titre}</h2>

        {content.kind === "article" ? (
          <div className="amz-rd-body">
            {content.data.paras.map((p, i) => <p key={i} className="amz-rd-p">{p}</p>)}
          </div>
        ) : (
          <div className="amz-rd-body">
            <p className="amz-rd-intro">{content.data.intro}</p>

            {content.data.cards && (
              <div className="amz-rd-cards">
                {content.data.cards.map((c) => (
                  <div key={c.t} className="amz-rd-card">
                    <div className="amz-rd-card-top"><span className="amz-rd-card-e" aria-hidden="true">{c.e}</span><span className="amz-rd-card-t">{c.t}</span></div>
                    <p className="amz-rd-card-l">{c.a}</p>
                    {c.b && <p className="amz-rd-card-l">{c.b}</p>}
                    <p className="amz-rd-card-l amz-rd-card-aide">{c.c}</p>
                  </div>
                ))}
              </div>
            )}

            {content.data.sections && content.data.sections.map((s) => (
              <div key={s.h} className="amz-rd-sec">
                <h3 className="amz-rd-sec-h">{s.h}</h3>
                <ul className="amz-rd-sec-list">
                  {s.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            ))}

            {content.data.cta && <p className="amz-rd-cta">{content.data.cta}</p>}
            {content.data.note && <p className="amz-rd-note">{content.data.note}</p>}
          </div>
        )}

        <div className="amz-modal-actions">
          <button className="amz-ob-btn primary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
