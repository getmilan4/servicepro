
"use server";

import oracledb from "oracledb";
import { requireUser } from "@/lib/auth";
import { getPool } from "@/lib/db";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
  success: boolean;
  message: string;
};

const VALID_ROLES = ["ADMIN", "EMPLOYEE", "PARTNER", "POS", "WHIMREWARD"];
const VALID_STATUSES = ["ACTIVE", "INACTIVE"];

async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}


export async function createUser(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "").trim().toUpperCase();
  const status = String(formData.get("status") ?? "INACTIVE")
    .trim()
    .toUpperCase();

  if (!name || !email || !password) {
    return { success: false, message: "All fields are required." };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must contain at least 8 characters.",
    };
  }

  if (!VALID_ROLES.includes(role) || !VALID_STATUSES.includes(status)) {
    return { success: false, message: "Invalid role or account status." };
  }

  if (role === "WHIMREWARD" && status !== "ACTIVE") {
    return {
      success: false,
      message: "WhimReward accounts must remain ACTIVE.",
    };
  }

  const pool = await getPool();
  const connection = await pool.getConnection();


  try {
    await connection.execute(`ALTER SESSION DISABLE PARALLEL DML`);
    const existing = await connection.execute(
      `SELECT ID FROM USERS WHERE LOWER(EMAIL) = :email`,
      { email }
    );

    if (existing.rows && existing.rows.length > 0) {
      await connection.rollback();
      return { success: false, message: "A user with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "WHIMREWARD") {
      const apiUrl = process.env.WHIMREWARD_API_URL;
      const apiSecret = process.env.WHIMREWARD_API_SECRET;

      if (!apiUrl || !apiSecret) {
        await connection.rollback();
        return {
          success: false,
          message: "WhimReward API configuration is missing.",
        };
      }

      // Create the local Whimstack user and capture its Oracle ID.
      const insertResult = await connection.execute(
        `INSERT INTO USERS
    (FNAME, EMAIL, PASSWORD, ROLE, STATUS, UPDATED_AT)
   VALUES
    (:name, :email, :password, :role, :status, CURRENT_TIMESTAMP)
   RETURNING ID INTO :userId`,
        {
          name,
          email,
          password: hashedPassword,
          role,
          status,
          userId: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },
        }
      );

      const userId = (
        insertResult.outBinds as { userId: number[] }
      ).userId[0];

      if (!userId) {
        throw new Error("Unable to retrieve the newly created Whimstack user ID.");
      }

      // Provision the corresponding user in WhimReward.
      const response = await fetch(
        `${apiUrl.replace(/\/+$/, "")}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiSecret,
          },
          body: JSON.stringify({ name, email, password }),
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.user?.id) {
        await connection.rollback();

        console.error("WHIMREWARD USER CREATION FAILED:", {
          status: response.status,
          response: result,
        });

        return {
          success: false,
          message:
            response.status === 409
              ? "This email already exists in WhimReward. Please investigate before retrying."
              : "Unable to create the WhimReward account. No Whimstack user was saved.",
        };
      }

      const whimRewardUserId = String(result.user.id);

      // Link the WhimReward UUID to the exact local Oracle user.
      const updateResult = await connection.execute(
        `UPDATE USERS
         SET WHIMREWARD_USER_ID = :whimRewardUserId
         WHERE ID = :userId
         AND ROLE = 'WHIMREWARD'`,
        { whimRewardUserId, userId }
      );

      if (updateResult.rowsAffected !== 1) {
        throw new Error("Failed to link the WhimReward account.");
      }

      await connection.commit();

    } else {
      // Existing Whimstack user creation.
      await connection.execute(
        `INSERT INTO USERS
          (FNAME, EMAIL, PASSWORD, ROLE, STATUS, UPDATED_AT)
         VALUES
          (:name, :email, :password, :role, :status, CURRENT_TIMESTAMP)`,
        { name, email, password: hashedPassword, role, status },
        { autoCommit: true }
      );
    }
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // Preserve the original error.
    }

    console.error("CREATE USER ERROR:", error);

    return {
      success: false,
      message: "Unable to create user. Please check the details and try again.",
    };
  } finally {
    await connection.close();
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return {
    success: true,
    message:
      role === "WHIMREWARD"
        ? "WhimReward user created and linked successfully."
        : "User created successfully.",
  };
}


export async function updateUser(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const id = Number(formData.get("id"));
  const role = String(formData.get("role") ?? "").trim().toUpperCase();
  const status = String(formData.get("status") ?? "").trim().toUpperCase();

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, message: "Invalid user ID." };
  }

  if (!VALID_ROLES.includes(role) || !VALID_STATUSES.includes(status)) {
    return { success: false, message: "Invalid role or account status." };
  }

  if (role === "WHIMREWARD" && status !== "ACTIVE") {
    return {
      success: false,
      message: "WhimReward accounts must remain ACTIVE.",
    };
  }

  if (String(admin.id) === String(id)) {
    return {
      success: false,
      message: "You cannot change your own role or account status.",
    };
  }

  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `SELECT ROLE, STATUS FROM USERS WHERE ID = :id`,
      { id }
    );

    const existing = result.rows?.[0] as
      [string, string] | undefined;

    if (!existing) {
      return { success: false, message: "User not found." };
    }

    const wasActiveAdmin =
      existing[0]?.trim().toUpperCase() === "ADMIN" &&
      existing[1]?.trim().toUpperCase() === "ACTIVE";

    if (wasActiveAdmin && !(role === "ADMIN" && status === "ACTIVE")) {
      const countResult = await connection.execute(
        `SELECT COUNT(*) FROM USERS
         WHERE UPPER(TRIM(ROLE)) = 'ADMIN'
         AND UPPER(TRIM(STATUS)) = 'ACTIVE'`
      );

      const activeAdmins = Number(
        (countResult.rows?.[0] as [number] | undefined)?.[0] ?? 0
      );

      if (activeAdmins <= 1) {
        return {
          success: false,
          message: "You cannot demote or deactivate the last active administrator.",
        };
      }
    }

    await connection.execute(
      `UPDATE USERS
       SET ROLE = :role,
           STATUS = :status,
           CURRENT_SESSION_ID = NULL,
           SESSION_EXPIRES_AT = NULL,
           UPDATED_AT = CURRENT_TIMESTAMP
       WHERE ID = :id`,
      { role, status, id },
      { autoCommit: true }
    );
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return {
      success: false,
      message: "Unable to update user. Please try again.",
    };
  } finally {
    await connection.close();
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return { success: true, message: "User updated successfully." };
}
