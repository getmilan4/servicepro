
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

      <CreateUserForm />

      {/* User List */}
      <UserTable
        users={users}
        currentUserId={currentUser.id}
      />
    </div>
  );
}
