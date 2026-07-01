import pg from 'pg';
const { Pool } = pg;

let pool;

export const initPostgres = () => {
  if (pool) return pool;

  pool = new Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('❌ Unexpected PostgreSQL error:', err);
  });

  console.log('✅ PostgreSQL connection pool initialized');
  return pool;
};

export const getPool = () => {
  if (!pool) {
    throw new Error('PostgreSQL pool not initialized. Call initPostgres() first.');
  }
  return pool;
};

export const query = async (text, params) => {
  const start = Date.now();
  const res = await getPool().query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ PostgreSQL pool closed');
  }
};
