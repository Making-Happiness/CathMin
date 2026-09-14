import type { AdminAccount, AdminSession, CreateAccountInput } from "./types";

const ACCOUNTS_KEY = "cathmin.admin.accounts";
const SESSION_KEY = "cathmin.admin.session";
const REGISTRATION_PASSKEY = "C4thOLiCMinis3s";

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function deriveHash(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const saltBytes = fromBase64(salt);
  const saltBuffer = saltBytes.buffer.slice(saltBytes.byteOffset, saltBytes.byteOffset + saltBytes.byteLength) as ArrayBuffer;
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ hash: "SHA-256", iterations: 210000, name: "PBKDF2", salt: saltBuffer }, key, 256);
  return toBase64(new Uint8Array(bits));
}

function getAccounts(): AdminAccount[] {
  const stored = localStorage.getItem(ACCOUNTS_KEY);
  return stored ? (JSON.parse(stored) as AdminAccount[]) : [];
}

function saveAccounts(accounts: AdminAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function sessionFromAccount(account: AdminAccount): AdminSession {
  return { email: account.email, name: account.name, role: account.role };
}

export function getStoredSession(): AdminSession | null {
  const stored = sessionStorage.getItem(SESSION_KEY);
  return stored ? (JSON.parse(stored) as AdminSession) : null;
}

export function clearStoredSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function registerAdmin(input: CreateAccountInput): Promise<AdminSession> {
  const email = input.email.trim().toLowerCase();
  if (input.passkey !== REGISTRATION_PASSKEY) throw new Error("The registration passkey is incorrect.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
  if (input.name.trim().length < 2) throw new Error("Enter your full name.");
  if (input.password.length < 12) throw new Error("Use a password of at least 12 characters.");
  const accounts = getAccounts();
  if (accounts.some((account) => account.email === email)) throw new Error("An admin account already uses this email.");

  const salt = toBase64(crypto.getRandomValues(new Uint8Array(16)));
  const account: AdminAccount = { email, name: input.name.trim(), passwordHash: await deriveHash(input.password, salt), role: input.role, salt };
  saveAccounts([...accounts, account]);
  const session = sessionFromAccount(account);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function authenticateAdmin(emailInput: string, password: string): Promise<AdminSession> {
  const account = getAccounts().find((item) => item.email === emailInput.trim().toLowerCase());
  if (!account || (await deriveHash(password, account.salt)) !== account.passwordHash) throw new Error("Email or password is incorrect.");
  const session = sessionFromAccount(account);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
