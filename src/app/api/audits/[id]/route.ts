import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'SUPERVISOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    
    await sql.begin(async sql => {
      await sql`DELETE FROM "ActionPlanItem" WHERE "auditId" = ${id}`;
      await sql`DELETE FROM "Audit" WHERE id = ${id}`;
    });
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'SUPERVISOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const { comments } = await req.json();

    await sql`
      UPDATE "Audit" 
      SET "reviewComment1" = ${comments[0]}, 
          "reviewComment2" = ${comments[1]}, 
          "reviewComment3" = ${comments[2]}, 
          "status" = 'REVIEWED',
          "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
