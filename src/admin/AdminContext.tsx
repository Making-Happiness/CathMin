import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authenticateAdmin, clearStoredSession, getStoredSession, registerAdmin } from "./security";
import type { AdminSession, CreateAccountInput, MinistryContent, PublishContentInput } from "./types";

const CONTENT_KEY = "cathmin.ministry.content";

interface AdminContextValue {
  content: MinistryContent[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  publish: (input: PublishContentInput) => void;
  register: (input: CreateAccountInput) => Promise<void>;
  session: AdminSession | null;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function getStoredContent(): MinistryContent[] {
  const stored = localStorage.getItem(CONTENT_KEY);
  return stored ? (JSON.parse(stored) as MinistryContent[]) : [];
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(getStoredSession);
  const [content, setContent] = useState<MinistryContent[]>(getStoredContent);

  useEffect(() => localStorage.setItem(CONTENT_KEY, JSON.stringify(content)), [content]);

  const value = useMemo<AdminContextValue>(() => ({
    content,
    session,
    login: async (email, password) => setSession(await authenticateAdmin(email, password)),
    register: async (input) => setSession(await registerAdmin(input)),
    logout: () => { clearStoredSession(); setSession(null); },
    publish: (input) => {
      if (!session) throw new Error("Your session has expired. Please sign in again.");
      const item: MinistryContent = { ...input, id: crypto.randomUUID(), ministry: session.role, publishedAt: new Date().toISOString() };
      setContent((items) => [item, ...items]);
    },
  }), [content, session]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider.");
  return context;
}
