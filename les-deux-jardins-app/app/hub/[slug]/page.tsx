"use client";
import Link from "next/link";
import { useMode } from "@/lib/mode";
import { HUBS, type HubItem } from "@/lib/hubs";

export default function HubPage({ params }: { params: { slug: string } }) {
  const { mode } = useMode();
  const islamic = mode === "islamique";
  const hub = HUBS[params.slug];

  if (!hub) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="font-serif text-3xl font-semibold text-jq-deep">Hub introuvable</h1>
        <Link href="/" className="mt-4 inline-block text-gold-dark hover:underline">← Retour à l'accueil</Link>
      </main>
    );
  }

  const educa = hub.univers === "educa";
  const accent = educa ? "text-et-teal" : "text-jq-deep";
  const kickColor = educa ? "text-et-teal" : "text-jq-sage";

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <Link href="/" className="text-sm font-semibold text-gold-dark hover:underline">← Les deux jardins</Link>

      <header className="mt-3 border-b border-shell-border pb-5">
        <p className={"font-round text-xs font-bold uppercase tracking-[0.2em] " + kickColor}>{hub.kicker}</p>
        <h1 className={"mt-1 font-serif text-4xl font-semibold sm:text-5xl " + accent}>{hub.titre}</h1>
        <p className="mt-2 max-w-[60ch] text-shell-muted">{islamic ? hub.taglineI : hub.taglineU}</p>
      </header>

      {hub.sections.map((sec) => {
        const items = sec.items.filter((it) => !it.mode || (it.mode === "i" ? islamic : !islamic));
        if (items.length === 0) return null;
        return (
          <section key={sec.titre} className="mt-8">
            <h2 className="mb-3 font-round text-lg font-bold text-shell-text">{sec.titre}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((it) => (
                <ItemCard key={it.nom} it={it} educa={educa} />
              ))}
            </div>
          </section>
        );
      })}

      <footer className="mt-10 rounded-2xl border border-dashed border-shell-border bg-shell-surface p-4 text-[13px] text-shell-muted">
        Aucun diagnostic. Cet espace complète, sans les remplacer, le suivi médical et l'avis d'un professionnel.
        {islamic && " La guérison appartient à Allāh."}
      </footer>
    </main>
  );
}

function ItemCard({ it, educa }: { it: HubItem; educa: boolean }) {
  const border = educa ? "border-t-et-teal" : "border-t-jq-sage";
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold text-shell-text">{it.nom}</span>
        {it.soon ? (
          <span className="rounded-md bg-shell-soft px-2 py-0.5 text-[10px] font-bold uppercase text-shell-muted">Bientôt</span>
        ) : it.externe ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 flex-none text-shell-muted"><path d="M7 17L17 7M9 7h8v8" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 flex-none text-shell-muted"><path d="M9 6l6 6-6 6" /></svg>
        )}
      </div>
      <p className="mt-1 text-[13px] text-shell-muted">{it.desc}</p>
    </>
  );
  const cls = "block rounded-2xl border border-shell-border border-t-4 bg-shell-surface p-4 shadow-soft transition " + border;

  if (it.soon || !it.href) return <div className={cls + " opacity-70"}>{inner}</div>;
  if (it.externe)
    return (
      <a href={it.href} target="_blank" rel="noopener" className={cls + " hover:-translate-y-0.5 hover:border-gold"}>
        {inner}
      </a>
    );
  return (
    <Link href={it.href} className={cls + " hover:-translate-y-0.5 hover:border-gold"}>
      {inner}
    </Link>
  );
}
