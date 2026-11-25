import { useState } from 'react';
import { Shield, Search, UserCheck } from 'lucide-react';
import { ROLES } from '../../entities/user/model/roles.js';

const USERS_KEY = 'duck_users';

function readUsers() {
  try {
    const raw = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export default function UsersPage() {
  const [users] = useState(() => readUsers());
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [u.fullName, u.email, u.role].some((v) =>
      String(v || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0C1226]">Users & Permissions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage platform accounts and assigned RBAC roles.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-[#0C1226] outline-none focus:border-[#067BA1]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Total Users</span>
            <UserCheck size={20} className="text-[#067BA1]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#0C1226]">{users.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Available Roles</span>
            <Shield size={20} className="text-[#0C1226]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#0C1226]">
            {Object.keys(ROLES).length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5 font-semibold text-[#0C1226]">
                      {user.fullName || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#067BA1]">
                        {user.role || ROLES.CUSTOMER}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
