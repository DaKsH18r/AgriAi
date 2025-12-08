import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DashboardOverview } from "../components/DashboardOverview";
import AgentDashboard from "../components/AgentDashboard";
import WeatherDashboard from "../components/WeatherDashboard";
import PricePrediction from "../components/PricePrediction";
import YieldPrediction from "../components/YieldPrediction";
import ChatBot from "../components/ChatBot";
import NotificationBell from "../components/NotificationBell";
import {
  LogOut,
  Bot,
  Cloud,
  DollarSign,
  Sprout,
  MessageSquare,
  Home,
} from "lucide-react";

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "🏠 Home", icon: Home },
    { id: "agent", label: "🤖 AI Agent", icon: Bot },
    { id: "weather", label: "🌦️ Weather", icon: Cloud },
    { id: "prices", label: "💰 Prices", icon: DollarSign },
    { id: "yield", label: "🌾 Yield", icon: Sprout },
    { id: "chatbot", label: "💬 Chatbot", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="glass border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🌾</span>
              </div>
              <span className="text-xl font-bold gradient-text">
                AgriAI Dashboard
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium hidden md:block">
                {user?.email}
              </span>
              <NotificationBell />
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-transparent text-gray-600 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 pb-24 md:pb-6">
        {activeTab === "home" && <DashboardOverview />}
        {activeTab === "agent" && <AgentDashboard />}
        {activeTab === "weather" && <WeatherDashboard />}
        {activeTab === "prices" && <PricePrediction />}
        {activeTab === "yield" && <YieldPrediction />}
        {activeTab === "chatbot" && <ChatBot />}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          {tabs.slice(0, 5).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 min-h-[60px] transition-colors ${
                activeTab === tab.id
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={24} className="mb-1" />
              <span className="text-xs font-medium">
                {tab.label.split(" ")[1]}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DashboardPage;
