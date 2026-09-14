import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminProvider } from "./admin/AdminContext";
import AdminRoute from "./admin/AdminRoute";
import MainLayout from "./components/MainLayout";
import ScrollToAnchor from "./components/ScrollToAnchor";
import { MINISTRY_DETAILS } from "./data/ministries";
import HomePage from "./pages/HomePage";
import MinistryPage from "./pages/MinistryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import StoriesPage from "./pages/StoriesPage";

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <ScrollToAnchor />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ministries/cfd" element={<MinistryPage ministry={MINISTRY_DETAILS.cfd} />} />
            <Route path="/ministries/bec" element={<MinistryPage ministry={MINISTRY_DETAILS.bec} />} />
            <Route path="/ministries/yfc" element={<MinistryPage ministry={MINISTRY_DETAILS.yfc} />} />
            <Route path="/stories" element={<StoriesPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
