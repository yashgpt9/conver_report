import postgres from 'postgres';

// By default we use process.env.DATABASE_URL
// We fix the @ symbol issue dynamically if it's there
let dbUrl = process.env.DATABASE_URL || '';

if (dbUrl.includes('12081978@Yash@')) {
  dbUrl = dbUrl.replace('12081978@Yash@', '12081978%40Yash%40');
}

// Initialize Postgres.js
const sql = postgres(dbUrl, {
  ssl: 'require',
  max: 10,
});

export default sql;
