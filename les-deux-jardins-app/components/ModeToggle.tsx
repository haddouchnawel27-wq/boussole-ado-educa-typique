"use client";
import { useMode } from "@/lib/mode";

export function ModeToggle() {
  const { mode, setMode } = useMode();
  return (
    <div
      role="group"
      aria-label="Mode d'accompagnement"
      className="inline-flex items-center rounded-full border border-shell-border bg-shell-soft p-1 font-serif"
    >
      {(["universel", "islamique"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={
            "rounded-full px-4 py-1.5 text-sm transition-colors " +
            (mode === m
              ? "bg-gradient-to-br from-gold-light to-gold font-semibold text-white shadow"
              : "text-shell-muted")
          }
        >
          {m === "universel" ? "Universel" : "Côté islamique"}
        </button>
      ))}
    </div>
  );
}
