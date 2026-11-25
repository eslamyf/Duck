import { useMemo, useState } from 'react';
import {
  Waves,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const ACTIVITIES_KEY = 'duck_activities';

const INITIAL_ACTIVITIES = [
  {
    id: 'kayak',
    name: 'Kayak',
    category: 'Water Sports',
    description: 'Enjoy kayaking and explore the water.',
    price: 500,
    capacity: 20,
    duration: 60,
    active: true,
  },
  {
    id: 'water-bike',
    name: 'Water Bike',
    category: 'Water Sports',
    description: 'A fun water cycling experience.',
    price: 350,
    capacity: 2,
    duration: 30,
    active: true,
  },
  {
    id: 'sup',
    name: 'Stand Up Paddle',
    category: 'Water Sports',
    description: 'Experience stand up paddle boarding.',
    price: 400,
    capacity: 0,
    duration: 60,
    active: true,
  },
];

const EMPTY_FORM = {
  name: '',
  category: 'Water Sports',
  description: '',
  price: '',
  capacity: '',
  duration: '',
};

function readActivities() {
  try {
    const stored = localStorage.getItem(ACTIVITIES_KEY);

    if (stored === null) {
      localStorage.setItem(
        ACTIVITIES_KEY,
        JSON.stringify(INITIAL_ACTIVITIES)
      );

      return INITIAL_ACTIVITIES;
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveActivities(activities) {
  localStorage.setItem(
    ACTIVITIES_KEY,
    JSON.stringify(activities)
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function ActivityModal({
  activity,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(
    activity
      ? {
          name: activity.name || '',
          category: activity.category || 'Water Sports',
          description: activity.description || '',
          price: activity.price ?? '',
          capacity: activity.capacity ?? '',
          duration: activity.duration ?? '',
        }
      : EMPTY_FORM
  );

  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('Activity name is required.');
      return;
    }

    if (form.price === '' || Number(form.price) < 0) {
      setError('Please enter a valid price.');
      return;
    }

    if (form.capacity === '' || Number(form.capacity) < 0) {
      setError('Please enter a valid capacity.');
      return;
    }

    if (form.duration === '' || Number(form.duration) <= 0) {
      setError('Please enter a valid duration.');
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      capacity: Number(form.capacity),
      duration: Number(form.duration),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1226]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#147D9F]">
              Activity Management
            </p>

            <h2 className="mt-2 text-xl font-black text-[#0C1226]">
              {activity ? 'Edit Activity' : 'Add New Activity'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="activity-name"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Activity Name
            </label>

            <input
              id="activity-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Kayak"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
            />
          </div>

          <div>
            <label
              htmlFor="activity-category"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Category
            </label>

            <input
              id="activity-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
            />
          </div>

          <div>
            <label
              htmlFor="activity-description"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="activity-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe this activity..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="activity-price"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Price (EGP)
              </label>

              <input
                id="activity-price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147D9F]"
              />
            </div>

            <div>
              <label
                htmlFor="activity-capacity"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Capacity
              </label>

              <input
                id="activity-capacity"
                name="capacity"
                type="number"
                min="0"
                value={form.capacity}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147D9F]"
              />
            </div>

            <div>
              <label
                htmlFor="activity-duration"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Duration (min)
              </label>

              <input
                id="activity-duration"
                name="duration"
                type="number"
                min="1"
                value={form.duration}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#147D9F]"
              />
            </div>
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
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState(() => readActivities());
  const [search, setSearch] = useState('');
  const [modalActivity, setModalActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return activities;

    return activities.filter((activity) =>
      [
        activity.name,
        activity.category,
        activity.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [activities, search]);

  const activeCount = activities.filter(
    (activity) => activity.active
  ).length;

  const persistActivities = (updatedActivities) => {
    setActivities(updatedActivities);
    saveActivities(updatedActivities);
  };

  const openCreateModal = () => {
    setModalActivity(null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setModalActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = (formData) => {
    let updatedActivities;

    if (modalActivity) {
      updatedActivities = activities.map((activity) =>
        activity.id === modalActivity.id
          ? {
              ...activity,
              ...formData,
              updatedAt: new Date().toISOString(),
            }
          : activity
      );
    } else {
      const newActivity = {
        id: `activity_${Date.now()}`,
        ...formData,
        active: true,
        createdAt: new Date().toISOString(),
      };

      updatedActivities = [
        newActivity,
        ...activities,
      ];
    }

    persistActivities(updatedActivities);
    setIsModalOpen(false);
    setModalActivity(null);
  };

  const handleToggleActivity = (activityId) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === activityId
        ? {
            ...activity,
            active: !activity.active,
          }
        : activity
    );

    persistActivities(updatedActivities);
  };

  const handleDeleteActivity = (activity) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${activity.name}"?`
    );

    if (!confirmed) return;

    const updatedActivities = activities.filter(
      (item) => item.id !== activity.id
    );

    persistActivities(updatedActivities);
  };

  return (
    <div className="space-y-7">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#147D9F]">
            Duck Management
          </p>

          <h1 className="text-2xl font-black text-[#0C1226] sm:text-3xl">
            Activities Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage water activities, pricing and capacity.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FDFB45] px-5 py-3 text-sm font-black text-[#0C1226] shadow-sm transition hover:brightness-95"
        >
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Activities
          </p>

          <p className="mt-3 text-3xl font-black text-[#0C1226]">
            {activities.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Activities
          </p>

          <p className="mt-3 text-3xl font-black text-emerald-600">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Inactive Activities
          </p>

          <p className="mt-3 text-3xl font-black text-slate-400">
            {activities.length - activeCount}
          </p>
        </div>
      </div>

      {/* Activity List */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0C1226]">
              All Activities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredActivities.length} activities found
            </p>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search activities..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#147D9F] focus:bg-white sm:w-72"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredActivities.map((activity) => (
            <article
              key={activity.id}
              className="overflow-hidden rounded-2xl border border-slate-200 transition hover:border-[#147D9F]/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between bg-[#0C1226] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDFB45] text-[#0C1226]">
                  <Waves size={24} />
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    activity.active
                      ? 'bg-emerald-400/15 text-emerald-300'
                      : 'bg-slate-400/15 text-slate-300'
                  }`}
                >
                  {activity.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#147D9F]">
                    {activity.category}
                  </p>

                  <h3 className="mt-2 text-xl font-black text-[#0C1226]">
                    {activity.name}
                  </h3>

                  <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
                    {activity.description || 'No description provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs text-slate-400">Price</p>
                    <p className="mt-1 text-sm font-black text-[#0C1226]">
                      {formatCurrency(activity.price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Capacity</p>
                    <p className="mt-1 text-sm font-black text-[#0C1226]">
                      {activity.capacity || 'TBD'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="mt-1 text-sm font-black text-[#0C1226]">
                      {activity.duration} min
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleToggleActivity(activity.id)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#147D9F]"
                  >
                    {activity.active ? (
                      <ToggleRight
                        size={24}
                        className="text-emerald-500"
                      />
                    ) : (
                      <ToggleLeft
                        size={24}
                        className="text-slate-400"
                      />
                    )}

                    {activity.active ? 'Disable' : 'Enable'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(activity)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#147D9F] hover:bg-blue-50 hover:text-[#147D9F]"
                      aria-label={`Edit ${activity.name}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteActivity(activity)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${activity.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Waves size={28} />
            </div>

            <h3 className="text-lg font-black text-[#0C1226]">
              No activities found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add an activity or try another search.
            </p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <ActivityModal
          activity={modalActivity}
          onClose={() => {
            setIsModalOpen(false);
            setModalActivity(null);
          }}
          onSave={handleSaveActivity}
        />
      )}
    </div>
  );
}