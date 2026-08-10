import type { Client, QResponse } from "./types";

const STORAGE_PREFIX = "les-deux-jardins.sauvegarde-locale.v2";
const DEVICE_SECRET_PREFIX = "les-deux-jardins.cle-appareil.v2";
const ITERATIONS = 310_000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export interface LocalVaultPayload {
  version: 1;
  clients: Client[];
  questionnaireResponses: Record<string, QResponse[]>;
  updatedAt: string;
}

interface LocalVaultEnvelope {
  version: 1;
  salt: string;
  iv: string;
  ciphertext: string;
}

interface ActiveVault {
  scope: string;
  key: CryptoKey;
  salt: Uint8Array;
  payload: LocalVaultPayload;
}

let activeVault: ActiveVault | null = null;

function storageKey(scope: string) {
  return `${STORAGE_PREFIX}.${scope}`;
}

function deviceSecretKey(scope: string) {
  return `${DEVICE_SECRET_PREFIX}.${scope}`;
}

function storage(): Storage {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("Le stockage local n’est pas disponible dans ce navigateur.");
  }
  return window.localStorage;
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function seal(
  key: CryptoKey,
  salt: Uint8Array,
  scope: string,
  payload: LocalVaultPayload
): Promise<LocalVaultEnvelope> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode(`${STORAGE_PREFIX}:${scope}`) },
    key,
    encoder.encode(JSON.stringify(payload))
  );
  return {
    version: 1,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
  };
}

async function openEnvelope(
  key: CryptoKey,
  scope: string,
  envelope: LocalVaultEnvelope
): Promise<LocalVaultPayload> {
  const clear = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: fromBase64(envelope.iv),
      additionalData: encoder.encode(`${STORAGE_PREFIX}:${scope}`),
    },
    key,
    fromBase64(envelope.ciphertext)
  );
  const payload = JSON.parse(decoder.decode(clear)) as LocalVaultPayload;
  if (payload.version !== 1 || !Array.isArray(payload.clients) || !payload.questionnaireResponses) {
    throw new Error("Le coffre local est illisible.");
  }
  return payload;
}

function clonePayload(payload: LocalVaultPayload): LocalVaultPayload {
  return JSON.parse(JSON.stringify(payload)) as LocalVaultPayload;
}

export function localVaultExists(scope: string): boolean {
  try {
    return Boolean(storage().getItem(storageKey(scope)));
  } catch {
    return false;
  }
}

export function localVaultIsUnlocked(scope: string): boolean {
  return activeVault?.scope === scope;
}

/** Portée du coffre déjà ouvert, utilisable même pendant un rafraîchissement de session. */
export function activeLocalVaultScope(): string | null {
  return activeVault?.scope ?? null;
}

/**
 * Initialise la sauvegarde locale sans demander un second mot de passe.
 * La clé aléatoire est liée à ce profil de navigateur : la connexion
 * praticienne et la session Windows restent les protections visibles.
 */
export async function ensureAutomaticLocalVault(scope: string): Promise<void> {
  let deviceSecret = storage().getItem(deviceSecretKey(scope));
  if (!deviceSecret) {
    deviceSecret = toBase64(crypto.getRandomValues(new Uint8Array(32)));
    storage().setItem(deviceSecretKey(scope), deviceSecret);
  }
  if (localVaultExists(scope)) {
    await unlockLocalVault(scope, deviceSecret);
  } else {
    await createLocalVault(scope, deviceSecret);
  }
}

export async function createLocalVault(scope: string, passphrase: string): Promise<void> {
  if (passphrase.length < 10) throw new Error("Choisis une phrase secrète d’au moins 10 caractères.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const payload: LocalVaultPayload = {
    version: 1,
    clients: [],
    questionnaireResponses: {},
    updatedAt: new Date().toISOString(),
  };
  const envelope = await seal(key, salt, scope, payload);
  storage().setItem(storageKey(scope), JSON.stringify(envelope));
  activeVault = { scope, key, salt, payload };
}

export async function unlockLocalVault(scope: string, passphrase: string): Promise<void> {
  const raw = storage().getItem(storageKey(scope));
  if (!raw) throw new Error("Aucun coffre local n’existe encore sur cet ordinateur.");
  try {
    const envelope = JSON.parse(raw) as LocalVaultEnvelope;
    if (envelope.version !== 1 || !envelope.salt || !envelope.iv || !envelope.ciphertext) throw new Error();
    const salt = fromBase64(envelope.salt);
    const key = await deriveKey(passphrase, salt);
    const payload = await openEnvelope(key, scope, envelope);
    activeVault = { scope, key, salt, payload };
  } catch {
    throw new Error("Phrase secrète incorrecte ou coffre local illisible.");
  }
}

export function lockLocalVault() {
  activeVault = null;
}

export function readLocalVault(scope: string): LocalVaultPayload | null {
  if (!activeVault || activeVault.scope !== scope) return null;
  return clonePayload(activeVault.payload);
}

export async function mutateLocalVault(
  scope: string,
  mutate: (draft: LocalVaultPayload) => void
): Promise<boolean> {
  if (!activeVault || activeVault.scope !== scope) return false;
  const draft = clonePayload(activeVault.payload);
  mutate(draft);
  draft.updatedAt = new Date().toISOString();
  try {
    const envelope = await seal(activeVault.key, activeVault.salt, scope, draft);
    storage().setItem(storageKey(scope), JSON.stringify(envelope));
    activeVault = { ...activeVault, payload: draft };
    return true;
  } catch {
    return false;
  }
}

export function exportLocalVault(scope: string): string | null {
  try {
    return storage().getItem(storageKey(scope));
  } catch {
    return null;
  }
}
