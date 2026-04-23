import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AdminPage } from "./pages/AdminPage";
import { AiChatPage } from "./pages/AiChatPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecyclingPage } from "./pages/RecyclingPage";
import { RequestPage } from "./pages/RequestPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <AuthPage /> },
      {
        path: "dashboard",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
      },
      {
        path: "request",
        element: <ProtectedRoute><RequestPage /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
      },
      {
        path: "ai",
        element: <ProtectedRoute><AiChatPage /></ProtectedRoute>
      },
      { path: "recycling", element: <RecyclingPage /> },
      {
        path: "admin",
        element: <ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>
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
