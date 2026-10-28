import { Pool } from 'pg';

export const pool = new Pool({
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    ssl: true
});