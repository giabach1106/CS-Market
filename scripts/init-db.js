const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const connectionString =
  process.env.DATABASE_URL || 'postgres://admin:password123@localhost:5432/cs2market';

const pool = new Pool({ connectionString });

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
}

async function initDatabase() {
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');

  console.log('Initializing database schema...');
  await runSqlFile(schemaPath);

  console.log('Seeding database data...');
  await runSqlFile(seedPath);

  console.log('Database initialized successfully.');
}

initDatabase()
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
