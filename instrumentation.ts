
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPool } = await import("./lib/db");
    await getPool();
    console.log("✅ DB pool ready");
  }
}