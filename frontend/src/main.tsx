import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const LandingPage = lazy(() => import("./pages/LandingPage").then((module) => ({ default: module.LandingPage })));
const AuthPage = lazy(() => import("./pages/AuthPage").then((module) => ({ default: module.AuthPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const RequestPage = lazy(() => import("./pages/RequestPage").then((module) => ({ default: module.RequestPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const AiChatPage = lazy(() => import("./pages/AiChatPage").then((module) => ({ default: module.AiChatPage })));
const RecyclingPage = lazy(() => import("./pages/RecyclingPage").then((module) => ({ default: module.RecyclingPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then((module) => ({ default: module.AdminPage })));

function RouteLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center px-4">
      <div className="rounded-lg border border-black/10 bg-white/70 px-5 py-4 text-sm font-semibold shadow-sm dark:border-white/10 dark:bg-white/10">
        Loading...
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Suspense fallback={<RouteLoader />}><LandingPage /></Suspense> },
      { path: "login", element: <Suspense fallback={<RouteLoader />}><AuthPage /></Suspense> },
      {
        path: "dashboard",
        element: <ProtectedRoute><Suspense fallback={<RouteLoader />}><DashboardPage /></Suspense></ProtectedRoute>
      },
      {
        path: "request",
        element: <ProtectedRoute><Suspense fallback={<RouteLoader />}><RequestPage /></Suspense></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><Suspense fallback={<RouteLoader />}><ProfilePage /></Suspense></ProtectedRoute>
      },
      {
        path: "ai",
        element: <ProtectedRoute><Suspense fallback={<RouteLoader />}><AiChatPage /></Suspense></ProtectedRoute>
      },
      { path: "recycling", element: <Suspense fallback={<RouteLoader />}><RecyclingPage /></Suspense> },
      {
        path: "admin",
        element: <ProtectedRoute role="admin"><Suspense fallback={<RouteLoader />}><AdminPage /></Suspense></ProtectedRoute>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "8px" } }} />
    </AuthProvider>
  </React.StrictMode>
);
