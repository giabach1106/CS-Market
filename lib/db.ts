import { Pool } from 'pg';

// Configuration based on your local Docker setup
const pool = new Pool({
  connectionString: 'postgres://admin:password123@localhost:5432/cs2market',
});

// Helper to query the DB directly
export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;

