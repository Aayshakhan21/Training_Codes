// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/shared/Navbar";
import AIChatbotWidget from "./components/ai/AIChatbotWidget";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import HomePage               from "./pages/HomePage";
import LoginPage              from "./pages/LoginPage";
import RegisterPage           from "./pages/RegisterPage";
import AppListingPage         from "./pages/AppListingPage";
import AppDetailsPage         from "./pages/AppDetailsPage";
import SearchResultsPage      from "./pages/SearchResultsPage";
import RecommendationsPage    from "./pages/RecommendationsPage";
import DeveloperDashboardPage from "./pages/DeveloperDashboardPage";
import AdminDashboardPage     from "./pages/AdminDashboardPage";
import UploadAppPage          from "./pages/UploadAppPage";
import ProfilePage            from "./pages/ProfilePage";
import DownloadsPage          from "./pages/DownloadsPage";
import ForgotPasswordPage     from "./pages/ForgotPasswordPage";
import ResetPasswordPage      from "./pages/ResetPasswordPage";
import VerifyEmailPage        from "./pages/VerifyEmailPage";
import BookmarksPage          from "./pages/BookmarksPage";
import NotificationsPage      from "./pages/NotificationsPage";
import NotFoundPage           from "./pages/NotFoundPage";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-900 font-body">
      <Navbar />
      <main>{children}</main>
      <AIChatbotWidget />
      <footer className="border-t border-white/5 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          © 2026 AppVerse AI · Built with React, Spring Boot, and AI
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e1e30",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Layout-wrapped routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/apps" element={<Layout><AppListingPage /></Layout>} />
            <Route path="/apps/:id" element={<Layout><AppDetailsPage /></Layout>} />
            <Route path="/search" element={<Layout><SearchResultsPage /></Layout>} />

            {/* Protected – any authenticated user */}
            <Route path="/recommendations" element={
              <ProtectedRoute>
                <Layout><RecommendationsPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><ProfilePage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/downloads" element={
              <ProtectedRoute>
                <Layout><DownloadsPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <Layout><BookmarksPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Layout><NotificationsPage /></Layout>
              </ProtectedRoute>
            } />

            {/* Protected – Developer + Admin */}
            <Route path="/developer" element={
              <ProtectedRoute roles={["DEVELOPER", "ADMIN"]}>
                <Layout><DeveloperDashboardPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/developer/upload" element={
              <ProtectedRoute roles={["DEVELOPER", "ADMIN"]}>
                <Layout><UploadAppPage /></Layout>
              </ProtectedRoute>
            } />

            {/* Protected – Admin only */}
            <Route path="/admin" element={
              <ProtectedRoute roles={["ADMIN"]}>
                <Layout><AdminDashboardPage /></Layout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
