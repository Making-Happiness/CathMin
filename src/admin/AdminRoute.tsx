import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdmin } from "./AdminContext";

export default function AdminRoute() {
  const { session } = useAdmin();
  const location = useLocation();
  return session ? <Outlet /> : <Navigate replace to="/admin/login" state={{ from: location.pathname }} />;
}
