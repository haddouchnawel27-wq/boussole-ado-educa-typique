"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type Phase = "loading" | "setup" | "enrolling" | "challenge";

export default function MfaPage() {
  const router = useRouter();
  const { user, loading, mfaLoading, aal, enabled, refreshMfa, signOut } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const inspectFactors = useCallback(async () => {
    if (!supabase || !user) return;
    setPhase("loading");
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      setMessage("La vérification de sécurité n’a pas pu démarrer. Réessaie dans un instant.");
      setPhase("setup");
      return;
    }
    const verified = data.totp.find((factor) => factor.status === "verified");
    if (verified) {
      setFactorId(verified.id);
      setPhase("challenge");
    } else {
      setPhase("setup");
    }
  }, [user]);

  useEffect(() => {
    if (loading || mfaLoading) return;
    if (user && aal === "aal2") {
      router.replace("/cockpit");
      return;
    }
    if (user) void inspectFactors();
  }, [aal, inspectFactors, loading, mfaLoading, router, user]);

  async function beginEnrollment() {
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    try {
      const existing = await supabase.auth.mfa.listFactors();
      if (existing.error) throw existing.error;
      for (const factor of existing.data.totp.filter((item) => item.status !== "verified")) {
        const removed = await supabase.auth.mfa.unenroll({ factorId: factor.id });
        if (removed.error) throw removed.error;
      }
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Les Deux Jardins",
      });
      if (error) throw error;
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setPhase("enrolling");
    } catch {
      setMessage("La configuration n’a pas abouti. Réessaie sans fermer cette page.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !factorId) return;
    const cleanCode = code.replace(/\s/g, "");
    if (!/^\d{6}$/.test(cleanCode)) {
      setMessage("Saisis les 6 chiffres affichés dans ton application d’authentification.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: cleanCode });
      if (error) throw error;
      const level = await refreshMfa();
      if (level !== "aal2") throw new Error("AAL2 non obtenu");
      router.replace("/cockpit");
      router.refresh();
    } catch {
      setMessage("Ce code n’est pas valide ou a expiré. Attends le prochain code puis réessaie.");
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) {
    return <main className="mx-auto max-w-md px-5 py-16 text-center text-shell-muted">La sécurité MFA sera disponible lorsque Supabase sera connecté.</main>;
  }

  if (loading || mfaLoading || phase === "loading") {
    return <main className="mx-auto max-w-md px-5 py-16 text-center text-shell-muted">Vérification de la connexion sécurisée…</main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="font-serif text-3xl font-semibold text-jq-deep">Connexion requise</h1>
        <Link href="/login" className="mt-5 inline-block rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">Se connecter</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-10 sm:py-14">
      <section className="rounded-2xl border border-shell-border bg-shell-surface p-6 shadow-soft sm:p-8">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.24em] text-jq-sage">Les Deux Jardins</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-jq-deep">Protéger mon accès</h1>
        <p className="mt-2 text-sm text-shell-muted">
          Cette vérification empêche une autre personne d’ouvrir les dossiers avec ton seul mot de passe.
        </p>

        {phase === "setup" && (
          <div className="mt-6">
            <p className="text-sm text-shell-text">
              Sur ton téléphone, installe ou ouvre une application d’authentification. Tu scanneras ensuite un carré QR une seule fois.
            </p>
            <button type="button" disabled={busy} onClick={beginEnrollment} className="mt-4 w-full rounded-xl bg-jq-deep px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {busy ? "Préparation…" : "Configurer maintenant"}
            </button>
          </div>
        )}

        {phase === "enrolling" && (
          <div className="mt-6">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-shell-text">
              <li>Ouvre ton application d’authentification sur le téléphone.</li>
              <li>Choisis « Ajouter » puis scanne ce carré.</li>
              <li>Saisis ci-dessous les 6 chiffres affichés.</li>
            </ol>
            <div className="mt-4 flex justify-center rounded-xl bg-white p-4">
              {/* Le QR est généré par Supabase et contient uniquement le secret TOTP de cette praticienne. */}
              <img src={qrCode} alt="Code QR à scanner dans l’application d’authentification" className="h-52 w-52" />
            </div>
            <details className="mt-3 rounded-xl border border-shell-border bg-shell-soft p-3 text-sm">
              <summary className="cursor-pointer font-semibold text-shell-text">Le scan ne fonctionne pas</summary>
              <p className="mt-2 text-shell-muted">Saisis cette clé manuellement dans l’application d’authentification :</p>
              <code className="mt-2 block break-all rounded-lg bg-white p-2 text-xs text-shell-text">{secret}</code>
            </details>
          </div>
        )}

        {(phase === "enrolling" || phase === "challenge") && (
          <form onSubmit={verify} className="mt-5">
            <label htmlFor="mfa-code" className="text-sm font-semibold text-shell-text">Code temporaire à 6 chiffres</label>
            <input
              id="mfa-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-1 w-full rounded-xl border border-shell-border bg-white px-3 py-3 text-center text-xl tracking-[0.35em] outline-none focus:border-gold"
            />
            <button disabled={busy} className="mt-3 w-full rounded-xl bg-gradient-to-br from-gold-light to-gold-dark px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {busy ? "Vérification…" : phase === "enrolling" ? "Activer et entrer" : "Vérifier et entrer"}
            </button>
          </form>
        )}

        {message && <p role="alert" aria-live="assertive" className="mt-4 rounded-xl border border-[#c88] bg-[#fff4f4] p-3 text-sm text-[#8a3340]">{message}</p>}

        <p className="mt-5 text-xs leading-relaxed text-shell-muted">
          Si tu changes ou perds ton téléphone, contacte l’administratrice avant toute nouvelle connexion. Aucun dossier n’est affiché tant que cette étape n’est pas validée.
        </p>
        <button type="button" onClick={() => void signOut()} className="mt-3 text-xs font-semibold text-jq-sage underline">Se déconnecter</button>
      </section>
    </main>
  );
}
