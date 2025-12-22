import { useState } from "react";
import {
  TrendingUp,
  Loader,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  BarChart3,
  MapPin,
  Calendar,
} from "lucide-react";
import { agentAPI } from "../services/api";
import type { AgentAnalysis } from "../services/api";

// Main Component
export default function AgentDashboard() {
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [selectedDays, setSelectedDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AgentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const crops = [
    { value: "wheat", label: "🌾 Wheat" },
    { value: "rice", label: "🌾 Rice" },
    { value: "tomato", label: "🍅 Tomato" },
    { value: "onion", label: "🧅 Onion" },
    { value: "potato", label: "🥔 Potato" },
    { value: "corn", label: "🌽 Corn" },
  ];

  const cities = [
    { value: "Delhi", label: "Delhi" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Pune", label: "Pune" },
    { value: "Hyderabad", label: "Hyderabad" },
  ];

  const dayOptions = [
    { value: 7, label: "7 Days" },
    { value: 30, label: "30 Days" },
    { value: 90, label: "90 Days" },
    { value: 180, label: "180 Days" },
  ];

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await agentAPI.analyzeCrop(selectedCrop, selectedCity, selectedDays);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "SELL_NOW":
        return "text-red-600 bg-red-50 border-red-200";
      case "WAIT":
        return "text-green-600 bg-green-50 border-green-200";
      case "HOLD":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "SELL_NOW":
        return AlertTriangle;
      case "WAIT":
        return CheckCircle;
      case "HOLD":
        return Clock;
      default:
        return Target;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <BarChart3 size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌾 AI Crop Advisor
          </h1>
          <p className="text-gray-600 text-lg">
            Smart price predictions to maximize your profits
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Crop Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🌾 Select Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-base font-medium"
              >
                {crops.map((crop) => (
                  <option key={crop.value} value={crop.value}>
                    {crop.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <MapPin size={16} /> Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-base font-medium"
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Calendar size={16} /> Forecast Period
              </label>
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-base font-medium"
              >
                {dayOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <Loader size={24} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp size={24} />
                Get Recommendation
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Analysis Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results Card */}
        {analysis && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Action Header */}
            <div
              className={`p-6 border-b-4 ${getActionColor(
                analysis.decision.action
              )}`}
            >
              <div className="flex items-center gap-4">
                {(() => {
                  const Icon = getActionIcon(analysis.decision.action);
                  return <Icon size={48} className="flex-shrink-0" />;
                })()}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-1">
                    {analysis.decision.action.replace("_", " ")}
                  </h2>
                  <p className="text-base opacity-90">
                    Confidence: {Math.round(analysis.decision.confidence * 100)}% •{" "}
                    Risk: {analysis.decision.risk_level}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Current Price
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{analysis.current_price}
                    <span className="text-base font-normal text-gray-600">/kg</span>
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-sm">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Predicted Price ({analysis.days_ahead || selectedDays} days)
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{analysis.predicted_price || "N/A"}
                    <span className="text-base font-normal text-gray-600">/kg</span>
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Profit Potential
                  </p>
                  {analysis.predicted_price ? (
                    <>
                      <p
                        className={`text-3xl font-bold ${
                          analysis.predicted_price > analysis.current_price
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {analysis.predicted_price > analysis.current_price ? "+" : ""}
                        ₹{(analysis.predicted_price - analysis.current_price).toFixed(2)}
                        <span className="text-base font-normal text-gray-600">/kg</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(
                          ((analysis.predicted_price - analysis.current_price) /
                            analysis.current_price) *
                          100
                        ).toFixed(1)}
                        % change
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl text-gray-500">N/A</p>
                  )}
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-6 border-t-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Target size={20} />
                Why This Recommendation?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {analysis.decision.reason}
              </p>
            </div>

            {/* Best Action Date */}
            {analysis.decision.best_action_date && (
              <div className="p-6 bg-blue-50 border-t-2 border-blue-100">
                <div className="flex items-start gap-3">
                  <Clock size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-1">
                      Best Time to Act
                    </h3>
                    <p className="text-2xl font-bold text-blue-700">
                      {analysis.decision.best_action_date}
                    </p>
                    {analysis.decision.expected_price && (
                      <p className="text-blue-600 mt-1">
                        Expected price: ₹{analysis.decision.expected_price}/kg
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* LLM Insights */}
            {analysis.llm_insights && (
              <div className="p-6 bg-green-50 border-t-2 border-green-100">
                <h3 className="text-lg font-bold text-green-900 mb-3">
                  💬 Expert Advice
                </h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {analysis.llm_insights}
                </p>
              </div>
            )}

            {/* Market Signals */}
            {analysis.market_signals && analysis.market_signals.length > 0 && (
              <div className="p-6 border-t-2 border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Market Signals
                </h3>
                <div className="space-y-3">
                  {analysis.market_signals.slice(0, 4).map((signal: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {signal.signal_type}
                        </p>
                        <p className="text-sm text-gray-600">{signal.explanation}</p>
                      </div>
                      <div className="ml-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{signal.signal}</p>
                          <p className="text-sm text-gray-600">
                            {Math.round(signal.strength * 100)}% confidence
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Footer */}
        {!analysis && !loading && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Target size={20} />
              How It Works
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Select your crop, location, and forecast period</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Our AI analyzes historical data, weather, and market trends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Get instant recommendations on when to sell for maximum profit</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
