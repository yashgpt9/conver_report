import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month'); // Expects "YYYY-MM"
    
    let result;
    if (month) {
      // Find audits where auditDate string starts with the provided YYYY-MM
      result = await sql`
        SELECT "workZone" 
        FROM "Audit" 
        WHERE "auditDate" LIKE ${month + '%'}
      `;
    } else {
      // Fallback to current month if no month param is provided
      const currentMonthStr = new Date().toISOString().substring(0, 7);
      result = await sql`
        SELECT "workZone" 
        FROM "Audit" 
        WHERE "auditDate" LIKE ${currentMonthStr + '%'}
      `;
    }

    const completedZones = result.map(row => row.workZone);
    return NextResponse.json({ completedZones });
  } catch (e: any) {
    console.error("completed-zones error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
