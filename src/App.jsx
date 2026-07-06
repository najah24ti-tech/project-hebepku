import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Loading from "./components/Loading";
import "./assets/tailwind.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const DataPenjualan = React.lazy(() => import("./pages/DataPenjualan"));
const InputPenjualan = React.lazy(() => import("./pages/InputPenjualan"));
const KelolaAkun = React.lazy(() => import("./pages/KelolaAkun"));
const Logout = React.lazy(() => import("./pages/Logout"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const Login = React.lazy(() => import("./pages/auth/Login"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Redirect awal */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner", "leader", "ba"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kelola-akun"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <KelolaAkun />
              </ProtectedRoute>
            }
          />

          <Route
            path="/data-penjualan"
            element={
              <ProtectedRoute allowedRoles={["owner", "leader", "ba"]}>
                <DataPenjualan />
              </ProtectedRoute>
            }
          />

          <Route
            path="/input-penjualan"
            element={
              <ProtectedRoute allowedRoles={["ba"]}>
                <InputPenjualan />
              </ProtectedRoute>
            }
          />

          {/* Logout */}
          <Route
            path="/logout"
            element={
              <ProtectedRoute allowedRoles={["owner", "leader", "ba"]}>
                <Logout />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Halaman Tidak Ditemukan */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
