import oracledb from "oracledb";

let pool: Awaited<ReturnType<typeof oracledb.createPool>>;

export async function getPool() {
  if (!pool) {

    console.log("🔥 Creating DB pool...");
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECT_STRING,
      configDir: process.cwd() + "/wallet",

      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
    });
  }
  return pool;
}