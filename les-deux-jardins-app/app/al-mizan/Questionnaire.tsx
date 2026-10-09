"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONNAIRE } from "./lib/questionnaire/questionnaire.v2";
import { allScores, decideRoute, sectionScore } from "./lib/questionnaire/engine";
import { ROUTE_CONTENT, THRESHOLD_LABEL, SECTION_SUGGESTION, SUPPORT_RESOURCE } from "./lib/questionnaire/content";
import type { Answers } from "./lib/questionnaire/types";

type Phase = "intro" | "section" | "support" | "summary";

export function Questionnaire({ onClose }: { onClose: () => void }) {
  const q = QUESTIONNAIRE;
  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [route, setRoute] = useState<string>("SUMMARY");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase, idx]);

  const section = q.sections[idx];

  function setAnswer(itemId: string, optionId: string | null) {
    setAnswers((a) => ({ ...a, [itemId]: optionId }));
  }

  function finish() {
    const d = decideRoute(q, answers);
    setRoute(d.route);
    setPhase(d.route === "SUMMARY" ? "summary" : "support");
  }

  // ─────────── INTRO ───────────
  if (phase === "intro") {
    return (
      <div className="amz-quiz" role="region" aria-label="Parcours d'observation">
        <div className="amz-quiz-card">
          <h2 className="amz-ob-h" tabIndex={-1} ref={headingRef}>{q.title}</h2>
          <p className="amz-ob-p">
            Ce court parcours vous aide à observer votre énergie, votre charge et ce qui vous
            freine aujourd'hui. Il n'y a pas de bonne ou de mauvaise réponse.
          </p>
          <p className="amz-ob-p">Vous pouvez passer une question, faire une pause ou arrêter à tout moment.</p>
          <p className="amz-quiz-disclaimer">{q.disclaimer}</p>
          <div className="amz-ob-actions">
            <button className="amz-ob-btn ghost" onClick={onClose}>Fermer</button>
            <button className="amz-ob-btn primary" onClick={() => setPhase("section")}>Commencer</button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────── SECTIONS ───────────
  if (phase === "section") {
    const pct = Math.round(((idx + 1) / q.sections.length) * 100);
    return (
      <div className="amz-quiz" role="region" aria-label="Parcours d'observation">
        <div className="amz-quiz-card">
          <div className="amz-quiz-progress-txt">{section.progress.label}</div>
          <div className="amz-progress" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
          <h2 className="amz-quiz-h" tabIndex={-1} ref={headingRef}>{section.label}</h2>

          <div className="amz-quiz-items">
            {section.item_ids.map((iid) => {
              const it = q.items.find((x) => x.id === iid)!;
              const scale = q.scales.find((s) => s.id === it.scale_id)!;
              const val = answers[iid];
              return (
                <fieldset key={iid} className="amz-q-item">
                  <legend className="amz-q-prompt">{it.prompt}</legend>
                  {it.content.helper_text && <p className="amz-q-help">{it.content.helper_text}</p>}
                  <div className="amz-q-opts">
                    {scale.options.map((o) => (
                      <label key={o.id} className={"amz-q-opt" + (val === o.id ? " sel" : "")}>
                        <input
                          type="radio"
                          name={iid}
                          checked={val === o.id}
                          onChange={() => setAnswer(iid, o.id)}
                        />
                        <span>{o.label}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={"amz-q-skip" + (val === null ? " sel" : "")}
                    aria-pressed={val === null}
                    onClick={() => setAnswer(iid, null)}
                  >
                    {it.content.skip_label}
                  </button>
                </fieldset>
              );
            })}
          </div>

          <div className="amz-ob-actions">
            <button
              className="amz-ob-btn ghost"
              onClick={() => (idx === 0 ? setPhase("intro") : setIdx(idx - 1))}
            >
              {idx === 0 ? "Intro" : "Précédent"}
            </button>
            {idx < q.sections.length - 1 ? (
              <button className="amz-ob-btn primary" onClick={() => setIdx(idx + 1)}>Continuer</button>
            ) : (
              <button className="amz-ob-btn primary" onClick={finish}>Voir le résultat</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────── SOUTIEN (route adaptative) ───────────
  if (phase === "support") {
    const c = ROUTE_CONTENT[route] ?? ROUTE_CONTENT.SUMMARY;
    return (
      <div className="amz-quiz" role="region" aria-label="Message de soutien">
        <div className="amz-quiz-card">
          <h2 className="amz-ob-h" tabIndex={-1} ref={headingRef}>{c.title}</h2>
          {c.lines.map((l, i) => (
            <p key={i} className="amz-ob-p">{l}</p>
          ))}
          {c.resources && (
            <div className="amz-quiz-resource">
              <p>{SUPPORT_RESOURCE.label}</p>
              <p className="amz-quiz-3114">{SUPPORT_RESOURCE.line}</p>
            </div>
          )}
          <div className="amz-ob-actions">
            <button className="amz-ob-btn ghost" onClick={onClose}>Fermer</button>
            <button className="amz-ob-btn primary" onClick={() => setPhase("summary")}>Voir la synthèse</button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────── SYNTHÈSE ───────────
  const scores = allScores(q, answers);
  const withScore = scores.filter((s) => !s.noScore && s.thresholdId);
  const flagged = withScore
    .filter((s) => s.thresholdId === "high" || s.thresholdId === "very_high")
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 2);
  const suggestions = flagged.length
    ? flagged.map((s) => SECTION_SUGGESTION[s.sectionId])
    : ["Rien de particulier ne ressort aujourd'hui. Vous pouvez simplement prendre soin de vous."];

  return (
    <div className="amz-quiz" role="region" aria-label="Synthèse">
      <div className="amz-quiz-card">
        <h2 className="amz-ob-h" tabIndex={-1} ref={headingRef}>{ROUTE_CONTENT.SUMMARY.title}</h2>
        <p className="amz-quiz-caution">{ROUTE_CONTENT.SUMMARY.lines[1]}</p>

        <ul className="amz-sum-list">
          {q.sections.map((sec) => {
            const s = sectionScore(q, sec.id, answers);
            const th = s.thresholdId ? THRESHOLD_LABEL[s.thresholdId] : null;
            const pct = s.score !== null ? Math.round((s.score / (sec.item_ids.length * 3)) * 100) : 0;
            return (
              <li key={sec.id} className="amz-sum-row">
                <div className="amz-sum-top">
                  <span className="amz-sum-label">{sec.label}</span>
                  <span className={"amz-sum-badge " + (th?.cls ?? "none")}>
                    {s.noScore ? "pas assez de réponses" : th?.label}
                  </span>
                </div>
                {!s.noScore && (
                  <div className="amz-sum-bar" aria-hidden="true"><i className={th?.cls} style={{ width: `${pct}%` }} /></div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="amz-sum-sugg">
          <div className="amz-sum-sugg-h">Une piste douce pour aujourd'hui</div>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <p className="amz-quiz-disclaimer">{QUESTIONNAIRE.disclaimer}</p>

        <div className="amz-ob-actions">
          <button className="amz-ob-btn ghost" onClick={() => { setAnswers({}); setIdx(0); setPhase("intro"); }}>Recommencer</button>
          <button className="amz-ob-btn primary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
