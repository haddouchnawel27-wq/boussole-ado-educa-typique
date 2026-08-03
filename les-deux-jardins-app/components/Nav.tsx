"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "@/lib/auth";
import { useLocalVault } from "@/lib/local-vault-context";
import { exportLocalVault } from "@/lib/local-vault";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/cockpit", label: "Cockpit" },
  { href: "/apps", label: "Applications" },
  { href: "/questionnaires", label: "Questionnaires" },
];

export function Nav() {
  const path = usePathname();
  const { user } = useAuth();
  const visibleLinks = user ? LINKS : LINKS.filter((link) => link.href === "/");
  // Al Mizan est une app immersive plein écran : pas de barre d'écosystème.
  if (path?.startsWith("/al-mizan")) return null;
  return (
    <nav className="sticky top-0 z-30 border-b border-shell-border bg-shell-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2.5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Les Deux Jardins — accueil">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-jq-sage to-jq-deep text-white" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M6 12c-.5-2.5 3-5 6-2 3-3 6.5-.5 6 2 .5 3-4.5 6.5-6 8-1.5-1.5-6.5-5-6-8Z" fill="#D9E4CB" stroke="#C3873C" strokeWidth="1.2" />
            </svg>
          </span>
          <span className="font-serif text-[15px] font-semibold tracking-wide text-jq-deep">Les Deux Jardins</span>
        </Link>

        <div className="order-3 flex w-full items-center gap-1 sm:order-none sm:w-auto">
          {visibleLinks.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={"rounded-full px-3 py-1.5 text-[13.5px] font-semibold transition " + (active ? "bg-jq-deep text-white" : "text-shell-muted hover:bg-shell-soft")}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Account />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}

function Account() {
  const { user, enabled, signOut } = useAuth();
  const { scope, unlocked, lock } = useLocalVault();
  function downloadBackup() {
    const encrypted = scope ? exportLocalVault(scope) : null;
    if (!encrypted) return;
    const blob = new Blob([encrypted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `les-deux-jardins-coffre-chiffre-${new Date().toISOString().slice(0, 10)}.ldj`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  if (!enabled) return null; // mode démo : rien à afficher
  if (user)
    return (
      <div className="flex items-center gap-1.5">
        {unlocked && (
          <>
            <button
              onClick={downloadBackup}
              title="Télécharger une copie chiffrée du coffre"
              className="rounded-full border border-shell-border px-3 py-1.5 text-[12.5px] font-semibold text-shell-muted hover:border-gold hover:text-gold-dark"
            >
              Copie chiffrée
            </button>
            <button
              onClick={lock}
              className="rounded-full border border-shell-border px-3 py-1.5 text-[12.5px] font-semibold text-shell-muted hover:border-gold hover:text-gold-dark"
            >
              Verrouiller
            </button>
          </>
        )}
        <button
          onClick={() => { lock(); void signOut(); }}
          title={user.email ?? ""}
          className="rounded-full border border-shell-border px-3 py-1.5 text-[12.5px] font-semibold text-shell-muted hover:border-gold hover:text-gold-dark"
        >
          Déconnexion
        </button>
      </div>
    );
  return (
    <Link href="/login" className="rounded-full bg-jq-deep px-3 py-1.5 text-[12.5px] font-semibold text-white">
      Se connecter
    </Link>
  );
}
