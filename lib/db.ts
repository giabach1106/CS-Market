import { Pool, PoolClient, QueryResult } from 'pg';

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://admin:password123@localhost:5432/cs2market',
});

// uses parameterized queries ($1, $2, etc.) to prevent sql injection
export const query = (text: string, params?: any[]): Promise<QueryResult> => 
  pool.query(text, params);

export type IsolationLevel = 
  | 'READ UNCOMMITTED' 
  | 'READ COMMITTED' 
  | 'REPEATABLE READ' 
  | 'SERIALIZABLE';

export interface TransactionOptions {
  isolationLevel?: IsolationLevel;
}

// wraps db operations in a transaction with automatic commit/rollback
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  const client = await pool.connect();
  
  try {
    // default: READ COMMITTED (only sees committed data, prevents dirty reads)
    const isolationLevel = options.isolationLevel || 'READ COMMITTED';
    await client.query('BEGIN');
    await client.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
    
    const result = await callback(client);
    
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const getClient = (): Promise<PoolClient> => pool.connect();

export default pool;

