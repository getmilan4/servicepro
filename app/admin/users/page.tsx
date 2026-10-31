
import { requireUser } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { redirect } from "next/navigation";
import { createUser, updateUser } from "./actions";
import UserTable from "./UserTable";
import CreateUserForm from "./CreateUserForm";

type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  updatedAt: string;
};

export default async function UserManagementPage() {
  const currentUser = await requireUser();

  if (currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const pool = await getPool();
  const connection = await pool.getConnection();

  let users: UserRecord[] = [];

  try {
    const result = await connection.execute(`
      SELECT
        ID,
        FNAME,
        EMAIL,
        ROLE,
        STATUS,
        UPDATED_AT
      FROM USERS
      ORDER BY ID DESC
    `);

    users = (result.rows ?? []).map((row: unknown) => {
      const values = row as [
        number,
        string | null,
        string | null,
        string,
        string,
        Date | string | null
      ];

      return {
        id: Number(values[0]),
        name: values[1] ?? "—",
        email: values[2] ?? "—",
        role: values[3]?.trim().toUpperCase() ?? "EMPLOYEE",
        status: values[4]?.trim().toUpperCase() ?? "INACTIVE",
        updatedAt: values[5]
          ? new Date(values[5]).toLocaleDateString("en-IN")
          : "—",
      };
    });
  } finally {
    await connection.close();
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage platform users, roles and account access.
        </p>
      </div>

      {/* Add User */}
      {/* <section className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black bg-white placeholder:text-gray-400">
        <h2 className="text-lg font-semibold text-slate-800 mb-5">
          Add New User
        </h2>

        <form
          action={createUser.bind(null, {
            success: false,
            message: "",
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                maxLength={50}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                maxLength={255}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temporary Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                required
                defaultValue="EMPLOYEE"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="ADMIN">Admin</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="PARTNER">Partner</option>
                <option value="POS">POS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Status
              </label>
              <select
                name="status"
                defaultValue="INACTIVE"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="INACTIVE">Inactive</option>
                <option value="ACTIVE">Active</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Create User
          </button>
        </form>
      </section> */}
      <CreateUserForm />

      {/* User List */}
      {/* <section className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-black">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Platform Users
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {users.length} registered users
            </p>
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
              {users.map((user) => (
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
                    {String(currentUser.id) === String(user.id) ? (
                      <span className="text-xs text-gray-400">
                        Current user
                      </span>
                    ) : (
                      <form action={updateUser} className="flex flex-wrap gap-2">
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

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section> */}
      <UserTable
        users={users}
        currentUserId={currentUser.id}
      />
    </div>
  );
}
