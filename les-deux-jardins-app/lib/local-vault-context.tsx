"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./auth";
import {
  createLocalVault,
  localVaultExists,
  localVaultIsUnlocked,
  lockLocalVault,
  unlockLocalVault,
} from "./local-vault";

interface LocalVaultState {
  scope: string;
  exists: boolean;
  unlocked: boolean;
  busy: boolean;
  error: string;
  create: (passphrase: string) => Promise<boolean>;
  unlock: (passphrase: string) => Promise<boolean>;
  lock: () => void;
}

const LocalVaultContext = createContext<LocalVaultState>({
  scope: "",
  exists: false,
  unlocked: false,
  busy: false,
  error: "",
  create: async () => false,
  unlock: async () => false,
  lock: () => {},
});

export function LocalVaultProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const scope = user?.id ?? "";
  const [exists, setExists] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    lockLocalVault();
    setExists(scope ? localVaultExists(scope) : false);
    setUnlocked(false);
    setError("");
  }, [scope]);

  const create = useCallback(async (passphrase: string) => {
    if (!scope) return false;
    setBusy(true);
    setError("");
    try {
      await createLocalVault(scope, passphrase);
      setExists(true);
      setUnlocked(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Le coffre local n’a pas pu être créé.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [scope]);

  const unlock = useCallback(async (passphrase: string) => {
    if (!scope) return false;
    setBusy(true);
    setError("");
    try {
      await unlockLocalVault(scope, passphrase);
      setUnlocked(localVaultIsUnlocked(scope));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Le coffre local n’a pas pu être ouvert.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [scope]);

  const lock = useCallback(() => {
    lockLocalVault();
    setUnlocked(false);
  }, []);

  return (
    <LocalVaultContext.Provider value={{ scope, exists, unlocked, busy, error, create, unlock, lock }}>
      {children}
    </LocalVaultContext.Provider>
  );
}

export const useLocalVault = () => useContext(LocalVaultContext);
