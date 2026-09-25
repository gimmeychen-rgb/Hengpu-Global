import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing required environment variable: DATABASE_URL');
}

export const db = new Pool({
  connectionString: process.env.DATABASE_URL
});
