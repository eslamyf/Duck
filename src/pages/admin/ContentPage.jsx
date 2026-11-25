import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  Eye,
  EyeOff,
  Image,
} from "lucide-react";

const STORAGE_KEY = "duck_content";

const initialContent = [
  {
    id: 1,
    title: "Welcome to DUCK",
    type: "Banner",
    language: "English",
    status: "Published",
    description: "Explore exciting water activities and experiences.",
  },
  {
    id: 2,
    title: "مرحبًا بك في DUCK",
    type: "Banner",
    language: "Arabic",
    status: "Published",
    description: "اكتشف أنشطة وتجارب مائية ممتعة.",
  },
  {
    id: 3,
    title: "Kayak Activity Guide",
    type: "Article",
    language: "English",
    status: "Draft",
    description: "A guide to enjoying your kayak experience.",
  },
];

const emptyForm = {
  title: "",
  type: "Banner",
  language: "English",
  status: "Draft",
  description: "",
};

function readContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) return JSON.parse(saved);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContent));
    return initialContent;
  } catch {
    return initialContent;
  }
}

export default function ContentPage() {
  const [content, setContent] = useState(readContent);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [content, search, typeFilter, statusFilter]);

  const publishedCount = content.filter(
    (item) => item.status === "Published"
  ).length;

  const draftCount = content.filter(
    (item) => item.status === "Draft"
  ).length;

  function openAddModal() {
    setEditingContent(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(item) {
    setEditingContent(item);
    setForm({
      title: item.title,
      type: item.type,
      language: item.language,
      status: item.status,
      description: item.description,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingContent(null);
    setForm(emptyForm);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    if (editingContent) {
      setContent((current) =>
        current.map((item) =>
          item.id === editingContent.id
            ? { ...item, ...form }
            : item
        )
      );
    } else {
      setContent((current) => [
        ...current,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    closeModal();
  }

  function deleteContent(id) {
    if (!window.confirm("هل أنت متأكد من حذف المحتوى؟")) return;

    setContent((current) => current.filter((item) => item.id !== id));
  }

  function togglePublish(id) {
    setContent((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Published" ? "Draft" : "Published",
            }
          : item
      )
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0C1226]">
            Content Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage website banners, articles, and content.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FDFB45] px-5 py-3 font-semibold text-[#0C1226] hover:brightness-95"
        >
          <Plus size={18} />
          Add Content
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Content"
          value={content.length}
          icon={<FileText size={20} />}
        />

        <StatCard
          title="Published"
          value={publishedCount}
          icon={<Eye size={20} />}
        />

        <StatCard
          title="Drafts"
          value={draftCount}
          icon={<EyeOff size={20} />}
        />
      </div>

      {/* Content List */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search content..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#147D9F]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
            >
              <option value="All">All Types</option>
              <option value="Banner">Banner</option>
              <option value="Article">Article</option>
              <option value="FAQ">FAQ</option>
              <option value="Page">Page</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#147D9F]"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Content</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="max-w-md px-6 py-4">
                    <p className="font-semibold text-[#0C1226]">
                      {item.title}
                    </p>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {item.description || "No description"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      {item.type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.language}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(item.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        item.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
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
                        title="Edit content"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteContent(item.id)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete content"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredContent.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No content found.
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
                {editingContent ? "Edit Content" : "Add Content"}
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
                label="Title"
                value={form.title}
                onChange={(value) =>
                  setForm((current) => ({ ...current, title: value }))
                }
                required
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Content Type
                </label>

                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#147D9F]"
                >
                  <option value="Banner">Banner</option>
                  <option value="Article">Article</option>
                  <option value="FAQ">FAQ</option>
                  <option value="Page">Page</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Language
                </label>

                <select
                  value={form.language}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      language: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#147D9F]"
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
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
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Write content description..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#147D9F]"
                />
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
                  {editingContent ? "Save Changes" : "Add Content"}
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

function FormField({ label, value, onChange, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#147D9F]"
      />
    </div>
  );
}