import sql from '@/lib/db';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  const userName = session?.user?.name || 'Supervisor';

  let audits: any[] = [];
  try {
    audits = await sql`SELECT * FROM "Audit" ORDER BY "createdAt" DESC`;
  } catch (e) {
    console.error("Failed to fetch audits", e);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg">
                S
              </div>
              <span className="font-bold text-xl tracking-tight">Supervisor Dashboard</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-slate-400">Welcome, {userName}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
