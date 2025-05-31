import { createClient } from '@libsql/client';

if (!process.env.TURSO_DB_URL) {
  throw new Error('TURSO_DB_URL is not defined');
}

if (!process.env.TURSO_DB_AUTH_TOKEN) {
  throw new Error('TURSO_DB_AUTH_TOKEN is not defined');
}

export const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN,
});

// Helper function to initialize database schema
export async function initializeSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      date TEXT,
      amount REAL,
      merchant TEXT,
      category TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      created_at TEXT,
      summary TEXT
    );
  `);
} 