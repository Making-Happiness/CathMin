export const ADMIN_ROLES = ["BEC", "CFD", "YFC"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
export type ContentKind = "photo" | "article" | "announcement";

export interface AdminAccount {
  email: string;
  name: string;
  passwordHash: string;
  role: AdminRole;
  salt: string;
}

export interface AdminSession {
  email: string;
  name: string;
  role: AdminRole;
}

export interface MinistryContent {
  body: string;
  id: string;
  imageDataUrl?: string;
  kind: ContentKind;
  ministry: AdminRole;
  publishedAt: string;
  title: string;
}

export interface CreateAccountInput {
  email: string;
  name: string;
  passkey: string;
  password: string;
  role: AdminRole;
}

export interface PublishContentInput {
  body: string;
  imageDataUrl?: string;
  kind: ContentKind;
  title: string;
}
