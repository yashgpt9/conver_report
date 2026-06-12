import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'SUPERVISOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const audits = await sql`
      SELECT * FROM "Audit" ORDER BY "createdAt" DESC
    `;
    return NextResponse.json({ audits });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();

    // Check if zone already has an audit this month based on the submitted auditDate
    const submittedMonth = data.auditDate.substring(0, 7); // YYYY-MM
    const existing = await sql`
      SELECT id FROM "Audit"
      WHERE "workZone" = ${data.workZone}
      AND "auditDate" LIKE ${submittedMonth + '%'}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: 'An audit for this zone has already been submitted this month. Please ask a supervisor to unlock it if you need to resubmit.' }, { status: 400 });
    }

    const result = await sql.begin(async (sql) => {
      const newId = crypto.randomUUID();

      const [newAudit] = await sql`
        INSERT INTO "Audit" (
          "id", "workZone", "auditDate", "zoneLeader", "auditorName",
          "q1", "q2", "q3", "q4", "q5",
          "q6", "q7", "q8", "q9", "q10",
          "q11", "q12", "q13", "q14", "q15",
          "q16", "q17", "q18", "q19", "q20",
          "q21", "q22", "q23", "q24", "q25",
          "totalScore", "status", "remarks"
        ) VALUES (
          ${newId}, ${data.workZone}, ${data.auditDate}, ${data.zoneLeader}, ${data.auditorName},
          ${data.scores[0]}, ${data.scores[1]}, ${data.scores[2]}, ${data.scores[3]}, ${data.scores[4]},
          ${data.scores[5]}, ${data.scores[6]}, ${data.scores[7]}, ${data.scores[8]}, ${data.scores[9]},
          ${data.scores[10]}, ${data.scores[11]}, ${data.scores[12]}, ${data.scores[13]}, ${data.scores[14]},
          ${data.scores[15]}, ${data.scores[16]}, ${data.scores[17]}, ${data.scores[18]}, ${data.scores[19]},
          ${data.scores[20]}, ${data.scores[21]}, ${data.scores[22]}, ${data.scores[23]}, ${data.scores[24]},
          ${data.totalScore}, 'SUBMITTED', ${JSON.stringify(data.remarks || [])}
        ) RETURNING id
      `;

      if (data.actionPlan && data.actionPlan.length > 0) {
        for (const ap of data.actionPlan) {
          const apId = crypto.randomUUID();
          await sql`
            INSERT INTO "ActionPlanItem" (
              "id", "auditId", "slNo", "nonConformance", "correction", "correctiveAction", "targetDate", "responsibility", "status"
            ) VALUES (
              ${apId}, ${newAudit.id}, ${ap.slNo}, ${ap.nonConformance}, ${ap.correction}, ${ap.correctiveAction}, ${ap.targetDate}, ${ap.responsibility}, ${ap.status}
            )
          `;
        }
      }

      return newAudit;
    });

    return NextResponse.json({ success: true, audit: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
