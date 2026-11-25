import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  CheckCircle,
  Clock,
  Ban,
} from "lucide-react";

const STORAGE_KEY = "duck_providers";

const initialProviders = [
  {
    id: 1,
    name: "Blue Wave",
    email: "bluewave@duck.dev",
    phone: "01012345678",
    activity: "Kayak",
    status: "Active",
  },
  {
    id: 2,
    name: "Water Sports Club",
    email: "watersports@duck.dev",
    phone: "01098765432",
    activity: "Water Bike",
    status: "Pending",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  activity: "Kayak",
  status: "Active",
};

function readProviders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProviders));
    return initialProviders;
  } catch {
    return initialProviders;
  }
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState(readProviders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
  }, [providers]);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(search.toLowerCase()) ||
        provider.email.toLowerCase().includes(search.toLowerCase()) ||
        provider.phone.includes(search);

      const matchesStatus =
        statusFilter === "All" || provider.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [providers, search, statusFilter]);

  const activeCount = providers.filter(
    (provider) => provider.status === "Active"
  ).length;

  const pendingCount = providers.filter(
    (provider) => provider.status === "Pending"
  ).length;

  const inactiveCount = providers.filter(
    (provider) => provider.status === "Inactive"
  ).length;

  function openAddModal() {
    setEditingProvider(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(provider) {
    setEditingProvider(provider);
    setForm({
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      activity: provider.activity,
      status: provider.status,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProvider(null);
    setForm(emptyForm);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      return;
    }

    if (editingProvider) {
      setProviders((current) =>
        current.map((provider) =>
          provider.id === editingProvider.id
            ? { ...provider, ...form }
            : provider
        )
      );
    } else {
      const newProvider = {
        id: Date.now(),
        ...form,
      };

      setProviders((current) => [...current, newProvider]);
    }

    closeModal();
  }

  function deleteProvider(id) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف مقدم الخدمة؟"
    );

    if (!confirmed) return;

    setProviders((current) =>
      current.filter((provider) => provider.id !== id)
    );
  }

  function changeStatus(id, status) {
    setProviders((current) =>
      current.map((provider) =>
        provider.id === id ? { ...provider, status } : provider
      )
    );
  }

  function getStatusStyle(status) {
    if (status === "Active") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-600";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0C1226]">
            Providers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage activity providers and their status.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FDFB45] px-5 py-3 font-semibold text-[#0C1226] transition hover:brightness-95"
        >
          <Plus size={18} />
          Add Provider
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Providers"
          value={providers.length}
          icon={<Users size={20} />}
        />

        <StatCard
          title="Active"
          value={activeCount}
          icon={<CheckCircle size={20} />}
        />

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={<Clock size={20} />}
        />

        <StatCard
          title="Inactive"
          value={inactiveCount}
          icon={<Ban size={20} />}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search providers..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#147D9F]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#0C1226]">
                      {provider.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      ID: {provider.id}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {provider.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {provider.phone || "No phone"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {provider.activity}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={provider.status}
                      onChange={(event) =>
                        changeStatus(provider.id, event.target.value)
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold outline-none ${getStatusStyle(
                        provider.status
                      )}`}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(provider)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Edit provider"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteProvider(provider.id)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete provider"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProviders.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No providers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0C1226]">
                {editingProvider ? "Edit Provider" : "Add Provider"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Provider Name"
                value={form.name}
                onChange={(value) =>
                  setForm((current) => ({ ...current, name: value }))
                }
                required
              />

              <FormField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({ ...current, email: value }))
                }
                required
              />

              <FormField
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({ ...current, phone: value }))
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Activity
                </label>

                <select
                  value={form.activity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      activity: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#147D9F]"
                >
                  <option value="Kayak">Kayak</option>
                  <option value="Water Bike">Water Bike</option>
                  <option value="SUP">SUP</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#147D9F]"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FDFB45] px-4 py-3 font-semibold text-[#0C1226] hover:brightness-95"
                >
                  {editingProvider ? "Save Changes" : "Add Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-[#0C1226]">
          {value}
        </p>
      </div>

      <div className="rounded-xl bg-[#147D9F]/10 p-3 text-[#147D9F]">
        {icon}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#147D9F]"
      />
    </div>
  );
}