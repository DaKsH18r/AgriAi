import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Droplets,
  Wind,
  TrendingUp,
  RefreshCw,
  MapPin,
  Thermometer,
  AlertTriangle,
} from "lucide-react";
import { weatherAPI } from "../services/api";
import { logger } from "../utils/logger";
import type {
  CurrentWeather,
  WeatherForecast,
  WeatherAlerts,
} from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const POPULAR_CITIES = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Kolkata",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Ahmedabad",
  "Chandigarh",
  "Bhopal",
  "Patna",
  "Guwahati",
];

const getFarmingStatus = (weather: CurrentWeather | null) => {
  if (!weather)
    return { status: "Unknown", message: "No data", color: "slate" };

  const { temperature, humidity, wind_speed } = weather;

  // Optimal farming conditions
  if (
    temperature >= 15 &&
    temperature <= 35 &&
    humidity >= 40 &&
    humidity <= 80 &&
    wind_speed < 10
  ) {
    return {
      status: "Excellent",
      message: "Ideal for all farming activities",
      color: "emerald",
    };
  }

  // Good conditions
  if (
    temperature >= 10 &&
    temperature <= 40 &&
    humidity >= 30 &&
    humidity <= 90 &&
    wind_speed < 15
  ) {
    return {
      status: "Good",
      message: "Favorable for farming",
      color: "emerald",
    };
  }

  // Moderate conditions
  if (temperature >= 5 && temperature <= 42) {
    return {
      status: "Moderate",
      message: "Plan activities carefully",
      color: "yellow",
    };
  }

  // Poor conditions
  return {
    status: "Caution",
    message: "Avoid outdoor activities",
    color: "red",
  };
};

const formatTemp = (temp: number): string => Math.round(temp).toString();

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl border border-slate-200"
        >
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

interface WeatherCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  icon,
  label,
  value,
  subtext,
  className = "",
}) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-sm text-slate-500 font-semibold">{label}</span>
    </div>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-600 mt-2">{subtext}</p>
  </div>
);

const StatusCard: React.FC<{ weather: CurrentWeather | null }> = ({
  weather,
}) => {
  const { status, message, color } = getFarmingStatus(weather);

  const colorClasses = {
    green: "bg-green-700 border-green-600",
    emerald: "bg-emerald-900 border-emerald-800",
    yellow: "bg-yellow-600 border-yellow-500",
    red: "bg-red-700 border-red-600",
    slate: "bg-slate-600 border-slate-500",
  };

  return (
    <div
      className={`${
        colorClasses[color as keyof typeof colorClasses]
      } p-6 rounded-xl shadow-sm border text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <TrendingUp size={32} />
        <span className="text-sm font-semibold">Farming Status</span>
      </div>
      <p className="text-2xl font-bold">{status}</p>
      <p className="text-sm mt-2 opacity-90">{message}</p>
    </div>
  );
};

const WeatherDashboard: React.FC = () => {
  // State
  const [city, setCity] = useState("Delhi");
  const [searchInput, setSearchInput] = useState("Delhi");
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlerts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch weather data
  const fetchWeatherData = useCallback(async (targetCity: string) => {
    if (!targetCity.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Fetch APIs independently so one failure doesn't block others
      const [currentResult, forecastResult, alertsResult] =
        await Promise.allSettled([
          weatherAPI.getCurrentWeather(targetCity),
          weatherAPI.getForecast(targetCity),
          weatherAPI.getAlerts(targetCity),
        ]);

      // Handle current weather (main data)
      if (currentResult.status === "fulfilled") {
        setCurrentWeather(currentResult.value);
        setCity(targetCity);
        setLastUpdated(new Date());
      } else {
        logger.error("Current weather error", {
          error: currentResult.reason,
          city: targetCity,
        });
        setError(
          `Could not find weather for "${targetCity}". Please check the city name.`
        );
        return;
      }

      // Handle forecast (optional)
      if (forecastResult.status === "fulfilled") {
        setForecast(forecastResult.value);
      } else {
        logger.warn("Forecast unavailable", { error: forecastResult.reason });
        setForecast(null);
      }

      // Handle alerts (optional)
      if (alertsResult.status === "fulfilled") {
        setAlerts(alertsResult.value);
      } else {
        logger.warn("Alerts unavailable", { error: alertsResult.reason });
        setAlerts(null);
      }
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      logger.error("Failed to fetch weather data", { error: err });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchWeatherData(city);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData(searchInput);
  };

  // Handle city button click
  const handleCityClick = (selectedCity: string) => {
    setSearchInput(selectedCity);
    fetchWeatherData(selectedCity);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchWeatherData(city);
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!forecast?.forecasts) return [];
    return forecast.forecasts.slice(0, 24).map((item) => ({
      time: new Date(item.datetime).getHours() + ":00",
      temperature: Math.round(item.temperature),
      humidity: item.humidity,
    }));
  }, [forecast]);

  // Prepare 5-day forecast
  const dailyForecast = useMemo(() => {
    if (!forecast?.forecasts) return [];
    return forecast.forecasts.filter((_, index) => index % 8 === 0).slice(0, 5);
  }, [forecast]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Weather Dashboard
              </h1>
              <p className="text-slate-600">
                Real-time weather insights for better farming decisions
              </p>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
                  title="Refresh weather data"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter city name (e.g., Chennai, Mumbai, Lucknow)..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-normal"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="px-8 py-3 bg-emerald-900 text-white font-semibold rounded-lg hover:bg-emerald-800 disabled:bg-slate-400 transition shadow-sm"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Popular Cities */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-slate-500 py-1">Popular cities:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCityClick(c)}
              disabled={loading}
              className={`px-3 py-1 text-sm rounded-full transition ${
                city === c
                  ? "bg-emerald-900 text-white"
                  : "bg-white border border-slate-300 text-slate-700 hover:border-emerald-500 disabled:opacity-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <AlertTriangle className="shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1 text-red-600">
                💡 Tip: Enter a city name like "Chennai" or "Mumbai", not a
                state name.
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Weather Cards */}
        {!loading && currentWeather && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <WeatherCard
              icon={<Thermometer className="text-emerald-600" size={32} />}
              label="Temperature"
              value={`${formatTemp(currentWeather.temperature)}°C`}
              subtext={`Feels like ${formatTemp(currentWeather.feels_like)}°C`}
            />
            <WeatherCard
              icon={<Droplets className="text-blue-600" size={32} />}
              label="Humidity"
              value={`${currentWeather.humidity}%`}
              subtext={currentWeather.description}
              className="capitalize"
            />
            <WeatherCard
              icon={<Wind className="text-slate-600" size={32} />}
              label="Wind Speed"
              value={`${currentWeather.wind_speed} m/s`}
              subtext={currentWeather.city}
            />
            <StatusCard weather={currentWeather} />
          </div>
        )}

        {/* Weather Alerts */}
        {!loading && alerts && alerts.alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.alerts.map((alert, index) => {
              const isHigh = alert.severity === "high";
              const isMedium = alert.severity === "medium";

              return (
                <div
                  key={index}
                  className={`border-l-4 p-4 rounded-lg shadow-sm ${
                    isHigh
                      ? "bg-red-50 border-red-500"
                      : isMedium
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-green-50 border-green-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={
                        isHigh
                          ? "text-red-600"
                          : isMedium
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                      size={20}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">
                        {isHigh
                          ? "⚠️ High Alert"
                          : isMedium
                          ? "⚡ Advisory"
                          : "✓ Optimal"}
                      </h3>
                      <p className="text-sm text-slate-700">{alert.message}</p>
                      {(alert as { recommendation?: string })
                        .recommendation && (
                        <p className="text-sm text-slate-600 mt-1 italic">
                          Recommendation:{" "}
                          {
                            (alert as { recommendation?: string })
                              .recommendation
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5-Day Forecast */}
        {!loading && dailyForecast.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              5-Day Forecast
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {dailyForecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200 hover:border-emerald-300 transition"
                >
                  <p className="text-sm font-semibold text-slate-600 mb-2">
                    {new Date(day.datetime).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-3xl font-bold text-emerald-900 mb-2">
                    {Math.round(day.temperature)}°C
                  </p>
                  <p className="text-sm text-slate-700 capitalize mb-2">
                    {day.description}
                  </p>
                  <div className="flex justify-center items-center gap-1 text-xs text-slate-600">
                    <Droplets size={12} />
                    <span>{day.rain_probability}% rain</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 24-Hour Temperature Chart */}
        {!loading && chartData.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              24-Hour Forecast
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: "#059669", strokeWidth: 2 }}
                  name="Temperature (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(WeatherDashboard);
