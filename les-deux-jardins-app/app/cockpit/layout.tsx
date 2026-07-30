import type { Metadata } from "next";

// Cockpit = espace praticienne privé → non indexé par les moteurs de recherche.
// (Le reste de Les Deux Jardins reste indexable ; NeuroPed aussi.)
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CockpitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
