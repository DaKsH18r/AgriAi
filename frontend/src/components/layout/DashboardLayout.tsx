import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Bot,
  Map,
  CloudSun,
  AlertTriangle,
  LogOut,
  User,
} from "lucide-react";
import NotificationBell from "../NotificationBell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { path: "/dashboard/agent", icon: Bot, label: "AI Agronomist" },
    { path: "/fields", icon: Map, label: "My Fields" },
    { path: "/dashboard/weather", icon: CloudSun, label: "Weather Station" },
    { path: "/alerts", icon: AlertTriangle, label: "Alerts" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-agri-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-agri-dark text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-agri-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌾</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">AgriAI</h1>
              <p className="text-xs text-white/60">Smart Farming</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-agri-green text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-agri-green/20 rounded-full flex items-center justify-center">
              <User size={20} className="text-agri-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-white/50">Farmer</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-agri-dark">Dashboard</h2>
            <p className="text-sm text-gray-500">
              Monitor and manage your agricultural operations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 bg-agri-green/10 rounded-full flex items-center justify-center hover:bg-agri-green/20 transition-colors"
            >
              <User size={20} className="text-agri-green" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-agri-surface">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
