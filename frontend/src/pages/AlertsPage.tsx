import React, { useState } from "react";
import {
  Bell,
  Cloud,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle,
  Pin,
  Trash2,
} from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";

interface Alert {
  id: string;
  type: "weather" | "market" | "disease" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  pinned: boolean;
  priority: "low" | "medium" | "high";
}

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "weather",
      title: "Heavy Rain Alert",
      message:
        "Expect 50mm rainfall in the next 24 hours. Consider postponing irrigation.",
      timestamp: "2025-11-12T10:30:00",
      read: false,
      pinned: true,
      priority: "high",
    },
    {
      id: "2",
      type: "market",
      title: "Rice Price Surge",
      message:
        "Rice prices increased by 15% in your local mandi. Good time to sell.",
      timestamp: "2025-11-12T09:15:00",
      read: false,
      pinned: false,
      priority: "medium",
    },
    {
      id: "3",
      type: "disease",
      title: "Disease Risk Warning",
      message: "High humidity detected. Monitor for leaf blast in rice crops.",
      timestamp: "2025-11-11T16:45:00",
      read: true,
      pinned: false,
      priority: "high",
    },
    {
      id: "4",
      type: "system",
      title: "New Feature Available",
      message: "Check out our new yield prediction model with 95% accuracy!",
      timestamp: "2025-11-10T14:00:00",
      read: true,
      pinned: false,
      priority: "low",
    },
  ]);

  const [filterType, setFilterType] = useState<string>("all");

  const toggleRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: !a.read } : a)));
  };

  const togglePin = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const markAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <Cloud className="text-blue-600" size={24} />;
      case "market":
        return <TrendingUp className="text-green-600" size={24} />;
      case "disease":
        return <AlertTriangle className="text-red-600" size={24} />;
      default:
        return <Info className="text-gray-600" size={24} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500";
      case "medium":
        return "border-l-4 border-l-yellow-500";
      default:
        return "border-l-4 border-l-gray-300";
    }
  };

  const filteredAlerts = alerts
    .filter((a) => filterType === "all" || a.type === filterType)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  if (alerts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <EmptyState
            icon={Bell}
            title="No Alerts"
            description="You're all caught up! We'll notify you when there's something important."
            action={undefined}
          />
        </div>
      </div>
    );
  }

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Alerts</h1>
            <p className="text-gray-600">
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              <CheckCircle size={18} />
              Mark All Read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All", icon: Bell },
            { id: "weather", label: "Weather", icon: Cloud },
            { id: "market", label: "Market", icon: TrendingUp },
            { id: "disease", label: "Disease", icon: AlertTriangle },
            { id: "system", label: "System", icon: Info },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filterType === filter.id
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <filter.icon size={18} />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Alerts Feed */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl shadow-lg p-6 ${getPriorityColor(
                alert.priority
              )} ${!alert.read ? "ring-2 ring-green-200" : ""} animate-slideUp`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{getIcon(alert.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3
                      className={`text-lg font-bold ${
                        !alert.read ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {alert.title}
                      {alert.pinned && (
                        <Pin
                          size={16}
                          className="inline ml-2 text-yellow-600"
                          fill="currentColor"
                        />
                      )}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePin(alert.id)}
                        className={`p-2 rounded-lg transition ${
                          alert.pinned
                            ? "bg-yellow-100 text-yellow-600"
                            : "hover:bg-gray-100 text-gray-400"
                        }`}
                        title={alert.pinned ? "Unpin" : "Pin"}
                      >
                        <Pin size={18} />
                      </button>
                      <button
                        onClick={() => toggleRead(alert.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-400"
                        title={alert.read ? "Mark unread" : "Mark read"}
                      >
                        {alert.read ? (
                          <Bell size={18} />
                        ) : (
                          <CheckCircle size={18} className="text-green-600" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p
                    className={`mb-3 ${
                      !alert.read ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {new Date(alert.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="capitalize">{alert.type}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        alert.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : alert.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Settings Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">
            Notification Settings
          </h3>
          <p className="text-gray-600 mb-4">
            Manage your notification preferences in Settings
          </p>
          <button className="text-blue-600 font-semibold hover:underline">
            Go to Settings →
          </button>
        </div>
      </div>
    </div>
  );
};
