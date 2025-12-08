import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWebVitals } from "../hooks/useWebVitals";
import {
  ArrowRight,
  CheckCircle,
  Cloud,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  ChevronDown,
  FileText,
  BookOpen,
  Mail,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  // Monitor Web Vitals in production
  useWebVitals();

  // Track scroll for navbar shrink effect
  const [isScrolled, setIsScrolled] = useState(false);

  // Track active section for link highlighting
  const [activeSection, setActiveSection] = useState("");

  // Track dropdown states
  const [productsOpen, setProductsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    const handleScroll = () => {
      // Shrink navbar after 50px scroll
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ["features", "pricing"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 bg-[#1B5E20] text-white font-semibold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `,
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full bg-white border-b border-[#DDE2E0] z-50 transition-all duration-300 ${
          isScrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.05)]" : ""
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo Section - Clean Enterprise */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center transition-all">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-[#0A0D0B] leading-tight tracking-tight">
                  AgriAI
                </span>
                <span className="text-xs text-[#3B423F] font-medium leading-tight">
                  Smart Farming Platform
                </span>
              </div>
            </Link>

            {/* Center Navigation - Clean Pills */}
            <div className="hidden lg:flex items-center gap-1 bg-[#F4F6F5] rounded-full px-2 py-2">
              {/* Products Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1">
                  Products
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      productsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {productsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-[#DDE2E0] py-2 z-50 animate-fadeIn">
                    <Link
                      to="/dashboard/agent"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Brain size={20} className="text-purple-600" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          AI Advisor
                        </div>
                        <div className="text-xs text-gray-500">
                          Smart recommendations
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/dashboard/weather"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Cloud size={20} className="text-blue-600" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Weather Intelligence
                        </div>
                        <div className="text-xs text-gray-500">
                          Accurate forecasts
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/dashboard/prices"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <TrendingUp size={20} className="text-green-600" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Price Tracking
                        </div>
                        <div className="text-xs text-gray-500">
                          Market insights
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/dashboard/yield-prediction"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Zap size={20} className="text-yellow-600" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Yield Prediction
                        </div>
                        <div className="text-xs text-gray-500">
                          Forecast harvest
                        </div>
                      </div>
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <a
                        href="#features"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
                      >
                        View All Features
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Features Link */}
              <a
                href="#features"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 ${
                  activeSection === "features"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Features
              </a>

              {/* Pricing Link */}
              <a
                href="#pricing"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 ${
                  activeSection === "pricing"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Pricing
              </a>

              {/* Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1">
                  Resources
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      resourcesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {resourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                    <Link
                      to="/docs"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <BookOpen size={18} className="text-blue-600" />
                      <div className="text-sm font-semibold text-gray-900">
                        Documentation
                      </div>
                    </Link>
                    <Link
                      to="/blog"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <FileText size={18} className="text-purple-600" />
                      <div className="text-sm font-semibold text-gray-900">
                        Blog
                      </div>
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Mail size={18} className="text-green-600" />
                      <div className="text-sm font-semibold text-gray-900">
                        Contact
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right CTA Section - Clean */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:rounded-lg"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#124218] text-white text-sm font-semibold rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-2 flex items-center gap-2"
              >
                Get Started
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="main-content"
        className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#f5fdf8] pt-[calc(80px+4rem)] pb-40"
        role="main"
        aria-label="Hero section"
      >
        {/* Background Container - Full Width */}
        <div className="absolute inset-0 w-full h-full">
          {/* Background Image - Full width, bottom aligned, extends below viewport */}
          {/* Responsive WebP images with fallback - 90% smaller than original PNG */}
          <picture>
            <source
              media="(max-width: 480px)"
              srcSet="/images/optimized/image-480w.webp"
              type="image/webp"
            />
            <source
              media="(max-width: 768px)"
              srcSet="/images/optimized/image-768w.webp"
              type="image/webp"
            />
            <source
              media="(max-width: 1400px)"
              srcSet="/images/optimized/image-1400w.webp"
              type="image/webp"
            />
            <source
              srcSet="/images/optimized/image-1920w.webp"
              type="image/webp"
            />
            <img
              src="/images/image.png"
              alt="Farmers working in agricultural fields with modern farming equipment and lush green crops"
              className="absolute bottom-0 left-0 w-full h-auto min-h-[120%] object-cover opacity-30"
              style={{ objectPosition: "center bottom" }}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          {/* Light Overlay */}
          <div className="absolute inset-0 bg-[#F4F6F5]/80"></div>

          {/* Pattern Overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(46, 125, 50, 0.05) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto text-center w-full relative z-10 px-4">
          <div className="animate-fadeIn">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full shadow-sm mb-8">
              <span className="text-lg">🌱</span>
              <span className="text-sm font-semibold text-gray-700">
                Trusted by 10,000+ farmers worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              The AI Platform
              <span className="block mt-2 text-[#1B5E20]">for Agriculture</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-4 max-w-3xl mx-auto font-medium">
              Turn farm data into actionable intelligence.
            </p>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
              Predict yields, optimize inputs, and automate scouting with
              production-grade AI agents built for modern farming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/register"
                className="group bg-[#1B5E20] hover:bg-[#124218] text-white px-8 py-3.5 rounded-lg font-semibold text-base shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-2"
              >
                Schedule Demo
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/features"
                className="bg-transparent text-gray-900 px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-white/50 transform hover:-translate-y-0.5 transition-all duration-300 border-2 border-gray-300 hover:border-[#1B5E20] min-w-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-2"
              >
                Explore Platform
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-[#1B5E20]" />
                <span className="text-sm font-semibold text-gray-700">
                  95% Prediction Accuracy
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-[#1B5E20]" />
                <span className="text-sm font-semibold text-gray-700">
                  30% Yield Increase
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-[#1B5E20]" />
                <span className="text-sm font-semibold text-gray-700">
                  24/7 AI Monitoring
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern farmers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: Brain,
                title: "AI-Powered Advisor",
                description:
                  "Get personalized recommendations for your crops, diseases, and farming decisions in real-time",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Cloud,
                title: "Weather Intelligence",
                description:
                  "Accurate forecasts, irrigation planning, and extreme weather alerts tailored to your fields",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: TrendingUp,
                title: "Market Insights",
                description:
                  "Real-time price tracking, trends analysis, and alerts to help you sell at the best time",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Zap,
                title: "Yield Prediction",
                description:
                  "ML-based forecasts to help you plan better and maximize your harvest potential",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Shield,
                title: "Disease Detection",
                description:
                  "Upload photos of your crops and get instant AI diagnosis with treatment recommendations",
                color: "from-red-500 to-pink-500",
              },
              {
                icon: CheckCircle,
                title: "24/7 Monitoring",
                description:
                  "Autonomous AI agent continuously monitors your fields and sends proactive alerts",
                color: "from-indigo-500 to-purple-500",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="w-14 h-14 bg-[#1B5E20] rounded-xl flex items-center justify-center mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-[#F4F6F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <p className="text-gray-600">Forever free</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "1 Field",
                  "Basic weather forecasts",
                  "Price tracking",
                  "Community support",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#1B5E20] rounded-2xl p-8 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transform scale-105 border-2 border-[#66BB6A]">
              <div className="text-center mb-6">
                <div className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-2">$29</div>
                <p className="text-green-100">per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited fields",
                  "AI advisor",
                  "Disease detection",
                  "Market alerts",
                  "Yield predictions",
                  "Priority support",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-white" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Team Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Team</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$99</div>
                <p className="text-gray-600">per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Pro",
                  "10 team members",
                  "Admin dashboard",
                  "API access",
                  "Custom integrations",
                  "24/7 support",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "How accurate are the AI predictions?",
                a: "Our AI models are trained on millions of data points and achieve 90%+ accuracy. We continuously improve them with real farmer feedback.",
              },
              {
                q: "Can I use it on my mobile phone?",
                a: "Yes! Our platform is fully responsive and works great on all devices. We also have native mobile apps coming soon.",
              },
              {
                q: "What if I need help?",
                a: "We offer email support for all users, and priority support for Pro and Team plans. Our community forum is also very active.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use industry-standard encryption and never share your data with third parties. Your farm data belongs to you.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. No long-term commitments required.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#1B5E20]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-10">
            Join thousands of farmers already using AgriAI to grow smarter
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Start Your Free Trial
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#1B5E20] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🌾</span>
                </div>
                <span className="text-xl font-bold text-white">AgriAI</span>
              </div>
              <p className="text-sm text-gray-400">
                Smart farming solutions powered by AI
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-green-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-green-400 transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-green-400 transition">
                    Docs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/status"
                    className="hover:text-green-400 transition"
                  >
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/blog" className="hover:text-green-400 transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-green-400 transition"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-green-400 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 AgriAI Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
