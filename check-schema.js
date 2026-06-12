const postgres = require('postgres');

const sql = postgres('postgresql://postgres.lptrdgitaebzexsamzsp:12081978%40Yash%40@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true', { ssl: 'require' });

async function run() {
  try {
    const result = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Audit';
    `;
    console.log(result);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

run();
