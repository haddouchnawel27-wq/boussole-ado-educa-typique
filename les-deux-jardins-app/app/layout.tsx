import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ModeProvider } from "@/lib/mode";

export const metadata: Metadata = {
  title: "Les Deux Jardins — Jannat al Qulûb & Educa Typique",
  description:
    "Écosystème d'accompagnement psycho-éducatif et spirituel. 100% respectueux, double mode Universel / Islamique.",
};

export const viewport: Viewport = {
  themeColor: "#FBF7EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  );
}
