import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../admin/AdminContext";

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const destination = (location.state as { from?: string } | null)?.from ?? "/admin";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try { await login(email, password); navigate(destination, { replace: true }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to sign in."); }
    finally { setSubmitting(false); }
  };

  return <AuthShell eyebrow="Administrator access" title="Sign in to the ministry desk">
    <form className="space-y-5" onSubmit={submit}>
      <AuthField label="Email address"><input autoComplete="email" className="admin-input" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></AuthField>
      <AuthField label="Password"><input autoComplete="current-password" className="admin-input" minLength={12} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></AuthField>
      {error && <p role="alert" className="text-sm" style={{ color: "var(--color-burgundy)" }}>{error}</p>}
      <button className="btn-primary min-h-11 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Signing in…" : "Sign in securely"}</button>
    </form>
    <p className="mt-7 text-center text-sm" style={{ color: "var(--color-stone)" }}>Need an authorized account? <Link className="underline" style={{ color: "var(--color-burgundy)" }} to="/admin/register">Register an administrator</Link></p>
  </AuthShell>;
}

export function AuthShell({ children, eyebrow, title }: { children: ReactNode; eyebrow: string; title: string }) {
  return <main className="flex min-h-dvh items-center justify-center px-6 py-16" style={{ backgroundColor: "var(--color-ink)" }}><section className="w-full max-w-md border p-7 shadow-2xl sm:p-10" style={{ backgroundColor: "var(--color-parchment)", borderColor: "rgba(212,168,67,0.45)" }}><Link className="text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }} to="/">← Parish home</Link><p className="mt-9 text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}>{eyebrow}</p><h1 className="mt-2 text-4xl leading-tight" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{title}</h1><div className="gold-rule mt-5" /><div className="mt-8">{children}</div></section></main>;
}

export function AuthField({ children, label }: { children: ReactNode; label: string }) {
  return <label className="block text-xs uppercase" style={{ color: "var(--color-stone)", fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}><span className="mb-2 block">{label}</span>{children}</label>;
}
