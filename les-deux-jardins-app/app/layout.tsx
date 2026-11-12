import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ModeProvider } from "@/lib/mode";
import { AuthProvider } from "@/lib/auth";
import { LocalVaultProvider } from "@/lib/local-vault-context";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Les Deux Jardins — Espace professionnel",
  description:
    "Application professionnelle d’accompagnement et de suivi, avec mode universel par défaut et mode islamique sur choix explicite.",
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
        <AuthProvider>
          <LocalVaultProvider>
            <ModeProvider>
              <Nav />
              {children}
            </ModeProvider>
          </LocalVaultProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
