import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all completed zones for the current month based on createdAt
    const result = await sql`
      SELECT "workZone" 
      FROM "Audit" 
      WHERE EXTRACT(MONTH FROM "createdAt") = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE)
    `;

    const completedZones = result.map(row => row.workZone);
    return NextResponse.json({ completedZones });
  } catch (e: any) {
    console.error("completed-zones error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
