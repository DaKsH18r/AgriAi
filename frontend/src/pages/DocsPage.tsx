import React from "react";
import { Link } from "react-router-dom";
import { Book, Cloud, TrendingUp, Shield, Code, Database } from "lucide-react";

export const DocsPage: React.FC = () => {
  const sections = [
    { icon: Book, title: "Getting Started", link: "#getting-started" },
    { icon: Cloud, title: "Weather API", link: "#weather" },
    { icon: TrendingUp, title: "Market Data", link: "#markets" },
    { icon: Shield, title: "Security & Privacy", link: "#security" },
    { icon: Code, title: "API Reference", link: "#api" },
    { icon: Database, title: "Data Sources", link: "#data" },
  ];

  return (
    <div className="min-h-screen bg-white flex">      <aside className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🌾</span>
            </div>
            <span className="font-bold gradient-text">AgriAI Docs</span>
          </Link>

          <nav className="space-y-2">
            {sections.map((section, idx) => (
              <a
                key={idx}
                href={section.link}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm transition text-gray-700 hover:text-green-600"
              >
                <section.icon size={18} />
                <span className="font-medium">{section.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>      <main className="flex-1 lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Everything you need to know about AgriAI Platform
          </p>          <section id="getting-started" className="mb-16 scroll-mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Getting Started
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-4">
                Welcome to AgriAI! This guide will help you get started with the
                platform.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Create your free account</li>
                <li>Add your first field with location and crop details</li>
                <li>Connect to weather data for your location</li>
                <li>Start receiving AI-powered recommendations</li>
              </ol>
            </div>
          </section>          <section id="weather" className="mb-16 scroll-mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Weather Intelligence
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-4">
              <h3 className="font-bold text-gray-900 mb-2">Data Sources</h3>
              <p className="text-gray-600 mb-4">
                We aggregate data from OpenWeatherMap, NOAA, and local weather
                stations to provide hyperlocal forecasts with 95% accuracy.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>7-day forecast with hourly breakdowns</li>
                <li>Rain probability and precipitation amounts</li>
                <li>Temperature highs/lows</li>
                <li>Wind speed and direction</li>
                <li>Humidity and UV index</li>
              </ul>
            </div>
          </section>          <section id="markets" className="mb-16 scroll-mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Market Data
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                Real-time and historical price data from 5000+ agricultural
                markets (mandis) across India.
              </p>
              <div className="bg-white rounded-lg p-4">
                <code className="text-sm text-gray-800">
                  GET /api/prices?commodity=rice&state=punjab
                </code>
              </div>
            </div>
          </section>          <section id="security" className="mb-16 scroll-mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Security & Privacy
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Your data security is our top priority. All data is encrypted in
                transit and at rest.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>End-to-end encryption (TLS 1.3)</li>
                <li>SOC 2 Type II compliant</li>
                <li>GDPR compliant</li>
                <li>Regular security audits</li>
                <li>Your data is never sold to third parties</li>
              </ul>
            </div>
          </section>          <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <Link
              to="/register"
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
