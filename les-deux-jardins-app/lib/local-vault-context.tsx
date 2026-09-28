"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./auth";
import {
  ensureAutomaticLocalVault,
  localVaultExists,
  localVaultIsUnlocked,
  lockLocalVault,
} from "./local-vault";

interface LocalVaultState {
  scope: string;
  exists: boolean;
  unlocked: boolean;
  busy: boolean;
  error: string;
  lock: () => void;
}

const LocalVaultContext = createContext<LocalVaultState>({
  scope: "",
  exists: false,
  unlocked: false,
  busy: false,
  error: "",
  lock: () => {},
});

export function LocalVaultProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const scope = user?.id ?? "";
  const [exists, setExists] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    lockLocalVault();
    setExists(false);
    setUnlocked(false);
    setError("");
    if (!scope) {
      setBusy(false);
      return () => { cancelled = true; };
    }
    setBusy(true);
    void ensureAutomaticLocalVault(scope)
      .then(() => {
        if (cancelled) return;
        setExists(localVaultExists(scope));
        setUnlocked(localVaultIsUnlocked(scope));
      })
      .catch(() => {
        if (!cancelled) setError("La sauvegarde locale n’a pas pu être initialisée. Actualise la page.");
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => { cancelled = true; };
  }, [scope]);

  const lock = useCallback(() => {
    lockLocalVault();
    setUnlocked(false);
  }, []);

  return (
    <LocalVaultContext.Provider value={{ scope, exists, unlocked, busy, error, lock }}>
      {children}
    </LocalVaultContext.Provider>
  );
}

export const useLocalVault = () => useContext(LocalVaultContext);
