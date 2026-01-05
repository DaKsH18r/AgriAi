import axios from "axios";
import { API_BASE_URL } from "../config/api";

const createAuthClient = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
};

export interface PlatformStats {
  total_users: number;
  active_users: number;
  total_analyses: number;
  analyses_today: number;
  total_predictions: number;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  location: string | null;
  favorite_crops: string[] | null;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error";
  action: string;
  user: string;
}

export const adminAPI = {
  getStats: async (): Promise<PlatformStats> => {
    const client = createAuthClient();
    const response = await client.get("/admin/stats");
    return response.data;
  },

  getUsers: async (
    skip: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<AdminUser[]> => {
    const client = createAuthClient();
    const params: Record<string, string | number> = { skip, limit };
    if (search) params.search = search;

    const response = await client.get("/admin/users", { params });
    return response.data;
  },

  updateUserStatus: async (userId: number, isActive: boolean) => {
    const client = createAuthClient();
    const response = await client.put(`/admin/users/${userId}/status`, null, {
      params: { is_active: isActive },
    });
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const client = createAuthClient();
    const response = await client.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getLogs: async (limit: number = 50, level?: string): Promise<SystemLog[]> => {
    const client = createAuthClient();
    const params: Record<string, string | number> = { limit };
    if (level) params.level = level;

    const response = await client.get("/admin/logs", { params });
    return response.data;
  },

  checkHealth: async () => {
    const client = createAuthClient();
    const response = await client.get("/admin/health");
    return response.data;
  },
};
