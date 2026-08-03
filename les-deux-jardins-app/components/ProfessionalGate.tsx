"use client";
import Link from "next/link";
import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { nonClinicalPilotMode } from "@/lib/pilot";
import { useLocalVault } from "@/lib/local-vault-context";

export function ProfessionalGate({ children }: { children: ReactNode }) {
  const { user, loading, mfaLoading, aal, enabled } = useAuth();
  const vault = useLocalVault();

  if (loading || (!nonClinicalPilotMode && user && mfaLoading) || (nonClinicalPilotMode && user && vault.busy)) {
    return <main className="mx-auto max-w-md px-5 py-16 text-center text-shell-muted">Vérification de l’accès professionnel…</main>;
  }

  if (!enabled || !user) {
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-jq-sage">Espace professionnel protégé</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-jq-deep">Connexion praticienne requise</h1>
        <p className="mt-2 text-sm text-shell-muted">
          Les outils, questionnaires et dossiers de Les Deux Jardins sont réservés aux comptes professionnels autorisés.
        </p>
        <Link href="/login" className="mt-5 inline-block rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">
          Se connecter
        </Link>
      </main>
    );
  }

  if (nonClinicalPilotMode && (vault.error || !vault.unlocked)) {
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="font-serif text-3xl font-semibold text-jq-deep">Sauvegarde locale momentanément indisponible</h1>
        <p className="mt-2 text-sm text-shell-muted">{vault.error || "Actualise simplement cette page."}</p>
        <button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">
          Actualiser
        </button>
      </main>
    );
  }

  if (!nonClinicalPilotMode && aal !== "aal2") {
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-jq-sage">Dernière étape de sécurité</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-jq-deep">Double authentification requise</h1>
        <p className="mt-2 text-sm text-shell-muted">
          Saisis le code temporaire de ton application d’authentification avant d’accéder aux dossiers.
        </p>
        <Link href="/mfa" className="mt-5 inline-block rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">
          Continuer en sécurité →
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}
