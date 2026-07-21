"use client";

import { useState } from "react";
import { Sequenceur } from "./Sequenceur";
import { FairePoint } from "./FairePoint";
import { Reader } from "./Reader";
import { FICHES, ZONES, ARTICLES, type Fiche, type Article } from "./lib/espace-content";

type Overlay =
  | { t: "seq" }
  | { t: "audit" }
  | { t: "fiche"; data: Fiche }
  | { t: "article"; data: Article }
  | null;

export function Espace({
  demo,
  onSwitchReal,
  onExport,
  onDeleteAll,
}: {
  demo: boolean;
  onSwitchReal: () => void;
  onExport: () => void;
  onDeleteAll: () => void;
}) {
  const [ov, setOv] = useState<Overlay>(null);

  return (
    <div className="amz-esp">
      <p className="amz-esp-kicker">Comprendre &amp; régler</p>

      {/* ── S'ORGANISER ── */}
      <h2 className="amz-esp-h">S'organiser</h2>
      <button className="amz-esp-porte primary" onClick={() => setOv({ t: "seq" })}>
        <span className="amz-esp-porte-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#FCFAF4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6h11" /><path d="M9 12h11" /><path d="M9 18h11" /><path d="M4 6h.01" /><path d="M4 12h.01" /><path d="M4 18h.01" /></svg>
        </span>
        <span className="amz-esp-porte-body">
          <span className="amz-esp-porte-k">Outil · en 3 temps</span>
          <span className="amz-esp-porte-t">S'organiser en douceur</span>
          <span className="amz-esp-porte-d">Vide ta tête, trie sans pression, avance un pas à la fois.</span>
        </span>
        <span className="amz-esp-porte-arr" aria-hidden="true">›</span>
      </button>

      {/* ── COMPRENDRE ── */}
      <h2 className="amz-esp-h">Comprendre</h2>
      <button className="amz-esp-porte gold" onClick={() => setOv({ t: "audit" })}>
        <span className="amz-esp-porte-ico gold" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#FCFAF4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5z" /></svg>
        </span>
        <span className="amz-esp-porte-body">
          <span className="amz-esp-porte-k">Mini-audit · 12 points</span>
          <span className="amz-esp-porte-t">Mon mode d'organisation</span>
          <span className="amz-esp-porte-d">Repère ta surcharge mentale, tes appuis et ta priorité d'allègement.</span>
        </span>
        <span className="amz-esp-porte-arr" aria-hidden="true">›</span>
      </button>

      <div className="amz-esp-grid">
        {FICHES.map((f) => (
          <button key={f.id} className="amz-esp-fiche" onClick={() => setOv({ t: "fiche", data: f })}>
            <div className="amz-esp-fiche-top"><span className="amz-esp-fiche-e" aria-hidden="true">{f.emoji}</span><span className="amz-esp-fiche-arr" aria-hidden="true">›</span></div>
            <div className="amz-esp-fiche-t">{f.titre}</div>
            <div className="amz-esp-fiche-d">{f.sous}</div>
          </button>
        ))}
      </div>

      {/* ── ZONES DE TURBULENCES ── */}
      <h2 className="amz-esp-h">Zones de turbulences</h2>
      <p className="amz-esp-intro">Des moments de vie qui changent ton rapport au travail et à l'énergie. Les comprendre, c'est arrêter de se juger.</p>
      <div className="amz-esp-grid">
        {ZONES.map((z) => (
          <button key={z.id} className="amz-esp-zone" onClick={() => setOv({ t: "fiche", data: z })}>
            <div className="amz-esp-zone-top"><span className="amz-esp-zone-e" aria-hidden="true">{z.emoji}</span><span className="amz-esp-zone-tag">{z.tag}</span></div>
            <div className="amz-esp-zone-t">{z.titre}</div>
          </button>
        ))}
      </div>

      {/* ── MINI-ARTICLES ── */}
      <h2 className="amz-esp-h">Mini-articles</h2>
      <p className="amz-esp-intro">De courtes lectures pour mieux te connaître : tes schémas, tes leviers, ton fonctionnement.</p>
      <ul className="amz-esp-arts">
        {ARTICLES.map((a) => (
          <li key={a.id}>
            <button className="amz-esp-art" onClick={() => setOv({ t: "article", data: a })}>
              <span className="amz-esp-art-e" aria-hidden="true">{a.emoji}</span>
              <span className="amz-esp-art-body">
                <span className="amz-esp-art-t">{a.titre}</span>
                <span className="amz-esp-art-min">Lecture · {a.min}</span>
              </span>
              <span className="amz-esp-porte-arr" aria-hidden="true">›</span>
            </button>
          </li>
        ))}
      </ul>

      {/* ── RÉGLER ── */}
      <h2 className="amz-esp-h">Régler</h2>
      <div className="amz-space">
        <div className="amz-space-row"><span>Mode actuel</span><strong>{demo ? "Découverte (exemples)" : "Mon espace"}</strong></div>
        <p className="amz-space-note">🔒 Tes données restent <strong>uniquement sur cet appareil</strong>. Aucun compte, aucun serveur.</p>
        {demo ? (
          <button className="amz-ob-btn primary" onClick={onSwitchReal}>Commencer mon espace personnel</button>
        ) : (
          <button className="amz-ob-btn" onClick={onExport}>Exporter mes données (fichier)</button>
        )}
        <button className="amz-ob-btn danger" onClick={onDeleteAll}>Supprimer toutes mes données</button>
        <p className="amz-space-foot">Al Mizan Al Qalb est un soutien à la compréhension de soi. Il ne remplace ni un diagnostic, ni un suivi médical ou psychologique.</p>
      </div>

      {/* ── Overlays ── */}
      {ov?.t === "seq" && <Sequenceur onClose={() => setOv(null)} />}
      {ov?.t === "audit" && <FairePoint onClose={() => setOv(null)} />}
      {ov?.t === "fiche" && <Reader content={{ kind: "fiche", data: ov.data }} onClose={() => setOv(null)} />}
      {ov?.t === "article" && <Reader content={{ kind: "article", data: ov.data }} onClose={() => setOv(null)} />}
    </div>
  );
}
