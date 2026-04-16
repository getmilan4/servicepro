import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import oracledb from "oracledb";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_id");

  if (!session) {
    redirect("/login");
  }

  const connection = await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTION_STRING,
  });

  const result = await connection.execute(
    `SELECT ID FROM USERS
     WHERE CURRENT_SESSION_ID = :session
     AND SESSION_EXPIRES_AT > CURRENT_TIMESTAMP`,
    [session]
  );

  await connection.close();

  if (!result.rows || result.rows.length === 0) {
    redirect("/login");
  }

  return <div>Welcome to Dashboard 🚀</div>;
}