"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMode } from "@/lib/mode";
import { labelsForMode } from "@/lib/mode-labels";

// Page d'un « monde » (jardin) : on y entre depuis l'accueil, elle présente le monde
// et ses hubs. Deux mondes : coeur (Jannat al Qulûb) · graines (Educa Typique).

const HUB_TITLES: Record<string, string> = {
  parents: "Parents",
  enfants: "Enfants",
  ados: "Ados",
  pro: "Professionnels",
};

type World = {
  brand: string;
  arabic?: string;
  kicker: string;
  tagline: string;
  desc: string;
  hubs: string[];
  tone: "jq" | "et";
};

const WORLDS: Record<string, World> = {
  coeur: {
    brand: "Jannat al Qulûb",
    arabic: "جنّة القلوب",
    kicker: "Le Jardin du cœur",
    tagline: "« Soigner les fleurs et les plantes »",
    desc: "Côté maman, femme, adulte — l'accompagnement psycho-spirituel, et la charte du cockpit praticienne.",
    hubs: ["pro", "parents"],
    tone: "jq",
  },
  graines: {
    brand: "Educa Typique",
    kicker: "Le Jardin des graines",
    tagline: "« Semer les petites graines »",
    desc: "Côté enfant, ado & parentalité TND — la neuropédagogie au quotidien, du plus ludique au plus posé.",
    hubs: ["enfants", "ados", "parents"],
    tone: "et",
  },
};

export default function JardinPage() {
  const params = useParams();
  const slug = String(params?.slug ?? "");
  const w = WORLDS[slug];
  const { mode } = useMode();
  const islamic = mode === "islamique";
  const labels = labelsForMode(mode);

  if (!w) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="font-serif text-2xl font-semibold text-jq-deep">Ce jardin n&apos;existe pas.</p>
        <Link href="/" className="mt-4 inline-block rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">← Retour à l&apos;accueil</Link>
      </main>
    );
  }

  const isJq = w.tone === "jq";
  const brand = isJq ? labels.adultBrand : labels.youthBrand;
  const kicker = isJq ? labels.adultKicker : labels.youthKicker;
  const tagline = isJq ? labels.adultTagline : labels.youthTagline;
  const description = isJq ? labels.adultDescription : labels.youthDescription;

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <Link href="/" className="text-sm font-semibold text-gold-dark hover:underline">← Les Deux Jardins</Link>

      <header className={"mt-4 rounded-2xl border border-shell-border bg-shell-surface p-6 shadow-soft sm:p-8 " + (isJq ? "border-l-4 border-l-jq-sage" : "border-t-4 border-t-et-teal")}>
        <p className={"font-serif text-xs font-semibold uppercase tracking-[0.28em] " + (isJq ? "text-jq-sage" : "text-et-teal")}>{kicker}</p>
        {isJq && islamic && w.arabic && <p className="mt-1 font-arab text-2xl text-gold" dir="rtl">{w.arabic}</p>}
        <h1 className={"mt-1 font-semibold sm:text-5xl " + (isJq ? "font-serif text-4xl text-jq-deep" : "font-round text-4xl tracking-tight text-et-teal")}>{brand}</h1>
        <p className={"mt-1 text-lg italic " + (isJq ? "font-serif text-gold-dark" : "font-round font-semibold text-shell-muted")}>{tagline}</p>
        <p className="mt-3 text-sm text-shell-muted">{description}</p>
      </header>

      <section className="mt-8">
        <h2 className="font-serif text-2xl font-semibold text-shell-text">{islamic ? "Entrer dans ce jardin" : "Entrer dans cet espace"}</h2>
        <p className="mb-4 mt-1 text-sm text-shell-muted">Choisis l&apos;espace qui te concerne — tout reste relié.</p>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {w.hubs.map((h) => (
            <Link
              key={h}
              href={`/hub/${h}`}
              className="rounded-2xl border border-shell-border bg-shell-surface p-5 shadow-soft transition hover:-translate-y-1 hover:border-gold"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-shell-muted">Hub</p>
              <h3 className="font-round text-lg font-bold text-shell-text">{HUB_TITLES[h] ?? h}</h3>
              <span className="mt-1 inline-block text-[13px] font-semibold text-gold-dark">Entrer →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
