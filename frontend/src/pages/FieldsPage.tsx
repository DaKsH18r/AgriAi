import React, { useState } from "react";
import { Plus, MapPin, Calendar, Trash2, Edit, Map } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/Toast";

interface Field {
  id: string;
  name: string;
  location: string;
  crop: string;
  area: number;
  sowingDate: string;
  status: "planted" | "growing" | "ready" | "harvested";
}

export const FieldsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      name: "North Field",
      location: "Punjab, India",
      crop: "Rice",
      area: 5.2,
      sowingDate: "2025-06-15",
      status: "growing",
    },
    {
      id: "2",
      name: "South Field",
      location: "Punjab, India",
      crop: "Wheat",
      area: 3.8,
      sowingDate: "2025-10-20",
      status: "planted",
    },
  ]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    crop: "",
    area: "",
    sowingDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingField) {
      setFields(
        fields.map((f) =>
          f.id === editingField.id
            ? {
                ...f,
                ...formData,
                area: parseFloat(formData.area),
              }
            : f
        )
      );
      showToast("Field updated successfully", "success");
      setEditingField(null);
    } else {
      const newField: Field = {
        id: Date.now().toString(),
        ...formData,
        area: parseFloat(formData.area),
        status: "planted",
      };
      setFields([...fields, newField]);
      showToast("Field added successfully", "success");
      setIsAddingField(false);
    }

    setFormData({ name: "", location: "", crop: "", area: "", sowingDate: "" });
  };

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      location: field.location,
      crop: field.crop,
      area: field.area.toString(),
      sowingDate: field.sowingDate,
    });
    setIsAddingField(true);
  };

  const handleDelete = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    showToast("Field deleted successfully", "success");
    setDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planted":
        return "bg-blue-100 text-blue-700";
      case "growing":
        return "bg-green-100 text-green-700";
      case "ready":
        return "bg-yellow-100 text-yellow-700";
      case "harvested":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (fields.length === 0 && !isAddingField) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <EmptyState
            icon={MapPin}
            title="No Fields Yet"
            description="Start by adding your first field to track crops and manage your farm"
            action={{
              label: "Add First Field",
              onClick: () => setIsAddingField(true),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Fields</h1>
            <p className="text-gray-600">
              Manage your farm fields and track crop progress
            </p>
          </div>
          <div className="flex gap-3">
            {/* View Toggle */}
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === "list"
                    ? "bg-green-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === "map"
                    ? "bg-green-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Map size={18} className="inline mr-2" />
                Map
              </button>
            </div>

            <button
              onClick={() => {
                setIsAddingField(true);
                setEditingField(null);
                setFormData({
                  name: "",
                  location: "",
                  crop: "",
                  area: "",
                  sowingDate: "",
                });
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Field
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAddingField && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slideUp">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingField ? "Edit Field" : "Add New Field"}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Field Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., North Field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., Punjab, India"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Crop *
                </label>
                <select
                  value={formData.crop}
                  onChange={(e) =>
                    setFormData({ ...formData, crop: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Select crop</option>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Corn">Corn</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Soybeans">Soybeans</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area (hectares) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="5.2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sowing Date *
                </label>
                <input
                  type="date"
                  value={formData.sowingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, sowingDate: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingField(false);
                    setEditingField(null);
                    setFormData({
                      name: "",
                      location: "",
                      crop: "",
                      area: "",
                      sowingDate: "",
                    });
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  {editingField ? "Update Field" : "Add Field"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fields Grid */}
        {viewMode === "list" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div
                key={field.id}
                className="bg-white rounded-2xl shadow-lg p-6 card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {field.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin size={14} />
                      <span>{field.location}</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      field.status
                    )}`}
                  >
                    {field.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Crop:</span>
                    <span className="font-semibold text-gray-900">
                      {field.crop}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-semibold text-gray-900">
                      {field.area} ha
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={14} />
                    <span>Sown: {field.sowingDate}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(field)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(field.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === "map" && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Map size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Map View Coming Soon
            </h3>
            <p className="text-gray-600">
              Interactive map with field locations and boundaries
            </p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
          title="Delete Field"
          message="Are you sure you want to delete this field? This action cannot be undone."
          confirmText="Delete"
          destructive
        />
      </div>
    </div>
  );
};
