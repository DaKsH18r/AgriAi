import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Cloud,
  TrendingUp,
  Zap,
  Shield,
  Bell,
} from "lucide-react";

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Advisor",
      problem: "Struggling with complex farming decisions and crop management?",
      solution:
        "Our AI advisor analyzes your specific conditions and provides personalized recommendations",
      benefits: [
        "Chat with AI for instant farming advice",
        "Upload photos for disease detection",
        "Get step-by-step action plans",
        "Historical data analysis",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Cloud,
      title: "Weather Intelligence",
      problem: "Tired of inaccurate weather forecasts affecting your crops?",
      solution: "Hyperlocal weather data with AI-powered irrigation planning",
      benefits: [
        "7-day detailed forecasts",
        "Irrigation scheduling based on ET calculations",
        "Extreme weather alerts",
        "Rain probability tracking",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      problem: "Missing the best time to sell because of price fluctuations?",
      solution: "Real-time price tracking with predictive analytics",
      benefits: [
        "Live prices from 5000+ mandis",
        "30/90-day trend analysis",
        "Price alerts for your crops",
        "Best time to sell recommendations",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Yield Prediction",
      problem: "Uncertain about expected harvest and planning?",
      solution: "ML-based yield forecasting for better planning",
      benefits: [
        "Crop-specific predictions",
        "Historical yield comparisons",
        "Factor-based analysis",
        "Early warning for low yields",
      ],
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Disease Detection",
      problem: "Diseases spreading before you can identify them?",
      solution: "Instant AI diagnosis from crop photos",
      benefits: [
        "95%+ accurate detection",
        "Treatment recommendations",
        "Prevention tips",
        "Tracking disease progression",
      ],
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Bell,
      title: "24/7 Monitoring",
      problem: "Can't monitor your fields around the clock?",
      solution: "Autonomous AI agent watching your farm 24/7",
      benefits: [
        "Proactive alerts",
        "Multi-channel notifications",
        "Automated recommendations",
        "Daily briefings",
      ],
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Nav */}
      <nav className="fixed top-0 w-full glass border-b border-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌾</span>
            </div>
            <span className="text-xl font-bold gradient-text">AgriAI</span>
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Features Built for
            <span className="block gradient-text">Modern Farmers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive tools to help you make smarter decisions and grow
            better crops
          </p>
        </div>
      </section>

      {/* Features Detail */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-32">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-12 items-center`}
            >
              <div className="flex-1">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}
                >
                  <feature.icon className="text-white" size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-red-600 mb-2">The Problem</h3>
                    <p className="text-gray-600">{feature.problem}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-600 mb-2">
                      Our Solution
                    </h3>
                    <p className="text-gray-600">{feature.solution}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">
                      Key Benefits
                    </h3>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight
                            className="text-green-600 mt-1 flex-shrink-0"
                            size={18}
                          />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div
                  className={`w-full h-96 bg-gradient-to-br ${feature.color} rounded-2xl shadow-2xl flex items-center justify-center`}
                >
                  <feature.icon className="text-white opacity-20" size={120} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience These Features?
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            Start Free Trial
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};
