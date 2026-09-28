"use client";
import Link from "next/link";
import { useMode } from "@/lib/mode";
import { labelsForMode } from "@/lib/mode-labels";

const PROFESSIONAL_TOOLS = [
  {
    title: "Dossiers d’accompagnement",
    desc: "Fiches, consentement, intention, rendez-vous et progression du suivi.",
    href: "/cockpit",
  },
  {
    title: "Anamnèse et formulation",
    desc: "Recueil structuré, repères cliniques, hypothèses de travail et objectifs.",
    href: "/cockpit",
  },
  {
    title: "Questionnaires ciblés",
    desc: "Repères reliés au bon dossier, sans diagnostic automatique.",
    href: "/questionnaires",
  },
  {
    title: "Séances et synthèses",
    desc: "Notes, absences, comptes rendus et lettres d’accompagnement.",
    href: "/cockpit",
  },
];

export default function Home() {
  const { mode } = useMode();
  const islamic = mode === "islamique";
  const labels = labelsForMode(mode);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <section className="pb-10 pt-6 text-center sm:pb-14">
        {islamic && (
          <p className="mb-3 font-arab text-2xl text-gold" dir="rtl">
            بِسْمِ اللَّٰهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-jq-sage">
          Application réservée aux praticiennes
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-none text-shell-text sm:text-7xl">
          Les Deux <span className="italic text-gold">Jardins</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[62ch] text-shell-muted sm:text-lg">{labels.hero}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/login" className="rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">
            Se connecter
          </Link>
          <Link href="/cockpit" className="rounded-xl border border-shell-border bg-shell-surface px-5 py-2.5 text-sm font-semibold text-jq-deep">
            Ouvrir le cockpit
          </Link>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold text-shell-text sm:text-3xl">Les publics que la praticienne accompagne</h2>
        <p className="mb-5 mt-1 max-w-[66ch] text-sm text-shell-muted">
          Ces cartes décrivent les champs de suivi. Ce ne sont pas des espaces destinés aux familles.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-shell-border border-l-4 border-l-jq-sage bg-shell-surface p-6 shadow-soft sm:p-8">
            <p className="font-serif text-xs font-semibold uppercase tracking-[0.28em] text-jq-sage">{labels.adultKicker}</p>
            {islamic && <p className="mt-1 font-arab text-2xl text-gold" dir="rtl">جنّة القلوب</p>}
            <h3 className="font-serif text-3xl font-semibold text-jq-deep sm:text-4xl">{labels.adultBrand}</h3>
            <p className="mt-1 font-serif text-lg italic text-gold-dark">{labels.adultTagline}</p>
            <p className="mt-3 text-sm text-shell-muted">{labels.adultDescription}</p>
          </article>

          <article className="rounded-2xl border border-shell-border border-t-4 border-t-et-teal bg-shell-surface p-6 shadow-soft sm:p-8">
            <p className="font-round text-xs font-semibold uppercase tracking-[0.24em] text-et-teal">{labels.youthKicker}</p>
            <h3 className="mt-1 font-round text-3xl font-bold tracking-tight text-et-teal sm:text-4xl">{labels.youthBrand}</h3>
            <p className="mt-1 font-round text-lg font-semibold text-shell-muted">{labels.youthTagline}</p>
            <p className="mt-3 text-sm text-shell-muted">{labels.youthDescription}</p>
          </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold text-shell-text sm:text-3xl">Un seul espace de travail professionnel</h2>
        <p className="mb-5 mt-1 max-w-[66ch] text-sm text-shell-muted">
          Les étapes restent reliées au dossier de l’accompagnée, de l’accueil à la restitution.
        </p>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {PROFESSIONAL_TOOLS.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="rounded-2xl border border-shell-border bg-shell-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-gold"
            >
              <h3 className="font-round text-lg font-bold text-shell-text">{tool.title}</h3>
              <p className="mt-1 text-sm text-shell-muted">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-14 border-t border-shell-border pt-6 text-center text-xs text-shell-muted">
        {islamic ? "Les Deux Jardins — accompagnement professionnel psycho-spirituel" : "Les Deux Jardins — espace professionnel"}
      </footer>
    </main>
  );
}
