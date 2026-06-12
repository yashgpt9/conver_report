const postgres = require('postgres');

const sql = postgres('postgresql://postgres.lptrdgitaebzexsamzsp:12081978%40Yash%40@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true', { ssl: 'require' });

async function run() {
  try {
    await sql`ALTER TABLE "Audit" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;`;
    console.log("Updated Audit table");
  } catch (e) {
    console.error("Audit error:", e);
  }
  
  try {
    await sql`ALTER TABLE "ActionPlanItem" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;`;
    console.log("Updated ActionPlanItem table");
  } catch (e) {
    console.error("ActionPlanItem error:", e);
  }

  process.exit(0);
}

run();
