"use client";
import { useMode } from "@/lib/mode";

// Parcours praticienne SHIFĀ' — enchaîne les outils cliniques dans un ordre logique.
// Niveau 1 : parcours guidé (ordre + quand-utiliser + ouverture). Les résultats ne remontent pas
// encore dans la fiche (niveau 2, à venir). Jamais un diagnostic : des repères de dialogue.

type Etape = {
  n: number;
  emoji: string;
  titre: string;
  quand: string;
  desc: string;
  url?: string; // outil en ligne
  local?: boolean; // outil sur l'ordinateur de la praticienne
};

const ETAPES: Etape[] = [
  {
    n: 1,
    emoji: "📋",
    titre: "Anamnèse & premier contact",
    quand: "Au tout début, pour recueillir l'histoire et l'intention.",
    desc: "Portail d'anamnèses : universelle, 8 repérages, échelles cliniques, enfance/ado.",
    url: "https://anamneses-cr-voiechifa.netlify.app/",
  },
  {
    n: 2,
    emoji: "🌸",
    titre: "Bilan émotionnel (TCC)",
    quand: "Après l'anamnèse, pour situer l'état émotionnel de départ.",
    desc: "Évaluation émotionnelle initiale TCC pour adultes.",
    url: "https://bilan-emotionnel.netlify.app/",
  },
  {
    n: 3,
    emoji: "🧭",
    titre: "Évaluation psycho-spirituelle",
    quand: "Pour éclairer la dimension du cœur (nafs, qalb).",
    desc: "La Boussole de l'Âme : radar psycho-spirituel (nafs, qalb, maladies du cœur).",
    url: "https://boussole-voiechifa.netlify.app/",
  },
  {
    n: 4,
    emoji: "💜",
    titre: "Schémas & traumas",
    quand: "Quand on va plus en profondeur, une fois le lien posé.",
    desc: "28 questions sur les schémas précoces inadaptés, avec rapport PDF.",
    url: "https://schemas-traumas-voiechifa.netlify.app/",
  },
  {
    n: 5,
    emoji: "🔮",
    titre: "Décodage & synthèse",
    quand: "Pour relire l'ensemble et préparer la restitution.",
    desc: "Décodeur clinique SHIFA enrichi (analyse assistée).",
    local: true,
  },
];

const REFERENTIEL = {
  emoji: "📚",
  titre: "Référentiel SHIFĀ'",
  desc: "Le référentiel intégré de psychologie islamique — à consulter à tout moment du parcours.",
  url: "https://referentielshifa-complet-voiechifa.netlify.app/",
};

export default function ParcoursShifa() {
  const { mode } = useMode();
  const islamic = mode === "islamique";

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="border-b border-shell-border pb-4">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.28em] text-jq-sage">Parcours praticienne</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-shell-text sm:text-5xl">Parcours SHIFĀ&apos;</h1>
        {islamic && <p className="mt-1 font-arab text-lg text-gold" dir="rtl">شفاء</p>}
        <p className="mt-2 max-w-[62ch] text-shell-muted">
          Tes outils cliniques, reliés dans un ordre logique — de l&apos;accueil à la synthèse. Suis les étapes,
          ou pioche celle dont tu as besoin. <b>Jamais un diagnostic</b> : des repères de dialogue.
        </p>
      </header>

      {/* Compagnon permanent */}
      <a
        href={REFERENTIEL.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-start gap-4 rounded-2xl border border-gold/40 bg-[rgba(195,135,60,.07)] p-4 shadow-soft transition hover:border-gold sm:p-5"
      >
        <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-shell-soft text-2xl">{REFERENTIEL.emoji}</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold text-jq-deep">{REFERENTIEL.titre}</span>
            <span className="rounded-md bg-[rgba(195,135,60,.16)] px-2 py-0.5 text-[10.5px] font-extrabold uppercase text-gold-dark">Compagnon</span>
          </div>
          <p className="mt-0.5 text-[13.5px] text-shell-muted">{REFERENTIEL.desc}</p>
          <span className="mt-1 inline-block text-[12.5px] font-semibold text-gold-dark">Ouvrir le référentiel ↗</span>
        </div>
      </a>

      {/* Les étapes */}
      <div className="mt-7 flex flex-col gap-3.5">
        {ETAPES.map((e, i) => (
          <div key={e.n} className="relative">
            {i < ETAPES.length - 1 && <span className="absolute left-[27px] top-[58px] h-[calc(100%-24px)] w-px bg-shell-border" aria-hidden />}
            <div className="flex items-start gap-4 rounded-2xl border border-shell-border bg-shell-surface p-4 shadow-soft sm:p-5">
              <span className="grid h-[54px] w-[54px] flex-none place-items-center rounded-full bg-gradient-to-br from-jq-sage to-jq-deep font-serif text-lg font-bold text-white">
                {e.n}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl">{e.emoji}</span>
                  <h2 className="font-serif text-xl font-semibold text-jq-deep">{e.titre}</h2>
                </div>
                <p className="mt-0.5 text-[12.5px] font-semibold uppercase tracking-wide text-jq-sage">{e.quand}</p>
                <p className="mt-1 text-sm text-shell-muted">{e.desc}</p>
                <div className="mt-3">
                  {e.url ? (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-jq-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-jq-sage"
                    >
                      Ouvrir l&apos;outil ↗
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-shell-border px-4 py-2 text-[13px] font-semibold text-shell-muted">
                      💻 Outil local — s&apos;ouvre sur ton ordinateur
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-shell-border bg-[rgba(94,127,140,.08)] p-3.5 text-[13px] text-shell-muted">
        Ces outils ouvrent chacun dans un nouvel onglet. Pour l&apos;instant, leurs résultats ne remontent pas
        automatiquement dans la fiche de l&apos;accompagnée (intégration à venir). L&apos;ensemble reste un{" "}
        <b>repère de dialogue</b>, jamais un diagnostic.{islamic && " La guérison appartient à Allāh."}
      </div>
    </main>
  );
}
