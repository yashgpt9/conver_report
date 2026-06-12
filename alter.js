const postgres = require('postgres');

const sql = postgres('postgresql://postgres.lptrdgitaebzexsamzsp:12081978%40Yash%40@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true', { ssl: 'require' });

async function run() {
  try {
    await sql`ALTER TABLE "Audit" ADD COLUMN "remarks" JSONB DEFAULT '[]'::jsonb;`;
    console.log("Successfully added remarks column.");
  } catch (e) {
    console.error("Error (might already exist):", e);
  }
  process.exit(0);
}

run();
