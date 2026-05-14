"use server";

import { cookies } from "next/headers";
import { getPool } from "@/lib/db";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

   // Clear cookie immediately
  if (sessionId) {
    cookieStore.delete("session_id");

    // Fire DB cleanup in background
    getPool().then(pool => pool.getConnection()).then(connection => {
      connection.execute(
        `UPDATE USERS
         SET CURRENT_SESSION_ID = NULL,
             SESSION_EXPIRES_AT = NULL
         WHERE CURRENT_SESSION_ID = :sessionId`,
        { sessionId },
        { autoCommit: true }
      ).finally(() => connection.close());
    }).catch(err => console.error("Logout DB error:", err));
  }

  redirect("/login");
}
