"use client";
import { useMemo, useState } from "react";
import { APPS, STATUS_LABEL, type AppEntry, type Univers } from "@/lib/apps";
import { useMode } from "@/lib/mode";
import { labelsForMode } from "@/lib/mode-labels";

const STATUS_STYLE: Record<string, string> = {
  interne: "bg-[rgba(91,138,91,.15)] text-[#4d7a4d]",
  externe: "bg-[rgba(192,138,46,.16)] text-[#a5751f] border border-dashed border-gold",
  master: "bg-[rgba(94,127,140,.15)] text-[#5e7f8c]",
  cote: "bg-shell-soft text-shell-muted",
};

export default function AppsPage() {
  const { mode } = useMode();
  const islamic = mode === "islamique";
  const labels = labelsForMode(mode);
  const [qOnly, setQOnly] = useState(false);
  const compatibleApps = useMemo(() => APPS.filter((a) => islamic || a.univers !== "jannat"), [islamic]);
  const list = useMemo(() => (qOnly ? compatibleApps.filter((a) => a.questionnaire) : compatibleApps), [compatibleApps, qOnly]);
  const total = compatibleApps.length;
  const nbQ = compatibleApps.filter((a) => a.questionnaire).length;
  const nbExt = compatibleApps.filter((a) => a.status === "externe").length;

  const groups: { key: Univers; title: string; emoji: string }[] = [
    { key: "educa", title: labels.youthGroup, emoji: "🌱" },
    { key: "jannat", title: labels.adultGroup, emoji: "🌸" },
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="border-b border-shell-border pb-4">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.28em] text-jq-sage">Le grand rattachement</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-shell-text sm:text-5xl">Mes applications</h1>
        <p className="mt-2 max-w-[62ch] text-shell-muted">
          Toutes tes applis et questionnaires, réunis ici pour ne jamais en perdre une. On les rattache une par une :
          celles marquées « à importer » deviendront natives et hors-ligne.
        </p>
      </header>

      <div className="my-5 flex flex-wrap items-center gap-3">
        <Stat n={total} label="applis recensées" />
        <Stat n={nbExt} label="à importer (Netlify)" />
        <Stat n={nbQ} label="questionnaires" />
        <button
          onClick={() => setQOnly((v) => !v)}
          className={"ml-auto rounded-full border px-4 py-2 text-sm font-semibold transition " + (qOnly ? "border-gold bg-gold text-white" : "border-shell-border bg-shell-surface text-shell-muted hover:border-gold")}
        >
          {qOnly ? "✓ Questionnaires seuls" : "Filtrer les questionnaires"}
        </button>
      </div>

      {groups.map((g) => {
        const items = list.filter((a) => a.univers === g.key);
        if (items.length === 0) return null;
        return (
          <section key={g.key} className="mb-8">
            <h2 className="mb-3 font-round text-xl font-bold text-shell-text">
              {g.emoji} {g.title}
            </h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {items.map((a) => (
                <AppCard key={a.nom} a={a} />
              ))}
            </div>
          </section>
        );
      })}

      <footer className="mt-6 rounded-2xl border border-dashed border-shell-border bg-shell-surface p-4 text-[13px] text-shell-muted">
        <b className="text-shell-text">Garantie « rien oublié »</b> — cette page est la checklist d'intégration. Le hub ne sera « complet »
        que lorsque chaque carte « à importer » sera devenue native. Le détail : <code>_les-deux-jardins/REGISTRE-COMPLET.md</code>.
      </footer>
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <span className="rounded-xl border border-shell-border bg-shell-surface px-3.5 py-2">
      <b className="font-serif text-lg text-jq-deep">{n}</b> <span className="text-[13px] text-shell-muted">{label}</span>
    </span>
  );
}

function AppCard({ a }: { a: AppEntry }) {
  const external = a.url !== "#";
  const Tag = external ? "a" : "div";
  return (
    <Tag
      {...(external ? { href: a.url, target: "_blank", rel: "noopener" } : {})}
      className={"group flex flex-col gap-1.5 rounded-2xl border border-shell-border bg-shell-surface p-4 shadow-soft transition " + (external ? "hover:-translate-y-0.5 hover:border-gold" : "opacity-70")}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold text-shell-text">{a.nom}</span>
        {external && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 flex-none text-shell-muted group-hover:text-gold">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className={"rounded-md px-2 py-0.5 text-[10.5px] font-extrabold uppercase " + STATUS_STYLE[a.status]}>{STATUS_LABEL[a.status]}</span>
        <span className="rounded-md bg-shell-soft px-2 py-0.5 text-[10.5px] font-semibold text-shell-muted">{a.cat}</span>
        {a.questionnaire && <span className="rounded-md bg-[rgba(200,160,240,.2)] px-2 py-0.5 text-[10.5px] font-extrabold uppercase text-[#6a3f9e]">Questionnaire</span>}
        {a.praticienne && <span className="rounded-md bg-[rgba(94,127,140,.15)] px-2 py-0.5 text-[10.5px] font-extrabold uppercase text-[#5e7f8c]">Praticienne</span>}
      </div>
      {a.note && <div className="text-[11.5px] italic text-shell-muted">{a.note}</div>}
    </Tag>
  );
}
