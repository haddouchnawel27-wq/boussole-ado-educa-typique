"use client";

// Le Jardin : chaque jour cultivé ajoute une pousse. Des jalons doux
// jalonnent le chemin — jamais une performance, seulement un reflet.

const SLOTS = [
  { l: "14%", b: "8%", s: 34 },
  { l: "32%", b: "17%", s: 42 },
  { l: "50%", b: "10%", s: 50 },
  { l: "68%", b: "18%", s: 40 },
  { l: "84%", b: "9%", s: 34 },
  { l: "24%", b: "30%", s: 28 },
  { l: "60%", b: "32%", s: 30 },
  { l: "44%", b: "34%", s: 26 },
];
const BLOOM = ["🌿", "🌷", "🌱", "🌼", "🌸", "🪴", "🌾", "🌷"];

const JALONS = [
  { days: 3, emoji: "🌱", label: "Première pousse", sub: "3 jours · la graine est plantée" },
  { days: 7, emoji: "🌿", label: "La constance", sub: "7 jours · une racine se forme" },
  { days: 21, emoji: "🌷", label: "Une habitude fleurit", sub: "21 jours · la première fleur" },
  { days: 40, emoji: "🌼", label: "Le jardin s'ouvre", sub: "40 jours · plusieurs floraisons" },
  { days: 100, emoji: "🌸", label: "Pleine floraison", sub: "100 jours · ton jardin rayonne" },
];

export function Jardin({ count, demo }: { count: number; demo: boolean }) {
  // nombre de plantes visibles : croît avec les jours cultivés (max 8)
  const nbPlantes = Math.max(0, Math.min(SLOTS.length, count));
  const prochain = JALONS.find((j) => count < j.days);

  return (
    <div className="amz-garden">
      <div className="amz-garden-scene" role="img" aria-label={`Ton jardin : ${count} ${count > 1 ? "jours cultivés" : "jour cultivé"}`}>
        <div className="amz-garden-sky" aria-hidden="true" />
        <div className="amz-garden-mound" aria-hidden="true">
          {SLOTS.slice(0, nbPlantes).map((s, i) => (
            <span key={i} className="amz-garden-plant" style={{ left: s.l, bottom: s.b, fontSize: s.s }}>
              {BLOOM[i % BLOOM.length]}
            </span>
          ))}
          {nbPlantes === 0 && <span className="amz-garden-seedhint">la terre attend ta première graine</span>}
        </div>
      </div>

      <p className="amz-garden-cap">
        {count > 0 ? (
          <>
            <strong>{count}</strong> {count > 1 ? "jours cultivés" : "jour cultivé"}
            {demo && <span className="amz-tag">exemple</span>} · chaque jour t'ajoute une pousse
          </>
        ) : (
          <>Ton jardin est prêt. Ton premier point du jour y plantera une graine.</>
        )}
      </p>

      <h2 className="amz-garden-jh">Tes jalons</h2>
      <ul className="amz-jalons">
        {JALONS.map((j) => {
          const atteint = count >= j.days;
          return (
            <li key={j.days} className={"amz-jalon" + (atteint ? " on" : "")}>
              <span className="amz-jalon-ico" aria-hidden="true">{atteint ? j.emoji : "🔒"}</span>
              <span className="amz-jalon-body">
                <span className="amz-jalon-l">{j.label}</span>
                <span className="amz-jalon-s">{j.sub}</span>
              </span>
              <span className={"amz-jalon-tag" + (atteint ? " on" : "")}>{atteint ? "atteint" : `${j.days} j`}</span>
            </li>
          );
        })}
      </ul>

      {prochain && count > 0 && (
        <p className="amz-garden-next">Encore {prochain.days - count} {prochain.days - count > 1 ? "jours" : "jour"} vers « {prochain.label} ».</p>
      )}
    </div>
  );
}
