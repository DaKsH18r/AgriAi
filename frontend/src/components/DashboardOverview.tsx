import { useState, useEffect, useCallback } from "react";
import {
  Droplets,
  Thermometer,
  Wind,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  weatherAPI,
  priceAPI,
  notificationAPI,
  agentAPI,
} from "../services/api";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { logger } from "../utils/logger";

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
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="flex items-center space-x-1">
          {trend === "up" && (
            <TrendingUp size={14} className="text-emerald-600" />
          )}
          {trend === "down" && (
            <TrendingDown size={14} className="text-red-600" />
          )}
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-emerald-600"
                : trend === "down"
                ? "text-red-600"
                : "text-slate-500"
            }`}
          >
            {trendValue}
          </span>
        </div>
      </div>
      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <div className="flex items-baseline space-x-1.5">
        <span className="text-2xl font-semibold text-slate-900">{value}</span>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userName = localStorage.getItem("userName") || "Farmer";
  const userLocation = localStorage.getItem("userLocation") || "Delhi";

  interface WeatherData {
    temperature: number;
    humidity: number;
    feels_like: number;
    wind_speed: number;
    city: string;
    description: string;
  }
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [unreadCount, setUnreadCount] = useState(0);
  interface AnalysisData {
    id: string;
    crop: string;
    decision: {
      action: string;
      confidence: number;
    };
    timestamp: string;
  }
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisData[]>([]);
  const [wheatPrice, setWheatPrice] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch weather for user's location
      try {
        const weather = await weatherAPI.getCurrentWeather(userLocation);
        setCurrentWeather(weather);
      } catch (err) {
        console.warn("Failed to fetch weather data:", err);
        // Continue with other requests
      }

      // Fetch notification count
      try {
        const notifData = await notificationAPI.getUnreadCount();
        setUnreadCount(notifData.unread_count);
      } catch (err) {
        console.warn("Failed to fetch notifications:", err);
        setUnreadCount(0);
      }

      // Fetch recent agent analyses
      try {
        const history = await agentAPI.getHistory(3);
        // Map to AnalysisData type if needed
        setRecentAnalyses(
          history.analyses.map(
            (a): AnalysisData => ({
              id: String(a.id),
              crop: a.crop,
              decision: a.decision,
              timestamp: a.timestamp,
            })
          )
        );
      } catch (err) {
        logger.warn("Failed to fetch analyses", { error: err });
        setRecentAnalyses([]);
      }

      // Fetch wheat price for sample metric
      try {
        const priceData = await priceAPI.getPrediction("wheat", 7);
        setWheatPrice(priceData.current_price);
      } catch (err) {
        logger.warn("Failed to fetch price data", { error: err });
        setWheatPrice(null);
      }
    } catch (error) {
      logger.error("Failed to fetch dashboard data", { error });
      setError(
        "Unable to load dashboard data. Please try refreshing the page."
      );
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    fetchDashboardData();
  }, [userLocation, fetchDashboardData]);

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
      icon: <Thermometer size={20} className="text-orange-600" />,
      color: "bg-orange-50",
    },
    {
      title: "Humidity",
      value: currentWeather ? currentWeather.humidity.toString() : "--",
      unit: "%",
      trend: "stable" as const,
      trendValue: currentWeather?.description || "",
      icon: <Droplets size={20} className="text-blue-600" />,
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
      icon: <Wind size={20} className="text-slate-600" />,
      color: "bg-slate-50",
    },
    {
      title: "Active Alerts",
      value: unreadCount.toString(),
      unit: "alerts",
      trend: unreadCount > 0 ? ("up" as const) : ("stable" as const),
      trendValue: unreadCount > 0 ? "Needs attention" : "All clear",
      icon: <AlertCircle size={20} className="text-red-600" />,
      color: "bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-linear-to-br from-emerald-900 to-emerald-800 rounded-2xl p-6 h-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LoadingSkeleton variant="chart" />
          </div>
          <div>
            <LoadingSkeleton variant="list" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={fetchDashboardData}
        showRetry={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      {" "}
      <div className="bg-linear-to-br from-emerald-900 to-emerald-800 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">
              Good Morning, {userName} ☀️
            </h1>
            <p className="text-emerald-100 text-sm mb-4">
              Here's your farm status for today
            </p>
            <div className="space-y-1.5 text-sm text-emerald-50">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Field A: Optimal conditions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Field B: Irrigation scheduled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span>Field C: Pest detected - attention needed</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-semibold mb-1">
              {currentWeather
                ? `${Math.round(currentWeather.temperature)}°C`
                : "--"}
            </div>
            <p className="text-emerald-100 text-sm">
              {currentWeather?.description || "Loading..."}
            </p>
            {wheatPrice && (
              <p className="text-emerald-200 text-xs mt-2">
                Wheat: ₹{wheatPrice.toFixed(2)}/kg
              </p>
            )}
          </div>
        </div>
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Crop Health Index
          </h3>
          <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-slate-600 font-medium text-sm">
                Chart Integration Pending
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Connect Recharts or Chart.js here
              </p>
            </div>
          </div>
        </div>{" "}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Recent AI Analyses
          </h3>
          <div className="space-y-4">
            {recentAnalyses.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No analyses yet</p>
                <p className="text-xs mt-1">Try the AI Agent feature!</p>
              </div>
            ) : (
              recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      analysis.decision.action === "SELL_NOW"
                        ? "bg-emerald-500"
                        : analysis.decision.action === "WAIT"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {analysis.crop} - {analysis.decision.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(analysis.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
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
