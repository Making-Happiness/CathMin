export const ADMIN_ROLES = ["BEC", "CFD", "YFC"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
export type ContentKind = "photo" | "article" | "announcement";

export interface AdminSession {
  email: string;
  id: string;
  name: string;
  role: AdminRole;
}

export interface MinistryContent {
  bodyHtml: string;
  createdAt: string;
  id: string;
  imageUrl?: string;
  kind: ContentKind;
  ministry: AdminRole;
  publishedAt: string;
  title: string;
}

export interface MembershipApplication {
  birthday: string | null;
  contactNumber: string | null;
  courseProgram: string;
  createdAt: string;
  email: string;
  facebookProfile: string | null;
  fullName: string;
  id: string;
  organization: AdminRole;
  yearLevelSection: string;
}

export interface MembershipApplicationInput {
  birthday?: string;
  contactNumber?: string;
  courseProgram: string;
  email: string;
  facebookProfile?: string;
  fullName: string;
  organization: AdminRole;
  yearLevelSection: string;
}

export interface MinistryNotification {
  applicationId?: string;
  createdAt: string;
  id: string;
  message: string;
  readAt: string | null;
  recipientRole: AdminRole;
  title: string;
  type: "membership_application" | "system";
}

export interface CreateAccountInput {
  email: string;
  name: string;
  password: string;
}

export interface PublishContentInput {
  bodyHtml: string;
  image?: File;
  kind: ContentKind;
  title: string;
}
