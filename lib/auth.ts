// lib/auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";

export async function requireUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) redirect("/login");

  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `SELECT ID, EMAIL FROM USERS
       WHERE CURRENT_SESSION_ID = :sessionId
       AND SESSION_EXPIRES_AT > CURRENT_TIMESTAMP`,
      [sessionId]
    );

    const user = result.rows?.[0] as [number, string] | undefined;
    if (!user) redirect("/login");

    return { id: user[0], email: user[1] };
  } finally {
    await connection.close();
  }
}