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

  const refreshMfa = useCallback(async (): Promise<AuthenticatorLevel> => {
    if (!supabaseEnabled || !supabase) {
      setAal(null);
      setMfaLoading(false);
      return null;
    }

    setMfaLoading(true);
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const level = error ? null : (data.currentLevel as AuthenticatorLevel);
    setAal(level);
    setMfaLoading(false);
    return level;
  }, []);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) {
      setLoading(false);
      setMfaLoading(false);
      return;
    }
    const sb = supabase;
    sb.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null);
      if (data.user) await refreshMfa();
      else {
        setAal(null);
        setMfaLoading(false);
      }
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        // La lecture AAL est volontairement différée : Supabase déconseille les
        // appels d'authentification imbriqués directement dans ce callback.
        window.setTimeout(() => void refreshMfa(), 0);
      } else {
        setAal(null);
        setMfaLoading(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [refreshMfa]);

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
