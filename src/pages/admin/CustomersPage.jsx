import { useMemo, useState } from 'react';
import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';

const USERS_KEY = 'duck_users';

function readCustomers() {
  try {
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || '[]'
    );

    if (!Array.isArray(users)) return [];

    return users.filter(
      (user) => user.role === 'Customer'
    );
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) return 'Not specified';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not specified';
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatCard({ title, value, icon: Icon, iconStyle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-[#0C1226]">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(() => readCustomers());
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) => {
      const searchable = [
        customer.fullName,
        customer.email,
        customer.phone,
        customer.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [customers, search]);

  const refreshCustomers = () => {
    setCustomers(readCustomers());
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#147D9F]">
            Duck Management
          </p>

          <h1 className="text-2xl font-black text-[#0C1226] sm:text-3xl">
            Customers Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and manage registered customer accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshCustomers}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Customers"
          value={customers.length}
          icon={Users}
          iconStyle="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Registered Customers"
          value={customers.length}
          icon={UserCheck}
          iconStyle="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Customers Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0C1226]">
              All Customers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredCustomers.length} customer
              {filteredCustomers.length !== 1 ? 's' : ''} found
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
              placeholder="Search customers..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#147D9F] focus:bg-white sm:w-72"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0C1226] text-sm font-black text-[#FDFB45]">
                        {customer.fullName?.charAt(0)?.toUpperCase() || 'C'}
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {customer.fullName || 'Unnamed Customer'}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          ID: {customer.id || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {customer.email || 'No email'}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {customer.phone || 'Not provided'}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(customer.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      Customer
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(customer)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#147D9F] hover:bg-blue-50 hover:text-[#147D9F]"
                      aria-label="View customer details"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <UserPlus size={28} />
              </div>

              <h3 className="text-lg font-black text-[#0C1226]">
                No customers found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search
                  ? 'Try searching with another name, email or phone number.'
                  : 'Registered customer accounts will appear here.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1226]/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#147D9F]">
                  Customer Profile
                </p>

                <h2 className="mt-2 text-xl font-black text-[#0C1226]">
                  {selectedCustomer.fullName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Close details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Email</p>
                <p className="mt-1 break-all text-sm font-bold text-slate-800">
                  {selectedCustomer.email || 'Not provided'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Phone</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {selectedCustomer.phone || 'Not provided'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Registration Date</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {formatDate(selectedCustomer.createdAt)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="mt-6 w-full rounded-xl bg-[#0C1226] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#147D9F]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}