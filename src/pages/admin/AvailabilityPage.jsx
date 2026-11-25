import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

const AVAILABILITY_KEY = 'duck_availability';
const ACTIVITIES_KEY = 'duck_activities';

const EMPTY_FORM = {
  activityId: '',
  date: '',
  time: '',
  capacity: '',
  status: 'available',
};

function readStorage(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');

    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveAvailability(items) {
  localStorage.setItem(
    AVAILABILITY_KEY,
    JSON.stringify(items)
  );
}

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function AvailabilityModal({
  item,
  activities,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(
    item
      ? {
          activityId: item.activityId || '',
          date: item.date || '',
          time: item.time || '',
          capacity: item.capacity ?? '',
          status: item.status || 'available',
        }
      : {
          ...EMPTY_FORM,
          activityId: activities[0]?.id || '',
        }
  );

  const [error, setError] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.activityId) {
      setError('Please select an activity.');
      return;
    }

    if (!form.date || !form.time) {
      setError('Date and time are required.');
      return;
    }

    if (
      form.capacity === '' ||
      Number(form.capacity) < 0
    ) {
      setError('Please enter a valid capacity.');
      return;
    }

    onSave({
      ...form,
      capacity: Number(form.capacity),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1226]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#147D9F]">
              Availability Management
            </p>

            <h2 className="mt-2 text-xl font-black text-[#0C1226]">
              {item ? 'Edit Schedule' : 'Add Schedule'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="availability-activity"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Activity
            </label>

            <select
              id="availability-activity"
              name="activityId"
              value={form.activityId}
              onChange={updateField}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
            >
              <option value="">Select activity</option>

              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="availability-date"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Date
              </label>

              <input
                id="availability-date"
                name="date"
                type="date"
                value={form.date}
                onChange={updateField}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147D9F]"
              />
            </div>

            <div>
              <label
                htmlFor="availability-time"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Time
              </label>

              <input
                id="availability-time"
                name="time"
                type="time"
                value={form.time}
                onChange={updateField}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147D9F]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="availability-capacity"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Available Capacity
            </label>

            <input
              id="availability-capacity"
              name="capacity"
              type="number"
              min="0"
              value={form.capacity}
              onChange={updateField}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
            />
          </div>

          <div>
            <label
              htmlFor="availability-status"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Status
            </label>

            <select
              id="availability-status"
              name="status"
              value={form.status}
              onChange={updateField}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0C1226] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#147D9F]"
            >
              <Save size={16} />
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AvailabilityPage() {
  const [activities, setActivities] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setActivities(readStorage(ACTIVITIES_KEY));
    setItems(readStorage(AVAILABILITY_KEY));
  }, []);

  const getActivityName = (activityId) => {
    return (
      activities.find(
        (activity) => String(activity.id) === String(activityId)
      )?.name || 'Unknown Activity'
    );
  };

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        getActivityName(item.activityId)
          .toLowerCase()
          .includes(query) ||
        item.date?.includes(query) ||
        item.time?.includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter, activities]);

  const persistItems = (updatedItems) => {
    setItems(updatedItems);
    saveAvailability(updatedItems);
  };

  const handleSave = (formData) => {
    let updatedItems;

    if (editingItem) {
      updatedItems = items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              ...formData,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
    } else {
      updatedItems = [
        {
          id: `availability_${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
        },
        ...items,
      ];
    }

    persistItems(updatedItems);
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this schedule?'
    );

    if (!confirmed) return;

    persistItems(
      items.filter((entry) => entry.id !== item.id)
    );
  };

  const availableCount = items.filter(
    (item) => item.status === 'available'
  ).length;

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#147D9F]">
            Duck Management
          </p>

          <h1 className="text-2xl font-black text-[#0C1226] sm:text-3xl">
            Availability Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage activity schedules, time slots and capacity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          disabled={activities.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FDFB45] px-5 py-3 text-sm font-black text-[#0C1226] shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Add Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Schedules
          </p>

          <p className="mt-3 text-3xl font-black text-[#0C1226]">
            {items.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Available Slots
          </p>

          <p className="mt-3 text-3xl font-black text-emerald-600">
            {availableCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Unavailable Slots
          </p>

          <p className="mt-3 text-3xl font-black text-slate-400">
            {items.length - availableCount}
          </p>
        </div>
      </div>

      {/* Schedule Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0C1226]">
              Activity Schedules
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredItems.length} schedules found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search schedules..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#147D9F] sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[#147D9F]"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setActivities(readStorage(ACTIVITIES_KEY));
                setItems(readStorage(AVAILABILITY_KEY));
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Activity</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Capacity</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">
                      {getActivityName(item.activityId)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays
                        size={16}
                        className="text-slate-400"
                      />
                      {formatDate(item.date)}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock3
                        size={16}
                        className="text-slate-400"
                      />
                      {item.time}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-slate-700">
                    {item.capacity}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        item.status === 'available'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-red-200 bg-red-50 text-red-700'
                      }`}
                    >
                      {item.status === 'available'
                        ? 'Available'
                        : 'Unavailable'}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(item);
                          setModalOpen(true);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#147D9F] hover:bg-blue-50 hover:text-[#147D9F]"
                        aria-label="Edit schedule"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete schedule"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <CalendarDays size={28} />
              </div>

              <h3 className="text-lg font-black text-[#0C1226]">
                No schedules found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Add a schedule to start managing activity availability.
              </p>
            </div>
          )}
        </div>
      </section>

      {modalOpen && (
        <AvailabilityModal
          item={editingItem}
          activities={activities}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}