"use client";
import { useEffect, useId, useMemo, useState } from "react";
import { useMode } from "@/lib/mode";
import { useAuth } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import { DUAS, LIBRARY, METEO, STEPS } from "@/lib/demo";
import { evaluateStored } from "@/lib/questionnaires";
import type { BilanCloture, Client, Meteo, SrcaCriterion } from "@/lib/types";
import { addSeanceDb, createClientDb, deleteClientDb, getClients, getQuestionnaireResponsesDb, saveSyntheseDb, updateClientDb, type QResponse, type Source } from "@/lib/data";
import { anamneseAlerts, anamneseFieldLabel, anamneseForMode, anamneseSectionTitle, reperesSpirituels, verifiedReligiousContent, type AnaField } from "@/lib/anamnese";
import { labelsForMode } from "@/lib/mode-labels";
import { ProfessionalGate } from "@/components/ProfessionalGate";
import { EMPTY_SRCA, guardedClinicalStep, srcaAfterRiskFieldChange, srcaReadiness, validateBilanCloture } from "@/lib/clinical-rules";
import { nonClinicalPilotMode, pilotStorageNotice } from "@/lib/pilot";

const METEO_KEYS = Object.keys(METEO) as Meteo[];

export default function CockpitPage() {
  return <ProfessionalGate><Cockpit /></ProfessionalGate>;
}

function Cockpit() {
  const { mode } = useMode();
  const islamic = mode === "islamique";
  const labels = labelsForMode(mode);
  const visibleAnamnese = useMemo(() => anamneseForMode(islamic), [islamic]);
  const { user } = useAuth();
  const practitionerName =
    (typeof user?.user_metadata?.nom === "string" && user.user_metadata.nom.trim()) ||
    user?.email?.split("@")[0] ||
    "Praticienne";
  const practitionerInitial = practitionerName.trim().charAt(0).toUpperCase() || "P";
  // Cockpit verrouillé : si Supabase est branché mais personne n'est connecté, aucune fiche n'est affichée.
  const mustLogin = supabaseEnabled && !user;
  const [clients, setClients] = useState<Client[]>([]);
  const [source, setSource] = useState<Source>("demo");
  const [loading, setLoading] = useState(true);
  const [curId, setCurId] = useState("");
  const [step, setStep] = useState("synthese");

  // formulaire séance
  const [mPick, setMPick] = useState<Meteo | null>(null);
  const [sessionKind, setSessionKind] = useState<"seance" | "annulation" | "absence">("seance");
  const [notes, setNotes] = useState("");
  const [axes, setAxes] = useState("");
  // saisie accueil / bilan
  const [savedMsg, setSavedMsg] = useState("");
  const [dirty, setDirty] = useState(false);
  // questionnaires reliés à la fiche courante
  const [responses, setResponses] = useState<QResponse[]>([]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // (Re)charge à chaque changement d'utilisateur : la déconnexion vide immédiatement l'écran.
  useEffect(() => {
    let active = true;
    setLoading(true);
    if (mustLogin) {
      setClients([]);
      setSource("demo");
      setCurId("");
      setResponses([]);
      setLoading(false);
      return () => {
        active = false;
      };
    }
    getClients().then((r) => {
      if (!active) return;
      setClients(r.clients);
      setSource(r.source);
      const query = new URLSearchParams(window.location.search);
      const requestedId = query.get("client");
      const requestedStep = query.get("etape");
      const requestedClient = r.clients.find((client) => client.id === requestedId);
      setCurId(requestedClient?.id ?? r.clients[0]?.id ?? "");
      if (requestedClient && requestedStep) {
        const unlocked = srcaReadiness(requestedClient.bilan.anamnese, requestedClient.bilan.srca).canEvaluate;
        const safeStep = guardedClinicalStep(requestedStep, unlocked);
        setStep(safeStep);
        if (safeStep !== requestedStep) {
          query.set("client", requestedClient.id);
          query.set("etape", safeStep);
          window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
        }
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const c = useMemo(() => clients.find((x) => x.id === curId), [clients, curId]);

  const live = source === "supabase";
  const readiness = srcaReadiness(c?.bilan.anamnese, c?.bilan.srca);

  // charge les questionnaires reliés à la fiche courante
  useEffect(() => {
    let active = true;
    if (curId && live) {
      getQuestionnaireResponsesDb(curId).then((rs) => {
        if (active) setResponses(rs);
      });
    } else {
      setResponses([]);
    }
    return () => {
      active = false;
    };
  }, [curId, live]);

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
    if (dirty && !window.confirm("Cette fiche contient des modifications non enregistrées. Quitter sans enregistrer ?")) return;
    setCurId(id);
    const cl = clients.find((x) => x.id === id);
    const requested = STEPS.find((s) => s.n === (cl?.etape ?? 1))?.k ?? "accueil";
    const unlocked = cl ? srcaReadiness(cl.bilan.anamnese, cl.bilan.srca).canEvaluate : false;
    const safeStep = guardedClinicalStep(requested, unlocked);
    setStep(safeStep);
    const query = new URLSearchParams(window.location.search);
    query.set("client", id);
    query.set("etape", safeStep);
    window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
  }

  async function addClient() {
    const nom = window.prompt("Code fictif temporaire, sans initiales ni lien avec l’identité (ex. Jardin 12) :")?.trim();
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
    if (!c) return;
    if (sessionKind === "seance" && !mPick) {
      flash("⚠️ Choisis la météo émotionnelle avant d'enregistrer la séance.");
      return;
    }
    if (sessionKind === "seance" && !notes.trim()) {
      flash("⚠️ Ajoute une note de séance avant d'enregistrer.");
      return;
    }
    const mois = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    const d = new Date();
    const prefix = sessionKind === "annulation" ? "[Rendez-vous annulé]" : sessionKind === "absence" ? "[Absence sans nouvelle]" : "";
    const defaultNote = sessionKind === "annulation" ? "Rendez-vous annulé." : "Absence au rendez-vous ; pas de réponse aux sollicitations à ce stade.";
    const s = {
      date: `${d.getDate()} ${mois[d.getMonth()]}`,
      meteo: mPick ?? "voile",
      notes: [prefix, notes.trim() || defaultNote].filter(Boolean).join(" "),
      axes: axes.trim() || "À réévaluer par la praticienne.",
    };
    if (live) {
      const ok = await addSeanceDb(curId, s);
      if (!ok) {
        flash("⚠️ Séance NON enregistrée — reconnecte-toi puis réessaie.");
        return;
      }
      await reload(curId);
    } else {
      update(curId, (cl) => ({ ...cl, seances: [...cl.seances, s] }));
    }
    setMPick(null);
    setSessionKind("seance");
    setNotes("");
    setAxes("");
    flash(live ? "✔ Séance enregistrée" : "✔ Ajouté pour cette session — rien n’est sauvegardé en ligne");
  }

  // supprime définitivement la fiche courante
  async function removeClient() {
    if (!c) return;
    if (!window.confirm(`Supprimer définitivement la fiche de « ${c.nom} » ? Cette action est irréversible.`)) return;
    const id = curId;
    if (live) {
      await deleteClientDb(id);
      await reload();
    } else {
      const rest = clients.filter((x) => x.id !== id);
      setClients(rest);
      setCurId(rest[0]?.id ?? "");
    }
  }

  // affiche un message de statut (vert si ✔, rouge si ⚠️) quelques secondes
  function flash(msg: string) {
    setSavedMsg(msg);
    window.setTimeout(() => setSavedMsg(""), msg.startsWith("⚠️") ? 6000 : 2500);
  }

  // édite un champ localement (l'input reste fluide), la sauvegarde se fait au bouton
  function editClient(fn: (cl: Client) => Client) {
    if (!curId) return;
    update(curId, fn);
    setDirty(true);
  }

  function goToStep(next: string) {
    const safeStep = guardedClinicalStep(next, readiness.canEvaluate);
    if (safeStep !== next) {
      flash("⚠️ Étape verrouillée — valide d’abord les quatre critères S·R·C·A dans le Bilan.");
      setStep("bilan");
      const query = new URLSearchParams(window.location.search);
      if (curId) query.set("client", curId);
      query.set("etape", "bilan");
      window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
      return;
    }
    if (next !== step && dirty && !window.confirm("Cette fiche contient des modifications non enregistrées. Enregistrer avant de changer d'étape ?")) return;
    setStep(next);
    const query = new URLSearchParams(window.location.search);
    if (curId) query.set("client", curId);
    query.set("etape", next);
    window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
  }

  // lecture / écriture d'un champ d'anamnèse (clé du schéma)
  function anaValue(key: string): string {
    return c?.bilan.anamnese?.[key] ?? "";
  }
  function editAnamnese(key: string, val: string) {
    editClient((cl) => ({
      ...cl,
      bilan: {
        ...cl.bilan,
        anamnese: { ...(cl.bilan.anamnese ?? {}), [key]: val },
        srca: srcaAfterRiskFieldChange(key, cl.bilan.srca),
      },
    }));
  }

  function editSrca(key: SrcaCriterion | "conduiteTenirEffectuee", value: boolean) {
    editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, srca: { ...(cl.bilan.srca ?? EMPTY_SRCA), [key]: value } } }));
  }

  function editCloture(fn: (b: BilanCloture) => BilanCloture) {
    if (!c || c.bilanCloture?.praticienneValidation.valideAt) return;
    const initial: BilanCloture = c.bilanCloture ?? {
      demandeInitiale: c.intention || c.bilan.anamnese?.s1_motif || "",
      objectifs: (c.bilan.objectifs ?? "").split(/\r?\n/).map((texte) => texte.trim()).filter(Boolean).map((texte) => ({ id: crypto.randomUUID(), texte, statut: "partiellement_atteint" as const })),
      ressourcesMobilisees: [], outilsConserves: [],
      autonomieRelais: { notes: "", relaisNecessaire: false },
      reorientation: { necessaire: false, details: "" },
      dateCloture: "",
      praticienneValidation: { nom: "", valideAt: "" },
    };
    update(curId, (cl) => ({ ...cl, bilanCloture: fn(initial) }));
    setDirty(true);
  }

  async function validateCloture() {
    if (!c) return;
    const draft = c.bilanCloture;
    if (!draft) { flash("⚠️ Complète le bilan de clôture avant de le valider."); return; }
    const validationCandidate = { ...draft, dateCloture: new Date().toISOString() };
    const errors = validateBilanCloture(validationCandidate);
    if (errors.length) { flash(`⚠️ ${errors[0]}`); return; }
    if (!window.confirm("Valider définitivement ce bilan ? Il ne pourra plus être modifié.")) return;
    const now = new Date().toISOString();
    const validated = { ...draft, dateCloture: now, praticienneValidation: { nom: practitionerName, valideAt: now } };
    if (live) {
      const ok = await updateClientDb(curId, { bilan_cloture: validated });
      if (!ok) { flash("⚠️ Bilan NON enregistré — reconnecte-toi puis réessaie."); return; }
      await reload(curId);
    } else update(curId, (cl) => ({ ...cl, bilanCloture: validated }));
    setDirty(false);
    flash(live ? "✔ Bilan de clôture validé et figé" : "✔ Validé pour cette session — rien n’est sauvegardé en ligne");
  }

  async function saveClotureDraft() {
    if (!c?.bilanCloture || c.bilanCloture.praticienneValidation.valideAt) return;
    if (live) {
      const ok = await updateClientDb(curId, { bilan_cloture: c.bilanCloture });
      if (!ok) { flash("⚠️ Brouillon NON enregistré — reconnecte-toi puis réessaie."); return; }
      await reload(curId);
    }
    setDirty(false);
    flash(live ? "✔ Brouillon de clôture enregistré" : "✔ Conservé pour cette session — rien n’est sauvegardé en ligne");
  }

  // enregistre les champs saisis (Accueil / Bilan) dans Supabase si en ligne
  async function persistFields(fields: { intention?: string; rdv?: string; consentement?: boolean; bilan?: Client["bilan"] }) {
    if (!c) return;
    if (live) {
      const ok = await updateClientDb(curId, fields);
      if (!ok) {
        flash("⚠️ NON enregistré — reconnecte-toi (Déconnexion → reconnexion) puis réessaie.");
        return;
      }
      await reload(curId);
    }
    setDirty(false);
    flash(live ? "✔ Enregistré" : "✔ Conservé pour cette session — rien n’est sauvegardé en ligne");
  }

  function computeDraft(cl: Client): Client["synthese"] {
    const last = cl.seances[cl.seances.length - 1] ?? { notes: "", axes: "" };
    const ana = cl.bilan.anamnese ?? {};
    // Repli sur l'anamnèse quand il n'y a pas encore de séance : le brouillon n'est jamais vide.
    const traverse = cl.seances.map((s) => s.notes).join(" ") || ana.s1_motif || ana.s5_trauma || cl.intention || "";
    const ouEnEs = last.notes || ana.s10_pourquoi || "";
    const marche = last.axes || ana.s10_objectif || "";
    return {
      status: "brouillon",
      duaIdx: cl.synthese.duaIdx,
      sections: [
        { t: "Ce que tu as traversé", x: traverse },
        { t: "Ce que j'ai observé de beau", x: "Ta lucidité et ta persévérance : tu as osé nommer ce qui déborde et tester de petits changements concrets." },
        { t: "Là où tu en es", x: ouEnEs },
        { t: "La prochaine marche", x: marche },
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
  if (mustLogin)
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.24em] text-jq-sage">Espace praticienne verrouillé</p>
        <p className="mt-2 font-serif text-2xl font-semibold text-jq-deep">🔒 Connecte-toi pour voir tes fiches</p>
        <p className="mt-1 text-shell-muted">Tes accompagnées ne s&apos;affichent qu&apos;une fois connectée — jamais après déconnexion.</p>
        <a href="/login" className="mt-5 inline-block rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">
          Se connecter →
        </a>
      </main>
    );
  if (!c)
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="font-serif text-2xl font-semibold text-jq-deep">Aucun dossier temporaire pour l&apos;instant</p>
        <p className="mt-1 text-shell-muted">{live ? "Ton espace est prêt 🌸 Crée ta première fiche." : "Mode pilote sans sauvegarde : les saisies disparaissent au rechargement."}</p>
        <button onClick={addClient} className="mt-5 rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">
          + Créer un dossier temporaire
        </button>
      </main>
    );

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
      {/* SIDEBAR */}
      <aside className="flex flex-col gap-4 border-b border-shell-border bg-gradient-to-b from-[rgba(124,139,108,.06)] to-transparent p-4 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-jq-sage font-serif text-lg font-semibold text-white">{islamic ? "ج" : "2J"}</span>
          <div>
            <div className="font-serif text-lg font-semibold text-jq-deep">{labels.cockpitBrand}</div>
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
          + Nouveau dossier temporaire
        </button>
        <p className="px-1 text-[11px] leading-snug text-shell-muted">🛡️ Code fictif uniquement — jamais d’initiales, de nom, de coordonnées ou de récit clinique. Rien n’est sauvegardé en ligne.</p>
        <div className="mt-auto border-t border-shell-border pt-3 text-[11.5px] text-shell-muted">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark text-sm font-semibold text-white">{practitionerInitial}</span>
            <div>
              <div className="text-[13px] font-bold text-shell-text">{practitionerName}</div>
              <div>Praticienne — Les Deux Jardins</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="w-full min-w-0 max-w-4xl p-5 pb-16 sm:p-8">
        {nonClinicalPilotMode && (
          <div role="status" className="mb-4 rounded-2xl border border-gold bg-[rgba(192,138,46,.10)] p-4 text-sm leading-relaxed text-[#6f5621]">
            <b>Mode pilote sans sauvegarde.</b> {pilotStorageNotice}
          </div>
        )}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold text-jq-deep sm:text-3xl">Cockpit praticienne</h1>
          <span
            className={
              "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide " +
              (source === "supabase" ? "bg-[rgba(91,138,91,.15)] text-[#4d7a4d]" : "bg-shell-soft text-shell-muted")
            }
            title={source === "supabase" ? "Connecté à ta base Supabase" : "Mode pilote : aucune donnée clinique lue ou écrite dans Supabase"}
          >
            {source === "supabase" ? "● En ligne" : "Pilote sans sauvegarde"}
          </span>
        </div>

        {/* FICHE */}
        <div className="mb-4 rounded-2xl border border-shell-border border-l-4 border-l-jq-sage bg-shell-surface p-4 shadow-soft sm:p-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-serif text-2xl font-semibold text-jq-deep">{c.nom}</span>
            <Meta k="Intention" v={c.intention} />
            <Meta k="Prochain RDV" v={c.rdv} />
            <div className="ml-auto flex items-center gap-3">
              {c.consentement ? (
                <Pill ok>Consentement recueilli</Pill>
              ) : (
                <Pill>Consentement à recueillir</Pill>
              )}
              <button
                onClick={removeClient}
                title="Supprimer définitivement cette fiche"
                className="rounded-full border border-shell-border px-2.5 py-1 text-[12px] font-semibold text-shell-muted transition hover:border-[#a94b54] hover:text-[#a94b54]"
              >
                🗑 Supprimer
              </button>
            </div>
          </div>
          <AnaAlertBanner anamnese={c.bilan.anamnese} />
        </div>

        {/* PARCOURS — poste de pilotage */}
        <div className="mb-4 rounded-2xl border border-shell-border bg-shell-soft p-4 sm:p-5">
          {(() => {
            const s1done = readiness.canEvaluate;
            const s2done = responses.length > 0;
            const s3done = Boolean(c.bilan.cartographie?.trim() || c.bilan.hypotheses?.trim());
            const s4done = Boolean(c.bilan.objectifs?.trim());
            const s5done = c.synthese.status === "valide";
            type Stage = { n: number; t: string; state: "done" | "todo" | "locked" | "soon"; href?: string; onClick?: () => void; note?: string };
            const stages: Stage[] = [
              { n: 1, t: "Accueil / anamnèse", state: s1done ? "done" : "todo", onClick: () => goToStep("bilan"), note: "S·R·C·A · sécurité" },
              { n: 2, t: "Évaluer", state: !s1done ? "locked" : s2done ? "done" : "todo", href: s1done ? `/questionnaires?client=${encodeURIComponent(c.id)}` : undefined, note: "Questionnaires ciblés · décodeurs" },
              { n: 3, t: "Formuler", state: !s2done ? "locked" : s3done ? "done" : "todo", onClick: s2done ? () => goToStep("formuler") : undefined, note: "État des lieux · cartographie · hypothèses" },
              { n: 4, t: "Cibler", state: !s3done ? "locked" : s4done ? "done" : "todo", onClick: s3done ? () => goToStep("cibler") : undefined, note: "Objectifs · référentiel · protocoles" },
              { n: 5, t: "Restituer", state: s5done ? "done" : "todo", onClick: () => goToStep("synthese"), note: "Synthèse + Suivi" },
            ];
            const sug: { label: string; onClick?: () => void; href?: string; done?: boolean } = !s1done
              ? { label: "Compléter l'accueil", onClick: () => goToStep("accueil") }
              : !s2done
              ? { label: "Évaluer avec un questionnaire ciblé", href: `/questionnaires?client=${encodeURIComponent(c.id)}` }
              : !s3done
              ? { label: "Formuler l'état des lieux", onClick: () => goToStep("formuler") }
              : !s4done
              ? { label: "Cibler les objectifs et protocoles", onClick: () => goToStep("cibler") }
              : !s5done
              ? { label: "Rédiger la synthèse « Pour toi »", onClick: () => goToStep("synthese") }
              : { label: "Parcours complet — mā shā'a Llāh 🌸", done: true };
            return (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-shell-muted">Parcours de l&apos;accompagnée</span>
                  {savedMsg && <span className={"text-[12px] font-semibold " + (savedMsg.startsWith("⚠️") ? "text-[#a94b54]" : "text-[#4d7a4d]")}>{savedMsg}</span>}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {stages.map((st) => {
                    const cls =
                      "flex flex-none items-center gap-2 rounded-xl border px-3 py-2 text-left text-[12.5px] " +
                      (st.state === "done"
                        ? "border-[rgba(91,138,91,.4)] bg-[rgba(91,138,91,.10)] text-[#4d7a4d]"
                        : st.state === "locked"
                        ? "border-shell-border bg-shell-surface text-shell-muted"
                        : st.state === "soon"
                        ? "border-dashed border-gold/40 bg-shell-surface text-gold-dark"
                        : "border-shell-border bg-shell-surface text-shell-text");
                    const inner = (
                      <>
                        <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-white/70 text-[11px] font-extrabold">
                          {st.state === "done" ? "✓" : st.state === "locked" ? "🔒" : st.n}
                        </span>
                        <span>
                          <span className="block font-bold">{st.t}</span>
                          {st.note && <span className="block text-[10.5px] text-shell-muted">{st.note}</span>}
                        </span>
                      </>
                    );
                    if (st.href) return <a key={st.n} href={st.href} className={cls + " transition hover:border-gold"}>{inner}</a>;
                    if (st.onClick) return <button key={st.n} onClick={st.onClick} className={cls + " transition hover:border-gold"}>{inner}</button>;
                    return <div key={st.n} className={cls}>{inner}</div>;
                  })}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {sug.done ? (
                    <span className="rounded-xl bg-[rgba(91,138,91,.15)] px-4 py-2 text-sm font-semibold text-[#4d7a4d]">{sug.label}</span>
                  ) : sug.href ? (
                    <a href={sug.href} className="rounded-xl bg-jq-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-jq-sage">➜ Prochaine étape : {sug.label}</a>
                  ) : (
                    <button onClick={sug.onClick} className="rounded-xl bg-jq-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-jq-sage">➜ Prochaine étape : {sug.label}</button>
                  )}
                </div>
                {!s2done && <p className="mt-2 text-[11.5px] text-shell-muted">L&apos;évaluation ciblée vient après l&apos;accueil/anamnèse : elle sert à choisir les questionnaires pertinents, jamais à poser un diagnostic.</p>}
                {s2done && !s3done && <p className="mt-2 text-[11.5px] text-shell-muted">Les questionnaires sont reliés : la prochaine étape est l&apos;état des lieux et la cartographie par la praticienne.</p>}
                {s3done && !s4done && <p className="mt-2 text-[11.5px] text-shell-muted">La cartographie est prête : tu peux maintenant choisir les objectifs et consulter le référentiel pour les protocoles adaptés.</p>}
              </>
            );
          })()}
        </div>

        {/* STEPPER */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-2">
          {STEPS.map((s) => {
            const on = s.k === step;
            const done = s.n < c.etape;
            return (
              <button
                key={s.k}
                onClick={() => goToStep(s.k)}
                aria-disabled={s.n >= 3 && !readiness.canEvaluate}
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
              <SaveBar dirty={dirty} msg={savedMsg} onSave={() => persistFields({ intention: c.intention, rdv: c.rdv, consentement: c.consentement })} />
              <Callout>Aucun diagnostic. L'accompagnement complète, sans les remplacer, le suivi médical et l'avis d'un professionnel de santé.</Callout>
            </Panel>
          )}

          {step === "bilan" && (
            <Panel
              title={islamic ? "Anamnèse psycho-spirituelle" : "Anamnèse universelle"}
              lead={`Le recueil complet — ${visibleAnamnese.length} sections adaptées au mode choisi. Tout s'enregistre dans la fiche (CR). N'oublie pas « Enregistrer » en bas.`}
            >
              <AnaAlertBanner anamnese={c.bilan.anamnese} />
              <div className="mb-4 rounded-2xl border border-[#d8a3a8] bg-[rgba(169,75,84,.06)] p-3.5 text-[13px] text-shell-muted">
                <b className="text-[#a94b54]">Sécurité :</b> en cas de danger immédiat ou d&apos;idées suicidaires actuelles, interrompre le questionnaire et appliquer le protocole d&apos;urgence ou d&apos;orientation adapté.
              </div>
              <div className="flex flex-col gap-4">
                {visibleAnamnese.map((sec, sectionIndex) => (
                  <section key={sec.key} className="rounded-2xl border border-shell-border bg-shell-soft p-4">
                    <h3 className="mb-3 font-serif text-lg font-semibold text-jq-deep">{anamneseSectionTitle(sec, sectionIndex, islamic)}</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {sec.fields.map((f) => (
                        <AnaFieldInput key={f.key} f={f} v={anaValue(f.key)} islamic={islamic} onChange={(val) => editAnamnese(f.key, val)} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <SrcaPanel state={c.bilan.srca} readiness={readiness} onChange={editSrca} />

              <SaveBar dirty={dirty} msg={savedMsg} onSave={() => persistFields({ bilan: c.bilan })} />
              <AnamneseNextStep anamnese={c.bilan.anamnese} clientId={c.id} unlocked={readiness.canEvaluate} />
              <Callout>Aucun diagnostic. L&apos;anamnèse et les questionnaires sont des <b>repères de dialogue</b> — les alertes priment toujours sur le score.</Callout>
            </Panel>
          )}

          {step === "evaluer" && (
            <Panel title="Évaluer — questionnaires et décodeurs ciblés" lead="À partir de l'accueil/anamnèse, choisis seulement les outils utiles à la demande. Les résultats sont des repères de dialogue, jamais un diagnostic.">
              <div className="grid gap-3 sm:grid-cols-2">
                <a href={`/questionnaires?client=${encodeURIComponent(c.id)}`} className="rounded-2xl border border-jq-sage/50 bg-[rgba(124,139,108,.07)] p-4 transition hover:border-gold">
                  <div className="text-sm font-bold text-jq-deep">Questionnaires ciblés</div>
                  <p className="mt-1 text-[13px] text-shell-muted">Psychotrauma, émotions/TCC, psycho-spiritualité ou autre axe pertinent.</p>
                </a>
                <a href="https://decodeur-profil-educa-typique.netlify.app/" target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-shell-border bg-shell-soft p-4 transition hover:border-gold">
                  <div className="text-sm font-bold text-jq-deep">Décodeur neuroatypie ↗️</div>
                  <p className="mt-1 text-[13px] text-shell-muted">À utiliser uniquement lorsqu'un axe neurodéveloppemental ou fonctionnel est pertinent.</p>
                </a>
              </div>
              <div className="mt-3 rounded-2xl border border-shell-border bg-shell-soft p-4">
                <div className="text-sm font-bold text-jq-deep">Décodeur clinique et synthèse</div>
                <p className="mt-1 text-[13px] text-shell-muted">À consulter après les résultats pertinents, pour relire l'ensemble avant de formuler la cartographie. Les données sensibles ne doivent être transmises à aucun service externe sans validation de confidentialité.</p>
                <a href="https://shifa-decodeur-voie-chifa-cr.netlify.app/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-xl border border-shell-border px-4 py-2 text-sm font-semibold text-jq-deep">Ouvrir le décodeur clinique ↗️</a>
              </div>
              <QuestionnaireResultsPanel responses={responses} live={live} />
            </Panel>
          )}

          {step === "formuler" && (
            <Panel title="Formuler — état des lieux et cartographie" lead="Relis les éléments recueillis, cartographie les difficultés et ressources, puis formule des hypothèses de travail prudentes. Cette étape relève de la praticienne.">
              <EditField k="État des lieux" v={c.bilan.etatDesLieux ?? ""} placeholder="Demande, contexte, difficultés, ressources, facteurs de protection et questions ouvertes…" onChange={(val) => editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, etatDesLieux: val } }))} />
              <div className="mt-3.5"><EditField k="Cartographie" v={c.bilan.cartographie ?? ""} placeholder="Émotionnel · relationnel/familial · fonctionnel si pertinent · repères culturels/interculturels · sens/spiritualité si choisi · orientations…" onChange={(val) => editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, cartographie: val } }))} /></div>
              <div className="mt-3.5"><EditField k="Hypothèses de travail à vérifier et prioriser" v={c.bilan.hypotheses ?? ""} placeholder="Formuler comme des pistes : « les éléments recueillis invitent à explorer… »" onChange={(val) => editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, hypotheses: val } }))} /></div>
              <SaveBar dirty={dirty} msg={savedMsg} onSave={() => persistFields({ bilan: c.bilan })} />
              <Callout>Les repères culturels, familiaux, linguistiques, spirituels ou sociaux sont explorés à partir de ce que la personne choisit de partager ; ils ne sont jamais présumés.</Callout>
            </Panel>
          )}

          {step === "cibler" && (
            <Panel title="Cibler — objectifs, référentiel et protocoles" lead="À partir des hypothèses validées, choisir l'axe prioritaire, l'objectif concret, les outils ou protocoles adaptés, et les précautions nécessaires.">
              <EditField k="Objectifs et plan proposé" v={c.bilan.objectifs ?? ""} placeholder="Axe prioritaire · objectif concret · outil/protocole envisagé · rythme · indicateur · vigilance/orientation…" onChange={(val) => editClient((cl) => ({ ...cl, bilan: { ...cl.bilan, objectifs: val } }))} />
              <SaveBar dirty={dirty} msg={savedMsg} onSave={() => persistFields({ bilan: c.bilan })} />
              <ProtocolePanel responses={responses} live={live} />
              {islamic && <a href="https://referentielshifa-complet-voiechifa.netlify.app/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">Consulter le Référentiel Jannat al Qulûb ↗️</a>}
              <Callout>Une suggestion d'outil ou de protocole reste toujours à valider, adapter ou écarter par la praticienne.</Callout>
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
              <Label>Événement à consigner</Label>
              <div className="flex flex-wrap gap-1.5">
                {([
                  ["seance", "Séance réalisée"],
                  ["annulation", "Rendez-vous annulé"],
                  ["absence", "Absence / sans nouvelle"],
                ] as const).map(([kind, label]) => (
                  <button key={kind} onClick={() => setSessionKind(kind)} className={"rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition " + (sessionKind === kind ? "border-gold bg-shell-soft text-shell-text" : "border-shell-border bg-shell-surface text-shell-muted")}>{label}</button>
                ))}
              </div>
              {sessionKind === "seance" && <>
                <Label>Météo émotionnelle</Label>
                <div className="flex flex-wrap gap-1.5">
                  {METEO_KEYS.map((k) => (
                    <button key={k} onClick={() => setMPick(k)} className={"rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition " + (mPick === k ? "border-gold bg-shell-soft text-shell-text" : "border-shell-border bg-shell-surface text-shell-muted")}>{METEO[k].label}</button>
                  ))}
                </div>
              </>}
              <Label>{sessionKind === "seance" ? "Notes de séance" : "Observation ou tentative de contact (facultatif)"}</Label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Ce qui s'est dit, observé…" className="w-full rounded-xl border border-shell-border bg-shell-surface p-2.5 text-sm outline-none focus:border-gold" />
              <Label>{sessionKind === "seance" ? "Axe de travail" : "Décision ou prochaine action (facultatif)"}</Label>
              <input value={axes} onChange={(e) => setAxes(e.target.value)} placeholder={sessionKind === "seance" ? "Le prochain petit pas…" : "Ex. relance à prévoir / rappel du cadre si nécessaire"} className="w-full rounded-xl border border-shell-border bg-shell-surface p-2.5 text-sm outline-none focus:border-gold" />
              <div className="mt-4 flex items-center gap-3">
                <button onClick={addSeance} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">+ Enregistrer la séance</button>
                {savedMsg && <span className={"text-[13px] font-semibold " + (savedMsg.startsWith("⚠️") ? "text-[#a94b54]" : "text-[#4d7a4d]")}>{savedMsg}</span>}
              </div>
            </Panel>
          )}

          {step === "outils" && (
            <Panel title="Bibliothèque d'outils" lead="Protocoles, workbooks, ancrages — assignables. Les ressources spirituelles portent leur statut de validation et n'apparaissent qu'en mode islamique.">
              {LIBRARY.filter((t) => t.type !== "spir" || (islamic && verifiedReligiousContent([t]).length === 1)).map((t) => (
                <div key={t.nm} className="mb-2.5 flex items-start gap-3 rounded-2xl border border-shell-border bg-shell-surface p-3.5">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-shell-soft text-gold">✦</span>
                  <div>
                    <div className="text-sm font-bold">{t.nm}</div>
                    <div className="text-[12.5px] text-shell-muted">{t.ds}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className={"rounded-md px-2 py-0.5 text-[10.5px] font-extrabold uppercase " + (t.type === "clin" ? "bg-[rgba(94,127,140,.15)] text-[#5e7f8c]" : "bg-[rgba(195,135,60,.16)] text-gold-dark")}>{t.type === "clin" ? "Clinique" : "Spirituel"}</span>
                      {t.relig && <span className="rounded-md border border-gold bg-[rgba(91,138,91,.14)] px-2 py-0.5 text-[10.5px] font-extrabold uppercase text-[#4d7a4d]">Vérifié · {t.reference}</span>}
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

              <Label>Questionnaires reliés à cette fiche</Label>
              {responses.length === 0 ? (
                <p className="text-sm text-shell-muted">
                  Aucun questionnaire relié pour l'instant. Depuis l'onglet <b>Questionnaires</b>, remplis-en un puis clique « Relier à la fiche client ».
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {responses.map((r) => {
                    const info = evaluateStored(r.questionnaireId, r.answers);
                    const hasRed = info?.alerts.some((a) => a.level === "rouge");
                    const hasAlert = (info?.alerts.length ?? 0) > 0;
                    return (
                      <div
                        key={r.id}
                        className={"rounded-xl border bg-shell-soft p-3.5 " + (hasRed ? "border-[#a94b54]" : hasAlert ? "border-[#C08A2E]" : "border-shell-border")}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-bold text-shell-text">{info?.titre ?? r.questionnaireId}</span>
                          <span className="text-[12px] text-shell-muted">{r.date} · score {r.score}/{r.scoreMax}</span>
                        </div>
                        {info && (
                          <div className="mt-1.5 text-[13px] text-shell-muted">
                            <b className="text-jq-deep">{info.band.titre}</b> — {info.band.texte}
                          </div>
                        )}
                        {info?.alerts.map((a, i) => (
                          <div
                            key={i}
                            className={"mt-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold " + (a.level === "rouge" ? "bg-[rgba(169,75,84,.12)] text-[#a94b54]" : "bg-[rgba(192,138,46,.12)] text-[#8a6a1e]")}
                          >
                            {a.level === "rouge" ? "🚨 " : "⚠️ "}
                            {a.titre}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              <Callout>Un rappel doux sera proposé à J-1 du prochain RDV — jamais envoyé sans ton feu vert.</Callout>
            </Panel>
          )}

          {step === "cloture" && (
            <CloturePanel c={c} practitionerName={practitionerName} onEdit={editCloture} onSave={saveClotureDraft} onValidate={validateCloture} msg={savedMsg} />
          )}

          {step === "cr" && <CRPanel c={c} islamic={islamic} responses={responses} live={live} />}
        </div>
      </main>
    </div>
  );
}

/* ---------- sous-composants ---------- */
function SrcaPanel({ state, readiness, onChange }: { state: Client["bilan"]["srca"]; readiness: ReturnType<typeof srcaReadiness>; onChange: (key: SrcaCriterion | "conduiteTenirEffectuee", value: boolean) => void }) {
  const s = state ?? EMPTY_SRCA;
  const criteria: { key: SrcaCriterion; title: string; question: string; action: string }[] = [
    { key: "securite", title: "Sécurité", question: "Aucun danger actuel non traité — violence, emprise, urgence médicale, mariage forcé ou risque suicidaire actif.", action: "En cas d’alerte, effectuer la conduite à tenir et organiser le relais avant toute réévaluation." },
    { key: "regulation", title: "Régulation", question: "Au moins un outil d’apaisement a déjà produit un effet, même minime.", action: "Stabiliser et différer les questionnaires scorés si nécessaire." },
    { key: "continuite", title: "Continuité", question: "La personne peut participer suffisamment continûment, sans dissociation manifeste ni effondrement interrompant l’échange.", action: "Revenir à l’ancrage si la continuité devient insuffisante." },
    { key: "alliance", title: "Alliance", question: "Elle comprend le cadre, adhère librement et n’est pas là sous la contrainte d’un tiers.", action: "Clarifier le cadre, le consentement et le droit de ne pas répondre." },
  ];
  return <section className="mt-4 rounded-2xl border border-jq-sage/50 bg-[rgba(124,139,108,.07)] p-4" aria-labelledby="srca-title">
    <h3 id="srca-title" className="font-serif text-lg font-semibold text-jq-deep">Verrou S·R·C·A avant Évaluer</h3>
    {readiness.redAlert && <label className="mt-3 flex gap-2 rounded-xl border border-[#a94b54] bg-shell-surface p-3 text-[13px] font-semibold text-[#a94b54]"><input type="checkbox" checked={s.conduiteTenirEffectuee} onChange={(e) => onChange("conduiteTenirEffectuee", e.target.checked)} />Conduite à tenir effectuée et relais organisé</label>}
    <div className="mt-3 grid gap-2 sm:grid-cols-2">{criteria.map((item) => {
      const disabled = item.key === "securite" && !readiness.safetyCanBeAssessed;
      return <label key={item.key} className="rounded-xl border border-shell-border bg-shell-surface p-3 text-[13px]">
        <span className="flex gap-2 font-bold text-jq-deep"><input type="checkbox" checked={s[item.key]} disabled={disabled} onChange={(e) => onChange(item.key, e.target.checked)} />{item.title}</span>
        <span className="mt-1 block text-shell-text">{item.question}</span><span className="mt-1 block text-[12px] text-shell-muted">{item.action}</span>
      </label>;
    })}</div>
    <p className={"mt-3 text-sm font-semibold " + (readiness.canEvaluate ? "text-[#4d7a4d]" : "text-[#a94b54]")}>{readiness.canEvaluate ? "✔ Les quatre critères sont validés : Évaluer est accessible." : "🔒 Évaluer reste inaccessible."}</p>
  </section>;
}

function CloturePanel({ c, practitionerName, onEdit, onSave, onValidate, msg }: { c: Client; practitionerName: string; onEdit: (fn: (b: BilanCloture) => BilanCloture) => void; onSave: () => void; onValidate: () => void; msg: string }) {
  const b = c.bilanCloture;
  if (!b) return <Panel title="Clôture" lead="Bilan clinique structuré, distinct du bilan courant et figé après validation."><Field k="Demande initiale" v={c.intention || c.bilan.anamnese?.s1_motif || "—"} /><button onClick={() => onEdit((draft) => draft)} className="mt-4 rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">Commencer le bilan de clôture</button></Panel>;
  const locked = Boolean(b.praticienneValidation.valideAt);
  const setList = (key: "ressourcesMobilisees" | "outilsConserves", value: string) => onEdit((x) => ({ ...x, [key]: value.split(/\r?\n/).map((v) => v.trim()).filter(Boolean) }));
  const attained = b.objectifs.filter((o) => o.statut === "atteint");
  const ongoing = b.objectifs.filter((o) => o.statut !== "atteint");
  return <Panel title="Clôture" lead="Bilan clinique structuré, distinct de Restituer et du bilan clinique courant.">
    {locked && <div className="mb-4 rounded-xl border border-[rgba(91,138,91,.4)] bg-[rgba(91,138,91,.10)] p-3 text-sm font-semibold text-[#4d7a4d]">🔒 Validé par {b.praticienneValidation.nom} le {new Date(b.praticienneValidation.valideAt).toLocaleString("fr-FR")} — bilan non modifiable.</div>}
    <Label>Demande initiale (lecture seule)</Label><textarea readOnly value={b.demandeInitiale} rows={3} className="w-full rounded-xl border border-shell-border bg-shell-soft p-2.5 text-sm" />
    <Label>Objectifs du parcours</Label>
    <div className="space-y-2">{b.objectifs.map((o) => <div key={o.id} className="grid gap-2 sm:grid-cols-[1fr_210px]"><input disabled={locked} value={o.texte} onChange={(e) => onEdit((x) => ({ ...x, objectifs: x.objectifs.map((v) => v.id === o.id ? { ...v, texte: e.target.value } : v) }))} className="rounded-xl border border-shell-border bg-shell-surface p-2.5 text-sm" /><select disabled={locked} value={o.statut} onChange={(e) => onEdit((x) => ({ ...x, objectifs: x.objectifs.map((v) => v.id === o.id ? { ...v, statut: e.target.value as typeof v.statut } : v) }))} className="rounded-xl border border-shell-border bg-shell-surface p-2.5 text-sm"><option value="atteint">Atteint</option><option value="partiellement_atteint">Partiellement atteint</option><option value="non_atteint">Non atteint</option></select></div>)}</div>
    {!locked && <button onClick={() => onEdit((x) => ({ ...x, objectifs: [...x.objectifs, { id: crypto.randomUUID(), texte: "", statut: "partiellement_atteint" }] }))} className="mt-2 rounded-lg border border-shell-border px-3 py-1.5 text-sm font-semibold">+ Ajouter un objectif</button>}
    <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field k="Objectifs atteints" v={attained.map((o) => o.texte).filter(Boolean).join(" · ") || "—"} /><Field k="En cours / à poursuivre" v={ongoing.map((o) => o.texte).filter(Boolean).join(" · ") || "—"} /></div>
    <div className="grid gap-3 sm:grid-cols-2"><div><Label>Ressources mobilisées (une par ligne)</Label><textarea disabled={locked} value={b.ressourcesMobilisees.join("\n")} onChange={(e) => setList("ressourcesMobilisees", e.target.value)} rows={4} className="w-full rounded-xl border border-shell-border p-2.5 text-sm" /></div><div><Label>Outils conservés (un par ligne)</Label><textarea disabled={locked} value={b.outilsConserves.join("\n")} onChange={(e) => setList("outilsConserves", e.target.value)} rows={4} className="w-full rounded-xl border border-shell-border p-2.5 text-sm" /></div></div>
    <Label>Autonomie et relais</Label><textarea disabled={locked} value={b.autonomieRelais.notes} onChange={(e) => onEdit((x) => ({ ...x, autonomieRelais: { ...x.autonomieRelais, notes: e.target.value } }))} rows={3} className="w-full rounded-xl border border-shell-border p-2.5 text-sm" /><label className="mt-2 flex gap-2 text-sm"><input disabled={locked} type="checkbox" checked={b.autonomieRelais.relaisNecessaire} onChange={(e) => onEdit((x) => ({ ...x, autonomieRelais: { ...x.autonomieRelais, relaisNecessaire: e.target.checked } }))} />Relais nécessaire</label>
    <Label>Réorientation nécessaire</Label><label className="flex gap-2 text-sm"><input disabled={locked} type="checkbox" checked={b.reorientation.necessaire} onChange={(e) => onEdit((x) => ({ ...x, reorientation: { ...x.reorientation, necessaire: e.target.checked } }))} />Oui</label>{b.reorientation.necessaire && <textarea disabled={locked} aria-label="Détail de la réorientation" value={b.reorientation.details} onChange={(e) => onEdit((x) => ({ ...x, reorientation: { ...x.reorientation, details: e.target.value } }))} rows={2} placeholder="Professionnel ou dispositif" className="mt-2 w-full rounded-xl border border-shell-border p-2.5 text-sm" />}
    <details className="mt-4 rounded-xl border border-shell-border bg-shell-soft p-3"><summary className="cursor-pointer font-bold text-jq-deep">Prévisualiser la synthèse de clôture</summary><div className="mt-3 whitespace-pre-wrap text-sm">{`Demande initiale : ${b.demandeInitiale}\n\nObjectifs atteints : ${attained.map((o) => o.texte).join(" · ") || "—"}\nObjectifs en cours / à poursuivre : ${ongoing.map((o) => o.texte).join(" · ") || "—"}\nRessources mobilisées : ${b.ressourcesMobilisees.join(" · ") || "—"}\nOutils conservés : ${b.outilsConserves.join(" · ") || "—"}\nAutonomie et relais : ${b.autonomieRelais.notes || "—"}\nRéorientation : ${b.reorientation.necessaire ? b.reorientation.details : "Non"}`}</div></details>
    {!locked && <div className="mt-4 flex flex-wrap gap-2"><button onClick={onSave} className="rounded-xl border border-jq-deep px-4 py-2.5 text-sm font-semibold text-jq-deep">Enregistrer le brouillon</button><button onClick={onValidate} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">Valider et clôturer le dossier</button></div>}
    {!locked && <p className="mt-2 text-xs text-shell-muted">La validation utilisera l’identité authentifiée « {practitionerName} » et horodatera automatiquement la clôture.</p>}{msg && <p className="mt-2 text-sm font-semibold">{msg}</p>}
  </Panel>;
}

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
  const id = useId();
  return (
    <div className="rounded-2xl border border-shell-border bg-shell-soft p-3.5">
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-shell-muted">{k}</label>
      <textarea
        id={id}
        value={v}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-shell-border bg-shell-surface p-2 text-sm outline-none focus:border-gold"
      />
    </div>
  );
}
function SaveBar({ onSave, msg, dirty }: { onSave: () => void; msg: string; dirty: boolean }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <button onClick={onSave} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">💾 Enregistrer</button>
      {dirty && <span className="text-[13px] font-semibold text-gold-dark">Modifications non enregistrées</span>}
      {msg && <span className={"text-[13px] font-semibold " + (msg.startsWith("⚠️") ? "text-[#a94b54]" : "text-[#4d7a4d]")}>{msg}</span>}
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 mt-3 block text-[11px] font-bold uppercase tracking-wide text-shell-muted">{children}</label>;
}
// Bannière d'alertes de l'anamnèse (suicide §3, qunūṭ §9) — visible en haut de l'onglet + de la fiche.
function AnaAlertBanner({ anamnese }: { anamnese?: Record<string, string> }) {
  const alerts = anamneseAlerts(anamnese);
  if (!alerts.length) return null;
  return (
    <div role="alert" aria-live="assertive" className="mb-4 rounded-2xl border border-[#a94b54] bg-[rgba(169,75,84,.08)] p-3.5">
      {alerts.map((a, i) => (
        <div key={i} className="text-[13px] font-semibold text-[#a94b54]">🚨 {a.titre} — {a.message}</div>
      ))}
      <details className="mt-2 text-[12.5px] text-shell-text">
        <summary className="cursor-pointer font-bold">Aide contextuelle — points à évaluer</summary>
        <p className="mt-1">Idées actuelles, intention, scénario, moyen envisagé et accessibilité, échéance, gestes préparatoires, antécédents, facteurs de protection et entourage disponible. Le 3919 n’est pas un numéro d’urgence. L’évaluation clinique relève de professionnels formés ; l’application ne remplace ni la formation ni l’évaluation spécialisée. Ne promets pas une confidentialité absolue lorsque la sécurité impose de mobiliser des secours ou un tiers.</p>
      </details>
    </div>
  );
}
// Un champ d'anamnèse rendu selon son type (texte, zone longue, boutons, échelle 0-10).
function AnaFieldInput({ f, v, islamic, onChange }: { f: AnaField; v: string; islamic: boolean; onChange: (val: string) => void }) {
  const full = f.type === "long" || f.type === "scale" || (f.type === "choice" && (f.options?.length ?? 0) > 3);
  const label = (f.danger ? "🚨 " : f.star && islamic ? "⭐ " : "") + anamneseFieldLabel(f, islamic);
  const inputId = `ana-${f.key}`;
  return (
    <div className={"rounded-2xl border p-3.5 " + (full ? "sm:col-span-2 " : "") + (f.danger ? "border-[#d8a3a8] bg-shell-surface" : "border-shell-border bg-shell-surface")}>
      {f.type === "long" && (
        <>
          <label htmlFor={inputId} className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-shell-muted">{label}</label>
          <textarea id={inputId} value={v} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full resize-y rounded-lg border border-shell-border bg-shell-soft p-2 text-sm outline-none focus:border-gold" />
        </>
      )}
      {f.type === "text" && (
        <>
          <label htmlFor={inputId} className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-shell-muted">{label}</label>
          <input id={inputId} value={v} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-shell-border bg-shell-soft p-2 text-sm outline-none focus:border-gold" />
        </>
      )}
      {f.type === "choice" && (
        <fieldset>
          <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-shell-muted">{label}</legend>
          <div className="flex flex-wrap gap-1.5">
            {(f.options ?? []).map((opt) => {
              const on = v === opt;
              const danger = Boolean(f.danger) && on && opt !== (f.options ?? [])[0];
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onChange(on ? "" : opt)}
                  className={"rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition " + (danger ? "border-[#a94b54] bg-[rgba(169,75,84,.14)] text-[#a94b54]" : on ? "border-jq-deep bg-jq-deep text-white" : "border-shell-border bg-shell-soft text-shell-muted hover:border-gold")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      {f.type === "scale" && (
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-shell-muted">{label}</label>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="text-[11px] text-shell-muted">{f.minLabel}</span>
            <span className="font-serif text-lg font-semibold text-jq-deep">{v === "" ? "—" : v}<span className="text-[12px] text-shell-muted">/10</span></span>
            <span className="text-[11px] text-shell-muted">{f.maxLabel}</span>
          </div>
          <input id={inputId} type="range" min={0} max={10} step={1} value={v === "" ? 0 : Number(v)} onChange={(e) => onChange(e.target.value)} className="w-full accent-jq-deep" />
        </div>
      )}
    </div>
  );
}
// Pont après l'anamnèse : propose une évaluation ciblée (d'après la section 9). Jamais un diagnostic.
function AnamneseNextStep({ anamnese, clientId, unlocked }: { anamnese?: Record<string, string>; clientId: string; unlocked: boolean }) {
  const a = anamnese ?? {};
  const map: { key: string; q: string }[] = [
    { key: "s9_anxiete", q: "Anxiété / stress" },
    { key: "s9_tristesse", q: "Tristesse" },
    { key: "s9_colere", q: "Colère" },
  ];
  const sugg = map.filter((m) => Number(a[m.key] || 0) >= 6).map((m) => m.q);
  const espoir = a.s9_espoir;
  if (["Présent", "Envahissant — urgence"].includes(a.s9_qunut ?? "") || (espoir !== undefined && espoir !== "" && Number(espoir) <= 3)) sugg.push("Évaluation du désespoir et de la sécurité");
  return (
    <div className="mt-4 rounded-2xl border border-jq-sage/50 bg-[rgba(124,139,108,.07)] p-4">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-jq-sage">Prochaine étape — évaluer après l&apos;anamnèse</div>
      <p className="text-[13px] text-shell-muted">
        L&apos;anamnèse ouvre l&apos;<b>évaluation ciblée</b> — <b>jamais un diagnostic</b>. Les questionnaires utiles reviennent ensuite dans l&apos;état des lieux et la cartographie.
      </p>
      {sugg.length > 0 && (
        <p className="mt-2 text-[13px]">
          <b className="text-jq-deep">D&apos;après la section 9, à envisager :</b> {sugg.join(" · ")}
        </p>
      )}
      {unlocked ? <a href={`/questionnaires?client=${encodeURIComponent(clientId)}`} className="mt-3 inline-block rounded-xl bg-jq-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-jq-sage">➜ Évaluer avec les questionnaires ciblés</a> : <p className="mt-3 font-semibold text-[#a94b54]">🔒 Évaluer reste verrouillé jusqu’à validation des quatre critères S·R·C·A.</p>}
    </div>
  );
}

function QuestionnaireResultsPanel({ responses, live }: { responses: QResponse[]; live: boolean }) {
  const scored = responses
    .map((r) => ({ r, info: evaluateStored(r.questionnaireId, r.answers) }))
    .filter((x): x is { r: QResponse; info: NonNullable<ReturnType<typeof evaluateStored>> } => Boolean(x.info));
  return (
    <div className="mt-4 rounded-2xl border border-shell-border bg-shell-soft p-4">
      <div className="text-sm font-bold text-jq-deep">Résultats reliés à cette fiche</div>
      {!live ? (
        <p className="mt-1 text-[13px] text-shell-muted">Connecte-toi à l'espace praticienne pour relier et relire les résultats dans une fiche réelle.</p>
      ) : scored.length === 0 ? (
        <p className="mt-1 text-[13px] text-shell-muted">Aucun questionnaire relié pour l'instant. Une fois relié, son résultat apparaîtra ici avant la cartographie.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {scored.map(({ r, info }) => (
            <div key={r.id} className="rounded-xl border border-shell-border bg-shell-surface p-3">
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <b>{info.titre}</b><span className="text-shell-muted">— {info.band.titre}</span>
                {info.alerts.some((a) => a.level === "rouge") && <span className="rounded bg-[rgba(169,75,84,.14)] px-1.5 py-0.5 text-[11px] font-bold text-[#a94b54]">🚨 vigilance</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// Encart « Signaux → protocole(s) » : croise les questionnaires reliés à la fiche. Jamais un diagnostic.
function ProtocolePanel({ responses, live }: { responses: QResponse[]; live: boolean }) {
  const scored = responses
    .map((r) => ({ r, info: evaluateStored(r.questionnaireId, r.answers) }))
    .filter((x): x is { r: QResponse; info: NonNullable<ReturnType<typeof evaluateStored>> } => Boolean(x.info));
  const ranked = [...scored].sort((a, b) => b.info.ratio - a.info.ratio);
  const dominants = ranked.filter((x) => x.info.ratio >= 0.3 || x.info.alerts.some((a) => a.level === "rouge"));
  return (
    <div className="mt-4 rounded-2xl border border-gold/40 bg-[rgba(195,135,60,.07)] p-4">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gold-dark">Décodeur — signaux → protocole(s)</div>
      {!live ? (
        <p className="text-[13px] text-shell-muted">Une fois en ligne et des questionnaires reliés à cette fiche, les troubles dominants s&apos;afficheront ici pour t&apos;aider à poser le protocole.</p>
      ) : scored.length === 0 ? (
        <p className="text-[13px] text-shell-muted">Aucun questionnaire relié pour l&apos;instant. Depuis l&apos;onglet <b>Questionnaires</b>, remplis-en puis « Relier à la fiche ».</p>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            {(dominants.length ? dominants : ranked.slice(0, 2)).map(({ r, info }) => {
              const red = info.alerts.some((a) => a.level === "rouge");
              return (
                <div key={r.id} className="flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="font-bold text-shell-text">{info.titre}</span>
                  <span className="text-shell-muted">— {info.band.titre}</span>
                  {red && <span className="rounded bg-[rgba(169,75,84,.14)] px-1.5 py-0.5 text-[11px] font-bold text-[#a94b54]">🚨 alerte</span>}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[12px] italic text-shell-muted">→ À traduire en protocole(s) dans la <b>section 10</b> ci-dessus. Les alertes priment toujours sur le score.</p>
        </>
      )}
    </div>
  );
}
function Callout({ children }: { children: React.ReactNode }) {
  return <div className="mt-3.5 rounded-xl border border-shell-border bg-[rgba(94,127,140,.08)] p-3.5 text-[13px] text-shell-muted">{children}</div>;
}

// CR praticienne : rassemble anamnèse (par section) + alertes + repères spirituels + questionnaires. Copiable / imprimable.
function CRPanel({ c, islamic, responses, live }: { c: Client; islamic: boolean; responses: QResponse[]; live: boolean }) {
  const [copied, setCopied] = useState(false);
  const ana = c.bilan.anamnese;
  const modeSections = anamneseForMode(islamic);
  const filledSections = modeSections.map((sec, sectionIndex) => ({
    titre: anamneseSectionTitle(sec, sectionIndex, islamic),
    items: sec.fields.map((f) => ({ f, v: (ana?.[f.key] ?? "").trim() })).filter((x) => x.v !== ""),
  })).filter((sec) => sec.items.length);
  const anaAlerts = anamneseAlerts(ana);
  const rep = reperesSpirituels(ana);
  const repParts = islamic
    ? [rep.espoir && `espoir ${rep.espoir}/10`, rep.tawakkul && `tawakkul ${rep.tawakkul}/10`, rep.qunut && `qunūṭ « ${rep.qunut} »`].filter(Boolean) as string[]
    : [];
  const qs = responses
    .map((r) => ({ r, info: evaluateStored(r.questionnaireId, r.answers) }))
    .filter((x): x is { r: QResponse; info: NonNullable<ReturnType<typeof evaluateStored>> } => Boolean(x.info));
  const fmt = (f: AnaField, v: string) => (f.type === "scale" ? `${v}/10` : v);

  function buildText() {
    const L: string[] = [];
    L.push(`COMPTE-RENDU — ${c.nom}`);
    L.push(`Intention : ${c.intention || "—"}`);
    L.push(`Prochain RDV : ${c.rdv || "—"}`);
    L.push(`Consentement : ${c.consentement ? "recueilli" : "à recueillir"}`);
    if (anaAlerts.length) {
      L.push("");
      anaAlerts.forEach((a) => L.push(`🚨 ${a.titre} — ${a.message}`));
    }
    L.push("");
    L.push("== ANAMNÈSE ==");
    if (filledSections.length) {
      filledSections.forEach((sec) => {
        L.push(`— ${sec.titre} —`);
        sec.items.forEach(({ f, v }) => L.push(`${anamneseFieldLabel(f, islamic)} : ${fmt(f, v)}`));
        L.push("");
      });
    } else L.push("(anamnèse vide)");
    if (repParts.length) L.push(`Repères spirituels : ${repParts.join(" · ")}`);
    L.push("");
    L.push("== QUESTIONNAIRES RELIÉS ==");
    if (qs.length) qs.forEach(({ r, info }) => L.push(`- ${info.titre} : ${r.score}/${r.scoreMax} — ${info.band.titre}${info.alerts.some((a) => a.level === "rouge") ? " ⚠️ ALERTE" : ""}`));
    else L.push("(aucun questionnaire relié)");
    L.push("");
    L.push("Document confidentiel — repère de dialogue, jamais un diagnostic.");
    return L.join("\n");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(buildText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard indisponible */
    }
  }

  return (
    <Panel title="CR — compte-rendu praticienne" lead="Tout ce qui est dans la fiche, rassemblé : anamnèse + alertes + repères + questionnaires. Copie-le ou imprime-le. C'est ton « Vers CR », en natif.">
      {!live && <Callout>⚠️ Mode démonstration : connecte-toi pour que le CR reflète des données réellement enregistrées.</Callout>}
      <AnaAlertBanner anamnese={ana} />

      <div className="mb-3 flex flex-wrap gap-2.5">
        <button onClick={copy} className="rounded-xl bg-jq-deep px-4 py-2.5 text-sm font-semibold text-white">📋 Copier le compte-rendu</button>
        <button onClick={() => window.print()} className="rounded-xl border border-shell-border px-4 py-2.5 text-sm font-semibold text-shell-text">🖨 Imprimer / PDF</button>
        {copied && <span className="self-center text-[13px] font-semibold text-[#4d7a4d]">✔ Copié</span>}
      </div>

      <div className="rounded-2xl border border-shell-border p-5">
        <div className="mb-3 border-b border-shell-border pb-2">
          <div className="font-serif text-xl font-semibold text-jq-deep">{c.nom}</div>
          <div className="text-[13px] text-shell-muted">Intention : {c.intention || "—"} · RDV : {c.rdv || "—"} · {c.consentement ? "Consentement recueilli" : "Consentement à recueillir"}</div>
        </div>

        <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-shell-muted">Anamnèse</div>
        {filledSections.length ? (
          <div className="mb-3 flex flex-col gap-3">
            {filledSections.map((sec) => (
              <div key={sec.titre}>
                <div className="mb-1 text-[13px] font-bold text-jq-deep">{sec.titre}</div>
                <div className="flex flex-col gap-0.5">
                  {sec.items.map(({ f, v }) => (
                    <div key={f.key} className="text-[13px]">
                      <span className="text-shell-muted">{anamneseFieldLabel(f, islamic)} : </span>
                      <span className="whitespace-pre-wrap text-shell-text">{fmt(f, v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-3 text-sm text-shell-muted">Anamnèse vide — remplis l&apos;onglet <b>Bilan</b> puis « Enregistrer ».</p>
        )}

        {repParts.length > 0 && (
          <div className="mb-3 rounded-lg border border-gold/40 bg-[rgba(195,135,60,.06)] p-2.5 text-[13px]">
            <b className="text-gold-dark">Repères spirituels</b> — {repParts.join(" · ")}
          </div>
        )}

        <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-shell-muted">Questionnaires reliés</div>
        {qs.length ? (
          <div className="flex flex-col gap-1.5">
            {qs.map(({ r, info }) => {
              const red = info.alerts.some((a) => a.level === "rouge");
              return (
                <div key={r.id} className="flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="font-bold text-shell-text">{info.titre}</span>
                  <span className="text-shell-muted">{r.score}/{r.scoreMax} — {info.band.titre}</span>
                  {red && <span className="rounded bg-[rgba(169,75,84,.14)] px-1.5 py-0.5 text-[11px] font-bold text-[#a94b54]">🚨 alerte</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-shell-muted">Aucun questionnaire relié — onglet <b>Questionnaires</b> → « Relier à la fiche ».</p>
        )}
      </div>
      <Callout>Document confidentiel — repère de dialogue, jamais un diagnostic.{islamic && " La guérison appartient à Allāh."}</Callout>
    </Panel>
  );
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
  const verifiedDuas = verifiedReligiousContent(DUAS);
  const du = verifiedDuas[s.duaIdx] ?? verifiedDuas[0];
  return (
    <Panel title="Synthèse « Pour toi »" lead="Génération semi-automatique de la lettre post-séance à partir de tes notes. Tu relis, tu ajustes — elle n'est jamais envoyée sans ta validation.">
      <div className="mb-2 flex flex-wrap items-center gap-3 rounded-xl border border-shell-border bg-shell-soft p-3">
        {s.status === "valide" ? <Pill ok>Validée — prête à relire &amp; envoyer</Pill> : <Pill>{has ? "Brouillon — à relire" : "Pas encore générée"}</Pill>}
        <span className="flex items-center gap-1 text-[11.5px] font-bold">
          {["brouillon", "validé", "publié"].map((f, i) => (
            <span key={f} className={"rounded-full border px-2.5 py-0.5 " + ((i === 0 && s.status === "brouillon" && has) || (i === 1 && s.status === "valide") ? "border-gold bg-gold text-white" : "border-shell-border bg-shell-surface text-shell-muted")}>{f}</span>
          ))}
        </span>
        <span className="ml-auto text-[13px] text-shell-muted">{islamic ? "Format imposé · charte Jannat al Qulûb" : "Format professionnel · Les Deux Jardins"}</span>
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
            <div className="font-serif text-xl font-semibold text-jq-deep">{islamic ? "Jannat al Qulûb" : "Les Deux Jardins"}</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-shell-muted">{islamic ? "Le Jardin du cœur" : "Lettre d’accompagnement"}</div>
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
