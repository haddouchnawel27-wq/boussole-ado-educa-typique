"use client";
import { useEffect, useMemo, useState } from "react";
import { useMode } from "@/lib/mode";
import { DUAS, LIBRARY, METEO, STEPS } from "@/lib/demo";
import type { Client, Meteo } from "@/lib/types";
import { addSeanceDb, createClientDb, getClients, saveSyntheseDb, updateClientDb, type Source } from "@/lib/data";

const METEO_KEYS = Object.keys(METEO) as Meteo[];

export default function Cockpit() {
  const { mode } = useMode();
  const islamic = mode === "islamique";
  const [clients, setClients] = useState<Client[]>([]);
  const [source, setSource] = useState<Source>("demo");
  const [loading, setLoading] = useState(true);
  const [curId, setCurId] = useState("");
  const [step, setStep] = useState("synthese");

  // formulaire séance
  const [mPick, setMPick] = useState<Meteo | null>(null);
  const [notes, setNotes] = useState("");
  const [axes, setAxes] = useState("");
  // saisie accueil / bilan
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    getClients().then((r) => {
      setClients(r.clients);
      setSource(r.source);
      setCurId(r.clients[0]?.id ?? "");
      setLoading(false);
    });
  }, []);

  const c = useMemo(() => clients.find((x) => x.id === curId), [clients, curId]);

  const live = source === "supabase";

  function update(id: string, fn: (cl: Client) => Client) {
    setClients((prev) => prev.map((cl) => (cl.id === id ? fn(cl) : cl)));
  }

  async function reload(keepId?: string) {
    const r = await getClients();
    setClients(r.clients);
    setSource(r.source);
    setCurId(keepId && r.clients.some((x) => x.id === keepId) ? keepId : r.clients[0]?.id ?? "");
  }

  function selectClient(id: string) {
    setCurId(id);
    const cl = clients.find((x) => x.id === id);
    setStep(STEPS.find((s) => s.n === (cl?.etape ?? 1))?.k ?? "accueil");
  }

  async function addClient() {
    const nom = window.prompt("Prénom de l'accompagnée :")?.trim();
    if (!nom) return;
    if (live) {
      const id = await createClientDb(nom, "");
      await reload(id ?? undefined);
      setStep("accueil");
    } else {
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
      const nc: Client = { id, nom, initiale: nom.charAt(0).toUpperCase(), etape: 1, consentement: false, intention: "", rdv: "", bilan: { histoire: "", schemas: "", neuro: "", spirituel: "" }, seances: [], engagements: [], synthese: { status: "vierge", sections: [], boussole: "", semaine: "", duaIdx: 0 } };
      setClients((prev) => [...prev, nc]);
      setCurId(id);
      setStep("accueil");
    }
  }

  async function addSeance() {
    if (!mPick || !notes.trim() || !c) return;
    const mois = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    const d = new Date();
    const s = { date: `${d.getDate()} ${mois[d.getMonth()]}`, meteo: mPick, notes: notes.trim(), axes: axes.trim() || "—" };
    if (live) {
      await addSeanceDb(curId, s);
      await reload(curId);
    } else {
      update(curId, (cl) => ({ ...cl, seances: [...cl.seances, s] }));
    }
    setMPick(null);
    setNotes("");
    setAxes("");
  }

  // édite un champ localement (l'input reste fluide), la sauvegarde se fait au bouton
  function editClient(fn: (cl: Client) => Client) {
    if (!curId) return;
    update(curId, fn);
  }

  // enregistre les champs saisis (Accueil / Bilan) dans Supabase si en ligne
  async function persistFields(fields: { intention?: string; rdv?: string; consentement?: boolean; bilan?: Client["bilan"] }) {
    if (!c) return;
    if (live) {
      await updateClientDb(curId, fields);
      await reload(curId);
    }
    setSavedMsg("✔ Enregistré");
    window.setTimeout(() => setSavedMsg(""), 2500);
  }

  function computeDraft(cl: Client): Client["synthese"] {
    const last = cl.seances[cl.seances.length - 1] ?? { notes: "", axes: "" };
    return {
      status: "brouillon",
      duaIdx: cl.synthese.duaIdx,
      sections: [
        { t: "Ce que tu as traversé", x: cl.seances.map((s) => s.notes).join(" ") },
        { t: "Ce que j'ai observé de beau", x: "Ta lucidité et ta persévérance : tu as osé nommer ce qui déborde et tester de petits changements concrets." },
        { t: "Là où tu en es", x: last.notes },
        { t: "La prochaine marche", x: last.axes },
        { t: "Ta ressource d'appui", x: "Le rituel de transition, à garder comme point d'ancrage." },
      ],
      boussole: "Tu n'as pas à tout porter d'un coup. Une graine à la fois.",
      semaine: cl.engagements.join(" · ") || "Un petit pas, choisi par toi.",
    };
  }

  async function buildDraft() {
    if (!c) return;
    const syn = computeDraft(c);
    if (live) {
      await saveSyntheseDb(curId, syn);
      await reload(curId);
    } else {
      update(curId, (cl) => ({ ...cl, synthese: syn }));
    }
  }

  async function setDua(i: number) {
    if (!c) return;
    const syn = { ...c.synthese, duaIdx: i };
    if (live) {
      await saveSyntheseDb(curId, syn);
      await reload(curId);
    } else {
      update(curId, (cl) => ({ ...cl, synthese: { ...cl.synthese, duaIdx: i } }));
    }
  }

  async function setStatus(status: Client["synthese"]["status"]) {
    if (!c) return;
    const syn = { ...c.synthese, status };
    if (live) {
      await saveSyntheseDb(curId, syn);
      await reload(curId);
    } else {
      update(curId, (cl) => ({ ...cl, synthese: { ...cl.synthese, status } }));
    }
  }

  if (loading) return <div className="p-12 text-center text-shell-muted">Chargement…</div>;
  if (!c)
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="font-serif text-2xl font-semibold text-jq-deep">Aucune accompagnée pour l&apos;instant</p>
        <p className="mt-1 text-shell-muted">{live ? "Ton espace est prêt 🌸 Crée ta première fiche." : "Mode démonstration."}</p>
        <button onClick={addClient} className="mt-5 rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">
          + Créer une accompagnée
        </button>
      </main>
    );

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
      {/* SIDEBAR */}
      <aside className="flex flex-col gap-4 border-b border-shell-border bg-gradient-to-b from-[rgba(124,139,108,.06)] to-transparent p-4 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-jq-sage font-serif text-lg font-semibold text-white">ج</span>
          <div>
            <div className="font-serif text-lg font-semibold text-jq-deep">Jannat al Qulûb</div>
            <div className="text-[11px] uppercase tracking-wider text-shell-muted">Cockpit praticienne</div>
          </div>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-shell-muted">Mes accompagnées</div>
        <div className="flex flex-col gap-2">
          {clients.map((cl) => {
            const et = STEPS.find((s) => s.n === cl.etape);
            const on = cl.id === curId;
            return (
              <button
                key={cl.id}
                onClick={() => selectClient(cl.id)}
                className={"flex items-center gap-3 rounded-2xl border bg-shell-surface p-2.5 text-left transition " + (on ? "border-gold shadow-soft" : "border-transparent hover:border-shell-border")}
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-jq-sage to-jq-deep font-serif text-base font-semibold text-white">{cl.initiale}</span>
                <span>
                  <span className="block text-sm font-bold text-shell-text">{cl.nom}</span>
                  <span className="block text-[11.5px] text-shell-muted">Étape {cl.etape} · {et?.t}</span>
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={addClient}
          className="rounded-xl border border-dashed border-shell-border px-3 py-2 text-sm font-semibold text-shell-muted transition hover:border-gold hover:text-gold-dark"
        >
          + Nouvelle accompagnée
        </button>
        <div className="mt-auto border-t border-shell-border pt-3 text-[11.5px] text-shell-muted">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark text-sm font-semibold text-white">N</span>
            <div>
              <div className="text-[13px] font-bold text-shell-text">Nawel · Oum Mona</div>
              <div>Praticienne — Les Deux Jardins</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="max-w-4xl p-5 pb-16 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold text-jq-deep sm:text-3xl">Cockpit praticienne</h1>
          <span
            className={
              "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide " +
              (source === "supabase" ? "bg-[rgba(91,138,91,.15)] text-[#4d7a4d]" : "bg-shell-soft text-shell-muted")
            }
            title={source === "supabase" ? "Connecté à ta base Supabase" : "Mode démonstration (données non sauvegardées)"}
          >
            {source === "supabase" ? "● En ligne" : "Démo"}
          </span>
        </div>

        {/* FICHE */}
        <div className="mb-4 rounded-2xl border border-shell-border border-l-4 border-l-jq-sage bg-shell-surface p-4 shadow-soft sm:p-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-serif text-2xl font-semibold text-jq-deep">{c.nom}</span>
            <Meta k="Intention" v={c.intention} />
            <Meta k="Prochain RDV" v={c.rdv} />
            <span className="ml-auto">
              {c.consentement ? (
                <Pill ok>Consentement recueilli</Pill>
              ) : (
                <Pill>Consentement à recueillir</Pill>
              )}
            </span>
          </div>
        </div>

        {/* STEPPER */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-2">
          {STEPS.map((s) => {
            const on = s.k === step;
            const done = s.n < c.etape;
            return (
              <button
                key={s.k}
                onClick={() => setStep(s.k)}
                className={"flex flex-none items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition " + (on ? "border-jq-deep bg-jq-deep text-white" : "border-shell-border bg-shell-surface text-shell-muted hover:border-gold-light")}
              >
                <span className={"grid h-5 w-5 place-items-center rounded-full text-[12px] font-extrabold " + (on ? "bg-white/25 text-white" : done ? "bg-jq-sage text-white" : "bg-shell-soft text-jq-deep")}>{s.n}</span>
                {s.t}
              </button>
            );
          })}
        </div>

        {/* PANEL */}
        <div className="rounded-2xl border border-shell-border bg-shell-surface p-5 shadow-soft sm:p-7">
          {step === "accueil" && (
            <Panel title="Accueil" lead="Questionnaire d'entrée, intention, consentement, prise de RDV. Écris directement dans les champs, puis « Enregistrer ».">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <EditField k="Intention exprimée" v={c.intention} placeholder="Pourquoi vient-elle, en ses mots…" onChange={(val) => editClient((cl) => ({ ...cl, intention: val }))} />
                <EditField k="Prise de RDV" v={c.rdv} placeholder="ex. Mar. 22 juil. · 14h" onChange={(val) => editClient((cl) => ({ ...cl, rdv: val }))} />
              </div>
              <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
                <div className="rounded-2xl border border-shell-border bg-shell-soft p-3.5">
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-shell-muted">Consentement éclairé</div>
                  <button
                    onClick={() => editClient((cl) => ({ ...cl, consentement: !cl.consentement }))}
                    className={"w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition " + (c.consentement ? "bg-[rgba(91,138,91,.15)] text-[#4d7a4d]" : "border border-dashed border-gold bg-shell-surface text-gold-dark")}
                  >
                    {c.consentement ? "✔ Recueilli — cliquer pour annuler" : "⚠ À recueillir — cliquer quand c'est fait"}
                  </button>
                </div>
                <Field k="Mode d'accompagnement" v={islamic ? "Islamique — psycho-spirituel" : "Universel — fondé sur les preuves"} />
              </div>
              <SaveBar msg={savedMsg} onSave={() => persistFields({ intention: c.intention, rdv: c.rdv, consentement: c.consentement })} />
              <Callout>Aucun diagnostic. L'accompagnement complète, sans les remplacer, le suivi médical et l'avis d'un professionnel de santé.</Callout>
            </Panel>
          )}

          {step === "bilan" && (
            <Panel title="Bilan / anamnèse" lead="Recueil structuré : histoire, schémas, neuro-atypie, dimension spirituelle. Écris directement, puis « Enregistrer ».">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <EditField k="Histoire" v={c.bilan.histoire} placeholder="Parcours, contexte, éléments marquants…" onChange={(val) => editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, histoire: val } }))} />
                <EditField k="Schémas" v={c.bilan.schemas} placeholder="Fonctionnements, croyances, boucles…" onChange={(val) => editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, schemas: val } }))} />
                <EditField k="Neuro-atypie" v={c.bilan.neuro} placeholder="TND, HPI, sensorialité… (si concerné)" onChange={(val) => editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, neuro: val } }))} />
                <EditField k={islamic ? "Dimension spirituelle" : "Ressources & valeurs"} v={c.bilan.spirituel} placeholder="Appuis, valeurs, foi, ressources…" onChange={(val) => editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, spirituel: val } }))} />
              </div>
              <SaveBar msg={savedMsg} onSave={() => persistFields({ bilan: c.bilan })} />
            </Panel>
          )}

          {step === "seances" && (
            <Panel title="Séances" lead="Notes de séance, « météo émotionnelle », axes de travail.">
              {c.seances.length === 0 && <p className="text-sm text-shell-muted">Aucune séance pour l'instant.</p>}
              {c.seances.map((s, i) => (
                <div key={i} className="mb-3 rounded-2xl border border-shell-border bg-shell-soft p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold">Séance · {s.date}</span>
                    <span className={"inline-flex items-center rounded-full px-2.5 py-1 text-[12.5px] font-bold " + METEO[s.meteo].cls}>Météo : {METEO[s.meteo].label}</span>
                  </div>
                  <div className="text-sm">{s.notes}</div>
                  <div className="mt-1.5 text-[13px] text-shell-muted"><b className="text-shell-text">Axe :</b> {s.axes}</div>
                </div>
              ))}
              <Label>Nouvelle séance — météo émotionnelle</Label>
              <div className="flex flex-wrap gap-1.5">
                {METEO_KEYS.map((k) => (
                  <button key={k} onClick={() => setMPick(k)} className={"rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition " + (mPick === k ? "border-gold bg-shell-soft text-shell-text" : "border-shell-border bg-shell-surface text-shell-muted")}>{METEO[k].label}</button>
                ))}
              </div>
              <Label>Notes</Label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Ce qui s'est dit, observé…" className="w-full rounded-xl border border-shell-border bg-shell-surface p-2.5 text-sm outline-none focus:border-gold" />
              <Label>Axe de travail</Label>
              <input value={axes} onChange={(e) => setAxes(e.target.value)} placeholder="Le prochain petit pas…" className="w-full rounded-xl border border-shell-border bg-shell-surface p-2.5 text-sm outline-none focus:border-gold" />
              <div className="mt-4">
                <button onClick={addSeance} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">+ Enregistrer la séance</button>
              </div>
            </Panel>
          )}

          {step === "outils" && (
            <Panel title="Bibliothèque d'outils" lead="Protocoles, workbooks, ancrages — assignables. Les ressources spirituelles portent leur statut de validation et n'apparaissent qu'en mode islamique.">
              {LIBRARY.filter((t) => t.type !== "spir" || islamic).map((t) => (
                <div key={t.nm} className="mb-2.5 flex items-start gap-3 rounded-2xl border border-shell-border bg-shell-surface p-3.5">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-shell-soft text-gold">✦</span>
                  <div>
                    <div className="text-sm font-bold">{t.nm}</div>
                    <div className="text-[12.5px] text-shell-muted">{t.ds}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className={"rounded-md px-2 py-0.5 text-[10.5px] font-extrabold uppercase " + (t.type === "clin" ? "bg-[rgba(94,127,140,.15)] text-[#5e7f8c]" : "bg-[rgba(195,135,60,.16)] text-gold-dark")}>{t.type === "clin" ? "Clinique" : "Spirituel"}</span>
                      {t.relig && <span className="rounded-md border border-dashed border-gold bg-[rgba(192,138,46,.16)] px-2 py-0.5 text-[10.5px] font-extrabold uppercase text-[#C08A2E]">Brouillon · à valider</span>}
                    </div>
                  </div>
                </div>
              ))}
              <Callout>Contenu religieux : jamais inventé — issu du corpus validé, cité, publié seulement après ta validation (brouillon → validé → publié).</Callout>
            </Panel>
          )}

          {step === "synthese" && <Synthese c={c} islamic={islamic} onBuild={buildDraft} onValidate={() => setStatus("valide")} onReopen={() => setStatus("brouillon")} onDua={setDua} />}

          {step === "suivi" && (
            <Panel title="Suivi & progression" lead="Tableau d'évolution, engagements de la semaine, rappels automatiques.">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field k="Météo des dernières séances" v={c.seances.map((s) => `${s.date} · ${METEO[s.meteo].label}`).join(" · ") || "—"} />
                <Field k={islamic ? "Engagements (niyya)" : "Engagements de la semaine"} v={c.engagements.join(" · ") || "—"} />
              </div>
              <Callout>Un rappel doux sera proposé à J-1 du prochain RDV — jamais envoyé sans ton feu vert.</Callout>
            </Panel>
          )}

          {step === "cloture" && (
            <Panel title="Clôture" lead="Bilan de fin de parcours, témoignage, transmission, orientation Relais Lumière.">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field k="Bilan de parcours" v="À compléter en fin d'accompagnement." />
                <Field k="Témoignage (avec accord)" v="—" />
              </div>
              <Callout><b>Relais Lumière</b> — proposer, si la personne le souhaite, de transmettre à son tour (mécénat / tarif solidaire / Sadaqa).</Callout>
            </Panel>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------- sous-composants ---------- */
function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10.5px] font-bold uppercase tracking-wide text-shell-muted">{k}</span>
      <span className="text-sm">{v}</span>
    </div>
  );
}
function Pill({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold " + (ok ? "bg-[rgba(91,138,91,.14)] text-[#5B8A5B]" : "bg-[rgba(192,138,46,.16)] text-[#C08A2E]")}>
      <span className={"h-2 w-2 rounded-full " + (ok ? "bg-[#5B8A5B]" : "bg-[#C08A2E]")} />
      {children}
    </span>
  );
}
function Panel({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-jq-deep">{title}</h2>
      <p className="mb-4 mt-0.5 text-sm text-shell-muted">{lead}</p>
      {children}
    </div>
  );
}
function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-shell-border bg-shell-soft p-3.5">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-shell-muted">{k}</div>
      <div className="text-sm">{v}</div>
    </div>
  );
}
function EditField({ k, v, onChange, placeholder }: { k: string; v: string; onChange: (val: string) => void; placeholder?: string }) {
  return (
    <div className="rounded-2xl border border-shell-border bg-shell-soft p-3.5">
      <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-shell-muted">{k}</div>
      <textarea
        value={v}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-shell-border bg-shell-surface p-2 text-sm outline-none focus:border-gold"
      />
    </div>
  );
}
function SaveBar({ onSave, msg }: { onSave: () => void; msg: string }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <button onClick={onSave} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">💾 Enregistrer</button>
      {msg && <span className="text-[13px] font-semibold text-[#4d7a4d]">{msg}</span>}
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 mt-3 block text-[11px] font-bold uppercase tracking-wide text-shell-muted">{children}</label>;
}
function Callout({ children }: { children: React.ReactNode }) {
  return <div className="mt-3.5 rounded-xl border border-shell-border bg-[rgba(94,127,140,.08)] p-3.5 text-[13px] text-shell-muted">{children}</div>;
}

function Synthese({
  c,
  islamic,
  onBuild,
  onValidate,
  onReopen,
  onDua,
}: {
  c: Client;
  islamic: boolean;
  onBuild: () => void;
  onValidate: () => void;
  onReopen: () => void;
  onDua: (i: number) => void;
}) {
  const s = c.synthese;
  const has = s.sections.length > 0;
  const du = DUAS[s.duaIdx] ?? DUAS[0];
  return (
    <Panel title="Synthèse « Pour toi »" lead="Génération semi-automatique de la lettre post-séance à partir de tes notes. Tu relis, tu ajustes — elle n'est jamais envoyée sans ta validation.">
      <div className="mb-2 flex flex-wrap items-center gap-3 rounded-xl border border-shell-border bg-shell-soft p-3">
        {s.status === "valide" ? <Pill ok>Validée — prête à relire &amp; envoyer</Pill> : <Pill>{has ? "Brouillon — à relire" : "Pas encore générée"}</Pill>}
        <span className="flex items-center gap-1 text-[11.5px] font-bold">
          {["brouillon", "validé", "publié"].map((f, i) => (
            <span key={f} className={"rounded-full border px-2.5 py-0.5 " + ((i === 0 && s.status === "brouillon" && has) || (i === 1 && s.status === "valide") ? "border-gold bg-gold text-white" : "border-shell-border bg-shell-surface text-shell-muted")}>{f}</span>
          ))}
        </span>
        <span className="ml-auto text-[13px] text-shell-muted">Format imposé · charte Jannat al Qulûb</span>
      </div>

      <div className="mb-1 flex flex-wrap gap-2.5">
        <button onClick={onBuild} className="rounded-xl bg-gradient-to-br from-gold-light to-gold-dark px-4 py-2.5 text-sm font-semibold text-white shadow">{has ? "↺ Régénérer le brouillon" : "✨ Générer le brouillon"}</button>
        {has && s.status !== "valide" && <button onClick={onValidate} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">✔ Valider la lettre</button>}
        {s.status === "valide" && <button onClick={onReopen} className="rounded-xl border border-shell-border px-4 py-2.5 text-sm font-semibold">Rouvrir en brouillon</button>}
      </div>

      {!has && <Callout>Clique sur « Générer le brouillon » : la lettre se pré-remplit depuis les notes de séance, puis tu la relis et l'ajustes.</Callout>}

      {has && islamic && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2.5 rounded-xl border border-shell-border bg-shell-soft p-3">
          <span className="text-[13px] text-shell-muted">Invocation proposée (selon l'état) :</span>
          <select value={s.duaIdx} onChange={(e) => onDua(Number(e.target.value))} className="rounded-lg border border-shell-border bg-shell-surface px-2.5 py-1.5 text-[13px]">
            {DUAS.map((x, i) => (
              <option key={i} value={i}>{x.etat}</option>
            ))}
          </select>
          <span className="text-[11.5px] text-shell-muted">issue de ton guide du'ā — source citée, non imposée</span>
        </div>
      )}

      {has && (
        <div className="mt-4 rounded-2xl border border-shell-border p-5 sm:p-8">
          <div className="mb-4 border-b border-shell-border pb-3.5 text-center">
            <div className="font-serif text-xl font-semibold text-jq-deep">Jannat al Qulûb</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-shell-muted">Le Jardin du cœur</div>
          </div>
          {islamic && <div className="mb-1.5 text-center font-arab text-2xl text-gold" dir="rtl">بِسْمِ اللَّٰهِ الرَّحْمَٰنِ الرَّحِيمِ</div>}
          <div className="mb-4 text-center font-serif text-lg italic text-gold-dark">{islamic ? `As-salāmu ʿalayki ${c.nom},` : `Chère ${c.nom},`}</div>
          {s.sections.map((sec, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline gap-2 font-serif text-base font-bold text-jq-deep"><span className="font-body text-[13px] font-extrabold text-gold">{i + 1}.</span>{sec.t}</div>
              <div className="text-sm leading-relaxed">{sec.x || "…"}</div>
            </div>
          ))}
          <div className="my-4 rounded-lg border-l-[3px] border-gold bg-shell-soft p-3.5 italic"><b>Ta boussole :</b> {s.boussole}</div>
          {islamic && (
            <div className="my-4 rounded-lg border border-shell-border bg-[rgba(195,135,60,.07)] p-4 text-center">
              <div className="mb-1.5 text-[12.5px] italic text-shell-muted">Une invocation à porter, si ton cœur t'y invite —</div>
              <div className="font-arab text-2xl text-jq-deep" dir="rtl">{du.ar}</div>
              <div className="font-serif italic text-gold-dark">{du.ph}</div>
              <div className="text-sm">{du.fr}</div>
              <details className="mt-2 text-xs text-shell-muted"><summary className="cursor-pointer font-bold text-gold-dark">voir la source</summary>{du.src} · <span className="font-bold text-gold-dark">à valider par Nawel</span></details>
            </div>
          )}
          <div className="mt-4 rounded-lg border border-dashed border-gold p-3.5">
            <div className="mb-1.5 text-[12.5px] font-extrabold uppercase tracking-wide text-gold-dark">Pour cette semaine</div>
            {s.semaine}
          </div>
          <div className="mt-4 border-t border-shell-border pt-3 text-center text-[11.5px] text-shell-muted">
            Document confidentiel — remis dans le cadre d'un accompagnement. Ne remplace ni un diagnostic, ni un suivi médical.
            {islamic && " · La guérison appartient à Allāh."}
          </div>
        </div>
      )}
    </Panel>
  );
}
