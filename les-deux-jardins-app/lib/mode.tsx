"use client";
// Moteur du double mode : Universel ⇄ Islamique (transversal, persistant).
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mode = "universel" | "islamique";

const ModeContext = createContext<{ mode: Mode; setMode: (m: Mode) => void }>({
  mode: "universel",
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("universel");

  // Restaure le choix (persistant par utilisateur, surchargeable par hub plus tard).
  useEffect(() => {
    const saved = window.localStorage.getItem("ldj.mode");
    if (saved === "universel" || saved === "islamique") setMode(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ldj.mode", mode);
    document.documentElement.setAttribute("data-mode", mode);
  }, [mode]);

  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}

export const useMode = () => useContext(ModeContext);
