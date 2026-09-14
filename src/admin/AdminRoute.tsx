import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdmin } from "./AdminContext";

export default function AdminRoute() {
  const { loading, session } = useAdmin();
  const location = useLocation();
  if (loading) return <main className="flex min-h-dvh items-center justify-center" style={{ backgroundColor: "var(--color-ink)", color: "var(--color-parchment)" }}>Loading administrator session...</main>;
  return session ? <Outlet /> : <Navigate replace to="/admin/login" state={{ from: location.pathname }} />;
}
