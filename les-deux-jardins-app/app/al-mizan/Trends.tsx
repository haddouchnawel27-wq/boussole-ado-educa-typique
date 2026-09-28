"use client";

import type { CheckIn } from "./lib/storage";

const DIMS: { key: keyof Pick<CheckIn, "energie" | "humeur" | "clarte" | "elan">; label: string; color: string }[] = [
  { key: "energie", label: "Énergie", color: "#B8954F" },
  { key: "humeur", label: "Humeur", color: "#8A9789" },
  { key: "clarte", label: "Clarté mentale", color: "#C88E7F" },
  { key: "elan", label: "Élan d'agir", color: "#677465" },
];

function Sparkline({ values, color, label }: { values: number[]; color: string; label: string }) {
  const W = 260;
  const H = 54;
  const pad = 6;
  const n = values.length;
  const iw = W - pad * 2;
  const ih = H - pad * 2;
  const x = (i: number) => (n === 1 ? W / 2 : pad + (i / (n - 1)) * iw);
  const y = (v: number) => pad + (1 - v / 10) * ih;
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const avg = Math.round((values.reduce((a, b) => a + b, 0) / n) * 10) / 10;
  const last = values[n - 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const aria = `${label} sur ${n} observation${n > 1 ? "s" : ""} : de ${min} à ${max} sur 10, moyenne ${avg}, dernière valeur ${last}.`;
  return (
    <svg className="amz-spark" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria} preserveAspectRatio="none">
      <line x1={pad} y1={y(5)} x2={W - pad} y2={y(5)} stroke="#E8DDD1" strokeWidth="1" strokeDasharray="3 3" />
      {n > 1 && <polyline points={pts} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === n - 1 ? 4 : 2.6} fill={color} />
      ))}
    </svg>
  );
}

export function Trends({ checkIns, demo }: { checkIns: CheckIn[]; demo: boolean }) {
  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  const n = sorted.length;

  if (n < 3) {
    return (
      <>
        <div className="amz-empty">
          <p className="amz-empty-h">Pas encore assez de repères.</p>
          <p>Quelques observations de plus feront apparaître une tendance. En attendant, chaque passage compte déjà.</p>
        </div>
        <p className="amz-caution">Une tendance n'apparaît qu'à partir de 3 observations — pour ne rien conclure trop vite.</p>
      </>
    );
  }

  // Bien-être composite (moyenne des 4 dimensions) pour l'insight + les stats.
  const compo = (c: CheckIn) => (c.energie + c.humeur + c.clarte + c.elan) / 4;
  const all = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = all.slice(-7);
  const avg7 = Math.round((last7.reduce((s, c) => s + compo(c), 0) / last7.length) * 10) / 10;
  const avgAll = all.reduce((s, c) => s + compo(c), 0) / all.length;
  const delta = avg7 - avgAll;
  const insight =
    delta > 0.4
      ? { emoji: "🌿", titre: "Une semaine plus claire", txt: "Ces derniers jours sont au-dessus de ta moyenne. Quelque chose t'a fait du bien — garde-le précieusement." }
      : delta < -0.4
      ? { emoji: "🤍", titre: "Une semaine plus dense", txt: "Ces jours sont sous ta moyenne. Sois douce avec toi — les creux font partie du chemin, ils ne durent pas." }
      : { emoji: "🌱", titre: "Un rythme régulier", txt: "Tes jours se ressemblent, tranquillement. La constance discrète est déjà un soin." };

  return (
    <>
      <p className="amz-lead">Vos <strong>{n}</strong> dernières observations, domaine par domaine{demo ? " (exemples)" : ""}.</p>

      <section className="amz-tr-insight" aria-label="Lecture de la semaine">
        <div className="amz-tr-insight-h">{insight.titre} <span aria-hidden="true">{insight.emoji}</span></div>
        <p className="amz-tr-insight-t">{insight.txt}</p>
      </section>
      <div className="amz-tr-stats">
        <div className="amz-tr-stat"><div className="amz-tr-stat-n">{avg7}</div><div className="amz-tr-stat-l">moyenne 7 j · /10</div></div>
        <div className="amz-tr-stat"><div className="amz-tr-stat-n">{checkIns.length}</div><div className="amz-tr-stat-l">observations</div></div>
      </div>

      <div className="amz-trends">
        {DIMS.map((d) => {
          const vals = sorted.map((c) => c[d.key]);
          const avg = Math.round((vals.reduce((a, b) => a + b, 0) / n) * 10) / 10;
          return (
            <div key={d.key} className="amz-trend">
              <div className="amz-trend-top">
                <span className="amz-trend-label">{d.label}</span>
                <span className="amz-trend-avg">moy. {avg}/10 · dern. {vals[n - 1]}/10</span>
              </div>
              <Sparkline values={vals} color={d.color} label={d.label} />
            </div>
          );
        })}
      </div>
      <p className="amz-caution">
        Une lecture, jamais un jugement — les jours bas font partie du chemin. Ces tendances observent
        des variations sur vos {n} derniers passages ; elles ne constituent ni une note ni un diagnostic.
      </p>
    </>
  );
}
