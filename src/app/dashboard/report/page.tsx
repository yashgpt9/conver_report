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
  
  let phaseTotals = {
    '1S': { sum: 0, count: 0 },
    '2S': { sum: 0, count: 0 },
    '3S': { sum: 0, count: 0 },
    '4S': { sum: 0, count: 0 },
    '5S': { sum: 0, count: 0 },
    '6S': { sum: 0, count: 0 }
  };

  if (totalAudits > 0) {
    const totalScoreSum = audits.reduce((acc, a) => acc + a.totalScore, 0);
    overallAverage = Math.round((totalScoreSum / (totalAudits * 100)) * 100); // percentage since max score is 100

    audits.forEach(a => {
      // 1S (q1-q5) Max 20
      const p1 = a.q1 + a.q2 + a.q3 + a.q4 + a.q5;
      phaseTotals['1S'].sum += p1;
      phaseTotals['1S'].count += 20;

      // 2S (q6-q9) Max 16
      const p2 = a.q6 + a.q7 + a.q8 + a.q9;
      phaseTotals['2S'].sum += p2;
      phaseTotals['2S'].count += 16;

      // 3S (q10-q14) Max 20
      const p3 = a.q10 + a.q11 + a.q12 + a.q13 + a.q14;
      phaseTotals['3S'].sum += p3;
      phaseTotals['3S'].count += 20;

      // 4S (q15-q18) Max 16
      const p4 = a.q15 + a.q16 + a.q17 + a.q18;
      phaseTotals['4S'].sum += p4;
      phaseTotals['4S'].count += 16;

      // 5S (q19-q22) Max 16
      const p5 = a.q19 + a.q20 + a.q21 + a.q22;
      phaseTotals['5S'].sum += p5;
      phaseTotals['5S'].count += 16;

      // 6S (q23-q25) Max 12
      const p6 = a.q23 + a.q24 + a.q25;
      phaseTotals['6S'].sum += p6;
      phaseTotals['6S'].count += 12;
    });
  }

  const getPhaseAvg = (key: keyof typeof phaseTotals) => {
    if (phaseTotals[key].count === 0) return 0;
    return Math.round((phaseTotals[key].sum / phaseTotals[key].count) * 100);
  };

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
              <div className="bg-slate-100 p-6 rounded-lg text-center border border-slate-300">
                <h2 className="text-xl font-bold text-slate-600 mb-2">Overall Plant Average</h2>
                <div className="text-6xl font-black text-blue-700">{overallAverage}%</div>
                <p className="text-sm text-slate-500 mt-2 font-bold">Based on {totalAudits} submitted audits</p>
              </div>

              {/* Phase Breakdown */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Phase Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.keys(phaseTotals).map(phase => {
                    const avg = getPhaseAvg(phase as keyof typeof phaseTotals);
                    return (
                      <div key={phase} className="border border-slate-200 p-4 rounded-lg bg-slate-50 flex flex-col items-center">
                        <span className="font-bold text-slate-500 mb-1">{phase} Average</span>
                        <span className={`text-3xl font-black ${avg >= 80 ? 'text-green-600' : avg >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {avg}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
