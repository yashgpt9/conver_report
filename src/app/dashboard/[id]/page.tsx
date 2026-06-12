import sql from '@/lib/db';
import ReviewClient from './ReviewClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AuditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let audits: any[] = [];
  let actionPlans: any[] = [];
  try {
    audits = await sql`SELECT * FROM "Audit" WHERE id = ${id} LIMIT 1`;
    actionPlans = await sql`SELECT * FROM "ActionPlanItem" WHERE "auditId" = ${id}`;
  } catch (e) {
    console.error("DB error", e);
  }

  if (audits.length === 0) return notFound();

  const audit = audits[0];
  const fullAudit = { ...audit, actionPlanItems: actionPlans };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                ← Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <span className="font-bold text-lg tracking-tight">Audit Review</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0 print:max-w-none print:w-full">
        <ReviewClient audit={fullAudit} />
      </main>
    </div>
  );
}
