"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallApp() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    // Déjà installée (mode standalone) → on ne montre rien.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) setInstalled(true);

    // Enregistrement du service worker (nécessaire à l'installation).
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/almizan-sw.js", { scope: "/al-mizan" }).catch(() => {});
    }

    function onPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferred(null);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function install() {
    if (!deferred) {
      // iOS / navigateurs sans prompt → on explique le geste manuel.
      setIosHint((v) => !v);
      return;
    }
    await deferred.prompt();
    try { await deferred.userChoice; } catch { /* rien */ }
    setDeferred(null);
  }

  return (
    <div className="amz-install">
      <button className="amz-install-btn" onClick={install}>
        <span aria-hidden="true">📲</span> Installer l'appli sur mon téléphone
      </button>
      {iosHint && (
        <p className="amz-install-hint">
          Sur iPhone : appuie sur le bouton <strong>Partager</strong> (le carré avec la flèche ↑), puis
          <strong> « Sur l'écran d'accueil »</strong>. Al Mizan s'ouvrira comme une vraie application.
        </p>
      )}
    </div>
  );
}
