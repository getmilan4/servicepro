
"use client";

import { useState } from "react";
import { updateUser } from "./actions";

type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  updatedAt: string;
};

type Props = {
  users: UserRecord[];
  currentUserId: number | string;
};

export default function UserTable({ users, currentUserId }: Props) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();

    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  async function handleUpdate(formData: FormData) {
    await updateUser(
      { success: false, message: "" },
      formData
    );
  }

  return (
    <section className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-black">

      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Platform Users
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {filteredUsers.length} of {users.length} users
            </p>
          </div>

          {/* Live Search */}
          <div className="w-full md:w-80">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.email}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="text-xs font-medium text-slate-700">
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {user.updatedAt}
                </td>

                <td className="px-5 py-4">
                  {String(currentUserId) === String(user.id) ? (
                    <span className="text-xs text-gray-400">
                      Current user
                    </span>
                  ) : (
                    <form
                      action={handleUpdate}
                      className="flex flex-wrap gap-2"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={user.id}
                      />

                      <select
                        name="role"
                        defaultValue={user.role}
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white"
                        aria-label={`Role for ${user.email}`}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="PARTNER">Partner</option>
                        <option value="POS">POS</option>
                      </select>

                      <select
                        name="status"
                        defaultValue={user.status}
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white"
                        aria-label={`Status for ${user.email}`}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>

                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-700 text-white rounded-md px-3 py-1 text-xs transition"
                      >
                        Save
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  {search
                    ? "No users match your search."
                    : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
