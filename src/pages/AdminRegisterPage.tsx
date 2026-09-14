import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../admin/AdminContext";
import { ADMIN_ROLES, type AdminRole } from "../admin/types";
import { AuthField, AuthShell } from "./AdminLoginPage";

export default function AdminRegisterPage() {
  const { register } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ confirmPassword: "", email: "", name: "", passkey: "", password: "", role: "BEC" as AdminRole });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setSubmitting(true); setError("");
    try { await register(form); navigate("/admin", { replace: true }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to create the account."); }
    finally { setSubmitting(false); }
  };

  return <AuthShell eyebrow="Authorized onboarding" title="Create an admin account">
    <form className="space-y-4" onSubmit={submit}>
      <AuthField label="Full name"><input autoComplete="name" className="admin-input" onChange={(event) => update("name", event.target.value)} required value={form.name} /></AuthField>
      <AuthField label="Ministry role"><select className="admin-input" onChange={(event) => update("role", event.target.value)} value={form.role}>{ADMIN_ROLES.map((role) => <option key={role}>{role}</option>)}</select></AuthField>
      <AuthField label="Email address"><input autoComplete="email" className="admin-input" onChange={(event) => update("email", event.target.value)} required type="email" value={form.email} /></AuthField>
      <AuthField label="Authorization passkey"><input autoComplete="off" className="admin-input" onChange={(event) => update("passkey", event.target.value)} required type="password" value={form.passkey} /></AuthField>
      <AuthField label="Password — at least 12 characters"><input autoComplete="new-password" className="admin-input" minLength={12} onChange={(event) => update("password", event.target.value)} required type="password" value={form.password} /></AuthField>
      <AuthField label="Confirm password"><input autoComplete="new-password" className="admin-input" minLength={12} onChange={(event) => update("confirmPassword", event.target.value)} required type="password" value={form.confirmPassword} /></AuthField>
      {error && <p role="alert" className="text-sm" style={{ color: "var(--color-burgundy)" }}>{error}</p>}
      <button className="btn-primary min-h-11 w-full cursor-pointer disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Creating account…" : "Create authorized account"}</button>
    </form>
    <p className="mt-7 text-center text-sm" style={{ color: "var(--color-stone)" }}>Already registered? <Link className="underline" style={{ color: "var(--color-burgundy)" }} to="/admin/login">Sign in</Link></p>
  </AuthShell>;
}
