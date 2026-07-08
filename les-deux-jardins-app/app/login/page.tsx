"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, enabled } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!supabaseEnabled || !supabase) {
      setMsg("Mode démo : la connexion s'activera dès que les clés Supabase seront branchées.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { nom } } });
        if (error) throw error;
        setMsg("Compte créé ✅ Tu peux te connecter (vérifie tes mails si une confirmation est demandée).");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/cockpit");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="font-serif text-2xl text-jq-deep">Tu es connectée 🌸</p>
        <p className="mt-1 text-shell-muted">{user.email}</p>
        <Link href="/cockpit" className="mt-5 inline-block rounded-xl bg-jq-deep px-5 py-2.5 text-sm font-semibold text-white">
          Aller au cockpit →
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-5 py-12 sm:py-16">
      <div className="rounded-2xl border border-shell-border bg-shell-surface p-6 shadow-soft sm:p-8">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.24em] text-jq-sage">Jannat al Qulûb</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-jq-deep">
          {mode === "signin" ? "Se connecter" : "Créer mon espace"}
        </h1>
        <p className="mt-1 text-sm text-shell-muted">Espace praticienne — tes accompagnées, en sécurité.</p>

        {!enabled && (
          <div className="mt-4 rounded-xl border border-dashed border-gold bg-[rgba(195,135,60,.08)] p-3 text-[13px] text-shell-muted">
            Mode démonstration : l'inscription s'activera dès que les clés Supabase seront branchées.
          </div>
        )}

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          {mode === "signup" && (
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-shell-text">Ton nom</span>
              <input value={nom} onChange={(e) => setNom(e.target.value)} className="w-full rounded-xl border border-shell-border bg-white px-3 py-2.5 outline-none focus:border-gold" placeholder="Nawel" />
            </label>
          )}
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-shell-text">E-mail</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-shell-border bg-white px-3 py-2.5 outline-none focus:border-gold" placeholder="toi@exemple.com" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-shell-text">Mot de passe</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-shell-border bg-white px-3 py-2.5 outline-none focus:border-gold" placeholder="••••••" />
          </label>

          <button disabled={busy} className="mt-1 rounded-xl bg-gradient-to-br from-gold-light to-gold-dark px-5 py-2.5 text-sm font-semibold text-white shadow disabled:opacity-60">
            {busy ? "…" : mode === "signin" ? "Se connecter" : "Créer mon espace"}
          </button>
        </form>

        {msg && <p className="mt-3 rounded-xl border border-shell-border bg-shell-soft p-3 text-[13px] text-shell-muted">{msg}</p>}

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}
          className="mt-4 text-[13px] font-semibold text-gold-dark hover:underline"
        >
          {mode === "signin" ? "Pas encore d'espace ? Créer mon compte" : "J'ai déjà un espace — me connecter"}
        </button>
      </div>
    </main>
  );
}
