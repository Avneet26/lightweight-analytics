import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Check for required environment variables
const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) {
    console.warn("⚠️  TURSO_DATABASE_URL not set. Database operations will fail.");
}

// Create the libSQL client
const client = createClient({
    url: databaseUrl || "file:local.db", // Fallback to local SQLite for development
    authToken: authToken,
});

// Create the drizzle database instance
export const db = drizzle(client, { schema });

// Export for direct queries if needed
export { client };
