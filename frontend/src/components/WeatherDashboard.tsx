import { useState, useEffect } from "react";
import { Cloud, Droplets, Wind, TrendingUp } from "lucide-react";
import { weatherAPI } from "../services/api";
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
} from "recharts";

export default function WeatherDashboard() {
  const [city, setCity] = useState("Delhi");
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlerts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeatherData = async () => {
    setLoading(true);
    setError("");
    try {
      const [current, forecastData, alertsData] = await Promise.all([
        weatherAPI.getCurrentWeather(city),
        weatherAPI.getForecast(city),
        weatherAPI.getAlerts(city),
      ]);
      setCurrentWeather(current);
      setForecast(forecastData);
      setAlerts(alertsData);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const chartData =
    forecast?.forecasts.slice(0, 24).map((item) => ({
      name: new Date(item.datetime).getHours() + ":00",
      temp: item.temperature,
      humidity: item.humidity,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Agriculture Weather Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time weather insights for better farming decisions
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Current Weather */}
        {currentWeather && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Cloud className="text-blue-500" size={32} />
                <span className="text-sm text-gray-500">Temperature</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {currentWeather.temperature}°C
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Feels like {currentWeather.feels_like}°C
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Droplets className="text-blue-500" size={32} />
                <span className="text-sm text-gray-500">Humidity</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {currentWeather.humidity}%
              </p>
              <p className="text-sm text-gray-600 mt-2 capitalize">
                {currentWeather.description}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Wind className="text-blue-500" size={32} />
                <span className="text-sm text-gray-500">Wind Speed</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {currentWeather.wind_speed} m/s
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {currentWeather.city}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp size={32} />
                <span className="text-sm">Status</span>
              </div>
              <p className="text-2xl font-bold">Good</p>
              <p className="text-sm mt-2 opacity-90">Favorable for farming</p>
            </div>
          </div>
        )}

        {/* Alerts */}
        {alerts && alerts.alerts.length > 0 && (
          <div className="mb-8">
            <div className="space-y-3">
              {alerts.alerts.map((alert, index) => {
                const isOptimal = alert.severity === "low";
                const isHigh = alert.severity === "high";
                const bgColor = isOptimal
                  ? "bg-green-50 border-green-400"
                  : isHigh
                  ? "bg-red-50 border-red-400"
                  : "bg-yellow-50 border-yellow-400";
                const badgeColor = isOptimal
                  ? "bg-green-100 text-green-700"
                  : isHigh
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700";
                const title = isOptimal
                  ? "✓ Optimal Conditions"
                  : isHigh
                  ? "⚠ High Alert"
                  : "⚠ Weather Advisory";

                return (
                  <div
                    key={index}
                    className={`${bgColor} border-l-4 p-4 rounded-lg`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">
                          {alert.message}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded inline-block ${badgeColor}`}
                        >
                          {isOptimal
                            ? "FAVORABLE"
                            : alert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Temperature Chart */}
        {chartData.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            {/* 5-Day Forecast */}
            {forecast && (
              <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  5-Day Weather Forecast
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {forecast.forecasts
                    .filter((_, index) => index % 8 === 0) // Get one forecast per day
                    .slice(0, 5)
                    .map((day, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center"
                      >
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {new Date(day.datetime).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-3xl font-bold text-blue-600 mb-2">
                          {Math.round(day.temperature)}°C
                        </p>
                        <p className="text-sm text-gray-700 capitalize mb-2">
                          {day.description}
                        </p>
                        <div className="flex justify-center items-center gap-2 text-xs text-gray-600">
                          <Droplets size={14} />
                          <span>{day.rain_probability}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              24-Hour Temperature Forecast
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
