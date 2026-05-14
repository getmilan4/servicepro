export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { getPool } = await import("./lib/db");
      await getPool();
      console.log("✅ DB pool ready");
    } catch (err) {
      console.error("❌ DB pool failed to initialize:", err);
    }
  }
}