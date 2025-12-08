import { useState, useEffect } from "react";
import {
  Droplets,
  Thermometer,
  Wind,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Loader,
} from "lucide-react";
import {
  weatherAPI,
  priceAPI,
  notificationAPI,
  agentAPI,
} from "../services/api";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="flex items-center space-x-1">
          {trend === "up" && (
            <TrendingUp size={16} className="text-green-600" />
          )}
          {trend === "down" && (
            <TrendingDown size={16} className="text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {trendValue}
          </span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold font-mono text-agri-dark">
          {value}
        </span>
        <span className="text-sm text-gray-500 font-mono">{unit}</span>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("userName") || "Farmer";
  const userLocation = localStorage.getItem("userLocation") || "Delhi";

  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [wheatPrice, setWheatPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch weather for user's location
        const weather = await weatherAPI.getCurrentWeather(userLocation);
        setCurrentWeather(weather);

        // Fetch notification count
        try {
          const notifData = await notificationAPI.getUnreadCount();
          setUnreadCount(notifData.unread_count);
        } catch {
          // User might not be logged in
          setUnreadCount(0);
        }

        // Fetch recent agent analyses
        try {
          const history = await agentAPI.getHistory(3);
          setRecentAnalyses(history.analyses);
        } catch {
          setRecentAnalyses([]);
        }

        // Fetch wheat price for sample metric
        try {
          const priceData = await priceAPI.getPrediction("wheat", 7);
          setWheatPrice(priceData.current_price);
        } catch {
          setWheatPrice(null);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userLocation]);

  const metrics = [
    {
      title: "Temperature",
      value: currentWeather
        ? Math.round(currentWeather.temperature).toString()
        : "--",
      unit: "°C",
      trend: "stable" as const,
      trendValue: currentWeather
        ? `Feels ${Math.round(currentWeather.feels_like)}°C`
        : "",
      icon: <Thermometer size={24} className="text-orange-600" />,
      color: "bg-orange-50",
    },
    {
      title: "Humidity",
      value: currentWeather ? currentWeather.humidity.toString() : "--",
      unit: "%",
      trend: "stable" as const,
      trendValue: currentWeather?.description || "",
      icon: <Droplets size={24} className="text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Wind Speed",
      value: currentWeather
        ? Math.round(currentWeather.wind_speed).toString()
        : "--",
      unit: "km/h",
      trend: "stable" as const,
      trendValue: currentWeather ? currentWeather.city : "",
      icon: <Wind size={24} className="text-gray-600" />,
      color: "bg-gray-50",
    },
    {
      title: "Active Alerts",
      value: unreadCount.toString(),
      unit: "alerts",
      trend: unreadCount > 0 ? ("up" as const) : ("stable" as const),
      trendValue: unreadCount > 0 ? "Needs attention" : "All clear",
      icon: <AlertCircle size={24} className="text-red-600" />,
      color: "bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Morning Briefing Banner */}
      <div className="bg-gradient-to-r from-agri-dark to-agri-green rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Good Morning, {userName}! ☀️
            </h1>
            <p className="text-white/90 text-lg mb-4">
              Here's your farm status for today
            </p>
            <div className="space-y-2 text-white/80">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Field A: Optimal conditions ✓</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Field B: Irrigation scheduled ✓</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Field C: Requires attention - Pest detected</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold font-mono mb-2">
              {currentWeather
                ? `${Math.round(currentWeather.temperature)}°C`
                : "--"}
            </div>
            <p className="text-white/70">
              {currentWeather?.description || "Loading..."}
            </p>
            {wheatPrice && (
              <p className="text-white/60 text-sm mt-2">
                Wheat: ₹{wheatPrice.toFixed(2)}/kg
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Content Split: Chart + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Crop Health Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-agri-dark mb-4">
            Crop Health Index
          </h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 font-medium">
                Chart Integration Pending
              </p>
              <p className="text-sm text-gray-400">
                Connect Recharts or Chart.js here
              </p>
            </div>
          </div>
        </div>

        {/* Right: Recent AI Analyses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Recent AI Analyses
          </h3>
          <div className="space-y-4">
            {recentAnalyses.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No analyses yet</p>
                <p className="text-xs mt-1">Try the AI Agent feature!</p>
              </div>
            ) : (
              recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      analysis.decision.action === "SELL_NOW"
                        ? "bg-green-500"
                        : analysis.decision.action === "WAIT"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {analysis.crop} - {analysis.decision.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(analysis.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Confidence:{" "}
                      {Math.round(analysis.decision.confidence * 100)}%
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
