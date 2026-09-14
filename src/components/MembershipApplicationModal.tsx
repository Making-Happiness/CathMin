import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useAdmin } from "../admin/AdminContext";
import { ADMIN_ROLES, type AdminRole } from "../admin/types";

interface MembershipApplicationModalProps {
  initialOrganization?: AdminRole;
  onClose: () => void;
}

const initialForm = { birthday: "", contactNumber: "", courseProgram: "", email: "", facebookProfile: "", fullName: "", organization: "BEC" as AdminRole, yearLevelSection: "" };

export default function MembershipApplicationModal({ initialOrganization, onClose }: MembershipApplicationModalProps) {
  const { submitApplication } = useAdmin();
  const [form, setForm] = useState({ ...initialForm, organization: initialOrganization ?? initialForm.organization });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try { await submitApplication(form); setSubmitted(true); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Your application could not be submitted. Please try again."); }
    finally { setSubmitting(false); }
  };

  return <div className="fixed inset-0 z-[100] flex items-end bg-black/55 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="membership-form-title"><div className="max-h-[94dvh] w-full overflow-y-auto border bg-[#fff9f0] p-6 shadow-2xl sm:max-w-2xl sm:p-9" style={{ borderColor: "rgba(212,168,67,0.45)" }}><div className="flex items-start justify-between gap-5"><div><p className="text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.15em" }}>Sacred Heart Campus Ministries</p><h2 id="membership-form-title" className="mt-1 text-3xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>Membership application</h2></div><button className="btn-quiet cursor-pointer" onClick={onClose} type="button">Close</button></div>{submitted ? <div className="mt-8 border p-8 text-center" style={{ borderColor: "rgba(184,137,42,0.28)" }}><h3 className="text-2xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>Application received</h3><p className="mx-auto mt-3 max-w-md leading-7" style={{ color: "var(--color-stone)" }}>Your selected ministry has been notified. They will review your application and contact you using the details you provided.</p><button className="btn-primary mt-6 cursor-pointer" onClick={onClose} type="button">Done</button></div> : <form className="mt-8 space-y-5" onSubmit={submit}><div className="grid gap-5 sm:grid-cols-2"><Field label="Full Name" required><input autoComplete="name" className="admin-input" onChange={(event) => update("fullName", event.target.value)} required value={form.fullName} /></Field><Field label="Email Address" required><input autoComplete="email" className="admin-input" onChange={(event) => update("email", event.target.value)} required type="email" value={form.email} /></Field><Field label="Course/Program" required><input className="admin-input" onChange={(event) => update("courseProgram", event.target.value)} required value={form.courseProgram} /></Field><Field label="Year Level & Section" required><input className="admin-input" onChange={(event) => update("yearLevelSection", event.target.value)} required value={form.yearLevelSection} /></Field><Field label="Contact Number"><input autoComplete="tel" className="admin-input" onChange={(event) => update("contactNumber", event.target.value)} type="tel" value={form.contactNumber} /></Field><Field label="Birthday"><input className="admin-input" onChange={(event) => update("birthday", event.target.value)} type="date" value={form.birthday} /></Field></div><Field label="Organization" required><select className="admin-input" onChange={(event) => update("organization", event.target.value)} required value={form.organization}>{ADMIN_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select></Field><Field label="Facebook Name/Profile Link"><input className="admin-input" onChange={(event) => update("facebookProfile", event.target.value)} value={form.facebookProfile} /></Field>{error && <p className="text-sm" role="alert" style={{ color: "var(--color-burgundy)" }}>{error}</p>}<button className="btn-primary min-h-11 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Submitting application..." : "Submit application"}</button></form>}</div></div>;
}

function Field({ children, label, required = false }: { children: ReactNode; label: string; required?: boolean }) {
  return <label className="block text-xs uppercase" style={{ color: "var(--color-stone)", fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}><span className="mb-2 block">{label}{required ? " *" : ""}</span>{children}</label>;
}
