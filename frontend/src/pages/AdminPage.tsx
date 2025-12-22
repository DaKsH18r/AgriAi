import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Activity,
  BarChart3,
  Ban,
  CheckCircle,
  Trash2,
  Plus,
  TrendingUp,
  UserCheck,
  Loader,
} from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import type { Column } from "../components/ui/DataTable";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import {
  adminAPI,
  type AdminUser,
  type PlatformStats,
} from "../services/adminAPI";

type Tab = "users" | "logs" | "analytics";

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "active" | "inactive" | "banned";
  joined: string;
  lastActive: string;
}

interface SystemLog extends Record<string, unknown> {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  action: string;
  user: string;
}

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: string;
    id: string;
  }>({ open: false, type: "", id: "" });

  // Real data from API
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Transform AdminUser to User format for DataTable
  const displayUsers: User[] = users.map((adminUser) => ({
    id: String(adminUser.id),
    name: adminUser.full_name || adminUser.email,
    email: adminUser.email,
    plan: adminUser.is_superuser ? "Admin" : "Free", // Default since we don't have subscription info yet
    status: adminUser.is_active ? "active" : "banned",
    joined: new Date(adminUser.created_at).toLocaleDateString(),
    lastActive: "N/A", // Not available from current API
  }));

  // Fetch data on component mount and tab change
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "users") {
        const userData = await adminAPI.getUsers();
        setUsers(userData);
      } else if (activeTab === "logs") {
        const logData = await adminAPI.getLogs();
        setLogs(logData.map((log) => ({ ...log, id: String(log.id) })));
      } else if (activeTab === "analytics") {
        const statsData = await adminAPI.getStats();
        setStats(statsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async () => {
    try {
      const { id, type } = deleteDialog;
      if (type === "user" && id) {
        await adminAPI.deleteUser(Number(id));
        setUsers(users.filter((u) => String(u.id) !== id));
      }
      setDeleteDialog({ open: false, type: "", id: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      setDeleteDialog({ open: false, type: "", id: "" });
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await adminAPI.updateUserStatus(Number(userId), false);
      setUsers(
        users.map((u) =>
          String(u.id) === userId ? { ...u, is_active: false } : u
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ban user");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await adminAPI.updateUserStatus(Number(userId), true);
      setUsers(
        users.map((u) =>
          String(u.id) === userId ? { ...u, is_active: true } : u
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unban user");
    }
  };

  const tabs = [
    { id: "users" as Tab, label: "Users", icon: Users },
    { id: "logs" as Tab, label: "System Logs", icon: Activity },
    { id: "analytics" as Tab, label: "Analytics", icon: BarChart3 },
  ];

  // User Table Columns
  const userColumns: Column<User>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    {
      key: "plan",
      header: "Plan",
      sortable: true,
      render: (user: User) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            user.plan === "Team"
              ? "bg-purple-100 text-purple-700"
              : user.plan === "Pro"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {user.plan}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (user: User) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            user.status === "active"
              ? "bg-green-100 text-green-700"
              : user.status === "banned"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.status}
        </span>
      ),
    },
    { key: "joined", header: "Joined", sortable: true },
    {
      key: "id",
      header: "Actions",
      render: (user: User) => (
        <div className="flex gap-2">
          <button
            onClick={() =>
              setDeleteDialog({ open: true, type: "user", id: user.id })
            }
            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
          {user.status === "active" ? (
            <button
              onClick={() => handleBanUser(user.id)}
              className="p-2 hover:bg-yellow-50 rounded-lg transition text-yellow-600"
              title="Ban User"
            >
              <Ban size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleUnbanUser(user.id)}
              className="p-2 hover:bg-green-50 rounded-lg transition text-green-600"
              title="Unban User"
            >
              <CheckCircle size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  // Logs Table Columns
  const logColumns: Column<SystemLog>[] = [
    { key: "timestamp", header: "Timestamp", sortable: true },
    {
      key: "level",
      header: "Level",
      sortable: true,
      render: (log: SystemLog) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            log.level === "error"
              ? "bg-red-100 text-red-700"
              : log.level === "warning"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {log.level}
        </span>
      ),
    },
    { key: "action", header: "Action", sortable: true },
    { key: "user", header: "User" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage users, plans, features, and system settings
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>{" "}
        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Management
                </h2>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition">
                  <Plus size={18} />
                  Add User
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="animate-spin text-green-600" size={48} />
                </div>
              ) : (
                <DataTable
                  columns={userColumns}
                  data={displayUsers}
                  searchable
                  searchKeys={["name", "email"]}
                  rowsPerPage={5}
                />
              )}
            </div>
          )}

          {/* System Logs Tab */}
          {activeTab === "logs" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                System Logs
              </h2>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="animate-spin text-green-600" size={48} />
                </div>
              ) : (
                <DataTable
                  columns={logColumns}
                  data={logs}
                  searchable
                  searchKeys={["action", "user"]}
                  rowsPerPage={10}
                />
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Platform Analytics
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="animate-spin text-green-600" size={48} />
                </div>
              ) : stats ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      {
                        label: "Total Users",
                        value: stats.total_users.toLocaleString(),
                        change: `${(
                          (stats.active_users / stats.total_users) *
                          100
                        ).toFixed(1)}% active`,
                        icon: Users,
                        color: "blue",
                      },
                      {
                        label: "Active Users",
                        value: stats.active_users.toLocaleString(),
                        change: `${
                          stats.total_users - stats.active_users
                        } inactive`,
                        icon: UserCheck,
                        color: "green",
                      },
                      {
                        label: "Total Analyses",
                        value: stats.total_analyses.toLocaleString(),
                        change: `${stats.analyses_today} today`,
                        icon: TrendingUp,
                        color: "purple",
                      },
                      {
                        label: "Total Predictions",
                        value: stats.total_predictions.toLocaleString(),
                        change: "All time",
                        icon: BarChart3,
                        color: "yellow",
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-600 font-medium">
                            {stat.label}
                          </span>
                          <stat.icon
                            className={`text-${stat.color}-600`}
                            size={24}
                          />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-500">{stat.change}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-12">
                  No analytics data available
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: "", id: "" })}
        onConfirm={handleDelete}
        title={`Delete ${deleteDialog.type}`}
        message={`Are you sure you want to delete this ${deleteDialog.type}? This action cannot be undone.`}
        confirmText="Delete"
        destructive
      />
    </div>
  );
};
