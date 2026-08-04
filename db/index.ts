import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDatabase() {
  const connectionString =
    process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("Lead storage is temporarily unavailable.");
  }

  return drizzle(connectionString, { schema });
}

let database: ReturnType<typeof createDatabase> | undefined;

export function getDb() {
  database ??= createDatabase();
  return database;
}
