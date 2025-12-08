import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Phone,
  MapPin,
  Sprout,
  Globe,
  Bell,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

export const ProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    favorite_crops: user?.favorite_crops || [],
    preferred_language: user?.preferred_language || "en",
    notification_enabled: user?.notification_enabled !== false,
  });

  const [cropInput, setCropInput] = useState("");

  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी (Hindi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "bn", name: "বাংলা (Bengali)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.put(`${API_BASE_URL}/auth/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const addCrop = () => {
    if (
      cropInput.trim() &&
      !formData.favorite_crops.includes(cropInput.trim())
    ) {
      setFormData({
        ...formData,
        favorite_crops: [...formData.favorite_crops, cropInput.trim()],
      });
      setCropInput("");
    }
  };

  const removeCrop = (crop: string) => {
    setFormData({
      ...formData,
      favorite_crops: formData.favorite_crops.filter((c: string) => c !== crop),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
            </div>

            {/* Favorite Crops */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Sprout className="inline w-5 h-5 mr-2" />
                Favorite Crops
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={cropInput}
                  onChange={(e) => setCropInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCrop())
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add crop (e.g., Rice, Wheat)"
                />
                <button
                  type="button"
                  onClick={addCrop}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.favorite_crops.map((crop: string) => (
                  <span
                    key={crop}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-2"
                  >
                    {crop}
                    <button
                      type="button"
                      onClick={() => removeCrop(crop)}
                      className="text-green-700 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline w-5 h-5 mr-2" />
                Preferred Language
              </label>
              <select
                value={formData.preferred_language}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferred_language: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Notifications */}
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notification_enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notification_enabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-gray-700">Enable notifications</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
