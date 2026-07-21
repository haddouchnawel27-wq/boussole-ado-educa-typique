"use client";

import { useEffect, useRef, useState } from "react";
import { COLS, loadTaches, saveTaches, uid, type Tache, type ColId } from "./lib/sequenceur";

const STEPS = ["Vider", "Trier", "Séquencer"];
const ENCOURAGE = ["Un pas de plus.", "Doucement, ça avance.", "Voilà. Rien que celui-là.", "Tu y es.", "C'est déjà ça de posé."];

export function Sequenceur({ onClose }: { onClose: () => void }) {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [step, setStep] = useState(0);
  const [dump, setDump] = useState("");
  const [seqId, setSeqId] = useState<string | null>(null);
  const [newEtape, setNewEtape] = useState("");
  const [focusIdx, setFocusIdx] = useState<number>(-1); // -1 = pas en mode focus
  const [enc, setEnc] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setTaches(loadTaches());
    opener.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    return () => opener.current?.focus?.();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "Tab" && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function commit(next: Tache[]) {
    setTaches(next);
    saveTaches(next);
  }

  // ── Temps 1 : vider ──
  function vider() {
    const lignes = dump.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!lignes.length) return;
    commit([...taches, ...lignes.map((t) => ({ id: uid(), texte: t, col: null as ColId | null, etapes: [] }))]);
    setDump("");
  }
  function retirer(id: string) {
    commit(taches.filter((t) => t.id !== id));
  }
  function classer(id: string, col: ColId) {
    commit(taches.map((t) => (t.id === id ? { ...t, col: t.col === col ? null : col } : t)));
  }

  // ── Temps 3 : séquencer ──
  const seqTache = taches.find((t) => t.id === seqId) || null;
  function ajouterEtape() {
    const v = newEtape.trim();
    if (!v || !seqTache) return;
    commit(taches.map((t) => (t.id === seqId ? { ...t, etapes: [...t.etapes, { texte: v, faite: false }] } : t)));
    setNewEtape("");
  }
  function retirerEtape(i: number) {
    if (!seqTache) return;
    commit(taches.map((t) => (t.id === seqId ? { ...t, etapes: t.etapes.filter((_, k) => k !== i) } : t)));
  }
  function marquerFaite(i: number) {
    if (!seqTache) return;
    const next = taches.map((t) =>
      t.id === seqId ? { ...t, etapes: t.etapes.map((e, k) => (k === i ? { ...e, faite: true } : e)) } : t
    );
    commit(next);
    setEnc(ENCOURAGE[i % ENCOURAGE.length]);
    const t2 = next.find((t) => t.id === seqId)!;
    setTimeout(() => { setEnc(""); setFocusIdx(nextUndone(t2.etapes, i)); }, 620);
  }
  function nextUndone(etapes: { faite: boolean }[], from: number): number {
    for (let i = from + 1; i < etapes.length; i++) if (!etapes[i].faite) return i;
    for (let i = 0; i < etapes.length; i++) if (!etapes[i].faite) return i;
    return etapes.length;
  }

  const inbox = taches.filter((t) => !t.col);

  return (
    <div className="amz-modal-ov" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="amz-modal amz-sq" role="dialog" aria-modal="true" aria-labelledby="sq-title" ref={cardRef}>
        <button ref={closeRef} className="amz-modal-x" aria-label="Fermer" onClick={onClose}>×</button>
        <div className="amz-br-kicker">Outil · charge mentale</div>
        <h2 id="sq-title" className="amz-modal-h">Vider, trier, avancer</h2>
        <p className="amz-sq-sub">Un pas à la fois — sans te surcharger.</p>

        <div className="amz-sq-steps" role="tablist" aria-label="Les trois temps">
          {STEPS.map((s, i) => (
            <button
              key={s}
              role="tab"
              aria-selected={step === i}
              className={"amz-sq-dot" + (step === i ? " on" : "") + (i < step ? " done" : "")}
              onClick={() => { setStep(i); setFocusIdx(-1); }}
            >
              <span className="c">{i + 1}</span>
              <span className="l">{s}</span>
            </button>
          ))}
        </div>

        {/* ── TEMPS 1 : VIDER ── */}
        {step === 0 && (
          <div>
            <div className="amz-sq-tl">Temps 1 · vider sa tête</div>
            <h3 className="amz-sq-h">Pose tout ce qui tourne</h3>
            <p className="amz-sq-hint">Écris en vrac, sans trier ni juger. Une idée par ligne. On rangera après, ensemble.</p>
            <textarea
              className="amz-th-area" rows={5} value={dump}
              placeholder={"Ce qui t'encombre, tel que ça vient…\n(une ligne = une chose)"}
              onChange={(e) => setDump(e.target.value)}
            />
            <button className="amz-ob-btn primary amz-sq-block" onClick={vider}>Déposer ✦</button>
            {inbox.length > 0 && (
              <>
                <p className="amz-sq-note">{inbox.length} chose{inbox.length > 1 ? "s" : ""} déposée{inbox.length > 1 ? "s" : ""} — prêtes à trier.</p>
                <ul className="amz-sq-list">
                  {inbox.slice(-6).reverse().map((t) => (
                    <li key={t.id} className="amz-sq-tache">
                      <span className="amz-sq-txt">{t.texte}</span>
                      <button className="amz-sq-x" aria-label={"Retirer « " + t.texte + " »"} onClick={() => retirer(t.id)}>✕</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="amz-modal-actions">
              <button className="amz-ob-btn primary" onClick={() => setStep(1)}>Trier en douceur →</button>
            </div>
          </div>
        )}

        {/* ── TEMPS 2 : TRIER ── */}
        {step === 1 && (
          <div>
            <div className="amz-sq-tl">Temps 2 · trier en douceur</div>
            <h3 className="amz-sq-h">Range à ton rythme</h3>
            <p className="amz-sq-hint">Pour chaque chose, choisis un moment. Rien n'est en retard : ce qui attend, c'est très bien.</p>

            <div className="amz-sq-col">
              <div className="amz-sq-col-head"><span className="amz-sq-col-nom">À trier</span><span className="amz-sq-col-n">{inbox.length}</span></div>
              {inbox.length === 0 ? <p className="amz-sq-empty">Tout est rangé. Belle chose.</p> : (
                <ul className="amz-sq-list">
                  {inbox.map((t) => (
                    <li key={t.id} className="amz-sq-tache col">
                      <div className="amz-sq-tache-main">
                        <span className="amz-sq-txt">{t.texte}</span>
                        <button className="amz-sq-x" aria-label={"Retirer « " + t.texte + " »"} onClick={() => retirer(t.id)}>✕</button>
                      </div>
                      <div className="amz-sq-chips">
                        {COLS.map((c) => (
                          <button key={c.id} className={"amz-chip" + (t.col === c.id ? " on" : "")} aria-pressed={t.col === c.id} onClick={() => classer(t.id, c.id)}>{c.nom}</button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {COLS.map((c) => {
              const items = taches.filter((t) => t.col === c.id);
              return (
                <div key={c.id} className="amz-sq-col">
                  <div className="amz-sq-col-head"><span className="amz-sq-col-nom">{c.nom}</span><span className="amz-sq-col-n">{items.length}</span></div>
                  {items.length === 0 ? <p className="amz-sq-empty">—</p> : (
                    <ul className="amz-sq-list">
                      {items.map((t) => (
                        <li key={t.id} className="amz-sq-tache col">
                          <div className="amz-sq-tache-main">
                            <span className="amz-sq-txt">{t.texte}</span>
                            <button className="amz-sq-x" aria-label={"Retirer « " + t.texte + " »"} onClick={() => retirer(t.id)}>✕</button>
                          </div>
                          <div className="amz-sq-chips">
                            {COLS.map((cc) => (
                              <button key={cc.id} className={"amz-chip" + (t.col === cc.id ? " on" : "")} aria-pressed={t.col === cc.id} onClick={() => classer(t.id, cc.id)}>{cc.nom}</button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {c.id === "aujourdhui" && items.length > 3 && (
                    <p className="amz-sq-gentle">3 choses pour aujourd'hui, c'est déjà beaucoup. Le reste peut attendre.</p>
                  )}
                </div>
              );
            })}

            <div className="amz-modal-actions">
              <button className="amz-ob-btn ghost" onClick={() => setStep(0)}>← Vider encore</button>
              <button className="amz-ob-btn primary" onClick={() => setStep(2)}>Séquencer une tâche →</button>
            </div>
          </div>
        )}

        {/* ── TEMPS 3 : SÉQUENCER ── */}
        {step === 2 && (
          <div>
            <div className="amz-sq-tl">Temps 3 · séquencer une tâche</div>
            <h3 className="amz-sq-h">Une seule, en tout petits pas</h3>
            <p className="amz-sq-hint">Choisis UNE chose qui te semble lourde. On la découpe, et tu avances un pas à la fois.</p>

            {taches.length === 0 ? (
              <p className="amz-sq-empty">Commence par <b>vider ta tête</b> — tu pourras ensuite séquencer une tâche.</p>
            ) : focusIdx >= 0 && seqTache ? (
              (() => {
                const total = seqTache.etapes.length;
                const restantes = seqTache.etapes.filter((e) => !e.faite).length;
                if (focusIdx >= total || restantes === 0) {
                  return (
                    <div className="amz-sq-done">
                      <div className="amz-sq-bism">بِسْمِ اللَّهِ</div>
                      <h3 className="amz-sq-done-h">Tâche traversée.</h3>
                      <p className="amz-sq-hint">Tu l'as découpée et avancée, pas à pas. C'est comme ça qu'on allège une montagne.</p>
                      <div className="amz-sq-graine">
                        <div className="amz-sq-ar" dir="rtl" lang="ar">وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ</div>
                        <div className="amz-sq-fr">« À l'être humain n'appartient que le fruit de ses efforts. »</div>
                        <div className="amz-sq-ref">An-Najm, 39</div>
                      </div>
                      <div className="amz-modal-actions">
                        <button className="amz-ob-btn ghost" onClick={() => setFocusIdx(-1)}>Revenir aux étapes</button>
                        <button className="amz-ob-btn primary" onClick={() => { setFocusIdx(-1); }}>Terminer</button>
                      </div>
                    </div>
                  );
                }
                const e = seqTache.etapes[focusIdx];
                return (
                  <div>
                    <div className="amz-sq-focus">
                      <div className="amz-sq-focus-lab">Étape {focusIdx + 1} sur {total}</div>
                      <div className="amz-sq-focus-txt">{e.texte}</div>
                      <div className="amz-sq-focus-prog">{restantes} à faire · un seul pas compte</div>
                    </div>
                    <p className="amz-sq-enc" aria-live="polite">{enc || " "}</p>
                    <div className="amz-modal-actions">
                      <button className="amz-ob-btn ghost" onClick={() => setFocusIdx(nextUndone(seqTache.etapes, focusIdx))}>Plus tard</button>
                      <button className="amz-ob-btn primary" onClick={() => marquerFaite(focusIdx)}>C'est fait ✦</button>
                    </div>
                    <button className="amz-ob-btn amz-sq-block" onClick={() => setFocusIdx(-1)}>← Toutes les étapes</button>
                  </div>
                );
              })()
            ) : (
              <div>
                <label className="amz-sq-lab" htmlFor="sq-pick">Quelle tâche veux-tu découper ?</label>
                <select id="sq-pick" className="amz-sq-select" value={seqId ?? ""} onChange={(e) => setSeqId(e.target.value || null)}>
                  <option value="">— Choisir —</option>
                  {taches.map((t) => <option key={t.id} value={t.id}>{t.texte}</option>)}
                </select>

                {seqTache && (
                  <div className="amz-sq-seqbody">
                    <div className="amz-sq-current">{seqTache.texte}</div>
                    <ul className="amz-sq-list">
                      {seqTache.etapes.map((e, i) => (
                        <li key={i} className={"amz-sq-etape" + (e.faite ? " faite" : "")}>
                          <span className="amz-sq-n">{i + 1}</span>
                          <span className="amz-sq-et">{e.texte}</span>
                          <button className="amz-sq-x" aria-label={"Retirer l'étape « " + e.texte + " »"} onClick={() => retirerEtape(i)}>✕</button>
                        </li>
                      ))}
                    </ul>
                    <div className="amz-sq-add">
                      <input
                        className="amz-sq-input" type="text" value={newEtape} placeholder="Une toute petite étape…"
                        onChange={(e) => setNewEtape(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") ajouterEtape(); }}
                      />
                      <button className="amz-ob-btn primary" onClick={ajouterEtape}>Ajouter</button>
                    </div>
                    {seqTache.etapes.length > 0 && (
                      <button className="amz-ob-btn primary amz-sq-block" onClick={() => setFocusIdx(Math.max(0, seqTache.etapes.findIndex((e) => !e.faite)))}>Un pas à la fois →</button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <p className="amz-sq-gold">« Jamais de retard, jamais de culpabilité. Ce qui n'est pas fait attend, et c'est ok. »</p>
        <p className="amz-br-note">Rien n'est envoyé. Tout reste sur cet appareil.</p>
      </div>
    </div>
  );
}
