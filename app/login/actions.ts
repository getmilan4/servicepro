"use server";

import { cookies } from "next/headers";
import { getPool } from "@/lib/db";
import bcrypt from "bcrypt";


type AuthResponse = {
  success: boolean;
  message?: string;
};

const DUMMY_HASH = "$2b$10$dummyhashfordummyusertpreventtimingenumeration";

export async function login(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("username") as string;
  const password = formData.get("password") as string;

  let connection;

  try {
    const pool = await getPool();
    connection = await pool.getConnection();


    // 1. Get user
    const result = await connection.execute(
      `SELECT ID, PASSWORD, STATUS FROM USERS WHERE EMAIL = :email`,
      [email]
    );



    if (!result.rows || result.rows.length === 0) {
      await bcrypt.compare(password, DUMMY_HASH);
      return { success: false };
    }

    const user = result.rows[0] as any;
    const userId = user[0];
    const hashedPassword = user[1];
    const status = user[2];

    // 2. Check status before password
    if (status !== 'ACTIVE') {
      await bcrypt.compare(password, DUMMY_HASH); // prevent timing attack
      return { success: false };
    }

    // 3. Verify password
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      return { success: false };
    }

    // 4. Create new session
    const sessionId = crypto.randomUUID();

    // 5. Update session (this kills old one automatically)
    await connection.execute(
      `UPDATE USERS
       SET CURRENT_SESSION_ID = :sessionId,
           SESSION_EXPIRES_AT = CURRENT_TIMESTAMP + INTERVAL '1' DAY,
           UPDATED_AT = CURRENT_TIMESTAMP
       WHERE ID = :userId`,
      { sessionId, userId },
      { autoCommit: true }
    );

    // 6. Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return { success: true };

  } catch (err) {
    console.error(err);
    return { success: false };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}


export async function register(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("username") as string;
  const password = formData.get("password") as string;

  let connection;

  try {
    const pool = await getPool();
    connection = await pool.getConnection();

    // 🔍 1. Check if user already exists
    const existingUser = await connection.execute(
      `SELECT ID FROM USERS WHERE EMAIL = :email`,
      { email }
    );

    if (existingUser.rows && existingUser.rows.length > 0) {
      return { success: false, message: "User already exists" };
    }

    // 🔐 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // 💾 3. Insert new user
    await connection.execute(
      `INSERT INTO USERS 
       (EMAIL, PASSWORD, UPDATED_AT, STATUS)
       VALUES 
       (:email, :password, CURRENT_TIMESTAMP, 'INACTIVE')`,
      {
        email,
        password: hashedPassword,
      },
      { autoCommit: true }
    );
    return { success: true, message: "Registration successful. Await admin approval." };

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return { success: false, message: "Server error" };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Connection close error:", err);
      }
    }
  }
}