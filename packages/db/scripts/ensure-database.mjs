import { loadEnv } from '@nestjs-react-router/env';
import postgres from 'postgres';

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

loadEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not configured. Copy .env.example to .env or set DATABASE_URL.');
  process.exit(1);
}

const targetUrl = new URL(databaseUrl);
const databaseName = decodeURIComponent(targetUrl.pathname.replace(/^\//, ''));

if (!databaseName) {
  console.error('DATABASE_URL must include a database name.');
  process.exit(1);
}

const adminUrl = new URL(databaseUrl);
adminUrl.pathname = '/postgres';

const sql = postgres(adminUrl.toString(), { max: 1 });

try {
  const existing = await sql`select 1 from pg_database where datname = ${databaseName} limit 1`;

  if (existing.length === 0) {
    await sql.unsafe(`create database ${quoteIdentifier(databaseName)}`);
    console.log(`Created database ${databaseName}`);
  }
} catch (error) {
  if (error?.code === '42P04') {
    // Another process created it between the existence check and CREATE DATABASE.
    process.exit(0);
  }

  if (error?.code === '42501') {
    console.error(
      `Database ${databaseName} does not exist, and the configured user cannot create databases. Create it manually or use a DATABASE_URL with CREATEDB permission for pnpm db:push.`
    );
    process.exit(1);
  }

  if (error?.code === '3D000') {
    console.error(
      'Could not connect to the postgres maintenance database. Create the target database manually, ' +
        'or set DATABASE_URL to a Postgres server that has a postgres maintenance database.'
    );
    process.exit(1);
  }

  console.error(`Failed to ensure database ${databaseName}:`, error);
  process.exit(1);
} finally {
  await sql.end({ timeout: 5 });
}
