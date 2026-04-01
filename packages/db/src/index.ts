import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: postgres.Sql | null = null;
let database: ReturnType<typeof drizzle> | null = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

function getClient() {
  if (client) {
    return client;
  }

  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  client = postgres(databaseUrl, { max: 1 });
  return client;
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

export function getDb() {
  if (database) {
    return database;
  }

  database = drizzle(getClient(), { schema });
  return database;
}

export async function checkDatabaseHealth() {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      configured: false,
      error: 'DATABASE_URL is not configured',
    };
  }

  try {
    await getClient()`select 1 as ok`;

    return {
      ok: true,
      configured: true,
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function closeDb() {
  if (!client) {
    return;
  }

  await client.end();
  client = null;
  database = null;
}

export { schema };
