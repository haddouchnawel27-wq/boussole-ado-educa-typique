"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { nonClinicalPilotMode } from "@/lib/pilot";
import { useLocalVault } from "@/lib/local-vault-context";

export function ProfessionalGate({ children }: { children: ReactNode }) {
  const { user, loading, mfaLoading, aal, enabled } = useAuth();
  const vault = useLocalVault();

  if (loading || (!nonClinicalPilotMode && user && mfaLoading)) {
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

  if (nonClinicalPilotMode && !vault.unlocked) {
    return <LocalVaultUnlock />;
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

function LocalVaultUnlock() {
  const { exists, busy, error, create, unlock } = useLocalVault();
  const [passphrase, setPassphrase] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [localError, setLocalError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLocalError("");
    if (!exists && passphrase !== confirmation) {
      setLocalError("Les deux phrases secrètes ne sont pas identiques.");
      return;
    }
    const ok = exists ? await unlock(passphrase) : await create(passphrase);
    if (!ok) setPassphrase("");
  }

  return (
    <main className="mx-auto max-w-md px-5 py-12 sm:py-16">
      <form onSubmit={submit} className="rounded-2xl border border-shell-border bg-shell-surface p-6 shadow-soft sm:p-8">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.24em] text-jq-sage">Les Deux Jardins</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-jq-deep">
          {exists ? "Ouvrir mon coffre local" : "Créer mon coffre local"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-shell-muted">
          {exists
            ? "Saisis ta phrase secrète. Les dossiers restent chiffrés sur cet ordinateur et ne partent pas dans le cloud."
            : "Choisis une phrase secrète d’au moins 10 caractères. Elle chiffre les dossiers conservés uniquement dans ce navigateur."}
        </p>

        <label htmlFor="vault-passphrase" className="mt-5 block text-sm font-semibold text-shell-text">Phrase secrète du coffre</label>
        <input
          id="vault-passphrase"
          type="password"
          required
          minLength={10}
          autoComplete="current-password"
          value={passphrase}
          onChange={(event) => setPassphrase(event.target.value)}
          className="mt-1 w-full rounded-xl border border-shell-border bg-white px-3 py-3 outline-none focus:border-gold"
        />

        {!exists && (
          <>
            <label htmlFor="vault-confirmation" className="mt-4 block text-sm font-semibold text-shell-text">Répète la phrase secrète</label>
            <input
              id="vault-confirmation"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="mt-1 w-full rounded-xl border border-shell-border bg-white px-3 py-3 outline-none focus:border-gold"
            />
          </>
        )}

        {(localError || error) && <p role="alert" className="mt-4 rounded-xl border border-[#c88] bg-[#fff4f4] p-3 text-sm text-[#8a3340]">{localError || error}</p>}

        <button disabled={busy} className="mt-5 w-full rounded-xl bg-jq-deep px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {busy ? "Ouverture…" : exists ? "Ouvrir le coffre" : "Créer et ouvrir le coffre"}
        </button>

        <p className="mt-4 text-xs leading-relaxed text-shell-muted">
          Important : garde cette phrase dans un endroit sûr. Sans elle, le contenu chiffré ne pourra pas être récupéré. Le coffre n’est pas synchronisé entre tes appareils.
        </p>
      </form>
    </main>
  );
}
