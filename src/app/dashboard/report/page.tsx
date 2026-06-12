import sql from '@/lib/db';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

export default async function MonthlyReportPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const session = await getSession();
  if (!session || session.user.role !== 'SUPERVISOR') {
    return <div>Unauthorized</div>;
  }

  const { month } = await searchParams;
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const selectedMonth = month || currentMonthStr; // e.g., "2026-06"

  let audits: any[] = [];
  try {
    audits = await sql`
      SELECT * FROM "Audit" 
      WHERE "auditDate" LIKE ${selectedMonth + '%'}
    `;
  } catch (e) {
    console.error("Failed to fetch audits", e);
  }

  // Calculate Averages
  const totalAudits = audits.length;
  let overallAverage = 0;

  if (totalAudits > 0) {
    const totalScoreSum = audits.reduce((acc, a) => acc + a.totalScore, 0);
    overallAverage = Math.round((totalScoreSum / (totalAudits * 100)) * 100); // percentage since max score is 100
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center no-print">
          <Link href="/dashboard" className="text-blue-600 hover:underline font-bold">
            &larr; Back to Dashboard
          </Link>
          <PrintButton />
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200" id="report-content">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 uppercase">Monthly Plant 6S Report</h1>
            <p className="text-slate-500 font-bold mt-2 text-lg">Month: {selectedMonth}</p>
          </div>

          {totalAudits === 0 ? (
            <div className="text-center text-slate-500 py-12 font-bold text-xl">
              No audits submitted for this month yet.
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Overall */}
              <div className="bg-slate-100 p-6 rounded-lg text-center border border-slate-300 max-w-sm mx-auto">
                <h2 className="text-xl font-bold text-slate-600 mb-2">Overall Plant Average</h2>
                <div className="text-6xl font-black text-blue-700">{overallAverage}%</div>
                <p className="text-sm text-slate-500 mt-2 font-bold">Based on {totalAudits} submitted audits</p>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
