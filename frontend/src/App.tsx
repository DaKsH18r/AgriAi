import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { OfflineDetector } from "./components/OfflineDetector";

const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const GoogleCallbackPage = lazy(() =>
  import("./pages/GoogleCallbackPage").then((m) => ({
    default: m.GoogleCallbackPage,
  }))
);
const FeaturesPage = lazy(() =>
  import("./pages/FeaturesPage").then((m) => ({ default: m.FeaturesPage }))
);
const DocsPage = lazy(() =>
  import("./pages/DocsPage").then((m) => ({ default: m.DocsPage }))
);
const BlogPage = lazy(() =>
  import("./pages/BlogPage").then((m) => ({ default: m.BlogPage }))
);
const ContactPage = lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage }))
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage }))
);
const AlertsPage = lazy(() =>
  import("./pages/AlertsPage").then((m) => ({ default: m.AlertsPage }))
);
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((m) => ({ default: m.AdminPage }))
);
const ErrorPage = lazy(() =>
  import("./pages/ErrorPage").then((m) => ({ default: m.ErrorPage }))
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);

const DashboardOverview = lazy(() =>
  import("./components/DashboardOverview").then((m) => ({
    default: m.DashboardOverview,
  }))
);
const AgentDashboard = lazy(() => import("./components/AgentDashboard"));
const WeatherDashboard = lazy(() => import("./components/WeatherDashboard"));
const PricePrediction = lazy(() => import("./components/PricePrediction"));
const YieldPrediction = lazy(() => import("./components/YieldPrediction"));
const ChatBot = lazy(() => import("./components/ChatBot"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <OfflineDetector />
          <Suspense fallback={<PageLoader />}>
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
                path="/dashboard/chatbot"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ChatBot />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/alerts"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AlertsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Legacy /app Routes */}
              <Route
                path="/app"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/app/agent"
                element={<Navigate to="/dashboard/agent" replace />}
              />
              <Route
                path="/app/weather"
                element={<Navigate to="/dashboard/weather" replace />}
              />
              <Route
                path="/app/prices"
                element={<Navigate to="/dashboard/prices" replace />}
              />
              <Route
                path="/app/yield"
                element={<Navigate to="/dashboard/yield" replace />}
              />
              <Route
                path="/app/chatbot"
                element={<Navigate to="/dashboard/chatbot" replace />}
              />
              <Route
                path="/app/alerts"
                element={<Navigate to="/dashboard/alerts" replace />}
              />
              <Route
                path="/app/profile"
                element={<Navigate to="/dashboard/profile" replace />}
              />
              <Route
                path="/dashboard/admin"
                element={
                  <AdminRoute>
                    <DashboardLayout>
                      <AdminPage />
                    </DashboardLayout>
                  </AdminRoute>
                }
              />
              {/* Legacy redirect for /app/admin */}
              <Route
                path="/app/admin"
                element={<Navigate to="/dashboard/admin" replace />}
              />

              {/* Backward compatibility for old routes */}
              <Route
                path="/alerts"
                element={<Navigate to="/dashboard/alerts" replace />}
              />
              <Route
                path="/profile"
                element={<Navigate to="/dashboard/profile" replace />}
              />

              {/* Error Routes */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
