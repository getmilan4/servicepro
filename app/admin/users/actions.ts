
"use server";

import { requireUser } from "@/lib/auth";
import { getPool } from "@/lib/db";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
  success: boolean;
  message: string;
};

const VALID_ROLES = ["ADMIN", "EMPLOYEE", "PARTNER", "POS"];
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

  const hashedPassword = await bcrypt.hash(password, 10);
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const existing = await connection.execute(
      `SELECT ID FROM USERS WHERE LOWER(EMAIL) = :email`,
      { email }
    );

    if (existing.rows && existing.rows.length > 0) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    await connection.execute(
      `INSERT INTO USERS
        (FNAME, EMAIL, PASSWORD, ROLE, STATUS, UPDATED_AT)
       VALUES
        (:name, :email, :password, :role, :status, CURRENT_TIMESTAMP)`,
      { name, email, password: hashedPassword, role, status },
      { autoCommit: true }
    );
  } catch (error) {
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

  return { success: true, message: "User created successfully." };
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
