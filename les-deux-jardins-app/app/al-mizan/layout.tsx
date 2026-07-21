import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Al Mizan Al Qalb — Revenir à soi au quotidien",
  description:
    "Un espace doux pour observer son énergie, ses émotions, ses blocages et ses pensées. Un outil de soutien à l'observation de soi — jamais un diagnostic.",
  applicationName: "Al Mizan Al Qalb",
  openGraph: {
    title: "Al Mizan Al Qalb — Revenir à soi au quotidien",
    description:
      "Un compagnon doux pour observer son état du jour, mieux comprendre ses émotions et avancer à son rythme.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Al Mizan",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F0E6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AlMizanLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${cormorant.variable} ${jost.variable}`}>{children}</div>;
}
