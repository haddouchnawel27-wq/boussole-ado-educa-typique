"use client";
import { ModeToggle } from "@/components/ModeToggle";
import { useMode } from "@/lib/mode";

const HUBS = [
  { title: "Parents", kicker: "Hub", desc: "Guides, workbooks, Parcours Clarté TND, charge mentale.", accent: "border-t-et-teal" },
  { title: "Enfants", kicker: "Hub", desc: "Émotions, histoires, jeux & routines (3·5·12).", accent: "border-t-et-magenta" },
  { title: "Ados", kicker: "Hub", desc: "Attention, sommeil, estime de soi, protection numérique.", accent: "border-t-et-lavender" },
  { title: "Professionnels", kicker: "Hub", desc: "Cockpit praticienne, protocoles, workbooks assignables.", accent: "border-t-gold" },
];

export default function Home() {
  const { mode } = useMode();
  const islamic = mode === "islamique";

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      {/* top bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-shell-border pb-4">
        <span className="font-serif text-sm font-semibold uppercase tracking-[0.4em] text-jq-sage">
          Les&nbsp;·&nbsp;Deux&nbsp;·&nbsp;Jardins
        </span>
        <ModeToggle />
      </header>

      {/* hero */}
      <section className="py-10 text-center sm:py-14">
        {islamic && (
          <p className="mb-3 font-arab text-2xl text-gold" dir="rtl">
            بِسْمِ اللَّٰهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
        <h1 className="font-serif text-5xl font-semibold leading-none text-shell-text sm:text-7xl">
          Les Deux <span className="italic text-gold">Jardins</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[56ch] text-shell-muted sm:text-lg">
          {islamic
            ? "Un même soin qui relie la maman, l'enfant, l'ado et le·la professionnel·le — porté par la sakīna, la baraka et le respect de la fiṭra."
            : "Un même soin qui relie la maman, l'enfant, l'ado et le·la professionnel·le — fondé sur les preuves, apaisant, pensé pour les esprits fatigués et atypiques."}
        </p>
      </section>

      {/* two gardens */}
      <section className="grid gap-5 sm:grid-cols-2">
        <article className="rounded-2xl border border-shell-border border-l-4 border-l-jq-sage bg-shell-surface p-6 shadow-soft sm:p-8">
          <p className="font-serif text-xs font-semibold uppercase tracking-[0.28em] text-jq-sage">Le Jardin du cœur</p>
          <p className="mt-1 font-arab text-2xl text-gold" dir="rtl">جنّة القلوب</p>
          <h2 className="font-serif text-3xl font-semibold text-jq-deep sm:text-4xl">Jannat al Qulûb</h2>
          <p className="mt-1 font-serif text-lg italic text-gold-dark">« Soigner les fleurs et les plantes »</p>
          <p className="mt-3 text-sm text-shell-muted">
            Côté maman, femme, adulte — l'accompagnement {islamic ? "psycho-spirituel" : "psychologique"}. Charte du cockpit praticienne.
          </p>
        </article>

        <article className="rounded-2xl border border-shell-border border-t-4 border-t-et-teal bg-shell-surface p-6 shadow-soft sm:p-8">
          <p className="font-round text-xs font-semibold uppercase tracking-[0.24em] text-et-teal">Le Jardin des graines</p>
          <h2 className="mt-1 font-round text-3xl font-bold tracking-tight text-et-teal sm:text-4xl">Educa Typique</h2>
          <p className="mt-1 font-round text-lg font-semibold text-shell-muted">« Semer les petites graines »</p>
          <p className="mt-3 text-sm text-shell-muted">
            Côté enfant, ado & parentalité TND — la neuropédagogie au quotidien, du plus ludique au plus posé.
          </p>
        </article>
      </section>

      {/* hubs */}
      <section className="mt-12">
        <h3 className="font-serif text-2xl font-semibold text-shell-text sm:text-3xl">Quatre hubs, un seul soin</h3>
        <p className="mb-5 mt-1 max-w-[60ch] text-sm text-shell-muted">
          Une même personne circule d'un espace à l'autre. Le cockpit relie tout le parcours, de l'accueil à la clôture.
        </p>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {HUBS.map((h) => (
            <div key={h.title} className={`rounded-2xl border border-shell-border ${h.accent} border-t-4 bg-shell-surface p-5 shadow-soft`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-shell-muted">{h.kicker}</p>
              <h4 className="font-round text-lg font-bold text-shell-text">{h.title}</h4>
              <p className="mt-1 text-sm text-shell-muted">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-14 border-t border-shell-border pt-6 text-center text-xs text-shell-muted">
        Les Deux Jardins — Jannat al Qulûb & Educa Typique · socle Jalon 0 (build réel)
      </footer>
    </main>
  );
}
