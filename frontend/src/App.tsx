import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { DashboardOverview } from "./components/DashboardOverview";
import AgentDashboard from "./components/AgentDashboard";
import WeatherDashboard from "./components/WeatherDashboard";
import PricePrediction from "./components/PricePrediction";
import YieldPrediction from "./components/YieldPrediction";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminPage } from "./pages/AdminPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { GoogleCallbackPage } from "./pages/GoogleCallbackPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { DocsPage } from "./pages/DocsPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ErrorPage } from "./pages/ErrorPage";
import { ProfilePage } from "./pages/ProfilePage";
import { FieldsPage } from "./pages/FieldsPage";
import { AlertsPage } from "./pages/AlertsPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { OfflineDetector } from "./components/OfflineDetector";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <OfflineDetector />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/auth/google/callback"
              element={<GoogleCallbackPage />}
            />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Dashboard Routes with Sidebar Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardOverview />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/agent"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AgentDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/weather"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <WeatherDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/prices"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PricePrediction />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/yield"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <YieldPrediction />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/yield-prediction"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <YieldPrediction />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fields"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FieldsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AlertsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin & Legacy Routes */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            <Route path="/app/admin" element={<AdminPage />} />

            {/* Error Routes */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
