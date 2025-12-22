import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  CloudRain,
  TrendingUp,
} from "lucide-react";

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const locationState = useLocation();

  // Get the page user was trying to access before registration
  const from =
    (locationState.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(
        email,
        password,
        fullName || undefined,
        undefined,
        undefined
      );
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    const apiUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    window.location.href = `${apiUrl.replace(
      "/api",
      ""
    )}/api/auth/google/login`;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getInputClasses = (field: keyof typeof touched, value: string) => {
    const isInvalid = touched[field] && !value;

    if (isInvalid) {
      return `w-full px-4 py-2.5 ${
        field === "password" ? "pr-12" : ""
      } bg-white/50 border-2 border-red-400 rounded-lg transition-all text-slate-900 placeholder-slate-400 text-sm [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-red-400 [&:focus]:shadow-none`;
    }

    return `w-full px-4 py-2.5 ${
      field === "password" ? "pr-12" : ""
    } bg-white/50 border-2 border-slate-300 rounded-lg transition-all text-slate-900 placeholder-slate-400 text-sm [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-emerald-500 [&:focus]:shadow-none`;
  };

  return (
    <div className="h-screen flex overflow-hidden relative bg-white">
      {/* Left Panel - Marketing & Brand */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-800">
        {/* Farm Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-emerald-900/85"></div>
          {/* Subtle fade at right edge */}
          <div className="absolute inset-y-0 -right-px w-8 bg-gradient-to-r from-transparent to-emerald-900"></div>
        </div>

        {/* Dot Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* Subtle glow at edge */}
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent"></div>

        {/* Animated Glowing Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-32 right-20 w-80 h-80 bg-lime-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-8">
          {/* Logo */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <span className="text-4xl">🌾</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Cultivate a<br />
            Smarter Future
          </h1>
          <p className="text-emerald-100 text-base mb-8 leading-relaxed">
            Join thousands of farmers leveraging AI to maximize yields and
            optimize operations.
          </p>

          {/* Feature List */}
          <div className="space-y-4">
            <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-default">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-emerald-400/30">
                <Sparkles className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-0.5">
                  AI-Powered Insights
                </h3>
                <p className="text-emerald-200 text-xs">
                  Get personalized recommendations for crop management and pest
                  control.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-default">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-emerald-400/30">
                <CloudRain className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-0.5">
                  Weather Forecasting
                </h3>
                <p className="text-emerald-200 text-xs">
                  Hyper-local weather predictions to plan your farming
                  activities.
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-default">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-emerald-400/30">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-0.5">
                  Market Alerts
                </h3>
                <p className="text-emerald-200 text-xs">
                  Real-time price updates and market trends to sell at the best
                  time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 lg:w-[58%] relative overflow-y-auto bg-gradient-to-br from-slate-50 to-white">
        {/* Form Container */}
        <div className="relative z-10 min-h-full flex items-center justify-center p-4 py-6">
          {/* Clean white card */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-1.5">
                Create Your Account
              </h2>
              <p className="text-slate-600 text-sm">
                Start your smart farming journey today
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-6 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/70 text-slate-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => handleBlur("firstName")}
                    required
                    className={getInputClasses("firstName", firstName)}
                    placeholder=""
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={() => handleBlur("lastName")}
                    required
                    className={getInputClasses("lastName", lastName)}
                    placeholder=""
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  required
                  className={getInputClasses("email", email)}
                  placeholder=""
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    required
                    minLength={8}
                    className={getInputClasses("password", password)}
                    placeholder=""
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-2 focus:ring-emerald-500/50"
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
