import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupPostgres = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL\n');

    console.log('📋 Running migration...');
    const migrationPath = path.join(__dirname, 'migrations', '001_create_ai_sourced_candidates.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(migrationSQL);
    console.log('✅ Migration completed successfully!\n');

    console.log('📊 Checking table...');
    const result = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'ai_sourced_candidates'
      ORDER BY ordinal_position
    `);
    
    console.log(`✅ Table created with ${result.rows.length} columns:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });

    console.log('\n✅ PostgreSQL setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update .env with PostgreSQL credentials');
    console.log('   2. Restart your backend server');
    console.log('   3. AI sourcing will now save to PostgreSQL');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 PostgreSQL is not running. Install and start it:');
      console.log('   - Download: https://www.postgresql.org/download/');
      console.log('   - Or use Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=yourpass postgres');
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
};

setupPostgres();
