
import oracledb from "oracledb";

type Pool = Awaited<ReturnType<typeof oracledb.createPool>>;

const g = global as typeof globalThis & { __oraclePool?: Pool };

export async function getPool(): Promise<Pool> {
  if (!g.__oraclePool) {
    console.log("🔥 Creating DB pool...");
    g.__oraclePool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECT_STRING,
      configDir: process.cwd() + "/wallet",
      poolMin: 2,   // pre-warm 2 connections
      poolMax: 10,
      poolIncrement: 1,
    });
  }
  return g.__oraclePool;
}