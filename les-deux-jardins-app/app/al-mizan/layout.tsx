import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Al Mizan Al Qalb — Revenir à soi au quotidien",
  description:
    "Un espace doux pour observer son énergie, ses émotions, ses blocages et ses pensées. Un outil de soutien à l'observation de soi — jamais un diagnostic.",
  openGraph: {
    title: "Al Mizan Al Qalb — Revenir à soi au quotidien",
    description:
      "Un compagnon doux pour observer son état du jour, mieux comprendre ses émotions et avancer à son rythme.",
    type: "website",
  },
};

export default function AlMizanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
