#!/usr/bin/env node

/**
 * Quick database migration script for ExpenseForge
 * Executes the SQL schema against Neon PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Read DATABASE_URL from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/DATABASE_URL=(.+)/);
const DATABASE_URL = match ? match[1].trim() : null;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('🚀 ExpenseForge Database Migration');
console.log('================================\n');

const client = new Client({
  connectionString: DATABASE_URL,
});

async function migrate() {
  try {
    console.log('🔌 Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Read schema
    const schemaPath = path.join(__dirname, 'packages/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📝 Executing schema...');
    await client.query(schema);
    console.log('✅ Schema executed!\n');

    // Verify tables
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  Warning: No tables found after migration');
    } else {
      console.log('📊 Created tables:');
      result.rows.forEach(row => {
        console.log(`   ✓ ${row.table_name}`);
      });
    }

    console.log('\n✨ Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Set up OAuth credentials in .env.local');
    console.log('   2. Run: pnpm dev:web (backend on localhost:3000)');
    console.log('   3. Run: pnpm dev:ios (iOS app dev server)');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nDebugging:');
    console.error('- Check DATABASE_URL is valid');
    console.error('- Verify SSL connection is allowed');
    console.error('- Check firewall/network access to Neon');
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();

