
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getPool } from "@/lib/db";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) return null;

  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `SELECT ID, FNAME, EMAIL, ROLE
       FROM USERS
       WHERE CURRENT_SESSION_ID = :sessionId
       AND SESSION_EXPIRES_AT > CURRENT_TIMESTAMP`,
      [sessionId]
    );

    const user = result.rows?.[0] as
      [number, string, string, string] | undefined;

    if (!user) return null;

    return {
      id: user[0],
      name: user[1],
      email: user[2],
      role: user[3].trim().toUpperCase(),
    };
  } finally {
    await connection.close();
  }
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return user;
}