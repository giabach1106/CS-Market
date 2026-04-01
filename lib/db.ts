import { Pool } from 'pg';

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://admin:password123@localhost:5432/cs2market',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;

