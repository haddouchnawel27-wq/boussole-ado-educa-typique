"use client";
import { useEffect, useState } from "react";
import { useMode } from "@/lib/mode";
import { QUESTIONNAIRES, evaluate, questionText, type Questionnaire } from "@/lib/questionnaires";
import { getClients, saveQuestionnaireResponseDb } from "@/lib/data";
import { labelsForMode } from "@/lib/mode-labels";

export default function QuestionnairesPage() {
  const { mode } = useMode();
  const [dossierId, setDossierId] = useState("");
  useEffect(() => {
    setDossierId(new URLSearchParams(window.location.search).get("client") ?? "");
  }, []);
  const islamic = mode === "islamique";
  const labels = labelsForMode(mode);
  const [curId, setCurId] = useState<string | null>(null);
  const cur = QUESTIONNAIRES.find((q) => q.id === curId) ?? null;
  const visibles = QUESTIONNAIRES.filter((q) => !q.islamicOnly || islamic);

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="border-b border-shell-border pb-4">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.28em] text-jq-sage">Moteur de questionnaires</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-shell-text sm:text-5xl">Questionnaires</h1>
        <p className="mt-2 max-w-[62ch] text-shell-muted">
          Un seul moteur pour tous : repérages, profils, bilans, anamnèse. Chaque questionnaire n'est qu'un jeu de
          données — les résultats se relient à la fiche client. <b>Jamais un diagnostic</b> : une restitution douce.
        </p>
      </header>

      {!cur && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {visibles.map((q) => (
            <button
              key={q.id}
              onClick={() => setCurId(q.id)}
              className="rounded-2xl border border-shell-border bg-shell-surface p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-gold"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={"rounded-md px-2 py-0.5 text-[10.5px] font-extrabold uppercase " + (q.univers === "jannat" ? "bg-jq-tender text-jq-deep" : "bg-et-sky text-[#1f5563]")}>
                  {q.univers === "jannat" ? labels.adultGroup : labels.youthGroup}
                </span>
                {q.islamicOnly && <span className="rounded-md bg-[rgba(195,135,60,.16)] px-2 py-0.5 text-[10.5px] font-extrabold uppercase text-gold-dark">Mode islamique</span>}
              </div>
              <h2 className="mt-2 font-round text-lg font-bold text-shell-text">{q.titre}</h2>
              <p className="mt-1 text-[13px] text-shell-muted">{q.questions.length} questions · restitution immédiate</p>
            </button>
          ))}
        </div>
      )}

      {cur && <Runner q={cur} dossierId={dossierId} onExit={() => setCurId(null)} />}
    </main>
  );
}

function Runner({ q, dossierId, onExit }: { q: Questionnaire; dossierId: string; onExit: () => void }) {
  const { mode } = useMode();
  const islamic = mode === "islamique";
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const allAnswered = q.questions.every((qq) => answers[qq.id] !== undefined);
  const ev = evaluate(q, answers);

  // « Relier à la fiche client »
  const [linking, setLinking] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [live, setLive] = useState(false);
  const [clients, setClients] = useState<{ id: string; nom: string }[]>([]);
  const [pick, setPick] = useState("");
  const [savedTo, setSavedTo] = useState<string | null>(null);
  const [linkErr, setLinkErr] = useState("");

  async function openLink() {
    setLinking(true);
    setLinkErr("");
    setLoadingClients(true);
    const r = await getClients();
    setLive(r.source === "supabase");
    setClients(r.clients.map((cl) => ({ id: cl.id, nom: cl.nom })));
    setPick(r.clients.find((cl) => cl.id === dossierId)?.id ?? r.clients[0]?.id ?? "");
    setLoadingClients(false);
  }

  async function confirmLink() {
    if (!pick) return;
    const ok = await saveQuestionnaireResponseDb(pick, q.id, answers, ev.score, ev.scoreMax);
    if (ok) {
      setSavedTo(clients.find((cl) => cl.id === pick)?.nom ?? "la fiche");
      setLinking(false);
    } else {
      setLinkErr("La sauvegarde n'a pas pu se faire. Vérifie que tu es bien connectée à ton espace.");
    }
  }

  function restart() {
    setAnswers({});
    setSubmitted(false);
    setLinking(false);
    setSavedTo(null);
    setLinkErr("");
  }

  return (
    <div className="mt-6">
      <button onClick={onExit} className="mb-4 text-sm font-semibold text-gold-dark hover:underline">← Tous les questionnaires</button>
      <div className="rounded-2xl border border-shell-border bg-shell-surface p-5 shadow-soft sm:p-7">
        <h2 className="font-serif text-2xl font-semibold text-jq-deep">{q.titre}</h2>
        {islamic && q.introI.includes("بِإِذْنِ") && <p className="mt-1 font-arab text-lg text-gold" dir="rtl">بِإِذْنِ اللّٰه</p>}
        <p className="mb-5 mt-1 text-sm text-shell-muted">{islamic ? q.introI : q.introU}</p>

        {!submitted && (
          <>
            <div className="flex flex-col gap-4">
              {q.questions.map((qq, i) => (
                <div key={qq.id} className="rounded-xl border border-shell-border bg-shell-soft p-4">
                  <div className="mb-2.5 text-sm font-semibold text-shell-text">
                    <span className="mr-1.5 text-gold">{i + 1}.</span>
                    {questionText(qq, islamic)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden w-24 shrink-0 text-right text-[11px] text-shell-muted sm:block">{qq.minLabel}</span>
                    <div className="flex flex-1 justify-between gap-1.5">
                      {Array.from({ length: qq.max - qq.min + 1 }, (_, k) => qq.min + k).map((v) => {
                        const on = answers[qq.id] === v;
                        return (
                          <button
                            key={v}
                            onClick={() => setAnswers((a) => ({ ...a, [qq.id]: v }))}
                            aria-label={`${qq.texte} : ${v}`}
                            className={"h-10 flex-1 rounded-lg border text-sm font-bold transition " + (on ? "border-gold bg-gradient-to-br from-gold-light to-gold text-white" : "border-shell-border bg-shell-surface text-shell-muted hover:border-gold-light")}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                    <span className="hidden w-24 shrink-0 text-[11px] text-shell-muted sm:block">{qq.maxLabel}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button
                disabled={!allAnswered}
                onClick={() => setSubmitted(true)}
                className={"rounded-xl px-5 py-2.5 text-sm font-semibold text-white " + (allAnswered ? "bg-jq-deep" : "cursor-not-allowed bg-shell-muted/50")}
              >
                Voir ma restitution
              </button>
              <span className="text-[13px] text-shell-muted">
                {Object.keys(answers).length}/{q.questions.length} répondues
              </span>
            </div>
          </>
        )}

        {submitted && (
          <div>
            <div className="mb-4 flex items-center gap-4">
              <Gauge ratio={ev.ratio} />
              <div>
                <div className="font-serif text-xl font-semibold text-jq-deep">{ev.band.titre}</div>
                <div className="text-[13px] text-shell-muted">Score indicatif {ev.score}/{ev.scoreMax}</div>
              </div>
            </div>

            {/* ALERTES DE SÉCURITÉ — priment sur le score, affichées en premier */}
            {ev.alerts.map((a, i) => (
              <div
                key={i}
                className={"mb-3 rounded-xl border-l-4 p-4 " + (a.level === "rouge" ? "border-[#a94b54] bg-[rgba(169,75,84,.10)]" : "border-[#C08A2E] bg-[rgba(192,138,46,.10)]")}
              >
                <div className={"text-sm font-bold " + (a.level === "rouge" ? "text-[#a94b54]" : "text-[#8a6a1e]")}>
                  {a.level === "rouge" ? "🚨 " : "⚠️ "}
                  {a.titre}
                </div>
                <div className="mt-1 text-[13.5px] text-shell-text">{a.message}</div>
              </div>
            ))}

            <p className="rounded-xl border-l-[3px] border-gold bg-shell-soft p-4 text-sm">{ev.band.texte}</p>
            {q.note && <p className="mt-3 rounded-xl border border-shell-border bg-[rgba(94,127,140,.06)] p-3.5 text-[13px] text-shell-muted">{q.note}</p>}
            <div className="mt-4 rounded-xl border border-shell-border bg-[rgba(94,127,140,.08)] p-3.5 text-[13px] text-shell-muted">
              Ceci n'est <b>pas un diagnostic</b>, mais un repère de dialogue. Il ne remplace ni un bilan, ni l'avis d'un
              professionnel.{islamic && " La guérison appartient à Allāh."}
            </div>
            <div className="mt-4">
              {savedTo ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-xl border border-[rgba(91,138,91,.4)] bg-[rgba(91,138,91,.12)] px-4 py-2.5 text-sm font-semibold text-[#4d7a4d]">
                    ✔ Résultat relié à la fiche de <b>{savedTo}</b>.
                  </span>
                  {pick && <a href={`/cockpit?client=${encodeURIComponent(pick)}&etape=formuler`} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">➜ Retour au dossier : état des lieux</a>}
                  <button onClick={restart} className="rounded-xl border border-shell-border px-4 py-2.5 text-sm font-semibold">Recommencer</button>
                </div>
              ) : !linking ? (
                <div className="flex flex-wrap gap-3">
                  <button onClick={openLink} className="rounded-xl bg-gradient-to-br from-gold-light to-gold-dark px-4 py-2.5 text-sm font-semibold text-white shadow">
                    ⤓ Relier à la fiche client
                  </button>
                  <button onClick={restart} className="rounded-xl border border-shell-border px-4 py-2.5 text-sm font-semibold">
                    Recommencer
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-shell-border bg-shell-soft p-4">
                  {loadingClients ? (
                    <p className="text-sm text-shell-muted">Chargement de tes accompagnées…</p>
                  ) : !live ? (
                    <p className="text-sm text-shell-muted">
                      Connecte-toi à ton espace pour relier ce résultat à une vraie fiche.{" "}
                      <a href="/login" className="font-semibold text-gold-dark underline">Se connecter</a>
                    </p>
                  ) : clients.length === 0 ? (
                    <p className="text-sm text-shell-muted">
                      Aucune accompagnée pour l'instant. Crée une fiche dans le <a href="/cockpit" className="font-semibold text-gold-dark underline">Cockpit</a>, puis reviens relier ce résultat.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <label className="text-[11px] font-bold uppercase tracking-wide text-shell-muted">Relier à quelle accompagnée ?</label>
                      <select value={pick} onChange={(e) => setPick(e.target.value)} className="rounded-lg border border-shell-border bg-shell-surface px-3 py-2 text-sm outline-none focus:border-gold">
                        {clients.map((cl) => <option key={cl.id} value={cl.id}>{cl.nom}</option>)}
                      </select>
                      {linkErr && <p className="text-[13px] font-semibold text-[#a94b54]">{linkErr}</p>}
                      <div className="flex flex-wrap gap-3">
                        <button onClick={confirmLink} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">✔ Confirmer</button>
                        <button onClick={() => setLinking(false)} className="rounded-xl border border-shell-border px-4 py-2.5 text-sm font-semibold">Annuler</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Gauge({ ratio }: { ratio: number }) {
  const pct = Math.round(ratio * 100);
  const color = ratio <= 0.35 ? "#a94b54" : ratio <= 0.65 ? "#C08A2E" : "#5B8A5B";
  return (
    <div
      className="grid h-16 w-16 flex-none place-items-center rounded-full"
      style={{ background: `conic-gradient(${color} ${pct}%, #EDE4CF 0)` }}
      aria-label={`${pct}%`}
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-shell-surface font-serif text-sm font-bold" style={{ color }}>
        {pct}%
      </div>
    </div>
  );
}
