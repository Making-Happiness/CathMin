import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sanitizeRichHtml } from "../lib/richText";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { ADMIN_ROLES, type AdminRole, type AdminSession, type CreateAccountInput, type MembershipApplication, type MembershipApplicationInput, type MinistryContent, type MinistryNotification, type PublishContentInput } from "./types";

const LOCAL_CONTENT_KEY = "cathmin.preview.content";
const LOCAL_APPLICATIONS_KEY = "cathmin.preview.applications";
const LOCAL_NOTIFICATIONS_KEY = "cathmin.preview.notifications";
const LOCAL_SESSION_KEY = "cathmin.preview.session";
const PREVIEW_REGISTRATION_PASSKEY_HASH = "d843d37bbec20335ca72f2c6b9d299372b163490d1d920a759844e15bdadb23f";

interface AdminContextValue {
  applications: MembershipApplication[];
  content: MinistryContent[];
  isConfigured: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  notifications: MinistryNotification[];
  publish: (input: PublishContentInput) => Promise<void>;
  refresh: () => Promise<void>;
  register: (input: CreateAccountInput) => Promise<void>;
  session: AdminSession | null;
  submitApplication: (input: MembershipApplicationInput) => Promise<void>;
}

interface PostRow {
  body_html: string;
  created_at: string;
  id: string;
  image_path: string | null;
  kind: MinistryContent["kind"];
  ministry: AdminRole;
  published_at: string;
  title: string;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function readLocal<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try { return JSON.parse(stored) as T; } catch { return fallback; }
}

function saveLocal<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && (ADMIN_ROLES as readonly string[]).includes(value);
}

async function isValidPreviewPasskey(passkey: string): Promise<boolean> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(passkey));
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return hash === PREVIEW_REGISTRATION_PASSKEY_HASH;
}

function isLivePost(item: MinistryContent): boolean {
  return item.kind !== "photo" || Date.now() - new Date(item.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
}

async function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.readAsDataURL(file);
  });
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => readLocal<AdminSession | null>(LOCAL_SESSION_KEY, null));
  const [content, setContent] = useState<MinistryContent[]>(() => readLocal<MinistryContent[]>(LOCAL_CONTENT_KEY, []).filter(isLivePost));
  const [applications, setApplications] = useState<MembershipApplication[]>(() => readLocal<MembershipApplication[]>(LOCAL_APPLICATIONS_KEY, []));
  const [notifications, setNotifications] = useState<MinistryNotification[]>(() => readLocal<MinistryNotification[]>(LOCAL_NOTIFICATIONS_KEY, []));
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadContent = useCallback(async () => {
    if (!supabase) {
      setContent(readLocal<MinistryContent[]>(LOCAL_CONTENT_KEY, []).filter(isLivePost));
      return;
    }
    const { data, error } = await supabase.from("live_posts").select("id,title,body_html,kind,ministry,image_path,published_at,created_at").order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    const items = await Promise.all(((data ?? []) as PostRow[]).map(async (row) => {
      let imageUrl: string | undefined;
      if (row.image_path) {
        const { data: signed } = await supabase.storage.from("ministry-media").createSignedUrl(row.image_path, 3600);
        imageUrl = signed?.signedUrl;
      }
      return { bodyHtml: row.body_html, createdAt: row.created_at, id: row.id, imageUrl, kind: row.kind, ministry: row.ministry, publishedAt: row.published_at, title: row.title };
    }));
    setContent(items);
  }, []);

  const loadAdminData = useCallback(async (activeSession: AdminSession) => {
    if (!supabase) {
      setApplications(readLocal<MembershipApplication[]>(LOCAL_APPLICATIONS_KEY, []).filter((item) => item.organization === activeSession.role));
      setNotifications(readLocal<MinistryNotification[]>(LOCAL_NOTIFICATIONS_KEY, []).filter((item) => item.recipientRole === activeSession.role));
      return;
    }
    const [applicationsResult, notificationsResult] = await Promise.all([
      supabase.from("membership_applications").select("id,full_name,course_program,year_level_section,contact_number,email,birthday,organization,facebook_profile,created_at").order("created_at", { ascending: false }),
      supabase.from("notifications").select("id,recipient_role,type,title,message,application_id,read_at,created_at").order("created_at", { ascending: false }),
    ]);
    if (applicationsResult.error) throw new Error(applicationsResult.error.message);
    if (notificationsResult.error) throw new Error(notificationsResult.error.message);
    setApplications((applicationsResult.data ?? []).map((row) => ({ birthday: row.birthday, contactNumber: row.contact_number, courseProgram: row.course_program, createdAt: row.created_at, email: row.email, facebookProfile: row.facebook_profile, fullName: row.full_name, id: row.id, organization: row.organization as AdminRole, yearLevelSection: row.year_level_section })));
    setNotifications((notificationsResult.data ?? []).map((row) => ({ applicationId: row.application_id ?? undefined, createdAt: row.created_at, id: row.id, message: row.message, readAt: row.read_at, recipientRole: row.recipient_role as AdminRole, title: row.title, type: row.type as MinistryNotification["type"] })));
  }, []);

  const restoreSupabaseSession = useCallback(async (): Promise<AdminSession | null> => {
    if (!supabase) return null;
    const { data: { session: authSession } } = await supabase.auth.getSession();
    if (!authSession) { setSession(null); return null; }
    const { data: profile, error } = await supabase.from("profiles").select("full_name,ministry_role").eq("id", authSession.user.id).single();
    if (error || !isAdminRole(profile?.ministry_role)) { setSession(null); return null; }
    const nextSession = { email: authSession.user.email ?? "", id: authSession.user.id, name: profile.full_name || authSession.user.email || "Ministry administrator", role: profile.ministry_role };
    setSession(nextSession);
    return nextSession;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (supabase) await restoreSupabaseSession();
      await loadContent();
    } finally { setLoading(false); }
  }, [loadContent, restoreSupabaseSession]);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { if (session) void loadAdminData(session); else { setApplications([]); setNotifications([]); } }, [loadAdminData, session]);
  useEffect(() => {
    if (!supabase || !session) return;
    const channel = supabase.channel(`ministry-notifications-${session.role}`).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `recipient_role=eq.${session.role}` },
      () => { void loadAdminData(session); },
    ).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [loadAdminData, session]);

  const login = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      if (!email.trim() || !password) throw new Error("Enter your email address and password.");
      const previewSession: AdminSession = { email: email.trim().toLowerCase(), id: crypto.randomUUID(), name: "Preview administrator", role: "BEC" };
      saveLocal(LOCAL_SESSION_KEY, previewSession);
      setSession(previewSession);
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.session) throw new Error(error?.message ?? "Unable to sign in.");
    const nextSession = await restoreSupabaseSession();
    if (!nextSession) { await supabase.auth.signOut(); throw new Error("This account has not been assigned a ministry administrator role."); }
  }, [restoreSupabaseSession]);

  const register = useCallback(async (input: CreateAccountInput) => {
    if (!input.passkey.trim()) throw new Error("Enter the registration passkey.");
    if (!supabase) {
      if (!(await isValidPreviewPasskey(input.passkey))) throw new Error("The registration passkey is invalid.");
      const previewSession: AdminSession = { email: input.email.trim().toLowerCase(), id: crypto.randomUUID(), name: input.name.trim(), role: "BEC" };
      saveLocal(LOCAL_SESSION_KEY, previewSession);
      setSession(previewSession);
      return;
    }
    const { error } = await supabase.functions.invoke("register-admin", {
      body: { email: input.email.trim(), fullName: input.name.trim(), passkey: input.passkey, password: input.password },
    });
    if (error) throw new Error("The account could not be created. Check the registration passkey and try again.");
  }, []);

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setSession(null);
  }, []);

  const submitApplication = useCallback(async (input: MembershipApplicationInput) => {
    const payload = { full_name: input.fullName.trim(), course_program: input.courseProgram.trim(), year_level_section: input.yearLevelSection.trim(), contact_number: input.contactNumber?.trim() || null, email: input.email.trim().toLowerCase(), birthday: input.birthday || null, organization: input.organization, facebook_profile: input.facebookProfile?.trim() || null };
    if (supabase) {
      const { error } = await supabase.from("membership_applications").insert(payload);
      if (error) throw new Error(error.message);
      return;
    }
    const application: MembershipApplication = { birthday: payload.birthday, contactNumber: payload.contact_number, courseProgram: payload.course_program, createdAt: new Date().toISOString(), email: payload.email, facebookProfile: payload.facebook_profile, fullName: payload.full_name, id: crypto.randomUUID(), organization: payload.organization, yearLevelSection: payload.year_level_section };
    const nextApplications = [application, ...readLocal<MembershipApplication[]>(LOCAL_APPLICATIONS_KEY, [])];
    const notification: MinistryNotification = { applicationId: application.id, createdAt: application.createdAt, id: crypto.randomUUID(), message: `${application.fullName} submitted an application for ${application.organization}.`, readAt: null, recipientRole: application.organization, title: "New membership application", type: "membership_application" };
    const nextNotifications = [notification, ...readLocal<MinistryNotification[]>(LOCAL_NOTIFICATIONS_KEY, [])];
    saveLocal(LOCAL_APPLICATIONS_KEY, nextApplications);
    saveLocal(LOCAL_NOTIFICATIONS_KEY, nextNotifications);
    if (session?.role === application.organization) { setApplications(nextApplications); setNotifications(nextNotifications); }
  }, [session]);

  const publish = useCallback(async (input: PublishContentInput) => {
    if (!session) throw new Error("Your session has expired. Please sign in again.");
    const bodyHtml = sanitizeRichHtml(input.bodyHtml);
    if (!bodyHtml) throw new Error("Add a message before publishing.");
    if (input.kind === "photo" && !input.image) throw new Error("A photo post needs an image.");
    if (supabase) {
      let imagePath: string | null = null;
      if (input.image) {
        const extension = input.image.type === "image/png" ? "png" : "jpg";
        imagePath = `${session.role}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("ministry-media").upload(imagePath, input.image, { contentType: input.image.type, upsert: false });
        if (uploadError) throw new Error(uploadError.message);
      }
      const { error } = await supabase.from("posts").insert({ body_html: bodyHtml, image_path: imagePath, kind: input.kind, ministry: session.role, published_by: session.id, title: input.title.trim() });
      if (error) throw new Error(error.message);
      await loadContent();
      return;
    }
    const item: MinistryContent = { bodyHtml, createdAt: new Date().toISOString(), id: crypto.randomUUID(), imageUrl: input.image ? await readImage(input.image) : undefined, kind: input.kind, ministry: session.role, publishedAt: new Date().toISOString(), title: input.title.trim() };
    const next = [item, ...readLocal<MinistryContent[]>(LOCAL_CONTENT_KEY, [])];
    saveLocal(LOCAL_CONTENT_KEY, next);
    setContent(next.filter(isLivePost));
  }, [loadContent, session]);

  const markNotificationRead = useCallback(async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error(error.message);
    }
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
  }, []);

  const value = useMemo<AdminContextValue>(() => ({ applications, content, isConfigured: isSupabaseConfigured, loading, login, logout, markNotificationRead, notifications, publish, refresh, register, session, submitApplication }), [applications, content, loading, login, logout, markNotificationRead, notifications, publish, refresh, register, session, submitApplication]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider.");
  return context;
}
