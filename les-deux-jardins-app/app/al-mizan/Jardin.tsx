"use client";

// Le Jardin : une métaphore douce de la régularité.
// Chaque observation déposée fait grandir la même plante, par paliers.
// Rien à « réussir » : le jardin avance au rythme de la personne.

type Phase = {
  seuil: number;        // nombre d'observations à partir duquel ce palier commence
  nom: string;
  mot: string;          // phrase d'accompagnement
  stade: 0 | 1 | 2 | 3 | 4 | 5;
};

const PHASES: Phase[] = [
  { seuil: 0,  stade: 0, nom: "Terre prête", mot: "La terre est là, patiente. Rien ne presse — votre premier passage plantera la graine." },
  { seuil: 1,  stade: 1, nom: "Une graine", mot: "Une graine dort sous la terre. Vous avez commencé, c'est l'essentiel." },
  { seuil: 3,  stade: 2, nom: "Une pousse", mot: "Une petite pousse pointe. Revenir à soi, même par intermittence, la nourrit." },
  { seuil: 7,  stade: 3, nom: "Un jeune plant", mot: "Le plant se tient droit. Vos observations lui donnent des racines." },
  { seuil: 14, stade: 4, nom: "En feuilles", mot: "Les feuilles s'ouvrent. Le soin que vous vous portez se voit maintenant." },
  { seuil: 30, stade: 5, nom: "En fleurs", mot: "Le jardin fleurit. Vous avez tenu, à votre rythme — regardez le chemin." },
];

function phaseFor(n: number): { current: Phase; next?: Phase } {
  let current = PHASES[0];
  for (const p of PHASES) if (n >= p.seuil) current = p;
  const next = PHASES.find((p) => p.seuil > n);
  return { current, next };
}

// Illustration : on révèle les éléments selon le stade (0 → 5).
function GardenArt({ stade }: { stade: number }) {
  return (
    <svg viewBox="0 0 200 170" className="amz-garden-svg" role="img" aria-label="Illustration du jardin qui grandit">
      {/* ciel doux + soleil */}
      <circle cx="158" cy="34" r="15" fill="#EBD8A6" opacity={stade >= 4 ? 0.9 : 0.5} />
      {/* butte de terre */}
      <path d="M0 150 Q100 120 200 150 L200 170 L0 170 Z" fill="#C9A87E" />
      <path d="M0 150 Q100 120 200 150" fill="none" stroke="#A9835E" strokeWidth="2" opacity="0.5" />

      {/* graine (stade >= 1) */}
      {stade >= 1 && (
        <ellipse cx="100" cy="143" rx="7" ry="5" fill="#7C5A3E" opacity={stade === 1 ? 1 : 0} />
      )}

      {/* tige (stade >= 2) */}
      {stade >= 2 && (
        <path
          d={`M100 145 L100 ${145 - Math.min(70, 14 + stade * 12)}`}
          stroke="#6E7F5C" strokeWidth="3.5" strokeLinecap="round" fill="none"
        />
      )}

      {/* première pousse / feuilles basses (stade >= 2) */}
      {stade >= 2 && (
        <>
          <path d="M100 128 q-16 -4 -20 -16 q14 -1 20 12 Z" fill="#8AA06A" />
          {stade >= 3 && <path d="M100 118 q16 -4 20 -16 q-14 -1 -20 12 Z" fill="#7E9760" />}
        </>
      )}

      {/* feuilles hautes (stade >= 4) */}
      {stade >= 4 && (
        <>
          <path d="M100 100 q-18 -6 -22 -20 q16 -1 22 14 Z" fill="#8AA06A" />
          <path d="M100 92 q18 -6 22 -20 q-16 -1 -22 14 Z" fill="#7E9760" />
        </>
      )}

      {/* fleurs (stade >= 5) */}
      {stade >= 5 && (
        <g>
          {[[100, 74], [84, 86], [116, 86]].map(([cx, cy], i) => (
            <g key={i}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx={cx} cy={cy - 7} rx="4" ry="7"
                  fill="#E3B7C0"
                  transform={`rotate(${a} ${cx} ${cy})`}
                />
              ))}
              <circle cx={cx} cy={cy} r="3.5" fill="#D9A24E" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export function Jardin({ count, demo }: { count: number; demo: boolean }) {
  const { current, next } = phaseFor(count);
  const restant = next ? next.seuil - count : 0;

  return (
    <div className="amz-garden">
      <div className="amz-garden-scene">
        <GardenArt stade={current.stade} />
      </div>

      <div className="amz-garden-body">
        <div className="amz-garden-name">
          {current.nom}
          {demo && <span className="amz-tag">exemple</span>}
        </div>
        <p className="amz-garden-mot">{current.mot}</p>

        {next ? (
          <p className="amz-garden-next">
            Encore {restant} {restant > 1 ? "observations" : "observation"} vers « {next.nom} ».
          </p>
        ) : (
          <p className="amz-garden-next">Votre jardin est au plus haut. Il continuera de fleurir avec vous.</p>
        )}

        <div className="amz-garden-count" aria-hidden="true">
          {count} {count > 1 ? "observations déposées" : count === 1 ? "observation déposée" : "aucune observation pour l'instant"}
        </div>
      </div>
    </div>
  );
}
