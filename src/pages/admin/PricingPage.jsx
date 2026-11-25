import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Tag,
  DollarSign,
  Percent,
} from "lucide-react";

const STORAGE_KEY = "duck_pricing";

const initialPricing = [
  {
    id: 1,
    activity: "Kayak",
    price: 300,
    discount: 0,
    unit: "per person",
    status: "Active",
  },
  {
    id: 2,
    activity: "Water Bike",
    price: 450,
    discount: 10,
    unit: "per hour",
    status: "Active",
  },
  {
    id: 3,
    activity: "SUP",
    price: 250,
    discount: 0,
    unit: "per person",
    status: "Active",
  },
];

const emptyForm = {
  activity: "Kayak",
  price: "",
  discount: 0,
  unit: "per person",
  status: "Active",
};

function readPricing() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) return JSON.parse(saved);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPricing));
    return initialPricing;
  } catch {
    return initialPricing;
  }
}

export default function PricingPage() {
  const [pricing, setPricing] = useState(readPricing);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pricing));
  }, [pricing]);

  const filteredPricing = useMemo(() => {
    return pricing.filter((item) =>
      item.activity.toLowerCase().includes(search.toLowerCase())
    );
  }, [pricing, search]);

  const activeCount = pricing.filter(
    (item) => item.status === "Active"
  ).length;

  const averagePrice = pricing.length
    ? Math.round(
        pricing.reduce((sum, item) => sum + Number(item.price), 0) /
          pricing.length
      )
    : 0;

  function openAddModal() {
    setEditingItem(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setForm({
      activity: item.activity,
      price: item.price,
      discount: item.discount,
      unit: item.unit,
      status: item.status,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingItem(null);
    setForm(emptyForm);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const price = Number(form.price);
    const discount = Number(form.discount);

    if (!form.activity.trim() || price <= 0) return;
    if (discount < 0 || discount > 100) return;

    const updatedItem = {
      ...form,
      price,
      discount,
    };

    if (editingItem) {
      setPricing((current) =>
        current.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...updatedItem }
            : item
        )
      );
    } else {
      setPricing((current) => [
        ...current,
        {
          id: Date.now(),
          ...updatedItem,
        },
      ]);
    }

    closeModal();
  }

  function deleteItem(id) {
    if (!window.confirm("هل أنت متأكد من حذف السعر؟")) return;

    setPricing((current) => current.filter((item) => item.id !== id));
  }

  function toggleStatus(id) {
    setPricing((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  }

  function getFinalPrice(item) {
    return Number(item.price) * (1 - Number(item.discount || 0) / 100);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0C1226]">
            Pricing
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage activity prices and discounts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FDFB45] px-5 py-3 font-semibold text-[#0C1226] hover:brightness-95"
        >
          <Plus size={18} />
          Add Price
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Pricing Plans"
          value={pricing.length}
          icon={<Tag size={20} />}
        />

        <StatCard
          title="Active Prices"
          value={activeCount}
          icon={<DollarSign size={20} />}
        />

        <StatCard
          title="Average Base Price"
          value={`${averagePrice} EGP`}
          icon={<Percent size={20} />}
        />
      </div>

      {/* Pricing Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search activity..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#147D9F]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Final Price</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredPricing.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-[#0C1226]">
                    {item.activity}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.price} EGP
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700">
                      {item.discount}%
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-[#147D9F]">
                    {getFinalPrice(item).toFixed(0)} EGP
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.unit}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit price"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete price"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPricing.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No pricing plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0C1226]">
                {editingItem ? "Edit Price" : "Add Price"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <FormField
                label="Base Price (EGP)"
                type="number"
                value={form.price}
                onChange={(value) =>
                  setForm((current) => ({ ...current, price: value }))
                }
                min="1"
                required
              />

              <FormField
                label="Discount (%)"
                type="number"
                value={form.discount}
                onChange={(value) =>
                  setForm((current) => ({ ...current, discount: value }))
                }
                min="0"
                max="100"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Pricing Unit
                </label>

                <select
                  value={form.unit}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      unit: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#147D9F]"
                >
                  <option value="per person">Per Person</option>
                  <option value="per hour">Per Hour</option>
                  <option value="per booking">Per Booking</option>
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
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Estimated final price</p>
                <p className="mt-1 text-xl font-bold text-[#147D9F]">
                  {(
                    Number(form.price || 0) *
                    (1 - Number(form.discount || 0) / 100)
                  ).toFixed(0)}{" "}
                  EGP
                </p>
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
                  {editingItem ? "Save Changes" : "Add Price"}
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
        <p className="mt-2 text-2xl font-bold text-[#0C1226]">{value}</p>
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
  min,
  max,
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
        min={min}
        max={max}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#147D9F]"
      />
    </div>
  );
}