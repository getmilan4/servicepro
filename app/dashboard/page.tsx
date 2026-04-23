import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import oracledb from "oracledb";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const connection = await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECT_STRING,
    configDir: process.cwd() + "/wallet",
  });

  console.log("sessionId:", sessionId);

  const result = await connection.execute(
    `SELECT ID, EMAIL FROM USERS
     WHERE CURRENT_SESSION_ID = :sessionId
     AND SESSION_EXPIRES_AT > CURRENT_TIMESTAMP`,
    [sessionId]
  );

  await connection.close();

  const user = result.rows?.[0];

  if (!user) {
    redirect("/login");
  }

  return <div>Welcome {user[1]} 🚀</div>;
}