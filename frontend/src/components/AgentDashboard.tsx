import { useState, useEffect } from "react";
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
  Share2,
  Download,
  History,
  Zap,
  Calculator,
  RefreshCw,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { agentAPI, priceAPI } from "../services/api";
import type { AgentAnalysis } from "../services/api";

// Types
interface HistoryItem {
  id: string;
  crop: string;
  city: string;
  days: number;
  timestamp: string;
  result: AgentAnalysis;
}

interface ChartDataPoint {
  date: string;
  historical?: number;
  predicted?: number;
}

// Main Component
export default function AgentDashboard() {
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [selectedDays, setSelectedDays] = useState(7);
  const [quantity, setQuantity] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AgentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);

  const crops = [
    { value: "wheat", label: "🌾 Wheat", icon: "🌾" },
    { value: "rice", label: "🌾 Rice", icon: "🌾" },
    { value: "tomato", label: "🍅 Tomato", icon: "🍅" },
    { value: "onion", label: "🧅 Onion", icon: "🧅" },
    { value: "potato", label: "🥔 Potato", icon: "🥔" },
    { value: "corn", label: "🌽 Corn", icon: "🌽" },
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

  // Quick presets for common crops
  const quickPresets = [
    { crop: "wheat", city: "Delhi", days: 30, label: "Wheat 30d", icon: "🌾" },
    { crop: "rice", city: "Delhi", days: 30, label: "Rice 30d", icon: "🌾" },
    { crop: "tomato", city: "Mumbai", days: 7, label: "Tomato 7d", icon: "🍅" },
  ];

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("agri_analysis_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Try to detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("📍 Location detected:", position.coords);
          // Simple proximity detection for major cities
          const { latitude, longitude } = position.coords;

          // Major city coordinates (approximate)
          const cities = [
            { name: "Delhi", lat: 28.7, lon: 77.1, distance: 0 },
            { name: "Mumbai", lat: 19.0, lon: 72.8, distance: 0 },
            { name: "Bangalore", lat: 12.9, lon: 77.6, distance: 0 },
            { name: "Pune", lat: 18.5, lon: 73.8, distance: 0 },
            { name: "Hyderabad", lat: 17.4, lon: 78.5, distance: 0 },
          ];

          // Calculate distance and find nearest city
          cities.forEach((city) => {
            city.distance = Math.sqrt(
              Math.pow(latitude - city.lat, 2) +
                Math.pow(longitude - city.lon, 2)
            );
          });

          const nearest = cities.sort((a, b) => a.distance - b.distance)[0];

          if (nearest.distance < 1.5) {
            // Within ~150km
            setSelectedCity(nearest.name);
            console.log(`✅ Auto-selected nearest city: ${nearest.name}`);
          }
        },
        (error) => console.log("⚠️ Location detection failed:", error.message)
      );
    }
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setLoadingChart(true);

    try {
      // Get analysis
      const result = await agentAPI.analyzeCrop(
        selectedCrop,
        selectedCity,
        selectedDays
      );
      setAnalysis(result);

      // Get historical data for chart
      const historicalData = await priceAPI.getHistorical(selectedCrop, 30);
      const predictionData = await priceAPI.getPrediction(
        selectedCrop,
        selectedDays
      );

      // Combine historical and prediction data
      const combined: ChartDataPoint[] = [];

      // Add historical data
      if (historicalData && historicalData.prices) {
        historicalData.prices.forEach((item: any) => {
          combined.push({
            date: new Date(item.date).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            }),
            historical: item.price,
          });
        });
      }

      // Add prediction data
      if (predictionData && predictionData.predictions) {
        predictionData.predictions.forEach((item: any) => {
          combined.push({
            date: new Date(item.date).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            }),
            predicted: item.predicted_price,
          });
        });
      }

      setChartData(combined);

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        crop: selectedCrop,
        city: selectedCity,
        days: selectedDays,
        timestamp: new Date().toISOString(),
        result: result,
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem(
        "agri_analysis_history",
        JSON.stringify(updatedHistory)
      );
    } catch (err: any) {
      setError(err.message || "Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
      setLoadingChart(false);
    }
  };

  const handlePresetClick = (preset: any) => {
    setSelectedCrop(preset.crop);
    setSelectedCity(preset.city);
    setSelectedDays(preset.days);
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setSelectedCrop(item.crop);
    setSelectedCity(item.city);
    setSelectedDays(item.days);
    setAnalysis(item.result);
  };

  const handleShare = () => {
    if (!analysis) return;
    const shareText = `${selectedCrop.toUpperCase()} Price Analysis
Current: ₹${analysis.current_price}/kg
Predicted (${selectedDays}d): ₹${analysis.predicted_price}/kg
Action: ${analysis.decision.action}
Confidence: ${Math.round(analysis.decision.confidence * 100)}%

Via AgriAI Platform`;

    if (navigator.share) {
      navigator
        .share({
          title: "AgriAI Price Analysis",
          text: shareText,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Analysis copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (!analysis) return;
    const data = {
      crop: selectedCrop,
      city: selectedCity,
      days: selectedDays,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agri-analysis-${selectedCrop}-${Date.now()}.json`;
    a.click();
  };

  const calculateProfit = () => {
    if (!analysis || !analysis.predicted_price) return null;
    const currentTotal = analysis.current_price * quantity;
    const predictedTotal = analysis.predicted_price * quantity;
    const profit = predictedTotal - currentTotal;
    return { currentTotal, predictedTotal, profit };
  };

  const profitCalc = calculateProfit();

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
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="text-center pt-4 md:pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <BarChart3 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🌾 AI Crop Advisor
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Smart price predictions to maximize your profits
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all whitespace-nowrap"
            >
              <Zap size={16} className="text-green-600" />
              <span className="font-semibold text-gray-800">
                {preset.label}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form & History */}
          <div className="lg:col-span-1 space-y-6">
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target size={20} />
                Analysis Settings
              </h2>

              <div className="space-y-4">
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
                  <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
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
                  <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
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

                {/* Quantity Input */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
                    <Calculator size={16} /> Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-base font-medium"
                    placeholder="Enter quantity in kg"
                  />
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

                {/* Share & Download Buttons */}
                {analysis && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Share2 size={18} />
                      Share
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download size={18} />
                      Export
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* History Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <History size={20} />
                Recent Analyses ({history.length})
              </h2>
              {history.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistoryClick(item)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-green-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.crop.charAt(0).toUpperCase() +
                              item.crop.slice(1)}{" "}
                            • {item.city}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(item.timestamp).toLocaleString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <RefreshCw size={16} className="text-green-600" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History size={48} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No analysis history yet</p>
                  <p className="text-xs mt-1">
                    Run your first analysis to see it here!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle
                  size={24}
                  className="text-red-600 flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Analysis Failed
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Results Card */}
            {analysis && (
              <>
                {/* Action Header */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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
                          Confidence:{" "}
                          {Math.round(analysis.decision.confidence * 100)}% •{" "}
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
                          <span className="text-base font-normal text-gray-600">
                            /kg
                          </span>
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-sm">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Predicted Price ({analysis.days_ahead || selectedDays}{" "}
                          days)
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          ₹{analysis.predicted_price || "N/A"}
                          <span className="text-base font-normal text-gray-600">
                            /kg
                          </span>
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
                                analysis.predicted_price >
                                analysis.current_price
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {analysis.predicted_price > analysis.current_price
                                ? "+"
                                : ""}
                              ₹
                              {(
                                analysis.predicted_price -
                                analysis.current_price
                              ).toFixed(2)}
                              <span className="text-base font-normal text-gray-600">
                                /kg
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {(
                                ((analysis.predicted_price -
                                  analysis.current_price) /
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
                </div>

                {/* Profit Calculator */}
                {profitCalc && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Calculator size={24} />
                      Profit Calculator ({quantity} kg)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-sm opacity-90 mb-1">Sell Now</p>
                        <p className="text-2xl font-bold">
                          ₹{profitCalc.currentTotal.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-sm opacity-90 mb-1">
                          Sell in {selectedDays} days
                        </p>
                        <p className="text-2xl font-bold">
                          ₹{profitCalc.predictedTotal.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-white/30 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-sm opacity-90 mb-1">Profit/Loss</p>
                        <p
                          className={`text-2xl font-bold ${
                            profitCalc.profit >= 0
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {profitCalc.profit >= 0 ? "+" : ""}₹
                          {profitCalc.profit.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Chart */}
                {analysis && (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 size={20} />
                      Price Trend & Forecast
                    </h3>
                    {loadingChart ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader
                          size={48}
                          className="animate-spin text-green-600"
                        />
                      </div>
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="colorHistorical"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorPredicted"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            style={{ fontSize: "12px" }}
                          />
                          <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: "12px" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                            formatter={(value: any) => [`₹${value}/kg`, ""]}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="historical"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorHistorical)"
                            name="Historical Price"
                          />
                          <Area
                            type="monotone"
                            dataKey="predicted"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorPredicted)"
                            name="Predicted Price"
                            strokeDasharray="5 5"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <BarChart3
                          size={48}
                          className="mx-auto mb-2 opacity-30"
                        />
                        <p className="text-sm">Chart data unavailable</p>
                        <p className="text-xs mt-1">
                          Historical data may not be available for this crop
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reasoning */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
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
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <Clock
                        size={24}
                        className="text-blue-600 flex-shrink-0 mt-1"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-blue-900 mb-1">
                          Best Time to Act
                        </h3>
                        <p className="text-2xl font-bold text-blue-700">
                          {analysis.decision.best_action_date}
                        </p>
                        {analysis.decision.expected_price && (
                          <p className="text-blue-600 mt-1">
                            Expected price: ₹{analysis.decision.expected_price}
                            /kg
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* LLM Insights */}
                {analysis.llm_insights && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-green-900 mb-3">
                      💬 Expert Advice
                    </h3>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {analysis.llm_insights}
                    </p>
                  </div>
                )}

                {/* Market Signals */}
                {analysis.market_signals &&
                  analysis.market_signals.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 size={20} />
                        Market Signals
                      </h3>
                      <div className="space-y-3">
                        {analysis.market_signals
                          .slice(0, 4)
                          .map((signal: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {signal.signal_type}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {signal.explanation}
                                </p>
                              </div>
                              <div className="ml-4">
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">
                                    {signal.signal}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {Math.round(signal.strength * 100)}%
                                    confidence
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </>
            )}

            {/* Info Footer */}
            {!analysis && !loading && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
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
                    <span>Enter quantity to calculate potential profits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      Our AI analyzes historical data, weather, and market
                      trends
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      Get instant recommendations on when to sell for maximum
                      profit
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Share results or export for your records</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
