"use client";

import { useEffect, useRef, useState } from "react";
import "./al-mizan.css";

type SpaceKey = "aujourdhui" | "tendances" | "jardin" | "pensees" | "espace";

const SPACES: { key: SpaceKey; label: string; icon: JSX.Element }[] = [
  {
    key: "aujourdhui",
    label: "Aujourd'hui",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "tendances",
    label: "Tendances",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 15l3.5-4 3 2.5L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "jardin",
    label: "Jardin",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 14c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 12c0-3 2-5 5-5 0 3-2 5-5 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "pensees",
    label: "Pensées",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7.5 17c-2.5 0-4.5-1.9-4.5-4.3 0-2 1.4-3.7 3.3-4.2C6.7 5.7 9 4 11.7 4c3 0 5.5 2.2 5.9 5.1 1.9.3 3.4 1.9 3.4 3.9 0 2.2-1.9 4-4.2 4H7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "espace",
    label: "Espace",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 8h8M16 8h4M4 16h4M12 16h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="14" cy="8" r="2.3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10" cy="16" r="2.3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M12 3.5v15" stroke="#5E4D42" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 8h14" stroke="#5E4D42" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 8c-1 1.6-2 2.8-2 4 0 1.4 1.3 2.3 2 2.3s2-.9 2-2.3c0-1.2-1-2.4-2-4ZM19 8c-1 1.6-2 2.8-2 4 0 1.4 1.3 2.3 2 2.3s2-.9 2-2.3c0-1.2-1-2.4-2-4Z" stroke="#5E4D42" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8.5 19.5h7" stroke="#5E4D42" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AlMizanPage() {
  const [space, setSpace] = useState<SpaceKey>("aujourdhui");
  const [dateStr, setDateStr] = useState("");
  const [greeting, setGreeting] = useState("Bonjour");
  const [breath, setBreath] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const userNavigated = useRef(false);

  useEffect(() => {
    const now = new Date();
    setGreeting(now.getHours() >= 18 || now.getHours() < 5 ? "Bonsoir" : "Bonjour");
    setDateStr(
      now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    );
  }, []);

  // Déplacer le focus vers le titre uniquement après un vrai changement d'onglet
  // (pas au montage — fiable même avec le double-rendu du mode strict).
  useEffect(() => {
    if (!userNavigated.current) return;
    userNavigated.current = false;
    headingRef.current?.focus();
  }, [space]);

  function goTo(key: SpaceKey) {
    userNavigated.current = true;
    setSpace(key);
  }

  const current = SPACES.find((s) => s.key === space)!;

  return (
    <div className="amz-root">
      <a href="#amz-content" className="amz-skip">Aller au contenu</a>

      <div className="amz-wrap">
        <div className="amz-shell">
          {/* ── En-tête ── */}
          <header className="amz-top">
            <div className="amz-brand">
              <span className="amz-logo"><LogoMark /></span>
              <span className="amz-title">Al Mizan Al Qalb</span>
            </div>
            <button
              type="button"
              className="amz-respirer"
              aria-label="Respirer — un temps de pause"
              onClick={() => setBreath((b) => !b)}
            >
              <span className="dot" aria-hidden="true" />
              Respirer
            </button>
          </header>

          {/* ── Contenu ── */}
          <main id="amz-content" className="amz-main">
            <div className="amz-kicker">{dateStr || " "}</div>
            <h1 className="amz-h1" tabIndex={-1} ref={headingRef}>
              {space === "aujourdhui" ? greeting : current.label}
            </h1>

            <div aria-live="polite">
              {breath && (
                <p className="amz-note">
                  🌬️ Bientôt : un court temps de respiration guidée, pour se poser. Rien à réussir.
                </p>
              )}
            </div>

            {space === "aujourdhui" && (
              <>
                <p className="amz-lead">
                  Un moment pour observer où vous en êtes, sans jugement et sans obligation
                  de performance.
                </p>
                <section className="amz-card" aria-label="Votre série (exemple)">
                  <div className="amz-card-row">
                    <div className="amz-streak" aria-hidden="true">12</div>
                    <div className="amz-card-body">
                      <div className="amz-card-title">
                        jours que vous revenez à vous
                        <span className="amz-tag">exemple</span>
                      </div>
                      <div className="amz-progress" aria-hidden="true"><i style={{ width: "60%" }} /></div>
                    </div>
                  </div>
                </section>
                <p className="amz-lead">
                  Les écrans se rempliront au fil des prochaines étapes. Ceci est un aperçu
                  de la mise en page — les données affichées sont des exemples.
                </p>
              </>
            )}

            {space !== "aujourdhui" && (
              <div className="amz-soon">
                Cet espace arrive dans une prochaine étape.
                <br />
                En attendant, chaque observation compte déjà.
              </div>
            )}
          </main>

          {/* ── Navigation 5 espaces ── */}
          <nav className="amz-nav" aria-label="Navigation principale">
            {SPACES.map((s) => (
              <button
                key={s.key}
                type="button"
                className="amz-tab"
                aria-current={space === s.key ? "page" : undefined}
                onClick={() => goTo(s.key)}
              >
                <span className="amz-ico">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
