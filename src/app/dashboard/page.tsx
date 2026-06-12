import sql from '@/lib/db';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import DeleteAuditButton from '@/components/DeleteAuditButton';
import DashboardFilters from '@/components/DashboardFilters';
import { getSession } from '@/lib/auth';
import { FIXED_ZONES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ month?: string, zone?: string }> }) {
  const session = await getSession();
  const userName = session?.user?.name || 'Supervisor';

  const { month, zone } = await searchParams;
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const selectedMonth = month || currentMonthStr; // "YYYY-MM"
  const selectedZone = zone || "ALL";

  let audits: any[] = [];
  try {
    if (selectedZone === "ALL") {
      audits = await sql`
        SELECT * FROM "Audit" 
        WHERE "auditDate" LIKE ${selectedMonth + '%'} 
        ORDER BY "auditDate" DESC, "createdAt" DESC
      `;
    } else {
      audits = await sql`
        SELECT * FROM "Audit" 
        WHERE "auditDate" LIKE ${selectedMonth + '%'} 
        AND "workZone" = ${selectedZone}
        ORDER BY "auditDate" DESC, "createdAt" DESC
      `;
    }
  } catch (e) {
    console.error("Failed to fetch audits", e);
  }

  // Calculate completed zones for the selected month to render the compliance tracker
  const completedZonesThisMonth = audits.map(a => a.workZone);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg">
                S
              </div>
              <span className="font-bold text-xl tracking-tight">Dashboard</span>
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Filters */}
        <DashboardFilters />
        
        {/* Compliance Tracker */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800">Monthly Zone Compliance</h2>
              <span className="text-sm font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                {selectedMonth}
              </span>
            </div>
            <Link href={`/dashboard/report?month=${selectedMonth}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-colors">
              View Plant Report &rarr;
            </Link>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {FIXED_ZONES.map(zone => {
                const isCompleted = completedZonesThisMonth.includes(zone);
                return (
                  <div key={zone} className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center gap-2 transition-colors ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <span className="font-bold text-sm">{zone}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      isCompleted ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                    }`}>
                      {isCompleted ? '✓ Completed' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800">Recent Audits</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Work Zone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Auditor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {audits.map((audit: any) => (
                  <tr key={audit.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{audit.auditDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{audit.workZone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{audit.auditorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">{audit.totalScore}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        audit.status === 'REVIEWED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <Link href={`/dashboard/${audit.id}`} className="text-blue-600 hover:text-blue-900 transition-colors">
                        Review & Print
                      </Link>
                      <DeleteAuditButton id={audit.id} zoneName={audit.workZone} />
                    </td>
                  </tr>
                ))}
                {audits.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                      No audits found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
