import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ws from "ws";

// If Next's env loading didn't run for this worker, fall back to loading `web/.env`.
// Keep it conditional to avoid noisy dotenv logs in dev.
if (!process.env.DATABASE_URL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  loadDotenv({ path: path.resolve(__dirname, "../../.env") });
}

// Configure WebSocket for Node.js runtime (required for the Neon serverless driver).
neonConfig.webSocketConstructor = ws;

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is missing at runtime. Ensure web/.env exists and Next is started from the web folder."
    );
  }

  // PrismaNeon expects a neon PoolConfig, not a Pool instance.
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
