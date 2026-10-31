
import { requireUser } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { redirect } from "next/navigation";

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">
        {value.toLocaleString("en-IN")}
      </p>
      <p className="text-xs text-gray-400 mt-2">{description}</p>
    </div>
  );
}

export default async function AdminPage() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const pool = await getPool();
  const connection = await pool.getConnection();

  let stats = {
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    newCustomers: 0,
    totalUsers: 0,
    activeUsers: 0,
  };

  let kycBreakdown: { status: string; total: number }[] = [];
  let roleBreakdown: { role: string; total: number }[] = [];

  try {
    // Main dashboard statistics
    const result = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM CUSTOMERS) AS TOTAL_CUSTOMERS,
        (SELECT COUNT(*) FROM CUSTOMERS
          WHERE UPPER(TRIM(ACCOUNT_STATUS)) = 'ACTIVE') AS ACTIVE_CUSTOMERS,
        (SELECT COUNT(*) FROM CUSTOMERS
          WHERE UPPER(TRIM(ACCOUNT_STATUS)) = 'INACTIVE') AS INACTIVE_CUSTOMERS,
        (SELECT COUNT(*) FROM CUSTOMERS
          WHERE CREATED_AT >= SYSTIMESTAMP - INTERVAL '30' DAY) AS NEW_CUSTOMERS,
        (SELECT COUNT(*) FROM USERS) AS TOTAL_USERS,
        (SELECT COUNT(*) FROM USERS
          WHERE UPPER(TRIM(STATUS)) = 'ACTIVE') AS ACTIVE_USERS
      FROM DUAL
    `);

    const row = result.rows?.[0] as
      (number | string)[] | undefined;

    if (row) {
      stats = {
        totalCustomers: Number(row[0] ?? 0),
        activeCustomers: Number(row[1] ?? 0),
        inactiveCustomers: Number(row[2] ?? 0),
        newCustomers: Number(row[3] ?? 0),
        totalUsers: Number(row[4] ?? 0),
        activeUsers: Number(row[5] ?? 0),
      };
    }

    // KYC status distribution
    const kycResult = await connection.execute(`
      SELECT
        NVL(UPPER(TRIM(KYC_STATUS)), 'NOT SET') AS STATUS,
        COUNT(*) AS TOTAL
      FROM CUSTOMERS
      GROUP BY NVL(UPPER(TRIM(KYC_STATUS)), 'NOT SET')
      ORDER BY STATUS
    `);

    kycBreakdown = (kycResult.rows ?? []).map((item: unknown) => {
      const values = item as [string, number];

      return {
        status: values[0],
        total: Number(values[1]),
      };
    });

    // User role distribution
    const roleResult = await connection.execute(`
      SELECT ROLE, COUNT(*) AS TOTAL
      FROM USERS
      GROUP BY ROLE
      ORDER BY ROLE
    `);

    roleBreakdown = (roleResult.rows ?? []).map((item: unknown) => {
      const values = item as [string, number];

      return {
        role: values[0],
        total: Number(values[1]),
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
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, {user.name}. Here's your platform overview.
        </p>
      </div>

      {/* Customer statistics */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Customer Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            description="All registered customers"
          />

          <StatCard
            title="Active Customers"
            value={stats.activeCustomers}
            description="Customers with active accounts"
          />

          <StatCard
            title="Inactive Customers"
            value={stats.inactiveCustomers}
            description="Customers with inactive accounts"
          />

          <StatCard
            title="New Customers"
            value={stats.newCustomers}
            description="Registered in the last 30 days"
          />
        </div>
      </section>

      {/* User statistics */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Platform Users
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            description="All registered platform users"
          />

          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            description="Users with active accounts"
          />
        </div>
      </section>

      {/* Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">
            Customer KYC Distribution
          </h2>

          {kycBreakdown.length === 0 ? (
            <p className="text-sm text-gray-500">No KYC records found.</p>
          ) : (
            <div className="space-y-3">
              {kycBreakdown.map((item) => (
                <div
                  key={item.status}
                  className="flex justify-between items-center border-b border-gray-100 pb-2"
                >
                  <span className="text-sm text-gray-600">
                    {item.status}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {item.total.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">
            User Role Distribution
          </h2>

          {roleBreakdown.length === 0 ? (
            <p className="text-sm text-gray-500">No users found.</p>
          ) : (
            <div className="space-y-3">
              {roleBreakdown.map((item) => (
                <div
                  key={item.role}
                  className="flex justify-between items-center border-b border-gray-100 pb-2"
                >
                  <span className="text-sm text-gray-600">
                    {item.role}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {item.total.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
