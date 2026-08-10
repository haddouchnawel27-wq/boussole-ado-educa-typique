"use client";
// Hook d'authentification praticienne (Supabase). En mode démo (Supabase non configuré),
// renvoie toujours "pas d'utilisateur" — l'app reste utilisable en démo.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseEnabled } from "./supabase";

export type AuthenticatorLevel = "aal1" | "aal2" | null;

interface AuthState {
  user: User | null;
  loading: boolean;
  mfaLoading: boolean;
  aal: AuthenticatorLevel;
  enabled: boolean;
  refreshMfa: () => Promise<AuthenticatorLevel>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  mfaLoading: true,
  aal: null,
  enabled: false,
  refreshMfa: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaLoading, setMfaLoading] = useState(true);
  const [aal, setAal] = useState<AuthenticatorLevel>(null);

  const checkMfa = useCallback(async (showLoading: boolean): Promise<AuthenticatorLevel> => {
    if (!supabaseEnabled || !supabase) {
      setAal(null);
      setMfaLoading(false);
      return null;
    }

    if (showLoading) setMfaLoading(true);
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) {
      // Une vérification silencieuse peut échouer pendant un rafraîchissement
      // de jeton. Dans ce cas, on conserve l'accès déjà validé au lieu de
      // démonter le cockpit et les formulaires en cours de saisie.
      if (showLoading) setAal(null);
      if (showLoading) setMfaLoading(false);
      return null;
    }
    const level = data.currentLevel as AuthenticatorLevel;
    setAal(level);
    if (showLoading) setMfaLoading(false);
    return level;
  }, []);

  const refreshMfa = useCallback(() => checkMfa(true), [checkMfa]);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) {
      setLoading(false);
      setMfaLoading(false);
      return;
    }
    const sb = supabase;
    sb.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null);
      if (data.user) await checkMfa(true);
      else {
        setAal(null);
        setMfaLoading(false);
      }
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setAal(null);
        setMfaLoading(false);
        setLoading(false);
        return;
      }

      // TOKEN_REFRESHED et le retour sur un onglet ne doivent jamais faire
      // disparaître brièvement l'utilisatrice déjà connectée.
      if (session?.user) setUser((current) => current?.id === session.user.id ? current : session.user);
      setLoading(false);
      if (session?.user) {
        // La lecture AAL est volontairement différée : Supabase déconseille les
        // appels d'authentification imbriqués directement dans ce callback.
        // Elle est silencieuse après l'accès initial afin de garder le cockpit monté.
        window.setTimeout(() => void checkMfa(false), 0);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [checkMfa]);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setAal(null);
    setMfaLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, mfaLoading, aal, enabled: supabaseEnabled, refreshMfa, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
