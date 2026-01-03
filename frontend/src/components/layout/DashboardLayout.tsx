import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  CloudSun,
  AlertTriangle,
  LogOut,
  User,
  DollarSign,
  Sprout,
  MessageSquare,
  Menu,
  X,
  Shield,
} from "lucide-react";
import NotificationBell from "../NotificationBell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { path: "/dashboard/agent", icon: Bot, label: "AI Agronomist" },
    { path: "/dashboard/chatbot", icon: MessageSquare, label: "Chatbot" },
    { path: "/dashboard/weather", icon: CloudSun, label: "Weather" },
    { path: "/dashboard/prices", icon: DollarSign, label: "Market Prices" },
    { path: "/dashboard/yield", icon: Sprout, label: "Yield Prediction" },
    { path: "/dashboard/alerts", icon: AlertTriangle, label: "Alerts" },
  ];

  // Add admin link only for superusers
  const allNavItems = user?.is_superuser
    ? [
        ...navItems,
        { path: "/dashboard/admin", icon: Shield, label: "Admin Panel" },
      ]
    : navItems;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >        <div className="p-6 border-b border-emerald-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center">
                <span className="text-xl">🌾</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">AgriAI</h1>
                <p className="text-xs text-emerald-200">Smart Farming</p>
              </div>
            </div>            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-emerald-200 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {allNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>        <div className="p-4 border-t border-emerald-800">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 bg-emerald-800 rounded-full flex items-center justify-center">
              <User size={18} className="text-emerald-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-emerald-200">Farmer</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-800/50 hover:bg-emerald-800 rounded-lg transition-colors text-emerald-100 hover:text-white"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>      <div className="flex-1 flex flex-col overflow-hidden">        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                Monitor and manage your agricultural operations
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors"
            >
              <User size={18} className="text-emerald-900" />
            </button>
          </div>
        </header>        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
