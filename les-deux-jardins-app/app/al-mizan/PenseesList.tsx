"use client";

import type { Thought } from "./lib/storage";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  } catch {
    return "";
  }
}

export function PenseesList({
  thoughts,
  demo,
  onDelete,
}: {
  thoughts: Thought[];
  demo: boolean;
  onDelete: (id: string) => void;
}) {
  if (thoughts.length === 0) {
    return (
      <div className="amz-empty">
        <p className="amz-empty-h">Aucune pensée déposée pour l'instant.</p>
        <p>Quand une pensée vous pèse, vous pourrez la regarder en douceur, en cinq temps. Prenez ce qui vous aide, laissez le reste.</p>
      </div>
    );
  }

  return (
    <ul className="amz-th-list">
      {thoughts.map((t) => (
        <li key={t.id} className="amz-th-card">
          <div className="amz-th-card-top">
            <span className="amz-th-date">{formatDate(t.date)}{demo && <span className="amz-tag">exemple</span>}</span>
            {!demo && (
              <button
                className="amz-th-del"
                aria-label={`Supprimer la pensée du ${formatDate(t.date)}`}
                onClick={() => {
                  if (window.confirm("Supprimer cette pensée ? Cette action est définitive.")) onDelete(t.id);
                }}
              >
                Supprimer
              </button>
            )}
          </div>

          {t.situation && <p className="amz-th-line"><span className="amz-th-tag">Situation</span>{t.situation}</p>}
          {t.pensee && <p className="amz-th-line"><span className="amz-th-tag">Pensée</span><em>{t.pensee}</em></p>}
          {t.emotion && (
            <p className="amz-th-line">
              <span className="amz-th-tag">Ressenti</span>
              {t.emotion}{t.intensite > 0 && <span className="amz-th-int"> · {t.intensite}/10</span>}
            </p>
          )}
          {t.regard && <p className="amz-th-line amz-th-regard"><span className="amz-th-tag">Regard plus juste</span>{t.regard}</p>}
          {t.apres && <p className="amz-th-line"><span className="amz-th-tag">Après</span>{t.apres}</p>}
        </li>
      ))}
    </ul>
  );
}
